import { CreateRolesPermissionDto } from './create-roles_permission.dto';
declare const UpdateRolesPermissionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRolesPermissionDto>>;
export declare class UpdateRolesPermissionDto extends UpdateRolesPermissionDto_base {
    role_id: number;
    role_name: string;
    permissions: {
        [key: string]: any;
    }[];
    is_deleted?: boolean;
    is_compulsary?: boolean;
    is_outside_organization?: boolean;
}
export {};
