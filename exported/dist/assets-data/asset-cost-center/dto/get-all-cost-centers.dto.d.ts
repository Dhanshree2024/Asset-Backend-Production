export declare class GetAllDto {
    page: number;
    limit: number;
    search: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    customFilters?: string;
}
