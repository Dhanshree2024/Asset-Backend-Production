import { RolesPermissionsService } from './roles_permissions.service';
import { DeleteRoleDto } from './dto/delete-roles_permission.dto';
import { CreateRoleWithPermissionsDto } from 'src/organization_roles_permission/dto/role_permission.dto';
export declare class RolesPermissionsController {
    private readonly rolesPermissionsService;
    constructor(rolesPermissionsService: RolesPermissionsService);
    findAll(searchQuery?: string): Promise<unknown>;
    getAllRolesForDropdown(): Promise<{
        status: boolean;
        message: string;
        data: {
            value: number;
            label: string;
        }[];
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    createRoleWithPermissions(dto: CreateRoleWithPermissionsDto, req: any): Promise<{
        status: number;
        message: string;
        data: {
            role: {
                role_id: number;
                role_name: string;
                created_by: number;
                created_at: Date;
                updated_at: Date;
                is_active: boolean;
                is_deleted: boolean;
                is_compulsary: boolean;
                role_type: import("./entities/roles_permission.entity").RoleType;
                is_outside_organization: boolean;
            };
            permissions: {
                role_id: number;
            };
        };
    }>;
    deleteRoleWithPermissions(deleteRoleDto: DeleteRoleDto, req: any, res: any): Promise<any>;
}
