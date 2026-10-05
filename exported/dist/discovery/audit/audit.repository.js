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
exports.AuditRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_util_1 = require("./audit.util");
let AuditRepository = class AuditRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async insert(schema, actor, entry) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_audit_log
         (actor_user_id, actor_name, actor_ip, action, target_type, target_id, target_label,
          params_redacted, result, error, request_id, job_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, now())
       RETURNING *`, [
            actor.userId,
            actor.name,
            actor.ip,
            entry.action,
            entry.targetType ?? null,
            entry.targetId === null || entry.targetId === undefined ? null : String(entry.targetId),
            entry.targetLabel ?? null,
            JSON.stringify((0, audit_util_1.redactParams)(entry.params ?? null)),
            entry.result ?? 'ok',
            entry.error ?? null,
            actor.requestId,
            entry.jobId === null || entry.jobId === undefined ? null : Number(entry.jobId),
        ]);
        return this.map(rows[0]);
    }
    async list(schema, f = {}) {
        this.assertSchema(schema);
        const clauses = [];
        const params = [];
        const push = (v) => {
            params.push(v);
            return `$${params.length}`;
        };
        if (f.action)
            clauses.push(`action ILIKE ${push(`%${f.action}%`)}`);
        if (f.actorUserId !== undefined && f.actorUserId !== null && !isNaN(Number(f.actorUserId)))
            clauses.push(`actor_user_id = ${push(Number(f.actorUserId))}`);
        if (f.targetType)
            clauses.push(`target_type = ${push(f.targetType)}`);
        if (f.targetId)
            clauses.push(`target_id = ${push(String(f.targetId))}`);
        if (f.from)
            clauses.push(`created_at >= ${push(f.from)}::timestamptz`);
        if (f.to)
            clauses.push(`created_at <= ${push(f.to)}::timestamptz`);
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const limit = Math.min(Math.max(Number(f.limit) || 100, 1), 1000);
        const offset = Math.max(Number(f.offset) || 0, 0);
        const countRows = await this.dataSource.query(`SELECT count(*)::int AS c FROM ${schema}.discovery_audit_log ${where}`, params);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_audit_log ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT ${push(limit)}::int OFFSET ${push(offset)}::int`, params);
        return { rows: rows.map((r) => this.map(r)), total: countRows[0]?.c ?? 0 };
    }
    map(r) {
        return {
            id: String(r.id),
            actorUserId: r.actor_user_id === null ? null : Number(r.actor_user_id),
            actorName: r.actor_name ?? null,
            actorIp: r.actor_ip ?? null,
            action: r.action,
            targetType: r.target_type ?? null,
            targetId: r.target_id ?? null,
            targetLabel: r.target_label ?? null,
            paramsRedacted: r.params_redacted ?? null,
            result: r.result,
            error: r.error ?? null,
            requestId: r.request_id ?? null,
            jobId: r.job_id === null || r.job_id === undefined ? null : String(r.job_id),
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
        };
    }
};
exports.AuditRepository = AuditRepository;
exports.AuditRepository = AuditRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AuditRepository);
