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
exports.PackageRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PackageRepository = class PackageRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    map(r) {
        const iso = (v) => (v ? new Date(v).toISOString() : null);
        return {
            id: String(r.id), name: r.name, version: r.version, kind: (r.kind ?? 'software'), installerType: r.installer_type, architecture: r.architecture,
            fileName: r.file_name, sizeBytes: Number(r.size_bytes ?? 0), sha256: r.sha256, signatureSubject: r.signature_subject ?? null,
            requireSignature: !!r.require_signature, silentInstallArgs: r.silent_install_args ?? null, silentUninstallArgs: r.silent_uninstall_args ?? null,
            productCode: r.product_code ?? null, detectionRule: r.detection_rule ?? null, rebootBehaviour: r.reboot_behaviour, status: r.status,
            supersedesId: r.supersedes_id != null ? String(r.supersedes_id) : null, approvedBy: r.approved_by ?? null, approvedByName: r.approved_by_name ?? null,
            approvedAt: iso(r.approved_at), rejectedReason: r.rejected_reason ?? null, notes: r.notes ?? null, createdBy: r.created_by ?? null,
            createdByName: r.created_by_name ?? null, createdAt: iso(r.created_at), updatedAt: iso(r.updated_at),
        };
    }
    async list(schema, opts = {}) {
        this.assertSchema(schema);
        const clauses = [];
        const params = [];
        if (opts.status) {
            params.push(opts.status);
            clauses.push(`status = $${params.length}`);
        }
        if (opts.kind) {
            params.push(opts.kind);
            clauses.push(`kind = $${params.length}`);
        }
        if (opts.search?.trim()) {
            params.push(`%${opts.search.trim()}%`);
            clauses.push(`(name ILIKE $${params.length} OR version ILIKE $${params.length} OR file_name ILIKE $${params.length})`);
        }
        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_software_package ${where} ORDER BY lower(name), created_at DESC`, params);
        return rows.map((r) => this.map(r));
    }
    async get(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_software_package WHERE id = $1::bigint`, [id]);
        return rows.length ? this.map(rows[0]) : null;
    }
    async fileRef(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT file_ref, file_name, sha256, size_bytes, status FROM ${schema}.discovery_software_package WHERE id = $1::bigint`, [id]);
        return rows.length ? { fileRef: rows[0].file_ref, fileName: rows[0].file_name, sha256: rows[0].sha256, sizeBytes: Number(rows[0].size_bytes), status: rows[0].status } : null;
    }
    async insert(schema, meta, file, actor) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_software_package
         (name, version, installer_type, architecture, file_name, file_ref, size_bytes, sha256, signature_subject, require_signature,
          silent_install_args, silent_uninstall_args, product_code, detection_rule, reboot_behaviour, supersedes_id, notes, created_by, created_by_name, kind)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,$16::bigint,$17,$18,$19,$20)
       RETURNING *`, [meta.name.trim(), meta.version.trim(), meta.installerType, meta.architecture ?? 'x64', file.fileName, file.fileRef, file.sizeBytes, file.sha256,
            meta.signatureSubject ?? null, !!meta.requireSignature, meta.silentInstallArgs ?? null, meta.silentUninstallArgs ?? null, meta.productCode ?? null,
            meta.detectionRule ? JSON.stringify(meta.detectionRule) : null, meta.rebootBehaviour ?? 'may-require', meta.supersedesId ?? null, meta.notes ?? null,
            actor.userId, actor.name, meta.kind === 'agent' ? 'agent' : 'software']);
        return this.map(rows[0]);
    }
    async setFileRef(schema, id, fileRef) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_software_package SET file_ref = $2 WHERE id = $1::bigint`, [id, fileRef]);
    }
    async updateMeta(schema, id, meta) {
        this.assertSchema(schema);
        const sets = [];
        const params = [];
        const set = (col, v, cast = '') => { params.push(v); sets.push(`${col} = $${params.length}${cast}`); };
        if (meta.name !== undefined)
            set('name', meta.name.trim());
        if (meta.version !== undefined)
            set('version', meta.version.trim());
        if (meta.architecture !== undefined)
            set('architecture', meta.architecture);
        if (meta.silentInstallArgs !== undefined)
            set('silent_install_args', meta.silentInstallArgs);
        if (meta.silentUninstallArgs !== undefined)
            set('silent_uninstall_args', meta.silentUninstallArgs);
        if (meta.productCode !== undefined)
            set('product_code', meta.productCode);
        if (meta.detectionRule !== undefined)
            set('detection_rule', meta.detectionRule ? JSON.stringify(meta.detectionRule) : null, '::jsonb');
        if (meta.rebootBehaviour !== undefined)
            set('reboot_behaviour', meta.rebootBehaviour);
        if (meta.requireSignature !== undefined)
            set('require_signature', !!meta.requireSignature);
        if (meta.signatureSubject !== undefined)
            set('signature_subject', meta.signatureSubject);
        if (meta.supersedesId !== undefined)
            set('supersedes_id', meta.supersedesId, '::bigint');
        if (meta.notes !== undefined)
            set('notes', meta.notes);
        if (meta.kind !== undefined)
            set('kind', meta.kind === 'agent' ? 'agent' : 'software');
        if (!sets.length)
            return this.get(schema, id);
        params.push(id);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_software_package SET ${sets.join(', ')}, updated_at = now() WHERE id = $${params.length}::bigint RETURNING *`, params);
        return rows.length ? this.map(rows[0]) : null;
    }
    async setStatus(schema, id, status, extra = {}) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_software_package
          SET status = $2,
              approved_by = CASE WHEN $2 = 'approved' THEN $3 ELSE approved_by END,
              approved_by_name = CASE WHEN $2 = 'approved' THEN $4 ELSE approved_by_name END,
              approved_at = CASE WHEN $2 = 'approved' THEN now() ELSE approved_at END,
              rejected_reason = CASE WHEN $2 = 'rejected' THEN $5 ELSE rejected_reason END,
              updated_at = now()
        WHERE id = $1::bigint RETURNING *`, [id, status, extra.approvedBy ?? null, extra.approvedByName ?? null, extra.rejectedReason ?? null]);
        return rows.length ? this.map(rows[0]) : null;
    }
    async markSuperseded(schema, oldId) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_software_package SET status = 'superseded', updated_at = now() WHERE id = $1::bigint AND status IN ('approved','pending_approval')`, [oldId]);
    }
    async delete(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_software_package WHERE id = $1::bigint RETURNING file_ref`, [id]);
        return rows.length ? { fileRef: rows[0].file_ref } : null;
    }
    async usageCount(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT count(*)::int AS n FROM ${schema}.discovery_deployment WHERE package_id = $1::bigint`, [id]);
        return rows[0]?.n ?? 0;
    }
};
exports.PackageRepository = PackageRepository;
exports.PackageRepository = PackageRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PackageRepository);
