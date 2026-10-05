import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetProcurement } from './asset_procurements.entity';
import { LocationBranchMapping } from 'src/organizational-profile/entity/location-branch-mapping.entity';
export declare class AssetProcurementItem {
    procurement_item_id: number;
    procurement_id: number;
    asset_id: number;
    asset: AssetDatum;
    quantity: number;
    location_id: number;
    location: LocationBranchMapping;
    created_at: Date;
    procurement: AssetProcurement;
    previous_procurement_item_id: number;
}
