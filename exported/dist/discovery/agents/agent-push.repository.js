"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPushRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AgentPushRepository = class AgentPushRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!/^org_[A-Za-z0-9_]+$/.test(schema))
            throw new Error(`Invalid schema '${schema}'`);
    }
    map(r) {
        const ts = (v) => (v ? new Date(v).toISOString() : null);
        return {
            id: String(r.id), target: r.target, targetHostname: r.target_hostname ?? null,
            deviceId: r.device_id === null || r.device_id === undefined ? null : String(r.device_id),
            adComputerId: r.ad_computer_id === null || r.ad_computer_id === undefined ? null : String(r.ad_computer_id),
            relayAgentId: String(r.relay_agent_id), relayHostname: r.relay_hostname ?? null,
            credentialId: r.credential_id === null || r.credential_id === undefined ? null : String(r.credential_id), credentialName: r.credential_name ?? null,
            packageId: r.package_id === null || r.package_id === undefined ? null : String(r.package_id), packageVersion: r.package_version ?? null,
            jobId: r.job_id === null || r.job_id === undefined ? null : String(r.job_id),
            status: r.status, method: r.method ?? null, exitCode: r.exit_code ?? null, log: r.log ?? null, error: r.error ?? null,
            newAgentId: r.new_agent_id === null || r.new_agent_id === undefined ? null : String(r.new_agent_id),
            requestedBy: r.requested_by ?? null, requestedByName: r.requested_by_name ?? null,
            createdAt: ts(r.created_at), updatedAt: ts(r.updated_at), finishedAt: ts(r.finished_at),
        };
    }
    async insert(schema, input) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_agent_push
         (target, target_hostname, device_id, ad_computer_id, relay_agent_id, relay_hostname, credential_id, credential_name,
          package_id, package_version, requested_by, requested_by_name)
       VALUES ($1, $2, $3::bigint, $4::bigint, $5::bigint, $6, $7::bigint, $8, $9::bigint, $10, $11, $12)
       RETURNING *`, [input.target, input.targetHostname, input.deviceId, input.adComputerId, input.relayAgentId, input.relayHostname, input.credentialId,
            input.credentialName, input.packageId, input.packageVersion, input.requestedBy, input.requestedByName]);
        return this.map(rows[0]);
    }
    async list(schema, opts = {}) {
        this.assertSchema(schema);
        const params = [];
        const clauses = [];
        if (opts.status) {
            params.push(opts.status);
            clauses.push(`status = $${params.length}`);
        }
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const limit = Math.min(Math.max(Number(opts.limit) || 200, 1), 1000);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_agent_push ${where} ORDER BY created_at DESC LIMIT ${limit}`, params);
        return rows.map((r) => this.map(r));
    }
    async get(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_agent_push WHERE id = $1::bigint`, [id]);
        return rows.length ? this.map(rows[0]) : null;
    }
    async byJob(schema, jobId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_agent_push WHERE job_id = $1::bigint ORDER BY id DESC LIMIT 1`, [jobId]);
        return rows.length ? this.map(rows[0]) : null;
    }
    async setJob(schema, id, jobId, status) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_agent_push SET job_id = $2::bigint, status = $3, updated_at = now() WHERE id = $1::bigint`, [id, jobId, status]);
    }
    async update(schema, id, patch) {
        this.assertSchema(schema);
        const sets = [];
        const params = [id];
        const set = (col, v, cast = '') => { params.push(v); sets.push(`${col} = $${params.length}${cast}`); };
        if (patch.status !== undefined)
            set('status', patch.status);
        if (patch.method !== undefined)
            set('method', patch.method);
        if (patch.exitCode !== undefined)
            set('exit_code', patch.exitCode);
        if (patch.log !== undefined)
            set('log', patch.log);
        if (patch.error !== undefined)
            set('error', patch.error);
        if (patch.targetHostname !== undefined)
            set('target_hostname', patch.targetHostname);
        if (patch.newAgentId !== undefined)
            set('new_agent_id', patch.newAgentId, '::bigint');
        if (patch.finished)
            sets.push('finished_at = now()');
        if (!sets.length)
            return;
        await this.dataSource.query(`UPDATE ${schema}.discovery_agent_push SET ${sets.join(', ')}, updated_at = now() WHERE id = $1::bigint`, params);
    }
    async markRegistered(schema, hostname, newAgentId) {
        this.assertSchema(schema);
        const short = hostname.split('.')[0].toLowerCase();
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_agent_push
          SET status = 'registered', new_agent_id = $2::bigint, finished_at = now(), updated_at = now()
        WHERE status IN ('installed', 'running', 'queued')
          AND (lower(target_hostname) = $1 OR lower(split_part(target, '.', 1)) = $1)
          AND created_at > now() - interval '2 days'
        RETURNING id`, [short, newAgentId]);
        return rows.length;
    }
    async candidateDevices(schema, search) {
        this.assertSchema(schema);
        const params = [];
        let extra = '';
        if (search?.trim()) {
            params.push(`%${search.trim()}%`);
            extra = `AND (d.hostname ILIKE $${params.length} OR host(d.ip) ILIKE $${params.length} OR d.os ILIKE $${params.length})`;
        }
        const rows = await this.dataSource.query(`SELECT d.id, d.hostname, host(d.ip) AS ip, d.os, d.category, d.last_seen
         FROM ${schema}.discovery_device d
        WHERE NOT EXISTS (SELECT 1 FROM ${schema}.discovery_agent a WHERE a.device_id = d.id AND a.revoked_at IS NULL)
          AND (d.os ILIKE '%windows%' OR d.category IN ('windows-host', 'laptop', 'desktop', 'server', 'virtual-machine'))
          ${extra}
        ORDER BY d.hostname NULLS LAST, d.ip LIMIT 500`, params);
        return rows.map((r) => ({ id: String(r.id), hostname: r.hostname ?? null, ip: r.ip, os: r.os ?? null, category: r.category, lastSeen: r.last_seen ? new Date(r.last_seen).toISOString() : null, source: 'device' }));
    }
    async candidateAdComputers(schema, search) {
        this.assertSchema(schema);
        const exists = await this.dataSource.query(`SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = $1 AND c.relname = 'discovery_ad_computer'`, [schema]);
        if (!exists.length)
            return [];
        const params = [];
        let extra = '';
        if (search?.trim()) {
            params.push(`%${search.trim()}%`);
            extra = `AND (c.sam_account_name ILIKE $${params.length} OR c.dns_host_name ILIKE $${params.length} OR c.operating_system ILIKE $${params.length})`;
        }
        const rows = await this.dataSource.query(`SELECT c.id, c.sam_account_name, c.dns_host_name, c.operating_system, c.device_id, host(d.ip) AS device_ip, c.last_logon_at
         FROM ${schema}.discovery_ad_computer c
         LEFT JOIN ${schema}.discovery_device d ON d.id = c.device_id
        WHERE c.enabled IS DISTINCT FROM false
          AND NOT EXISTS (SELECT 1 FROM ${schema}.discovery_agent a WHERE a.revoked_at IS NULL AND (a.device_id = c.device_id OR lower(split_part(a.hostname, '.', 1)) = lower(regexp_replace(c.sam_account_name, '\\$$', ''))))
          ${extra}
        ORDER BY lower(c.sam_account_name) LIMIT 500`, params);
        return rows.map((r) => ({
            id: String(r.id), name: String(r.sam_account_name ?? '').replace(/\$$/, ''), dnsHostName: r.dns_host_name ?? null, os: r.operating_system ?? null,
            deviceId: r.device_id === null || r.device_id === undefined ? null : String(r.device_id), deviceIp: r.device_ip ?? null,
            lastLogonAt: r.last_logon_at ? new Date(r.last_logon_at).toISOString() : null, source: 'ad',
        }));
    }
    async cancelOpen(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_agent_push SET status = 'cancelled', finished_at = now(), updated_at = now()
        WHERE id = $1::bigint AND status IN ('pending_approval', 'queued') RETURNING *`, [id]);
        return rows.length ? this.map(rows[0]) : null;
    }
};
exports.AgentPushRepository = AgentPushRepository;
exports.AgentPushRepository = AgentPushRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AgentPushRepository);
