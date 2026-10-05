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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_service_1 = require("../audit/audit.service");
const phase2_types_1 = require("../phase2.types");
const agent_repository_1 = require("../store/agent.repository");
const credential_repository_1 = require("../credentials/credential.repository");
const endpoint_repository_1 = require("../endpoint/endpoint.repository");
const job_registry_1 = require("./job.registry");
const maintenance_window_1 = require("../config/maintenance-window");
const phase2_settings_repository_1 = require("../settings/phase2-settings.repository");
let JobsService = JobsService_1 = class JobsService {
    constructor(dataSource, agents, audit, credentials, endpoint, settings) {
        this.dataSource = dataSource;
        this.agents = agents;
        this.audit = audit;
        this.credentials = credentials;
        this.endpoint = endpoint;
        this.settings = settings;
        this.logger = new common_1.Logger(JobsService_1.name);
        this.terminalHooks = [];
        this.progressHooks = [];
    }
    async createJob(schema, actor, input) {
        const type = (input.type || '').toUpperCase();
        console.log('[JobsService] createJob requested', {
            schema, type, deviceId: input.deviceId ?? null, agentId: input.agentId ?? null,
            scheduledFor: input.scheduledFor ?? null,
        });
        const meta = (0, job_registry_1.jobTypeMeta)(type);
        if (!meta || !(0, job_registry_1.isKnownJobType)(type)) {
            throw new common_1.BadRequestException(`Unknown job type '${input.type}'`);
        }
        let agentId = input.agentId ?? null;
        if (!agentId && input.deviceId) {
            agentId = await this.agents.resolveAgentForDevice(schema, String(input.deviceId));
            if (!agentId) {
                throw new common_1.BadRequestException('No registered agent is linked to this device — install the Windows Agent on it first');
            }
        }
        if (!agentId)
            throw new common_1.BadRequestException('deviceId or agentId is required');
        const needsApproval = (0, job_registry_1.jobNeedsApproval)(type);
        let scheduledFor = input.scheduledFor ?? null;
        let deferredToWindow = false;
        if (meta.tier === 'destructive' && !scheduledFor) {
            try {
                const { maintenanceWindow } = await this.settings.get(schema);
                const at = (0, maintenance_window_1.nextDispatchTime)(new Date(), maintenanceWindow);
                if (at) {
                    scheduledFor = at.toISOString();
                    deferredToWindow = true;
                }
            }
            catch (err) {
                this.logger.warn(`maintenance window lookup failed for ${schema}: ${err?.message}`);
            }
        }
        const job = await this.agents.createJob(schema, agentId, type, input.payload ?? null, input.maxAttempts ?? 3, {
            deviceId: input.deviceId ?? null,
            targetLabel: input.targetLabel ?? null,
            priority: input.priority,
            requestedBy: actor.userId,
            requestedByName: actor.name,
            needsApproval,
            scheduledFor,
            ttlMinutes: meta.ttlMinutes,
            approvedBy: input.preApprovedBy?.userId ?? undefined,
            approvedByName: input.preApprovedBy?.name ?? undefined,
        });
        console.log('[JobsService] createJob created', {
            schema, jobId: job.id, type: job.type, status: job.status,
            agentId: job.agentId, scheduledFor: job.scheduledFor, expiresAt: job.expiresAt,
        });
        await this.audit.record(schema, actor, {
            action: meta.auditAction,
            targetType: input.deviceId ? 'device' : 'agent',
            targetId: input.deviceId ?? agentId,
            targetLabel: input.targetLabel ?? null,
            params: { jobId: job.id, type, payload: input.payload ?? null, needsApproval, scheduledFor, deferredToWindow, preApprovedBy: input.preApprovedBy ?? null },
            result: needsApproval && !input.preApprovedBy ? 'pending' : 'ok',
            jobId: job.id,
        });
        return job;
    }
    async approve(schema, actor, jobId, opts = {}) {
        console.log('[JobsService] approve requested', { schema, jobId, actorUserId: actor.userId, breakGlass: !!opts.breakGlass });
        const job = await this.agents.getJob(schema, jobId);
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.status !== 'pending_approval') {
            throw new common_1.BadRequestException(`Job is '${job.status}', not pending approval`);
        }
        if (actor.userId === null)
            throw new common_1.BadRequestException('Approver identity could not be resolved');
        const selfApproval = job.requestedBy !== null && job.requestedBy === actor.userId;
        if (selfApproval && !opts.breakGlass) {
            await this.audit.record(schema, actor, {
                action: 'job.approve', targetType: 'job', targetId: jobId, result: 'denied',
                error: 'Maker–checker: the requester cannot approve their own job', jobId,
            });
            throw new common_1.BadRequestException('You requested this job — a different administrator must approve it (or use break-glass with a reason)');
        }
        if (selfApproval && opts.breakGlass && !(opts.reason && opts.reason.trim().length >= 10)) {
            throw new common_1.BadRequestException('Break-glass approval requires a reason of at least 10 characters');
        }
        const updated = await this.agents.approveJob(schema, jobId, { userId: actor.userId, name: actor.name }, { dispatchNow: !!opts.breakGlass });
        if (!updated)
            throw new common_1.BadRequestException('Job could not be approved (state changed)');
        console.log('[JobsService] approve status changed', { schema, jobId, from: job.status, to: updated.status, expiresAt: updated.expiresAt });
        await this.audit.record(schema, actor, {
            action: selfApproval ? 'job.approve.BREAK_GLASS' : 'job.approve', targetType: 'job', targetId: jobId,
            targetLabel: `${job.type} → ${job.targetLabel ?? job.deviceId ?? job.agentId}`,
            params: selfApproval ? { breakGlass: true, reason: opts.reason } : null, jobId,
        });
        return updated;
    }
    async reject(schema, actor, jobId, reason) {
        console.log('[JobsService] reject requested', { schema, jobId, actorUserId: actor.userId });
        const job = await this.agents.getJob(schema, jobId);
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.status !== 'pending_approval') {
            throw new common_1.BadRequestException(`Job is '${job.status}', not pending approval`);
        }
        const updated = await this.agents.rejectJob(schema, jobId, { userId: actor.userId, name: actor.name }, reason);
        if (!updated)
            throw new common_1.BadRequestException('Job could not be rejected (state changed)');
        console.log('[JobsService] reject status changed', { schema, jobId, from: job.status, to: updated.status });
        await this.audit.record(schema, actor, {
            action: 'job.reject', targetType: 'job', targetId: jobId, params: { reason }, jobId,
        });
        return updated;
    }
    async cancel(schema, actor, jobId, reason) {
        console.log('[JobsService] cancel requested', { schema, jobId, actorUserId: actor.userId });
        const updated = await this.agents.cancelJob(schema, jobId, actor.userId, reason);
        if (!updated)
            throw new common_1.BadRequestException('Job not found or already finished');
        console.log('[JobsService] cancel status changed', { schema, jobId, status: updated.status });
        await this.audit.record(schema, actor, {
            action: 'job.cancel', targetType: 'job', targetId: jobId, params: { reason }, jobId,
        });
        return updated;
    }
    list(schema, filters) {
        console.log('[JobsService] list requested', { schema, filters });
        return this.agents.listJobsFiltered(schema, filters).then((result) => {
            console.log('[JobsService] list returned', { schema, total: result.total, returned: result.rows.length });
            return result;
        });
    }
    get(schema, jobId) {
        console.log('[JobsService] get requested', { schema, jobId });
        return this.agents.getJob(schema, jobId).then((job) => {
            console.log('[JobsService] get returned', { schema, jobId, found: !!job, status: job?.status ?? null });
            return job;
        });
    }
    registerTerminalHook(fn) { this.terminalHooks.push(fn); }
    registerProgressHook(fn) { this.progressHooks.push(fn); }
    async progress(schema, agentId, jobId, progress) {
        console.log('[JobsService] progress received', { schema, agentId, jobId, percent: progress.percent, step: progress.step });
        const job = await this.agents.updateProgress(schema, agentId, jobId, { ...progress });
        console.log('[JobsService] progress status updated', { schema, jobId, found: !!job, status: job?.status ?? null });
        if (job)
            for (const h of this.progressHooks) {
                try {
                    await h(schema, jobId, progress);
                }
                catch (err) {
                    this.logger.debug(`progress hook: ${err?.message}`);
                }
            }
        return job;
    }
    async onResult(schema, job) {
        console.log('[JobsService] result received', { schema, jobId: job.id, type: job.type, status: job.status, attempt: job.attempt });
        if (phase2_types_1.TERMINAL_JOB_STATUSES.includes(job.status)) {
            for (const h of this.terminalHooks) {
                try {
                    await h(schema, job);
                }
                catch (err) {
                    this.logger.error(`terminal hook failed for job ${job.id}: ${err?.message}`);
                }
            }
        }
        if (job.status !== 'succeeded' || !job.result)
            return;
        const r = job.result;
        try {
            switch (job.type) {
                case 'SERVICE_LIST':
                    if (job.deviceId && Array.isArray(r.services)) {
                        await this.endpoint.replaceServices(schema, job.deviceId, r.services, job.id);
                    }
                    break;
                case 'SERVICE_CONTROL':
                    if (job.deviceId && r.service) {
                        await this.endpoint.upsertService(schema, job.deviceId, r.service, job.id);
                    }
                    break;
                case 'CRED_TEST': {
                    const credId = job.payload?.credentialId;
                    if (credId) {
                        await this.credentials.recordTest(schema, String(credId), !!r.ok, r.error ?? null);
                    }
                    break;
                }
                case 'EVENTLOG_QUERY':
                    if (job.deviceId && Array.isArray(r.events)) {
                        await this.endpoint.insertEvents(schema, job.deviceId, r.events, job.id);
                    }
                    break;
                case 'PERF_SAMPLE':
                    if (job.deviceId && Array.isArray(r.samples)) {
                        await this.endpoint.insertPerfSamples(schema, job.deviceId, r.samples, job.id);
                    }
                    break;
                case 'NET_DIAG':
                    await this.endpoint.insertNetDiagRun(schema, {
                        deviceId: job.deviceId,
                        tool: job.payload?.tool,
                        target: job.payload?.target,
                        params: job.payload ?? null,
                        output: r.output ?? null,
                        exitCode: r.exitCode ?? null,
                        durationMs: r.durationMs ?? null,
                        ranBy: job.requestedBy,
                        jobId: job.id,
                    });
                    break;
                default:
                    break;
            }
        }
        catch (err) {
            const msg = err?.message ?? String(err);
            this.logger.error(`Result hook failed for job ${job.id} (${job.type}): ${msg}`);
            try {
                await this.agents.annotateJob(schema, job.id, `Result received but NOT stored: ${msg}`);
            }
            catch (e2) {
                this.logger.debug(`annotateJob failed: ${e2?.message}`);
            }
            await this.audit.record(schema, { userId: null, name: 'system', ip: null, requestId: null }, {
                action: 'job.result_hook_failed', targetType: 'job', targetId: job.id,
                result: 'error', error: msg, jobId: job.id,
            });
        }
    }
    async expireStale() {
        let schemas = [];
        try {
            const rows = await this.dataSource.query(`
        SELECT DISTINCT table_schema FROM information_schema.tables
        WHERE table_name = 'discovery_remote_job' AND table_schema LIKE 'org\\_%' ESCAPE '\\'`);
            schemas = rows.map((r) => r.table_schema);
        }
        catch (err) {
            this.logger.warn(`expireStale: schema enumeration failed: ${err?.message}`);
            return;
        }
        for (const schema of schemas) {
            try {
                const { expired, timedOut } = await this.agents.expireStaleJobs(schema);
                if (expired || timedOut) {
                    this.logger.log(`Job housekeeping ${schema}: expired=${expired} timed_out=${timedOut}`);
                }
            }
            catch (err) {
                this.logger.debug(`expireStale ${schema}: ${err?.message}`);
            }
        }
    }
};
exports.JobsService = JobsService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "expireStale", null);
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        agent_repository_1.AgentRepository,
        audit_service_1.AuditService,
        credential_repository_1.CredentialRepository,
        endpoint_repository_1.EndpointRepository,
        phase2_settings_repository_1.Phase2SettingsRepository])
], JobsService);
