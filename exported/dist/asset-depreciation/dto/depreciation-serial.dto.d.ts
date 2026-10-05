export declare class DepreciationYearRow {
    fy_label: string;
    year_number: number;
    it_opening_wdv: number;
    it_depreciation: number;
    it_closing_wdv: number;
    company_opening_wdv: number;
    company_depreciation: number;
    company_closing_wdv: number;
}
export declare class SerialDepreciationDto {
    asset_stocks_unique_id: number;
    system_code: string;
    asset_id: number;
    asset_title: string;
    asset_item_id: number;
    asset_item_name: string;
    main_category_name: string;
    sub_category_name: string;
    block_id_company: number | null;
    block_id_it: number | null;
    block_name_company: string | null;
    block_name_it: string | null;
    buy_price: number;
    depreciation_start_date: string;
    company_depreciation_rate: number;
    it_act_depreciation_rate: number;
    company_act_residual_value: number;
    it_act_residual_value: number;
    is_half_year_it: boolean;
    company_y1_fraction: number;
    it_act_asset_life: number;
    company_act_asset_life: number;
    asset_type: number;
    location_id: number;
    location_mapping_id: number;
    location_name: number;
    schedule: DepreciationYearRow[];
}
export declare class SerialDepreciationSnapshotDto {
    asset_stocks_unique_id: number;
    system_code: string;
    asset_id: number;
    asset_title: string;
    asset_item_id: number;
    asset_item_name: string;
    main_category_name: string;
    sub_category_name: string;
    block_id_company: number | null;
    block_id_it: number | null;
    block_name_company: string | null;
    block_name_it: string | null;
    buy_price: number;
    depreciation_start_date: string;
    company_depreciation_rate: number;
    it_act_depreciation_rate: number;
    company_act_residual_value: number;
    it_act_residual_value: number;
    is_half_year_it: boolean;
    company_y1_fraction: number;
    fy_label: string;
    year_number: number;
    it_opening_wdv: number;
    it_depreciation: number;
    it_closing_wdv: number;
    company_opening_wdv: number;
    company_depreciation: number;
    company_closing_wdv: number;
}
export interface BlockReportRowDto {
    asset_stocks_unique_id: number;
    system_code: string;
    asset_title: string;
    it_opening_wdv: number;
    it_depreciation: number;
    it_closing_wdv: number;
    company_opening_wdv: number;
    company_depreciation: number;
    company_closing_wdv: number;
}
export interface BlockReportDto {
    block_id_it: number;
    block_name_it: string;
    opening_wdv_it: number;
    depreciation_it: number;
    closing_wdv_it: number;
    opening_wdv_company: number;
    depreciation_company: number;
    closing_wdv_company: number;
    assets: BlockReportRowDto[];
}
export declare class BlockExpandRequestDto {
    fy: string;
    blockIds: number[];
    actType: 'it' | 'company';
    expandBlockIds: number[];
    search?: {
        column: string;
        values: string[];
    }[];
    filters?: {
        column: string;
        values: string[];
    }[];
    pagination?: {
        limit?: number;
    };
    cursor?: {
        id: number;
        created_at: string;
    } | null;
    known_total?: number | null;
}
export declare class DepreciationExportDto {
    search?: string;
    filters?: Record<string, any[]>;
    sort?: {
        column: string;
        order: 'ASC' | 'DESC';
    }[];
    selectedIds?: number[];
    excludeIds?: number[];
    isSelectAll?: boolean;
    itActEnabled?: boolean;
    companyActEnabled?: boolean;
}
export declare class GetSerialDto {
    asset_stocks_unique_id: number;
}
