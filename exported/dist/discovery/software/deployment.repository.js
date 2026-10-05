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
var DeploymentRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DeploymentRepository = DeploymentRepository_1 = class DeploymentRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    iso(v) { return v ? new Date(v).toISOString() : null; }
    mapDeployment(r) {
        return {
            id: String(r.id), name: r.name, packageId: String(r.package_id), packageName: r.package_name ?? undefined, packageVersion: r.package_version ?? undefined,
            action: r.action, targetSelector: r.target_selector ?? {}, rings: Array.isArray(r.rings) ? r.rings.map((ring) => ring.map(String)) : [],
            ringThreshold: Number(r.ring_threshold ?? 100), currentRing: Number(r.current_ring ?? 0), rebootPolicy: r.reboot_policy, retryCount: Number(r.retry_count ?? 1),
            status: r.status, requestedBy: r.requested_by ?? null, requestedByName: r.requested_by_name ?? null, approvedBy: r.approved_by ?? null,
            approvedByName: r.approved_by_name ?? null, approvedAt: this.iso(r.approved_at), rejectedReason: r.rejected_reason ?? null,
            startedAt: this.iso(r.started_at), finishedAt: this.iso(r.finished_at), createdAt: this.iso(r.created_at), updatedAt: this.iso(r.updated_at),
            counts: r.counts ?? undefined,
        };
    }
    mapDevice(r) {
        return {
            id: String(r.id), deploymentId: String(r.deployment_id), deviceId: String(r.device_id), hostname: r.hostname ?? null, ip: r.ip ?? null,
            ring: Number(r.ring ?? 0), jobId: r.job_id != null ? String(r.job_id) : null, status: r.status, attempts: Number(r.attempts ?? 0),
            exitCode: r.exit_code ?? null, detected: r.detected ?? null, installLog: r.install_log ?? null, error: r.error ?? null,
            startedAt: this.iso(r.started_at), finishedAt: this.iso(r.finished_at), updatedAt: this.iso(r.updated_at),
        };
    }
    static BASE_SELECT(schema) {
        return `SELECT d.*, p.name AS package_name, p.version AS package_version,
                   (SELECT jsonb_build_object(
                        'total', count(*),
                        'pending', count(*) FILTER (WHERE status='pending'), 'queued', count(*) FILTER (WHERE status='queued'),
                        'downloading', count(*) FILTER (WHERE status='downloading'), 'installing', count(*) FILTER (WHERE status='installing'),
                        'succeeded', count(*) FILTER (WHERE status='succeeded'), 'failed', count(*) FILTER (WHERE status='failed'),
                        'needs_reboot', count(*) FILTER (WHERE status='needs_reboot'), 'skipped', count(*) FILTER (WHERE status='skipped'),
                        'cancelled', count(*) FILTER (WHERE status='cancelled'))
                      FROM ${schema}.discovery_deployment_device dd WHERE dd.deployment_id = d.id) AS counts
            FROM ${schema}.discovery_deployment d
            JOIN ${schema}.discovery_software_package p ON p.id = d.package_id`;
    }
    async insert(schema, input) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_deployment
         (name, package_id, action, target_selector, rings, ring_threshold, reboot_policy, retry_count, requested_by, requested_by_name)
       VALUES ($1, $2::bigint, $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9, $10) RETURNING id`, [input.name, input.packageId, input.action, JSON.stringify(input.targetSelector ?? {}), JSON.stringify(input.rings), input.ringThreshold,
            input.rebootPolicy, input.retryCount, input.requestedBy, input.requestedByName]);
        return (await this.get(schema, String(rows[0].id)));
    }
    async insertDevices(schema, deploymentId, rings) {
        this.assertSchema(schema);
        const values = [];
        const tuples = [];
        rings.forEach((ring, idx) => ring.forEach((deviceId) => { values.push(deploymentId, deviceId, idx); tuples.push(`($${values.length - 2}::bigint, $${values.length - 1}::bigint, $${values.length})`); }));
        if (!tuples.length)
            return;
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_deployment_device (deployment_id, device_id, ring) VALUES ${tuples.join(', ')} ON CONFLICT (deployment_id, device_id) DO NOTHING`, values);
    }
    async list(schema, opts = {}) {
        this.assertSchema(schema);
        const params = [];
        const clauses = [];
        if (opts.status) {
            params.push(opts.status);
            clauses.push(`d.status = $${params.length}`);
        }
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const limit = Math.min(Math.max(Number(opts.limit) || 50, 1), 500);
        const offset = Math.max(Number(opts.offset) || 0, 0);
        const rows = await this.dataSource.query(`${DeploymentRepository_1.BASE_SELECT(schema)} ${where} ORDER BY d.created_at DESC LIMIT ${limit} OFFSET ${offset}`, params);
        const cnt = await this.dataSource.query(`SELECT count(*)::int AS n FROM ${schema}.discovery_deployment d ${where}`, params);
        return { deployments: rows.map((r) => this.mapDeployment(r)), total: cnt[0]?.n ?? 0 };
    }
    async get(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`${DeploymentRepository_1.BASE_SELECT(schema)} WHERE d.id = $1::bigint`, [id]);
        return rows.length ? this.mapDeployment(rows[0]) : null;
    }
    async devices(schema, deploymentId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT dd.*, dev.hostname, host(dev.ip) AS ip FROM ${schema}.discovery_deployment_device dd
         LEFT JOIN ${schema}.discovery_device dev ON dev.id = dd.device_id
        WHERE dd.deployment_id = $1::bigint ORDER BY dd.ring, dev.hostname NULLS LAST, dd.id`, [deploymentId]);
        return rows.map((r) => this.mapDevice(r));
    }
    async setStatus(schema, id, status, extra = {}) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_deployment SET status = $2,
              approved_by = COALESCE($3, approved_by), approved_by_name = COALESCE($4, approved_by_name),
              approved_at = CASE WHEN $2 = 'approved' THEN now() ELSE approved_at END,
              rejected_reason = COALESCE($5, rejected_reason),
              current_ring = COALESCE($6, current_ring),
              started_at = CASE WHEN $7::boolean AND started_at IS NULL THEN now() ELSE started_at END,
              finished_at = CASE WHEN $8::boolean THEN now() ELSE finished_at END,
              updated_at = now()
        WHERE id = $1::bigint`, [id, status, extra.approvedBy ?? null, extra.approvedByName ?? null, extra.rejectedReason ?? null, extra.currentRing ?? null, !!extra.started, !!extra.finished]);
        return this.get(schema, id);
    }
    async setDevice(schema, deploymentId, deviceId, patch) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_deployment_device SET
          status = COALESCE($3, status), job_id = CASE WHEN $4::text IS NOT NULL THEN $4::bigint ELSE job_id END,
          attempts = attempts + COALESCE($5, 0), exit_code = COALESCE($6, exit_code), detected = COALESCE($7, detected),
          install_log = COALESCE($8, install_log), error = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE error END,
          started_at = CASE WHEN $10::boolean AND started_at IS NULL THEN now() ELSE started_at END,
          finished_at = CASE WHEN $11::boolean THEN now() ELSE finished_at END, updated_at = now()
        WHERE deployment_id = $1::bigint AND device_id = $2::bigint`, [deploymentId, deviceId, patch.status ?? null, patch.jobId ?? null, patch.attemptsIncrement ?? 0, patch.exitCode ?? null, patch.detected ?? null,
            patch.installLog ?? null, patch.error ?? null, !!patch.started, !!patch.finished]);
    }
    async deviceByJob(schema, jobId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT deployment_id, device_id FROM ${schema}.discovery_deployment_device WHERE job_id = $1::bigint LIMIT 1`, [jobId]);
        return rows.length ? { deploymentId: String(rows[0].deployment_id), deviceId: String(rows[0].device_id) } : null;
    }
    async ringRows(schema, deploymentId, ring) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT dd.*, NULL AS hostname, NULL AS ip FROM ${schema}.discovery_deployment_device dd WHERE deployment_id = $1::bigint AND ring = $2`, [deploymentId, ring]);
        return rows.map((r) => this.mapDevice(r));
    }
    async activeDeployments(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`${DeploymentRepository_1.BASE_SELECT(schema)} WHERE d.status = 'running' ORDER BY d.id`);
        return rows.map((r) => this.mapDeployment(r));
    }
    async cancelPendingDevices(schema, deploymentId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_deployment_device SET status = 'cancelled', finished_at = now(), updated_at = now()
        WHERE deployment_id = $1::bigint AND status IN ('pending','queued') RETURNING job_id`, [deploymentId]);
        return rows.map((r) => r.job_id).filter((x) => x != null).map(String);
    }
};
exports.DeploymentRepository = DeploymentRepository;
exports.DeploymentRepository = DeploymentRepository = DeploymentRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DeploymentRepository);
