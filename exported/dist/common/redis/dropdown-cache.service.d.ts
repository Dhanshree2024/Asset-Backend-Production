import { RequestContextService } from '../context/request-context.service';
import { RedisService } from './redis.service';
export declare class DropdownCacheService {
    private readonly redis;
    private readonly context;
    private readonly PREFIX;
    private readonly SHAPE_VERSION;
    private readonly DEFAULT_TTL;
    constructor(redis: RedisService, context: RequestContextService);
    private currentSchema;
    private stableStringify;
    private paramsHash;
    private versionKey;
    private currentVersion;
    buildKey(entity: string, params: unknown): Promise<string>;
    private cacheKey;
    getOrSet<T>(entity: string, params: unknown, computeFn: () => Promise<T>, ttl?: number): Promise<T>;
    invalidate(entity: string): Promise<void>;
    invalidateMany(entities: string[]): Promise<void>;
}
