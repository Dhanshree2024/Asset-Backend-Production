export declare class EligibleTargetsQueryDto {
    source_serial_id: number;
    relation_type: string;
    search?: string;
    limit?: number;
    page?: number;
}
export interface RelationshipTabItem {
    tab_key: string;
    tab_label: string;
    relation_types: string[];
    count: number;
    can_link: boolean;
    allowed_target_categories?: string[];
}
export interface RelationshipTabSummaryResponse {
    asset_id: number;
    asset_stocks_unique_id: number;
    asset_name: string;
    main_category_id: number;
    main_category_name: string;
    sub_category_id: number;
    sub_category_name: string;
    total_relationships: number;
    available_tabs: RelationshipTabItem[];
}
