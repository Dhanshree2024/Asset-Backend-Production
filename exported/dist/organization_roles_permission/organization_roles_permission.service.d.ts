import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { Repository } from 'typeorm';
import { User } from '../organizational-profile/entity/organizational-user.entity';
import { DeleteRoleDto } from './dto/delete_role_permission.dto';
import { GetRoleDto } from './dto/get_role.dto';
import { CreateRoleWithPermissionsDto } from './dto/role_permission.dto';
import { UpdateRoleWithPermissionsDto } from './dto/update_role_permission.dto';
import { Permission } from './entity/permissions.entity';
import { Roles } from './entity/role.entity';
export declare class OrganizationRolesPermissionService {
    private readonly notificationHelper;
    private readonly redisService;
    private readonly roleRepository;
    private readonly permissionRepository;
    private readonly userRepository;
    private readonly dropdownCache;
    constructor(notificationHelper: NotificationHelper, redisService: RedisService, roleRepository: Repository<Roles>, permissionRepository: Repository<Permission>, userRepository: Repository<User>, dropdownCache: DropdownCacheService);
    createOrganizationRolesPermission(dto: CreateRoleWithPermissionsDto, createdBy: number): Promise<{
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
    getAllOrganizationRoles(): Promise<any>;
    getAllRolesNames(page?: number, limit?: number, searchQuery?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{
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
        data: Roles[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
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
        data: Roles[];
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
        data: Roles[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    fetchSingleRoleWithPermissions(GetRoleDto: GetRoleDto): Promise<{
        status: number;
        message: string;
        data: {
            role_id: number;
            role_name: string;
            role_description: string;
            created_by: number;
            created_at: Date;
            updated_at: Date;
            is_active: boolean;
            is_deleted: boolean;
            is_compulsary: boolean;
            is_outside_organization: boolean;
            permissions: any[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAllRolesWithPermissions(): Promise<{
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
    }[]>;
    updateRoleWithPermissions(updateRoleDto: UpdateRoleWithPermissionsDto): Promise<{
        SaveRoleData: Roles;
        permissions: {
            [key: string]: any;
        }[];
    }>;
    bulkUpdateRolePermissions(roles: {
        role_id: number;
        permissions: any[];
    }[]): Promise<any[]>;
    deleteRoleWithPermissions(deleteRoleDto: DeleteRoleDto): Promise<any[]>;
    checkUserPermission(userId: number, schema: string, moduleName: string, permissionTypes: string[]): Promise<boolean>;
}
