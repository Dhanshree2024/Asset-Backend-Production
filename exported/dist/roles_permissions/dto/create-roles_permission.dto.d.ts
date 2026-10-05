import { RoleType } from "../entities/roles_permission.entity";
export declare class CreateRolesPermissionDto {
    role_name: string;
    permissions: any[];
    is_compulsary: boolean;
    role_description: string;
    is_outside_organization: boolean;
    item_type: RoleType;
}
