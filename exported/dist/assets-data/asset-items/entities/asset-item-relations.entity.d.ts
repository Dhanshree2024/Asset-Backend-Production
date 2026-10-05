import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
export declare enum RelationType {
    Other = "Other",
    Accessory = "Accessory",
    Contract = "Contract",
    Application = "Application"
}
export declare class AssetItemsRelation {
    relation_id: number;
    parent_serial_id: number;
    child_serial_id: number;
    parent_serial: AssetStockSerials;
    child_serial: AssetStockSerials;
    relation_type: string;
    source: string;
    notes?: string;
    last_seen_at: Date;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at?: Date;
    created_by?: number;
    updated_by?: number;
}
