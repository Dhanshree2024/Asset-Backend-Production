"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActor = resolveActor;
exports.redactParams = redactParams;
const cookie_1 = require("cookie");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const REDACT_KEY_RE = /pass(word|wd)?|secret|token|community|key$|apikey|api_key|authorization|credential|pwd/i;
function resolveActor(req) {
    const empty = { userId: null, name: null, ip: null, requestId: null };
    if (!req)
        return empty;
    let userId = null;
    try {
        const cookies = (0, cookie_1.parse)(req.headers?.cookie || '');
        const enc = cookies['system_user_id'];
        if (enc) {
            const n = Number((0, crypto_utils_1.decrypt)(enc.toString()));
            if (!isNaN(n))
                userId = n;
        }
    }
    catch {
        userId = null;
    }
    const fwd = req.headers?.['x-forwarded-for']?.split(',')[0]?.trim();
    const ip = fwd || req.ip || req.socket?.remoteAddress || null;
    const requestId = req.headers?.['x-request-id'] ||
        req.headers?.['x-correlation-id'] ||
        null;
    return { userId, name: null, ip, requestId };
}
function redactParams(params, depth = 0) {
    if (!params || typeof params !== 'object')
        return null;
    if (depth > 6)
        return { _truncated: true };
    const out = {};
    for (const [k, v] of Object.entries(params)) {
        if (REDACT_KEY_RE.test(k)) {
            out[k] = '[REDACTED]';
        }
        else if (Array.isArray(v)) {
            out[k] = v.slice(0, 50).map((x) => x && typeof x === 'object' ? redactParams(x, depth + 1) : x);
        }
        else if (v && typeof v === 'object') {
            out[k] = redactParams(v, depth + 1);
        }
        else if (typeof v === 'string' && v.length > 2000) {
            out[k] = v.slice(0, 2000) + '…';
        }
        else {
            out[k] = v;
        }
    }
    return out;
}
