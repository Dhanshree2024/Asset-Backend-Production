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
exports.DeviceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classifier_service_1 = require("../enrichment/classifier.service");
const os_derivation_1 = require("../enrichment/os-derivation");
const device_interface_1 = require("../interfaces/device.interface");
const merge_util_1 = require("./merge.util");
let DeviceRepository = class DeviceRepository {
    constructor(dataSource, classifierService) {
        this.dataSource = dataSource;
        this.classifierService = classifierService;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async upsertDevices(schema, devices) {
        this.assertSchema(schema);
        if (!devices.length)
            return [];
        const ips = devices.map((d) => d.ip);
        const existingRows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_device WHERE COALESCE(site, '') = '' AND ip = ANY($1::inet[])`, [ips]);
        const existingByIp = new Map();
        for (const row of existingRows) {
            existingByIp.set(row.ip, this.mapRowToDevice(row));
        }
        const now = new Date();
        const rowsSql = [];
        const values = [];
        let i = 1;
        for (const d of devices) {
            const existing = existingByIp.get(d.ip) ?? null;
            console.log('existing devices details from upsert function:', existing);
            const mac = d.mac ?? existing?.mac ?? null;
            const hostname = d.hostname ?? existing?.hostname ?? null;
            const domain = d.domain ?? existing?.domain ?? null;
            const currentUser = d.currentUser ?? existing?.currentUser ?? null;
            const os = d.os ?? existing?.os ?? null;
            const vendor = d.vendor ?? existing?.vendor ?? null;
            const existingIsManual = !!existing?.sources?.includes('manual');
            const category = existingIsManual
                ? (existing?.category ?? 'unknown')
                : (d.category ?? existing?.category ?? 'unknown');
            const categoryConfidence = existingIsManual
                ? (existing?.categoryConfidence ?? 1)
                : (d.categoryConfidence ?? existing?.categoryConfidence ?? 0);
            const model = d.model ?? existing?.model ?? null;
            const segment = d.segment ?? existing?.segment ?? null;
            const openPorts = (0, merge_util_1.unionArrays)(existing?.openPorts, d.openPorts);
            const services = (0, merge_util_1.unionArrays)(existing?.services, d.services);
            const sources = (0, merge_util_1.unionArrays)(existing?.sources, d.sources);
            const specs = d.specs
                ? (0, merge_util_1.deepMergeObjects)(existing?.specs ?? null, d.specs)
                : (existing?.specs ?? null);
            const firstSeen = existing?.firstSeen
                ? new Date(existing.firstSeen)
                : now;
            rowsSql.push(`($${i++}::inet, $${i++}::macaddr, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, ` +
                `$${i++}, $${i++}::numeric, $${i++}, $${i++}, $${i++}::int[], $${i++}::text[], ` +
                `$${i++}::text[], $${i++}::timestamptz, $${i++}::timestamptz, $${i++}::jsonb)`);
            values.push(d.ip, mac, hostname, domain, currentUser, os, vendor, category, categoryConfidence, model, segment, openPorts, services, sources, firstSeen, now, specs ? JSON.stringify(specs) : null);
        }
        const sql = `
      INSERT INTO ${schema}.discovery_device
        (ip, mac, hostname, domain, logged_in_user, os, vendor, category, category_confidence,
         model, segment, open_ports, services, sources, first_seen, last_seen, specs)
      VALUES ${rowsSql.join(', ')}
      ON CONFLICT (COALESCE(site, ''), ip) DO UPDATE SET
        mac = EXCLUDED.mac,
        hostname = EXCLUDED.hostname,
        domain = EXCLUDED.domain,
        logged_in_user = EXCLUDED.logged_in_user,
        os = EXCLUDED.os,
        vendor = EXCLUDED.vendor,
        category = EXCLUDED.category,
        category_confidence = EXCLUDED.category_confidence,
        model = EXCLUDED.model,
        segment = EXCLUDED.segment,
        open_ports = EXCLUDED.open_ports,
        services = EXCLUDED.services,
        sources = EXCLUDED.sources,
        last_seen = EXCLUDED.last_seen,
        specs = EXCLUDED.specs
      RETURNING *
    `;
        const savedRows = await this.dataSource.query(sql, values);
        return savedRows.map((r) => this.mapRowToDevice(r));
    }
    async listDevices(schema, filters = {}) {
        this.assertSchema(schema);
        const clauses = [];
        const params = [];
        const push = (v) => {
            params.push(v);
            return `$${params.length}`;
        };
        if (filters.category)
            clauses.push(`category = ${push(filters.category)}`);
        if (filters.segment)
            clauses.push(`segment = ${push(filters.segment)}`);
        if (filters.search?.trim()) {
            const ph = push(`%${filters.search.trim()}%`);
            clauses.push(`(
        host(ip) ILIKE ${ph}
        OR hostname ILIKE ${ph}
        OR vendor ILIKE ${ph}
        OR mac::text ILIKE ${ph}
        OR domain ILIKE ${ph}
        OR logged_in_user ILIKE ${ph}
        OR os ILIKE ${ph}
        OR array_to_string(open_ports, ',') ILIKE ${ph}
      )`);
        }
        if (filters.isSelectAll) {
            if (filters.excludeIds?.length) {
                const ids = filters.excludeIds.map(Number);
                clauses.push(`id != ALL(${push(ids)}::bigint[])`);
            }
        }
        else if (filters.selectedIds?.length) {
            const ids = filters.selectedIds.map(Number);
            clauses.push(`id = ANY(${push(ids)}::bigint[])`);
        }
        let orderByClause = 'ORDER BY last_seen DESC';
        if (filters.sortField && filters.sortDirection) {
            const fieldMap = {
                ip: 'ip',
                hostname: 'hostname',
                category: 'category',
                os: 'os',
                domain: 'domain',
                currentUser: 'logged_in_user',
                vendor: 'vendor',
                mac: 'mac',
                lastSeen: 'last_seen',
            };
            const mappedField = fieldMap[filters.sortField];
            if (mappedField) {
                const direction = filters.sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
                orderByClause = `ORDER BY ${mappedField} ${direction}`;
            }
        }
        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_device ${whereSql} ${orderByClause}`, params);
        return rows.map((r) => this.mapRowToDevice(r));
    }
    async getDevice(schema, id) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_device WHERE id = $1::bigint`, [id]);
        if (!rows.length)
            return null;
        const device = this.mapRowToDevice(rows[0]);
        const softwareRows = await this.dataSource.query(`SELECT id, name, version, publisher, install_date, install_location,
              architecture, product_code, reported_at
       FROM ${schema}.installed_software
       WHERE device_id = $1::bigint
       ORDER BY name ASC`, [id]);
        const software = softwareRows.map((s) => ({
            id: Number(s.id),
            name: s.name,
            version: s.version ?? null,
            publisher: s.publisher ?? null,
            installDate: s.install_date ?? null,
            installLocation: s.install_location ?? null,
            architecture: s.architecture ?? null,
            productCode: s.product_code ?? null,
            reportedAt: s.reported_at,
        }));
        return { ...device, software };
    }
    async summary(schema) {
        this.assertSchema(schema);
        const [totalRow] = await this.dataSource.query(`SELECT COUNT(*)::int AS total FROM ${schema}.discovery_device`);
        const byCategoryRows = await this.dataSource.query(`SELECT category, COUNT(*)::int AS count
       FROM ${schema}.discovery_device
       GROUP BY category
       ORDER BY count DESC`);
        const bySegmentRows = await this.dataSource.query(`SELECT COALESCE(segment, 'unassigned') AS segment, COUNT(*)::int AS count
       FROM ${schema}.discovery_device
       GROUP BY COALESCE(segment, 'unassigned')
       ORDER BY count DESC`);
        const [lastRunRow] = await this.dataSource.query(`SELECT id, started_at, finished_at, duration_ms, device_count, scanners
       FROM ${schema}.discovery_scan_run
       ORDER BY started_at DESC
       LIMIT 1`);
        return {
            total: totalRow?.total ?? 0,
            byCategory: Object.fromEntries(byCategoryRows.map((r) => [r.category, r.count])),
            bySegment: Object.fromEntries(bySegmentRows.map((r) => [r.segment, r.count])),
            lastRun: lastRunRow
                ? {
                    id: lastRunRow.id,
                    startedAt: lastRunRow.started_at,
                    finishedAt: lastRunRow.finished_at ?? null,
                    durationMs: lastRunRow.duration_ms !== null &&
                        lastRunRow.duration_ms !== undefined
                        ? Number(lastRunRow.duration_ms)
                        : null,
                    deviceCount: lastRunRow.device_count !== null &&
                        lastRunRow.device_count !== undefined
                        ? Number(lastRunRow.device_count)
                        : null,
                    scanners: Array.isArray(lastRunRow.scanners)
                        ? lastRunRow.scanners
                        : [],
                }
                : null,
        };
    }
    async reclassifyAll(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT id, hostname, model, vendor, category, category_confidence,
              services, open_ports, os, domain, sources, mac
       FROM ${schema}.discovery_device`);
        let updated = 0;
        for (const row of rows) {
            const sources = Array.isArray(row.sources)
                ? row.sources
                : [];
            if (sources.includes('manual'))
                continue;
            const deviceLike = {
                hostname: row.hostname ?? null,
                model: row.model ?? null,
                vendor: row.vendor ?? null,
                services: Array.isArray(row.services) ? row.services : [],
                openPorts: Array.isArray(row.open_ports)
                    ? row.open_ports.map((p) => Number(p))
                    : [],
                os: row.os ?? null,
                domain: row.domain ?? null,
                sources,
                mac: row.mac ?? null,
            };
            const classification = this.classifierService.classify(deviceLike);
            const newOs = (0, os_derivation_1.deriveOs)({
                ...deviceLike,
                category: classification.category,
            }) ||
                row.os ||
                null;
            const newModel = classification.modelHint && !deviceLike.model
                ? classification.modelHint
                : (row.model ?? null);
            const categoryChanged = classification.category !== row.category;
            const confidenceChanged = Math.abs(classification.confidence - Number(row.category_confidence ?? 0)) > 1e-9;
            const osChanged = (newOs ?? null) !== (row.os ?? null);
            const modelChanged = (newModel ?? null) !== (row.model ?? null);
            if (!categoryChanged && !confidenceChanged && !osChanged && !modelChanged)
                continue;
            await this.dataSource.query(`UPDATE ${schema}.discovery_device
         SET category = $1, category_confidence = $2, os = $3, model = $4
         WHERE id = $5::bigint`, [
                classification.category,
                classification.confidence,
                newOs,
                newModel,
                row.id,
            ]);
            updated++;
        }
        return updated;
    }
    async setDeviceCategory(schema, ids, category) {
        this.assertSchema(schema);
        if (!device_interface_1.DEVICE_CATEGORIES.includes(category)) {
            throw new common_1.BadRequestException(`Invalid category '${category}'`);
        }
        if (!Array.isArray(ids) || !ids.length)
            return 0;
        const rows = await this.dataSource.query(`UPDATE ${schema}.discovery_device
       SET category = $1,
           category_confidence = 1,
           sources = CASE WHEN 'manual' = ANY(sources) THEN sources ELSE array_append(sources, 'manual') END
       WHERE id = ANY($2::bigint[])
       RETURNING id`, [category, ids]);
        return rows.length;
    }
    async replaceSoftware(schema, deviceId, software) {
        this.assertSchema(schema);
        await this.dataSource.query(`DELETE FROM ${schema}.installed_software WHERE device_id = $1::bigint`, [deviceId]);
        const usable = (software || []).filter((s) => s?.name);
        if (!usable.length)
            return;
        const rowsSql = [];
        const values = [];
        let i = 1;
        for (const s of usable) {
            rowsSql.push(`($${i++}::bigint, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, now())`);
            values.push(deviceId, s.name, s.version ?? null, s.publisher ?? null, s.installDate ?? null, s.installLocation ?? null, s.architecture ?? null, s.productCode ?? null, s.uninstallString ?? null);
        }
        await this.dataSource.query(`INSERT INTO ${schema}.installed_software
         (device_id, name, version, publisher, install_date, install_location,
          architecture, product_code, uninstall_string, reported_at)
       VALUES ${rowsSql.join(', ')}`, values);
    }
    async listSoftwareInventory(schema, filters = {}) {
        this.assertSchema(schema);
        const clauses = [];
        const params = [];
        const push = (v) => {
            params.push(v);
            return `$${params.length}`;
        };
        if (filters.category)
            clauses.push(`d.category = ${push(filters.category)}`);
        if (filters.segment)
            clauses.push(`d.segment = ${push(filters.segment)}`);
        if (filters.search?.trim()) {
            const ph = push(`%${filters.search.trim()}%`);
            clauses.push(`(
        host(d.ip) ILIKE ${ph}
        OR d.hostname ILIKE ${ph}
        OR d.vendor ILIKE ${ph}
        OR d.mac::text ILIKE ${ph}
        OR d.domain ILIKE ${ph}
        OR d.logged_in_user ILIKE ${ph}
        OR d.os ILIKE ${ph}
        OR array_to_string(d.open_ports, ',') ILIKE ${ph}
      )`);
        }
        if (filters.isSelectAll) {
            if (filters.excludeIds?.length) {
                const ids = filters.excludeIds.map(Number);
                clauses.push(`d.id != ALL(${push(ids)}::bigint[])`);
            }
        }
        else if (filters.selectedIds?.length) {
            const ids = filters.selectedIds.map(Number);
            clauses.push(`d.id = ANY(${push(ids)}::bigint[])`);
        }
        let orderByClause = 'ORDER BY host(d.ip), s.name';
        if (filters.sortField && filters.sortDirection) {
            const fieldMap = {
                ip: 'd.ip',
                hostname: 'd.hostname',
                category: 'd.category',
                os: 'd.os',
                domain: 'd.domain',
                currentUser: 'd.logged_in_user',
                vendor: 'd.vendor',
                mac: 'd.mac',
                lastSeen: 'd.last_seen',
            };
            const mappedField = fieldMap[filters.sortField];
            if (mappedField) {
                const direction = filters.sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
                orderByClause = `ORDER BY ${mappedField} ${direction}, s.name ASC`;
            }
        }
        const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const rows = await this.dataSource.query(`
      SELECT host(d.ip) AS ip, d.hostname, s.name, s.version, s.publisher,
             s.install_date, s.architecture, s.product_code, s.reported_at
      FROM ${schema}.installed_software s
      JOIN ${schema}.discovery_device d ON d.id = s.device_id
      ${whereSql}
      ${orderByClause}
    `, params);
        return rows.map((r) => ({
            ip: r.ip,
            hostname: r.hostname ?? null,
            name: r.name,
            version: r.version ?? null,
            publisher: r.publisher ?? null,
            installDate: r.install_date ?? null,
            architecture: r.architecture ?? null,
            productCode: r.product_code ?? null,
            reportedAt: r.reported_at,
        }));
    }
    async recordScanRun(schema, run) {
        this.assertSchema(schema);
        await this.dataSource.query(`INSERT INTO ${schema}.discovery_scan_run
        (started_at, finished_at, duration_ms, device_count, scanners)
       VALUES ($1::timestamptz, $2::timestamptz, $3::int, $4::int, $5::text[])`, [
            run.startedAt,
            run.finishedAt,
            run.durationMs,
            run.deviceCount,
            run.scanners,
        ]);
    }
    async getLastScanRun(schema) {
        this.assertSchema(schema);
        const [row] = await this.dataSource.query(`SELECT id, started_at, finished_at, duration_ms, device_count, scanners
       FROM ${schema}.discovery_scan_run
       ORDER BY started_at DESC
       LIMIT 1`);
        if (!row)
            return null;
        return {
            id: String(row.id),
            startedAt: row.started_at,
            finishedAt: row.finished_at ?? null,
            durationMs: row.duration_ms !== null && row.duration_ms !== undefined
                ? Number(row.duration_ms)
                : null,
            deviceCount: row.device_count !== null && row.device_count !== undefined
                ? Number(row.device_count)
                : null,
            scanners: Array.isArray(row.scanners) ? row.scanners : [],
        };
    }
    async getConfig(schema) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.discovery_config LIMIT 1`);
        if (!rows.length) {
            return this.insertDefaultConfig(schema);
        }
        return this.mapRowToConfig(rows[0]);
    }
    async updateConfig(schema, patch) {
        this.assertSchema(schema);
        const existingRows = await this.dataSource.query(`SELECT id FROM ${schema}.discovery_config LIMIT 1`);
        if (!existingRows.length) {
            await this.insertDefaultConfig(schema);
        }
        const setClauses = [];
        const params = [];
        const push = (v) => {
            params.push(v);
            return `$${params.length}`;
        };
        if (patch.segments !== undefined) {
            setClauses.push(`segments = ${push(JSON.stringify(patch.segments))}::jsonb`);
        }
        if (patch.scanCron !== undefined) {
            setClauses.push(`scan_cron = ${push(patch.scanCron)}`);
        }
        if (patch.fingerprintPorts !== undefined) {
            setClauses.push(`fingerprint_ports = ${push(patch.fingerprintPorts)}::int[]`);
        }
        if (patch.snmpEnabled !== undefined) {
            setClauses.push(`snmp_enabled = ${push(patch.snmpEnabled)}`);
        }
        if (patch.snmpCommunity !== undefined) {
            setClauses.push(`snmp_community = ${push(patch.snmpCommunity)}`);
        }
        if (patch.snmpSweepAll !== undefined) {
            setClauses.push(`snmp_sweep_all = ${push(patch.snmpSweepAll)}`);
        }
        if (patch.snmpDevices !== undefined) {
            setClauses.push(`snmp_devices = ${push(patch.snmpDevices)}::inet[]`);
        }
        if (patch.autoDetectSubnets !== undefined) {
            setClauses.push(`auto_detect_subnets = ${push(patch.autoDetectSubnets)}`);
        }
        setClauses.push(`updated_at = now()`);
        if (setClauses.length === 1) {
            return this.getConfig(schema);
        }
        await this.dataSource.query(`UPDATE ${schema}.discovery_config SET ${setClauses.join(', ')}`, params);
        return this.getConfig(schema);
    }
    async insertDefaultConfig(schema) {
        const d = device_interface_1.DEFAULT_DISCOVERY_CONFIG;
        const rows = await this.dataSource.query(`INSERT INTO ${schema}.discovery_config
         (segments, scan_cron, fingerprint_ports, snmp_enabled, snmp_community,
          snmp_sweep_all, snmp_devices, auto_detect_subnets, updated_at)
       VALUES ($1::jsonb, $2, $3::int[], $4, $5, $6, $7::inet[], $8, now())
       RETURNING *`, [
            JSON.stringify(d.segments),
            d.scanCron,
            d.fingerprintPorts,
            d.snmpEnabled,
            d.snmpCommunity,
            d.snmpSweepAll,
            d.snmpDevices,
            d.autoDetectSubnets,
        ]);
        return this.mapRowToConfig(rows[0]);
    }
    mapRowToDevice(row) {
        return {
            id: row.id,
            ip: row.ip,
            mac: row.mac ?? null,
            hostname: row.hostname ?? null,
            domain: row.domain ?? null,
            currentUser: row.logged_in_user ?? null,
            os: row.os ?? null,
            vendor: row.vendor ?? null,
            category: row.category ?? 'unknown',
            categoryConfidence: row.category_confidence !== null &&
                row.category_confidence !== undefined
                ? Number(row.category_confidence)
                : 0,
            model: row.model ?? null,
            segment: row.segment ?? null,
            openPorts: Array.isArray(row.open_ports)
                ? row.open_ports.map((p) => Number(p))
                : [],
            services: Array.isArray(row.services) ? row.services : [],
            sources: Array.isArray(row.sources) ? row.sources : [],
            firstSeen: row.first_seen
                ? new Date(row.first_seen).toISOString()
                : undefined,
            lastSeen: row.last_seen
                ? new Date(row.last_seen).toISOString()
                : undefined,
            specs: row.specs ?? null,
        };
    }
    mapRowToConfig(row) {
        return {
            segments: Array.isArray(row.segments) ? row.segments : [],
            scanCron: row.scan_cron ?? device_interface_1.DEFAULT_DISCOVERY_CONFIG.scanCron,
            fingerprintPorts: Array.isArray(row.fingerprint_ports)
                ? row.fingerprint_ports.map((p) => Number(p))
                : device_interface_1.DEFAULT_DISCOVERY_CONFIG.fingerprintPorts,
            snmpEnabled: !!row.snmp_enabled,
            snmpCommunity: row.snmp_community ?? null,
            snmpSweepAll: !!row.snmp_sweep_all,
            snmpDevices: Array.isArray(row.snmp_devices) ? row.snmp_devices : [],
            autoDetectSubnets: row.auto_detect_subnets !== null &&
                row.auto_detect_subnets !== undefined
                ? !!row.auto_detect_subnets
                : true,
        };
    }
};
exports.DeviceRepository = DeviceRepository;
exports.DeviceRepository = DeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        classifier_service_1.ClassifierService])
], DeviceRepository);
