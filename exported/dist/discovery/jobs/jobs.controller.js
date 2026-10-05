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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const job_registry_1 = require("./job.registry");
const jobs_service_1 = require("./jobs.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
let JobsController = class JobsController {
    constructor(jobs, audit, requestContext) {
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
    types() {
        return {
            status: true,
            types: Object.values(job_registry_1.JOB_TYPES).map((t) => ({
                type: t.type, label: t.label, tier: t.tier, needsApproval: t.tier === 'destructive', spec: t.spec,
            })),
        };
    }
    async create(body, req) {
        try {
            const schema = this.resolveSchema();
            const job = await this.jobs.createJob(schema, this.audit.actor(req), body);
            return { status: true, job, message: job.status === 'pending_approval' ? 'Job created — awaiting approval by another administrator' : 'Job queued' };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            console.error('Discovery createJob error:', error);
            return { status: false, message: 'Failed to create job', error: error?.message ?? String(error) };
        }
    }
    async list(status, type, deviceId, agentId, limit, offset) {
        try {
            const schema = this.resolveSchema();
            const { rows, total } = await this.jobs.list(schema, {
                status, type, deviceId, agentId,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            });
            return { status: true, jobs: rows, total };
        }
        catch (error) {
            console.error('Discovery listJobs error:', error);
            return { status: false, message: 'Failed to list jobs', error: error?.message ?? String(error), jobs: [], total: 0 };
        }
    }
    async get(id) {
        try {
            const schema = this.resolveSchema();
            const job = await this.jobs.get(schema, id);
            if (!job)
                return { status: false, message: 'Job not found' };
            return { status: true, job };
        }
        catch (error) {
            return { status: false, message: 'Failed to fetch job', error: error?.message ?? String(error) };
        }
    }
    async approve(id, body, req) {
        const schema = this.resolveSchema();
        const job = await this.jobs.approve(schema, this.audit.actor(req), id, { breakGlass: !!body?.breakGlass, reason: body?.reason ?? null });
        return { status: true, job };
    }
    async reject(id, body, req) {
        const schema = this.resolveSchema();
        const job = await this.jobs.reject(schema, this.audit.actor(req), id, body?.reason ?? null);
        return { status: true, job };
    }
    async cancel(id, body, req) {
        const schema = this.resolveSchema();
        const job = await this.jobs.cancel(schema, this.audit.actor(req), id, body?.reason ?? null);
        return { status: true, job };
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)('types'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Job type registry (labels, risk tiers, approval requirement)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "types", null);
__decorate([
    (0, common_1.Post)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a job for a device/agent (destructive types wait for approval)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'List jobs (queue + history)' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('deviceId')),
    __param(3, (0, common_1.Query)('agentId')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Job detail incl. progress + result' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending destructive job (maker–checker enforced)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pending job' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a pending/queued/running job' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "cancel", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Jobs'),
    (0, common_1.Controller)('discovery/jobs'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], JobsController);
