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
exports.CredentialRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CredentialRepository = class CredentialRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async list(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_credential WHERE deleted_at IS NULL ORDER BY is_default DESC, lower(name)`);
        return rows.map((r) => this.mapSummary(r));
    }
    async getFull(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_credential WHERE id = $1::bigint AND deleted_at IS NULL`, [id]);
        return rows.length ? { ...this.mapSummary(rows[0]), secretEnc: rows[0].secret_enc ?? null } : null;
    }
    async insert(schema, input, userId) {
        this.assertSchema(schema);
        if (input.isDefault)
            await this.clearDefault(schema, input.kind);
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_credential
         (name, kind, username, domain, secret_enc, description, is_default, created_by, updated_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::boolean, $8, $8, now(), now())
       RETURNING *`, [input.name, input.kind, input.username, input.domain, input.secretEnc, input.description, input.isDefault, userId]);
        return this.mapSummary(rows[0]);
    }
    async update(schema, id, patch, userId) {
        this.assertSchema(schema);
        if (patch.isDefault && patch.kind)
            await this.clearDefault(schema, patch.kind);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_credential SET
         name        = COALESCE($2, name),
         kind        = COALESCE($3, kind),
         username    = CASE WHEN $4::boolean THEN $5 ELSE username END,
         domain      = CASE WHEN $6::boolean THEN $7 ELSE domain END,
         secret_enc  = CASE WHEN $8::boolean THEN $9 ELSE secret_enc END,
         description = CASE WHEN $10::boolean THEN $11 ELSE description END,
         is_default  = COALESCE($12::boolean, is_default),
         updated_by  = $13,
         updated_at  = now()
       WHERE id = $1::bigint AND deleted_at IS NULL
       RETURNING *`, [
            id,
            patch.name ?? null,
            patch.kind ?? null,
            patch.username !== undefined, patch.username ?? null,
            patch.domain !== undefined, patch.domain ?? null,
            patch.secretEnc !== undefined, patch.secretEnc ?? null,
            patch.description !== undefined, patch.description ?? null,
            patch.isDefault === undefined ? null : patch.isDefault,
            userId,
        ]);
        return rows.length ? this.mapSummary(rows[0]) : null;
    }
    async softDelete(schema, id, userId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_credential SET deleted_at = now(), updated_by = $2, secret_enc = NULL
       WHERE id = $1::bigint AND deleted_at IS NULL RETURNING id`, [id, userId]);
        return rows.length > 0;
    }
    async recordTest(schema, id, ok, error) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_credential
       SET last_tested_at = now(), last_test_result = $2, last_test_error = $3
       WHERE id = $1::bigint`, [id, ok ? 'ok' : 'failed', error]);
    }
    async clearDefault(schema, kind) {
        await this.dataSource.query(`UPDATE ${schema}.discovery_credential SET is_default = false WHERE kind = $1 AND deleted_at IS NULL`, [kind]);
    }
    mapSummary(r) {
        return {
            id: String(r.id),
            name: r.name,
            kind: r.kind,
            username: r.username ?? null,
            domain: r.domain ?? null,
            description: r.description ?? null,
            isDefault: !!r.is_default,
            hasSecret: !!r.secret_enc,
            lastTestedAt: r.last_tested_at ? new Date(r.last_tested_at).toISOString() : null,
            lastTestResult: r.last_test_result ?? null,
            lastTestError: r.last_test_error ?? null,
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
            updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : '',
        };
    }
};
exports.CredentialRepository = CredentialRepository;
exports.CredentialRepository = CredentialRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CredentialRepository);
