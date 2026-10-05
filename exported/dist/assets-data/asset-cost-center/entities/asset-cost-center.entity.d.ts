import { Department } from 'src/organizational-profile/entity/department.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
export declare class AssetCostCenter {
    cost_center_id: number;
    cost_center_code: string;
    cost_center_name?: string;
    cost_center_contact_person?: string;
    cost_center_email?: string;
    department_id?: number;
    department_info?: Department;
    created_by?: number;
    created_user?: User;
    cost_center_budget: number;
    cost_center_spent: number;
    cost_center_utilization?: number;
    cost_center_manger_name_id?: number;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
}
