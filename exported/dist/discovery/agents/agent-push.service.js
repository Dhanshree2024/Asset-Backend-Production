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
var AgentPushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPushService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const credential_service_1 = require("../credentials/credential.service");
const jobs_service_1 = require("../jobs/jobs.service");
const package_service_1 = require("../software/package.service");
const agent_repository_1 = require("../store/agent.repository");
const agent_push_repository_1 = require("./agent-push.repository");
const TARGET_RE = /^[A-Za-z0-9.\-_]{1,253}$/;
const MAX_TARGETS = 100;
const SYSTEM = { userId: null, name: 'system', ip: null, requestId: null };
let AgentPushService = AgentPushService_1 = class AgentPushService {
    constructor(repo, agents, credentials, packages, jobs, audit) {
        this.repo = repo;
        this.agents = agents;
        this.credentials = credentials;
        this.packages = packages;
        this.jobs = jobs;
        this.audit = audit;
        this.logger = new common_1.Logger(AgentPushService_1.name);
    }
    onModuleInit() {
        this.jobs.registerTerminalHook(async (schema, job) => { if (job.type === 'AGENT_PUSH_INSTALL')
            await this.onJobTerminal(schema, job); });
        this.jobs.registerProgressHook(async (schema, jobId) => {
            const row = await this.repo.byJob(schema, jobId);
            if (row && row.status === 'queued')
                await this.repo.update(schema, row.id, { status: 'running' });
        });
    }
    list(schema, opts = {}) { return this.repo.list(schema, opts); }
    async candidates(schema, search) {
        const [devices, adComputers] = await Promise.all([this.repo.candidateDevices(schema, search), this.repo.candidateAdComputers(schema, search)]);
        return { devices, adComputers };
    }
    async agentPackages(schema) {
        return (await this.packages.list(schema, { kind: 'agent', status: 'approved' }));
    }
    async request(schema, actor, input) {
        if (!input?.relayAgentId)
            throw new common_1.BadRequestException('relayAgentId is required');
        if (!input?.credentialId)
            throw new common_1.BadRequestException('credentialId is required');
        if (!input?.packageId)
            throw new common_1.BadRequestException('packageId is required');
        const targets = (input.targets ?? []).map((t) => ({ ...t, target: String(t?.target ?? '').trim() })).filter((t) => t.target);
        if (!targets.length)
            throw new common_1.BadRequestException('At least one target is required');
        if (targets.length > MAX_TARGETS)
            throw new common_1.BadRequestException(`At most ${MAX_TARGETS} targets per request`);
        for (const t of targets)
            if (!TARGET_RE.test(t.target))
                throw new common_1.BadRequestException(`'${t.target}' is not a valid hostname / FQDN / IP`);
        const relay = (await this.agents.listAgents(schema)).find((a) => a.id === String(input.relayAgentId));
        if (!relay)
            throw new common_1.NotFoundException('Relay agent not found or revoked');
        if (relay.status !== 'online')
            throw new common_1.BadRequestException(`Relay agent '${relay.hostname ?? relay.ip}' is offline — pick an online agent in the same network as the targets`);
        const cred = await this.credentials.get(schema, String(input.credentialId));
        if (!['windows-local', 'windows-domain'].includes(cred.kind)) {
            throw new common_1.BadRequestException('Remote agent installation needs a Windows domain (preferred) or Windows local administrator credential — AD/LDAP, SNMP and SSH credentials cannot execute anything on a PC');
        }
        if (!cred.hasSecret)
            throw new common_1.BadRequestException(`Credential '${cred.name}' has no secret stored`);
        const pkg = await this.packages.get(schema, String(input.packageId));
        if (pkg.kind !== 'agent')
            throw new common_1.BadRequestException(`Package '${pkg.name} ${pkg.version}' is not marked as the agent installer (kind = agent) — edit it under Packages`);
        if (pkg.status !== 'approved')
            throw new common_1.BadRequestException(`Agent package '${pkg.name} ${pkg.version}' is ${pkg.status} — a different administrator must approve it first`);
        if (!['msi', 'exe'].includes(pkg.installerType))
            throw new common_1.BadRequestException('The agent package must be an MSI or the published EXE');
        const relayLabel = relay.hostname || relay.ip || `agent ${relay.id}`;
        const rows = [];
        let pendingApproval = false;
        for (const t of targets) {
            const short = t.target.includes(':') ? null : t.target.split('.')[0];
            const hostLike = short && !/^\d+$/.test(short) ? short.toLowerCase() : null;
            const row = await this.repo.insert(schema, {
                target: t.target, targetHostname: hostLike, deviceId: t.deviceId ?? null, adComputerId: t.adComputerId ?? null,
                relayAgentId: relay.id, relayHostname: relayLabel, credentialId: cred.id, credentialName: cred.name,
                packageId: pkg.id, packageVersion: pkg.version, requestedBy: actor.userId, requestedByName: actor.name,
            });
            const job = await this.jobs.createJob(schema, actor, {
                type: 'AGENT_PUSH_INSTALL', agentId: relay.id,
                targetLabel: `install agent ${pkg.version} on ${t.target} (via ${relayLabel})`,
                payload: {
                    pushId: row.id, target: t.target, credentialId: cred.id, packageId: pkg.id,
                    installerType: pkg.installerType, fileName: pkg.fileName, sha256: pkg.sha256, version: pkg.version,
                    silentInstallArgs: pkg.silentInstallArgs ?? null, requireSignature: !!pkg.requireSignature, signatureSubject: pkg.signatureSubject ?? null,
                    timeoutSeconds: 600,
                },
                maxAttempts: 1,
            });
            const status = job.status === 'pending_approval' ? 'pending_approval' : 'queued';
            pendingApproval = pendingApproval || status === 'pending_approval';
            await this.repo.setJob(schema, row.id, job.id, status);
            rows.push({ ...row, jobId: job.id, status });
        }
        await this.audit.record(schema, actor, {
            action: 'agent.push.request', targetType: 'agent', targetId: relay.id, targetLabel: relayLabel,
            params: { targets: targets.map((t) => t.target), credentialId: cred.id, credentialName: cred.name, packageId: pkg.id, packageVersion: pkg.version },
        });
        return { rows, pendingApproval };
    }
    async cancel(schema, actor, id) {
        const row = await this.repo.get(schema, id);
        if (!row)
            throw new common_1.NotFoundException('Push request not found');
        if (!['pending_approval', 'queued'].includes(row.status))
            throw new common_1.BadRequestException(`Push is '${row.status}' — only pending / queued requests can be cancelled`);
        if (row.jobId) {
            try {
                await this.jobs.cancel(schema, actor, row.jobId, 'push cancelled');
            }
            catch (e) {
                this.logger.warn(`push ${id}: job ${row.jobId} cancel: ${e.message}`);
            }
        }
        const updated = (await this.repo.cancelOpen(schema, id)) ?? row;
        await this.audit.record(schema, actor, { action: 'agent.push.cancel', targetType: 'agent-push', targetId: id, targetLabel: row.target });
        return updated;
    }
    async onJobTerminal(schema, job) {
        const row = await this.repo.byJob(schema, job.id);
        if (!row)
            return;
        const r = (job.result ?? {});
        const exitCode = typeof r.exitCode === 'number' ? r.exitCode : (job.exitCode ?? null);
        let status;
        if (job.status === 'succeeded')
            status = r.alreadyInstalled ? 'already_installed' : 'installed';
        else if (job.status === 'cancelled' || job.status === 'expired' || job.status === 'rejected')
            status = 'cancelled';
        else
            status = 'failed';
        await this.repo.update(schema, row.id, {
            status, exitCode, method: r.method ?? null, log: r.log ? String(r.log).slice(0, 20000) : null,
            error: job.error ?? (r.error ?? null), targetHostname: r.hostname ? String(r.hostname).split('.')[0].toLowerCase() : undefined,
            finished: status !== 'installed',
        });
        await this.audit.record(schema, SYSTEM, {
            action: `agent.push.${status}`, targetType: 'agent-push', targetId: row.id, targetLabel: row.target,
            params: { exitCode, jobId: job.id }, result: status === 'failed' ? 'error' : 'ok', error: job.error ?? null,
        });
    }
    async onAgentRegistered(schema, agentId, hostname) {
        if (!hostname)
            return;
        try {
            const n = await this.repo.markRegistered(schema, hostname, agentId);
            if (n)
                this.logger.log(`push: ${n} request(s) for '${hostname}' completed — agent ${agentId} registered`);
        }
        catch (e) {
            this.logger.warn(`push: registration match failed for '${hostname}': ${e.message}`);
        }
    }
};
exports.AgentPushService = AgentPushService;
exports.AgentPushService = AgentPushService = AgentPushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agent_push_repository_1.AgentPushRepository,
        agent_repository_1.AgentRepository,
        credential_service_1.CredentialService,
        package_service_1.PackageService,
        jobs_service_1.JobsService,
        audit_service_1.AuditService])
], AgentPushService);
