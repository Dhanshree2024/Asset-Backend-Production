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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingScanner = void 0;
const common_1 = require("@nestjs/common");
const net = __importStar(require("net"));
const dns = __importStar(require("dns"));
const device_interface_1 = require("../interfaces/device.interface");
const net_utils_1 = require("./net-utils");
const dnsPromises = dns.promises;
const SERVICE_NAMES = {
    21: 'ftp',
    22: 'ssh',
    23: 'telnet',
    53: 'dns',
    80: 'http',
    81: 'http-alt',
    88: 'kerberos',
    139: 'netbios-ssn',
    443: 'https',
    445: 'smb',
    515: 'lpd',
    554: 'rtsp',
    631: 'ipp',
    1900: 'ssdp',
    3389: 'rdp',
    4370: 'attendance',
    5000: 'http-alt',
    7001: 'http-alt',
    8000: 'http-alt',
    8001: 'http-alt',
    8080: 'http-alt',
    8081: 'http-alt',
    8443: 'https-alt',
    8554: 'rtsp-alt',
    8899: 'dvr',
    9000: 'http-alt',
    9100: 'printer',
    34567: 'dvr',
    37777: 'dvr',
    49152: 'upnp',
};
const CONNECT_TIMEOUT_MS = 800;
const HOST_CONCURRENCY = 256;
let PingScanner = class PingScanner {
    constructor() {
        this.source = 'ping';
        this.fingerprintPorts = [...device_interface_1.DEFAULT_FINGERPRINT_PORTS];
    }
    setPorts(ports) {
        if (Array.isArray(ports) && ports.length > 0) {
            this.fingerprintPorts = ports;
        }
    }
    async isAvailable() {
        return true;
    }
    async scan(cidrs) {
        const hosts = new Set();
        try {
            for (const cidr of cidrs) {
                for (const ip of (0, net_utils_1.expandCidr)(cidr)) {
                    hosts.add(ip);
                }
            }
        }
        catch {
            return [];
        }
        const hostList = Array.from(hosts);
        const results = await (0, net_utils_1.pool)(hostList, (ip) => this.scanHost(ip), HOST_CONCURRENCY);
        return results.filter((r) => !!r);
    }
    async scanHost(ip) {
        try {
            const openPorts = [];
            await Promise.all(this.fingerprintPorts.map(async (port) => {
                const open = await this.knock(ip, port);
                if (open)
                    openPorts.push(port);
            }));
            if (openPorts.length === 0)
                return null;
            openPorts.sort((a, b) => a - b);
            const services = Array.from(new Set(openPorts.map((p) => SERVICE_NAMES[p]).filter(Boolean)));
            let hostname;
            try {
                const names = await this.withTimeout(dnsPromises.reverse(ip), 1000);
                if (names && names.length > 0)
                    hostname = names[0];
            }
            catch {
            }
            return {
                ip,
                hostname,
                openPorts,
                services,
                source: this.source,
            };
        }
        catch {
            return null;
        }
    }
    knock(ip, port) {
        return new Promise((resolve) => {
            let done = false;
            const socket = new net.Socket();
            const finish = (open) => {
                if (done)
                    return;
                done = true;
                try {
                    socket.destroy();
                }
                catch {
                }
                resolve(open);
            };
            socket.setTimeout(CONNECT_TIMEOUT_MS);
            socket.once('connect', () => finish(true));
            socket.once('timeout', () => finish(false));
            socket.once('error', () => finish(false));
            try {
                socket.connect(port, ip);
            }
            catch {
                finish(false);
            }
        });
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
exports.PingScanner = PingScanner;
exports.PingScanner = PingScanner = __decorate([
    (0, common_1.Injectable)()
], PingScanner);
