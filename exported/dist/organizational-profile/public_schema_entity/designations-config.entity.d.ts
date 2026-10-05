import { DepartmentConifg } from './department-config.entity';
export declare class DesignationsConfig {
    designationId: number;
    department_id: number;
    parentDepartment: DepartmentConifg;
    designationName: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    isDeleted: boolean;
}
