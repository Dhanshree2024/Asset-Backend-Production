"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SnmpScanner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpScanner = void 0;
const common_1 = require("@nestjs/common");
const net_utils_1 = require("./net-utils");
const OID_SYS_DESCR = '1.3.6.1.2.1.1.1.0';
const OID_SYS_OBJECT_ID = '1.3.6.1.2.1.1.2.0';
const OID_SYS_UPTIME = '1.3.6.1.2.1.1.3.0';
const OID_SYS_NAME = '1.3.6.1.2.1.1.5.0';
const OID_SYS_LOCATION = '1.3.6.1.2.1.1.6.0';
const OID_ENT_MODEL_NAME = '1.3.6.1.2.1.47.1.1.1.1.13';
const OID_ENT_SERIAL_NUM = '1.3.6.1.2.1.47.1.1.1.1.11';
const SWEEP_CONCURRENCY = 40;
const SNMP_TIMEOUT_MS = 1500;
const SNMP_RETRIES = 1;
const ENTITY_WALK_TIMEOUT_MS = 2000;
let SnmpScanner = SnmpScanner_1 = class SnmpScanner {
    constructor() {
        this.source = 'snmp';
        this.logger = new common_1.Logger(SnmpScanner_1.name);
        this.community = null;
        this.enabled = false;
    }
    setCommunity(community) {
        this.community = community;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    async isAvailable() {
        if (!this.enabled || !this.community)
            return false;
        try {
            require('net-snmp');
            return true;
        }
        catch {
            return false;
        }
    }
    async scan(cidrs) {
        if (!(await this.isAvailable()))
            return [];
        let snmp;
        try {
            snmp = require('net-snmp');
        }
        catch {
            return [];
        }
        const hosts = new Set();
        try {
            for (const cidr of cidrs) {
                for (const ip of (0, net_utils_1.expandCidr)(cidr))
                    hosts.add(ip);
            }
        }
        catch {
            return [];
        }
        if (hosts.size === 0)
            return [];
        let answered = 0;
        const hostList = Array.from(hosts);
        const results = await (0, net_utils_1.pool)(hostList, async (ip) => {
            const r = await this.probeHost(ip, snmp);
            if (r)
                answered++;
            return r;
        }, SWEEP_CONCURRENCY);
        this.logger.debug(`SNMP sweep: ${answered}/${hostList.length} answered`);
        return results.filter((r) => !!r);
    }
    async probeHost(ip, snmp) {
        let session;
        try {
            session = snmp.createSession(ip, this.community, {
                timeout: SNMP_TIMEOUT_MS,
                retries: SNMP_RETRIES,
                version: snmp.Version2c,
            });
        }
        catch {
            return null;
        }
        try {
            const varbinds = await this.snmpGet(session, snmp, [
                OID_SYS_DESCR,
                OID_SYS_OBJECT_ID,
                OID_SYS_UPTIME,
                OID_SYS_NAME,
                OID_SYS_LOCATION,
            ]);
            if (!varbinds)
                return null;
            const sysDescr = this.varbindString(varbinds[0], snmp);
            const sysName = this.varbindString(varbinds[3], snmp);
            const sysLocation = this.varbindString(varbinds[4], snmp);
            if (!sysDescr && !sysName)
                return null;
            let entModel;
            let entSerial;
            try {
                const ent = await this.withTimeout(this.walkEntityMib(session, snmp), ENTITY_WALK_TIMEOUT_MS);
                entModel = ent?.model;
                entSerial = ent?.serial;
            }
            catch {
            }
            const os = this.deriveOsFromDescr(sysDescr);
            const result = {
                ip,
                hostname: sysName || undefined,
                model: entModel || sysDescr || undefined,
                os,
                specs: {
                    reportedAt: new Date().toISOString(),
                    hostname: sysName || undefined,
                    os: sysDescr ? { caption: sysDescr } : undefined,
                    system: {
                        serial: entSerial,
                        model: entModel,
                    },
                    agent: { platform: 'snmp' },
                },
                source: this.source,
            };
            void sysLocation;
            return result;
        }
        catch {
            return null;
        }
        finally {
            try {
                session?.close();
            }
            catch {
            }
        }
    }
    snmpGet(session, snmp, oids) {
        return new Promise((resolve) => {
            try {
                session.get(oids, (error, varbinds) => {
                    if (error) {
                        resolve(null);
                        return;
                    }
                    resolve(varbinds || null);
                });
            }
            catch {
                resolve(null);
            }
        });
    }
    walkEntityMib(session, snmp) {
        return new Promise((resolve) => {
            let model;
            let serial;
            let settled = false;
            const finish = () => {
                if (settled)
                    return;
                settled = true;
                resolve({ model, serial });
            };
            try {
                const feedCb = (varbinds) => {
                    for (const vb of varbinds || []) {
                        try {
                            if (snmp.isVarbindError && snmp.isVarbindError(vb))
                                continue;
                            const oid = vb.oid;
                            const value = this.varbindString(vb, snmp);
                            if (!value)
                                continue;
                            if (!model && oid.startsWith(OID_ENT_MODEL_NAME))
                                model = value;
                            if (!serial && oid.startsWith(OID_ENT_SERIAL_NUM))
                                serial = value;
                        }
                        catch {
                        }
                    }
                };
                const doneCb = () => finish();
                if (typeof session.subtree === 'function') {
                    session.subtree(OID_ENT_MODEL_NAME, 20, feedCb, () => {
                        if (typeof session.subtree === 'function') {
                            session.subtree(OID_ENT_SERIAL_NUM, 20, feedCb, doneCb);
                        }
                        else {
                            finish();
                        }
                    });
                }
                else {
                    finish();
                }
            }
            catch {
                finish();
            }
        });
    }
    varbindString(vb, snmp) {
        if (!vb)
            return undefined;
        try {
            if (snmp.isVarbindError && snmp.isVarbindError(vb))
                return undefined;
            if (vb.value === undefined || vb.value === null)
                return undefined;
            const raw = Buffer.isBuffer(vb.value) ? vb.value.toString('utf8') : String(vb.value);
            const trimmed = raw.replace(/\0+$/, '').trim();
            return trimmed || undefined;
        }
        catch {
            return undefined;
        }
    }
    deriveOsFromDescr(descr) {
        if (!descr)
            return undefined;
        const d = descr.toLowerCase();
        if (/fortios|fortinet/.test(d))
            return 'FortiOS';
        if (/cisco.*ios|ios-xe|ios software/.test(d))
            return 'Cisco IOS';
        if (/ruijie|rgos/.test(d))
            return 'Ruijie RGOS';
        if (/routeros|mikrotik/.test(d))
            return 'RouterOS';
        if (/printer/.test(d))
            return 'Printer firmware';
        if (/windows/.test(d))
            return 'Windows';
        if (/vxworks/.test(d))
            return 'VxWorks';
        if (/linux/.test(d))
            return 'Linux';
        return undefined;
    }
    withTimeout(p, ms) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('timeout')), ms);
            p.then((v) => {
                clearTimeout(timer);
                resolve(v);
            }, (e) => {
                clearTimeout(timer);
                reject(e);
            });
        });
    }
};
exports.SnmpScanner = SnmpScanner;
exports.SnmpScanner = SnmpScanner = SnmpScanner_1 = __decorate([
    (0, common_1.Injectable)()
], SnmpScanner);
