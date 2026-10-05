export declare class FetchPaginationDto {
    page?: number;
    private _limit?;
    get limit(): number;
    set limit(value: number);
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    dateRange?: string;
    filters?: Record<string, string>;
    addedDateStart?: string;
    addedDateEnd?: string;
    isPaginated?: string;
}
