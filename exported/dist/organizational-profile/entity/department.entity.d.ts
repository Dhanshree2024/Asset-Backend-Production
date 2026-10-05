import { User } from './organizational-user.entity';
export declare class Department {
    department_id: number;
    department_name: string;
    dept_description: string;
    created_by_id: number;
    createdBy: User;
    department_head_id: number;
    departmentHead: User;
    linked_designations: number;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
}
