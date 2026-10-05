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
exports.EndpointController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const jobs_service_1 = require("../jobs/jobs.service");
const phase2_types_1 = require("../phase2.types");
const device_repository_1 = require("../store/device.repository");
const endpoint_repository_1 = require("./endpoint.repository");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const SERVICE_NAME_RE = /^[A-Za-z0-9_.\-$ ]{1,256}$/;
const TARGET_RE = /^[A-Za-z0-9.\-:_]{1,253}$/;
const LOG_NAME_RE = /^[A-Za-z0-9 _\-\/]{1,128}$/;
let EndpointController = class EndpointController {
    constructor(endpoint, devices, jobs, audit, requestContext) {
        this.endpoint = endpoint;
        this.devices = devices;
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
    async deviceLabel(schema, id) {
        const d = await this.devices.getDevice(schema, id);
        if (!d)
            throw new common_1.BadRequestException('Device not found');
        return d.hostname || d.ip || `device ${id}`;
    }
    async listServices(id) {
        try {
            const schema = this.resolveSchema();
            const services = await this.endpoint.listServices(schema, id);
            return { status: true, services, collectedAt: services[0]?.collectedAt ?? null };
        }
        catch (error) {
            return { status: false, message: 'Failed to list services', error: error?.message ?? String(error), services: [] };
        }
    }
    async refreshServices(id, req) {
        const schema = this.resolveSchema();
        const label = await this.deviceLabel(schema, id);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), { type: 'SERVICE_LIST', deviceId: id, targetLabel: label });
        return { status: true, job };
    }
    async controlService(id, name, body, req) {
        const schema = this.resolveSchema();
        if (!SERVICE_NAME_RE.test(name))
            throw new common_1.BadRequestException('Invalid service name');
        const action = body?.action;
        if (!['start', 'stop', 'restart', 'set-startup'].includes(action)) {
            throw new common_1.BadRequestException('action must be start | stop | restart | set-startup');
        }
        if (action === 'set-startup' && !['Automatic', 'Manual', 'Disabled'].includes(body?.startType)) {
            throw new common_1.BadRequestException('startType must be Automatic | Manual | Disabled');
        }
        const label = await this.deviceLabel(schema, id);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'SERVICE_CONTROL',
            deviceId: id,
            targetLabel: `${label} · ${name} · ${action}${body.startType ? ` (${body.startType})` : ''}`,
            payload: { serviceName: name, action, startType: body.startType ?? null },
        });
        return { status: true, job, message: job.status === 'pending_approval' ? 'Service control request created — awaiting approval by another administrator' : 'Service control queued' };
    }
    async listEvents(id, logName, level, limit) {
        try {
            const schema = this.resolveSchema();
            const events = await this.endpoint.listEvents(schema, id, { logName, level, limit: limit ? Number(limit) : undefined });
            return { status: true, events };
        }
        catch (error) {
            return { status: false, message: 'Failed to list events', error: error?.message ?? String(error), events: [] };
        }
    }
    async collectEvents(id, body, req) {
        const schema = this.resolveSchema();
        const logNames = (body?.logNames?.length ? body.logNames : ['System', 'Application']).slice(0, 8);
        if (logNames.some((l) => !LOG_NAME_RE.test(l)))
            throw new common_1.BadRequestException('Invalid log name');
        const levels = (body?.levels ?? ['Critical', 'Error', 'Warning']).filter((l) => ['Critical', 'Error', 'Warning', 'Information'].includes(l));
        const maxEntries = Math.min(Math.max(Number(body?.maxEntries) || 200, 1), 2000);
        const sinceHours = Math.min(Math.max(Number(body?.sinceHours) || 24, 1), 24 * 30);
        const label = await this.deviceLabel(schema, id);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'EVENTLOG_QUERY', deviceId: id, targetLabel: `${label} · ${logNames.join(',')}`,
            payload: { logNames, levels, maxEntries, sinceHours },
        });
        return { status: true, job };
    }
    async listPerf(id, hours) {
        try {
            const schema = this.resolveSchema();
            const samples = await this.endpoint.listPerfSamples(schema, id, hours ? Number(hours) : 24);
            return { status: true, samples };
        }
        catch (error) {
            return { status: false, message: 'Failed to list performance samples', error: error?.message ?? String(error), samples: [] };
        }
    }
    async samplePerf(id, body, req) {
        const schema = this.resolveSchema();
        const samples = Math.min(Math.max(Number(body?.samples) || 12, 1), 120);
        const intervalSeconds = Math.min(Math.max(Number(body?.intervalSeconds) || 5, 1), 60);
        const label = await this.deviceLabel(schema, id);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'PERF_SAMPLE', deviceId: id, targetLabel: label, payload: { samples, intervalSeconds },
        });
        return { status: true, job };
    }
    async listNetDiag(deviceId, limit) {
        try {
            const schema = this.resolveSchema();
            const runs = await this.endpoint.listNetDiagRuns(schema, deviceId, limit ? Number(limit) : 50);
            return { status: true, runs };
        }
        catch (error) {
            return { status: false, message: 'Failed to list diagnostic runs', error: error?.message ?? String(error), runs: [] };
        }
    }
    async runNetDiag(id, body, req) {
        const schema = this.resolveSchema();
        const tool = body?.tool;
        if (!phase2_types_1.NET_DIAG_TOOLS.includes(tool))
            throw new common_1.BadRequestException(`tool must be one of ${phase2_types_1.NET_DIAG_TOOLS.join(', ')}`);
        const target = (body?.target || '').trim();
        if (!TARGET_RE.test(target))
            throw new common_1.BadRequestException('target must be a hostname or IP address (no spaces or shell characters)');
        const port = body?.port === undefined ? null : Number(body.port);
        if (port !== null && (!Number.isInteger(port) || port < 1 || port > 65535))
            throw new common_1.BadRequestException('port must be 1–65535');
        if (tool === 'tcp-port' && port === null)
            throw new common_1.BadRequestException('port is required for tcp-port');
        const count = Math.min(Math.max(Number(body?.count) || 4, 1), 20);
        const timeoutSeconds = Math.min(Math.max(Number(body?.timeoutSeconds) || 30, 5), 120);
        const label = await this.deviceLabel(schema, id);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'NET_DIAG', deviceId: id, targetLabel: `${label} · ${tool} ${target}${port ? ':' + port : ''}`,
            payload: { tool, target, port, count, timeoutSeconds },
        });
        return { status: true, job };
    }
};
exports.EndpointController = EndpointController;
__decorate([
    (0, common_1.Get)('devices/:id/services'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Last collected Windows services snapshot for a device' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "listServices", null);
__decorate([
    (0, common_1.Post)('devices/:id/services/refresh'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue a SERVICE_LIST job to refresh the services snapshot' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "refreshServices", null);
__decorate([
    (0, common_1.Post)('devices/:id/services/:name/control'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Start / stop / restart / set startup type (destructive → requires approval)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "controlService", null);
__decorate([
    (0, common_1.Get)('devices/:id/events'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Collected event-log entries for a device' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('logName')),
    __param(2, (0, common_1.Query)('level')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "listEvents", null);
__decorate([
    (0, common_1.Post)('devices/:id/events/collect'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue an EVENTLOG_QUERY job (log names, levels, max entries, since hours)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "collectEvents", null);
__decorate([
    (0, common_1.Get)('devices/:id/perf'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Performance samples for a device (default last 24h)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "listPerf", null);
__decorate([
    (0, common_1.Post)('devices/:id/perf/sample'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue a PERF_SAMPLE job (agent samples N times at an interval, then reports)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "samplePerf", null);
__decorate([
    (0, common_1.Get)('netdiag'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Network diagnostic run history' }),
    __param(0, (0, common_1.Query)('deviceId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "listNetDiag", null);
__decorate([
    (0, common_1.Post)('devices/:id/netdiag'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Jobs, 'ADD'),
    (0, swagger_1.ApiOperation)({ summary: 'Run an ALLOWLISTED network tool from the endpoint (ping/tracert/pathping/nbtstat/http/https/tcp-port)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "runNetDiag", null);
exports.EndpointController = EndpointController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Endpoint Management'),
    (0, common_1.Controller)('discovery'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [endpoint_repository_1.EndpointRepository,
        device_repository_1.DeviceRepository,
        jobs_service_1.JobsService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], EndpointController);
