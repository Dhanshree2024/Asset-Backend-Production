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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownCacheService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const request_context_service_1 = require("../context/request-context.service");
const redis_service_1 = require("./redis.service");
let DropdownCacheService = class DropdownCacheService {
    constructor(redis, context) {
        this.redis = redis;
        this.context = context;
        this.PREFIX = 'dropdown';
        this.SHAPE_VERSION = 2;
        this.DEFAULT_TTL = 600;
    }
    currentSchema() {
        return this.context.get('schema') || 'public';
    }
    stableStringify(value) {
        if (value === undefined || value === null)
            return 'all';
        if (typeof value !== 'object')
            return String(value);
        if (Array.isArray(value)) {
            return `[${value.map((v) => this.stableStringify(v)).join(',')}]`;
        }
        const keys = Object.keys(value).sort();
        return `{${keys
            .map((k) => `${k}:${this.stableStringify(value[k])}`)
            .join(',')}}`;
    }
    paramsHash(params) {
        if (params === undefined || params === null)
            return 'all';
        return crypto
            .createHash('sha1')
            .update(this.stableStringify(params))
            .digest('hex')
            .slice(0, 12);
    }
    versionKey(schema, entity) {
        return `${this.PREFIX}:ver:${schema}:${entity}`;
    }
    async currentVersion(schema, entity) {
        const v = await this.redis.get(this.versionKey(schema, entity));
        return typeof v === 'number' && Number.isFinite(v) ? v : 0;
    }
    async buildKey(entity, params) {
        const schema = this.currentSchema();
        const version = await this.currentVersion(schema, entity);
        return this.cacheKey(schema, entity, version, params);
    }
    cacheKey(schema, entity, version, params) {
        return `${this.PREFIX}:s${this.SHAPE_VERSION}:${schema}:${entity}:v${version}:${this.paramsHash(params)}`;
    }
    async getOrSet(entity, params, computeFn, ttl = this.DEFAULT_TTL) {
        const schema = this.currentSchema();
        const version = await this.currentVersion(schema, entity);
        const key = this.cacheKey(schema, entity, version, params);
        console.log("SET REDIS:schema ", schema);
        console.log("SET REDIS:entity ", entity);
        console.log("SET REDIS:version ", version);
        console.log("SET REDIS:key ", key);
        const cached = await this.redis.get(key);
        if (cached !== null && cached !== undefined) {
            console.log(`✅ REDIS HIT: ${entity}`);
            return cached;
        }
        console.log(`❌ REDIS MISS: ${entity}`);
        const value = await computeFn();
        if (value !== null && value !== undefined) {
            await this.redis.set(key, value, ttl);
        }
        console.log("CACHE SERVICE : FOR DROPDOWN params,entity", params, entity);
        return value;
    }
    async invalidate(entity) {
        const schema = this.currentSchema();
        console.log(`🔄 INVALIDATE: ${entity}`);
        await this.redis.incr(this.versionKey(schema, entity));
    }
    async invalidateMany(entities) {
        await Promise.all(entities.map((e) => this.invalidate(e)));
    }
};
exports.DropdownCacheService = DropdownCacheService;
exports.DropdownCacheService = DropdownCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        request_context_service_1.RequestContextService])
], DropdownCacheService);
