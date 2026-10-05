import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { PermissionsRoles } from './permissions.entity';
export declare enum RoleType {
    SYSTEM = "system",
    CUSTOM = "custom"
}
export declare class RolesPermission {
    role_id: number;
    role_name: string;
    created_by: number;
    role_description: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    is_deleted: boolean;
    is_active: boolean;
    permissions: PermissionsRoles[];
    is_compulsary: boolean;
    is_outside_organization: boolean;
    role_type: RoleType;
}
