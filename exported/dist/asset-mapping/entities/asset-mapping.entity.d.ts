import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetStatusTypes } from 'src/assets-data/asset-fields/entities/asset-status-types.entity';
import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { Branch } from 'src/organizational-profile/entity/branches.entity';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
export declare enum AssignTargetType {
    USER = "USER",
    PROJECT = "PROJECT",
    DEPARTMENT = "DEPARTMENT",
    BRANCH = "BRANCH",
    SYSTEM = "SYSTEM",
    VENDOR = "VENDOR",
    LOCATION = "LOCATION",
    ASSET = "ASSET",
    OTHER = "OTHER",
    SOFTWARE = "SOFTWARE"
}
export declare enum AssetRelationshipSourceEnum {
    MANUAL = "manual",
    AGENT = "agent",
    SCANNER = "scanner",
    SYNC = "sync"
}
export declare class AssetMappingRepository {
    mapping_id: number;
    asset_id: number;
    asset: AssetDatum;
    status_type_id: number;
    status: AssetStatusTypes;
    description: string;
    assigned_by: number;
    assigned_by_user: User;
    returned_by: number;
    returned_by_user: User;
    created_at: Date;
    updated_at: Date;
    is_active: number;
    is_deleted: number;
    asset_working_condition_id: number;
    asset_working_status: AssetWorkingStatus;
    asset_stocks_unique_id: number;
    stock_serial: AssetStockSerials;
    target_id: number;
    assigned_from_date: Date;
    assigned_to_date: Date;
    target_type: AssignTargetType;
    targetUser: User;
    targetBranch: Branch;
    targetDepartment: Department;
    targetAsset: AssetStockSerials;
    relation_type: string;
    governance_id: number;
    source: AssetRelationshipSourceEnum;
    last_seen_at: Date;
    metadata: Record<string, any>;
    is_inherited: number;
    inherited_via_relationship_id: number;
}
