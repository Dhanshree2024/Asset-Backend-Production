"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto = __importStar(require("crypto"));
const typeorm_2 = require("typeorm");
const device_interface_1 = require("../interfaces/device.interface");
let AgentRepository = class AgentRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    hashKey(key) {
        return crypto.createHash('sha256').update(key).digest('hex');
    }
    async registerAgent(schema, input) {
        this.assertSchema(schema);
        const agentUuid = crypto.randomUUID();
        const agentKey = crypto.randomBytes(32).toString('hex');
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_agent
         (agent_uuid, hostname, ip, os, version, key_hash, registered_at, last_heartbeat)
       VALUES ($1, $2, $3::inet, $4, $5, $6, now(), now())
       RETURNING id`, [
            agentUuid,
            input.hostname ?? null,
            input.ip || null,
            input.os ?? null,
            input.version ?? null,
            this.hashKey(agentKey),
        ]);
        return { agentId: String(rows[0].id), agentUuid, agentKey };
    }
    async authenticateAgent(schema, agentUuid, agentKey) {
        this.assertSchema(schema);
        if (!agentUuid || !agentKey) {
            throw new common_1.UnauthorizedException('Missing x-agent-id / x-agent-key headers');
        }
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_agent WHERE agent_uuid = $1 AND revoked_at IS NULL`, [agentUuid]);
        if (!rows.length || rows[0].key_hash !== this.hashKey(agentKey)) {
            throw new common_1.UnauthorizedException('Invalid agent credentials');
        }
        return this.mapRow(rows[0]);
    }
    async heartbeat(schema, agentId, patch = {}) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_agent
       SET last_heartbeat = now(),
           ip = COALESCE($2::inet, ip),
           version = COALESCE($3, version)
       WHERE id = $1::bigint`, [agentId, patch.ip || null, patch.version ?? null]);
    }
    async linkDevice(schema, agentId, deviceId) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_agent SET device_id = $2::bigint WHERE id = $1::bigint`, [agentId, deviceId]);
    }
    async listAgents(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_agent
       WHERE revoked_at IS NULL
       ORDER BY last_heartbeat DESC NULLS LAST`);
        return rows.map((r) => this.mapRow(r));
    }
    async revokeAgent(schema, agentId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_agent SET revoked_at = now()
       WHERE id = $1::bigint AND revoked_at IS NULL
       RETURNING id`, [agentId]);
        return rows.length > 0;
    }
    async createJob(schema, agentId, type, payload = null, maxAttempts = 3, extra = {}) {
        this.assertSchema(schema);
        const preApproved = extra.approvedBy !== undefined && extra.approvedBy !== null;
        const status = extra.needsApproval && !preApproved ? 'pending_approval' : 'queued';
        const ttl = Math.max(Number(extra.ttlMinutes) || 60, 1);
        console.log('[AgentRepository] createJob inserting', { schema, agentId, type, status, scheduledFor: extra.scheduledFor ?? null, ttlMinutes: ttl });
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_remote_job
         (agent_id, device_id, target_label, type, payload, status, priority, attempt, max_attempts,
          requested_by, requested_by_name, needs_approval, scheduled_for, expires_at, created_at,
          approved_by, approved_by_name, approved_at)
       VALUES ($1::bigint, $2::bigint, $3, $4, $5::jsonb, $6, $7::int, 0, $8::int,
               $9, $10, $11::boolean, $12::timestamptz, COALESCE($12::timestamptz, now()) + ($13::int * interval '1 minute'), now(),
               $14::int, $15, CASE WHEN $16::boolean THEN now() ELSE NULL END)
       RETURNING *`, [
            agentId,
            extra.deviceId ?? null,
            extra.targetLabel ?? null,
            type,
            payload ? JSON.stringify(payload) : null,
            status,
            extra.priority ?? 5,
            maxAttempts,
            extra.requestedBy ?? null,
            extra.requestedByName ?? null,
            !!extra.needsApproval,
            extra.scheduledFor ?? null,
            ttl,
            preApproved ? extra.approvedBy : null,
            preApproved ? (extra.approvedByName ?? null) : null,
            preApproved,
        ]);
        const job = this.mapJobRow(rows[0]);
        console.log('[AgentRepository] createJob inserted', { schema, jobId: job.id, status: job.status, expiresAt: job.expiresAt });
        return job;
    }
    async getJob(schema, jobId) {
        this.assertSchema(schema);
        console.log('[AgentRepository] getJob query', { schema, jobId });
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_remote_job WHERE id = $1::bigint`, [jobId]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] getJob result', { schema, jobId, found: !!job, status: job?.status ?? null });
        return job;
    }
    async resolveAgentForDevice(schema, deviceId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT id FROM ${schema}.discovery_agent
       WHERE device_id = $1::bigint AND revoked_at IS NULL
       ORDER BY last_heartbeat DESC NULLS LAST LIMIT 1`, [deviceId]);
        return rows.length ? String(rows[0].id) : null;
    }
    async claimJobs(schema, agentId, max = 3) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job j
       SET status = 'claimed', claimed_at = now(), attempt = j.attempt + 1
       WHERE j.id IN (
         SELECT id FROM ${schema}.discovery_remote_job
         WHERE agent_id = $1::bigint AND status = 'queued'
           AND (scheduled_for IS NULL OR scheduled_for <= now())
           AND (expires_at IS NULL OR expires_at > now())
           -- per-device concurrency cap: one active job per device at a time.
           -- A job that was claimed but never reported (old agent build, agent
           -- crash) must not block the device for the whole 30-minute timeout
           -- window, otherwise every later job for that device expires while
           -- still 'queued' — so stale claims are ignored here.
           AND (device_id IS NULL OR NOT EXISTS (
                 SELECT 1 FROM ${schema}.discovery_remote_job a
                 WHERE a.device_id = discovery_remote_job.device_id
                   AND a.id <> discovery_remote_job.id
                   AND a.status IN ('claimed','running')
                   AND COALESCE(a.progress_at, a.claimed_at, a.created_at) > now() - interval '10 minutes'))
         ORDER BY priority ASC, created_at ASC
         LIMIT $2::int
         FOR UPDATE SKIP LOCKED
       )
       RETURNING j.*`, [agentId, max]);
        const jobs = rows.map((r) => this.mapJobRow(r));
        if (jobs.length)
            console.log('[AgentRepository] JOB CLAIMED', {
                schema,
                agentId,
                jobs: jobs.map((job) => ({ jobId: job.id, type: job.type, status: job.status })),
            });
        return jobs;
    }
    async updateProgress(schema, agentId, jobId, progress) {
        this.assertSchema(schema);
        console.log('[AgentRepository] updateProgress requested', { schema, agentId, jobId });
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET status = 'running', started_at = COALESCE(started_at, now()),
           progress = $3::jsonb, progress_at = now()
       WHERE id = $1::bigint AND agent_id = $2::bigint AND status IN ('claimed','running')
       RETURNING *`, [jobId, agentId, progress ? JSON.stringify(progress) : null]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] updateProgress result', { schema, jobId, found: !!job, status: job?.status ?? null });
        return job;
    }
    async completeJob(schema, agentId, jobId, outcome) {
        this.assertSchema(schema);
        console.log('[AgentRepository] completeJob requested', { schema, agentId, jobId, reportedStatus: outcome.status });
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET status = CASE WHEN $3 = 'failed' AND attempt < max_attempts THEN 'queued' ELSE $3 END,
           scheduled_for = CASE WHEN $3 = 'failed' AND attempt < max_attempts
                                THEN now() + (attempt * interval '2 minutes') ELSE scheduled_for END,
           result = $4::jsonb, error = $5, exit_code = $6, log_ref = $7,
           finished_at = CASE WHEN $3 = 'failed' AND attempt < max_attempts THEN NULL ELSE now() END
       WHERE id = $1::bigint AND agent_id = $2::bigint AND status IN ('claimed', 'running')
       RETURNING *`, [
            jobId,
            agentId,
            outcome.status,
            outcome.result ? JSON.stringify(outcome.result) : null,
            outcome.error ?? null,
            outcome.exitCode ?? null,
            outcome.logRef ?? null,
        ]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] completeJob result', { schema, jobId, found: !!job, status: job?.status ?? null, attempt: job?.attempt, expiresAt: job?.expiresAt });
        return job;
    }
    async approveJob(schema, jobId, approver, opts = {}) {
        this.assertSchema(schema);
        console.log('[AgentRepository] approveJob requested', { schema, jobId, approverUserId: approver.userId, dispatchNow: !!opts.dispatchNow });
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET status = 'queued', approved_by = $2, approved_by_name = $3, approved_at = now(),
           scheduled_for = CASE WHEN $4::boolean THEN NULL ELSE scheduled_for END,
           expires_at = CASE WHEN $4::boolean THEN GREATEST(expires_at, now() + interval '60 minutes') ELSE expires_at END
       WHERE id = $1::bigint AND status = 'pending_approval'
       RETURNING *`, [jobId, approver.userId, approver.name, !!opts.dispatchNow]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] approveJob result', { schema, jobId, found: !!job, status: job?.status ?? null, expiresAt: job?.expiresAt });
        return job;
    }
    async rejectJob(schema, jobId, decider, reason) {
        this.assertSchema(schema);
        console.log('[AgentRepository] rejectJob requested', { schema, jobId, deciderUserId: decider.userId });
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET status = 'rejected', approved_by = $2, approved_by_name = $3, rejected_reason = $4, finished_at = now()
       WHERE id = $1::bigint AND status = 'pending_approval'
       RETURNING *`, [jobId, decider.userId, decider.name, reason]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] rejectJob result', { schema, jobId, found: !!job, status: job?.status ?? null });
        return job;
    }
    async cancelJob(schema, jobId, userId, reason) {
        this.assertSchema(schema);
        console.log('[AgentRepository] cancelJob requested', { schema, jobId, userId });
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET status = 'cancelled', cancelled_at = now(), cancelled_by = $2, cancel_reason = $3, finished_at = now()
       WHERE id = $1::bigint AND status IN ('pending_approval','queued','claimed','running')
       RETURNING *`, [jobId, userId, reason]);
        const job = rows.length ? this.mapJobRow(rows[0]) : null;
        console.log('[AgentRepository] cancelJob result', { schema, jobId, found: !!job, status: job?.status ?? null });
        return job;
    }
    async expireStaleJobs(schema) {
        this.assertSchema(schema);
        console.log('[AgentRepository] expireStaleJobs check', { schema });
        const expired = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job SET status = 'expired', finished_at = now()
       WHERE status IN ('pending_approval','queued') AND expires_at IS NOT NULL AND expires_at < now()
       RETURNING id`);
        const timedOut = await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job SET status = 'timed_out', finished_at = now(),
              error = COALESCE(error, 'No progress from agent for 30 minutes')
       WHERE status IN ('claimed','running')
         AND COALESCE(progress_at, claimed_at, created_at) < now() - interval '30 minutes'
       RETURNING id`);
        const counts = { expired: expired.length, timedOut: timedOut.length };
        if (counts.expired || counts.timedOut)
            console.log('[AgentRepository] expireStaleJobs updated', { schema, ...counts, expiredJobIds: expired.map((row) => String(row.id)), timedOutJobIds: timedOut.map((row) => String(row.id)) });
        return counts;
    }
    async annotateJob(schema, jobId, note) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_remote_job
       SET error = CASE WHEN error IS NULL OR error = '' THEN $2 ELSE error || ' | ' || $2 END
       WHERE id = $1::bigint`, [jobId, note.slice(0, 1000)]);
    }
    async pruneTerminalJobs(schema, days) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_remote_job
       WHERE status IN ('succeeded','failed','timed_out','cancelled','expired','rejected')
         AND COALESCE(finished_at, created_at) < now() - ($1::int * interval '1 day')
       RETURNING id`, [Math.max(Number(days) || 90, 1)]);
        return rows.length;
    }
    async listJobs(schema, agentId, limit = 100) {
        const { rows } = await this.listJobsFiltered(schema, { agentId, limit });
        return rows;
    }
    async listJobsFiltered(schema, f = {}) {
        this.assertSchema(schema);
        console.log('[AgentRepository] listJobsFiltered query', { schema, filters: f });
        const clauses = [];
        const params = [];
        const push = (v) => {
            params.push(v);
            return `$${params.length}`;
        };
        if (f.status)
            clauses.push(`status = ${push(f.status)}`);
        if (f.type)
            clauses.push(`type = ${push(f.type.toUpperCase())}`);
        if (f.deviceId)
            clauses.push(`device_id = ${push(f.deviceId)}::bigint`);
        if (f.agentId)
            clauses.push(`agent_id = ${push(f.agentId)}::bigint`);
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const limit = Math.min(Math.max(Number(f.limit) || 100, 1), 1000);
        const offset = Math.max(Number(f.offset) || 0, 0);
        const count = await this.dataSource.query(`SELECT count(*)::int AS c FROM ${schema}.discovery_remote_job ${where}`, params);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_remote_job ${where}
       ORDER BY created_at DESC LIMIT ${push(limit)}::int OFFSET ${push(offset)}::int`, params);
        const result = {
            rows: rows.map((r) => this.mapJobRow(r)),
            total: count[0]?.c ?? 0,
        };
        console.log('[AgentRepository] listJobsFiltered result', { schema, total: result.total, returned: result.rows.length, statuses: result.rows.map((job) => ({ id: job.id, status: job.status })) });
        return result;
    }
    mapRow(row) {
        const last = row.last_heartbeat ? new Date(row.last_heartbeat) : null;
        const online = !!last && Date.now() - last.getTime() < device_interface_1.AGENT_OFFLINE_AFTER_MS;
        return {
            id: String(row.id),
            agentUuid: row.agent_uuid,
            hostname: row.hostname ?? null,
            ip: row.ip ?? null,
            os: row.os ?? null,
            version: row.version ?? null,
            deviceId: row.device_id !== null && row.device_id !== undefined
                ? String(row.device_id)
                : null,
            status: online ? 'online' : 'offline',
            lastHeartbeat: last ? last.toISOString() : null,
            registeredAt: row.registered_at
                ? new Date(row.registered_at).toISOString()
                : '',
        };
    }
    mapJobRow(row) {
        const iso = (v) => (v ? new Date(v).toISOString() : null);
        const num = (v) => (v === null || v === undefined ? null : Number(v));
        return {
            id: String(row.id),
            agentId: String(row.agent_id),
            type: row.type,
            payload: row.payload ?? null,
            status: row.status,
            attempt: Number(row.attempt ?? 0),
            maxAttempts: Number(row.max_attempts ?? 3),
            result: row.result ?? null,
            error: row.error ?? null,
            createdAt: iso(row.created_at) ?? '',
            claimedAt: iso(row.claimed_at),
            finishedAt: iso(row.finished_at),
            deviceId: row.device_id === null || row.device_id === undefined
                ? null
                : String(row.device_id),
            targetLabel: row.target_label ?? null,
            priority: Number(row.priority ?? 5),
            requestedBy: num(row.requested_by),
            requestedByName: row.requested_by_name ?? null,
            needsApproval: !!row.needs_approval,
            approvedBy: num(row.approved_by),
            approvedByName: row.approved_by_name ?? null,
            approvedAt: iso(row.approved_at),
            rejectedReason: row.rejected_reason ?? null,
            scheduledFor: iso(row.scheduled_for),
            startedAt: iso(row.started_at),
            progress: row.progress ?? null,
            progressAt: iso(row.progress_at),
            exitCode: num(row.exit_code),
            logRef: row.log_ref ?? null,
            expiresAt: iso(row.expires_at),
            cancelledAt: iso(row.cancelled_at),
            cancelledBy: num(row.cancelled_by),
            cancelReason: row.cancel_reason ?? null,
        };
    }
};
exports.AgentRepository = AgentRepository;
exports.AgentRepository = AgentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AgentRepository);
