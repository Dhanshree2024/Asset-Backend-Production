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
exports.EndpointRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let EndpointRepository = class EndpointRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async listServices(schema, deviceId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_device_service WHERE device_id = $1::bigint ORDER BY lower(COALESCE(display_name, name))`, [deviceId]);
        return rows.map((r) => this.mapService(r));
    }
    async replaceServices(schema, deviceId, services, jobId) {
        this.assertSchema(schema);
        const usable = (services || []).filter((s) => s && s.name);
        await this.dataSource.query(`DELETE FROM ${schema}.discovery_device_service WHERE device_id = $1::bigint`, [deviceId]);
        if (!usable.length)
            return 0;
        const sql = [];
        const vals = [];
        let i = 1;
        for (const s of usable) {
            sql.push(`($${i++}::bigint, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, now(), $${i++})`);
            vals.push(deviceId, s.name, s.displayName ?? null, s.status ?? null, s.startType ?? null, s.account ?? null, s.binaryPath ?? null, s.description ?? null, jobId);
        }
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_device_service
         (device_id, name, display_name, status, start_type, account, binary_path, description, collected_at, job_id)
       VALUES ${sql.join(', ')}`, vals);
        return usable.length;
    }
    async upsertService(schema, deviceId, s, jobId) {
        this.assertSchema(schema);
        if (!s?.name)
            return;
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_device_service
         (device_id, name, display_name, status, start_type, account, binary_path, description, collected_at, job_id)
       VALUES ($1::bigint, $2, $3, $4, $5, $6, $7, $8, now(), $9)
       ON CONFLICT (device_id, name) DO UPDATE SET
         display_name = COALESCE(EXCLUDED.display_name, ${schema}.discovery_device_service.display_name),
         status = EXCLUDED.status, start_type = COALESCE(EXCLUDED.start_type, ${schema}.discovery_device_service.start_type),
         account = COALESCE(EXCLUDED.account, ${schema}.discovery_device_service.account),
         collected_at = now(), job_id = EXCLUDED.job_id`, [deviceId, s.name, s.displayName ?? null, s.status ?? null, s.startType ?? null, s.account ?? null, s.binaryPath ?? null, s.description ?? null, jobId]);
    }
    async insertEvents(schema, deviceId, events, jobId) {
        this.assertSchema(schema);
        const usable = (events || []).filter((e) => e && e.logName);
        if (!usable.length)
            return 0;
        let inserted = 0;
        for (let b = 0; b < usable.length; b += 200) {
            const chunk = usable.slice(b, b + 200);
            const sql = [];
            const vals = [];
            let i = 1;
            for (const e of chunk) {
                sql.push(`($${i++}::bigint, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::timestamptz, $${i++}, now(), $${i++})`);
                vals.push(deviceId, e.logName, e.eventId ?? null, e.level ?? null, e.source ?? null, typeof e.message === 'string' ? e.message.slice(0, 8000) : null, e.timeCreated ?? null, e.recordId ?? null, jobId);
            }
            const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_event_log
           (device_id, log_name, event_id, level, source, message, time_created, record_id, collected_at, job_id)
         VALUES ${sql.join(', ')}
         ON CONFLICT (device_id, log_name, record_id) WHERE record_id IS NOT NULL DO NOTHING
         RETURNING id`, vals);
            inserted += rows.length;
        }
        return inserted;
    }
    async listEvents(schema, deviceId, f = {}) {
        this.assertSchema(schema);
        const clauses = ['device_id = $1::bigint'];
        const params = [deviceId];
        if (f.logName) {
            params.push(f.logName);
            clauses.push(`log_name = $${params.length}`);
        }
        if (f.level) {
            params.push(f.level);
            clauses.push(`level = $${params.length}`);
        }
        params.push(Math.min(Math.max(Number(f.limit) || 200, 1), 2000));
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_event_log WHERE ${clauses.join(' AND ')}
       ORDER BY time_created DESC NULLS LAST, id DESC LIMIT $${params.length}::int`, params);
        return rows.map((r) => ({
            id: String(r.id), deviceId: String(r.device_id), logName: r.log_name, eventId: r.event_id ?? null,
            level: r.level ?? null, source: r.source ?? null, message: r.message ?? null,
            timeCreated: r.time_created ? new Date(r.time_created).toISOString() : null,
            recordId: r.record_id === null ? null : String(r.record_id),
            collectedAt: r.collected_at ? new Date(r.collected_at).toISOString() : '',
        }));
    }
    async insertPerfSamples(schema, deviceId, samples, jobId) {
        this.assertSchema(schema);
        const usable = (samples || []).filter((s) => s && s.sampledAt);
        if (!usable.length)
            return 0;
        const sql = [];
        const vals = [];
        let i = 1;
        for (const s of usable) {
            sql.push(`($${i++}::bigint, $${i++}::timestamptz, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::jsonb, $${i++})`);
            vals.push(deviceId, s.sampledAt, s.cpuPct ?? null, s.memUsedPct ?? null, s.memUsedMb ?? null, s.diskReadKbps ?? null, s.diskWriteKbps ?? null, s.netInKbps ?? null, s.netOutKbps ?? null, s.metrics ? JSON.stringify(s.metrics) : null, jobId);
        }
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_perf_sample
         (device_id, sampled_at, cpu_pct, mem_used_pct, mem_used_mb, disk_read_kbps, disk_write_kbps, net_in_kbps, net_out_kbps, metrics, job_id)
       VALUES ${sql.join(', ')}`, vals);
        return usable.length;
    }
    async listPerfSamples(schema, deviceId, hours = 24) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_perf_sample
       WHERE device_id = $1::bigint AND sampled_at >= now() - ($2::int * interval '1 hour')
       ORDER BY sampled_at ASC`, [deviceId, Math.min(Math.max(Number(hours) || 24, 1), 24 * 30)]);
        return rows.map((r) => ({
            deviceId: String(r.device_id), sampledAt: new Date(r.sampled_at).toISOString(),
            cpuPct: r.cpu_pct, memUsedPct: r.mem_used_pct, memUsedMb: r.mem_used_mb,
            diskReadKbps: r.disk_read_kbps, diskWriteKbps: r.disk_write_kbps, netInKbps: r.net_in_kbps, netOutKbps: r.net_out_kbps,
        }));
    }
    async rollupAndPrune(schema, keepRawDays = 7) {
        this.assertSchema(schema);
        const rolled = await this.dataSource.query(`INSERT INTO ${schema}.discovery_perf_rollup_hourly
         (device_id, hour_start, samples, cpu_avg, cpu_max, mem_avg, mem_max, disk_read_avg, disk_write_avg, net_in_avg, net_out_avg)
       SELECT device_id, date_trunc('hour', sampled_at), count(*),
              avg(cpu_pct), max(cpu_pct), avg(mem_used_pct), max(mem_used_pct),
              avg(disk_read_kbps), avg(disk_write_kbps), avg(net_in_kbps), avg(net_out_kbps)
       FROM ${schema}.discovery_perf_sample
       WHERE sampled_at < date_trunc('hour', now())
       GROUP BY device_id, date_trunc('hour', sampled_at)
       ON CONFLICT (device_id, hour_start) DO UPDATE SET
         samples = EXCLUDED.samples, cpu_avg = EXCLUDED.cpu_avg, cpu_max = EXCLUDED.cpu_max,
         mem_avg = EXCLUDED.mem_avg, mem_max = EXCLUDED.mem_max, disk_read_avg = EXCLUDED.disk_read_avg,
         disk_write_avg = EXCLUDED.disk_write_avg, net_in_avg = EXCLUDED.net_in_avg, net_out_avg = EXCLUDED.net_out_avg
       RETURNING device_id`);
        const pruned = await this.dataSource.query(`DELETE FROM ${schema}.discovery_perf_sample WHERE sampled_at < now() - ($1::int * interval '1 day') RETURNING id`, [keepRawDays]);
        return { rolled: rolled.length, pruned: pruned.length };
    }
    async pruneRollups(schema, days) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_perf_rollup_hourly WHERE hour_start < now() - ($1::int * interval '1 day') RETURNING device_id`, [Math.max(Number(days) || 90, 1)]);
        return rows.length;
    }
    async pruneEvents(schema, days) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`DELETE FROM ${schema}.discovery_event_log WHERE COALESCE(time_created, collected_at) < now() - ($1::int * interval '1 day') RETURNING id`, [Math.max(Number(days) || 30, 1)]);
        return rows.length;
    }
    async insertNetDiagRun(schema, run) {
        this.assertSchema(schema);
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_net_diag_run
         (device_id, tool, target, params, output, exit_code, duration_ms, ran_by, job_id, created_at)
       VALUES ($1::bigint, $2, $3, $4::jsonb, $5, $6, $7, $8, $9::bigint, now())`, [run.deviceId, run.tool, run.target, run.params ? JSON.stringify(run.params) : null,
            typeof run.output === 'string' ? run.output.slice(0, 200000) : null, run.exitCode, run.durationMs, run.ranBy, run.jobId]);
    }
    async listNetDiagRuns(schema, deviceId, limit = 50) {
        this.assertSchema(schema);
        const params = [];
        let where = '';
        if (deviceId) {
            params.push(deviceId);
            where = `WHERE device_id = $1::bigint`;
        }
        params.push(Math.min(Math.max(Number(limit) || 50, 1), 500));
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_net_diag_run ${where} ORDER BY created_at DESC LIMIT $${params.length}::int`, params);
        return rows.map((r) => ({
            id: String(r.id), deviceId: r.device_id === null ? null : String(r.device_id), tool: r.tool, target: r.target,
            params: r.params ?? null, output: r.output ?? null, exitCode: r.exit_code ?? null, durationMs: r.duration_ms ?? null,
            ranBy: r.ran_by ?? null, jobId: r.job_id === null ? null : String(r.job_id),
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
        }));
    }
    mapService(r) {
        return {
            id: String(r.id), deviceId: String(r.device_id), name: r.name, displayName: r.display_name ?? null,
            status: r.status ?? null, startType: r.start_type ?? null, account: r.account ?? null,
            binaryPath: r.binary_path ?? null, description: r.description ?? null,
            collectedAt: r.collected_at ? new Date(r.collected_at).toISOString() : '',
        };
    }
};
exports.EndpointRepository = EndpointRepository;
exports.EndpointRepository = EndpointRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], EndpointRepository);
