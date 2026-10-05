import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { DataSource, Repository } from 'typeorm';
import { DeleteRoleDto } from './dto/delete-roles_permission.dto';
import { RolesPermission } from './entities/roles_permission.entity';
import { CreateRoleWithPermissionsDto } from 'src/organization_roles_permission/dto/role_permission.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { Roles } from 'src/organization_roles_permission/entity/role.entity';
export declare class RolesPermissionsService {
    private rolesPermissionRepository;
    private readonly userRepo;
    private readonly notificationHelper;
    private readonly roleRepository;
    private readonly dataSource;
    private readonly dropdownCache;
    private readonly redisService;
    constructor(rolesPermissionRepository: Repository<RolesPermission>, userRepo: Repository<User>, notificationHelper: NotificationHelper, roleRepository: Repository<Roles>, dataSource: DataSource, dropdownCache: DropdownCacheService, redisService: RedisService);
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
                role_type: import("./entities/roles_permission.entity").RoleType;
                is_outside_organization: boolean;
            };
            permissions: {
                role_id: number;
            };
        };
    }>;
    getAllOrganizationRoles(): Promise<any>;
    findAll(searchQuery: string): Promise<unknown>;
    getAllRolesForDropdown(): Promise<{
        value: number;
        label: string;
    }[]>;
    deleteRoleWithPermissions(deleteRoleDto: DeleteRoleDto): Promise<{
        role: RolesPermission;
        permissions: import("./entities/permissions.entity").PermissionsRoles[];
    }>;
}
