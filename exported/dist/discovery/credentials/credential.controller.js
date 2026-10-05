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
exports.CredentialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const jobs_service_1 = require("../jobs/jobs.service");
const credential_service_1 = require("./credential.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
let CredentialController = class CredentialController {
    constructor(credentials, jobs, audit, requestContext) {
        this.credentials = credentials;
        this.jobs = jobs;
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
    async list() {
        try {
            const schema = this.resolveSchema();
            return { status: true, credentials: await this.credentials.list(schema) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list credentials', error: error?.message ?? String(error), credentials: [] };
        }
    }
    async create(body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const credential = await this.audit.wrap(schema, actor, { action: 'credential.create', targetType: 'credential', targetLabel: body?.name, params: { kind: body?.kind, username: body?.username, domain: body?.domain, isDefault: body?.isDefault } }, () => this.credentials.create(schema, body, actor.userId));
        return { status: true, credential };
    }
    async update(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const credential = await this.audit.wrap(schema, actor, { action: 'credential.update', targetType: 'credential', targetId: id, targetLabel: body?.name, params: { ...body, secret: body?.secret ? '[set]' : '[unchanged]' } }, () => this.credentials.update(schema, id, body, actor.userId));
        return { status: true, credential };
    }
    async remove(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        await this.audit.wrap(schema, actor, { action: 'credential.delete', targetType: 'credential', targetId: id }, () => this.credentials.remove(schema, id, actor.userId));
        return { status: true };
    }
    async test(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const cred = await this.credentials.get(schema, id);
        if (!body?.deviceId && !body?.agentId) {
            throw new common_1.BadRequestException('deviceId or agentId is required to choose where the credential is tested');
        }
        const job = await this.jobs.createJob(schema, actor, {
            type: 'CRED_TEST',
            deviceId: body.deviceId ?? null,
            agentId: body.agentId ?? null,
            targetLabel: cred.name,
            payload: { credentialId: id, kind: cred.kind },
        });
        return { status: true, job, message: 'Credential test queued — result appears on the credential once the agent reports back' };
    }
};
exports.CredentialController = CredentialController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Credentials, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'List credentials (never returns secrets)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Credentials, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a credential (encrypted at rest with a mandatory key)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Credentials, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a credential (omit secret to keep the existing one)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Credentials, 'DELETE'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a credential (soft delete; ciphertext wiped)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Credentials, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Test a credential on an endpoint via the agent (queues CRED_TEST)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "test", null);
exports.CredentialController = CredentialController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Credentials'),
    (0, common_1.Controller)('discovery/credentials'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [credential_service_1.CredentialService,
        jobs_service_1.JobsService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], CredentialController);
