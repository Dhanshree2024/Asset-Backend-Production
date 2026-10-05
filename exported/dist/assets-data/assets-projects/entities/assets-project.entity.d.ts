import { Department } from 'src/organizational-profile/entity/department.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
export declare class AssetsProject {
    project_id: number;
    project_code?: string;
    project_name: string;
    contact_person?: string;
    project_email?: string;
    department_id?: number;
    department_info?: Department;
    created_by?: number;
    created_by_user?: User;
    created_at: Date;
    updated_at: Date;
    is_active: number;
    is_deleted: number;
}
