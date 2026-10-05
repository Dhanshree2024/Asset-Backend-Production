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
var DeploymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_service_1 = require("../audit/audit.service");
const jobs_service_1 = require("../jobs/jobs.service");
const agent_repository_1 = require("../store/agent.repository");
const deployment_repository_1 = require("./deployment.repository");
const package_service_1 = require("./package.service");
const software_util_1 = require("./software.util");
const target_resolver_1 = require("./target.resolver");
const SYSTEM = { userId: null, name: 'system', ip: null, requestId: null };
let DeploymentService = DeploymentService_1 = class DeploymentService {
    constructor(dataSource, repo, packages, targets, jobs, agents, audit) {
        this.dataSource = dataSource;
        this.repo = repo;
        this.packages = packages;
        this.targets = targets;
        this.jobs = jobs;
        this.agents = agents;
        this.audit = audit;
        this.logger = new common_1.Logger(DeploymentService_1.name);
    }
    onModuleInit() {
        this.jobs.registerTerminalHook(async (schema, job) => {
            if (job.type === 'SOFTWARE_INSTALL' || job.type === 'SOFTWARE_UNINSTALL')
                await this.onJobTerminal(schema, job);
        });
        this.jobs.registerProgressHook(async (schema, jobId, progress) => this.onJobProgress(schema, jobId, progress?.step ?? progress?.message));
    }
    async create(schema, actor, input) {
        if (!input?.name?.trim())
            throw new common_1.BadRequestException('name is required');
        const pkg = await this.packages.get(schema, String(input.packageId));
        if (pkg.status !== 'approved')
            throw new common_1.BadRequestException(`Package '${pkg.name} ${pkg.version}' is ${pkg.status} — only approved packages can be deployed`);
        const action = input.action === 'uninstall' ? 'uninstall' : 'install';
        if (action === 'uninstall' && !pkg.productCode && !pkg.silentUninstallArgs) {
            throw new common_1.BadRequestException('Uninstall deployments need the package productCode (MSI) or silentUninstallArgs');
        }
        const devices = await this.targets.resolve(schema, input.targets);
        if (!devices.length)
            throw new common_1.BadRequestException('The target selection matches no devices');
        const rings = (0, software_util_1.splitRings)(devices.map((d) => String(d.id)), input.ringSizes);
        const threshold = Math.min(Math.max(Math.round(Number(input.ringThreshold ?? 100)), 0), 100);
        const dep = await this.repo.insert(schema, {
            name: input.name.trim(), packageId: pkg.id, action, targetSelector: input.targets ?? {}, rings, ringThreshold: threshold,
            rebootPolicy: input.rebootPolicy ?? 'never', retryCount: Math.min(Math.max(Number(input.retryCount ?? 1), 0), 5),
            requestedBy: actor.userId, requestedByName: actor.name,
        });
        await this.repo.insertDevices(schema, dep.id, rings);
        return (await this.repo.get(schema, dep.id));
    }
    async approve(schema, actor, id) {
        const dep = await this.get(schema, id);
        if (dep.status !== 'pending_approval')
            throw new common_1.BadRequestException(`Deployment is '${dep.status}', not pending approval`);
        if (actor.userId === null)
            throw new common_1.BadRequestException('Approver identity could not be resolved');
        if (dep.requestedBy !== null && dep.requestedBy === actor.userId)
            throw new common_1.BadRequestException('You requested this deployment — a different administrator must approve it');
        const pkg = await this.packages.get(schema, dep.packageId);
        if (pkg.status !== 'approved')
            throw new common_1.BadRequestException(`Package is now '${pkg.status}' — cannot start`);
        await this.repo.setStatus(schema, id, 'running', { approvedBy: actor.userId, approvedByName: actor.name, currentRing: 0, started: true });
        await this.dispatchRing(schema, (await this.get(schema, id)), pkg, 0, actor);
        return this.get(schema, id);
    }
    async reject(schema, id, reason) {
        const dep = await this.get(schema, id);
        if (dep.status !== 'pending_approval')
            throw new common_1.BadRequestException(`Deployment is '${dep.status}', not pending approval`);
        await this.repo.cancelPendingDevices(schema, id);
        return (await this.repo.setStatus(schema, id, 'rejected', { rejectedReason: reason, finished: true }));
    }
    async cancel(schema, actor, id, reason) {
        const dep = await this.get(schema, id);
        if (['completed', 'cancelled', 'rejected'].includes(dep.status))
            throw new common_1.BadRequestException(`Deployment is already ${dep.status}`);
        const jobIds = await this.repo.cancelPendingDevices(schema, id);
        for (const jid of jobIds) {
            try {
                await this.jobs.cancel(schema, actor, jid, reason ?? 'deployment cancelled');
            }
            catch { }
        }
        return (await this.repo.setStatus(schema, id, 'cancelled', { finished: true }));
    }
    async retryFailed(schema, actor, id) {
        const dep = await this.get(schema, id);
        if (!['running', 'paused'].includes(dep.status))
            throw new common_1.BadRequestException(`Deployment is '${dep.status}' — only running or paused deployments can be retried`);
        const pkg = await this.packages.get(schema, dep.packageId);
        const rows = (await this.repo.devices(schema, id)).filter((r) => r.ring <= dep.currentRing && ['failed', 'skipped'].includes(r.status));
        let n = 0;
        for (const r of rows) {
            if (await this.dispatchDevice(schema, dep, pkg, r, actor))
                n++;
        }
        if (dep.status === 'paused' && n)
            await this.repo.setStatus(schema, id, 'running');
        return { requeued: n };
    }
    async resume(schema, actor, id) {
        const dep = await this.get(schema, id);
        if (dep.status !== 'paused')
            throw new common_1.BadRequestException(`Deployment is '${dep.status}', not paused`);
        const pkg = await this.packages.get(schema, dep.packageId);
        const next = dep.currentRing + 1;
        if (next >= dep.rings.length) {
            return (await this.repo.setStatus(schema, id, 'completed', { finished: true }));
        }
        await this.repo.setStatus(schema, id, 'running', { currentRing: next });
        await this.dispatchRing(schema, (await this.get(schema, id)), pkg, next, actor);
        return this.get(schema, id);
    }
    async dispatchRing(schema, dep, pkg, ring, actor) {
        const rows = await this.repo.ringRows(schema, dep.id, ring);
        for (const r of rows) {
            if (r.status === 'pending')
                await this.dispatchDevice(schema, dep, pkg, r, actor);
        }
    }
    async dispatchDevice(schema, dep, pkg, row, actor) {
        const agentId = await this.agents.resolveAgentForDevice(schema, row.deviceId);
        if (!agentId) {
            await this.repo.setDevice(schema, dep.id, row.deviceId, { status: 'skipped', error: 'No installed agent on this device — software push needs the Windows agent', finished: true });
            return false;
        }
        try {
            const job = await this.jobs.createJob(schema, actor, {
                type: dep.action === 'uninstall' ? 'SOFTWARE_UNINSTALL' : 'SOFTWARE_INSTALL',
                deviceId: row.deviceId, agentId,
                targetLabel: `${pkg.name} ${pkg.version} · deployment #${dep.id} ring ${row.ring + 1}`,
                payload: dep.action === 'uninstall'
                    ? { deploymentId: dep.id, packageId: pkg.id, softwareName: pkg.name, productCode: pkg.productCode, silentArgs: pkg.silentUninstallArgs, reinventory: true }
                    : DeploymentService_1.installPayload(pkg, { deploymentId: dep.id, rebootPolicy: dep.rebootPolicy }),
                maxAttempts: Math.max(1, dep.retryCount + 1),
                preApprovedBy: dep.approvedBy != null ? { userId: dep.approvedBy, name: dep.approvedByName } : undefined,
            });
            await this.repo.setDevice(schema, dep.id, row.deviceId, { status: 'queued', jobId: job.id, attemptsIncrement: 1, error: '', started: true });
            return true;
        }
        catch (err) {
            await this.repo.setDevice(schema, dep.id, row.deviceId, { status: 'failed', error: err?.message ?? String(err), finished: true });
            return false;
        }
    }
    static installPayload(pkg, extra = {}) {
        return {
            packageId: pkg.id, name: pkg.name, version: pkg.version, installerType: pkg.installerType, fileName: pkg.fileName,
            sizeBytes: pkg.sizeBytes, sha256: pkg.sha256, requireSignature: pkg.requireSignature, signatureSubject: pkg.signatureSubject,
            silentInstallArgs: pkg.silentInstallArgs, productCode: pkg.productCode, detectionRule: pkg.detectionRule, rebootBehaviour: pkg.rebootBehaviour,
            ...extra,
        };
    }
    async onJobTerminal(schema, job) {
        const link = await this.repo.deviceByJob(schema, job.id);
        if (!link)
            return;
        const r = (job.result ?? {});
        const exitCode = typeof r.exitCode === 'number' ? r.exitCode : (job.exitCode ?? null);
        let status;
        if (job.status === 'succeeded')
            status = (0, software_util_1.isRebootExitCode)(exitCode) || r.rebootRequired ? 'needs_reboot' : 'succeeded';
        else if (job.status === 'cancelled' || job.status === 'expired' || job.status === 'rejected')
            status = 'cancelled';
        else
            status = 'failed';
        await this.repo.setDevice(schema, link.deploymentId, link.deviceId, {
            status, exitCode, detected: typeof r.detected === 'boolean' ? r.detected : null,
            installLog: r.log ? String(r.log).slice(0, 20000) : null, error: job.error ?? (r.error ?? null), finished: true,
        });
    }
    async onJobProgress(schema, jobId, step) {
        if (!step)
            return;
        const link = await this.repo.deviceByJob(schema, jobId);
        if (!link)
            return;
        const s = step.toLowerCase();
        const status = s.includes('download') ? 'downloading' : (s.includes('install') || s.includes('run') || s.includes('detect')) ? 'installing' : null;
        if (status)
            await this.repo.setDevice(schema, link.deploymentId, link.deviceId, { status });
    }
    async tick() {
        let schemas = [];
        try {
            const rows = await this.dataSource.query(`SELECT DISTINCT table_schema FROM information_schema.tables WHERE table_name = 'discovery_deployment' AND table_schema LIKE 'org\\_%' ESCAPE '\\'`);
            schemas = rows.map((r) => r.table_schema);
        }
        catch {
            return;
        }
        for (const schema of schemas) {
            try {
                for (const dep of await this.repo.activeDeployments(schema))
                    await this.advance(schema, dep);
            }
            catch (err) {
                this.logger.debug(`deployment tick ${schema}: ${err?.message}`);
            }
        }
    }
    async advance(schema, dep) {
        const rows = await this.repo.ringRows(schema, dep.id, dep.currentRing);
        if (!rows.length)
            return;
        const terminal = rows.every((r) => ['succeeded', 'failed', 'needs_reboot', 'skipped', 'cancelled'].includes(r.status));
        if (!terminal)
            return;
        const considered = rows.filter((r) => r.status !== 'skipped' && r.status !== 'cancelled');
        const ok = considered.filter((r) => r.status === 'succeeded' || r.status === 'needs_reboot').length;
        const rate = considered.length ? Math.round((ok / considered.length) * 100) : 100;
        const last = dep.currentRing >= dep.rings.length - 1;
        if (last) {
            await this.repo.setStatus(schema, dep.id, 'completed', { finished: true });
            await this.audit.record(schema, SYSTEM, { action: 'deployment.completed', targetType: 'deployment', targetId: dep.id, targetLabel: dep.name, params: { successRate: rate, devices: rows.length } });
            return;
        }
        if (rate < dep.ringThreshold) {
            await this.repo.setStatus(schema, dep.id, 'paused');
            await this.audit.record(schema, SYSTEM, { action: 'deployment.paused', targetType: 'deployment', targetId: dep.id, targetLabel: dep.name, result: 'error', error: `ring ${dep.currentRing + 1} success ${rate}% < threshold ${dep.ringThreshold}%` });
            return;
        }
        const pkg = await this.packages.get(schema, dep.packageId);
        const next = dep.currentRing + 1;
        await this.repo.setStatus(schema, dep.id, 'running', { currentRing: next });
        await this.audit.record(schema, SYSTEM, { action: 'deployment.ring_advanced', targetType: 'deployment', targetId: dep.id, targetLabel: dep.name, params: { ring: next + 1, previousRingSuccess: rate } });
        await this.dispatchRing(schema, { ...dep, currentRing: next }, pkg, next, SYSTEM);
    }
    list(schema, opts) { return this.repo.list(schema, opts); }
    async get(schema, id) {
        const d = await this.repo.get(schema, id);
        if (!d)
            throw new common_1.NotFoundException('Deployment not found');
        return d;
    }
    devices(schema, id) { return this.repo.devices(schema, id); }
};
exports.DeploymentService = DeploymentService;
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeploymentService.prototype, "tick", null);
exports.DeploymentService = DeploymentService = DeploymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        deployment_repository_1.DeploymentRepository,
        package_service_1.PackageService,
        target_resolver_1.TargetResolver,
        jobs_service_1.JobsService,
        agent_repository_1.AgentRepository,
        audit_service_1.AuditService])
], DeploymentService);
