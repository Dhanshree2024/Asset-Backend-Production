import { SpecialPermissionsMaster } from './special-permission-master';
export declare class PolicyAttribute {
    id: number;
    role_id: string;
    special_permission_master_id: string;
    special_permission: SpecialPermissionsMaster;
    created_at: Date;
    updated_at: Date;
}
