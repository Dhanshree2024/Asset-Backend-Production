"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyClearCookieOptionVariants = exports.clearCookieOptions = exports.authCookieOptions = exports.getRememberMeMaxAgeMs = exports.getCookiePath = exports.getCookieDomain = exports.getCookieSecure = exports.getCookieSameSite = exports.DEFAULT_REMEMBER_ME_MAX_AGE_MS = exports.AUTH_COOKIE_NAMES = void 0;
exports.AUTH_COOKIE_NAMES = [
    'jwtToken',
    'jwt_refresh_token',
    'session_id',
    'system_user_id',
    'main_user_id',
    'organization_id',
    'x-organization-schema',
    'role_id',
    'permissions',
    'permissionToken',
    'branch_access',
    'profile_image',
];
exports.DEFAULT_REMEMBER_ME_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const isProduction = () => process.env.NODE_ENV === 'production';
const parseBool = (value, fallback) => {
    if (value === undefined || value === null || value.trim() === '')
        return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};
const getCookieSameSite = () => {
    const raw = (process.env.COOKIE_SAMESITE ?? '').trim().toLowerCase();
    if (raw === 'lax' || raw === 'strict' || raw === 'none')
        return raw;
    return 'lax';
};
exports.getCookieSameSite = getCookieSameSite;
const getCookieSecure = () => {
    if ((0, exports.getCookieSameSite)() === 'none')
        return true;
    return parseBool(process.env.COOKIE_SECURE, isProduction());
};
exports.getCookieSecure = getCookieSecure;
const getCookieDomain = () => {
    const raw = (process.env.COOKIE_DOMAIN ?? '').trim();
    if (!raw || raw === 'localhost')
        return undefined;
    return raw;
};
exports.getCookieDomain = getCookieDomain;
const getCookiePath = () => {
    const raw = (process.env.COOKIE_PATH ?? '').trim();
    return raw || '/';
};
exports.getCookiePath = getCookiePath;
const getRememberMeMaxAgeMs = () => {
    const raw = Number(process.env.AUTH_COOKIE_REMEMBER_MAX_AGE_MS);
    return Number.isFinite(raw) && raw > 0 ? raw : exports.DEFAULT_REMEMBER_ME_MAX_AGE_MS;
};
exports.getRememberMeMaxAgeMs = getRememberMeMaxAgeMs;
const authCookieOptions = (overrides = {}) => {
    const domain = (0, exports.getCookieDomain)();
    const base = {
        secure: (0, exports.getCookieSecure)(),
        sameSite: (0, exports.getCookieSameSite)(),
        path: (0, exports.getCookiePath)(),
        ...(domain ? { domain } : {}),
    };
    return { ...base, ...overrides, httpOnly: true };
};
exports.authCookieOptions = authCookieOptions;
const clearCookieOptions = (overrides = {}) => {
    const { maxAge: _maxAge, expires: _expires, ...rest } = (0, exports.authCookieOptions)();
    return { ...rest, ...overrides };
};
exports.clearCookieOptions = clearCookieOptions;
const legacyClearCookieOptionVariants = () => {
    const path = (0, exports.getCookiePath)();
    const configuredDomain = (0, exports.getCookieDomain)();
    const domains = configuredDomain
        ? [configuredDomain, undefined]
        : [undefined];
    const sameSites = ['lax', 'strict', 'none'];
    const variants = [];
    for (const domain of domains) {
        for (const sameSite of sameSites) {
            for (const secure of [true, false]) {
                if (sameSite === 'none' && !secure)
                    continue;
                for (const httpOnly of [true, false]) {
                    variants.push({
                        httpOnly,
                        secure,
                        sameSite,
                        path,
                        ...(domain ? { domain } : {}),
                    });
                }
            }
        }
    }
    return variants;
};
exports.legacyClearCookieOptionVariants = legacyClearCookieOptionVariants;
