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
var OuiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OuiService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const net_utils_1 = require("../scanners/net-utils");
const FALLBACK_OUI = {
    '00D02D': 'Aditya Infotech (CP Plus)',
    A4B234: 'Aditya Infotech (CP Plus)',
    '4CBD8F': 'Hangzhou Hikvision',
    C056E3: 'Hangzhou Hikvision',
    BCAD28: 'Hangzhou Hikvision',
    '3CEF8C': 'Dahua Technology',
    '9002A9': 'Dahua Technology',
    BC325F: 'Dahua Technology',
    '001AA9': 'Ruijie Networks',
    '5C6EEF': 'Ruijie Networks',
    '00090F': 'Fortinet',
    '906CAC': 'Fortinet',
    '000C29': 'VMware',
    '005056': 'VMware',
    '000569': 'VMware',
    '001C14': 'VMware',
    '080027': 'VirtualBox',
    '00155D': 'Microsoft Hyper-V',
    '525400': 'QEMU/KVM',
    '00163E': 'Xen',
    '001C42': 'Parallels',
    '506B8D': 'Nutanix',
    '00000C': 'Cisco Systems',
    '001A2F': 'Cisco Systems',
    '00E01E': 'Cisco Systems',
    '001422': 'Dell',
    D4AE52: 'Dell',
    '54BF64': 'Dell',
    'B8CA3A': 'Dell',
    '3C4A92': 'HP',
    'B4B024': 'HP',
    '9457A5': 'HPE',
    '30B216': 'Lenovo',
    '6C0B84': 'Lenovo',
    E8B1FC: 'Lenovo',
    '1C872C': 'ASUS',
    '2C56DC': 'ASUS',
    '00131E': 'Acer',
    '4CCC6A': 'Micro-Star International (MSI)',
    E0D55E: 'Micro-Star International (MSI)',
    '001B21': 'Intel',
    A434D9: 'Intel',
    '001B63': 'Apple',
    F45C89: 'Apple',
    '3C0754': 'Apple',
    '50C7BF': 'TP-Link',
    EC086B: 'TP-Link',
    '0418D6': 'Ubiquiti Networks',
    '24A43C': 'Ubiquiti Networks',
    DC9FDB: 'Ubiquiti Networks',
};
const HYPERVISOR_OUI = {
    '005056': 'VMware',
    '000C29': 'VMware',
    '000569': 'VMware',
    '001C14': 'VMware',
    '080027': 'VirtualBox',
    '00155D': 'Microsoft Hyper-V',
    '525400': 'QEMU/KVM',
    '00163E': 'Xen',
    '001C42': 'Parallels',
    '506B8D': 'Nutanix',
};
let OuiService = OuiService_1 = class OuiService {
    constructor() {
        this.logger = new common_1.Logger(OuiService_1.name);
        this.map = null;
    }
    lookup(mac) {
        this.ensureLoaded();
        const normalised = (0, net_utils_1.normaliseMac)(mac);
        if (!normalised || !this.map)
            return null;
        const prefix = normalised.replace(/:/g, '').substring(0, 6).toUpperCase();
        if (prefix.length !== 6)
            return null;
        return this.map.get(prefix) ?? null;
    }
    isVirtualMac(mac) {
        return this.hypervisorName(mac) !== null;
    }
    hypervisorName(mac) {
        const normalised = (0, net_utils_1.normaliseMac)(mac);
        if (!normalised)
            return null;
        const prefix = normalised.replace(/:/g, '').substring(0, 6).toUpperCase();
        if (prefix.length !== 6)
            return null;
        return HYPERVISOR_OUI[prefix] ?? null;
    }
    ensureLoaded() {
        if (this.map)
            return;
        const map = new Map();
        const loadedFromPackage = this.loadFromOuiDataPackage(map);
        if (!loadedFromPackage) {
            const loadedFromCsv = this.loadFromCsv(map);
            if (!loadedFromCsv) {
                this.loadFromFallback(map);
            }
        }
        this.map = map;
        this.logger.debug(`OUI DB loaded: ${map.size} entries`);
    }
    addEntry(map, rawPrefix, org) {
        const hex = String(rawPrefix).replace(/[^0-9a-fA-F]/g, '').toUpperCase();
        if (hex.length < 6)
            return;
        const prefix = hex.substring(0, 6);
        const name = String(org).trim().replace(/^"+|"+$/g, '');
        if (!name)
            return;
        if (!map.has(prefix))
            map.set(prefix, name);
    }
    loadFromOuiDataPackage(map) {
        try {
            const mod = require('oui-data');
            const data = mod?.default ?? mod;
            if (!data)
                return false;
            if (Array.isArray(data)) {
                for (const entry of data) {
                    const prefix = entry?.oui ?? entry?.prefix ?? entry?.macPrefix ?? entry?.assignment;
                    const org = entry?.organization ?? entry?.org ?? entry?.company ?? entry?.vendor ?? entry?.name;
                    if (prefix && org)
                        this.addEntry(map, prefix, org);
                }
            }
            else if (typeof data === 'object') {
                for (const [prefix, val] of Object.entries(data)) {
                    if (typeof val === 'string') {
                        this.addEntry(map, prefix, val);
                    }
                    else if (val && typeof val === 'object') {
                        const name = val.organization ?? val.org ?? val.company ?? val.name;
                        if (name)
                            this.addEntry(map, prefix, name);
                    }
                }
            }
            return map.size > 0;
        }
        catch {
            return false;
        }
    }
    loadFromCsv(map) {
        try {
            const csvPath = path.join(__dirname, 'data', 'oui.csv');
            if (!fs.existsSync(csvPath))
                return false;
            const content = fs.readFileSync(csvPath, 'utf8');
            const lines = content.split(/\r?\n/);
            for (const line of lines) {
                const m = /^MA-L,\s*([0-9A-Fa-f]{6})\s*,\s*(.+)$/.exec(line.trim());
                if (!m)
                    continue;
                this.addEntry(map, m[1], m[2]);
            }
            return map.size > 0;
        }
        catch {
            return false;
        }
    }
    loadFromFallback(map) {
        for (const [prefix, org] of Object.entries(FALLBACK_OUI)) {
            this.addEntry(map, prefix, org);
        }
    }
};
exports.OuiService = OuiService;
exports.OuiService = OuiService = OuiService_1 = __decorate([
    (0, common_1.Injectable)()
], OuiService);
