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
var EndpointAutoCollectService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointAutoCollectService = exports.AUTO_COLLECT_ACTOR = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jobs_service_1 = require("../jobs/jobs.service");
const agent_repository_1 = require("../store/agent.repository");
const phase2_settings_repository_1 = require("../settings/phase2-settings.repository");
exports.AUTO_COLLECT_ACTOR = { userId: null, name: 'system', ip: null, requestId: null };
const ACTIVE_JOB_STATUSES = ['pending', 'pending_approval', 'scheduled', 'claimed', 'running'];
let EndpointAutoCollectService = EndpointAutoCollectService_1 = class EndpointAutoCollectService {
    constructor(dataSource, jobs, agents, settings) {
        this.dataSource = dataSource;
        this.jobs = jobs;
        this.agents = agents;
        this.settings = settings;
        this.logger = new common_1.Logger(EndpointAutoCollectService_1.name);
    }
    async tableExists(schema, table) {
        const rows = await this.dataSource.query(`SELECT to_regclass($1) AS r`, [`${schema}.${table}`]);
        return !!rows?.[0]?.r;
    }
    async hasSnapshot(schema, deviceId, kind) {
        const table = kind === 'services' ? 'discovery_device_service' : kind === 'events' ? 'discovery_event_log' : 'discovery_perf_sample';
        if (!(await this.tableExists(schema, table)))
            return true;
        const extra = kind === 'perf' ? ` AND sampled_at > now() - interval '24 hours'` : '';
        const rows = await this.dataSource.query(`SELECT 1 FROM ${schema}.${table} WHERE device_id = $1::bigint${extra} LIMIT 1`, [deviceId]);
        return rows.length > 0;
    }
    async hasActiveJob(schema, deviceId, type) {
        const rows = await this.dataSource.query(`SELECT 1 FROM ${schema}.discovery_remote_job
       WHERE device_id = $1::bigint AND type = $2 AND status = ANY($3::text[]) LIMIT 1`, [deviceId, type, ACTIVE_JOB_STATUSES]);
        return rows.length > 0;
    }
    typeOf(kind) {
        return kind === 'services' ? 'SERVICE_LIST' : kind === 'events' ? 'EVENTLOG_QUERY' : 'PERF_SAMPLE';
    }
    async queue(schema, deviceId, kind, agentId, label) {
        const type = this.typeOf(kind);
        if (await this.hasActiveJob(schema, deviceId, type))
            return false;
        const s = await this.settings.get(schema);
        const payload = kind === 'events'
            ? { ...s.eventLogDefaults }
            : kind === 'perf'
                ? { samples: 6, intervalSeconds: 5 }
                : null;
        try {
            await this.jobs.createJob(schema, exports.AUTO_COLLECT_ACTOR, {
                type,
                agentId: agentId ?? undefined,
                deviceId,
                targetLabel: `${label} · auto`,
                payload,
            });
            return true;
        }
        catch (err) {
            this.logger.debug(`auto ${type} for device ${deviceId} not queued: ${err?.message}`);
            return false;
        }
    }
    async bootstrapForDevice(schema, deviceId, agentId, label) {
        const id = String(deviceId);
        const queued = [];
        try {
            if (!(await this.tableExists(schema, 'discovery_remote_job')))
                return { queued };
            const resolvedAgent = agentId ?? (await this.agents.resolveAgentForDevice(schema, id));
            if (!resolvedAgent)
                return { queued };
            const name = label || `device ${id}`;
            for (const kind of ['services', 'perf', 'events']) {
                if (await this.hasSnapshot(schema, id, kind))
                    continue;
                if (await this.queue(schema, id, kind, resolvedAgent, name))
                    queued.push(this.typeOf(kind));
            }
            if (queued.length)
                this.logger.log(`auto-collect bootstrap ${schema} device ${id}: queued ${queued.join(', ')}`);
        }
        catch (err) {
            this.logger.debug(`bootstrapForDevice ${schema}/${id}: ${err?.message}`);
        }
        return { queued };
    }
};
exports.EndpointAutoCollectService = EndpointAutoCollectService;
exports.EndpointAutoCollectService = EndpointAutoCollectService = EndpointAutoCollectService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        jobs_service_1.JobsService,
        agent_repository_1.AgentRepository,
        phase2_settings_repository_1.Phase2SettingsRepository])
], EndpointAutoCollectService);
