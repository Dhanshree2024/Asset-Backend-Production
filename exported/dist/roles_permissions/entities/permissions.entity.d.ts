import { RolesPermission } from './roles_permission.entity';
export declare class PermissionsRoles {
    permission_id: number;
    role_id: number;
    permissions: any;
    createdAt: Date;
    updatedAt: Date;
    is_deleted: boolean;
    is_active: boolean;
    role: RolesPermission;
}
