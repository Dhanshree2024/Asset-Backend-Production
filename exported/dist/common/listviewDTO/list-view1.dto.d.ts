export declare enum SortDirection {
    ASC = "asc",
    DESC = "desc"
}
export declare class ListViewDto {
    page?: number;
    limit?: number;
    search?: string;
    customFilters?: Record<string, any>;
    sortField?: string;
    sortDirection?: SortDirection;
}
