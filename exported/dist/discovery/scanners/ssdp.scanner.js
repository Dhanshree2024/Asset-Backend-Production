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
var SsdpScanner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsdpScanner = void 0;
const common_1 = require("@nestjs/common");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const url_1 = require("url");
const SEARCH_WINDOW_MS = 4000;
const FETCH_TIMEOUT_MS = 2500;
const MAX_BODY_BYTES = 16 * 1024;
let SsdpScanner = SsdpScanner_1 = class SsdpScanner {
    constructor() {
        this.source = 'ssdp';
        this.logger = new common_1.Logger(SsdpScanner_1.name);
    }
    async isAvailable() {
        try {
            require('node-ssdp');
            return true;
        }
        catch {
            return false;
        }
    }
    async scan(_cidrs) {
        let ssdpMod;
        try {
            ssdpMod = require('node-ssdp');
        }
        catch {
            return [];
        }
        const ClientCtor = ssdpMod?.Client ?? ssdpMod?.default?.Client;
        if (typeof ClientCtor !== 'function')
            return [];
        const responders = new Map();
        let client;
        try {
            client = new ClientCtor();
        }
        catch (err) {
            this.logger.debug(`SSDP unavailable: ${err?.message}`);
            return [];
        }
        try {
            client.on('response', (headers, _statusCode, rinfo) => {
                try {
                    const ip = rinfo?.address;
                    const location = headers?.LOCATION || headers?.Location || headers?.location;
                    if (!ip || !location)
                        return;
                    if (!responders.has(ip))
                        responders.set(ip, location);
                }
                catch {
                }
            });
            client.on('error', () => {
            });
            client.search('ssdp:all');
            await new Promise((resolve) => setTimeout(resolve, SEARCH_WINDOW_MS));
        }
        catch (err) {
            this.logger.debug(`SSDP search failed: ${err?.message}`);
        }
        finally {
            try {
                client.stop();
            }
            catch {
            }
        }
        const results = [];
        for (const [ip, location] of responders) {
            let info = {};
            try {
                const xml = await this.fetchDescription(location);
                if (xml)
                    info = this.parseDescription(xml);
            }
            catch {
            }
            results.push({
                ip,
                hostname: info.friendlyName,
                vendor: info.manufacturer,
                model: info.modelName,
                services: info.deviceType ? [info.deviceType] : [],
                source: this.source,
            });
        }
        return results;
    }
    fetchDescription(location) {
        return new Promise((resolve) => {
            let url;
            try {
                url = new url_1.URL(location);
            }
            catch {
                resolve('');
                return;
            }
            const lib = url.protocol === 'https:' ? https : http;
            let settled = false;
            const done = (body) => {
                if (settled)
                    return;
                settled = true;
                resolve(body);
            };
            try {
                const req = lib.get(url, { timeout: FETCH_TIMEOUT_MS, rejectUnauthorized: false }, (res) => {
                    let body = '';
                    res.on('data', (chunk) => {
                        body += chunk.toString();
                        if (body.length > MAX_BODY_BYTES) {
                            res.destroy();
                        }
                    });
                    res.on('end', () => done(body));
                    res.on('error', () => done(body));
                });
                req.on('timeout', () => {
                    req.destroy();
                    done('');
                });
                req.on('error', () => done(''));
            }
            catch {
                done('');
            }
        });
    }
    parseDescription(xml) {
        const extract = (tag) => {
            const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
            return m ? this.decodeXmlEntities(m[1].trim()) || undefined : undefined;
        };
        return {
            friendlyName: extract('friendlyName'),
            manufacturer: extract('manufacturer'),
            modelName: extract('modelName'),
            deviceType: extract('deviceType'),
        };
    }
    decodeXmlEntities(s) {
        return s
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
    }
};
exports.SsdpScanner = SsdpScanner;
exports.SsdpScanner = SsdpScanner = SsdpScanner_1 = __decorate([
    (0, common_1.Injectable)()
], SsdpScanner);
