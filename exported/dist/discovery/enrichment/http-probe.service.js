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
var HttpProbeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProbeService = void 0;
const common_1 = require("@nestjs/common");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const CANDIDATE_PORTS = [80, 8080, 8000, 81, 88, 8081, 7001, 9000, 443, 8443];
const HTTPS_PORTS = new Set([443, 8443]);
const REQUEST_TIMEOUT_MS = 2500;
const MAX_BODY_BYTES = 16 * 1024;
let HttpProbeService = HttpProbeService_1 = class HttpProbeService {
    constructor() {
        this.logger = new common_1.Logger(HttpProbeService_1.name);
    }
    async probe(ip, ports) {
        try {
            const openSet = new Set(ports || []);
            const orderedCandidates = CANDIDATE_PORTS.filter((p) => openSet.has(p));
            for (const port of orderedCandidates) {
                const result = await this.tryPort(ip, port);
                if (result)
                    return result;
            }
            return {};
        }
        catch {
            return {};
        }
    }
    tryPort(ip, port) {
        return new Promise((resolve) => {
            const isHttps = HTTPS_PORTS.has(port);
            const lib = isHttps ? https : http;
            let settled = false;
            const finish = (result) => {
                if (settled)
                    return;
                settled = true;
                resolve(result);
            };
            try {
                const req = lib.get({
                    host: ip,
                    port,
                    path: '/',
                    timeout: REQUEST_TIMEOUT_MS,
                    rejectUnauthorized: false,
                }, (res) => {
                    const server = this.headerString(res.headers['server']);
                    const poweredBy = this.headerString(res.headers['x-powered-by']);
                    const wwwAuth = this.headerString(res.headers['www-authenticate']);
                    const realm = wwwAuth ? this.extractRealm(wwwAuth) : undefined;
                    let body = '';
                    res.on('data', (chunk) => {
                        body += chunk.toString();
                        if (body.length > MAX_BODY_BYTES) {
                            res.destroy();
                        }
                    });
                    const wrapUp = () => {
                        const title = this.extractTitle(body);
                        const result = {};
                        if (server)
                            result.server = server;
                        if (realm)
                            result.realm = realm;
                        if (poweredBy)
                            result.poweredBy = poweredBy;
                        if (title)
                            result.title = title;
                        finish(result);
                    };
                    res.on('end', wrapUp);
                    res.on('error', wrapUp);
                    res.on('close', wrapUp);
                });
                req.on('timeout', () => {
                    req.destroy();
                    finish(null);
                });
                req.on('error', () => finish(null));
            }
            catch {
                finish(null);
            }
        });
    }
    headerString(v) {
        if (!v)
            return undefined;
        return Array.isArray(v) ? v[0] : v;
    }
    extractRealm(wwwAuthenticate) {
        const m = /realm=["']?([^"',]+)["']?/i.exec(wwwAuthenticate);
        return m ? m[1].trim() : undefined;
    }
    extractTitle(body) {
        const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(body);
        if (!m)
            return undefined;
        const title = m[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim();
        return title || undefined;
    }
};
exports.HttpProbeService = HttpProbeService;
exports.HttpProbeService = HttpProbeService = HttpProbeService_1 = __decorate([
    (0, common_1.Injectable)()
], HttpProbeService);
