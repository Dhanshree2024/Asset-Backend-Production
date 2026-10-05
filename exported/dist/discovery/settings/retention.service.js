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
var RetentionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetentionService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cron_util_1 = require("../config/cron.util");
const endpoint_repository_1 = require("../endpoint/endpoint.repository");
const jobs_service_1 = require("../jobs/jobs.service");
const agent_repository_1 = require("../store/agent.repository");
const audit_service_1 = require("../audit/audit.service");
const phase2_settings_repository_1 = require("./phase2-settings.repository");
const auto_collect_service_1 = require("../endpoint/auto-collect.service");
const SYSTEM_ACTOR = { userId: null, name: 'system', ip: null, requestId: null };
let RetentionService = RetentionService_1 = class RetentionService {
    constructor(dataSource, settings, endpoint, agents, jobs, audit, autoCollect) {
        this.dataSource = dataSource;
        this.settings = settings;
        this.endpoint = endpoint;
        this.agents = agents;
        this.jobs = jobs;
        this.audit = audit;
        this.autoCollect = autoCollect;
        this.logger = new common_1.Logger(RetentionService_1.name);
        this.firedMinute = new Map();
    }
    async schemas() {
        try {
            const rows = await this.dataSource.query(`
        SELECT DISTINCT table_schema FROM information_schema.tables
        WHERE table_name = 'discovery_audit_log' AND table_schema LIKE 'org\\_%' ESCAPE '\\'`);
            return rows.map((r) => r.table_schema);
        }
        catch (err) {
            this.logger.warn(`schema enumeration failed: ${err?.message}`);
            return [];
        }
    }
    async nightlyRetention() {
        for (const schema of await this.schemas()) {
            try {
                const s = await this.settings.get(schema);
                const perf = await this.endpoint.rollupAndPrune(schema, s.perfRawDays);
                const rollups = await this.endpoint.pruneRollups(schema, s.perfRollupDays);
                const events = await this.endpoint.pruneEvents(schema, s.eventLogDays);
                const jobs = await this.agents.pruneTerminalJobs(schema, s.jobHistoryDays);
                this.logger.log(`Retention ${schema}: perf rolled=${perf.rolled} pruned=${perf.pruned}; rollups pruned=${rollups}; events pruned=${events}; jobs pruned=${jobs}`);
                await this.audit.record(schema, SYSTEM_ACTOR, {
                    action: 'retention.nightly', targetType: 'org', params: { perf, rollupsPruned: rollups, eventsPruned: events, jobsPruned: jobs, settings: s },
                });
            }
            catch (err) {
                this.logger.warn(`Retention ${schema} failed: ${err?.message}`);
            }
        }
    }
    async scheduledEventCollection() {
        const now = new Date();
        const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}`;
        for (const schema of await this.schemas()) {
            try {
                const s = await this.settings.get(schema);
                const due = [];
                if (s.eventLogCron && (0, cron_util_1.cronMatches)(s.eventLogCron, now))
                    due.push('events');
                if (s.serviceListCron && (0, cron_util_1.cronMatches)(s.serviceListCron, now))
                    due.push('services');
                if (s.perfSampleCron && (0, cron_util_1.cronMatches)(s.perfSampleCron, now))
                    due.push('perf');
                if (!due.length)
                    continue;
                if (this.firedMinute.get(schema) === minuteKey)
                    continue;
                this.firedMinute.set(schema, minuteKey);
                const agents = (await this.agents.listAgents(schema)).filter((a) => a.status === 'online' && a.deviceId);
                const queued = { events: 0, services: 0, perf: 0 };
                for (const a of agents) {
                    const label = `${a.hostname ?? a.ip ?? a.id} · scheduled`;
                    for (const kind of due) {
                        try {
                            if (await this.autoCollect.queue(schema, String(a.deviceId), kind, a.id, label))
                                queued[kind]++;
                        }
                        catch (err) {
                            this.logger.debug(`scheduled ${kind} for agent ${a.id} failed: ${err?.message}`);
                        }
                    }
                }
                const total = queued.events + queued.services + queued.perf;
                if (total)
                    this.logger.log(`Scheduled collection ${schema}: events=${queued.events} services=${queued.services} perf=${queued.perf}`);
            }
            catch (err) {
                this.logger.debug(`scheduledEventCollection ${schema}: ${err?.message}`);
            }
        }
    }
};
exports.RetentionService = RetentionService;
__decorate([
    (0, schedule_1.Cron)('0 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetentionService.prototype, "nightlyRetention", null);
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetentionService.prototype, "scheduledEventCollection", null);
exports.RetentionService = RetentionService = RetentionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        phase2_settings_repository_1.Phase2SettingsRepository,
        endpoint_repository_1.EndpointRepository,
        agent_repository_1.AgentRepository,
        jobs_service_1.JobsService,
        audit_service_1.AuditService,
        auto_collect_service_1.EndpointAutoCollectService])
], RetentionService);
