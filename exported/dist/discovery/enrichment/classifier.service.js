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
exports.ClassifierService = void 0;
const common_1 = require("@nestjs/common");
const oui_service_1 = require("./oui.service");
const WEB_PORTS = [80, 443, 8080, 8000, 81, 88, 8081, 7001, 9000, 8443];
const MEDIA_DEVICE_RE = /camera|ipcam|hikvision|dahua|uniview|cp\.?plus|reolink|axis|onvif|surveillance|ezviz|vstarcam|\bdvr\b|\bnvr\b|xmeye|dvrip|netsurveillance|recorder|\btv\b|bravia|webos|tizen|android tv|roku|firetv|apple tv|chromecast/i;
function hasAnyService(ctx, ...needles) {
    return needles.some((n) => ctx.servicesLower.some((s) => s.includes(n)));
}
function hasWebPort(ctx) {
    return WEB_PORTS.some((p) => ctx.ports.has(p));
}
function ipEndsInOne(ip) {
    return /\.1$/.test(ip || '');
}
const PC_VENDOR_RE = /\bdell\b|hewlett-packard|\bhp\b|\bhpe\b|lenovo|\basus\b|\bacer\b|\bmsi\b|micro-star|\bintel\b/i;
const RULES = [
    {
        category: 'router',
        weight: 5,
        test: (c) => /internetgatewaydevice|gateway|router|edgeos|mikrotik|routeros/i.test(c.hay),
    },
    {
        category: 'router',
        weight: 3,
        test: (c) => ipEndsInOne(c.ip) && [80, 443, 22, 23].some((p) => c.ports.has(p)),
    },
    {
        category: 'switch',
        weight: 4,
        test: (c) => /switch|catalyst|procurve|aruba|nexus/i.test(c.hay),
    },
    {
        category: 'access-point',
        weight: 4,
        test: (c) => /unifi|access point|\bap\b|meraki|aironet/i.test(c.hay),
    },
    {
        category: 'ups',
        weight: 5,
        test: (c) => /\bups\b|smart-ups|apc|eaton|cyberpower/i.test(c.hay),
    },
    {
        category: 'nas',
        weight: 5,
        test: (c) => /synology|diskstation|qnap|truenas|nas/i.test(c.hay),
    },
    {
        category: 'nas',
        weight: 2,
        test: (c) => c.ports.has(445) && c.ports.has(139) && hasAnyService(c, 'smb', 'afp'),
    },
    {
        category: 'server',
        weight: 3,
        test: (c) => /esxi|proxmox|xenserver|ubuntu server|centos|red hat|debian server|windows server/i.test(c.hay),
    },
    {
        category: 'server',
        weight: 2,
        test: (c) => c.ports.has(22) && hasWebPort(c) && !MEDIA_DEVICE_RE.test(c.hay),
    },
    {
        category: 'printer',
        weight: 5,
        test: (c) => /printer|laserjet|officejet|ecosys|brother|kyocera/i.test(c.hay),
    },
    {
        category: 'printer',
        weight: 4,
        test: (c) => c.ports.has(9100) || c.ports.has(515) || hasAnyService(c, 'ipp'),
    },
    {
        category: 'ip-camera',
        weight: 5,
        test: (c) => /camera|ipcam|hikvision|dahua|uniview|cp\.?plus|reolink|axis|onvif|surveillance|ezviz|vstarcam/i.test(c.hay),
    },
    {
        category: 'ip-camera',
        weight: 4,
        test: (c) => (c.ports.has(554) || c.ports.has(8554)) && !c.ports.has(3389),
    },
    {
        category: 'dvr-nvr',
        weight: 5,
        test: (c) => /\bdvr\b|\bnvr\b|xmeye|dvrip|netsurveillance|recorder/i.test(c.hay),
    },
    {
        category: 'dvr-nvr',
        weight: 4,
        test: (c) => c.ports.has(37777) || c.ports.has(34567) || c.ports.has(8899),
    },
    { category: 'attendance', weight: 5, test: (c) => c.ports.has(4370) },
    {
        category: 'attendance',
        weight: 5,
        test: (c) => /zkteco|zksoft|iclock|\bessl\b|biometric|attendance|fingerprint|realtime.?biomet|matrix.?comsec|access.?control|time.?attend/i.test(c.hay),
    },
    {
        category: 'tv',
        weight: 5,
        test: (c) => /\btv\b|bravia|webos|tizen|android tv|roku|firetv|apple tv|chromecast/i.test(c.hay),
    },
    {
        category: 'tv',
        weight: 4,
        test: (c) => hasAnyService(c, 'airplay', 'googlecast', 'mediarenderer'),
    },
    {
        category: 'projector',
        weight: 5,
        test: (c) => /projector|epson.*(eb|eh)|benq|optoma|viewsonic pj|nec.*np/i.test(c.hay),
    },
    {
        category: 'monitor',
        weight: 4,
        test: (c) => /monitor|display|signage/i.test(c.hay),
    },
    {
        category: 'phone',
        weight: 4,
        test: (c) => /polycom|yealink|grandstream|cisco.*phone|voip|sip/i.test(c.hay),
    },
    {
        category: 'phone',
        weight: 3,
        test: (c) => /iphone|android|pixel|galaxy|mobile/i.test(c.hay),
    },
    {
        category: 'laptop',
        weight: 3,
        test: (c) => /macbook|laptop|thinkpad|latitude|elitebook|xps/i.test(c.hay),
    },
    {
        category: 'desktop',
        weight: 2,
        test: (c) => /desktop|imac|optiplex|workstation/i.test(c.hay),
    },
    { category: 'windows-host', weight: 2, test: (c) => c.ports.has(3389) },
    {
        category: 'windows-host',
        weight: 1,
        test: (c) => c.ports.has(445) || c.ports.has(139),
    },
    {
        category: 'linux-host',
        weight: 1,
        test: (c) => c.ports.has(22) && !c.ports.has(3389),
    },
    {
        category: 'windows-host',
        weight: 3,
        test: (c) => c.sources.has('netbios') || /windows/i.test(c.os) || !!c.domain,
    },
    {
        category: 'laptop',
        weight: 3,
        test: (c) => /lap|lt-|nb-|notebook|macbook|thinkpad|latitude|elitebook|xps/i.test(c.hostnameLower),
    },
    {
        category: 'desktop',
        weight: 2,
        test: (c) => /desk|dt-|pc-|\bpc\b|workstation|optiplex|imac/i.test(c.hostnameLower),
    },
    {
        category: 'desktop',
        weight: 2,
        test: (c) => PC_VENDOR_RE.test(c.vendorLower) && (c.sources.has('netbios') || /windows/i.test(c.os)),
    },
    {
        category: 'iot',
        weight: 2,
        test: (c) => /esp32|esp8266|tuya|shelly|sonoff|smartthings|hue|homekit/i.test(c.hay),
    },
];
const VENDOR_HINTS = [
    {
        category: 'virtual-machine',
        weight: 5,
        test: (v) => /vmware|virtualbox|oracle vm|qemu|kvm|\bxen\b|parallels|hyper-?v|nutanix|proxmox|virtual machine/i.test(v),
    },
    {
        category: 'ip-camera',
        weight: 3,
        test: (v) => /aditya infotech|cp\.?plus|hikvision|dahua|uniview|reolink|axis|ezviz|vstarcam/.test(v),
    },
    { category: 'nas', weight: 3, test: (v) => /synology|qnap/.test(v) },
    {
        category: 'access-point',
        weight: 2,
        test: (v) => /ubiquiti|ruijie|aruba networks|netgear|zyxel|d-link/.test(v),
    },
    { category: 'switch', weight: 1, test: (v) => /cisco|mikrotik/.test(v) },
    {
        category: 'router',
        weight: 3,
        test: (v) => /fortinet|sonicwall|palo alto|sophos|watchguard/.test(v),
    },
    { category: 'laptop', weight: 1, test: (v) => /apple/.test(v) },
    { category: 'projector', weight: 1, test: (v) => /epson|benq|nec/.test(v) },
    { category: 'hvac', weight: 3, test: (v) => /daikin|ecobee|honeywell/.test(v) },
    { category: 'tv', weight: 1, test: (v) => /samsung|lg electronics|sony/.test(v) },
];
let ClassifierService = class ClassifierService {
    constructor(ouiService) {
        this.ouiService = ouiService;
    }
    classify(d) {
        const hostname = (d.hostname || '').toString();
        const model = (d.model || '').toString();
        const vendor = (d.vendor || '').toString();
        const services = Array.isArray(d.services) ? d.services.map((s) => String(s)) : [];
        const os = (d.os || '').toString();
        const domain = (d.domain || '').toString();
        const mac = d.mac || null;
        const hay = `${hostname} ${model} ${vendor} ${services.join(' ')}`.toLowerCase();
        const servicesLower = services.map((s) => s.toLowerCase());
        const hostnameLower = hostname.toLowerCase();
        const vendorLower = vendor.toLowerCase();
        const ports = new Set(Array.isArray(d.openPorts) ? d.openPorts : []);
        const ip = d.ip || '';
        const sources = new Set(Array.isArray(d.sources) ? d.sources : []);
        const ctx = {
            hay,
            ports,
            servicesLower,
            ip,
            hostnameLower,
            vendorLower,
            os: os.toLowerCase(),
            domain: domain.toLowerCase(),
            sources,
        };
        const scores = new Map();
        const addScore = (cat, weight) => {
            scores.set(cat, (scores.get(cat) || 0) + weight);
        };
        for (const rule of RULES) {
            try {
                if (rule.test(ctx))
                    addScore(rule.category, rule.weight);
            }
            catch {
            }
        }
        if (vendorLower) {
            for (const hint of VENDOR_HINTS) {
                try {
                    if (hint.test(vendorLower))
                        addScore(hint.category, hint.weight);
                }
                catch {
                }
            }
        }
        const isHypervisorMac = !!mac && this.ouiService.isVirtualMac(mac);
        if (isHypervisorMac) {
            addScore('virtual-machine', 6);
        }
        let winningCategory = 'unknown';
        let winningScore = 0;
        let total = 0;
        for (const [cat, score] of scores) {
            total += score;
            if (score > winningScore) {
                winningScore = score;
                winningCategory = cat;
            }
        }
        if (total === 0 || winningScore === 0) {
            const fb = this.coarseFallback(ctx);
            if (fb)
                return { category: fb, confidence: 0.2 };
            return { category: 'unknown', confidence: 0 };
        }
        const winningShare = winningScore / total;
        const confidence = Math.min(1, winningShare * Math.min(1, winningScore / 5));
        let modelHint;
        if (winningCategory === 'virtual-machine' && isHypervisorMac) {
            const hv = this.ouiService.hypervisorName(mac);
            if (hv)
                modelHint = `${hv} Virtual Machine`;
        }
        return { category: winningCategory, confidence, ...(modelHint ? { modelHint } : {}) };
    }
    coarseFallback(ctx) {
        if (ctx.domain)
            return 'windows-host';
        if (ctx.ports.has(3389) || ctx.ports.has(445) || ctx.ports.has(139))
            return 'windows-host';
        if (/windows/.test(ctx.os))
            return 'windows-host';
        if (/linux|ubuntu|debian|centos|red hat|rhel/.test(ctx.os))
            return 'linux-host';
        if (ctx.ports.has(9100) || ctx.ports.has(631) || ctx.ports.has(515))
            return 'printer';
        if (ctx.ports.has(554) || ctx.ports.has(37777) || ctx.ports.has(34567))
            return 'dvr-nvr';
        if (ctx.ports.has(22))
            return 'linux-host';
        if (ctx.ports.has(80) || ctx.ports.has(443))
            return 'iot';
        return null;
    }
};
exports.ClassifierService = ClassifierService;
exports.ClassifierService = ClassifierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [oui_service_1.OuiService])
], ClassifierService);
