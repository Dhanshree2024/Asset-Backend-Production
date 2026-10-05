import { SelectQueryBuilder } from 'typeorm';
export type SortDir = 'ASC' | 'DESC';
export interface SortSpec {
    column: string;
    order?: SortDir | 'asc' | 'desc';
}
interface CursorPayload {
    v: unknown;
    id: number | string;
}
export declare function encodeCursor(payload: CursorPayload | null): string | null;
export declare function decodeCursor(token?: string | null): CursorPayload | null;
export interface KeysetOptions {
    qb: SelectQueryBuilder<any>;
    columnMap: Record<string, string>;
    sort?: SortSpec[];
    defaultSort: SortSpec;
    idColumn: string;
    idDbColumn: string;
    cursor?: string | null;
    direction?: 'next' | 'prev';
    paramPrefix?: string;
    predicate?: 'where' | 'having';
    timestampSort?: boolean;
}
export interface KeysetPlan {
    sortColumn: string;
    requestedOrder: SortDir;
    reversed: boolean;
}
export declare function buildKeyset(opts: KeysetOptions): KeysetPlan;
export declare function applyOffsetRaw(qb: SelectQueryBuilder<any>, page: number, limit: number): SelectQueryBuilder<any>;
export interface FinalizeOptions<T> {
    rows: T[];
    limit: number;
    plan: KeysetPlan;
    idColumn: string;
    hadCursor: boolean;
}
export interface PageResult<T> {
    data: T[];
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export declare function finalizePage<T extends Record<string, any>>(opts: FinalizeOptions<T>): PageResult<T>;
export interface ListMetaInput<T> {
    page: PageResult<T>;
    limit: number;
    total?: number | null;
    currentPage?: number;
}
export declare function buildListMeta<T>(input: ListMetaInput<T>): {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    count: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startCursor: string;
    endCursor: string;
    nextCursor: string;
    prevCursor: string;
};
export declare function getCachedCount(redis: {
    get: (k: string) => Promise<any>;
    set: (k: string, v: any, ttl: number) => Promise<any>;
}, cacheKey: string, countFn: () => Promise<number>, ttlSeconds?: number, knownTotal?: number | null): Promise<number>;
export {};
