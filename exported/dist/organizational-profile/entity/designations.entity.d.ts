import { User } from './organizational-user.entity';
import { Department } from './department.entity';
export declare class Designations {
    designation_id: number;
    designation_name: string;
    desg_description: string;
    created_by_id: number;
    createdBy: User;
    parent_department: number;
    parentDepartment: Department;
    createdAt: Date;
    updatedAt: Date;
    is_active: number;
    is_deleted: number;
}
