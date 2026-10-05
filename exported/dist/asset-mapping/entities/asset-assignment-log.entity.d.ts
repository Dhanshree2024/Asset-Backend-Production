import { AssetStockSerials } from "src/assets-data/stocks/entities/asset_stock_serials.entity";
import { AssetMappingRepository, AssignTargetType } from "./asset-mapping.entity";
import { User } from "src/organizational-profile/entity/organizational-user.entity";
import { AssetWorkingStatus } from "src/assets-data/asset-working-status/entities/asset-working-status.entity";
export declare class AssetAssignmentEvent {
    event_id: number;
    asset_stocks_unique_id: number;
    stock_serial: AssetStockSerials;
    mapping_id: number;
    mapping: AssetMappingRepository;
    performed_by: number;
    performed_by_user: User;
    notes: string;
    performed_at: Date;
    working_condition_id: number;
    working_status: AssetWorkingStatus;
    target_id: number;
    target_type: AssignTargetType;
}
