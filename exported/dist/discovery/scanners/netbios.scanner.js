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
var NetbiosScanner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetbiosScanner = void 0;
const common_1 = require("@nestjs/common");
const dgram = __importStar(require("dgram"));
const net_utils_1 = require("./net-utils");
const NETBIOS_PORT = 137;
const COLLECT_WINDOW_MS = 3000;
let NetbiosScanner = NetbiosScanner_1 = class NetbiosScanner {
    constructor() {
        this.source = 'netbios';
        this.logger = new common_1.Logger(NetbiosScanner_1.name);
    }
    async isAvailable() {
        return true;
    }
    async scan(cidrs) {
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
        const results = new Map();
        let socket = null;
        try {
            socket = dgram.createSocket('udp4');
            await new Promise((resolve, reject) => {
                const onError = (err) => reject(err);
                socket.once('error', onError);
                socket.bind(0, () => {
                    socket.removeListener('error', onError);
                    resolve();
                });
            });
            socket.setBroadcast(true);
            socket.on('message', (msg, rinfo) => {
                try {
                    const parsed = this.parseNodeStatus(msg);
                    if (parsed) {
                        results.set(rinfo.address, {
                            ip: rinfo.address,
                            hostname: parsed.hostname,
                            domain: parsed.domain,
                            user: parsed.user,
                            mac: parsed.mac,
                            source: this.source,
                        });
                    }
                }
                catch {
                }
            });
            socket.on('error', () => {
            });
            const query = this.buildNodeStatusQuery();
            for (const ip of hosts) {
                try {
                    socket.send(query, NETBIOS_PORT, ip);
                }
                catch {
                }
            }
            await new Promise((resolve) => setTimeout(resolve, COLLECT_WINDOW_MS));
        }
        catch (err) {
            this.logger.debug(`NetBIOS scan failed: ${err?.message}`);
        }
        finally {
            try {
                socket?.close();
            }
            catch {
            }
        }
        return Array.from(results.values());
    }
    buildNodeStatusQuery() {
        const buf = Buffer.alloc(12 + 34 + 4);
        let offset = 0;
        const txnId = Math.floor(Math.random() * 0xffff);
        buf.writeUInt16BE(txnId, offset);
        offset += 2;
        buf.writeUInt16BE(0x0000, offset);
        offset += 2;
        buf.writeUInt16BE(1, offset);
        offset += 2;
        buf.writeUInt16BE(0, offset);
        offset += 2;
        buf.writeUInt16BE(0, offset);
        offset += 2;
        buf.writeUInt16BE(0, offset);
        offset += 2;
        buf.writeUInt8(0x20, offset);
        offset += 1;
        const rawName = Buffer.alloc(16, 0x00);
        rawName[0] = 0x2a;
        for (let i = 0; i < 16; i++) {
            const b = rawName[i];
            const hi = (b >> 4) & 0x0f;
            const lo = b & 0x0f;
            buf.writeUInt8(0x41 + hi, offset);
            offset += 1;
            buf.writeUInt8(0x41 + lo, offset);
            offset += 1;
        }
        buf.writeUInt8(0x00, offset);
        offset += 1;
        buf.writeUInt16BE(0x0021, offset);
        offset += 2;
        buf.writeUInt16BE(0x0001, offset);
        offset += 2;
        return buf;
    }
    parseNodeStatus(buf) {
        const NAMES_OFFSET = 12 + 34 + 10;
        if (buf.length <= NAMES_OFFSET)
            return null;
        const numNames = buf.readUInt8(NAMES_OFFSET);
        if (numNames === 0)
            return null;
        let hostname;
        let domain;
        let user;
        let idx = NAMES_OFFSET + 1;
        for (let i = 0; i < numNames; i++) {
            if (idx + 18 > buf.length)
                break;
            const nameBuf = buf.slice(idx, idx + 15);
            const name = nameBuf.toString('ascii').replace(/\0/g, '').trim();
            const suffix = buf.readUInt8(idx + 15);
            const flags = buf.readUInt16BE(idx + 16);
            const isGroup = (flags & 0x8000) !== 0;
            if (name) {
                if (!hostname && !isGroup && (suffix === 0x00 || suffix === 0x20)) {
                    hostname = name;
                }
                else if (!domain && isGroup && (suffix === 0x00 || suffix === 0x1c)) {
                    domain = name;
                }
                else if (!user && !isGroup && suffix === 0x03) {
                    user = name;
                }
            }
            idx += 18;
        }
        let mac;
        if (idx + 6 <= buf.length) {
            const macHex = buf.slice(idx, idx + 6).toString('hex');
            mac = (0, net_utils_1.normaliseMac)(macHex) ?? undefined;
        }
        if (!hostname && !domain && !user && !mac)
            return null;
        return { hostname, domain, user, mac };
    }
};
exports.NetbiosScanner = NetbiosScanner;
exports.NetbiosScanner = NetbiosScanner = NetbiosScanner_1 = __decorate([
    (0, common_1.Injectable)()
], NetbiosScanner);
