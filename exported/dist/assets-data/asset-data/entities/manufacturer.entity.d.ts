import { Models } from "./models.entity";
import { ItemType } from "src/assets-data/asset-items/entities/asset-item.enums";
export declare class Manufacturer {
    manufacturer_id: number;
    manufacturer_name: string;
    models: Models[];
    item_type?: ItemType;
}
