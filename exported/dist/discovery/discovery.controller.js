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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const request_context_service_1 = require("../common/context/request-context.service");
const discovery_config_service_1 = require("./config/discovery-config.service");
const discovery_service_1 = require("./discovery.service");
const device_interface_1 = require("./interfaces/device.interface");
const agent_repository_1 = require("./store/agent.repository");
const device_repository_1 = require("./store/device.repository");
const discovery_permissions_1 = require("./rbac/discovery-permissions");
function csvEscape(v) {
    const s = v === null || v === undefined ? '' : String(v);
    if (/[",\r\n]/.test(s))
        return `"${s.replace(/"/g, '""')}"`;
    return s;
}
let DiscoveryController = class DiscoveryController {
    constructor(discoveryService, deviceRepository, agentRepository, configService, requestContext) {
        this.discoveryService = discoveryService;
        this.deviceRepository = deviceRepository;
        this.agentRepository = agentRepository;
        this.configService = configService;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
        return schema;
    }
    async listDevices(category, segment, search) {
        try {
            const schema = this.resolveSchema();
            const devices = await this.deviceRepository.listDevices(schema, {
                category,
                segment,
                search,
            });
            return { status: true, devices, count: devices.length };
        }
        catch (error) {
            console.error('Discovery listDevices error:', error);
            return {
                status: false,
                message: 'Failed to list devices',
                error: error?.message ?? String(error),
                devices: [],
            };
        }
    }
    async getDevice(id) {
        try {
            const schema = this.resolveSchema();
            const device = await this.deviceRepository.getDevice(schema, id);
            if (!device) {
                return { status: false, message: 'Device not found' };
            }
            return { status: true, device };
        }
        catch (error) {
            console.error('Discovery getDevice error:', error);
            return {
                status: false,
                message: 'Failed to fetch device',
                error: error?.message ?? String(error),
            };
        }
    }
    async summary() {
        try {
            const schema = this.resolveSchema();
            const summary = await this.deviceRepository.summary(schema);
            return { status: true, ...summary };
        }
        catch (error) {
            console.error('Discovery summary error:', error);
            return {
                status: false,
                message: 'Failed to fetch summary',
                error: error?.message ?? String(error),
            };
        }
    }
    async status() {
        try {
            const schema = this.resolveSchema();
            const status = await this.discoveryService.getStatus(schema);
            return { status: true, ...status };
        }
        catch (error) {
            console.error('Discovery status error:', error);
            return {
                status: false,
                message: 'Failed to fetch status',
                error: error?.message ?? String(error),
            };
        }
    }
    async scan() {
        try {
            const schema = this.resolveSchema();
            return await this.discoveryService.runScan(schema);
        }
        catch (error) {
            console.error('Discovery scan error:', error);
            return {
                status: false,
                message: 'Failed to trigger scan',
                error: error?.message ?? String(error),
            };
        }
    }
    async reclassify() {
        try {
            const schema = this.resolveSchema();
            const updated = await this.deviceRepository.reclassifyAll(schema);
            return { status: true, updated };
        }
        catch (error) {
            console.error('Discovery reclassify error:', error);
            return {
                status: false,
                message: 'Failed to reclassify devices',
                error: error?.message ?? String(error),
            };
        }
    }
    async setDeviceType(body) {
        try {
            const schema = this.resolveSchema();
            const ids = Array.isArray(body?.ids) ? body.ids : [];
            const category = body?.category;
            if (!ids.length) {
                throw new common_1.BadRequestException('ids must be a non-empty array');
            }
            if (!category || !device_interface_1.DEVICE_CATEGORIES.includes(category)) {
                throw new common_1.BadRequestException(`category must be one of: ${device_interface_1.DEVICE_CATEGORIES.join(', ')}`);
            }
            const updated = await this.deviceRepository.setDeviceCategory(schema, ids, category);
            return { status: true, updated };
        }
        catch (error) {
            console.error('Discovery setDeviceType error:', error);
            return {
                status: false,
                message: error instanceof common_1.BadRequestException ? error.message : 'Failed to set device type',
                error: error?.message ?? String(error),
            };
        }
    }
    async exportDevicesCsv(res, filters) {
        try {
            const schema = this.resolveSchema();
            const devices = await this.deviceRepository.listDevices(schema, filters);
            const header = [
                'IP', 'MAC', 'Hostname', 'Domain', 'User', 'OS', 'Vendor', 'Category',
                'Confidence', 'Model', 'Segment', 'Open Ports', 'Services', 'Sources',
                'First Seen', 'Last Seen',
            ];
            const lines = [header.join(',')];
            for (const d of devices) {
                lines.push([
                    d.ip,
                    d.mac ?? '',
                    d.hostname ?? '',
                    d.domain ?? '',
                    d.currentUser ?? '',
                    d.os ?? '',
                    d.vendor ?? '',
                    d.category,
                    d.categoryConfidence,
                    d.model ?? '',
                    d.segment ?? '',
                    (d.openPorts || []).join(' '),
                    (d.services || []).join(' '),
                    (d.sources || []).join(' '),
                    d.firstSeen ?? '',
                    d.lastSeen ?? '',
                ]
                    .map(csvEscape)
                    .join(','));
            }
            const csv = String.fromCharCode(0xfeff) + lines.join('\r\n');
            const filename = `discovery-devices_${new Date().toISOString().slice(0, 10)}.csv`;
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.end(csv);
        }
        catch (error) {
            console.error('Discovery export devices.csv error:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to export devices',
                error: error?.message ?? String(error),
            });
        }
    }
    async exportSoftwareCsv(res, filters) {
        try {
            const schema = this.resolveSchema();
            const rows = await this.deviceRepository.listSoftwareInventory(schema, filters);
            const header = [
                'Device IP', 'Hostname', 'App Name', 'Version', 'Publisher',
                'Install Date', 'Architecture', 'Product Code', 'Reported At',
            ];
            const lines = [header.join(',')];
            for (const r of rows) {
                lines.push([
                    r.ip,
                    r.hostname ?? '',
                    r.name,
                    r.version ?? '',
                    r.publisher ?? '',
                    r.installDate ?? '',
                    r.architecture ?? '',
                    r.productCode ?? '',
                    r.reportedAt ?? '',
                ]
                    .map(csvEscape)
                    .join(','));
            }
            const csv = String.fromCharCode(0xfeff) + lines.join('\r\n');
            const filename = `discovery-software_${new Date().toISOString().slice(0, 10)}.csv`;
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.end(csv);
        }
        catch (error) {
            console.error('Discovery export software.csv error:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to export software',
                error: error?.message ?? String(error),
            });
        }
    }
    async listAgents() {
        try {
            const schema = this.resolveSchema();
            const agents = await this.agentRepository.listAgents(schema);
            return { status: true, agents, count: agents.length };
        }
        catch (error) {
            console.error('Discovery listAgents error:', error);
            return {
                status: false,
                message: 'Failed to list agents',
                error: error?.message ?? String(error),
                agents: [],
            };
        }
    }
    async createAgentJob(agentId, body) {
        try {
            const schema = this.resolveSchema();
            const type = (body?.type ?? '').trim().toUpperCase();
            if (!['INVENTORY_NOW', 'PING'].includes(type)) {
                throw new common_1.BadRequestException("type must be one of: INVENTORY_NOW, PING");
            }
            const job = await this.agentRepository.createJob(schema, agentId, type, body?.payload ?? null);
            return { status: true, job };
        }
        catch (error) {
            console.error('Discovery createAgentJob error:', error);
            return {
                status: false,
                message: error instanceof common_1.BadRequestException ? error.message : 'Failed to create agent job',
                error: error?.message ?? String(error),
            };
        }
    }
    async listAgentJobs(agentId) {
        try {
            const schema = this.resolveSchema();
            const jobs = await this.agentRepository.listJobs(schema, agentId);
            return { status: true, jobs };
        }
        catch (error) {
            console.error('Discovery listAgentJobs error:', error);
            return {
                status: false,
                message: 'Failed to list agent jobs',
                error: error?.message ?? String(error),
                jobs: [],
            };
        }
    }
    async revokeAgent(agentId) {
        try {
            const schema = this.resolveSchema();
            const revoked = await this.agentRepository.revokeAgent(schema, agentId);
            if (!revoked) {
                return { status: false, message: 'Agent not found or already revoked' };
            }
            return { status: true };
        }
        catch (error) {
            console.error('Discovery revokeAgent error:', error);
            return {
                status: false,
                message: 'Failed to revoke agent',
                error: error?.message ?? String(error),
            };
        }
    }
    async getConfig() {
        try {
            const schema = this.resolveSchema();
            const config = await this.configService.getConfig(schema);
            return { status: true, config };
        }
        catch (error) {
            console.error('Discovery getConfig error:', error);
            return {
                status: false,
                message: 'Failed to fetch config',
                error: error?.message ?? String(error),
            };
        }
    }
    async updateConfig(patch) {
        try {
            const schema = this.resolveSchema();
            const config = await this.configService.updateConfig(schema, patch);
            return { status: true, config };
        }
        catch (error) {
            console.error('Discovery updateConfig error:', error);
            return {
                status: false,
                message: 'Failed to update config',
                error: error?.message ?? String(error),
            };
        }
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('devices'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'List discovered devices (filter by category/segment/search)' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('segment')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "listDevices", null);
__decorate([
    (0, common_1.Get)('devices/:id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Device detail + installed software' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getDevice", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Inventory counts by category / segment + last run' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Current/last scan status + scanner availability' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('scan'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger an on-demand discovery scan' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)('reclassify'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'EDIT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Re-run the classifier + OS derivation against every stored device (no network scan). ' +
            'Devices manually overridden via set-type are skipped.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "reclassify", null);
__decorate([
    (0, common_1.Post)('devices/set-type'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'EDIT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Manually set the category for one or more devices (pins confidence to 1 and marks ' +
            'them protected from future automated re-classification / re-scan overwrites).',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "setDeviceType", null);
__decorate([
    (0, common_1.Post)('export/devices.csv'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'EXPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Export full device inventory as CSV' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "exportDevicesCsv", null);
__decorate([
    (0, common_1.Post)('export/software.csv'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Dashboard, 'EXPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Export installed software inventory as CSV (one row per app per machine)' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "exportSoftwareCsv", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'VIEW'),
    (0, swagger_1.ApiOperation)({
        summary: 'List registered Windows Agents with computed online/offline status (heartbeat within 5 minutes = online)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "listAgents", null);
__decorate([
    (0, common_1.Post)('agents/:id/jobs'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Queue a job for an agent (Phase 1 job types: INVENTORY_NOW, PING). The agent claims it ' +
            'on its next poll and reports a result.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "createAgentJob", null);
__decorate([
    (0, common_1.Get)('agents/:id/jobs'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Job history for one agent (most recent first)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "listAgentJobs", null);
__decorate([
    (0, common_1.Post)('agents/:id/revoke'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Revoke an agent identity — its key stops authenticating immediately (e.g. a ' +
            'decommissioned or compromised endpoint).',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "revokeAgent", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Config, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the org discovery configuration' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)('config'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Config, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the org discovery configuration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "updateConfig", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, swagger_1.ApiTags)('Discovery'),
    (0, common_1.Controller)('discovery'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService,
        device_repository_1.DeviceRepository,
        agent_repository_1.AgentRepository,
        discovery_config_service_1.DiscoveryConfigService,
        request_context_service_1.RequestContextService])
], DiscoveryController);
