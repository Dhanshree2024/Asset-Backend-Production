import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { AssetCategory } from 'src/assets-data/asset-categories/entities/asset-category.entity';
import { AssetSubcategory } from 'src/assets-data/asset-subcategories/entities/asset-subcategory.entity';
import { AssetItem } from 'src/assets-data/asset-items/entities/asset-item.entity';
import { Manufacturer } from './manufacturer.entity';
import { Models } from './models.entity';
import { Stock } from 'src/assets-data/stocks/entities/stocks.entity';
export declare class AssetDatum {
    asset_id: number;
    asset_main_category_id: number;
    main_category: AssetCategory;
    asset_sub_category_id: number;
    sub_category: AssetSubcategory;
    asset_item_id: number;
    asset_item: AssetItem;
    asset_title: string;
    asset_description: string;
    manufacturer_id: number;
    manufacturer_name: Manufacturer;
    model_id: number;
    model_name: Models;
    asset_added_by: number;
    added_by_user: User;
    asset_is_active: number;
    asset_is_deleted: number;
    asset_created_at: Date;
    asset_updated_at: Date;
    stocks: Stock[];
}
