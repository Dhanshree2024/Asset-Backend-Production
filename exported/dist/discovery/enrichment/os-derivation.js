"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveOs = deriveOs;
const NETWORK_OS_CATEGORIES = new Set(['router', 'switch', 'access-point']);
function deriveOs(d) {
    const os = (d.os || '').toString();
    const model = (d.model || '').toString();
    const bannerCaption = d.specs?.os?.caption || '';
    const combinedBanner = `${os} ${model} ${bannerCaption}`;
    if (/microsoft-iis|\biis\/|windows server/i.test(combinedBanner)) {
        return 'Windows Server';
    }
    const ports = new Set(Array.isArray(d.openPorts) ? d.openPorts : []);
    const isNetbiosSourced = Array.isArray(d.sources) && d.sources.includes('netbios');
    const hasRdp = ports.has(3389);
    const hasSmbPair = ports.has(445) && ports.has(139);
    if (isNetbiosSourced || !!d.domain || hasRdp || hasSmbPair) {
        return 'Windows';
    }
    if (d.category && NETWORK_OS_CATEGORIES.has(d.category)) {
        const text = `${os} ${model}`;
        if (/routeros|mikrotik/i.test(text))
            return 'RouterOS';
        if (/fortios|fortinet/i.test(text))
            return 'FortiOS';
        if (/cisco.*ios|ios-xe|ios software/i.test(text))
            return 'Cisco IOS';
        if (/ruijie|rgos/i.test(text))
            return 'Ruijie RGOS';
        if (/junos/i.test(text))
            return 'Junos';
        if (/arubaos|aruba.*os/i.test(text))
            return 'ArubaOS';
        return os || 'Network OS';
    }
    if (ports.has(22)) {
        return 'Linux/Unix';
    }
    return os || '';
}
