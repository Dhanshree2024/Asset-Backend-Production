export declare class VendorReportFiltersDto {
    vendor_ids?: number[];
    main_category_ids?: number[];
    purchase_date_from?: string;
    purchase_date_to?: string;
}
export declare class VendorReportDto {
    filters?: VendorReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class DepreciationReportFiltersDto {
    main_category_names?: string[];
    asset_item_ids?: number[];
    fy_label?: string;
}
export declare class DepreciationReportDto {
    filters?: DepreciationReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class WarrantyReportFiltersDto {
    main_category_ids?: number[];
    asset_item_ids?: number[];
    expiry_date_from?: string;
    expiry_date_to?: string;
    expiry_status?: string[];
}
export declare class WarrantyReportDto {
    filters?: WarrantyReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class TransferReportFiltersDto {
    from_branch_ids?: number[];
    to_branch_ids?: number[];
    status_ids?: number[];
    requested_date_from?: string;
    requested_date_to?: string;
    asset_stocks_unique_id?: number;
}
export declare class TransferReportDto {
    filters?: TransferReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class MaintenanceReportFiltersDto {
    maintenance_types?: string[];
    priorities?: string[];
    working_status_ids?: number[];
    scheduled_date_from?: string;
    scheduled_date_to?: string;
    main_category_ids?: number[];
    asset_item_ids?: number[];
    asset_stocks_unique_id?: number;
}
export declare class MaintenanceReportDto {
    filters?: MaintenanceReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class ScrapReportFiltersDto {
    disposal_methods?: string[];
    scrap_date_from?: string;
    scrap_date_to?: string;
    main_category_ids?: number[];
    asset_item_ids?: number[];
    asset_stocks_unique_id?: number;
}
export declare class ScrapReportDto {
    filters?: ScrapReportFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
