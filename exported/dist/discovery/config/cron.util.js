"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCron = validateCron;
exports.cronMatches = cronMatches;
const FIELDS = [
    { min: 0, max: 59 },
    { min: 0, max: 23 },
    { min: 1, max: 31 },
    { min: 1, max: 12 },
    { min: 0, max: 7 },
];
function parseField(field, spec) {
    const values = new Set();
    for (const part of field.split(',')) {
        const stepMatch = part.match(/^(.+?)\/(\d+)$/);
        const base = stepMatch ? stepMatch[1] : part;
        const step = stepMatch ? parseInt(stepMatch[2], 10) : 1;
        if (!step || step < 1)
            return null;
        let lo;
        let hi;
        if (base === '*') {
            lo = spec.min;
            hi = spec.max;
        }
        else {
            const rangeMatch = base.match(/^(\d+)(?:-(\d+))?$/);
            if (!rangeMatch)
                return null;
            lo = parseInt(rangeMatch[1], 10);
            hi = rangeMatch[2] !== undefined ? parseInt(rangeMatch[2], 10) : lo;
            if (stepMatch && rangeMatch[2] === undefined)
                hi = spec.max;
        }
        if (isNaN(lo) || isNaN(hi) || lo < spec.min || hi > spec.max || lo > hi)
            return null;
        for (let v = lo; v <= hi; v += step)
            values.add(v);
    }
    return values.size ? values : null;
}
function validateCron(expr) {
    const fields = (expr || '').trim().split(/\s+/);
    if (fields.length !== 5)
        return false;
    return fields.every((f, i) => parseField(f, FIELDS[i]) !== null);
}
function cronMatches(expr, date) {
    const fields = (expr || '').trim().split(/\s+/);
    if (fields.length !== 5)
        return false;
    const parsed = fields.map((f, i) => parseField(f, FIELDS[i]));
    if (parsed.some((p) => p === null))
        return false;
    const [minute, hour, dom, month, dow] = parsed;
    const dowValue = date.getDay();
    const dowMatches = dow.has(dowValue) || (dowValue === 0 && dow.has(7));
    return (minute.has(date.getMinutes()) &&
        hour.has(date.getHours()) &&
        dom.has(date.getDate()) &&
        month.has(date.getMonth() + 1) &&
        dowMatches);
}
