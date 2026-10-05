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
Object.defineProperty(exports, "__esModule", { value: true });
exports.permKey = exports.BOUNDARY_KEY = void 0;
exports.buildSerialsKey = buildSerialsKey;
const crypto = __importStar(require("crypto"));
function buildSerialsKey(userId, branchIds, dto) {
    const normalized = {
        search: dto.search,
        filters: [...(dto.filters || [])].sort((a, b) => a.column.localeCompare(b.column)),
        sort: dto.sort,
        range_filters: dto.range_filters,
        date_between: dto.date_between,
        visible_columns: [...(dto.visible_columns || [])].sort(),
        cursor: dto.cursor,
        page: dto.page ?? null,
        direction: dto.direction ?? 'next',
        jumpToLast: dto.jumpToLast === true ? 1 : 0,
        getAll: dto.getAll === true ? 1 : 0,
        limit: dto.pagination?.limit,
        branchIds: [...branchIds].sort(),
        userId,
        isLastPage: (dto.isLastPageMode === true || dto.jumpToLast === true) ? 1 : 0,
    };
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(normalized))
        .digest('hex')
        .slice(0, 16);
    return `serials:u${userId}:${hash}`;
}
exports.BOUNDARY_KEY = 'serials:boundary';
const permKey = (roleId) => `perm:role:${roleId}:self_access`;
exports.permKey = permKey;
