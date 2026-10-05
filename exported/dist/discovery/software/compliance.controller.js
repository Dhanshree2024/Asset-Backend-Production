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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const compliance_service_1 = require("./compliance.service");
let ComplianceController = class ComplianceController {
    constructor(compliance, audit, requestContext) {
        this.compliance = compliance;
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema))
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        return schema;
    }
    async summary() {
        try {
            return { status: true, ...(await this.compliance.summary(this.resolveSchema())) };
        }
        catch (error) {
            return { status: false, message: 'Failed to load summary', error: error?.message ?? String(error), policies: [], totals: {}, topDevices: [] };
        }
    }
    async policies() {
        try {
            return { status: true, policies: await this.compliance.listPolicies(this.resolveSchema()) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list policies', error: error?.message ?? String(error), policies: [] };
        }
    }
    async createPolicy(body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const policy = await this.audit.wrap(schema, actor, { action: 'compliance.policy.create', targetType: 'policy', targetLabel: body?.name, params: { ...body } }, () => this.compliance.createPolicy(schema, actor, body));
        return { status: true, policy, message: 'Policy saved — evaluation is running in the background' };
    }
    async updatePolicy(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const policy = await this.audit.wrap(schema, actor, { action: 'compliance.policy.update', targetType: 'policy', targetId: id, params: { ...body } }, () => this.compliance.updatePolicy(schema, id, body));
        return { status: true, policy };
    }
    async deletePolicy(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        await this.audit.wrap(schema, actor, { action: 'compliance.policy.delete', targetType: 'policy', targetId: id }, () => this.compliance.deletePolicy(schema, id));
        return { status: true };
    }
    async evaluate(req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const r = await this.audit.wrap(schema, actor, { action: 'compliance.evaluate', targetType: 'org' }, () => this.compliance.evaluateAll(schema));
        return { status: true, ...r, message: `${r.devices} device(s) evaluated, ${r.violations} open violation(s)` };
    }
    async findings(status, policyId, deviceId, severity, limit, offset) {
        try {
            return { status: true, ...(await this.compliance.listFindings(this.resolveSchema(), { status, policyId, deviceId, severity, limit: limit ? Number(limit) : undefined, offset: offset ? Number(offset) : undefined })) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list findings', error: error?.message ?? String(error), findings: [], total: 0 };
        }
    }
    async waive(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const finding = await this.audit.wrap(schema, actor, { action: 'compliance.finding.waive', targetType: 'finding', targetId: id, params: { reason: body?.reason, until: body?.until ?? null } }, () => this.compliance.waive(schema, actor, id, body?.reason, body?.until ?? null));
        return { status: true, finding };
    }
    async unwaive(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const finding = await this.audit.wrap(schema, actor, { action: 'compliance.finding.unwaive', targetType: 'finding', targetId: id }, () => this.compliance.unwaive(schema, id));
        return { status: true, finding };
    }
    async remediate(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const r = await this.audit.wrap(schema, actor, { action: 'compliance.finding.remediate', targetType: 'finding', targetId: id }, () => this.compliance.remediate(schema, actor, id));
        return { status: true, ...r, message: r.job.status === 'pending_approval' ? 'Remediation job created — awaiting approval by another administrator' : 'Remediation job queued' };
    }
    async protectedList() {
        try {
            return { status: true, protected: await this.compliance.listProtected(this.resolveSchema()) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list protected software', error: error?.message ?? String(error), protected: [] };
        }
    }
    async addProtected(body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const entry = await this.audit.wrap(schema, actor, { action: 'compliance.protected.add', targetType: 'protected-software', targetLabel: body?.nameMatch, params: { ...body } }, () => this.compliance.addProtected(schema, actor, body?.nameMatch, body?.publisherMatch ?? null, body?.reason ?? null));
        return { status: true, entry };
    }
    async removeProtected(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        await this.audit.wrap(schema, actor, { action: 'compliance.protected.remove', targetType: 'protected-software', targetId: id }, () => this.compliance.removeProtected(schema, id));
        return { status: true };
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Compliance dashboard: per-policy counts, totals, top non-compliant devices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "policies", null);
__decorate([
    (0, common_1.Post)('policies'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'ADD'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Put)('policies/:id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Delete)('policies/:id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'DELETE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deletePolicy", null);
__decorate([
    (0, common_1.Post)('evaluate'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate every device against every enabled policy now' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "evaluate", null);
__decorate([
    (0, common_1.Get)('findings'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'VIEW'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('policyId')),
    __param(2, (0, common_1.Query)('deviceId')),
    __param(3, (0, common_1.Query)('severity')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "findings", null);
__decorate([
    (0, common_1.Post)('findings/:id/waive'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "waive", null);
__decorate([
    (0, common_1.Post)('findings/:id/unwaive'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "unwaive", null);
__decorate([
    (0, common_1.Post)('findings/:id/remediate'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create the remediation job (uninstall / install) — destructive, needs approval by another admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "remediate", null);
__decorate([
    (0, common_1.Get)('protected'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "protectedList", null);
__decorate([
    (0, common_1.Post)('protected'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'ADD'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "addProtected", null);
__decorate([
    (0, common_1.Delete)('protected/:id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'DELETE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "removeProtected", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Compliance'),
    (0, common_1.Controller)('discovery/compliance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], ComplianceController);
