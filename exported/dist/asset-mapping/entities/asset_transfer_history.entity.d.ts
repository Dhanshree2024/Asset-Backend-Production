import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { Branch } from 'src/organizational-profile/entity/branches.entity';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { AssetMappingRepository } from './asset-mapping.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetsProject } from 'src/assets-data/assets-projects/entities/assets-project.entity';
export declare enum AssignTypeEnum {
    USER = "USER",
    BRANCH = "BRANCH",
    DEPARTMENT = "DEPARTMENT",
    PROJECT = "PROJECT"
}
export declare class AssetTransferHistory {
    transfer_id: number;
    asset_id: number;
    asset: AssetDatum;
    mapping_id: number;
    mapping: AssetMappingRepository;
    asset_stocks_unique_id: number;
    stock: AssetStockSerials;
    assign_type: AssignTypeEnum;
    previous_user_id: number;
    previous_user: User;
    previous_branch_id: number;
    previous_branch: Branch;
    previous_department_id: number;
    previous_department: Department;
    previous_project_id: number;
    previous_project: AssetsProject;
    new_user_id: number;
    new_user: User;
    new_branch_id: number;
    new_branch: Branch;
    new_department_id: number;
    new_department: Department;
    new_project_id: number;
    new_project: AssetsProject;
    previous_used_by: number;
    used_by: number;
    transfered_at: Date;
    updated_at: Date;
    system_code: string;
}
