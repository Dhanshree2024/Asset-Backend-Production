import { SelectQueryBuilder } from 'typeorm';
export declare function applyCursorOrOffsetPagination({ qb, alias, cursor, idField, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        id?: number;
    } | null;
    idField?: string;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function buildPaginationResult<T>({ data, limit, idField, dateField, }: {
    data: T[];
    limit: number;
    idField?: string;
    dateField?: string;
}): {
    data: T[];
    meta: {
        limit: number;
        hasNextPage: boolean;
        nextCursor: {
            created_at: any;
            id: any;
        };
        prevCursor: {
            created_at: any;
            id: any;
        };
    };
};
export declare function applyCursorPagination({ qb, alias, cursor, idField, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        id?: number;
    } | null;
    idField: string;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function newapplyCursorPagination({ qb, alias, cursor, idField, sortField, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        id?: number;
        sortColumn?: string;
        sortValue?: any;
        direction?: string;
    } | null;
    idField: string;
    sortField?: string;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function applyLocationTransferCursorPagination({ qb, alias, cursor, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        requested_at?: string;
        location_transfer_id?: number;
    } | null;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function applyMaintenanceCursorPagination({ qb, alias, cursor, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        created_at?: string;
        maintenance_id?: number;
    } | null;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function applyScrapCursorPagination({ qb, alias, cursor, order, }: {
    qb: SelectQueryBuilder<any>;
    alias: string;
    cursor?: {
        created_at?: string;
        scrap_id?: number;
    } | null;
    order?: 'ASC' | 'DESC';
}): SelectQueryBuilder<any>;
export declare function applySearch<T>(qb: SelectQueryBuilder<T>, search: string, columns: string[]): SelectQueryBuilder<T>;
