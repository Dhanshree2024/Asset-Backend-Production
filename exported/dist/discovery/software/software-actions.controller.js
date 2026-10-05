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
exports.SoftwareActionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const jobs_service_1 = require("../jobs/jobs.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const compliance_repository_1 = require("./compliance.repository");
const compliance_service_1 = require("./compliance.service");
const deployment_service_1 = require("./deployment.service");
const package_service_1 = require("./package.service");
const software_util_1 = require("./software.util");
let SoftwareActionsController = class SoftwareActionsController {
    constructor(compliance, complianceRepo, packages, jobs, audit, requestContext) {
        this.compliance = compliance;
        this.complianceRepo = complianceRepo;
        this.packages = packages;
        this.jobs = jobs;
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema))
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        return schema;
    }
    async software(deviceId) {
        const schema = this.resolveSchema();
        const [rows, prot] = await Promise.all([this.complianceRepo.installedSoftware(schema, deviceId), this.complianceRepo.listProtected(schema)]);
        return {
            status: true,
            software: rows.map((s) => {
                const p = (0, software_util_1.isProtected)(prot, s.name, s.publisher);
                const canUninstall = !p && (!!s.productCode || !!s.uninstallString);
                return { ...s, protected: !!p, protectedReason: p?.reason ?? null, canUninstall, isMsi: !!s.productCode || /msiexec/i.test(s.uninstallString ?? '') };
            }),
        };
    }
    async compliance_(deviceId) {
        return { status: true, findings: await this.compliance.findingsForDevice(this.resolveSchema(), deviceId) };
    }
    async install(deviceId, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        if (!body?.packageId)
            throw new common_1.BadRequestException('packageId is required');
        const pkg = await this.packages.get(schema, String(body.packageId));
        if (pkg.status !== 'approved')
            throw new common_1.BadRequestException(`Package '${pkg.name} ${pkg.version}' is ${pkg.status} — only approved packages can be installed`);
        const job = await this.jobs.createJob(schema, actor, {
            type: 'SOFTWARE_INSTALL', deviceId, targetLabel: `${pkg.name} ${pkg.version}`,
            payload: deployment_service_1.DeploymentService.installPayload(pkg, { rebootPolicy: 'never' }), maxAttempts: 2,
        });
        return { status: true, job, message: job.status === 'pending_approval' ? 'Install request created — awaiting approval by another administrator' : 'Install queued' };
    }
    async uninstall(deviceId, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        if (!body?.softwareId)
            throw new common_1.BadRequestException('softwareId is required');
        const job = await this.audit.wrap(schema, actor, { action: 'software.uninstall.request', targetType: 'device', targetId: deviceId, params: { softwareId: body.softwareId, silentArgs: body.silentArgs ?? null } }, () => this.compliance.uninstall(schema, actor, deviceId, String(body.softwareId), body.silentArgs ?? null));
        return { status: true, job, message: job.status === 'pending_approval' ? 'Uninstall request created — awaiting approval by another administrator' : 'Uninstall queued' };
    }
};
exports.SoftwareActionsController = SoftwareActionsController;
__decorate([
    (0, common_1.Get)(':id/software'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Installed software with uninstall metadata and protected flag' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SoftwareActionsController.prototype, "software", null);
__decorate([
    (0, common_1.Get)(':id/compliance'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'VIEW'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SoftwareActionsController.prototype, "compliance_", null);
__decorate([
    (0, common_1.Post)(':id/software/install'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Deployments, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Install an approved package on one device (destructive → approval)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SoftwareActionsController.prototype, "install", null);
__decorate([
    (0, common_1.Post)(':id/software/uninstall'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Compliance, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Controlled uninstall of one installed program (destructive → approval; protected list enforced)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SoftwareActionsController.prototype, "uninstall", null);
exports.SoftwareActionsController = SoftwareActionsController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Software Actions'),
    (0, common_1.Controller)('discovery/devices'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService,
        compliance_repository_1.ComplianceRepository,
        package_service_1.PackageService,
        jobs_service_1.JobsService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], SoftwareActionsController);
