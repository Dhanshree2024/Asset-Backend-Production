"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipToInt = ipToInt;
exports.expandCidr = expandCidr;
exports.ipInCidr = ipInCidr;
exports.normaliseMac = normaliseMac;
exports.isBogusMac = isBogusMac;
exports.execCmd = execCmd;
exports.pool = pool;
const child_process_1 = require("child_process");
function ipToInt(ip) {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
        return NaN;
    }
    return (((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0);
}
function intToIp(int) {
    return [
        (int >>> 24) & 0xff,
        (int >>> 16) & 0xff,
        (int >>> 8) & 0xff,
        int & 0xff,
    ].join('.');
}
const MAX_HOSTS_PER_CIDR = 65536;
function expandCidr(cidr) {
    if (!cidr || typeof cidr !== 'string')
        return [];
    const trimmed = cidr.trim();
    const [base, prefixStr] = trimmed.split('/');
    const prefix = prefixStr === undefined ? 32 : parseInt(prefixStr, 10);
    const baseInt = ipToInt(base);
    if (isNaN(baseInt) || isNaN(prefix) || prefix < 0 || prefix > 32)
        return [];
    if (prefix === 32) {
        return [base];
    }
    if (prefix === 31) {
        const netInt = baseInt & (0xffffffff << (32 - prefix));
        return [intToIp(netInt >>> 0), intToIp((netInt + 1) >>> 0)];
    }
    const hostBits = 32 - prefix;
    const netInt = (baseInt & (0xffffffff << hostBits)) >>> 0;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = Math.max(0, totalHosts - 2);
    const count = Math.min(usableHosts, MAX_HOSTS_PER_CIDR);
    const result = [];
    for (let i = 1; i <= count; i++) {
        result.push(intToIp((netInt + i) >>> 0));
    }
    return result;
}
function ipInCidr(ip, cidr) {
    if (!cidr)
        return false;
    const [base, prefixStr] = cidr.trim().split('/');
    const prefix = prefixStr === undefined ? 32 : parseInt(prefixStr, 10);
    const ipInt = ipToInt(ip);
    const baseInt = ipToInt(base);
    if (isNaN(ipInt) || isNaN(baseInt) || isNaN(prefix))
        return false;
    if (prefix === 0)
        return true;
    const mask = (0xffffffff << (32 - prefix)) >>> 0;
    return (ipInt & mask) >>> 0 === (baseInt & mask) >>> 0;
}
function normaliseMac(s) {
    if (!s)
        return null;
    const hex = s.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    if (hex.length !== 12)
        return null;
    const bytes = [];
    for (let i = 0; i < 12; i += 2) {
        bytes.push(hex.substring(i, i + 2));
    }
    return bytes.join(':');
}
function isBogusMac(mac) {
    if (!mac)
        return true;
    const m = mac.toLowerCase();
    if (m === 'ff:ff:ff:ff:ff:ff')
        return true;
    if (m === '00:00:00:00:00:00')
        return true;
    if (m.startsWith('01:00:5e'))
        return true;
    if (m.startsWith('33:33'))
        return true;
    return false;
}
function execCmd(cmd, timeoutMs = 15000) {
    return new Promise((resolve) => {
        try {
            (0, child_process_1.exec)(cmd, { timeout: timeoutMs, windowsHide: true, maxBuffer: 10 * 1024 * 1024 }, (_error, stdout) => {
                resolve(stdout ? stdout.toString() : '');
            });
        }
        catch {
            resolve('');
        }
    });
}
async function pool(items, worker, concurrency) {
    const results = new Array(items.length);
    if (items.length === 0)
        return results;
    const limit = Math.max(1, Math.min(concurrency, items.length));
    let cursor = 0;
    async function run() {
        while (true) {
            const index = cursor++;
            if (index >= items.length)
                return;
            try {
                results[index] = await worker(items[index], index);
            }
            catch {
                results[index] = undefined;
            }
        }
    }
    const workers = [];
    for (let i = 0; i < limit; i++) {
        workers.push(run());
    }
    await Promise.all(workers);
    return results;
}
