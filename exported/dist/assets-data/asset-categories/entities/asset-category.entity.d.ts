import { User } from "src/organizational-profile/entity/organizational-user.entity";
import { AssetSubcategory } from "src/assets-data/asset-subcategories/entities/asset-subcategory.entity";
export declare class AssetCategory {
    main_category_id: number;
    main_category_name: string;
    main_category_description: string;
    is_active: number;
    is_deleted: number;
    added_by: number;
    created_at: Date;
    updated_at: Date;
    main_category_icon: string;
    added_by_user: User;
    subcategories: AssetSubcategory[];
}
