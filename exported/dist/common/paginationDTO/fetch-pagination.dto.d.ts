export declare class FetchPaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    dateRange?: string;
    filters?: Record<string, string>;
    addedDateStart?: string;
    addedDateEnd?: string;
}
