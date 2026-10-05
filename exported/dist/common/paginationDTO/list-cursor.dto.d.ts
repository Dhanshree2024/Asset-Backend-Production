export declare class SortItemDto {
    column: string;
    order?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
export declare class ListCursorDto {
    cursor?: string | null;
    direction?: 'next' | 'prev';
    page?: number;
    jumpToLast?: boolean;
    limit?: number;
    sort?: SortItemDto[];
    search?: any[];
    filters?: any[];
    range_filters?: any[];
    date_between?: any;
    visible_columns?: Record<string, boolean>;
}
