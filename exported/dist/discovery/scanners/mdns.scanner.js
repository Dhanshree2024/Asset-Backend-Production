"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MdnsScanner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdnsScanner = void 0;
const common_1 = require("@nestjs/common");
const SERVICE_TYPES = [
    'airplay',
    'raop',
    'googlecast',
    'spotify-connect',
    'ipp',
    'printer',
    'http',
    'smb',
    'homekit',
    'sonos',
    'axis-video',
];
const BROWSE_WINDOW_MS = 4000;
let MdnsScanner = MdnsScanner_1 = class MdnsScanner {
    constructor() {
        this.source = 'mdns';
        this.logger = new common_1.Logger(MdnsScanner_1.name);
    }
    async isAvailable() {
        try {
            require('bonjour-service');
            return true;
        }
        catch {
            return false;
        }
    }
    async scan(_cidrs) {
        const merged = new Map();
        let bonjourMod;
        try {
            bonjourMod = require('bonjour-service');
        }
        catch {
            return [];
        }
        const BonjourCtor = bonjourMod?.Bonjour ?? bonjourMod?.default ?? bonjourMod;
        if (typeof BonjourCtor !== 'function')
            return [];
        let bonjour;
        try {
            bonjour = new BonjourCtor();
        }
        catch (err) {
            this.logger.debug(`mDNS unavailable: ${err?.message}`);
            return [];
        }
        const browsers = [];
        try {
            for (const type of SERVICE_TYPES) {
                try {
                    const browser = bonjour.find({ type });
                    browser.on('up', (service) => this.handleService(service, type, merged));
                    browser.on('error', () => {
                    });
                    browsers.push(browser);
                }
                catch {
                }
            }
            await new Promise((resolve) => setTimeout(resolve, BROWSE_WINDOW_MS));
        }
        catch (err) {
            this.logger.debug(`mDNS browse failed: ${err?.message}`);
        }
        finally {
            for (const browser of browsers) {
                try {
                    browser.stop();
                }
                catch {
                }
            }
            try {
                bonjour.destroy();
            }
            catch {
            }
        }
        return Array.from(merged.values());
    }
    handleService(service, type, merged) {
        try {
            const ip = this.pickIPv4(service?.addresses);
            if (!ip)
                return;
            const rawHost = service?.host || service?.name;
            const hostname = rawHost ? rawHost.replace(/\.$/, '') : undefined;
            const existing = merged.get(ip);
            const services = new Set(existing?.services ?? []);
            services.add(type);
            merged.set(ip, {
                ip,
                hostname: existing?.hostname ?? hostname,
                services: Array.from(services),
                source: this.source,
            });
        }
        catch {
        }
    }
    pickIPv4(addresses) {
        if (!Array.isArray(addresses))
            return undefined;
        return addresses.find((a) => /^\d{1,3}(?:\.\d{1,3}){3}$/.test(a));
    }
};
exports.MdnsScanner = MdnsScanner;
exports.MdnsScanner = MdnsScanner = MdnsScanner_1 = __decorate([
    (0, common_1.Injectable)()
], MdnsScanner);
