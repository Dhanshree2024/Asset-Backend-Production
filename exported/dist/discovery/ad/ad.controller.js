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
exports.AdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const ad_service_1 = require("./ad.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
let AdController = class AdController {
    constructor(ad, audit, requestContext) {
        this.ad = ad;
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
        return schema;
    }
    async get() {
        try {
            return { status: true, config: await this.ad.getConfig(this.resolveSchema()) };
        }
        catch (error) {
            return { status: false, message: 'Failed to load AD config', error: error?.message ?? String(error) };
        }
    }
    async save(body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const config = await this.audit.wrap(schema, actor, { action: 'ad.config.update', targetType: 'ad-config', params: { ...body } }, () => this.ad.saveConfig(schema, body, actor.userId));
        return { status: true, config };
    }
    async test(req) {
        console.log('[AD Controller] POST /test START');
        const schema = this.resolveSchema();
        console.log('[AD Controller] Schema:', schema);
        const actor = this.audit.actor(req);
        console.log('[AD Controller] Actor:', {
            userId: actor?.userId,
            ip: actor?.ip,
        });
        console.log('[AD Controller] Calling ad.bindTest()...');
        try {
            const result = await this.ad.bindTest(schema);
            console.log('[AD Controller] ad.bindTest() returned:', {
                ok: result.ok,
                message: result.message,
                bindDn: result.bindDn,
                baseEntries: result.baseEntries,
            });
            console.log('[AD Controller] Recording audit...');
            await this.audit.record(schema, actor, {
                action: 'ad.bind_test',
                targetType: 'ad-config',
                result: result.ok ? 'ok' : 'error',
                error: result.ok ? null : result.message,
            });
            console.log('[AD Controller] Audit recorded');
            console.log('[AD Controller] POST /test SUCCESS');
            return {
                status: result.ok,
                ...result,
            };
        }
        catch (err) {
            console.error('[AD Controller] POST /test FAILED');
            console.error('[AD Controller] Error:', err);
            console.error('[AD Controller] Error message:', err?.message);
            console.error('[AD Controller] Stack:', err?.stack);
            throw err;
        }
    }
    async sync(req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const result = await this.audit.wrap(schema, actor, { action: 'ad.sync_computers', targetType: 'ad-config' }, () => this.ad.syncComputers(schema));
        return { status: true, ...result, message: `Synced ${result.synced} computer objects; ${result.linked} linked to discovered devices` };
    }
    async computers(search) {
        try {
            return { status: true, computers: await this.ad.listComputers(this.resolveSchema(), search) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list AD computers', error: error?.message ?? String(error), computers: [] };
        }
    }
};
exports.AdController = AdController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.AD, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'AD / LDAP configuration for this org' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.AD, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Save AD / LDAP configuration' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdController.prototype, "save", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.AD, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Test the LDAP bind with the configured credential' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.AD, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync computer objects from AD and link them to discovered devices' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdController.prototype, "sync", null);
__decorate([
    (0, common_1.Get)('computers'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.AD, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Synced AD computer objects' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdController.prototype, "computers", null);
exports.AdController = AdController = __decorate([
    (0, swagger_1.ApiTags)('Discovery AD'),
    (0, common_1.Controller)('discovery/ad-config'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [ad_service_1.AdService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], AdController);
