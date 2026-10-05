export declare class ListViewDtoForExcleExport {
    search?: Array<{
        values: string[];
    }>;
    filters?: Array<{
        column: string;
        values: any[];
    }>;
    sort?: Array<{
        column: string;
        order?: 'asc' | 'desc';
    }>;
    range_filters?: Array<{
        column: string;
        from?: any;
        to?: any;
    }>;
    date_between?: {
        column: string;
        start?: string;
        end?: string;
    };
    visible_columns?: string[] | Record<string, boolean>;
    selectedIds?: number[];
    isSelectAll?: boolean;
    excludeIds?: number[];
    pagination?: {
        limit?: number;
        page?: number;
    };
    cursor?: string;
    direction?: 'next' | 'prev';
    jumpToLast?: boolean;
    isLastPageMode?: boolean;
    knownTotal?: number;
    export_type?: string;
}
