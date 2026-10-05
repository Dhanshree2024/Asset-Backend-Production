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
var DiscoveryPermissionGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryPermissionGuard = void 0;
exports.decideFromRows = decideFromRows;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const cookie_1 = require("cookie");
const typeorm_2 = require("typeorm");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const request_context_service_1 = require("../../common/context/request-context.service");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const CACHE_TTL_MS = 30_000;
const SCHEMA_RE = /^org_[A-Za-z0-9_]+$/;
function decideFromRows(rows, submoduleId) {
    const sid = String(submoduleId);
    const specific = rows.find((r) => r.v5 !== null && String(r.v5) === sid);
    if (specific)
        return specific.isAllowed === true;
    const moduleWide = rows.find((r) => r.v5 === null);
    return moduleWide ? moduleWide.isAllowed === true : false;
}
let DiscoveryPermissionGuard = DiscoveryPermissionGuard_1 = class DiscoveryPermissionGuard {
    constructor(reflector, dataSource, requestContext) {
        this.reflector = reflector;
        this.dataSource = dataSource;
        this.requestContext = requestContext;
        this.logger = new common_1.Logger(DiscoveryPermissionGuard_1.name);
        this.roleCache = new Map();
        this.grantCache = new Map();
    }
    get enforce() {
        return (process.env.DISCOVERY_PERMISSIONS_ENFORCE ?? 'true').toLowerCase() !== 'false';
    }
    static getCached(map, key) {
        const hit = map.get(key);
        if (!hit)
            return undefined;
        if (hit.expires < Date.now()) {
            map.delete(key);
            return undefined;
        }
        return hit.value;
    }
    static setCached(map, key, value) {
        map.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
        return value;
    }
    invalidate() { this.roleCache.clear(); this.grantCache.clear(); }
    actorId(req) {
        try {
            const cookies = (0, cookie_1.parse)(req?.headers?.cookie || '');
            const enc = cookies['system_user_id'];
            if (!enc)
                return null;
            const n = Number((0, crypto_utils_1.decrypt)(enc.toString()));
            return Number.isFinite(n) ? n : null;
        }
        catch {
            return null;
        }
    }
    async roleFor(schema, userId) {
        const key = `${schema}:${userId}`;
        const cached = DiscoveryPermissionGuard_1.getCached(this.roleCache, key);
        if (cached !== undefined)
            return cached;
        const rows = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE register_user_login_id = $1 AND is_active = 1 AND is_deleted = 0 LIMIT 1`, [userId]);
        const role = rows[0]?.role_id != null ? Number(rows[0].role_id) : null;
        return DiscoveryPermissionGuard_1.setCached(this.roleCache, key, role);
    }
    async granted(schema, role, req) {
        const key = `${schema}:${role}:${req.module}/${req.submodule}/${req.action}`.toLowerCase();
        const cached = DiscoveryPermissionGuard_1.getCached(this.grantCache, key);
        if (cached !== undefined)
            return cached;
        const rows = await this.dataSource.query(`SELECT s.id AS submodule_id, cr.v5, cr."isAllowed"
         FROM ${schema}.modules m
         JOIN ${schema}.submodules s ON s.module_id = m.id
         JOIN ${schema}.actions a ON TRUE
         LEFT JOIN ${schema}.casbin_rule cr
           ON cr.ptype = 'p' AND cr.v0 = $1 AND cr.v1 = m.id::text AND cr.v2 = a.id::text
          AND (cr.v5 IS NULL OR cr.v5 = s.id::text)
        WHERE lower(m.module_name) = lower($2)
          AND lower(s.submodule_name) = lower($3)
          AND lower(a.action_code) = lower($4)`, [String(role), req.module, req.submodule, req.action]);
        if (!rows.length) {
            this.logger.warn(`RBAC vocabulary missing: "${req.module} / ${req.submodule} / ${req.action}" is not registered in ${schema} — run Discovery/6.migrate_phase2_ad_settings_all_schemas.sql`);
            return DiscoveryPermissionGuard_1.setCached(this.grantCache, key, false);
        }
        const allowed = decideFromRows(rows.filter((r) => r.isAllowed !== null && r.isAllowed !== undefined).map((r) => ({ v5: r.v5, isAllowed: r.isAllowed })), rows[0].submodule_id);
        return DiscoveryPermissionGuard_1.setCached(this.grantCache, key, allowed);
    }
    async canActivate(context) {
        const requirement = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSION_META, [context.getHandler(), context.getClass()]);
        const request = context.switchToHttp().getRequest();
        const route = `${request?.method} ${request?.url}`;
        const deny = (reason) => {
            this.logger.warn(`${this.enforce ? 'DENY' : 'DENY(log-only)'} ${route} :: ${JSON.stringify(requirement ?? null)} :: ${reason}`);
            if (!this.enforce)
                return true;
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        };
        if (!requirement)
            return deny('route has no @RequireDiscovery / @RequireAction — fail-closed');
        if (requirement.kind !== 'action')
            return deny('special-permission requirements are not used by Agent Discovery');
        const schema = this.requestContext.get('schema');
        if (!schema || !SCHEMA_RE.test(schema))
            return deny('organization schema not resolved');
        const userId = this.actorId(request);
        if (userId === null)
            return deny('actor could not be resolved from system_user_id');
        let role;
        try {
            role = await this.roleFor(schema, userId);
        }
        catch (err) {
            return deny(`role lookup failed: ${err?.message}`);
        }
        if (role === null)
            return deny(`user ${userId} has no active tenant record / role in ${schema}`);
        let allowed = false;
        try {
            allowed = await this.granted(schema, role, requirement);
        }
        catch (err) {
            return deny(`grant lookup failed: ${err?.message}`);
        }
        if (!allowed)
            return deny(`role ${role} lacks ${requirement.module} / ${requirement.submodule} / ${requirement.action}`);
        return true;
    }
};
exports.DiscoveryPermissionGuard = DiscoveryPermissionGuard;
exports.DiscoveryPermissionGuard = DiscoveryPermissionGuard = DiscoveryPermissionGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.DataSource,
        request_context_service_1.RequestContextService])
], DiscoveryPermissionGuard);
