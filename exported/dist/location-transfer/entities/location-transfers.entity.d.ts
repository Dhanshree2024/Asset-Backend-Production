import { User } from "src/organizational-profile/entity/organizational-user.entity";
import { AssetWorkingStatus } from "src/assets-data/asset-working-status/entities/asset-working-status.entity";
import { AssetStockSerials } from "src/assets-data/stocks/entities/asset_stock_serials.entity";
import { LocationBranchMapping } from "src/organizational-profile/entity/location-branch-mapping.entity";
export declare class LocationTransfer {
    location_transfer_id: number;
    from_location_id: number;
    fromLocation: LocationBranchMapping;
    to_location_id: number;
    toLocation: LocationBranchMapping;
    transfer_status: number;
    status_info: AssetWorkingStatus;
    requested_by: number;
    requested_at: Date;
    requestedByUser: User;
    completed_by: number;
    completed_at: Date;
    completedByUser: User;
    approved_by: number;
    approved_at: Date;
    approvedByUser: User;
    asset_stocks_unique_id: number;
    assetStock: AssetStockSerials;
    reason_for_transfer: string;
    comment_for_location_transfer: string;
    location_transfer_ticket: string;
    is_active: number;
    is_deleted: number;
}
