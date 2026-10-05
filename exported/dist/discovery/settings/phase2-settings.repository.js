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
exports.Phase2SettingsRepository = exports.DEFAULT_PHASE2_SETTINGS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cron_util_1 = require("../config/cron.util");
const maintenance_window_1 = require("../config/maintenance-window");
exports.DEFAULT_PHASE2_SETTINGS = {
    perfRawDays: 7,
    perfRollupDays: 90,
    eventLogDays: 30,
    jobHistoryDays: 90,
    eventLogCron: '20 */6 * * *',
    serviceListCron: '10 3 * * *',
    perfSampleCron: '0 */6 * * *',
    eventLogDefaults: { logNames: ['System', 'Application'], levels: ['Critical', 'Error', 'Warning'], maxEntries: 200, sinceHours: 24 },
    maintenanceWindow: { ...maintenance_window_1.DEFAULT_MAINTENANCE_WINDOW },
};
let Phase2SettingsRepository = class Phase2SettingsRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async get(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT phase2_settings FROM ${schema}.discovery_config ORDER BY id LIMIT 1`);
        const raw = rows[0]?.phase2_settings ?? {};
        return this.normalize({ ...exports.DEFAULT_PHASE2_SETTINGS, ...raw, eventLogDefaults: { ...exports.DEFAULT_PHASE2_SETTINGS.eventLogDefaults, ...(raw.eventLogDefaults ?? {}) }, maintenanceWindow: { ...maintenance_window_1.DEFAULT_MAINTENANCE_WINDOW, ...(raw.maintenanceWindow ?? {}) } });
    }
    async update(schema, patch) {
        this.assertSchema(schema);
        const current = await this.get(schema);
        const next = this.normalize({ ...current, ...patch, eventLogDefaults: { ...current.eventLogDefaults, ...(patch.eventLogDefaults ?? {}) }, maintenanceWindow: { ...current.maintenanceWindow, ...(patch.maintenanceWindow ?? {}) } });
        await this.dataSource.query(`UPDATE ${schema}.discovery_config SET phase2_settings = $1::jsonb, updated_at = now()`, [JSON.stringify(next)]);
        return next;
    }
    normalize(s) {
        const clamp = (v, lo, hi, d) => { const n = Number(v); return isFinite(n) ? Math.min(Math.max(Math.round(n), lo), hi) : d; };
        const cron = s.eventLogCron ? String(s.eventLogCron).trim() : null;
        if (cron && !(0, cron_util_1.validateCron)(cron))
            throw new common_1.BadRequestException(`Invalid eventLogCron '${cron}' — expected a 5-field cron expression`);
        const serviceCron = s.serviceListCron ? String(s.serviceListCron).trim() : null;
        if (serviceCron && !(0, cron_util_1.validateCron)(serviceCron))
            throw new common_1.BadRequestException(`Invalid serviceListCron '${serviceCron}' — expected a 5-field cron expression`);
        const perfCron = s.perfSampleCron ? String(s.perfSampleCron).trim() : null;
        if (perfCron && !(0, cron_util_1.validateCron)(perfCron))
            throw new common_1.BadRequestException(`Invalid perfSampleCron '${perfCron}' — expected a 5-field cron expression`);
        const levels = (s.eventLogDefaults?.levels ?? []).filter((l) => ['Critical', 'Error', 'Warning', 'Information'].includes(l));
        return {
            perfRawDays: clamp(s.perfRawDays, 1, 365, 7),
            perfRollupDays: clamp(s.perfRollupDays, 7, 3650, 90),
            eventLogDays: clamp(s.eventLogDays, 1, 3650, 30),
            jobHistoryDays: clamp(s.jobHistoryDays, 7, 3650, 90),
            eventLogCron: cron || null,
            serviceListCron: serviceCron || null,
            perfSampleCron: perfCron || null,
            eventLogDefaults: {
                logNames: (s.eventLogDefaults?.logNames ?? []).filter((l) => /^[A-Za-z0-9 _\-\/]{1,128}$/.test(l)).slice(0, 8),
                levels: levels.length ? levels : ['Critical', 'Error', 'Warning'],
                maxEntries: clamp(s.eventLogDefaults?.maxEntries, 1, 2000, 200),
                sinceHours: clamp(s.eventLogDefaults?.sinceHours, 1, 24 * 30, 24),
            },
            maintenanceWindow: (0, maintenance_window_1.normalizeWindow)(s.maintenanceWindow),
        };
    }
};
exports.Phase2SettingsRepository = Phase2SettingsRepository;
exports.Phase2SettingsRepository = Phase2SettingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], Phase2SettingsRepository);
