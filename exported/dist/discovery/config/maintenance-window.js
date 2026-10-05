"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAINTENANCE_WINDOW = void 0;
exports.parseHHMM = parseHHMM;
exports.normalizeWindow = normalizeWindow;
exports.isInWindow = isInWindow;
exports.nextDispatchTime = nextDispatchTime;
exports.DEFAULT_MAINTENANCE_WINDOW = { enabled: false, days: [0, 1, 2, 3, 4, 5, 6], start: '22:00', end: '06:00' };
const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
function parseHHMM(v) {
    const m = HHMM.exec((v || '').trim());
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
function normalizeWindow(raw) {
    const days = Array.isArray(raw?.days) ? Array.from(new Set(raw.days.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))).sort() : exports.DEFAULT_MAINTENANCE_WINDOW.days;
    const start = parseHHMM(raw?.start) !== null ? String(raw.start).trim() : exports.DEFAULT_MAINTENANCE_WINDOW.start;
    const end = parseHHMM(raw?.end) !== null ? String(raw.end).trim() : exports.DEFAULT_MAINTENANCE_WINDOW.end;
    return { enabled: !!raw?.enabled && days.length > 0 && start !== end, days, start, end };
}
const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const addMinutes = (d, m) => new Date(d.getTime() + m * 60_000);
function intervalFor(day, w) {
    const s = parseHHMM(w.start);
    const e = parseHHMM(w.end);
    const open = addMinutes(dayStart(day), s);
    const close = addMinutes(dayStart(day), e <= s ? e + 24 * 60 : e);
    return { open, close };
}
function isInWindow(now, w) {
    if (!w.enabled)
        return true;
    for (const offset of [-1, 0]) {
        const day = addMinutes(dayStart(now), offset * 24 * 60);
        if (!w.days.includes(day.getDay()))
            continue;
        const { open, close } = intervalFor(day, w);
        if (now >= open && now < close)
            return true;
    }
    return false;
}
function nextDispatchTime(now, w) {
    if (!w.enabled || isInWindow(now, w))
        return null;
    for (let i = 0; i <= 8; i++) {
        const day = addMinutes(dayStart(now), i * 24 * 60);
        if (!w.days.includes(day.getDay()))
            continue;
        const { open } = intervalFor(day, w);
        if (open > now)
            return open;
    }
    return null;
}
