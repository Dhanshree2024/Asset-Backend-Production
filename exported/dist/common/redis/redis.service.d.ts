import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): void;
    incr(key: string): Promise<number>;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
    tryLock(key: string, ttlSeconds: number): Promise<boolean>;
    releaseLock(key: string): Promise<void>;
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<{
        success: boolean;
        deletedCount: number;
        error?: string;
    }>;
    onModuleDestroy(): void;
}
