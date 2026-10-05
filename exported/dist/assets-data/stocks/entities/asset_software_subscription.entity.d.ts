import { AssetStockSerials } from './asset_stock_serials.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetItem } from 'src/assets-data/asset-items/entities/asset-item.entity';
import { Stock } from './stocks.entity';
import { AssetProcurement } from './asset_procurements.entity';
import { WarrantyType } from 'src/assets-data/asset-items/entities/asset-item.enums';
export declare class AssetSoftwareSubscription {
    asset_stocks_unique_id: number;
    asset_id?: number;
    stock_id?: number;
    asset_item_id?: number;
    procurement_id?: number;
    warranty_category?: WarrantyType[];
    sub_start_date?: Date;
    next_renewal_date?: Date;
    subscription_type?: string;
    billing_frequency?: string;
    asset_stock_serial?: AssetStockSerials;
    asset_data?: AssetDatum;
    stock?: Stock;
    asset_item?: AssetItem;
    procurement?: AssetProcurement;
}
