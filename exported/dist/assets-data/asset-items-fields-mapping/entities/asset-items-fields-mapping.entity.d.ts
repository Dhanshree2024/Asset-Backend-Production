import { AssetField } from 'src/assets-data/asset-fields/entities/asset-field.entity';
import { AssetFieldCategory } from 'src/assets-data/asset-fields/entities/asset-field-category.entity';
import { AssetItem } from 'src/assets-data/asset-items/entities/asset-item.entity';
export declare class AssetItemsFieldsMapping {
    aif_mapping_id: number;
    asset_field_id: number;
    asset_item_id: number;
    asset_field_category_id?: number;
    aif_is_enabled: number;
    aif_is_mandatory: number;
    is_individual: number;
    aif_is_active: number;
    aif_is_deleted: number;
    aif_sequence: number;
    aif_added_by?: number;
    aif_created_at?: Date;
    aif_updated_at?: Date;
    aif_description?: string;
    default_value?: string;
    asset_field: AssetField;
    asset_item: AssetItem;
    asset_field_category?: AssetFieldCategory;
}
