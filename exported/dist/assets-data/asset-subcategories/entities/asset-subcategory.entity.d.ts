import { AssetCategory } from 'src/assets-data/asset-categories/entities/asset-category.entity';
import { AssetItem } from 'src/assets-data/asset-items/entities/asset-item.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
export declare class AssetSubcategory {
    sub_category_id: number;
    main_category_id: number;
    added_by: number;
    sub_category_name: string;
    sub_category_description: string;
    is_active: number;
    is_deleted: number;
    sub_category_icon: string;
    created_at: Date;
    updated_at: Date;
    main_category: AssetCategory;
    added_by_user: User;
    items: AssetItem[];
}
