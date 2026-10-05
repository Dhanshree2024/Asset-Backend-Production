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
exports.ComplianceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ComplianceRepository = class ComplianceRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    iso(v) { return v ? new Date(v).toISOString() : null; }
    mapPolicy(r) {
        return {
            id: String(r.id), name: r.name, description: r.description ?? null, enabled: !!r.enabled, scopeSelector: r.scope_selector ?? {},
            ruleType: r.rule_type, appNameMatch: r.app_name_match, publisherMatch: r.publisher_match ?? null, versionValue: r.version_value ?? null,
            severity: r.severity, remediationAction: r.remediation_action, remediationPackageId: r.remediation_package_id != null ? String(r.remediation_package_id) : null,
            requiresApproval: !!r.requires_approval, createdBy: r.created_by ?? null, createdByName: r.created_by_name ?? null,
            createdAt: this.iso(r.created_at), updatedAt: this.iso(r.updated_at), openFindings: r.open_findings != null ? Number(r.open_findings) : undefined,
        };
    }
    mapFinding(r) {
        return {
            id: String(r.id), policyId: String(r.policy_id), policyName: r.policy_name ?? undefined, ruleType: r.rule_type ?? undefined, severity: r.severity ?? undefined,
            deviceId: String(r.device_id), hostname: r.hostname ?? null, ip: r.ip ?? null, softwareName: r.software_name ?? null, detectedVersion: r.detected_version ?? null,
            detail: r.detail ?? null, status: r.status, remediationJobId: r.remediation_job_id != null ? String(r.remediation_job_id) : null,
            waiverReason: r.waiver_reason ?? null, waivedBy: r.waived_by ?? null, waivedByName: r.waived_by_name ?? null, waivedUntil: this.iso(r.waived_until),
            firstDetected: this.iso(r.first_detected), lastEvaluated: this.iso(r.last_evaluated), resolvedAt: this.iso(r.resolved_at),
        };
    }
    async listPolicies(schema, onlyEnabled = false) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT p.*, (SELECT count(*) FROM ${schema}.discovery_compliance_finding f WHERE f.policy_id = p.id AND f.status IN ('open','approved','remediating')) AS open_findings
         FROM ${schema}.discovery_compliance_policy p ${onlyEnabled ? 'WHERE p.enabled' : ''} ORDER BY p.severity DESC, lower(p.name)`);
        return rows.map((r) => this.mapPolicy(r));
    }
    async getPolicy(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_compliance_policy WHERE id = $1::bigint`, [id]);
        return rows.length ? this.mapPolicy(rows[0]) : null;
    }
    async insertPolicy(schema, p, actor) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_compliance_policy
         (name, description, enabled, scope_selector, rule_type, app_name_match, publisher_match, version_value, severity, remediation_action, remediation_package_id, requires_approval, created_by, created_by_name)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11::bigint,$12,$13,$14) RETURNING *`, [p.name.trim(), p.description ?? null, p.enabled ?? true, JSON.stringify(p.scopeSelector ?? {}), p.ruleType, p.appNameMatch.trim(), p.publisherMatch ?? null,
            p.versionValue ?? null, p.severity ?? 'medium', p.remediationAction ?? 'alert', p.remediationPackageId ?? null, p.requiresApproval ?? true, actor.userId, actor.name]);
        return this.mapPolicy(rows[0]);
    }
    async updatePolicy(schema, id, p) {
        this.assertSchema(schema);
        const sets = [];
        const params = [];
        const set = (col, v, cast = '') => { params.push(v); sets.push(`${col} = $${params.length}${cast}`); };
        if (p.name !== undefined)
            set('name', p.name.trim());
        if (p.description !== undefined)
            set('description', p.description);
        if (p.enabled !== undefined)
            set('enabled', !!p.enabled);
        if (p.scopeSelector !== undefined)
            set('scope_selector', JSON.stringify(p.scopeSelector ?? {}), '::jsonb');
        if (p.ruleType !== undefined)
            set('rule_type', p.ruleType);
        if (p.appNameMatch !== undefined)
            set('app_name_match', p.appNameMatch.trim());
        if (p.publisherMatch !== undefined)
            set('publisher_match', p.publisherMatch);
        if (p.versionValue !== undefined)
            set('version_value', p.versionValue);
        if (p.severity !== undefined)
            set('severity', p.severity);
        if (p.remediationAction !== undefined)
            set('remediation_action', p.remediationAction);
        if (p.remediationPackageId !== undefined)
            set('remediation_package_id', p.remediationPackageId, '::bigint');
        if (p.requiresApproval !== undefined)
            set('requires_approval', !!p.requiresApproval);
        if (!sets.length)
            return this.getPolicy(schema, id);
        params.push(id);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_compliance_policy SET ${sets.join(', ')}, updated_at = now() WHERE id = $${params.length}::bigint RETURNING *`, params);
        return rows.length ? this.mapPolicy(rows[0]) : null;
    }
    async deletePolicy(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_compliance_policy WHERE id = $1::bigint RETURNING id`, [id]);
        return rows.length > 0;
    }
    async listFindings(schema, f = {}) {
        this.assertSchema(schema);
        const clauses = [];
        const params = [];
        const push = (v) => { params.push(v); return `$${params.length}`; };
        if (f.status === 'active')
            clauses.push(`f.status IN ('open','approved','remediating')`);
        else if (f.status)
            clauses.push(`f.status = ${push(f.status)}`);
        if (f.policyId)
            clauses.push(`f.policy_id = ${push(f.policyId)}::bigint`);
        if (f.deviceId)
            clauses.push(`f.device_id = ${push(f.deviceId)}::bigint`);
        if (f.severity)
            clauses.push(`p.severity = ${push(f.severity)}`);
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const limit = Math.min(Math.max(Number(f.limit) || 100, 1), 1000);
        const offset = Math.max(Number(f.offset) || 0, 0);
        const base = `FROM ${schema}.discovery_compliance_finding f JOIN ${schema}.discovery_compliance_policy p ON p.id = f.policy_id LEFT JOIN ${schema}.discovery_device d ON d.id = f.device_id ${where}`;
        const rows = await this.dataSource.query(`SELECT f.*, p.name AS policy_name, p.rule_type, p.severity, d.hostname, host(d.ip) AS ip ${base}
       ORDER BY CASE p.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, f.first_detected DESC LIMIT ${limit} OFFSET ${offset}`, params);
        const cnt = await this.dataSource.query(`SELECT count(*)::int AS n ${base}`, params);
        return { findings: rows.map((r) => this.mapFinding(r)), total: cnt[0]?.n ?? 0 };
    }
    async getFinding(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT f.*, p.name AS policy_name, p.rule_type, p.severity FROM ${schema}.discovery_compliance_finding f JOIN ${schema}.discovery_compliance_policy p ON p.id = f.policy_id WHERE f.id = $1::bigint`, [id]);
        return rows.length ? this.mapFinding(rows[0]) : null;
    }
    async findingsForDevice(schema, deviceId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT f.*, p.name AS policy_name, p.rule_type, p.severity FROM ${schema}.discovery_compliance_finding f JOIN ${schema}.discovery_compliance_policy p ON p.id = f.policy_id WHERE f.device_id = $1::bigint ORDER BY f.status, f.first_detected DESC`, [deviceId]);
        return rows.map((r) => this.mapFinding(r));
    }
    async upsertViolation(schema, policyId, deviceId, softwareName, detectedVersion, detail) {
        this.assertSchema(schema);
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_compliance_finding (policy_id, device_id, software_name, detected_version, detail)
       VALUES ($1::bigint, $2::bigint, $3, $4, $5)
       ON CONFLICT (policy_id, device_id) DO UPDATE SET
         software_name = EXCLUDED.software_name, detected_version = EXCLUDED.detected_version, detail = EXCLUDED.detail, last_evaluated = now(),
         status = CASE
                    WHEN ${schema}.discovery_compliance_finding.status = 'waived' AND (${schema}.discovery_compliance_finding.waived_until IS NULL OR ${schema}.discovery_compliance_finding.waived_until > now()) THEN 'waived'
                    WHEN ${schema}.discovery_compliance_finding.status IN ('approved','remediating') THEN ${schema}.discovery_compliance_finding.status
                    ELSE 'open' END,
         resolved_at = CASE WHEN ${schema}.discovery_compliance_finding.status = 'resolved' THEN NULL ELSE ${schema}.discovery_compliance_finding.resolved_at END,
         first_detected = CASE WHEN ${schema}.discovery_compliance_finding.status = 'resolved' THEN now() ELSE ${schema}.discovery_compliance_finding.first_detected END`, [policyId, deviceId, softwareName, detectedVersion, detail]);
    }
    async resolveExcept(schema, deviceId, violatingPolicyIds) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_compliance_finding SET status = 'resolved', resolved_at = now(), last_evaluated = now()
        WHERE device_id = $1::bigint AND status <> 'resolved' AND NOT (policy_id = ANY($2::bigint[])) RETURNING id`, [deviceId, violatingPolicyIds.length ? violatingPolicyIds : ['0']]);
        return rows.length;
    }
    async setFindingStatus(schema, id, status, extra = {}) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_compliance_finding SET status = $2,
          waiver_reason = CASE WHEN $2 = 'waived' THEN $3 ELSE waiver_reason END,
          waived_by = CASE WHEN $2 = 'waived' THEN $4 ELSE waived_by END,
          waived_by_name = CASE WHEN $2 = 'waived' THEN $5 ELSE waived_by_name END,
          waived_until = CASE WHEN $2 = 'waived' THEN $6::timestamptz ELSE waived_until END,
          remediation_job_id = COALESCE($7::bigint, remediation_job_id),
          resolved_at = CASE WHEN $2 = 'resolved' THEN now() ELSE resolved_at END,
          last_evaluated = now()
        WHERE id = $1::bigint`, [id, status, extra.waiverReason ?? null, extra.waivedBy ?? null, extra.waivedByName ?? null, extra.waivedUntil ?? null, extra.remediationJobId ?? null]);
        return this.getFinding(schema, id);
    }
    async findingByJob(schema, jobId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT f.*, p.name AS policy_name, p.rule_type, p.severity FROM ${schema}.discovery_compliance_finding f JOIN ${schema}.discovery_compliance_policy p ON p.id = f.policy_id WHERE f.remediation_job_id = $1::bigint LIMIT 1`, [jobId]);
        return rows.length ? this.mapFinding(rows[0]) : null;
    }
    async expireWaivers(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_compliance_finding SET status = 'open', last_evaluated = now() WHERE status = 'waived' AND waived_until IS NOT NULL AND waived_until < now() RETURNING id`);
        return rows.length;
    }
    async summary(schema) {
        this.assertSchema(schema);
        const policies = await this.dataSource.query(`SELECT p.id, p.name, p.rule_type, p.severity, p.enabled,
              count(f.id) FILTER (WHERE f.status = 'open') AS open,
              count(f.id) FILTER (WHERE f.status IN ('approved','remediating')) AS remediating,
              count(f.id) FILTER (WHERE f.status = 'waived') AS waived,
              count(f.id) FILTER (WHERE f.status = 'resolved') AS resolved
         FROM ${schema}.discovery_compliance_policy p LEFT JOIN ${schema}.discovery_compliance_finding f ON f.policy_id = p.id
        GROUP BY p.id ORDER BY CASE p.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, lower(p.name)`);
        const totals = await this.dataSource.query(`SELECT count(*) FILTER (WHERE status='open')::int AS open, count(*) FILTER (WHERE status IN ('approved','remediating'))::int AS remediating,
              count(*) FILTER (WHERE status='waived')::int AS waived, count(*) FILTER (WHERE status='resolved')::int AS resolved,
              count(DISTINCT device_id) FILTER (WHERE status IN ('open','approved','remediating'))::int AS non_compliant_devices
         FROM ${schema}.discovery_compliance_finding`);
        const topDevices = await this.dataSource.query(`SELECT d.id, d.hostname, host(d.ip) AS ip, count(*)::int AS open FROM ${schema}.discovery_compliance_finding f JOIN ${schema}.discovery_device d ON d.id = f.device_id
        WHERE f.status IN ('open','approved','remediating') GROUP BY d.id ORDER BY open DESC, d.hostname LIMIT 10`);
        return { policies: policies.map((p) => ({ ...p, id: String(p.id), open: Number(p.open), remediating: Number(p.remediating), waived: Number(p.waived), resolved: Number(p.resolved) })), totals: totals[0] ?? {}, topDevices: topDevices.map((t) => ({ ...t, id: String(t.id) })) };
    }
    async installedSoftware(schema, deviceId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT id, device_id, name, version, publisher, product_code, uninstall_string, architecture FROM ${schema}.installed_software WHERE device_id = $1::bigint ORDER BY lower(name)`, [deviceId]);
        return rows.map((r) => ({ id: String(r.id), deviceId: String(r.device_id), name: r.name, version: r.version ?? null, publisher: r.publisher ?? null, productCode: r.product_code ?? null, uninstallString: r.uninstall_string ?? null, architecture: r.architecture ?? null }));
    }
    async installedSoftwareRow(schema, softwareId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT id, device_id, name, version, publisher, product_code, uninstall_string, architecture FROM ${schema}.installed_software WHERE id = $1::bigint`, [softwareId]);
        if (!rows.length)
            return null;
        const r = rows[0];
        return { id: String(r.id), deviceId: String(r.device_id), name: r.name, version: r.version ?? null, publisher: r.publisher ?? null, productCode: r.product_code ?? null, uninstallString: r.uninstall_string ?? null, architecture: r.architecture ?? null };
    }
    async devicesWithSoftware(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT DISTINCT device_id FROM ${schema}.installed_software`);
        return rows.map((r) => String(r.device_id));
    }
    async listProtected(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_protected_software ORDER BY lower(name_match)`);
        return rows.map((r) => ({ id: String(r.id), nameMatch: r.name_match, publisherMatch: r.publisher_match ?? null, reason: r.reason ?? null, createdBy: r.created_by ?? null, createdAt: this.iso(r.created_at) }));
    }
    async insertProtected(schema, nameMatch, publisherMatch, reason, userId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_protected_software (name_match, publisher_match, reason, created_by) VALUES ($1,$2,$3,$4) RETURNING *`, [nameMatch.trim(), publisherMatch, reason, userId]);
        const r = rows[0];
        return { id: String(r.id), nameMatch: r.name_match, publisherMatch: r.publisher_match ?? null, reason: r.reason ?? null, createdBy: r.created_by ?? null, createdAt: this.iso(r.created_at) };
    }
    async deleteProtected(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_protected_software WHERE id = $1::bigint RETURNING id`, [id]);
        return rows.length > 0;
    }
};
exports.ComplianceRepository = ComplianceRepository;
exports.ComplianceRepository = ComplianceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ComplianceRepository);
