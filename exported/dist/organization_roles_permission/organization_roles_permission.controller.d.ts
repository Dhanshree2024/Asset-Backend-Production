import { OrganizationRolesPermissionService } from './organization_roles_permission.service';
import { Response, Request } from 'express';
import { CreateRoleWithPermissionsDto } from './dto/role_permission.dto';
import { UpdateRoleWithPermissionsDto } from './dto/update_role_permission.dto';
import { DeleteRoleDto } from './dto/delete_role_permission.dto';
import { FetchPaginationDto } from 'src/common/paginationDTO/fetch-pagination.dto';
import { GetRoleDto } from './dto/get_role.dto';
export declare class OrganizationRolesPermissionController {
    private readonly organizationRolesPermissionService;
    constructor(organizationRolesPermissionService: OrganizationRolesPermissionService);
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
                role_type: import("../roles_permissions/entities/roles_permission.entity").RoleType;
                is_outside_organization: boolean;
            };
            permissions: {
                role_id: number;
            };
        };
    }>;
    getAllRolesNames(query: FetchPaginationDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllInternalRolesNames(page?: number, limit?: number, searchQuery?: string): Promise<{
        status: number;
        message: string;
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages?: undefined;
    } | {
        status: number;
        message: string;
        data: import("./entity/role.entity").Roles[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllExternalRolesNames(page?: number, limit?: number, searchQuery?: string): Promise<{
        status: number;
        message: string;
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages?: undefined;
    } | {
        status: number;
        message: string;
        data: import("./entity/role.entity").Roles[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllRolesWithPermissions(): Promise<{
        status: number;
        message: string;
        data: {
            role_id: number;
            role_name: string;
            created_by: number;
            created_at: Date;
            updated_at: Date;
            is_active: boolean;
            is_deleted: boolean;
            is_compulsary: boolean;
            is_outside_organization: boolean;
            permissions: {
                permission_id: number;
                permissions: Record<string, any>;
                created_at: Date;
                updated_at: Date;
                is_active: boolean;
                is_deleted: boolean;
            }[];
        }[];
    }>;
    updateRoleWithPermissions(updateRoleDto: UpdateRoleWithPermissionsDto, req: any, res: any): Promise<any>;
    bulkUpdateRolePermissions(bulkUpdateDto: {
        roles: {
            role_id: number;
            permissions: any[];
        }[];
    }, res: any): Promise<any>;
    fetchSingleRoleWithPermissions(GetRoleDto: GetRoleDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteRoleWithPermissions(deleteRoleDto: DeleteRoleDto, req: any, res: any): Promise<any>;
}
