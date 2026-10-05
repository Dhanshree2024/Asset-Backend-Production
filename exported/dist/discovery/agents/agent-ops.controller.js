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
exports.AgentOpsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const credential_service_1 = require("../credentials/credential.service");
const jobs_service_1 = require("../jobs/jobs.service");
const agent_repository_1 = require("../store/agent.repository");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const TARGET_RE = /^[A-Za-z0-9.\-:_]{1,253}$/;
const CIDR_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;
const MAX_TARGETS = 256;
let AgentOpsController = class AgentOpsController {
    constructor(jobs, agents, credentials, audit, requestContext) {
        this.jobs = jobs;
        this.agents = agents;
        this.credentials = credentials;
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
    async agentLabel(schema, agentId) {
        const a = (await this.agents.listAgents(schema)).find((x) => x.id === agentId);
        if (!a)
            throw new common_1.BadRequestException('Agent not found or revoked');
        return a.hostname || a.ip || `agent ${agentId}`;
    }
    async update(agentId, body, req) {
        const schema = this.resolveSchema();
        const url = (body?.url || '').trim();
        if (!/^https:\/\/[^\s]+$/i.test(url))
            throw new common_1.BadRequestException('url must be an https:// URL');
        if (!/^[A-Fa-f0-9]{64}$/.test(body?.sha256 || ''))
            throw new common_1.BadRequestException('sha256 must be a 64-hex digest of the EXE');
        if (!/^\d+\.\d+\.\d+$/.test(body?.version || ''))
            throw new common_1.BadRequestException('version must be like 1.2.0');
        const label = await this.agentLabel(schema, agentId);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'AGENT_UPDATE', agentId, targetLabel: `${label} → v${body.version}`,
            payload: { url, sha256: body.sha256.toLowerCase(), version: body.version },
            maxAttempts: 1,
        });
        return { status: true, job, message: job.status === 'pending_approval' ? 'Update request created — awaiting approval by another administrator' : 'Update queued' };
    }
    async authCollect(agentId, body, req) {
        const schema = this.resolveSchema();
        if (!body?.credentialId)
            throw new common_1.BadRequestException('credentialId is required');
        const cred = await this.credentials.get(schema, String(body.credentialId));
        if (!['windows-local', 'windows-domain'].includes(cred.kind)) {
            throw new common_1.BadRequestException('Authenticated sweep needs a windows-local or windows-domain credential');
        }
        let targets = (body.targets ?? []).map((t) => String(t).trim()).filter(Boolean);
        if (targets.some((t) => !TARGET_RE.test(t)))
            throw new common_1.BadRequestException('targets must be hostnames or IPs');
        const cidr = (body.cidr || '').trim();
        if (cidr) {
            const m = CIDR_RE.exec(cidr);
            if (!m || Number(m[5]) < 22 || Number(m[5]) > 32)
                throw new common_1.BadRequestException('cidr must be between /22 and /32 (max 1024 addresses; the agent caps at 256 live targets)');
        }
        if (!targets.length && !cidr)
            throw new common_1.BadRequestException('Provide targets[] or a cidr');
        targets = Array.from(new Set(targets)).slice(0, MAX_TARGETS);
        const label = await this.agentLabel(schema, agentId);
        const job = await this.jobs.createJob(schema, this.audit.actor(req), {
            type: 'AUTH_COLLECT', agentId,
            targetLabel: `${label} · ${cred.name} · ${cidr || `${targets.length} target(s)`}`,
            payload: { credentialId: cred.id, targets, cidr: cidr || null, timeoutSeconds: Math.min(Math.max(Number(body.timeoutSeconds) || 60, 15), 300) },
            maxAttempts: 1,
        });
        return { status: true, job, message: 'Authenticated sweep queued — each reachable target appears as a collector-verified device' };
    }
};
exports.AgentOpsController = AgentOpsController;
__decorate([
    (0, common_1.Post)(':id/update'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue an agent self-update (destructive → requires approval)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AgentOpsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/auth-collect'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Agents, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticated agentless sweep from this agent using a stored credential' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AgentOpsController.prototype, "authCollect", null);
exports.AgentOpsController = AgentOpsController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Agent Ops'),
    (0, common_1.Controller)('discovery/agents'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        agent_repository_1.AgentRepository,
        credential_service_1.CredentialService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], AgentOpsController);
