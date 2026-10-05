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
var AdService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdService = void 0;
const common_1 = require("@nestjs/common");
const ldapts_1 = require("ldapts");
const credential_service_1 = require("../credentials/credential.service");
const ad_repository_1 = require("./ad.repository");
const PAGE_SIZE = 500;
const MAX_COMPUTERS = 20000;
let AdService = AdService_1 = class AdService {
    constructor(repo, credentials) {
        this.repo = repo;
        this.credentials = credentials;
        this.logger = new common_1.Logger(AdService_1.name);
    }
    getConfig(schema) { return this.repo.getConfig(schema); }
    async saveConfig(schema, patch, userId) {
        if (patch.ldapUrl && !/^ldaps?:\/\/[A-Za-z0-9.\-:_\[\]]+$/.test(patch.ldapUrl.trim())) {
            throw new common_1.BadRequestException('ldapUrl must look like ldaps://dc01.corp.local:636');
        }
        if (patch.baseDn && !/^([A-Za-z]+=[^,]+)(,[A-Za-z]+=[^,]+)*$/.test(patch.baseDn.trim())) {
            throw new common_1.BadRequestException('baseDn must be a DN like DC=corp,DC=local');
        }
        return this.repo.upsertConfig(schema, {
            ...patch,
            ldapUrl: patch.ldapUrl?.trim() ?? null,
            baseDn: patch.baseDn?.trim() ?? null,
            domainName: patch.domainName?.trim() ?? null,
            computerOuFilter: patch.computerOuFilter?.trim() || null,
        }, userId);
    }
    async connect(schema, cfg) {
        console.log('[AD connect] ===== START =====');
        console.log('[AD connect] Schema:', schema);
        console.log('[AD connect] LDAP URL:', cfg.ldapUrl);
        console.log('[AD connect] Domain:', cfg.domainName);
        console.log('[AD connect] Bind credential ID:', cfg.bindCredentialId);
        console.log('[AD connect] useLdaps:', cfg.useLdaps);
        if (!cfg.ldapUrl) {
            console.error('[AD connect] LDAP URL is missing');
            throw new common_1.BadRequestException('LDAP URL is not configured');
        }
        if (!cfg.bindCredentialId) {
            console.error('[AD connect] Bind credential ID is missing');
            throw new common_1.BadRequestException('Choose a bind credential (kind ldap-bind or windows-domain)');
        }
        console.log('[AD connect] Loading credential...');
        const cred = await this.credentials.materializeForAgent(schema, cfg.bindCredentialId);
        console.log('[AD connect] Credential loaded');
        console.log('[AD connect] Username:', cred.username);
        console.log('[AD connect] Credential domain:', cred.domain);
        console.log('[AD connect] Secret available:', !!cred.secret);
        if (!cred.username || !cred.secret) {
            console.error('[AD connect] Credential missing username/secret');
            throw new common_1.BadRequestException('Bind credential has no username/secret');
        }
        let bindDn = cred.username;
        console.log('[AD connect] Original username:', bindDn);
        if (!/[=,]/.test(bindDn) && !bindDn.includes('@')) {
            const dom = cred.domain || cfg.domainName;
            console.log('[AD connect] Username is not DN/UPN');
            console.log('[AD connect] Domain selected:', dom);
            if (bindDn.includes('\\')) {
                console.log('[AD connect] Using DOMAIN\\user format');
                bindDn = bindDn;
            }
            else if (dom) {
                bindDn = `${bindDn}@${dom}`;
                console.log('[AD connect] Converted username to UPN:', bindDn);
            }
        }
        console.log('[AD connect] Final bind identity:', bindDn);
        const allowSelfSigned = process.env.DISCOVERY_LDAPS_ALLOW_SELF_SIGNED === 'true';
        console.log('[AD connect] DISCOVERY_LDAPS_ALLOW_SELF_SIGNED:', allowSelfSigned);
        const clientOptions = {
            url: cfg.ldapUrl,
            timeout: 15000,
            connectTimeout: 10000,
            tlsOptions: allowSelfSigned
                ? { rejectUnauthorized: false }
                : undefined,
        };
        console.log('[AD connect] Creating LDAP client...');
        console.log('[AD connect] Client URL:', clientOptions.url);
        console.log('[AD connect] timeout:', clientOptions.timeout);
        console.log('[AD connect] connectTimeout:', clientOptions.connectTimeout);
        console.log('[AD connect] TLS options configured:', !!clientOptions.tlsOptions);
        const client = new ldapts_1.Client(clientOptions);
        console.log('[AD connect] LDAP client created');
        console.log('[AD connect] Starting client.bind()...');
        console.log('[AD connect] Bind identity:', bindDn);
        try {
            const start = Date.now();
            await client.bind(bindDn, cred.secret);
            const elapsed = Date.now() - start;
            console.log('[AD connect] LDAP BIND SUCCESS');
            console.log('[AD connect] Bind time:', `${elapsed} ms`);
        }
        catch (err) {
            const elapsed = Date.now();
            console.error('[AD connect] ===== LDAP BIND FAILED =====');
            console.error('[AD connect] Error:', err);
            console.error('[AD connect] Error name:', err?.name);
            console.error('[AD connect] Error message:', err?.message);
            console.error('[AD connect] Error stack:', err?.stack);
            try {
                await client.unbind();
                console.log('[AD connect] LDAP client unbound after failure');
            }
            catch (unbindErr) {
                console.error('[AD connect] Unbind after failure also failed:', unbindErr);
            }
            throw new common_1.BadRequestException(`LDAP bind failed for ${bindDn}: ${err?.message ?? String(err)}`);
        }
        console.log('[AD connect] ===== CONNECT SUCCESS =====');
        return {
            client,
            bindDn,
        };
    }
    async bindTest(schema) {
        console.log('[AD bindTest] Starting bind test');
        console.log('[AD bindTest] Schema:', schema);
        const cfg = await this.repo.getConfig(schema);
        console.log('[AD bindTest] Configuration:', {
            enabled: cfg.enabled,
            domainName: cfg.domainName,
            ldapUrl: cfg.ldapUrl,
            useLdaps: cfg.useLdaps,
            baseDn: cfg.baseDn,
            bindCredentialId: cfg.bindCredentialId,
            computerOuFilter: cfg.computerOuFilter,
        });
        try {
            console.log('[AD bindTest] Calling connect()...');
            const { client, bindDn } = await this.connect(schema, cfg);
            console.log('[AD bindTest] LDAP connect/bind successful');
            console.log('[AD bindTest] Bind DN:', bindDn);
            let baseEntries = 0;
            try {
                if (cfg.baseDn) {
                    console.log('[AD bindTest] Testing Base DN:', cfg.baseDn);
                    const r = await client.search(cfg.baseDn, {
                        scope: 'base',
                        filter: '(objectClass=*)',
                        attributes: ['dn'],
                        sizeLimit: 1,
                    });
                    baseEntries = r.searchEntries.length;
                    console.log('[AD bindTest] Base DN search successful');
                    console.log('[AD bindTest] Base DN entries:', baseEntries);
                }
                else {
                    console.log('[AD bindTest] No Base DN configured');
                }
            }
            finally {
                console.log('[AD bindTest] Unbinding LDAP client...');
                await client.unbind();
                console.log('[AD bindTest] LDAP client unbound');
            }
            await this.repo.recordBindTest(schema, true, null);
            console.log('[AD bindTest] Bind test SUCCESS');
            return {
                ok: true,
                message: `Bind OK as ${bindDn}${cfg.baseDn ? ` · base DN reachable (${baseEntries} entry)` : ''}`,
                bindDn,
                baseEntries,
            };
        }
        catch (err) {
            const rawMsg = err?.message ?? String(err);
            const msg = rawMsg.replace(/\u0000/g, '');
            console.error('[AD bindTest] Bind test FAILED');
            console.error('[AD bindTest] Error message:', msg);
            console.error('[AD bindTest] Error:', err);
            await this.repo.recordBindTest(schema, false, msg);
            return {
                ok: false,
                message: msg,
            };
        }
    }
    async syncComputers(schema) {
        const cfg = await this.repo.getConfig(schema);
        if (!cfg.baseDn) {
            throw new common_1.BadRequestException('Base DN is required to sync computers');
        }
        const { client } = await this.connect(schema, cfg);
        const computers = [];
        try {
            const filter = '(objectClass=computer)';
            const res = await client.search(cfg.baseDn, {
                scope: 'sub',
                filter,
                attributes: [
                    'sAMAccountName',
                    'dNSHostName',
                    'distinguishedName',
                    'operatingSystem',
                    'operatingSystemVersion',
                    'userAccountControl',
                    'lastLogonTimestamp',
                    'whenCreated',
                ],
                paged: { pageSize: PAGE_SIZE },
                sizeLimit: MAX_COMPUTERS,
            });
            for (const e of res.searchEntries) {
                const s = (v) => (Array.isArray(v) ? v[0] : v);
                const uac = Number(s(e['userAccountControl']) ?? 0);
                computers.push({
                    samAccountName: s(e['sAMAccountName']) ?? '',
                    dnsHostName: s(e['dNSHostName']) ?? null,
                    distinguishedName: s(e['distinguishedName']) ?? e.dn ?? null,
                    operatingSystem: s(e['operatingSystem']) ?? null,
                    osVersion: s(e['operatingSystemVersion']) ?? null,
                    enabled: uac ? (uac & 0x2) === 0 : null,
                    lastLogonAt: this.fileTimeToIso(s(e['lastLogonTimestamp'])),
                    whenCreated: this.generalizedTimeToIso(s(e['whenCreated'])),
                });
            }
        }
        finally {
            await client.unbind();
        }
        const validComputers = computers.filter((c) => c.samAccountName);
        const synced = await this.repo.upsertComputers(schema, validComputers);
        const linked = await this.repo.linkComputersToDevices(schema, cfg.domainName);
        this.logger.log(`AD sync ${schema}: ${synced} computers, ${linked} linked to devices`);
        return { synced, linked };
    }
    listComputers(schema, search) { return this.repo.listComputers(schema, search); }
    fileTimeToIso(v) {
        if (!v || v === '0')
            return null;
        const n = Number(v);
        if (!isFinite(n) || n <= 0)
            return null;
        const ms = n / 10000 - 11644473600000;
        return new Date(ms).toISOString();
    }
    generalizedTimeToIso(v) {
        if (!v)
            return null;
        const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(v);
        if (!m)
            return null;
        return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])).toISOString();
    }
};
exports.AdService = AdService;
exports.AdService = AdService = AdService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ad_repository_1.AdRepository, credential_service_1.CredentialService])
], AdService);
