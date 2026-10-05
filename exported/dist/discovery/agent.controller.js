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
var AgentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const agent_repository_1 = require("./store/agent.repository");
const device_repository_1 = require("./store/device.repository");
const jobs_service_1 = require("./jobs/jobs.service");
const credential_service_1 = require("./credentials/credential.service");
const agent_push_service_1 = require("./agents/agent-push.service");
const compliance_service_1 = require("./software/compliance.service");
const package_service_1 = require("./software/package.service");
const software_inventory_service_1 = require("./import/software-inventory.service");
const auto_collect_service_1 = require("./endpoint/auto-collect.service");
const software_util_1 = require("./software/software.util");
let AgentController = AgentController_1 = class AgentController {
    constructor(deviceRepository, agentRepository, jobs, credentials, push, compliance, packages, softwareInventory, autoCollect) {
        this.deviceRepository = deviceRepository;
        this.agentRepository = agentRepository;
        this.jobs = jobs;
        this.credentials = credentials;
        this.push = push;
        this.compliance = compliance;
        this.packages = packages;
        this.softwareInventory = softwareInventory;
        this.autoCollect = autoCollect;
        this.logger = new common_1.Logger(AgentController_1.name);
    }
    async report(body, agentToken, agentUuid, agentKey, orgSchemaHeader, onBehalfHeader, req) {
        try {
            const schema = this.resolveSchema(orgSchemaHeader);
            const onBehalf = onBehalfHeader === 'true';
            let reportingAgentId = null;
            if (agentUuid || agentKey) {
                const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
                reportingAgentId = agent.id;
            }
            else {
                this.checkEnrolmentToken(agentToken);
            }
            const ip = body?.network?.ip || req.ip || req.socket?.remoteAddress || '';
            if (!ip) {
                return { status: false, message: 'Could not determine device IP from report or connection' };
            }
            const specs = {
                ...body,
                reportedAt: body?.reportedAt || new Date().toISOString(),
                softwareCount: body?.software?.length ?? body?.softwareCount,
            };
            const device = {
                ip,
                mac: body?.network?.mac ?? null,
                hostname: body?.hostname ?? null,
                domain: body?.domain ?? null,
                currentUser: body?.currentUser ?? null,
                os: body?.os?.caption ?? null,
                vendor: null,
                category: 'unknown',
                categoryConfidence: 0,
                model: body?.system?.model ?? null,
                segment: null,
                openPorts: [],
                services: [],
                sources: ['agent'],
                specs,
            };
            const [saved] = await this.deviceRepository.upsertDevices(schema, [device]);
            if (saved?.id && Array.isArray(body?.software)) {
                await this.deviceRepository.replaceSoftware(schema, saved.id, body.software);
                this.compliance.evaluateDevice(schema, String(saved.id)).catch((err) => this.logger.debug(`compliance evaluation for device ${saved.id} failed: ${err?.message}`));
                this.softwareInventory.reconcileDevice(schema, Number(saved.id)).catch((err) => this.logger.debug(`software inventory reconcile for device ${saved.id} failed: ${err?.message}`));
            }
            if (saved?.id && reportingAgentId && !onBehalf) {
                await this.agentRepository.linkDevice(schema, reportingAgentId, saved.id);
                this.autoCollect
                    .bootstrapForDevice(schema, saved.id, reportingAgentId, body?.hostname ?? ip)
                    .catch((err) => this.logger.debug(`auto-collect bootstrap for device ${saved.id} failed: ${err?.message}`));
            }
            return { status: true };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ServiceUnavailableException) {
                throw error;
            }
            this.logger.error(`Agent report failed: ${error?.message ?? error}`);
            return {
                status: false,
                message: 'Failed to record agent report',
                error: error?.message ?? String(error),
            };
        }
    }
    async register(body, enrolmentToken, orgSchemaHeader, req) {
        this.checkEnrolmentToken(enrolmentToken);
        const schema = this.resolveSchema(orgSchemaHeader);
        const registered = await this.agentRepository.registerAgent(schema, {
            hostname: body?.hostname ?? null,
            ip: body?.ip || req.ip || req.socket?.remoteAddress || null,
            os: body?.os ?? null,
            version: body?.version ?? null,
        });
        this.logger.log(`Agent registered: ${registered.agentUuid} (${body?.hostname ?? 'unknown host'}) in ${schema}`);
        void this.push.onAgentRegistered(schema, registered.agentId, body?.hostname ?? null);
        return {
            status: true,
            agentId: registered.agentUuid,
            agentKey: registered.agentKey,
        };
    }
    async heartbeat(body, agentUuid, agentKey, orgSchemaHeader, req) {
        const schema = this.resolveSchema(orgSchemaHeader);
        const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
        await this.agentRepository.heartbeat(schema, agent.id, {
            ip: body?.ip || req.ip || req.socket?.remoteAddress || null,
            version: body?.version ?? null,
        });
        return { status: true };
    }
    async pollJobs(max, agentUuid, agentKey, orgSchemaHeader) {
        const schema = this.resolveSchema(orgSchemaHeader);
        const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
        const limit = Math.min(Math.max(parseInt(max ?? '3', 10) || 3, 1), 10);
        const jobs = await this.agentRepository.claimJobs(schema, agent.id, limit);
        const wire = [];
        for (const job of jobs) {
            let payload = { ...(job.payload ?? {}) };
            if ((job.type === 'SOFTWARE_INSTALL' || job.type === 'AGENT_PUSH_INSTALL') && job.payload?.packageId) {
                try {
                    const pkgId = String(job.payload.packageId);
                    const t = (0, software_util_1.packageDownloadToken)(schema, pkgId, agent.id, job.id);
                    payload = { ...payload, download: { path: `/discovery/agent/packages/${pkgId}/download`, token: t.token, expiresAt: t.expiresAt } };
                }
                catch (err) {
                    this.logger.warn(`Job ${job.id}: download token could not be issued: ${err?.message}`);
                    payload = { ...payload, downloadError: err?.message };
                }
            }
            const credId = job.payload?.credentialId;
            if (credId) {
                try {
                    const cred = await this.credentials.materializeForAgent(schema, String(credId));
                    payload = { ...payload, credential: cred };
                }
                catch (err) {
                    this.logger.warn(`Job ${job.id}: credential ${credId} could not be materialised: ${err?.message}`);
                    payload = { ...payload, credentialError: err?.message };
                }
            }
            wire.push({ ...job, payload });
        }
        return { status: true, jobs: wire };
    }
    async downloadPackage(packageId, token, agentUuid, agentKey, orgSchemaHeader, res) {
        const schema = this.resolveSchema(orgSchemaHeader);
        const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
        const v = (0, software_util_1.verifyPackageDownloadToken)(token, schema, packageId, agent.id);
        if (!v.ok)
            throw new common_1.UnauthorizedException(`Package download refused: ${v.reason}`);
        const f = await this.packages.fileForDownload(schema, packageId);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', String(f.sizeBytes));
        res.setHeader('Content-Disposition', `attachment; filename="${f.fileName}"`);
        res.setHeader('X-Checksum-Sha256', f.sha256);
        (0, fs_1.createReadStream)(f.path).on('error', () => { if (!res.headersSent)
            res.status(500); res.end(); }).pipe(res);
    }
    async jobProgress(jobId, body, agentUuid, agentKey, orgSchemaHeader) {
        const schema = this.resolveSchema(orgSchemaHeader);
        const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
        const job = await this.jobs.progress(schema, agent.id, jobId, { ...body, at: new Date().toISOString() });
        if (!job)
            throw new common_1.BadRequestException('Job not found, not claimed by this agent, or already finished');
        return { status: true, job };
    }
    async jobResult(jobId, body, agentUuid, agentKey, orgSchemaHeader) {
        const schema = this.resolveSchema(orgSchemaHeader);
        const agent = await this.agentRepository.authenticateAgent(schema, agentUuid ?? '', agentKey ?? '');
        const status = body?.status === 'failed' ? 'failed' : 'succeeded';
        const job = await this.agentRepository.completeJob(schema, agent.id, jobId, {
            status,
            result: body?.result ?? null,
            error: body?.error ?? null,
            exitCode: body?.exitCode ?? null,
            logRef: body?.logRef ?? null,
        });
        if (!job) {
            throw new common_1.BadRequestException('Job not found, not claimed by this agent, or already finished');
        }
        await this.jobs.onResult(schema, job);
        return { status: true, job };
    }
    checkEnrolmentToken(token) {
        const expected = process.env.DISCOVERY_AGENT_TOKEN;
        if (!expected) {
            this.logger.error('DISCOVERY_AGENT_TOKEN is not set — rejecting agent request. Configure DISCOVERY_AGENT_TOKEN to enable the agent ingest endpoints.');
            throw new common_1.ServiceUnavailableException('Agent ingest is not configured on this server (DISCOVERY_AGENT_TOKEN is unset)');
        }
        if (token !== expected) {
            throw new common_1.UnauthorizedException('Invalid or missing x-agent-token header');
        }
    }
    resolveSchema(headerSchema) {
        if (headerSchema && /^org_[A-Za-z0-9_]+$/.test(headerSchema)) {
            return headerSchema;
        }
        const fallback = process.env.DISCOVERY_DEFAULT_SCHEMA;
        if (fallback && /^org_[A-Za-z0-9_]+$/.test(fallback)) {
            return fallback;
        }
        throw new common_1.BadRequestException("Could not resolve organization schema: send a valid 'x-org-schema' header (org_<name>) or configure DISCOVERY_DEFAULT_SCHEMA");
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Post)('report'),
    (0, swagger_1.ApiOperation)({ summary: 'Collector ingestion — deep specs + software inventory from an installed agent' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-agent-token')),
    __param(2, (0, common_1.Headers)('x-agent-id')),
    __param(3, (0, common_1.Headers)('x-agent-key')),
    __param(4, (0, common_1.Headers)('x-org-schema')),
    __param(5, (0, common_1.Headers)('x-agent-on-behalf')),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "report", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'One-time agent enrolment: exchanges the org enrolment token for a per-agent identity. ' +
            'The returned agentKey is shown once and never stored server-side in plaintext.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-agent-token')),
    __param(2, (0, common_1.Headers)('x-org-schema')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('heartbeat'),
    (0, swagger_1.ApiOperation)({ summary: 'Periodic agent heartbeat — drives online/offline status in the portal' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-agent-id')),
    __param(2, (0, common_1.Headers)('x-agent-key')),
    __param(3, (0, common_1.Headers)('x-org-schema')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "heartbeat", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Agent polls for work. Atomically claims up to ?max queued jobs for this agent ' +
            '(FOR UPDATE SKIP LOCKED — concurrent polls can never double-claim).',
    }),
    __param(0, (0, common_1.Query)('max')),
    __param(1, (0, common_1.Headers)('x-agent-id')),
    __param(2, (0, common_1.Headers)('x-agent-key')),
    __param(3, (0, common_1.Headers)('x-org-schema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "pollJobs", null);
__decorate([
    (0, common_1.Get)('packages/:id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent downloads an approved package (per-job HMAC token + agent key; never public)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Headers)('x-agent-id')),
    __param(3, (0, common_1.Headers)('x-agent-key')),
    __param(4, (0, common_1.Headers)('x-org-schema')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "downloadPackage", null);
__decorate([
    (0, common_1.Post)('jobs/:id/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent progress heartbeat for a long-running job (marks it running)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-agent-id')),
    __param(3, (0, common_1.Headers)('x-agent-key')),
    __param(4, (0, common_1.Headers)('x-org-schema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "jobProgress", null);
__decorate([
    (0, common_1.Post)('jobs/:id/result'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent reports the terminal result of a claimed job' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-agent-id')),
    __param(3, (0, common_1.Headers)('x-agent-key')),
    __param(4, (0, common_1.Headers)('x-org-schema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "jobResult", null);
exports.AgentController = AgentController = AgentController_1 = __decorate([
    (0, swagger_1.ApiTags)('Discovery Agent'),
    (0, common_1.Controller)('discovery/agent'),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository,
        agent_repository_1.AgentRepository,
        jobs_service_1.JobsService,
        credential_service_1.CredentialService,
        agent_push_service_1.AgentPushService,
        compliance_service_1.ComplianceService,
        package_service_1.PackageService,
        software_inventory_service_1.SoftwareInventoryService,
        auto_collect_service_1.EndpointAutoCollectService])
], AgentController);
