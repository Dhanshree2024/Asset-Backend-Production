"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMergeObjects = deepMergeObjects;
exports.unionArrays = unionArrays;
function deepMergeObjects(base, incoming) {
    const result = { ...(base ?? {}) };
    if (!incoming)
        return result;
    for (const [key, value] of Object.entries(incoming)) {
        if (value === undefined || value === null)
            continue;
        if (Array.isArray(value)) {
            result[key] = value;
        }
        else if (typeof value === 'object') {
            result[key] = deepMergeObjects(result[key], value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
function unionArrays(a, b) {
    return Array.from(new Set([...(a || []), ...(b || [])]));
}
