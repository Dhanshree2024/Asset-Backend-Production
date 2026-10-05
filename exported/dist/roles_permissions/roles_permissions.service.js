"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dropdown_cache_service_1 = require("../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../common/redis/dropdown-entities");
const redis_service_1 = require("../common/redis/redis.service");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const casbin_rule_entity_1 = require("../organizational-profile/entity/policy-builder/casbin-rule.entity");
const typeorm_2 = require("typeorm");
const roles_permission_entity_1 = require("./entities/roles_permission.entity");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
let RolesPermissionsService = class RolesPermissionsService {
    constructor(rolesPermissionRepository, userRepo, notificationHelper, roleRepository, dataSource, dropdownCache, redisService) {
        this.rolesPermissionRepository = rolesPermissionRepository;
        this.userRepo = userRepo;
        this.notificationHelper = notificationHelper;
        this.roleRepository = roleRepository;
        this.dataSource = dataSource;
        this.dropdownCache = dropdownCache;
        this.redisService = redisService;
    }
    async createOrganizationRolesPermission(dto, createdBy) {
        console.log("dto", dto);
        const userExists = await this.userRepo.findOne({ where: { register_user_login_id: createdBy } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid createdBy user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const existingRole = await this.roleRepository.findOne({
            where: {
                role_name: (0, typeorm_2.ILike)(dto.roleName),
                is_active: true
            }
        });
        if (existingRole) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.CONFLICT, message: `Role name '${dto.roleName}' already exists` }, common_1.HttpStatus.CONFLICT);
        }
        const role = this.roleRepository.create({
            role_name: dto.roleName,
            role_type: dto.role_type,
            role_description: dto.roledescription,
            created_by: userExists.user_id,
            is_compulsary: dto.is_compulsary,
            is_outside_organization: dto.is_outside_organization,
        });
        const savedRole = await this.roleRepository.save(role);
        await this.redisService.delByPattern("orgnization-roles:*");
        const ROLE_CREATED_EVENT_ID = 10;
        const updatedUser = userExists;
        const contextData = {
            role: {
                role_name: savedRole.role_name,
                created_by: `${updatedUser.first_name ?? ''} ${updatedUser.last_name ?? ''}`,
            },
        };
        const recipients = [];
        if (updatedUser?.users_business_email) {
            recipients.push({
                recipient_type: 'user',
                recipient_id: String(updatedUser.user_id),
                recipient_email: updatedUser.users_business_email,
            });
        }
        await this.notificationHelper.triggerEventNotification({
            eventId: ROLE_CREATED_EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: savedRole.role_name,
            },
        });
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ROLE);
        await this.redisService.delByPattern('orgnization-roles:*');
        return {
            status: 200,
            message: 'Role and permissions created successfully',
            data: {
                role: {
                    role_id: savedRole.role_id,
                    role_name: savedRole.role_name,
                    created_by: savedRole.created_by,
                    created_at: savedRole.createdAt,
                    updated_at: savedRole.updatedAt,
                    is_active: savedRole.is_active,
                    is_deleted: savedRole.is_deleted,
                    is_compulsary: savedRole.is_compulsary,
                    role_type: savedRole.role_type,
                    is_outside_organization: savedRole.is_outside_organization,
                },
                permissions: {
                    role_id: savedRole.role_id,
                }
            }
        };
    }
    async getAllOrganizationRoles() {
        try {
            const rawResult = await this.roleRepository
                .createQueryBuilder('role')
                .select(['role.role_id AS id', 'role.role_name AS name'])
                .where('role.is_active = :isActive', { isActive: true })
                .andWhere('role.is_deleted = :isDeleted', { isDeleted: false })
                .orderBy('role.role_name', 'ASC')
                .getRawMany();
            const result = rawResult.map((r) => ({
                value: r.id,
                label: r.name,
            }));
            return {
                status: 'success',
                message: 'Roles retrieved successfully.',
                data: result,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching roles: ${error.message}`);
        }
    }
    async findAll(searchQuery) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const cacheKey = `orgnization-roles:${searchQuery}`;
            const cached = await this.redisService.get(cacheKey);
            console.log("CACHED:", cached);
            if (cached) {
                console.log('REDIS HIT:ORGNIZATION ROLES');
                if (cached != null) {
                    return cached;
                }
            }
            console.log('REDIS MISS:ORGNIZATION ROLES');
            await queryRunner.connect();
            const checkPath = await queryRunner.query('SHOW search_path;');
            console.log("Search Path After SET:", checkPath);
            let whereCondition = { is_active: true, is_deleted: false };
            if (searchQuery && searchQuery.trim() !== '') {
                whereCondition['role_name'] = (0, typeorm_2.ILike)(`%${searchQuery}%`);
            }
            const [results, total] = await queryRunner.manager
                .getRepository(roles_permission_entity_1.RolesPermission)
                .createQueryBuilder('organization_roles')
                .leftJoinAndSelect('organization_roles.createdBy', 'createdBy')
                .where(whereCondition)
                .orderBy('organization_roles.role_name', 'ASC')
                .getManyAndCount();
            console.log("Fetched roles:", results.length);
            const rolesWithCounts = await Promise.all(results.map(async (role) => {
                const userCount = await queryRunner.manager.getRepository(organizational_user_entity_1.User).count({
                    where: { role_id: role.role_id, is_active: 1, is_deleted: 0 },
                });
                const permissionCountResult = await queryRunner.manager
                    .getRepository(casbin_rule_entity_1.CasbinRule)
                    .createQueryBuilder("cr")
                    .where("cr.v0 = :role", { role: role.role_id.toString() })
                    .andWhere("cr.isAllowed = true")
                    .getCount();
                return {
                    ...role,
                    permissions: null,
                    userCount,
                    permissionCount: permissionCountResult,
                };
            }));
            const response = {
                data: rolesWithCounts,
                total
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.error('Error in findAll with QueryRunner:', error);
            throw new Error('Error while fetching roles.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAllRolesForDropdown() {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.ROLE, null, async () => {
            const roles = await this.rolesPermissionRepository.find({
                where: { is_active: true, is_deleted: false },
                order: { role_name: 'ASC' },
            });
            const dropdownRoles = roles.map((role) => ({
                value: role.role_id,
                label: role.role_name,
            }));
            return dropdownRoles;
        });
    }
    async deleteRoleWithPermissions(deleteRoleDto) {
        const { role_id } = deleteRoleDto;
        if (!role_id) {
            throw new common_1.BadRequestException('Role ID is required and cannot be null');
        }
        const role = await this.rolesPermissionRepository.findOne({
            where: { role_id },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${role_id} not found`);
        }
        role.is_deleted = true;
        role.is_active = false;
        await this.rolesPermissionRepository.save(role);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ROLE);
        await this.redisService.delByPattern("orgnization-roles:*");
        return {
            role,
            permissions: role.permissions,
        };
    }
};
exports.RolesPermissionsService = RolesPermissionsService;
exports.RolesPermissionsService = RolesPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(roles_permission_entity_1.RolesPermission)),
    __param(1, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(role_entity_1.Roles)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_helper_1.NotificationHelper,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        dropdown_cache_service_1.DropdownCacheService,
        redis_service_1.RedisService])
], RolesPermissionsService);
