import { AssetItem } from "./asset-item.entity";
import { Manufacturer } from "src/assets-data/asset-data/entities/manufacturer.entity";
import { User } from "src/organizational-profile/entity/organizational-user.entity";
export declare class ItemManufacturer {
    item_manufacturer_id: number;
    asset_item: AssetItem;
    asset_item_id: number;
    manufacturer: Manufacturer;
    manufacturer_id: number;
    created_at: Date;
    created_by_user: User;
    created_by?: number;
}
