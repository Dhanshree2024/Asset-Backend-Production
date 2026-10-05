import { AssignTypeEnum } from "../entities/asset_transfer_history.entity";
export declare class CreateAssetTransferHistoryDto {
    asset_id: number;
    mapping_id?: number;
    asset_stocks_unique_id?: number;
    assign_type: AssignTypeEnum;
    previous_user_id?: number;
    previous_branch_id?: number;
    previous_department_id?: number;
    previous_project_id?: number;
    new_user_id?: number;
    new_branch_id?: number;
    new_department_id?: number;
    new_project_id?: number;
    system_code?: string | null;
    transfered_at?: Date;
    updated_at?: Date;
}
