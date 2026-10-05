import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
export declare enum AssetEventCategory {
    LIFECYCLE = "LIFECYCLE",
    ASSIGNMENT = "ASSIGNMENT",
    LOCATION = "LOCATION",
    MAINTENANCE = "MAINTENANCE",
    FINANCIAL = "FINANCIAL",
    STATUS = "STATUS",
    DOCUMENT = "DOCUMENT",
    SYSTEM = "SYSTEM",
    SCRAPE = "SCRAPE",
    TITLE = "TITLE",
    COSTCENTER = "COSTCENTER",
    PROJECT = "PROJECT",
    UPDATE = "UPDATE",
    RENEWALS = "RENEWALS"
}
export declare class AssetEvent {
    event_id: number;
    asset_id?: number;
    asset_stocks_unique_id?: number;
    event_type_id?: number;
    title?: string;
    description?: string;
    reference_table?: string;
    reference_id?: number;
    metadata?: Record<string, any>;
    performed_by?: number;
    performed_at?: Date;
    created_at: Date;
    event_category: AssetEventCategory;
    asset?: AssetDatum;
    stock_serial?: AssetStockSerials;
    performed_user?: User;
    event?: AssetWorkingStatus;
}
