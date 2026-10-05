import { PolicyVersion } from './policy-version.entity';
export declare enum AssignTypeEnum {
    USER = "USER",
    PROJECT = "PROJECT",
    DEPARTMENT = "DEPARTMENT",
    BRANCH = "BRANCH",
    SYSTEM = "SYSTEM",
    VENDOR = "VENDOR",
    LOCATION = "LOCATION"
}
export declare class PolicyMaster {
    policy_id: number;
    policy_name: string;
    category: number[];
    applicable_type: AssignTypeEnum;
    applicable_to: number[];
    is_active: boolean;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    versions: PolicyVersion[];
}
