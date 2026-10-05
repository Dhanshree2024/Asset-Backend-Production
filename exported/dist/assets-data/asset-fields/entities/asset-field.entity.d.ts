import { AssetFieldCategory } from "./asset-field-category.entity";
export declare class AssetField {
    asset_field_id: number;
    asset_field_name: string;
    asset_field_category_id: number;
    asset_field_description: string;
    asset_field_label_name: string;
    asset_field_type_details: string;
    asset_field_type: string;
    added_by: number;
    is_active: number;
    is_deleted: number;
    is_custom_field: boolean;
    is_multiple: boolean;
    created_at: Date;
    updated_at: Date;
    category: AssetFieldCategory;
}
