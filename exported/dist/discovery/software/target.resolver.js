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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetResolver = void 0;
const common_1 = require("@nestjs/common");
const device_repository_1 = require("../store/device.repository");
let TargetResolver = class TargetResolver {
    constructor(devices) {
        this.devices = devices;
    }
    async resolve(schema, selector) {
        const sel = selector ?? {};
        const explicit = (sel.deviceIds ?? []).map(String).filter(Boolean);
        const hasFilter = !!(sel.category || sel.segment || sel.osContains || sel.search);
        let out = [];
        if (explicit.length) {
            out = await this.devices.listDevices(schema, { selectedIds: explicit });
        }
        if (hasFilter) {
            let list = await this.devices.listDevices(schema, { category: sel.category || undefined, segment: sel.segment || undefined, search: sel.search || undefined });
            if (sel.osContains) {
                const needle = sel.osContains.toLowerCase();
                list = list.filter((d) => (d.os ?? '').toLowerCase().includes(needle));
            }
            const seen = new Set(out.map((d) => String(d.id)));
            for (const d of list)
                if (!seen.has(String(d.id))) {
                    out.push(d);
                    seen.add(String(d.id));
                }
        }
        return out;
    }
    matches(device, selector) {
        const sel = selector ?? {};
        const explicit = (sel.deviceIds ?? []).map(String);
        if (explicit.length && !explicit.includes(String(device.id)))
            return false;
        if (sel.category && device.category !== sel.category)
            return false;
        if (sel.segment && device.segment !== sel.segment)
            return false;
        if (sel.osContains && !(device.os ?? '').toLowerCase().includes(sel.osContains.toLowerCase()))
            return false;
        if (sel.search) {
            const n = sel.search.toLowerCase();
            const hay = [device.hostname, device.ip, device.vendor, device.domain, device.os].map((x) => (x ?? '').toString().toLowerCase());
            if (!hay.some((h) => h.includes(n)))
                return false;
        }
        return true;
    }
};
exports.TargetResolver = TargetResolver;
exports.TargetResolver = TargetResolver = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository])
], TargetResolver);
