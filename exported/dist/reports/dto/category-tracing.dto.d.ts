export type CategoryTracingGroupBy = 'department' | 'branch' | 'item';
export declare class CategoryTracingFiltersDto {
    asset_item_ids?: number[];
    main_category_ids?: number[];
    sub_category_ids?: number[];
    branch_ids?: number[];
    department_ids?: number[];
    location_ids?: number[];
    vendor_ids?: number[];
    ownership_status_ids?: number[];
    status_ids?: number[];
    working_status_ids?: number[];
    purchase_date_from?: string;
    purchase_date_to?: string;
}
export declare class CategoryTracingReportDto {
    groupBy: CategoryTracingGroupBy;
    includeBranch?: boolean;
    filters?: CategoryTracingFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
