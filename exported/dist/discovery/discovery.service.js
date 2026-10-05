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
var DiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cron_util_1 = require("./config/cron.util");
const discovery_config_service_1 = require("./config/discovery-config.service");
const classifier_service_1 = require("./enrichment/classifier.service");
const http_probe_service_1 = require("./enrichment/http-probe.service");
const os_derivation_1 = require("./enrichment/os-derivation");
const oui_service_1 = require("./enrichment/oui.service");
const arp_scanner_1 = require("./scanners/arp.scanner");
const mdns_scanner_1 = require("./scanners/mdns.scanner");
const net_utils_1 = require("./scanners/net-utils");
const netbios_scanner_1 = require("./scanners/netbios.scanner");
const ping_scanner_1 = require("./scanners/ping.scanner");
const snmp_scanner_1 = require("./scanners/snmp.scanner");
const ssdp_scanner_1 = require("./scanners/ssdp.scanner");
const device_repository_1 = require("./store/device.repository");
const merge_util_1 = require("./store/merge.util");
const redis_service_1 = require("../common/redis/redis.service");
const SCAN_LOCK_TTL_SECONDS = 60 * 60;
const WEB_ENRICH_PORTS = new Set([
    80, 443, 8080, 8000, 81, 88, 8081, 7001, 9000, 8443,
]);
const HTTP_ENRICH_CONCURRENCY = 32;
let DiscoveryService = DiscoveryService_1 = class DiscoveryService {
    constructor(dataSource, arpScanner, pingScanner, mdnsScanner, ssdpScanner, netbiosScanner, snmpScanner, ouiService, httpProbeService, classifierService, deviceRepository, configService, redis) {
        this.dataSource = dataSource;
        this.arpScanner = arpScanner;
        this.pingScanner = pingScanner;
        this.mdnsScanner = mdnsScanner;
        this.ssdpScanner = ssdpScanner;
        this.netbiosScanner = netbiosScanner;
        this.snmpScanner = snmpScanner;
        this.ouiService = ouiService;
        this.httpProbeService = httpProbeService;
        this.classifierService = classifierService;
        this.deviceRepository = deviceRepository;
        this.configService = configService;
        this.redis = redis;
        this.logger = new common_1.Logger(DiscoveryService_1.name);
        this.runningSchemas = new Set();
        this.lastRun = new Map();
        this.firedMinute = new Map();
    }
    async runScan(schema) {
        if (this.runningSchemas.has(schema)) {
            return {
                status: false,
                message: 'A discovery scan is already running for this organization',
            };
        }
        const lockKey = `discovery:scan-lock:${schema}`;
        const locked = await this.redis.tryLock(lockKey, SCAN_LOCK_TTL_SECONDS);
        if (!locked) {
            return {
                status: false,
                message: 'A discovery scan is already running for this organization (on another node)',
            };
        }
        this.runningSchemas.add(schema);
        const startedAt = new Date();
        try {
            const config = await this.configService.getConfig(schema);
            const segments = await this.configService.resolveSegments(schema);
            const cidrs = segments.map((s) => s.cidr).filter(Boolean);
            this.pingScanner.setPorts(config.fingerprintPorts);
            this.snmpScanner.setEnabled(!!config.snmpEnabled);
            this.snmpScanner.setCommunity(config.snmpEnabled ? config.snmpCommunity : null);
            const phase1Scanners = [
                this.pingScanner,
                this.mdnsScanner,
                this.ssdpScanner,
                this.netbiosScanner,
            ];
            if (config.snmpEnabled)
                phase1Scanners.push(this.snmpScanner);
            const phase1Settled = await Promise.allSettled(phase1Scanners.map((s) => s.scan(cidrs)));
            const partials = [];
            for (const settled of phase1Settled) {
                if (settled.status === 'fulfilled')
                    partials.push(...settled.value);
            }
            try {
                const arpResults = await this.arpScanner.scan(cidrs);
                partials.push(...arpResults);
            }
            catch (err) {
                this.logger.debug(`ARP scan phase failed: ${err?.message}`);
            }
            const merged = this.mergePartials(partials);
            let devices = [];
            for (const d of merged.values()) {
                const matchingSegment = segments.find((s) => (0, net_utils_1.ipInCidr)(d.ip, s.cidr));
                if (!matchingSegment)
                    continue;
                d.segment = matchingSegment.label;
                devices.push(d);
            }
            devices = await (0, net_utils_1.pool)(devices, async (d) => {
                if (d.mac && !d.vendor) {
                    const vendor = this.ouiService.lookup(d.mac);
                    if (vendor)
                        d.vendor = vendor;
                }
                if (d.openPorts.some((p) => WEB_ENRICH_PORTS.has(p))) {
                    try {
                        const probe = await this.httpProbeService.probe(d.ip, d.openPorts);
                        if (probe.server && !d.services.includes(probe.server)) {
                            d.services.push(probe.server);
                        }
                        if (probe.poweredBy && !d.services.includes(probe.poweredBy)) {
                            d.services.push(probe.poweredBy);
                        }
                        if (probe.realm && !d.model)
                            d.model = probe.realm;
                        if (probe.title && !d.hostname)
                            d.hostname = probe.title;
                    }
                    catch {
                    }
                }
                const classification = this.classifierService.classify(d);
                d.category = classification.category;
                d.categoryConfidence = classification.confidence;
                if (d.category === 'virtual-machine' && d.mac) {
                    const hypervisor = this.ouiService.hypervisorName(d.mac);
                    if (hypervisor) {
                        if (!d.model)
                            d.model =
                                classification.modelHint || `${hypervisor} Virtual Machine`;
                        const infoTag = `virtual:${hypervisor}`;
                        if (!d.services.includes(infoTag))
                            d.services.push(infoTag);
                    }
                }
                return d;
            }, HTTP_ENRICH_CONCURRENCY);
            for (const d of devices) {
                d.os = (0, os_derivation_1.deriveOs)(d) || d.os || null;
            }
            await this.deviceRepository.upsertDevices(schema, devices);
            const finishedAt = new Date();
            const durationMs = finishedAt.getTime() - startedAt.getTime();
            const scannersUsed = Array.from(new Set([
                ...phase1Scanners.map((s) => s.source),
                this.arpScanner.source,
            ]));
            await this.deviceRepository.recordScanRun(schema, {
                startedAt,
                finishedAt,
                durationMs,
                deviceCount: devices.length,
                scanners: scannersUsed,
            });
            const deviceCountByCidr = {};
            for (const s of segments) {
                deviceCountByCidr[s.cidr] = devices.filter((d) => (0, net_utils_1.ipInCidr)(d.ip, s.cidr)).length;
            }
            await this.configService.recordSegmentScan(schema, cidrs, finishedAt, durationMs, deviceCountByCidr);
            this.lastRun.set(schema, {
                at: finishedAt,
                ms: durationMs,
                deviceCount: devices.length,
            });
            return {
                status: true,
                deviceCount: devices.length,
                durationMs,
                scanners: scannersUsed,
            };
        }
        catch (err) {
            this.logger.error(`Discovery scan failed for ${schema}: ${err?.message ?? err}`);
            return {
                status: false,
                message: 'Discovery scan failed',
                error: err?.message ?? String(err),
            };
        }
        finally {
            this.runningSchemas.delete(schema);
            await this.redis.releaseLock(lockKey);
        }
    }
    async getStatus(schema) {
        const scanners = [
            this.arpScanner,
            this.pingScanner,
            this.mdnsScanner,
            this.ssdpScanner,
            this.netbiosScanner,
            this.snmpScanner,
        ];
        const availability = await Promise.all(scanners.map(async (s) => ({
            source: s.source,
            available: await this.safeIsAvailable(s),
        })));
        let last = this.lastRun.get(schema) ?? null;
        if (!last) {
            try {
                const persisted = await this.deviceRepository.getLastScanRun(schema);
                if (persisted?.finishedAt) {
                    last = {
                        at: new Date(persisted.finishedAt),
                        ms: persisted.durationMs ?? 0,
                        deviceCount: persisted.deviceCount ?? 0,
                    };
                    this.lastRun.set(schema, last);
                }
            }
            catch (err) {
                this.logger.debug(`getStatus: could not read last scan run for ${schema}: ${err?.message}`);
            }
        }
        return {
            running: this.runningSchemas.has(schema),
            lastRunAt: last?.at ? last.at.toISOString() : null,
            lastRunMs: last?.ms ?? null,
            deviceCount: last?.deviceCount ?? null,
            scanners: availability,
        };
    }
    async safeIsAvailable(s) {
        try {
            return await s.isAvailable();
        }
        catch {
            return false;
        }
    }
    mergePartials(results) {
        const ipToMac = new Map();
        for (const r of results) {
            if (r.ip && r.mac)
                ipToMac.set(r.ip, r.mac);
        }
        const merged = new Map();
        for (const r of results) {
            if (!r.ip)
                continue;
            const mac = r.mac ?? ipToMac.get(r.ip) ?? null;
            const existing = merged.get(r.ip);
            if (!existing) {
                merged.set(r.ip, {
                    ip: r.ip,
                    mac,
                    hostname: r.hostname ?? null,
                    domain: r.domain ?? null,
                    currentUser: r.user ?? null,
                    os: r.os ?? null,
                    vendor: r.vendor ?? null,
                    category: 'unknown',
                    categoryConfidence: 0,
                    model: r.model ?? null,
                    segment: null,
                    openPorts: r.openPorts ? [...r.openPorts] : [],
                    services: r.services ? [...r.services] : [],
                    sources: [r.source],
                    specs: r.specs ? (0, merge_util_1.deepMergeObjects)(null, r.specs) : null,
                });
                continue;
            }
            if (mac && !existing.mac)
                existing.mac = mac;
            if (r.hostname && !existing.hostname)
                existing.hostname = r.hostname;
            if (r.domain && !existing.domain)
                existing.domain = r.domain;
            if (r.user && !existing.currentUser)
                existing.currentUser = r.user;
            if (r.os && !existing.os)
                existing.os = r.os;
            if (r.vendor && !existing.vendor)
                existing.vendor = r.vendor;
            if (r.model && !existing.model)
                existing.model = r.model;
            existing.openPorts = (0, merge_util_1.unionArrays)(existing.openPorts, r.openPorts).sort((a, b) => a - b);
            existing.services = (0, merge_util_1.unionArrays)(existing.services, r.services);
            if (!existing.sources.includes(r.source))
                existing.sources.push(r.source);
            if (r.specs)
                existing.specs = (0, merge_util_1.deepMergeObjects)(existing.specs, r.specs);
        }
        return merged;
    }
    async runScheduled() {
        const now = new Date();
        const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}`;
        let schemas = [];
        try {
            const rows = await this.dataSource.query(`
        SELECT DISTINCT table_schema
        FROM information_schema.tables
        WHERE table_name = 'discovery_config'
          AND table_schema LIKE 'org\\_%' ESCAPE '\\'
      `);
            schemas = rows.map((r) => r.table_schema);
        }
        catch (err) {
            this.logger.warn(`Scheduled discovery: failed to enumerate org schemas: ${err?.message}`);
            return;
        }
        for (const schema of schemas) {
            try {
                const config = await this.configService.getConfig(schema);
                const cron = config.scanCron || '*/15 * * * *';
                if (!(0, cron_util_1.cronMatches)(cron, now))
                    continue;
                if (this.firedMinute.get(schema) === minuteKey)
                    continue;
                this.firedMinute.set(schema, minuteKey);
                const result = await this.runScan(schema);
                if (!result.status) {
                    this.logger.debug(`Scheduled discovery scan skipped/failed for ${schema}: ${result.message}`);
                }
            }
            catch (err) {
                this.logger.warn(`Scheduled discovery scan failed for ${schema}: ${err?.message}`);
            }
        }
    }
};
exports.DiscoveryService = DiscoveryService;
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryService.prototype, "runScheduled", null);
exports.DiscoveryService = DiscoveryService = DiscoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        arp_scanner_1.ArpScanner,
        ping_scanner_1.PingScanner,
        mdns_scanner_1.MdnsScanner,
        ssdp_scanner_1.SsdpScanner,
        netbios_scanner_1.NetbiosScanner,
        snmp_scanner_1.SnmpScanner,
        oui_service_1.OuiService,
        http_probe_service_1.HttpProbeService,
        classifier_service_1.ClassifierService,
        device_repository_1.DeviceRepository,
        discovery_config_service_1.DiscoveryConfigService,
        redis_service_1.RedisService])
], DiscoveryService);
