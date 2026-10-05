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
exports.AgentPushController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const agent_push_service_1 = require("./agent-push.service");
let AgentPushController = class AgentPushController {
    constructor(push, audit, requestContext) {
        this.push = push;
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema))
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        return schema;
    }
    async list(status, limit) {
        try {
            return { status: true, pushes: await this.push.list(this.resolveSchema(), { status, limit: limit ? Number(limit) : undefined }) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list push requests', error: error?.message ?? String(error), pushes: [] };
        }
    }
    async candidates(search) {
        try {
            return { status: true, ...(await this.push.candidates(this.resolveSchema(), search)) };
        }
        catch (error) {
            return { status: false, message: 'Failed to load candidates', error: error?.message ?? String(error), devices: [], adComputers: [] };
        }
    }
    async packages() {
        try {
            return { status: true, packages: await this.push.agentPackages(this.resolveSchema()) };
        }
        catch (error) {
            return { status: false, message: 'Failed to load agent packages', error: error?.message ?? String(error), packages: [] };
        }
    }
    async request(body, req) {
        const schema = this.resolveSchema();
        const r = await this.push.request(schema, this.audit.actor(req), body);
        return {
            status: true, pushes: r.rows,
            message: r.pendingApproval
                ? `${r.rows.length} installation request(s) created — awaiting approval by another administrator on the Jobs page`
                : `${r.rows.length} installation job(s) queued — the relay agent picks them up on its next poll`,
        };
    }
    async cancel(id, req) {
        const schema = this.resolveSchema();
        return { status: true, push: await this.push.cancel(schema, this.audit.actor(req), id) };
    }
};
exports.AgentPushController = AgentPushController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Remote agent installation history (one row per target)' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AgentPushController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('candidates'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'PCs that could receive the agent: discovered Windows devices and AD computers without an agent' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentPushController.prototype, "candidates", null);
__decorate([
    (0, common_1.Get)('packages'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Approved agent installer packages (Packages page, kind = agent)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentPushController.prototype, "packages", null);
__decorate([
    (0, common_1.Post)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Install the agent on one or more PCs through an online relay agent (destructive → approval)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AgentPushController.prototype, "request", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentPushController.prototype, "cancel", null);
exports.AgentPushController = AgentPushController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Agent Push'),
    (0, common_1.Controller)('discovery/agent-push'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [agent_push_service_1.AgentPushService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], AgentPushController);
