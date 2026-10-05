import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { LocationBranchMapping } from 'src/organizational-profile/entity/location-branch-mapping.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { AssetStockSerials } from './asset_stock_serials.entity';
export declare class Stock {
    stock_id: number;
    asset_id: number;
    asset_info: AssetDatum;
    location: LocationBranchMapping;
    location_id: number;
    quantity: number;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    created_user: User;
    updated_user: User;
    stock_serials: AssetStockSerials[];
}
export interface AssetDetailArray {
    serial_number: string | null;
    license_details?: string | null;
    department_id: number | null;
    asset_item_id: number | null;
    asset_used_by: number | null;
    asset_managed_by: number | null;
    status_type_id: number | null;
    system_code?: string | null;
    generated_serial_number?: string | null;
    license_key?: string | null;
    warranty_start?: string | null;
    warranty_end?: string | null;
}
