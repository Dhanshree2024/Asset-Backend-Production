import { Roles } from './role.entity';
export declare class Permission {
    permission_id: number;
    role_id: number;
    role: Roles;
    permissions: Record<string, any>;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}
