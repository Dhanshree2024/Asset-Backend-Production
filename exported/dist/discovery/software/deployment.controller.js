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
exports.DeploymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const agent_repository_1 = require("../store/agent.repository");
const deployment_service_1 = require("./deployment.service");
const target_resolver_1 = require("./target.resolver");
let DeploymentController = class DeploymentController {
    constructor(deployments, targets, agents, audit, requestContext) {
        this.deployments = deployments;
        this.targets = targets;
        this.agents = agents;
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema))
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        return schema;
    }
    async list(status, limit, offset) {
        try {
            return { status: true, ...(await this.deployments.list(this.resolveSchema(), { status, limit: limit ? Number(limit) : undefined, offset: offset ? Number(offset) : undefined })) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list deployments', error: error?.message ?? String(error), deployments: [], total: 0 };
        }
    }
    async preview(body) {
        const schema = this.resolveSchema();
        const devices = await this.targets.resolve(schema, body?.targets);
        const agents = await this.agents.listAgents(schema);
        const withAgent = new Set(agents.filter((a) => a.deviceId).map((a) => String(a.deviceId)));
        return {
            status: true,
            devices: devices.map((d) => ({ id: String(d.id), hostname: d.hostname, ip: d.ip, os: d.os, category: d.category, hasAgent: withAgent.has(String(d.id)) })),
            total: devices.length, withAgent: devices.filter((d) => withAgent.has(String(d.id))).length,
        };
    }
    async get(id) {
        const schema = this.resolveSchema();
        const deployment = await this.deployments.get(schema, id);
        return { status: true, deployment, devices: await this.deployments.devices(schema, id) };
    }
    async create(body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const deployment = await this.audit.wrap(schema, actor, { action: 'deployment.create', targetType: 'deployment', targetLabel: body?.name, params: { ...body } }, () => this.deployments.create(schema, actor, body));
        return { status: true, deployment, message: `Deployment created for ${deployment.counts?.total ?? 0} device(s) in ${deployment.rings.length} ring(s) — awaiting approval by another administrator` };
    }
    async approve(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const deployment = await this.audit.wrap(schema, actor, { action: 'deployment.approve', targetType: 'deployment', targetId: id }, () => this.deployments.approve(schema, actor, id));
        return { status: true, deployment, message: 'Approved — ring 1 jobs are queued (they honour the maintenance window)' };
    }
    async reject(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const deployment = await this.audit.wrap(schema, actor, { action: 'deployment.reject', targetType: 'deployment', targetId: id, params: { reason: body?.reason ?? null } }, () => this.deployments.reject(schema, id, body?.reason ?? null));
        return { status: true, deployment };
    }
    async cancel(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const deployment = await this.audit.wrap(schema, actor, { action: 'deployment.cancel', targetType: 'deployment', targetId: id, params: { reason: body?.reason ?? null } }, () => this.deployments.cancel(schema, actor, id, body?.reason ?? null));
        return { status: true, deployment };
    }
    async retry(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const r = await this.audit.wrap(schema, actor, { action: 'deployment.retry', targetType: 'deployment', targetId: id }, () => this.deployments.retryFailed(schema, actor, id));
        return { status: true, ...r, message: `${r.requeued} device(s) re-queued` };
    }
    async resume(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const deployment = await this.audit.wrap(schema, actor, { action: 'deployment.resume', targetType: 'deployment', targetId: id }, () => this.deployments.resume(schema, actor, id));
        return { status: true, deployment };
    }
};
exports.DeploymentController = DeploymentController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'List deployments with per-status device counts' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a target selector to devices (wizard preview) and flag which have an agent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'VIEW'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a deployment (pending approval by another administrator)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/retry'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Re-queue failed / skipped devices of the current ring' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "retry", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Continue a paused deployment to the next ring despite the failure rate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "resume", null);
exports.DeploymentController = DeploymentController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Deployments'),
    (0, common_1.Controller)('discovery/deployments'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [deployment_service_1.DeploymentService,
        target_resolver_1.TargetResolver,
        agent_repository_1.AgentRepository,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], DeploymentController);
