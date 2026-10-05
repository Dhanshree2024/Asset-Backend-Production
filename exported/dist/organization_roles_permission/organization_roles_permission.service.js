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
exports.OrganizationRolesPermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const dropdown_cache_service_1 = require("../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../common/redis/dropdown-entities");
const redis_service_1 = require("../common/redis/redis.service");
const typeorm_2 = require("typeorm");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const permissions_entity_1 = require("./entity/permissions.entity");
const role_entity_1 = require("./entity/role.entity");
let OrganizationRolesPermissionService = class OrganizationRolesPermissionService {
    constructor(notificationHelper, redisService, roleRepository, permissionRepository, userRepository, dropdownCache) {
        this.notificationHelper = notificationHelper;
        this.redisService = redisService;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.dropdownCache = dropdownCache;
    }
    async createOrganizationRolesPermission(dto, createdBy) {
        console.log("dto", dto);
        const userExists = await this.userRepository.findOne({ where: { register_user_login_id: createdBy } });
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
    async getAllRolesNames(page = 1, limit = 10, searchQuery = '', sortBy = 'created_at', sortOrder = 'ASC') {
        const skip = (page - 1) * limit;
        const allowedSortFields = ['role_id', 'role_name', 'created_at', 'updated_at'];
        const finalSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const queryBuilder = this.roleRepository.createQueryBuilder('role')
            .where('role.is_active = :isActive', { isActive: true })
            .andWhere('role.is_deleted = :isDeleted', { isDeleted: false });
        if (searchQuery) {
            queryBuilder.andWhere('role.role_name ILIKE :search', { search: `%${searchQuery}%` });
        }
        if (allowedSortFields.includes(sortBy)) {
            queryBuilder.orderBy(`role.${sortBy}`, finalSortOrder);
        }
        else {
            queryBuilder.orderBy('role.role_id', 'DESC');
        }
        queryBuilder.skip(skip).take(limit);
        const [roles, total] = await queryBuilder.getManyAndCount();
        if (!roles || roles.length === 0) {
            return {
                status: 404,
                message: 'No active and non-deleted roles found',
                data: [],
                total: 0,
                page,
                limit,
            };
        }
        return {
            status: 200,
            message: 'Active Roles fetched successfully',
            data: roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getAllInternalRolesNames(page = 1, limit = 10, searchQuery = '') {
        const skip = (page - 1) * limit;
        const whereConditions = {
            is_active: true,
            is_deleted: false,
            is_outside_organization: false,
            role_name: searchQuery ? (0, typeorm_2.Like)(`%${searchQuery}%`) : undefined,
        };
        const [roles, total] = await this.roleRepository.findAndCount({
            where: whereConditions,
            skip,
            take: limit,
        });
        if (!roles || roles.length === 0) {
            return {
                status: 404,
                message: 'No active and non-deleted roles found',
                data: [],
                total: 0,
                page,
                limit,
            };
        }
        return {
            status: 200,
            message: 'Active Roles fetched successfully',
            data: roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getAllExternalRolesNames(page = 1, limit = 10, searchQuery = '') {
        const skip = (page - 1) * limit;
        const whereConditions = {
            is_active: true,
            is_deleted: false,
            is_outside_organization: true,
            role_name: searchQuery ? (0, typeorm_2.Like)(`%${searchQuery}%`) : undefined,
        };
        const [roles, total] = await this.roleRepository.findAndCount({
            where: whereConditions,
            skip,
            take: limit,
        });
        if (!roles || roles.length === 0) {
            return {
                status: 404,
                message: 'No active and non-deleted roles found',
                data: [],
                total: 0,
                page,
                limit,
            };
        }
        return {
            status: 200,
            message: 'Active Roles fetched successfully',
            data: roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async fetchSingleRoleWithPermissions(GetRoleDto) {
        const { role_id } = GetRoleDto;
        if (!role_id) {
            throw new common_1.BadRequestException('Role ID is required');
        }
        try {
            const role = await this.roleRepository.findOne({
                where: { role_id, is_active: true, is_deleted: false },
                relations: ['permissions'],
            });
            if (!role) {
                return {
                    status: 404,
                    message: `Role with ID ${role_id} not found or inactive`,
                    data: null,
                };
            }
            const flatPermissions = [];
            if (role.permissions && Array.isArray(role.permissions)) {
                role.permissions.forEach((permEntity) => {
                    if (Array.isArray(permEntity.permissions)) {
                        permEntity.permissions.forEach((module) => {
                            if (Array.isArray(module.children) && module.children.length) {
                                module.children.forEach((child) => {
                                    flatPermissions.push({
                                        moduleName: module.moduleName,
                                        ...child,
                                    });
                                });
                            }
                            else {
                                flatPermissions.push({
                                    moduleName: module.moduleName,
                                    ...module,
                                });
                            }
                        });
                    }
                });
            }
            return {
                status: 200,
                message: 'Role fetched successfully',
                data: {
                    role_id: role.role_id,
                    role_name: role.role_name,
                    role_description: role.role_description,
                    created_by: role.created_by,
                    created_at: role.createdAt,
                    updated_at: role.updatedAt,
                    is_active: role.is_active,
                    is_deleted: role.is_deleted,
                    is_compulsary: role.is_compulsary,
                    is_outside_organization: role.is_outside_organization,
                    permissions: flatPermissions,
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the role',
                error: error.message,
            };
        }
    }
    async getAllRolesWithPermissions() {
        const roles = await this.roleRepository.find({
            relations: ['permissions'],
            where: {
                is_active: true,
                is_deleted: false
            },
        });
        return roles.map(role => ({
            role_id: role.role_id,
            role_name: role.role_name,
            created_by: role.created_by,
            created_at: role.createdAt,
            updated_at: role.updatedAt,
            is_active: role.is_active,
            is_deleted: role.is_deleted,
            is_compulsary: role.is_compulsary,
            is_outside_organization: role.is_outside_organization,
            permissions: role.permissions.map(permission => ({
                permission_id: permission.permission_id,
                permissions: permission.permissions,
                created_at: permission.created_at,
                updated_at: permission.updated_at,
                is_active: permission.is_active,
                is_deleted: permission.is_deleted,
            })),
        }));
    }
    async updateRoleWithPermissions(updateRoleDto) {
        const { role_id, roleName, roledescription, permissions, is_deleted, is_compulsary, is_outside_organization, } = updateRoleDto;
        console.log('Received roledescription:', roledescription);
        const role = await this.roleRepository.findOne({
            where: { role_id },
            relations: ['permissions'],
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${role_id} not found`);
        }
        role.role_name = roleName;
        role.role_description = roledescription;
        role.is_compulsary = is_compulsary;
        role.is_outside_organization = is_outside_organization;
        if (typeof is_deleted !== 'undefined') {
            role.is_deleted = is_deleted;
        }
        const SaveRoleData = await this.roleRepository.save(role);
        if (permissions) {
            const permission = await this.permissionRepository.findOne({ where: { role_id } });
            if (!permission) {
                throw new common_1.NotFoundException(`Permissions for role ID ${role_id} not found`);
            }
            permission.permissions = permissions;
            await this.permissionRepository.save(permission);
        }
        return {
            SaveRoleData,
            permissions: permissions,
        };
    }
    async bulkUpdateRolePermissions(roles) {
        const results = [];
        for (const { role_id, permissions } of roles) {
            const permissionEntity = await this.permissionRepository.findOne({ where: { role_id } });
            if (!permissionEntity) {
                throw new common_1.NotFoundException(`Permissions for role ID ${role_id} not found`);
            }
            permissionEntity.permissions = permissions;
            const saved = await this.permissionRepository.save(permissionEntity);
            results.push({ role_id, permissions: saved.permissions });
        }
        return results;
    }
    async deleteRoleWithPermissions(deleteRoleDto) {
        const { role_id } = deleteRoleDto;
        if (!Array.isArray(role_id) || role_id.length === 0) {
            throw new common_1.BadRequestException('role_id must be a non-empty array');
        }
        const roles = await this.roleRepository.find({
            where: {
                role_id: (0, typeorm_2.In)(role_id),
                is_active: true,
                is_deleted: false,
            },
            relations: ['permissions'],
        });
        const results = [];
        for (const role of roles) {
            role.is_deleted = true;
            role.is_active = false;
            await this.roleRepository.save(role);
            const permission = await this.permissionRepository.findOne({ where: { role_id: role.role_id } });
            if (permission) {
                permission.is_deleted = true;
                permission.is_active = false;
                await this.permissionRepository.save(permission);
            }
            results.push({ role, permissions: role.permissions });
        }
        return results;
    }
    async checkUserPermission(userId, schema, moduleName, permissionTypes) {
        const permissionConditions = permissionTypes
            .map((perm, index) => `COALESCE((module->>$${index + 3})::BOOLEAN, false) = true`)
            .join(" OR ");
        const query = `
          WITH recursive children_expanded AS (
              SELECT 
                  perm.role_id,
                  jsonb_array_elements(perm.permissions) AS module
              FROM ${schema}.organization_permissions perm
              WHERE perm.role_id = (
                  SELECT current_role_id FROM ${schema}.users WHERE register_user_login_id = $1
              )
    
              UNION ALL
    
              SELECT 
                  ce.role_id,
                  jsonb_array_elements(ce.module->'children')
              FROM children_expanded ce
              WHERE ce.module ? 'children'
          )
    
          SELECT EXISTS (
              SELECT 1 FROM children_expanded
              WHERE module->>'moduleName' = $2
              AND (${permissionConditions})
          ) AS "hasPermission";
        `;
        const values = [userId, moduleName, ...permissionTypes];
        const result = await this.userRepository.query(query, values);
        return result[0]?.hasPermission || false;
    }
};
exports.OrganizationRolesPermissionService = OrganizationRolesPermissionService;
exports.OrganizationRolesPermissionService = OrganizationRolesPermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Roles)),
    __param(3, (0, typeorm_1.InjectRepository)(permissions_entity_1.Permission)),
    __param(4, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __metadata("design:paramtypes", [notifications_helper_1.NotificationHelper,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        dropdown_cache_service_1.DropdownCacheService])
], OrganizationRolesPermissionService);
