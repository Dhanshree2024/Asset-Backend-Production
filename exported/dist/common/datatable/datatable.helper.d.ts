import { SelectQueryBuilder } from 'typeorm';
export declare class DataTableHelper {
    static applyPagination<T>(qb: SelectQueryBuilder<T>, query: {
        limit?: number;
        cursor?: string | number;
        orderBy?: string | string[][];
        filters?: string | Record<string, any>;
        search?: string | number;
        searchFields?: string[] | string;
    }): Promise<{
        data: T[];
        nextCursor: any;
    }>;
}
