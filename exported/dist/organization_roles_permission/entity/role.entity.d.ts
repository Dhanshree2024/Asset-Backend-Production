import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { RoleType } from 'src/roles_permissions/entities/roles_permission.entity';
export declare class Roles {
    role_id: number;
    role_name: string;
    role_description?: string;
    role_type: RoleType;
    is_active: boolean;
    is_deleted: boolean;
    is_compulsary: boolean;
    is_outside_organization: boolean;
    created_by: number;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
}
