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
exports.AdRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AdRepository = class AdRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async getConfig(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_ad_config ORDER BY id LIMIT 1`);
        if (!rows.length) {
            return { id: null, enabled: false, domainName: null, ldapUrl: null, useLdaps: true, baseDn: null, bindCredentialId: null, computerOuFilter: null, lastBindTestAt: null, lastBindResult: null, lastBindError: null, updatedAt: null };
        }
        return this.mapConfig(rows[0]);
    }
    async upsertConfig(schema, patch, userId) {
        this.assertSchema(schema);
        const existing = await this.dataSource.query(`SELECT id FROM ${schema}.discovery_ad_config ORDER BY id LIMIT 1`);
        const vals = [
            patch.enabled ?? false, patch.domainName ?? null, patch.ldapUrl ?? null, patch.useLdaps ?? true,
            patch.baseDn ?? null, patch.bindCredentialId ?? null, patch.computerOuFilter ?? null, userId,
        ];
        let rows;
        if (existing.length) {
            rows = await this.dataSource.query(`UPDATE ${schema}.discovery_ad_config SET enabled=$1::boolean, domain_name=$2, ldap_url=$3, use_ldaps=$4::boolean,
           base_dn=$5, bind_credential_id=$6::bigint, computer_ou_filter=$7, updated_by=$8, updated_at=now()
         WHERE id = $9::bigint RETURNING *`, [...vals, existing[0].id]);
        }
        else {
            rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_ad_config
           (enabled, domain_name, ldap_url, use_ldaps, base_dn, bind_credential_id, computer_ou_filter, updated_by, updated_at)
         VALUES ($1::boolean, $2, $3, $4::boolean, $5, $6::bigint, $7, $8, now()) RETURNING *`, vals);
        }
        return this.mapConfig(rows[0]);
    }
    async recordBindTest(schema, ok, error) {
        this.assertSchema(schema);
        await this.dataSource.query(`UPDATE ${schema}.discovery_ad_config SET last_bind_test_at = now(), last_bind_result = $1, last_bind_error = $2`, [ok ? 'ok' : 'failed', error]);
    }
    async upsertComputers(schema, computers) {
        this.assertSchema(schema);
        let n = 0;
        for (const c of computers) {
            if (!c.samAccountName)
                continue;
            await this.dataSource.query(`INSERT INTO ${schema}.discovery_ad_computer
           (sam_account_name, dns_host_name, distinguished_name, operating_system, os_version, enabled, last_logon_at, when_created, first_synced_at, last_synced_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz, now(), now())
         ON CONFLICT (lower(sam_account_name)) DO UPDATE SET
           dns_host_name = EXCLUDED.dns_host_name, distinguished_name = EXCLUDED.distinguished_name,
           operating_system = EXCLUDED.operating_system, os_version = EXCLUDED.os_version, enabled = EXCLUDED.enabled,
           last_logon_at = EXCLUDED.last_logon_at, when_created = EXCLUDED.when_created, last_synced_at = now()`, [c.samAccountName, c.dnsHostName ?? null, c.distinguishedName ?? null, c.operatingSystem ?? null, c.osVersion ?? null,
                c.enabled ?? null, c.lastLogonAt ?? null, c.whenCreated ?? null]);
            n++;
        }
        return n;
    }
    async linkComputersToDevices(schema, domainName) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_ad_computer c
       SET device_id = d.id
       FROM ${schema}.discovery_device d
       WHERE lower(d.hostname) = lower(regexp_replace(c.sam_account_name, '\\$$', ''))
          OR lower(d.hostname) = lower(split_part(COALESCE(c.dns_host_name, ''), '.', 1))
          OR lower(d.hostname) = lower(COALESCE(c.dns_host_name, ''))
       RETURNING c.device_id`);
        if (domainName) {
            await this.dataSource.query(`UPDATE ${schema}.discovery_device d SET domain = COALESCE(NULLIF(d.domain, ''), $1)
         WHERE d.id IN (SELECT device_id FROM ${schema}.discovery_ad_computer WHERE device_id IS NOT NULL)`, [domainName]);
        }
        return rows.length;
    }
    async listComputers(schema, search, limit = 500) {
        this.assertSchema(schema);
        const params = [];
        let where = '';
        if (search) {
            params.push(`%${search}%`);
            where = `WHERE c.sam_account_name ILIKE $1 OR c.dns_host_name ILIKE $1`;
        }
        params.push(Math.min(Math.max(Number(limit) || 500, 1), 5000));
        const rows = await this.dataSource.query(`SELECT c.*, d.ip AS device_ip FROM ${schema}.discovery_ad_computer c
       LEFT JOIN ${schema}.discovery_device d ON d.id = c.device_id
       ${where} ORDER BY lower(c.sam_account_name) LIMIT $${params.length}::int`, params);
        return rows.map((r) => ({
            id: String(r.id), samAccountName: r.sam_account_name, dnsHostName: r.dns_host_name ?? null,
            distinguishedName: r.distinguished_name ?? null, operatingSystem: r.operating_system ?? null, osVersion: r.os_version ?? null,
            enabled: r.enabled, lastLogonAt: r.last_logon_at ? new Date(r.last_logon_at).toISOString() : null,
            whenCreated: r.when_created ? new Date(r.when_created).toISOString() : null,
            deviceId: r.device_id === null ? null : String(r.device_id), deviceIp: r.device_ip ?? null,
            firstSyncedAt: new Date(r.first_synced_at).toISOString(), lastSyncedAt: new Date(r.last_synced_at).toISOString(),
        }));
    }
    mapConfig(r) {
        return {
            id: String(r.id), enabled: !!r.enabled, domainName: r.domain_name ?? null, ldapUrl: r.ldap_url ?? null,
            useLdaps: r.use_ldaps !== false, baseDn: r.base_dn ?? null,
            bindCredentialId: r.bind_credential_id === null || r.bind_credential_id === undefined ? null : String(r.bind_credential_id),
            computerOuFilter: r.computer_ou_filter ?? null,
            lastBindTestAt: r.last_bind_test_at ? new Date(r.last_bind_test_at).toISOString() : null,
            lastBindResult: r.last_bind_result ?? null, lastBindError: r.last_bind_error ?? null,
            updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : null,
        };
    }
};
exports.AdRepository = AdRepository;
exports.AdRepository = AdRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AdRepository);
