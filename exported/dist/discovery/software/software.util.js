"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersions = compareVersions;
exports.matchesGlob = matchesGlob;
exports.globToLike = globToLike;
exports.isProtected = isProtected;
exports.packageDownloadToken = packageDownloadToken;
exports.verifyPackageDownloadToken = verifyPackageDownloadToken;
exports.splitRings = splitRings;
exports.isRebootExitCode = isRebootExitCode;
const crypto_1 = require("crypto");
function versionParts(v) {
    const s = String(v ?? '').trim();
    if (!s)
        return [];
    return s
        .split(/[.\-_+ ]/)
        .map((p) => {
        const m = /^(\d+)/.exec(p);
        return m ? parseInt(m[1], 10) : 0;
    });
}
function compareVersions(a, b) {
    const pa = versionParts(a);
    const pb = versionParts(b);
    const n = Math.max(pa.length, pb.length);
    for (let i = 0; i < n; i++) {
        const x = pa[i] ?? 0;
        const y = pb[i] ?? 0;
        if (x !== y)
            return x < y ? -1 : 1;
    }
    return 0;
}
function matchesGlob(pattern, value) {
    if (!pattern)
        return true;
    if (value == null)
        return false;
    const esc = pattern.trim().replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${esc}$`, 'i').test(String(value).trim());
}
function globToLike(pattern) {
    return pattern.trim().replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/\*/g, '%');
}
function isProtected(rules, name, publisher) {
    for (const r of rules) {
        const nm = r.nameMatch.replace(/%/g, '*');
        const pm = r.publisherMatch ? r.publisherMatch.replace(/%/g, '*') : null;
        if (matchesGlob(nm, name) && (!pm || matchesGlob(pm, publisher)))
            return r;
    }
    return null;
}
function tokenSecret() {
    const s = process.env.DISCOVERY_PACKAGE_TOKEN_SECRET || process.env.DISCOVERY_CREDENTIAL_KEY || process.env.DISCOVERY_AGENT_TOKEN;
    if (!s)
        throw new Error('DISCOVERY_PACKAGE_TOKEN_SECRET (or DISCOVERY_CREDENTIAL_KEY) must be set to issue package download tokens');
    return s;
}
function packageDownloadToken(schema, packageId, agentId, jobId, ttlSeconds = 3600, now = Date.now()) {
    const exp = Math.floor(now / 1000) + ttlSeconds;
    const msg = `${schema}:${packageId}:${agentId}:${jobId}:${exp}`;
    const sig = (0, crypto_1.createHmac)('sha256', tokenSecret()).update(msg).digest('hex');
    return { token: `${exp}.${jobId}.${sig}`, expiresAt: new Date(exp * 1000).toISOString() };
}
function verifyPackageDownloadToken(token, schema, packageId, agentId, now = Date.now()) {
    if (!token)
        return { ok: false, reason: 'token missing' };
    const parts = token.split('.');
    if (parts.length !== 3)
        return { ok: false, reason: 'token malformed' };
    const [expS, jobId, sig] = parts;
    const exp = parseInt(expS, 10);
    if (!Number.isFinite(exp) || exp * 1000 < now)
        return { ok: false, reason: 'token expired' };
    const msg = `${schema}:${packageId}:${agentId}:${jobId}:${exp}`;
    let expected;
    try {
        expected = (0, crypto_1.createHmac)('sha256', tokenSecret()).update(msg).digest('hex');
    }
    catch (e) {
        return { ok: false, reason: e.message };
    }
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !(0, crypto_1.timingSafeEqual)(a, b))
        return { ok: false, reason: 'token signature invalid' };
    return { ok: true, jobId };
}
function splitRings(deviceIds, ringSizes) {
    const ids = Array.from(new Set(deviceIds.map(String)));
    const sizes = (ringSizes ?? []).map((n) => Math.max(0, Math.floor(Number(n) || 0))).filter((n) => n > 0);
    if (!sizes.length || ids.length === 0)
        return [ids];
    const rings = [];
    let i = 0;
    for (const size of sizes) {
        if (i >= ids.length)
            break;
        rings.push(ids.slice(i, i + size));
        i += size;
    }
    if (i < ids.length)
        rings.push(ids.slice(i));
    return rings;
}
function isRebootExitCode(code) {
    return code === 3010 || code === 1641;
}
