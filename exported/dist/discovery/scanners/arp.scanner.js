"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArpScanner = void 0;
const common_1 = require("@nestjs/common");
const net_utils_1 = require("./net-utils");
let ArpScanner = class ArpScanner {
    constructor() {
        this.source = 'arp';
    }
    async isAvailable() {
        return true;
    }
    async scan(cidrs) {
        const merged = new Map();
        try {
            for (const cidr of cidrs) {
                try {
                    const results = await this.tryArpScanBinary(cidr);
                    for (const r of results) {
                        merged.set(r.ip, r);
                    }
                }
                catch {
                }
            }
        }
        catch {
        }
        try {
            const fallback = await this.readNeighbourTable();
            for (const r of fallback) {
                if (!merged.has(r.ip))
                    merged.set(r.ip, r);
            }
        }
        catch {
        }
        return Array.from(merged.values());
    }
    async tryArpScanBinary(cidr) {
        const out = await (0, net_utils_1.execCmd)(`arp-scan --retry=2 --timeout=500 ${cidr}`);
        if (!out)
            return [];
        const results = [];
        const lineRe = /^(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F:.-]{11,17})\b/;
        for (const line of out.split(/\r?\n/)) {
            const m = lineRe.exec(line.trim());
            if (!m)
                continue;
            const ip = m[1];
            const mac = (0, net_utils_1.normaliseMac)(m[2]);
            if (!mac || (0, net_utils_1.isBogusMac)(mac))
                continue;
            if (!this.isUsableIp(ip))
                continue;
            results.push({ ip, mac, source: this.source });
        }
        return results;
    }
    async readNeighbourTable() {
        const results = [];
        let out = '';
        if (process.platform !== 'win32') {
            out = await (0, net_utils_1.execCmd)('ip -4 neigh show');
            if (out) {
                for (const line of out.split(/\r?\n/)) {
                    const ipMatch = /^(\d{1,3}(?:\.\d{1,3}){3})/.exec(line);
                    const macMatch = /lladdr\s+([0-9a-fA-F:.-]{11,17})/.exec(line);
                    if (!ipMatch || !macMatch)
                        continue;
                    const ip = ipMatch[1];
                    const mac = (0, net_utils_1.normaliseMac)(macMatch[1]);
                    if (!mac || (0, net_utils_1.isBogusMac)(mac))
                        continue;
                    if (!this.isUsableIp(ip))
                        continue;
                    results.push({ ip, mac, source: this.source });
                }
                if (results.length)
                    return results;
            }
        }
        out = await (0, net_utils_1.execCmd)('arp -a');
        if (!out)
            return results;
        for (const rawLine of out.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line)
                continue;
            const winMatch = /^(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F]{2}(?:-[0-9a-fA-F]{2}){5})/.exec(line);
            if (winMatch) {
                const ip = winMatch[1];
                const mac = (0, net_utils_1.normaliseMac)(winMatch[2]);
                if (mac && !(0, net_utils_1.isBogusMac)(mac) && this.isUsableIp(ip)) {
                    results.push({ ip, mac, source: this.source });
                }
                continue;
            }
            const bsdMatch = /\((\d{1,3}(?:\.\d{1,3}){3})\)\s+at\s+([0-9a-fA-F]{2}(?::[0-9a-fA-F]{2}){5})/.exec(line);
            if (bsdMatch) {
                const ip = bsdMatch[1];
                const mac = (0, net_utils_1.normaliseMac)(bsdMatch[2]);
                if (mac && !(0, net_utils_1.isBogusMac)(mac) && this.isUsableIp(ip)) {
                    results.push({ ip, mac, source: this.source });
                }
            }
        }
        return results;
    }
    isUsableIp(ip) {
        const parts = ip.split('.').map((p) => parseInt(p, 10));
        if (parts.length !== 4 || parts.some((p) => isNaN(p)))
            return false;
        if (parts[3] === 255)
            return false;
        if (parts[0] >= 224)
            return false;
        return true;
    }
};
exports.ArpScanner = ArpScanner;
exports.ArpScanner = ArpScanner = __decorate([
    (0, common_1.Injectable)()
], ArpScanner);
