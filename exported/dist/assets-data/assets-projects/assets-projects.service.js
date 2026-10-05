"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
const redis_service_1 = require("../../common/redis/redis.service");
const entity_lookup_service_1 = require("../../organizational-profile/entity-lookup.service");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const cache_service_helper_1 = require("../../utils/cache-service-helper");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const assets_project_entity_1 = require("./entities/assets-project.entity");
let AssetsProjectsService = class AssetsProjectsService {
    constructor(dataSource, EntityLookupService, notificationHelper, redisService, assetsProjectRepo, userRepository, assetStockSerialsRepo, assetMappingRepository, dropdownCache) {
        this.dataSource = dataSource;
        this.EntityLookupService = EntityLookupService;
        this.notificationHelper = notificationHelper;
        this.redisService = redisService;
        this.assetsProjectRepo = assetsProjectRepo;
        this.userRepository = userRepository;
        this.assetStockSerialsRepo = assetStockSerialsRepo;
        this.assetMappingRepository = assetMappingRepository;
        this.dropdownCache = dropdownCache;
    }
    async getAllProjects(dto, branchIds = []) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'organization-projects',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id
            });
            console.log(cacheKey);
            console.time('REDIS-GET');
            const cached = await this.redisService.get(cacheKey);
            console.timeEnd('REDIS-GET');
            if (cached) {
                console.log('asset-locations:REDIS HIT');
                return cached;
            }
            console.log('asset-locations:REDIS MISS');
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filtersArray = dto.filters || [];
            const sortArray = dto.sort || [];
            const rangeFilters = dto.range_filters || [];
            const dateBetween = dto.date_between || null;
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            console.timeEnd('INPUT');
            console.time('QUERY_BUILDER');
            const intColumns = ['project_id', 'created_by', 'department_id', 'is_active'];
            const buildBaseQuery = (qb) => {
                return qb
                    .select([
                    'project.project_id',
                    'project.project_name',
                    'project.project_code',
                    'project.contact_person',
                    'project.project_email',
                    'project.is_active',
                    'project.created_at',
                    'department.department_id',
                    'department.department_name',
                ])
                    .leftJoin('project.department_info', 'department')
                    .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'serial', `serial.project_id = project.project_id
            AND serial.is_deleted = 0
            AND serial.is_active = 1`)
                    .addSelect('COUNT(DISTINCT serial.asset_stocks_unique_id)', 'asset_count')
                    .groupBy('project.project_id')
                    .addGroupBy('department.department_id')
                    .where('project.is_deleted = :deleted', { deleted: 0 });
            };
            console.timeEnd('QUERY_BUILDER');
            console.time('SEARCH_FILTERS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, i) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                    qb.andWhere(`(project.project_name ILIKE :s${i}
          OR project.project_code ILIKE :s${i}
          OR project.contact_person ILIKE :s${i}
          OR project.project_email ILIKE :s${i}
          OR CAST(project.project_id AS TEXT) ILIKE :s${i})`, { [`s${i}`]: `%${value}%` });
                });
                const filters = {};
                filtersArray.forEach((f) => {
                    filters[f.column] = f.values || [];
                });
                if (filters.is_active?.length) {
                    qb.andWhere('project.is_active IN (:...activeVals)', {
                        activeVals: filters.is_active.map(Number),
                    });
                }
                Object.keys(filters).forEach((key) => {
                    if (key === 'is_active')
                        return;
                    if (!filters[key]?.length)
                        return;
                    const isInt = intColumns.includes(key);
                    const values = filters[key].map((v) => (isInt ? Number(v) : v));
                    if (isInt) {
                        qb.andWhere(`project.${key} IN (:...${key})`, { [key]: values });
                    }
                    else {
                        qb.andWhere(new typeorm_2.Brackets((qb2) => {
                            values.forEach((val, idx) => {
                                qb2.orWhere(`project.${key} ILIKE :${key}_${idx}`, {
                                    [`${key}_${idx}`]: `%${val}%`,
                                });
                            });
                        }));
                    }
                });
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'organization-projects-count:' +
                JSON.stringify({ search: searchArray, filters: filtersArray, branchIds });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = this.assetsProjectRepo
                    .createQueryBuilder('project')
                    .leftJoin('project.department_info', 'department')
                    .where('project.is_deleted = :deleted', { deleted: 0 });
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetsProjectRepo.createQueryBuilder('project'));
            applySearchAndFilters(qb);
            const sortableMap = {
                project_id: 'project.project_id',
                project_name: 'project.project_name',
                project_code: 'project.project_code',
                contact_person: 'project.contact_person',
                project_email: 'project.project_email',
                is_active: 'project.is_active',
                created_at: 'project.created_at',
                department_name: 'department.department_name',
                asset_count: 'asset_count',
            };
            const idColumn = 'project_id';
            const idDbColumn = 'project.project_id';
            const defaultSort = { column: 'project_id', order: 'DESC' };
            if (dto.getAll === true) {
                (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'next',
                });
                const result = await qb.getRawAndEntities();
                const mergedRows = result.entities.map((item, i) => ({
                    ...item,
                    asset_count: Number(result.raw[i]?.asset_count || 0),
                    department_name: result.raw[i]?.department_name ??
                        item?.department_info?.department_name ??
                        null,
                }));
                const total = mergedRows.length;
                const response = {
                    success: true,
                    message: total
                        ? 'Projects fetched successfully'
                        : 'No projects found',
                    data: mergedRows,
                    meta: {
                        total,
                        totalPages: 1,
                        currentPage: 1,
                        limit: total,
                        count: total,
                        hasNextPage: false,
                        hasPrevPage: false,
                        startCursor: null,
                        endCursor: null,
                        nextCursor: null,
                        prevCursor: null,
                    },
                };
                await this.redisService.set(cacheKey, response, 30);
                console.timeEnd('GET_ALL_PROJECTS_TOTAL');
                return response;
            }
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: cursorToken, direction,
                });
            }
            console.timeEnd('MAIN_QUERY');
            console.time('CURSOR_PAGINATION');
            const result = usingOffset
                ? await qb.getRawAndEntities()
                : await qb.limit(limit + 1).getRawAndEntities();
            const mergedRows = result.entities.map((item, i) => ({
                ...item,
                asset_count: Number(result.raw[i]?.asset_count || 0),
                department_name: result.raw[i]?.department_name ??
                    item?.department_info?.department_name ??
                    null,
            }));
            console.timeEnd('CURSOR_PAGINATION');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = mergedRows;
                const first = data[0];
                const last = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: first
                            ? (0, keyset_pagination_1.encodeCursor)({ v: first[plan.sortColumn] ?? null, id: first[idColumn] })
                            : null,
                        endCursor: last
                            ? (0, keyset_pagination_1.encodeCursor)({ v: last[plan.sortColumn] ?? null, id: last[idColumn] })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit, total, currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: mergedRows, limit, plan, idColumn, hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page, limit, total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            console.time('RESPONSE_BUILD');
            const response = {
                success: true,
                message: data.length
                    ? 'Projects fetched successfully'
                    : 'No Projects found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_ALL_PROJECTS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_PROJECTS_TOTAL');
            console.error('getAllProjects ERROR:', error);
            throw error;
        }
    }
    async getProjectsDropdown(search) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.PROJECT, { search }, async () => {
            try {
                const query = this.assetsProjectRepo
                    .createQueryBuilder('project')
                    .select([
                    'project.project_id',
                    'project.project_name',
                ])
                    .where('project.is_deleted = :deleted', { deleted: 0 })
                    .andWhere('project.is_active = :active', { active: 1 });
                if (search && search.trim() !== '') {
                    query.andWhere(`(project.project_name ILIKE :search OR project.project_code ILIKE :search)`, { search: `%${search}%` });
                }
                const data = await query
                    .orderBy('project.project_name', 'ASC')
                    .getMany();
                return data;
            }
            catch (error) {
                console.error('Error fetching project dropdown:', error);
                throw new common_1.BadRequestException(`Error fetching project dropdown: ${error.message}`);
            }
        });
    }
    async generateNextProjectCode() {
        const latest = await this.assetsProjectRepo
            .createQueryBuilder('project')
            .select('project.project_id')
            .orderBy('project.project_id', 'DESC')
            .getOne();
        const nextId = latest ? latest.project_id + 1 : 1;
        return `PRJ${nextId.toString().padStart(5, '0')}`;
    }
    async createNewProject(payload, createdBy) {
        console.log("POINT:1");
        console.log("POINT:2");
        const projectName = payload.project_name?.trim();
        const existingProject = await this.assetsProjectRepo.findOne({
            where: { project_name: (0, typeorm_2.ILike)(projectName), is_deleted: 0 },
        });
        if (existingProject) {
            return {
                status: 409,
                success: false,
                message: 'Project with this name already exists',
                data: null,
            };
        }
        console.log("POINT:3");
        const newProject = {
            project_code: payload.project_code,
            project_name: projectName,
            contact_person: payload.contact_person ?? null,
            project_email: payload.project_email ?? null,
            department_id: payload.department_id ?? null,
            created_by: createdBy ?? null,
            is_active: payload.is_active ?? 1,
            is_deleted: 0,
        };
        console.log("POINT:4");
        const savedProject = await this.assetsProjectRepo.save(newProject);
        console.log("POINT:4");
        const PROJECT_CREATION_EVENT_ID = 45;
        const createdUser = await this.userRepository.findOne({
            where: { user_id: createdBy },
        });
        console.log("test:1212", createdUser);
        const contextData = {
            project: {
                project_name: savedProject.project_name,
                project_code: savedProject.project_code,
                created_by: `${createdUser?.first_name ?? ''} ${createdUser?.last_name ?? ''}`.trim(),
            },
        };
        const recipients = [];
        if (createdUser?.users_business_email) {
            recipients.push({
                recipient_type: 'user',
                recipient_id: String(createdUser.user_id),
                recipient_email: createdUser.users_business_email,
            });
        }
        await this.notificationHelper.triggerEventNotification({
            eventId: PROJECT_CREATION_EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: `PROJECT_CREATE_${savedProject.project_id}`,
            },
        });
        console.log('REDIS UPDATE:PROJECT-ADD');
        await this.redisService.delByPattern('organization-projects:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            status: 201,
            success: true,
            message: 'Project created successfully',
            data: savedProject,
        };
    }
    async getProjectById(project_id) {
        const project = await this.assetsProjectRepo.findOne({
            where: { project_id, is_deleted: 0 },
            relations: ['department_info'],
        });
        if (!project)
            return null;
        return {
            project_code: project.project_code,
            project_id: project.project_id,
            project_name: project.project_name,
            contact_person: project.contact_person,
            project_email: project.project_email,
            department_id: project.department_id,
            department_name: project.department_info?.department_name || null,
            is_active: project.is_active,
            created_at: project.created_at,
        };
    }
    async updateProjectById(payload, user_id) {
        const { project_id, project_code, project_name, contact_person, project_email, department_id, is_active, } = payload;
        if (!project_id) {
            return {
                status: 400,
                success: false,
                message: "Project ID is required to update a project.",
            };
        }
        const existingProject = await this.assetsProjectRepo.findOne({
            where: { project_id, is_deleted: 0 },
        });
        if (!existingProject) {
            return {
                status: 404,
                success: false,
                message: `Project with ID ${project_id} not found or deleted.`,
            };
        }
        if (project_code && project_code !== existingProject.project_code) {
            const duplicateCode = await this.assetsProjectRepo.findOne({
                where: { project_code, is_deleted: 0 },
            });
            if (duplicateCode) {
                return {
                    status: 409,
                    success: false,
                    message: `Project code ${project_code} already exists.`,
                };
            }
            existingProject.project_code = project_code;
        }
        existingProject.project_name = project_name ?? existingProject.project_name;
        existingProject.contact_person = contact_person ?? existingProject.contact_person;
        existingProject.project_email = project_email ?? existingProject.project_email;
        existingProject.department_id = department_id ?? existingProject.department_id;
        existingProject.is_active =
            typeof is_active !== "undefined" ? is_active : existingProject.is_active;
        existingProject.updated_at = new Date();
        await this.assetsProjectRepo.save(existingProject);
        console.log('REDIS UPDATE:PROJECT-UPDATE');
        await this.redisService.delByPattern('organization-projects:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            status: 200,
            success: true,
            message: "Project updated successfully",
            data: existingProject,
        };
    }
    async deleteProjects(projectIds, orgId) {
        if (!Array.isArray(projectIds) || projectIds.length === 0) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'No user IDs provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const deletedProjects = [];
        const failedProjects = [];
        for (const project_id of projectIds) {
            try {
                const existingUser = await this.assetsProjectRepo.findOne({
                    where: { project_id },
                });
                if (!existingUser) {
                    failedProjects.push({
                        project_id,
                        message: `User with ID ${project_id} not found`,
                    });
                    continue;
                }
                existingUser.is_active = 0;
                existingUser.is_deleted = 1;
                await this.assetsProjectRepo.save(existingUser);
                deletedProjects.push({
                    project_id,
                    message: `User with ID ${project_id} has been deactivated and deleted`,
                });
            }
            catch (error) {
                failedProjects.push({
                    project_id,
                    message: `Error deleting user ID ${project_id}`,
                });
            }
        }
        console.log('REDIS UPDATE:PROJECT-DELETE');
        await this.redisService.delByPattern('organization-projects:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Bulk user delete operation completed.',
            data: {
                deleted: deletedProjects,
                failed: failedProjects,
            },
        };
    }
    async activateProjects(projectIds, systemUserId) {
        const results = [];
        const projectsToActivate = [];
        for (const id of projectIds) {
            const project = await this.assetsProjectRepo.findOne({
                where: { project_id: id, is_deleted: 0 },
            });
            if (!project) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Project not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (project.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Project is already active.',
                    name: project.project_name,
                });
                continue;
            }
            projectsToActivate.push(project);
            results.push({
                id,
                status: 'success',
                name: project.project_name,
            });
        }
        if (projectsToActivate.length > 0) {
            await this.assetsProjectRepo
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('project_id IN (:...ids)', {
                ids: projectsToActivate.map((p) => p.project_id),
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Project ${successful[0].name} marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} projects marked as active.`;
        }
        else {
            message = 'No projects were marked as active.';
        }
        console.log('REDIS UPDATE:PROJECT-ACTIVE');
        await this.redisService.delByPattern('organization-projects:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateProjects(projectIds, systemUserId) {
        const results = [];
        const projectsToDeactivate = [];
        for (const id of projectIds) {
            const project = await this.assetsProjectRepo.findOne({
                where: { project_id: id, is_deleted: 0 },
            });
            if (!project) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Project not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (!project.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Project is already inactive.',
                    name: project.project_name,
                });
                continue;
            }
            const assignedAssetCount = await this.assetMappingRepository
                .createQueryBuilder('am')
                .where('am.target_id = :id', { id })
                .andWhere('am.target_type = :type', { type: 'PROJECT' })
                .andWhere('am.is_deleted = 0')
                .andWhere('am.is_active = 1')
                .getCount();
            if (assignedAssetCount > 0) {
                results.push({
                    id,
                    status: 'failed',
                    message: `Project has ${assignedAssetCount} mapped asset(s). Please unassign or transfer assets before deactivation.`,
                    name: project.project_name,
                });
                continue;
            }
            const assetExists = await this.assetStockSerialsRepo
                .createQueryBuilder('s')
                .where('s.project_id = :projectId', { projectId: id })
                .andWhere('s.is_deleted = 0')
                .andWhere('s.project_id IS NOT NULL')
                .select('1')
                .limit(1)
                .getRawOne();
            if (assetExists) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Project has assigned assets. Cannot deactivate.',
                    name: project.project_name,
                });
                continue;
            }
            projectsToDeactivate.push(project);
            results.push({
                id,
                status: 'success',
                name: project.project_name,
            });
        }
        if (projectsToDeactivate.length > 0) {
            await this.assetsProjectRepo
                .createQueryBuilder()
                .update()
                .set({
                is_active: 0,
                updated_at: new Date(),
            })
                .where('project_id IN (:...ids)', {
                ids: projectsToDeactivate.map((p) => p.project_id),
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Project ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} projects marked as inactive.`;
        }
        else {
            message = 'No projects were marked as inactive.';
        }
        console.log('REDIS UPDATE:PROJECT-DEACTIVE');
        await this.redisService.delByPattern('organization-projects:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async generateProjectImportTemplate() {
        try {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name("Project_Template");
            const instructions = [
                "Instructions:",
                "1. Fill in the project details starting from row 7.",
                "2. Do not edit the header row (Row 6).",
                "3. Project Name is mandatory.",
            ];
            instructions.forEach((text, idx) => {
                mainSheet
                    .cell(idx + 1, 1)
                    .value(text)
                    .style({ bold: true, fontColor: "0000FF" });
            });
            const headers = [
                { label: "Project Name", required: true },
            ];
            const columnWidths = [35];
            columnWidths.forEach((width, index) => {
                mainSheet.column(index + 1).width(width);
            });
            headers.forEach((item, index) => {
                const cell = mainSheet.cell(6, index + 1);
                cell.value(item.label).style({ bold: true });
                if (item.required) {
                    cell.style({ fill: "FFCCCC" });
                }
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error("Error generating project template:", error);
            throw new Error("Failed to generate project template");
        }
    }
    async bulkCreateProjects(dtos, organization_Id, decrypted_system_user_id) {
        const successProjects = [];
        const errorProjects = [];
        if (!organization_Id || isNaN(organization_Id)) {
            throw new Error('Invalid organization ID');
        }
        const userId = decrypted_system_user_id;
        const projectImportSchema = [
            { key: 'project_name', label: 'Project Name', required: true },
        ];
        const payloads = dtos.map((dto) => {
            const p = { is_active: 1 };
            projectImportSchema.forEach((col) => {
                p[col.key] = dto[col.key]?.trim?.() ?? null;
                p[`original_${col.key}`] = dto[col.key] ?? null;
            });
            return p;
        });
        const latest = await this.assetsProjectRepo
            .createQueryBuilder('project')
            .select('project.project_id')
            .orderBy('project.project_id', 'DESC')
            .getOne();
        let nextId = latest ? latest.project_id + 1 : 1;
        for (const payload of payloads) {
            if (!payload.project_code) {
                payload.project_code = `PRJ${nextId.toString().padStart(5, '0')}`;
                nextId++;
            }
        }
        const projectNames = payloads
            .map((p) => p.project_name)
            .filter(Boolean);
        const existingProjects = await this.dataSource
            .getRepository(assets_project_entity_1.AssetsProject)
            .createQueryBuilder('project')
            .select(['project.project_name'])
            .where('project.is_deleted = 0')
            .andWhere('project.project_name IN (:...names)', { names: projectNames })
            .getMany();
        const existingNames = new Set(existingProjects.map((p) => p.project_name.toLowerCase()));
        const insertPayloads = [];
        for (const payload of payloads) {
            if (!payload.project_name) {
                errorProjects.push({
                    project_name: payload.original_project_name,
                    project_code: payload.original_project_code || payload.project_code,
                    reason: 'Missing required field: Project Name',
                });
                continue;
            }
            if (existingNames.has(payload.project_name.toLowerCase())) {
                errorProjects.push({
                    project_name: payload.original_project_name,
                    project_code: payload.original_project_code || payload.project_code,
                    reason: 'Project with this name already exists',
                });
                continue;
            }
            insertPayloads.push({
                project_name: payload.project_name,
                project_code: payload.project_code,
                contact_person: payload.contact_person,
                project_email: payload.project_email,
                department_id: payload.department_id,
                created_by: userId,
                is_active: payload.is_active,
                is_deleted: 0,
            });
        }
        if (!insertPayloads.length) {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: 'No projects created.',
                data: { created_count: 0, created_records: [], error_records: errorProjects },
            };
        }
        let savedProjects = [];
        try {
            const result = await this.dataSource
                .createQueryBuilder()
                .insert()
                .into(assets_project_entity_1.AssetsProject)
                .values(insertPayloads)
                .returning('*')
                .execute();
            savedProjects = result.raw;
            successProjects.push(...savedProjects);
        }
        catch (err) {
            console.error('Bulk insert failed:', err);
            throw new Error('Failed to create projects in bulk.');
        }
        try {
            const createdUser = await this.dataSource
                .getRepository('users')
                .findOne({ where: { user_id: userId } });
            const contextData = {
                updatedUser: {
                    first_name: createdUser.first_name,
                    last_name: createdUser.last_name,
                },
                assetStockSerial: { quantity: savedProjects.length },
            };
            const recipients = [];
            if (createdUser?.users_business_email) {
                recipients.push({
                    recipient_type: 'user',
                    recipient_id: String(createdUser.user_id),
                    recipient_email: createdUser.users_business_email,
                });
            }
            await this.notificationHelper.triggerEventNotification({
                eventId: 53,
                contextData,
                recipients,
                meta: { trace_id: `PROJECT_BULK_CREATE_${Date.now()}` },
            });
        }
        catch (err) {
            console.error('Notification error:', err);
        }
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.PROJECT);
        return {
            status: successProjects.length ? common_1.HttpStatus.CREATED : common_1.HttpStatus.CONFLICT,
            message: successProjects.length && errorProjects.length
                ? 'Projects created with some conflicts.'
                : successProjects.length
                    ? 'All projects created successfully.'
                    : 'No projects created.',
            data: {
                created_count: successProjects.length,
                created_records: successProjects,
                error_records: errorProjects,
            },
        };
    }
    async exportProjectsToExcle(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const visibleColumns = dto.visible_columns || {};
            const rangeFilters = dto.range_filters || [];
            const dateBetween = dto.date_between;
            const selectedIds = dto.selectedIds || [];
            const intColumns = ["project_id", "created_by", "department_id", "is_active"];
            const qb = this.assetsProjectRepo
                .createQueryBuilder("project")
                .leftJoin("project.department_info", "department")
                .addSelect((subQ) => subQ
                .select("COUNT(am.mapping_id)")
                .from(asset_mapping_entity_1.AssetMappingRepository, "am")
                .where(`
          am.target_id = project.project_id
          AND am.target_type = :projectType
          AND am.is_deleted = 0
          AND am.is_active = 1
        `), "asset_count")
                .setParameter("projectType", asset_mapping_entity_1.AssignTargetType.PROJECT)
                .addSelect("department.department_id")
                .addSelect("department.department_name")
                .where("project.is_deleted = :deleted", { deleted: 0 });
            if (dto.isSelectAll === true) {
                const excludeIds = dto.excludeIds || [];
                if (excludeIds.length > 0) {
                    qb.andWhere('project.project_id NOT IN (:...excludeIds)', { excludeIds });
                }
            }
            else if (selectedIds.length > 0) {
                qb.andWhere('project.project_id IN (:...selectedIds)', { selectedIds });
            }
            searchArray.forEach((s, i) => {
                if (!s.values?.length)
                    return;
                const value = s.values.join(" ");
                qb.andWhere(`(
          project.project_name ILIKE :s${i} OR
          project.project_code ILIKE :s${i} OR
          project.contact_person ILIKE :s${i} OR
          project.project_email ILIKE :s${i} OR
          CAST(project.project_id AS TEXT) ILIKE :s${i}
        )`, { [`s${i}`]: `%${value}%` });
            });
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                const isInt = intColumns.includes(f.column);
                const values = f.values.map((v) => (isInt ? Number(v) : v));
                if (f.column === "is_active") {
                    qb.andWhere(`project.is_active IN (:...activeVals)`, {
                        activeVals: values,
                    });
                    continue;
                }
                if (isInt) {
                    qb.andWhere(`project.${f.column} IN (:...${f.column})`, {
                        [f.column]: values,
                    });
                }
                else {
                    qb.andWhere(new typeorm_2.Brackets((qb2) => {
                        values.forEach((val, i) => {
                            qb2.orWhere(`project.${f.column} ILIKE :${f.column}_${i}`, {
                                [`${f.column}_${i}`]: `%${val}%`,
                            });
                        });
                    }));
                }
            }
            if (dateBetween?.column && dateBetween?.date) {
                const [colStart, colEnd] = dateBetween.column
                    .split(",")
                    .map((c) => c.trim());
                const selectedDate = new Date(dateBetween.date);
                const start = new Date(selectedDate.setHours(0, 0, 0, 0));
                const end = new Date(selectedDate.setHours(23, 59, 59, 999));
                qb.andWhere(`(project.${colStart} BETWEEN :start AND :end OR project.${colEnd} BETWEEN :start AND :end)`, { start, end });
            }
            for (const rf of rangeFilters) {
                if (rf.from !== undefined) {
                    qb.andWhere(`project.${rf.column} >= :from_${rf.column}`, {
                        [`from_${rf.column}`]: rf.from,
                    });
                }
                if (rf.to !== undefined) {
                    qb.andWhere(`project.${rf.column} <= :to_${rf.column}`, {
                        [`to_${rf.column}`]: rf.to,
                    });
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(`project.${s.column}`, s.order?.toUpperCase() === "DESC" ? "DESC" : "ASC");
                });
            }
            else {
                qb.addOrderBy("project.project_id", "DESC");
            }
            const total = await qb.clone().getCount();
            const { raw, entities } = await qb.getRawAndEntities();
            const data = entities.map((item, i) => ({
                ...item,
                asset_count: Number(raw[i]?.asset_count || 0),
            }));
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Projects');
            const headers = [
                'Sr. No.',
                'Project ID',
                'Project Name',
                'Alloted Assets',
                'Created On',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((project, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(project.project_code ?? '--');
                sheet.cell(row, 3).value(project.project_name ?? '--');
                sheet.cell(row, 4).value(project.asset_count);
                sheet.cell(row, 5).value(project.created_at ? new Date(project.created_at).toLocaleDateString() : '--');
                sheet.cell(row, 6).value(project.is_active ? 'Active' : 'Inactive');
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(headers[i].length + 10);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error("getAllProjects2 ERROR:", error);
            throw error;
        }
    }
    async getUserIdByRegisterLoginId(registerUserLoginId) {
        const user = await this.userRepository.findOne({
            where: {
                register_user_login_id: registerUserLoginId,
                is_deleted: 0,
                is_active: 1,
            },
            select: ['user_id'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.user_id;
    }
    async resolveBulkSelectionIds(dto) {
        const searchArray = dto.search || [];
        const filters = dto.filters || [];
        const dateBetween = dto.date_between;
        const selectedIds = dto.selectedIds || dto.ids || [];
        if (dto.isSelectAll !== true) {
            return selectedIds;
        }
        const intColumns = ["project_id", "created_by", "department_id", "is_active"];
        const qb = this.assetsProjectRepo
            .createQueryBuilder("project")
            .select(["project.project_id"])
            .where("project.is_deleted = :deleted", { deleted: 0 });
        const excludeIds = dto.excludeIds || [];
        if (excludeIds.length > 0) {
            qb.andWhere('project.project_id NOT IN (:...excludeIds)', { excludeIds });
        }
        searchArray.forEach((s, i) => {
            if (!s.values?.length)
                return;
            const value = s.values.join(" ");
            qb.andWhere(`(
          project.project_name ILIKE :s${i} OR
          project.project_code ILIKE :s${i} OR
          project.contact_person ILIKE :s${i} OR
          project.project_email ILIKE :s${i} OR
          CAST(project.project_id AS TEXT) ILIKE :s${i}
        )`, { [`s${i}`]: `%${value}%` });
        });
        for (const f of filters) {
            if (!f.values?.length)
                continue;
            const isInt = intColumns.includes(f.column);
            const values = f.values.map((v) => (isInt ? Number(v) : v));
            if (f.column === "is_active") {
                qb.andWhere(`project.is_active IN (:...activeVals)`, {
                    activeVals: values,
                });
                continue;
            }
            if (isInt) {
                qb.andWhere(`project.${f.column} IN (:...${f.column})`, {
                    [f.column]: values,
                });
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((qb2) => {
                    values.forEach((val, i) => {
                        qb2.orWhere(`project.${f.column} ILIKE :${f.column}_${i}`, {
                            [`${f.column}_${i}`]: `%${val}%`,
                        });
                    });
                }));
            }
        }
        if (dateBetween?.column && dateBetween?.date) {
            const [colStart, colEnd] = dateBetween.column
                .split(",")
                .map((c) => c.trim());
            const selectedDate = new Date(dateBetween.date);
            const start = new Date(selectedDate.setHours(0, 0, 0, 0));
            const end = new Date(selectedDate.setHours(23, 59, 59, 999));
            qb.andWhere(`(project.${colStart} <= :end AND project.${colEnd} >= :start)`, { start, end });
        }
        const results = await qb.getMany();
        return results.map(r => r.project_id);
    }
};
exports.AssetsProjectsService = AssetsProjectsService;
exports.AssetsProjectsService = AssetsProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(assets_project_entity_1.AssetsProject)),
    __param(5, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(7, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        entity_lookup_service_1.EntityLookupService,
        notifications_helper_1.NotificationHelper,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        dropdown_cache_service_1.DropdownCacheService])
], AssetsProjectsService);
