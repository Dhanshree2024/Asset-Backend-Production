"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DiscoveryConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryConfigService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const os = __importStar(require("os"));
const device_interface_1 = require("../interfaces/device.interface");
const net_utils_1 = require("../scanners/net-utils");
const device_repository_1 = require("../store/device.repository");
const cron_util_1 = require("./cron.util");
const LINUX_VIRTUAL_IFACE_RE = /^(lo\d*|docker|veth|br-|bridge|tun\d*|tap\d*|utun\d*|virbr|kube|cni|flannel|vnet|ppp\d*)/i;
const WINDOWS_VIRTUAL_IFACE_FRAGMENTS = [
    'vethernet', 'hyper-v', 'wsl', 'default switch',
    'vmware', 'vmnet', 'virtualbox', 'vbox', 'host-only', 'parallels',
    'vpn', 'tailscale', 'wireguard', 'zerotier', 'openvpn', 'tap-windows',
    'nordlynx', 'anyconnect', 'globalprotect', 'forticlient', 'sonicwall',
    'wan miniport', 'ras async', 'teredo', 'isatap', 'bluetooth',
    'loopback', 'npcap',
];
const isVirtualIface = (name) => {
    const n = (name || '').trim().toLowerCase();
    if (!n)
        return true;
    if (LINUX_VIRTUAL_IFACE_RE.test(n))
        return true;
    return WINDOWS_VIRTUAL_IFACE_FRAGMENTS.some((f) => n.includes(f));
};
const CIDR_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;
const ENCRYPTION_ALGO = 'aes-256-gcm';
const ENCRYPTION_FORMAT_TAG = 'v1';
let DiscoveryConfigService = DiscoveryConfigService_1 = class DiscoveryConfigService {
    constructor(deviceRepository) {
        this.deviceRepository = deviceRepository;
        this.logger = new common_1.Logger(DiscoveryConfigService_1.name);
        this.warnedFallbackKey = false;
    }
    async getConfig(schema) {
        const raw = await this.deviceRepository.getConfig(schema);
        return {
            ...device_interface_1.DEFAULT_DISCOVERY_CONFIG,
            ...raw,
            snmpCommunity: this.decrypt(raw.snmpCommunity),
        };
    }
    async updateConfig(schema, patch) {
        const toPersist = { ...patch };
        if (patch.segments !== undefined) {
            toPersist.segments = this.normalizeAndValidateSegments(patch.segments);
        }
        if (patch.scanCron !== undefined && !(0, cron_util_1.validateCron)(patch.scanCron)) {
            throw new common_1.BadRequestException(`Invalid scan schedule '${patch.scanCron}' — expected a 5-field cron expression like '*/15 * * * *'`);
        }
        if (patch.snmpCommunity !== undefined) {
            toPersist.snmpCommunity = patch.snmpCommunity
                ? this.encrypt(patch.snmpCommunity)
                : null;
        }
        await this.deviceRepository.updateConfig(schema, toPersist);
        return this.getConfig(schema);
    }
    async resolveSegments(schema) {
        const config = await this.getConfig(schema);
        const configured = (config.segments ?? []).filter((s) => s.enabled !== false && s.cidr);
        const merged = [...configured];
        const seen = new Set(configured.map((s) => s.cidr));
        if (config.autoDetectSubnets) {
            for (const detected of this.detectLocalSegments()) {
                if (seen.has(detected.cidr))
                    continue;
                seen.add(detected.cidr);
                merged.push(detected);
            }
        }
        return merged;
    }
    async recordSegmentScan(schema, scannedCidrs, finishedAt, durationMs, deviceCountByCidr) {
        try {
            const raw = await this.deviceRepository.getConfig(schema);
            const segments = raw.segments ?? [];
            if (!segments.length)
                return;
            const scanned = new Set(scannedCidrs);
            let touched = false;
            const updated = segments.map((s) => {
                if (!scanned.has(s.cidr))
                    return s;
                touched = true;
                return {
                    ...s,
                    lastScanAt: finishedAt.toISOString(),
                    lastResult: {
                        deviceCount: deviceCountByCidr[s.cidr] ?? 0,
                        durationMs,
                    },
                };
            });
            if (!touched)
                return;
            await this.deviceRepository.updateConfig(schema, { segments: updated });
        }
        catch (err) {
            this.logger.warn(`Failed to record per-segment scan results for ${schema}: ${err?.message}`);
        }
    }
    normalizeAndValidateSegments(segments) {
        if (!Array.isArray(segments)) {
            throw new common_1.BadRequestException('segments must be an array');
        }
        const problems = [];
        const normalized = segments.map((s, i) => {
            const label = (s.label ?? '').trim() || `Subnet ${i + 1}`;
            const cidr = (s.cidr ?? '').trim();
            const range = this.parseCidr(cidr);
            if (!range) {
                problems.push(`'${cidr || '(empty)'}' is not a valid CIDR (expected e.g. 192.168.1.0/24)`);
            }
            return {
                label,
                cidr,
                local: !!s.local,
                enabled: s.enabled !== false,
                lastScanAt: s.lastScanAt ?? null,
                lastResult: s.lastResult ?? null,
            };
        });
        if (!problems.length) {
            for (let a = 0; a < normalized.length; a++) {
                for (let b = a + 1; b < normalized.length; b++) {
                    const ra = this.parseCidr(normalized[a].cidr);
                    const rb = this.parseCidr(normalized[b].cidr);
                    if (ra.start === rb.start && ra.end === rb.end) {
                        problems.push(`'${normalized[a].cidr}' and '${normalized[b].cidr}' are duplicates`);
                    }
                    else if (ra.start <= rb.end && rb.start <= ra.end) {
                        problems.push(`'${normalized[a].cidr}' and '${normalized[b].cidr}' overlap`);
                    }
                }
            }
        }
        if (problems.length) {
            throw new common_1.BadRequestException(`Subnet validation failed: ${problems.join('; ')}`);
        }
        return normalized;
    }
    parseCidr(cidr) {
        const m = CIDR_RE.exec(cidr);
        if (!m)
            return null;
        const octets = [m[1], m[2], m[3], m[4]].map((o) => parseInt(o, 10));
        const prefix = parseInt(m[5], 10);
        if (octets.some((o) => o < 0 || o > 255) || prefix < 0 || prefix > 32)
            return null;
        const ipInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
        const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
        const start = (ipInt & maskInt) >>> 0;
        const end = (start | (~maskInt >>> 0)) >>> 0;
        return { start, end };
    }
    detectLocalSegments() {
        const segments = [];
        const seen = new Set();
        const interfaces = os.networkInterfaces();
        for (const [name, addrs] of Object.entries(interfaces)) {
            if (!addrs || isVirtualIface(name))
                continue;
            for (const addr of addrs) {
                if (addr.family !== 'IPv4' || addr.internal || !addr.netmask)
                    continue;
                const prefix = this.netmaskToPrefixLength(addr.netmask);
                if (prefix === null || prefix < 16 || prefix > 30)
                    continue;
                const ipInt = (0, net_utils_1.ipToInt)(addr.address);
                if (isNaN(ipInt))
                    continue;
                const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
                const netInt = (ipInt & maskInt) >>> 0;
                const cidr = `${this.intToIp(netInt)}/${prefix}`;
                if (seen.has(cidr))
                    continue;
                seen.add(cidr);
                segments.push({ label: name, cidr, local: true });
            }
        }
        return segments;
    }
    netmaskToPrefixLength(netmask) {
        const octets = netmask.split('.').map((o) => parseInt(o, 10));
        if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255))
            return null;
        let bits = 0;
        for (const o of octets) {
            bits += o.toString(2).split('1').length - 1;
        }
        return bits;
    }
    intToIp(int) {
        return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join('.');
    }
    getKey() {
        const secret = process.env.DISCOVERY_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            if (!this.warnedFallbackKey) {
                this.warnedFallbackKey = true;
                this.logger.warn('Neither DISCOVERY_SECRET nor JWT_SECRET is set — SNMP community encryption is using a ' +
                    'hardcoded fallback key and is NOT secure. Set DISCOVERY_SECRET in the environment.');
            }
            return crypto.createHash('sha256').update('discovery-fallback-secret').digest();
        }
        return crypto.createHash('sha256').update(secret).digest();
    }
    encrypt(plain) {
        try {
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, this.getKey(), iv);
            const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
            const tag = cipher.getAuthTag();
            return [ENCRYPTION_FORMAT_TAG, iv.toString('hex'), tag.toString('hex'), ciphertext.toString('hex')].join(':');
        }
        catch (err) {
            this.logger.warn(`SNMP community encryption failed, storing null: ${err?.message}`);
            return null;
        }
    }
    decrypt(stored) {
        if (!stored)
            return null;
        const parts = stored.split(':');
        if (parts.length !== 4 || parts[0] !== ENCRYPTION_FORMAT_TAG) {
            return stored;
        }
        try {
            const [, ivHex, tagHex, dataHex] = parts;
            const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, this.getKey(), Buffer.from(ivHex, 'hex'));
            decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
            const plain = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
            return plain.toString('utf8');
        }
        catch (err) {
            this.logger.warn(`SNMP community decryption failed: ${err?.message}`);
            return null;
        }
    }
};
exports.DiscoveryConfigService = DiscoveryConfigService;
exports.DiscoveryConfigService = DiscoveryConfigService = DiscoveryConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository])
], DiscoveryConfigService);
