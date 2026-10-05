import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { AssetField } from './asset-field.entity';
export declare class AssetFieldCategory {
    asset_field_category_id: number;
    asset_field_category_name?: string;
    asset_field_category_description?: string;
    added_by?: number;
    added_user?: User;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
    assetFields: AssetField;
}
