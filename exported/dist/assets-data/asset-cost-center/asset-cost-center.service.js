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
exports.AssetCostCenterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
const redis_service_1 = require("../../common/redis/redis.service");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const cache_service_helper_1 = require("../../utils/cache-service-helper");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const cost_center_asset_counts_view_1 = require("./cost-center-asset-counts.view");
const asset_cost_center_entity_1 = require("./entities/asset-cost-center.entity");
let AssetCostCenterService = class AssetCostCenterService {
    constructor(assetCostCenterRepo, departmentRepo, assetStockSerialsRepository, assetMappingRepository, userRepository, notificationHelper, redisService, dropdownCache) {
        this.assetCostCenterRepo = assetCostCenterRepo;
        this.departmentRepo = departmentRepo;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.assetMappingRepository = assetMappingRepository;
        this.userRepository = userRepository;
        this.notificationHelper = notificationHelper;
        this.redisService = redisService;
        this.dropdownCache = dropdownCache;
    }
    async resolveBulkSelectionIds(dto) {
        const searchArray = dto.search || [];
        const filters = dto.filters || [];
        const dateBetween = dto.date_between;
        const selectedIds = dto.selectedIds || dto.ids || [];
        if (dto.isSelectAll !== true) {
            return selectedIds;
        }
        const intColumns = ["cost_center_id", "created_by", "department_id", "is_active"];
        const qb = this.assetCostCenterRepo
            .createQueryBuilder("cost_center")
            .select(["cost_center.cost_center_id"])
            .where("cost_center.is_deleted = :deleted", { deleted: 0 });
        const excludeIds = dto.excludeIds || [];
        if (excludeIds.length > 0) {
            qb.andWhere('cost_center.cost_center_id NOT IN (:...excludeIds)', { excludeIds });
        }
        searchArray.forEach((s, i) => {
            if (!s.values?.length)
                return;
            const value = s.values.join(" ");
            qb.andWhere(`(
          cost_center.cost_center_name ILIKE :s${i} OR
          cost_center.cost_center_code ILIKE :s${i} OR
          cost_center.cost_center_contact_person ILIKE :s${i} OR
          cost_center.cost_center_email ILIKE :s${i} OR
          CAST(cost_center.cost_center_id AS TEXT) ILIKE :s${i}
        )`, { [`s${i}`]: `%${value}%` });
        });
        for (const f of filters) {
            if (!f.values?.length)
                continue;
            const isInt = intColumns.includes(f.column);
            const values = f.values.map((v) => (isInt ? Number(v) : v));
            if (f.column === "is_active") {
                qb.andWhere(`cost_center.is_active IN (:...activeVals)`, {
                    activeVals: values,
                });
                continue;
            }
            if (isInt) {
                qb.andWhere(`cost_center.${f.column} IN (:...${f.column})`, {
                    [f.column]: values,
                });
            }
            else {
                qb.andWhere(new typeorm_2.Brackets((qb2) => {
                    values.forEach((val, i) => {
                        qb2.orWhere(`cost_center.${f.column} ILIKE :${f.column}_${i}`, {
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
            qb.andWhere(`(cost_center.${colStart} <= :end AND cost_center.${colEnd} >= :start)`, { start, end });
        }
        const results = await qb.getMany();
        return results.map(r => r.cost_center_id);
    }
    async getAllCostCenterIdsForFilters(filters, excludeIds = []) {
        const qb = this.assetCostCenterRepo
            .createQueryBuilder('cost_center')
            .select('cost_center.cost_center_id')
            .where('cost_center.is_deleted = :deleted', { deleted: 0 });
        if (filters?.is_active && filters.is_active.length > 0) {
            qb.andWhere('cost_center.is_active IN (:...activeVals)', {
                activeVals: filters.is_active.map(Number),
            });
        }
        if (filters?.searchQuery) {
            qb.andWhere(`(cost_center.cost_center_name ILIKE :search OR 
        cost_center.cost_center_code ILIKE :search OR 
        CAST(cost_center.cost_center_id AS TEXT) ILIKE :search)`, { search: `%${filters.searchQuery}%` });
        }
        if (excludeIds.length > 0) {
            qb.andWhere('cost_center.cost_center_id NOT IN (:...excludeIds)', { excludeIds });
        }
        const results = await qb.getMany();
        return results.map(r => r.cost_center_id);
    }
    async getAllCostCenter2(dto, branchIds = []) {
        console.time('GET_ALL_COST_CENTERS_TOTAL');
        try {
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filtersArray = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            console.timeEnd('INPUT');
            console.time('CACHE_KEY');
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'organization-cost-centers',
                dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id
            });
            console.log(cacheKey);
            console.time('REDIS-GET');
            const cached = await this.redisService.get(cacheKey);
            console.timeEnd('REDIS-GET');
            if (cached) {
                console.log('REDIS HIT');
                return cached;
            }
            console.log('REDIS MISS');
            console.timeEnd('CACHE_KEY');
            console.time('QUERY_BUILDER');
            const intColumns = ['cost_center_id', 'created_by', 'department_id', 'is_active'];
            const buildBaseQuery = (qb) => {
                return qb
                    .select([
                    'cost_center.cost_center_id',
                    'cost_center.cost_center_name',
                    'cost_center.cost_center_code',
                    'cost_center.cost_center_contact_person',
                    'cost_center.cost_center_email',
                    'cost_center.is_active',
                    'cost_center.created_at',
                    'department.department_id',
                    'department.department_name',
                ])
                    .leftJoin('cost_center.department_info', 'department')
                    .leftJoin(cost_center_asset_counts_view_1.CostCenterAssetCountsView, 'cc_counts', 'cc_counts.cost_center_id = cost_center.cost_center_id')
                    .addSelect('COALESCE(cc_counts.asset_count, 0)', 'asset_count')
                    .where('cost_center.is_deleted = :deleted', { deleted: 0 });
            };
            console.timeEnd('QUERY_BUILDER');
            console.time('SEARCH_FILTERS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, i) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                    qb.andWhere(`(cost_center.cost_center_name ILIKE :s${i}
          OR cost_center.cost_center_code ILIKE :s${i}
          OR cost_center.cost_center_contact_person ILIKE :s${i}
          OR cost_center.cost_center_email ILIKE :s${i}
          OR CAST(cost_center.cost_center_id AS TEXT) ILIKE :s${i})`, { [`s${i}`]: `%${value}%` });
                });
                const filters = {};
                filtersArray.forEach((f) => {
                    filters[f.column] = f.values || [];
                });
                if (filters.is_active?.length) {
                    qb.andWhere('cost_center.is_active IN (:...activeVals)', {
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
                        qb.andWhere(`cost_center.${key} IN (:...${key})`, { [key]: values });
                    }
                    else {
                        qb.andWhere(new typeorm_2.Brackets((qb2) => {
                            values.forEach((val, idx) => {
                                qb2.orWhere(`cost_center.${key} ILIKE :${key}_${idx}`, {
                                    [`${key}_${idx}`]: `%${val}%`,
                                });
                            });
                        }));
                    }
                });
                if (branchIds && branchIds.length > 0) {
                    const validBranchIds = branchIds.filter(id => id > 0);
                    if (validBranchIds.length > 0) {
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'organization-cost-centers-count:' +
                JSON.stringify({ search: searchArray, filters: filtersArray, branchIds });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = this.assetCostCenterRepo
                    .createQueryBuilder('cost_center')
                    .leftJoin('cost_center.department_info', 'department')
                    .where('cost_center.is_deleted = :deleted', { deleted: 0 });
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetCostCenterRepo.createQueryBuilder('cost_center'));
            applySearchAndFilters(qb);
            const sortableMap = {
                cost_center_id: 'cost_center.cost_center_id',
                cost_center_name: 'cost_center.cost_center_name',
                cost_center_code: 'cost_center.cost_center_code',
                cost_center_contact_person: 'cost_center.cost_center_contact_person',
                cost_center_email: 'cost_center.cost_center_email',
                is_active: 'cost_center.is_active',
                created_at: 'cost_center.created_at',
                department_name: 'department.department_name',
                asset_count: 'cc_counts.asset_count',
            };
            const idColumn = 'cost_center_id';
            const idDbColumn = 'cost_center.cost_center_id';
            const defaultSort = { column: 'cost_center_id', order: 'DESC' };
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
                        ? 'Cost Centers fetched successfully'
                        : 'No Cost Centers found',
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
                console.timeEnd('GET_ALL_COST_CENTERS_TOTAL');
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
                    ? 'Cost centers fetched successfully'
                    : 'No cost centers found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            await this.redisService.set(cacheKey, response, 300);
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_ALL_COST_CENTERS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_COST_CENTERS_TOTAL');
            console.error('getAllCostCenter2 ERROR:', error);
            throw error;
        }
    }
    async getCostCentersForDropdown() {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.COST_CENTER, null, async () => {
            try {
                const data = await this.assetCostCenterRepo.find({
                    where: { is_deleted: 0, is_active: 1 },
                    select: ['cost_center_id', 'cost_center_name'],
                    order: { cost_center_name: 'ASC' },
                });
                return {
                    status: 'success',
                    message: 'Cost centers for dropdown retrieved successfully.',
                    data,
                };
            }
            catch (error) {
                throw new common_1.BadRequestException(`Error fetching dropdown cost centers: ${error.message}`);
            }
        });
    }
    async generateNextCode() {
        const latest = await this.assetCostCenterRepo
            .createQueryBuilder('cc')
            .select('cc.cost_center_id')
            .orderBy('cc.cost_center_id', 'DESC')
            .getOne();
        const nextId = latest ? latest.cost_center_id + 1 : 1;
        return `CC${nextId.toString().padStart(5, '0')}`;
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
    async createNewCostCenter(payload, createdBy) {
        console.log("createdBy", createdBy);
        const existingCostCenter = await this.assetCostCenterRepo.findOne({
            where: [
                {
                    cost_center_code: payload.cost_center_code,
                    is_deleted: 0,
                },
                {
                    cost_center_name: (0, typeorm_2.ILike)(payload.cost_center_name),
                    is_deleted: 0,
                },
            ],
        });
        if (existingCostCenter) {
            return {
                status: 409,
                success: false,
                message: 'Cost center with this code or name already exists',
                data: null,
            };
        }
        const newCostCenter = this.assetCostCenterRepo.create({
            cost_center_name: payload.cost_center_name,
            cost_center_code: payload.cost_center_code,
            cost_center_contact_person: payload.cost_center_contact_person || null,
            cost_center_email: payload.cost_center_email || null,
            department_id: payload.department_id || null,
            cost_center_manger_name_id: payload.cost_center_manger_name_id || null,
            cost_center_budget: payload.cost_center_budget || 0,
            cost_center_spent: payload.cost_center_spent || 0,
            cost_center_utilization: payload.cost_center_utilization || null,
            created_by: createdBy || null,
            is_active: payload.is_active ?? 1,
            is_deleted: 0,
        });
        const savedCostCenter = await this.assetCostCenterRepo.save(newCostCenter);
        const COST_CENTER_CREATION_EVENT_ID = 46;
        const createdUser = await this.userRepository.findOne({
            where: { user_id: createdBy },
        });
        const contextData = {
            costCenter: {
                cost_center_name: savedCostCenter.cost_center_name,
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
            eventId: COST_CENTER_CREATION_EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: `COST_CENTER_CREATE_${savedCostCenter.cost_center_id}`,
            },
        });
        console.log('REDIS UPDATE:COSTCENTER-ADD');
        await this.redisService.delByPattern('organization-cost-centers:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
        return {
            status: 201,
            success: true,
            message: 'Cost center created successfully',
            data: savedCostCenter,
        };
    }
    async updateCostCenterById(payload, user_id) {
        const { cost_center_id, cost_center_name, cost_center_code, cost_center_contact_person, cost_center_email, department_id, cost_center_manger_name_id, cost_center_budget, cost_center_spent, cost_center_utilization, is_active } = payload;
        if (!cost_center_id) {
            return {
                status: 400,
                success: false,
                message: "Cost center ID is required to update a cost center.",
            };
        }
        const existingCostCenter = await this.assetCostCenterRepo.findOne({
            where: { cost_center_id, is_deleted: 0 },
        });
        if (!existingCostCenter) {
            return {
                status: 404,
                success: false,
                message: `Cost center with ID ${cost_center_id} not found or deleted.`,
            };
        }
        if (cost_center_code && cost_center_code !== existingCostCenter.cost_center_code) {
            const codeExists = await this.assetCostCenterRepo.findOne({
                where: {
                    cost_center_code,
                    is_deleted: 0,
                    cost_center_id: (0, typeorm_2.Not)(cost_center_id),
                },
            });
            if (codeExists) {
                return {
                    status: 409,
                    success: false,
                    message: 'Cost center code already exists',
                    data: null,
                };
            }
        }
        if (cost_center_name && cost_center_name !== existingCostCenter.cost_center_name) {
            const nameExists = await this.assetCostCenterRepo.findOne({
                where: {
                    cost_center_name: (0, typeorm_2.ILike)(cost_center_name),
                    is_deleted: 0,
                    cost_center_id: (0, typeorm_2.Not)(cost_center_id),
                },
            });
            if (nameExists) {
                return {
                    status: 409,
                    success: false,
                    message: 'Cost center name already exists',
                    data: null,
                };
            }
        }
        existingCostCenter.cost_center_name =
            cost_center_name ?? existingCostCenter.cost_center_name;
        existingCostCenter.cost_center_code =
            cost_center_code ?? existingCostCenter.cost_center_code;
        existingCostCenter.cost_center_contact_person =
            cost_center_contact_person ?? existingCostCenter.cost_center_contact_person;
        existingCostCenter.cost_center_email =
            cost_center_email ?? existingCostCenter.cost_center_email;
        existingCostCenter.department_id =
            department_id ?? existingCostCenter.department_id;
        existingCostCenter.cost_center_manger_name_id =
            cost_center_manger_name_id ?? existingCostCenter.cost_center_manger_name_id;
        existingCostCenter.cost_center_budget =
            cost_center_budget ?? existingCostCenter.cost_center_budget;
        existingCostCenter.cost_center_spent =
            cost_center_spent ?? existingCostCenter.cost_center_spent;
        existingCostCenter.cost_center_utilization =
            cost_center_utilization ?? existingCostCenter.cost_center_utilization;
        existingCostCenter.is_active =
            typeof is_active !== "undefined" ? is_active : existingCostCenter.is_active;
        existingCostCenter.updated_at = new Date();
        await this.assetCostCenterRepo.save(existingCostCenter);
        console.log('REDIS UPDATE:COSTCENTER-UPDATE');
        await this.redisService.delByPattern('organization-cost-centers:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
        return {
            status: 200,
            success: true,
            message: "Cost center updated successfully",
            data: existingCostCenter,
        };
    }
    async getCostCenterById(cost_center_id) {
        const costCenter = await this.assetCostCenterRepo.findOne({
            where: { cost_center_id, is_deleted: 0 },
            relations: ['department_info'],
        });
        if (!costCenter)
            return null;
        return {
            cost_center_id: costCenter.cost_center_id,
            cost_center_name: costCenter.cost_center_name,
            cost_center_code: costCenter.cost_center_code,
            cost_center_contact_person: costCenter.cost_center_contact_person,
            cost_center_email: costCenter.cost_center_email,
            department_id: costCenter.department_id,
            department_name: costCenter.department_info?.department_name || null,
            cost_center_manger_name_id: costCenter.cost_center_manger_name_id,
            cost_center_budget: costCenter.cost_center_budget,
            cost_center_spent: costCenter.cost_center_spent,
            cost_center_utilization: costCenter.cost_center_utilization,
            is_active: costCenter.is_active,
            created_at: costCenter.created_at,
        };
    }
    async activateCostCenters(dto, systemUserId) {
        const costCenterIds = await this.resolveBulkSelectionIds(dto);
        if (!costCenterIds || costCenterIds.length === 0) {
            return {
                success: false,
                message: 'No cost centers found to activate',
                details: [],
            };
        }
        const results = [];
        const costCentersToActivate = [];
        for (const id of costCenterIds) {
            const costCenter = await this.assetCostCenterRepo.findOne({
                where: { cost_center_id: id, is_deleted: 0 },
            });
            if (!costCenter) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Cost center not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (costCenter.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Cost center is already active.',
                    name: costCenter.cost_center_name,
                });
                continue;
            }
            costCentersToActivate.push(costCenter);
            results.push({
                id,
                status: 'success',
                name: costCenter.cost_center_name,
            });
        }
        if (costCentersToActivate.length > 0) {
            await this.assetCostCenterRepo
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('cost_center_id IN (:...ids)', {
                ids: costCentersToActivate.map((c) => c.cost_center_id),
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Cost center ${successful[0].name} marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} cost centers marked as active.`;
        }
        else {
            message = 'No cost centers were marked as active.';
        }
        await this.redisService.delByPattern('organization-cost-centers:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateCostCenters(dto, systemUserId) {
        const costCenterIds = await this.resolveBulkSelectionIds(dto);
        if (!costCenterIds || costCenterIds.length === 0) {
            return {
                success: false,
                message: 'No cost centers found to deactivate',
                details: [],
            };
        }
        const results = [];
        const costCenters = await this.assetCostCenterRepo.find({
            where: {
                cost_center_id: (0, typeorm_2.In)(costCenterIds),
                is_deleted: 0,
            },
        });
        const costCenterMap = new Map(costCenters.map((cc) => [cc.cost_center_id, cc]));
        const assignedCounts = await this.assetStockSerialsRepository
            .createQueryBuilder('serial')
            .select('serial.cost_center_id', 'cost_center_id')
            .addSelect('COUNT(*)', 'count')
            .where('serial.cost_center_id IN (:...ids)', { ids: costCenterIds })
            .andWhere('serial.is_deleted = 0')
            .andWhere('serial.is_active = 1')
            .groupBy('serial.cost_center_id')
            .getRawMany();
        const assignedMap = new Map();
        assignedCounts.forEach((row) => {
            assignedMap.set(Number(row.cost_center_id), Number(row.count));
        });
        const costCentersToDeactivate = [];
        for (const id of costCenterIds) {
            const costCenter = costCenterMap.get(id);
            if (!costCenter) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Cost center not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (!costCenter.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Cost center is already inactive.',
                    name: costCenter.cost_center_name,
                });
                continue;
            }
            const assignedCount = assignedMap.get(id) || 0;
            if (assignedCount > 0) {
                results.push({
                    id,
                    status: 'failed',
                    message: `Cost center has ${assignedCount} assigned asset(s). Please unassign assets before deactivation.`,
                    name: costCenter.cost_center_name,
                });
                continue;
            }
            costCentersToDeactivate.push(id);
            results.push({
                id,
                status: 'success',
                name: costCenter.cost_center_name,
            });
        }
        if (costCentersToDeactivate.length > 0) {
            await this.assetCostCenterRepo
                .createQueryBuilder()
                .update()
                .set({
                is_active: 0,
                updated_at: new Date(),
            })
                .where('cost_center_id IN (:...ids)', {
                ids: costCentersToDeactivate,
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Cost center ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} cost centers marked as inactive.`;
        }
        else {
            message = 'No cost centers were marked as inactive.';
        }
        await this.redisService.delByPattern('organization-cost-centers:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deleteCostCenters(dto) {
        const idsToDelete = await this.resolveBulkSelectionIds(dto);
        if (!idsToDelete || idsToDelete.length === 0) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'No cost centers found to delete',
                data: { deleted: [], failed: [] },
            };
        }
        const deletedCostCenters = [];
        const failedCostCenters = [];
        for (const cost_center_id of idsToDelete) {
            try {
                const existingCostCenter = await this.assetCostCenterRepo.findOne({
                    where: { cost_center_id },
                });
                if (!existingCostCenter) {
                    failedCostCenters.push({
                        cost_center_id,
                        message: `Cost center with ID ${cost_center_id} not found`,
                    });
                    continue;
                }
                existingCostCenter.is_active = 0;
                existingCostCenter.is_deleted = 1;
                await this.assetCostCenterRepo.save(existingCostCenter);
                deletedCostCenters.push({
                    cost_center_id,
                    message: `Cost center with ID ${cost_center_id} deleted successfully`,
                });
            }
            catch (error) {
                failedCostCenters.push({
                    cost_center_id,
                    message: `Error deleting cost center ID ${cost_center_id}`,
                });
            }
        }
        await this.redisService.delByPattern('organization-cost-centers:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
        return {
            status: common_1.HttpStatus.OK,
            success: true,
            message: 'Bulk cost center delete operation completed.',
            data: {
                deleted: deletedCostCenters,
                failed: failedCostCenters,
            },
        };
    }
    async exportCostCentersToExcel(dto) {
        try {
            const { search = [], filters = [], sort = [], visible_columns = {}, range_filters = [], date_between = null, selectedIds = [], isSelectAll = false, excludeIds = [], } = dto;
            let idsToExport = selectedIds;
            if (isSelectAll) {
                const filterObj = {};
                filters.forEach((f) => {
                    filterObj[f.column] = f.values || [];
                });
                let searchQuery = '';
                search.forEach((s) => {
                    if (s.values?.length) {
                        searchQuery = s.values.join(' ');
                    }
                });
                idsToExport = await this.getAllCostCenterIdsForFilters({
                    is_active: filterObj.is_active || [],
                    searchQuery,
                }, excludeIds);
            }
            if (!idsToExport || idsToExport.length === 0) {
                const workbook = await XlsxPopulate.fromBlankAsync();
                const sheet = workbook.sheet(0);
                sheet.name('Cost Centers');
                sheet.cell(1, 1).value('No data to export');
                return await workbook.outputAsync();
            }
            const qb = this.assetCostCenterRepo
                .createQueryBuilder('asset_cost_centers')
                .leftJoinAndSelect('asset_cost_centers.department_info', 'department')
                .where('asset_cost_centers.is_deleted = :deleted', { deleted: 0 })
                .andWhere('asset_cost_centers.cost_center_id IN (:...idsToExport)', { idsToExport })
                .addSelect((subQ) => subQ
                .select('COUNT(serial.asset_stocks_unique_id)')
                .from(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                .where(`
              serial.cost_center_id = asset_cost_centers.cost_center_id
              AND serial.is_deleted = 0
              AND serial.is_active = 1
            `), 'asset_count');
            if (sort && sort.length > 0) {
                sort.forEach((s) => {
                    qb.addOrderBy(`asset_cost_centers.${s.column}`, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.orderBy('asset_cost_centers.cost_center_id', 'DESC');
            }
            const { raw, entities } = await qb.getRawAndEntities();
            const data = entities.map((item, idx) => ({
                ...item,
                asset_count: Number(raw[idx]?.asset_count || 0),
            }));
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Cost Centers');
            const headers = [
                'Sr No',
                'Cost Center Code',
                'Name',
                'Allotted Assets',
                'Created On',
                'Status',
            ];
            headers.forEach((header, idx) => sheet.cell(1, idx + 1).value(header).style({ bold: true }));
            data.forEach((c, idx) => {
                const row = idx + 2;
                sheet.cell(row, 1).value(idx + 1);
                sheet.cell(row, 2).value(c.cost_center_code ?? '--');
                sheet.cell(row, 3).value(c.cost_center_name ?? '--');
                sheet.cell(row, 4).value(c.asset_count ?? 0);
                sheet.cell(row, 5).value(c.created_at ? new Date(c.created_at).toLocaleDateString() : '--');
                sheet.cell(row, 6).value(c.is_active ? 'Active' : 'Inactive');
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(headers[i].length + 12);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Export Error:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async generateCostCenterTemplate() {
        try {
            console.log("🔹 Generating Bulk Cost Center Template...");
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name("Cost_Center_Template");
            const dataSheet = workbook.addSheet("Data");
            const instructions = [
                "Instructions:",
                "1. Fill in all required fields starting from row 8.",
                "2. Do NOT modify the header row (Row 7).",
                "3. Cost Center Name is mandatory.",
            ];
            instructions.forEach((text, i) => {
                mainSheet
                    .cell(i + 1, 1)
                    .value(text)
                    .style({ bold: true, fontColor: "0000FF" });
            });
            const headers = [
                { label: "Cost Center Name", required: true },
            ];
            const columnWidths = [30];
            columnWidths.forEach((w, i) => mainSheet.column(i + 1).width(w));
            headers.forEach((item, index) => {
                const cell = mainSheet.cell(7, index + 1);
                cell.value(item.label).style({ bold: true });
                if (item.required) {
                    cell.style({ fill: "FFCCCC" });
                }
            });
            const startRow = 8;
            const maxRow = 5000;
            dataSheet.hidden(true);
            return await workbook.outputAsync();
        }
        catch (err) {
            console.error("❌ Error generating cost center template:", err);
            throw new Error("Failed to generate Excel cost center template");
        }
    }
    async bulkCreateCostCenters(dtos, organization_Id, userId) {
        if (!organization_Id || isNaN(organization_Id)) {
            throw new Error("Invalid organization ID");
        }
        const successCostCenters = [];
        const errorCostCenters = [];
        const trimString = (val) => (val != null ? String(val).trim() : null);
        const names = dtos.map(d => trimString(d.cost_center_name)).filter(Boolean);
        console.log("point:1");
        const existingCenters = await this.assetCostCenterRepo
            .createQueryBuilder("cc")
            .where("cc.cost_center_name IN (:...names) AND cc.is_deleted = 0", { names })
            .getMany();
        const existingNames = new Set(existingCenters.map(c => c.cost_center_name));
        const latest = await this.assetCostCenterRepo
            .createQueryBuilder("cc")
            .select("cc.cost_center_id")
            .orderBy("cc.cost_center_id", "DESC")
            .getOne();
        let nextId = latest ? Number(latest.cost_center_id) + 1 : 1;
        const payloads = [];
        let count = 0;
        dtos.forEach((dto) => {
            count++;
            const name = trimString(dto.cost_center_name);
            if (!name) {
                errorCostCenters.push({
                    ...dto,
                    reason: "Missing required field: Cost Center Name",
                });
                return;
            }
            if (existingNames.has(name)) {
                errorCostCenters.push({
                    ...dto,
                    reason: `Cost center name '${name}' already exists.`,
                });
                return;
            }
            const generatedCode = `CC${String(nextId++).padStart(5, "0")}`;
            payloads.push({
                cost_center_name: name,
                cost_center_code: generatedCode,
                cost_center_contact_person: null,
                cost_center_email: null,
                department_id: null,
                cost_center_manger_name_id: null,
                cost_center_budget: 0,
                cost_center_spent: 0,
                cost_center_utilization: null,
                created_by: userId,
                updated_by: null,
                is_active: 1,
                is_deleted: 0,
            });
        });
        let insertedCenters = [];
        console.log("point:3");
        if (payloads.length > 0) {
            const result = await this.assetCostCenterRepo.createQueryBuilder()
                .insert()
                .into(asset_cost_center_entity_1.AssetCostCenter)
                .values(payloads)
                .returning("*")
                .execute();
            insertedCenters = result.raw;
            const successMapped = insertedCenters.map(cc => ({
                cost_center_name: cc.cost_center_name,
            }));
            successCostCenters.push(...successMapped);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.COST_CENTER);
            await this.redisService.delByPattern('organization-cost-centers:*');
        }
        const COST_CENTER_CREATION_EVENT_ID = 54;
        const createdUser = await this.userRepository
            .createQueryBuilder("users")
            .where("users.user_id = :userId", { userId })
            .getOne();
        const contextData = {
            updatedUser: {
                first_name: createdUser?.first_name,
                last_name: createdUser?.last_name,
            },
            assetStockSerial: {
                quantity: count,
            },
        };
        const recipients = [];
        if (createdUser?.users_business_email) {
            recipients.push({
                recipient_type: "user",
                recipient_id: String(createdUser.user_id),
                recipient_email: createdUser.users_business_email,
            });
        }
        await this.notificationHelper.triggerEventNotification({
            eventId: COST_CENTER_CREATION_EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: String(count),
            },
        });
        return {
            status: successCostCenters.length
                ? common_1.HttpStatus.CREATED
                : common_1.HttpStatus.CONFLICT,
            message: successCostCenters.length && errorCostCenters.length
                ? "Cost centers created with some conflicts."
                : successCostCenters.length
                    ? "All cost centers created successfully."
                    : "No cost centers created.",
            data: {
                created_count: successCostCenters.length,
                created_records: successCostCenters,
                error_records: errorCostCenters,
            },
        };
    }
};
exports.AssetCostCenterService = AssetCostCenterService;
exports.AssetCostCenterService = AssetCostCenterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_cost_center_entity_1.AssetCostCenter)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(2, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(3, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_helper_1.NotificationHelper,
        redis_service_1.RedisService,
        dropdown_cache_service_1.DropdownCacheService])
], AssetCostCenterService);
