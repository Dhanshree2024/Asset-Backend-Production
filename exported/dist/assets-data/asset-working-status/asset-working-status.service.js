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
exports.AssetWorkingStatusService = void 0;
const common_1 = require("@nestjs/common");
const asset_working_status_entity_1 = require("./entities/asset-working-status.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const redis_service_1 = require("../../common/redis/redis.service");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
let AssetWorkingStatusService = class AssetWorkingStatusService {
    constructor(dataSource, assetWorkingStatusRepository, redisService, dropdownCache) {
        this.dataSource = dataSource;
        this.assetWorkingStatusRepository = assetWorkingStatusRepository;
        this.redisService = redisService;
        this.dropdownCache = dropdownCache;
    }
    async createNewAssetWorkingStatus(dto) {
        const existingStatus = await this.assetWorkingStatusRepository.findOne({
            where: { working_status_type_name: dto.working_status_type_name },
        });
        if (existingStatus) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.CONFLICT, message: `Working status '${dto.working_status_type_name}' already exists` }, common_1.HttpStatus.CONFLICT);
        }
        const newStatus = this.assetWorkingStatusRepository.create({
            working_status_type_name: dto.working_status_type_name,
            working_status_color: dto.working_status_color,
            working_status_description: dto.working_status_description,
            status_category: dto.status_category,
            status_for_category: dto.status_for_category,
            created_by: dto.created_by,
            is_active: 1,
            is_deleted: 0,
            created_at: new Date()
        });
        const savedStatus = await this.assetWorkingStatusRepository.save(newStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Working status created successfully',
            data: {
                status: savedStatus,
            },
        };
    }
    async bulkCreateAssetWorkingStatuses(dtos) {
        const workingStatusNames = dtos.map(dto => dto.working_status_type_name);
        const workingStatusColors = dtos.map(dto => dto.working_status_color);
        const existingStatuses = await this.assetWorkingStatusRepository.find({
            where: [
                { working_status_type_name: (0, typeorm_1.In)(workingStatusNames) },
                { working_status_color: (0, typeorm_1.In)(workingStatusColors) },
            ],
        });
        const existingNameColorMap = new Map();
        existingStatuses.forEach(status => {
            existingNameColorMap.set(status.working_status_type_name, status.working_status_color);
        });
        const alreadyExistEntries = [];
        const nameConflictEntries = [];
        const colorConflictEntries = [];
        const newWorkingStatuses = dtos.filter(dto => {
            const existingColor = existingNameColorMap.get(dto.working_status_type_name);
            if (existingColor !== undefined) {
                if (existingColor === dto.working_status_color) {
                    alreadyExistEntries.push(dto);
                    return false;
                }
                else {
                    nameConflictEntries.push(dto);
                    return false;
                }
            }
            const colorConflict = existingStatuses.find(status => status.working_status_color === dto.working_status_color && status.working_status_type_name !== dto.working_status_type_name);
            if (colorConflict) {
                colorConflictEntries.push(dto);
                return false;
            }
            return true;
        }).map(dto => ({
            working_status_type_name: dto.working_status_type_name,
            working_status_color: dto.working_status_color,
            is_active: 1,
            is_deleted: 0,
        }));
        if (newWorkingStatuses.length === 0) {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: 'No new working statuses created. Conflicts found.',
                data: {
                    created_count: 0,
                    created_statuses: [],
                    already_exist_entries: alreadyExistEntries,
                    name_conflict_entries: nameConflictEntries,
                    color_conflict_entries: colorConflictEntries,
                },
            };
        }
        const savedStatuses = await this.assetWorkingStatusRepository.save(newWorkingStatuses);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Bulk working statuses created successfully with some conflicts.',
            data: {
                created_count: savedStatuses.length,
                created_statuses: savedStatuses,
                already_exist_entries: alreadyExistEntries,
                name_conflict_entries: nameConflictEntries,
                color_conflict_entries: colorConflictEntries,
            },
        };
    }
    async getAllWorkingStatuses2(dto) {
        console.time('GET_ALL_WORKING_STATUSES_TOTAL');
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
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
            const cacheKey = await this.dropdownCache.buildKey(dropdown_entities_1.DROPDOWN.WORKING_STATUS, {
                scope: 'working-statuses-list',
                search: dto.search || [],
                filters: dto.filters || [],
                sort: dto.sort || [],
                cursor: dto.cursor || null,
                page: d.page || null,
                limit,
                jumpToLast,
            });
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.timeEnd('GET_ALL_WORKING_STATUSES_TOTAL');
                return cached;
            }
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                return qb
                    .where('ws.is_deleted = 0')
                    .select([
                    'ws.working_status_type_id AS working_status_type_id',
                    'ws.working_status_type_name AS working_status_type_name',
                    'ws.working_status_color AS working_status_color',
                    'ws.working_status_description AS working_status_description',
                    'ws.is_active AS is_active',
                    'ws.is_deleted AS is_deleted',
                    'ws.is_default AS is_default',
                    'ws.created_at AS created_at',
                    'ws.status_category AS status_category',
                    'ws.status_for_category AS status_for_category',
                    `COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'System') AS created_user`,
                    `COUNT(serial.asset_stocks_unique_id) AS usagecount`,
                ])
                    .leftJoin('asset_stock_serials', 'serial', `
            serial.working_status_type_id = ws.working_status_type_id
            AND serial.is_deleted = 0
          `)
                    .leftJoin(organizational_user_entity_1.User, 'u', 'u.user_id = ws.created_by')
                    .groupBy(`
          ws.working_status_type_id,
          ws.working_status_type_name,
          ws.working_status_color,
          ws.working_status_description,
          ws.is_active,
          ws.is_deleted,
          ws.is_default,
          ws.created_at,
          ws.status_category,
          ws.status_for_category,
          u.first_name,
          u.last_name
        `);
            };
            console.timeEnd('QUERY_BUILDER');
            console.time('SEARCH_FILTERS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                    if (!value)
                        return;
                    qb.andWhere(`(
            ws.working_status_type_name ILIKE :search${index}
            OR ws.working_status_description ILIKE :search${index}
            OR CAST(ws.working_status_type_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map(v => String(v))
                        .filter(v => v.toLowerCase() !== 'all' && v !== '' && v !== 'NaN');
                    if (!cleaned.length)
                        continue;
                    switch (f.column) {
                        case 'status':
                        case 'is_active': {
                            const activeValues = [];
                            cleaned.forEach((v) => {
                                if (v === '1' || v.toLowerCase() === 'active')
                                    activeValues.push(1);
                                if (v === '0' || v === '2' || v.toLowerCase() === 'inactive')
                                    activeValues.push(0);
                            });
                            if (activeValues.length === 0)
                                break;
                            if (activeValues.length === 2)
                                break;
                            qb.andWhere('ws.is_active = :activeVal', {
                                activeVal: activeValues[0],
                            });
                            break;
                        }
                        case 'status_category':
                            qb.andWhere('ws.status_category IN (:...cats)', {
                                cats: cleaned,
                            });
                            break;
                        case 'status_for_category':
                            qb.andWhere('ws.status_for_category IN (:...forCats)', {
                                forCats: cleaned,
                            });
                            break;
                        case 'is_default': {
                            const defaultValues = [];
                            cleaned.forEach((v) => {
                                if (v === '1' || v.toLowerCase() === 'system' || v.toLowerCase() === 'default')
                                    defaultValues.push(1);
                                if (v === '0' || v.toLowerCase() === 'custom')
                                    defaultValues.push(0);
                            });
                            if (defaultValues.length === 0)
                                break;
                            if (defaultValues.length === 2)
                                break;
                            qb.andWhere('ws.is_default = :defaultVal', {
                                defaultVal: defaultValues[0],
                            });
                            break;
                        }
                        default:
                            qb.andWhere(`ws.${f.column} IN (:...vals)`, {
                                vals: cleaned,
                            });
                            break;
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'working-statuses-count:' +
                JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = queryRunner.manager
                    .getRepository(asset_working_status_entity_1.AssetWorkingStatus)
                    .createQueryBuilder('ws')
                    .where('ws.is_deleted = 0')
                    .select('COUNT(DISTINCT ws.working_status_type_id)', 'count');
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                    if (!value)
                        return;
                    countQb.andWhere(`(ws.working_status_type_name ILIKE :cs${index}
              OR ws.working_status_description ILIKE :cs${index})`, { [`cs${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map(v => String(v))
                        .filter(v => v.toLowerCase() !== 'all' && v !== '' && v !== 'NaN');
                    if (!cleaned.length)
                        continue;
                    if (f.column === 'status' || f.column === 'is_active') {
                        const activeValues = [];
                        cleaned.forEach((v) => {
                            if (v === '1' || v.toLowerCase() === 'active')
                                activeValues.push(1);
                            if (v === '0' || v === '2' || v.toLowerCase() === 'inactive')
                                activeValues.push(0);
                        });
                        if (activeValues.length === 0)
                            break;
                        if (activeValues.length === 2)
                            break;
                        countQb.andWhere('ws.is_active = :activeVal', {
                            activeVal: activeValues[0],
                        });
                    }
                    if (f.column === 'status_category') {
                        countQb.andWhere('ws.status_category IN (:...cats)', {
                            cats: cleaned,
                        });
                    }
                    if (f.column === 'status_for_category') {
                        countQb.andWhere('ws.status_for_category IN (:...forCats)', {
                            forCats: cleaned,
                        });
                    }
                    if (f.column === 'is_default') {
                        const defaultValues = [];
                        cleaned.forEach((v) => {
                            if (v === '1' || v.toLowerCase() === 'system' || v.toLowerCase() === 'default')
                                defaultValues.push(1);
                            if (v === '0' || v.toLowerCase() === 'custom')
                                defaultValues.push(0);
                        });
                        if (defaultValues.length === 0)
                            break;
                        if (defaultValues.length === 2)
                            break;
                        countQb.andWhere('ws.is_default = :defaultVal', {
                            defaultVal: defaultValues[0],
                        });
                    }
                }
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(queryRunner.manager.getRepository(asset_working_status_entity_1.AssetWorkingStatus).createQueryBuilder('ws'));
            applySearchAndFilters(qb);
            const sortableMap = {
                working_status_type_id: 'ws.working_status_type_id',
                working_status_type_name: 'ws.working_status_type_name',
                working_status_color: 'ws.working_status_color',
                working_status_description: 'ws.working_status_description',
                status_category: 'ws.status_category',
                status_for_category: 'ws.status_for_category',
                is_active: 'ws.is_active',
                is_default: 'ws.is_default',
                created_at: 'ws.created_at',
                created_user: 'created_user',
                usagecount: 'usagecount',
            };
            const idColumn = 'working_status_type_id';
            const idDbColumn = 'ws.working_status_type_id';
            const defaultSort = { column: 'working_status_type_name', order: 'ASC' };
            console.timeEnd('MAIN_QUERY');
            console.time('CURSOR_PAGINATION');
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
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            console.timeEnd('CURSOR_PAGINATION');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            const formatRow = (r) => ({
                working_status_type_id: Number(r.working_status_type_id),
                working_status_type_name: r.working_status_type_name,
                working_status_color: r.working_status_color,
                working_status_description: r.working_status_description,
                status_category: r.status_category,
                status_for_category: r.status_for_category,
                is_active: Number(r.is_active),
                is_deleted: Number(r.is_deleted),
                is_default: r.is_default,
                created_at: r.created_at,
                usagecount: Number(r.usagecount || 0),
                created_user: r.created_user,
            });
            let data;
            let meta;
            if (usingOffset) {
                data = rawRows.map(formatRow);
                const first = rawRows[0];
                const last = rawRows[rawRows.length - 1];
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
                    rows: rawRows, limit, plan, idColumn, hadCursor: !!cursorToken,
                });
                data = page.data.map(formatRow);
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: { ...page, data },
                    limit, total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            console.time('RESPONSE_BUILD');
            const response = {
                success: true,
                message: data.length
                    ? 'Working statuses fetched successfully'
                    : 'No working statuses found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            await this.redisService.set(cacheKey, response, 60);
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_ALL_WORKING_STATUSES_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_WORKING_STATUSES_TOTAL');
            console.error('getAllWorkingStatuses2 ERROR:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getWorkingStatusesDropdown(search) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.WORKING_STATUS, { variant: 'all', search }, async () => {
            try {
                const qb = this.assetWorkingStatusRepository
                    .createQueryBuilder('ws')
                    .select([
                    'ws.working_status_type_id AS working_status_type_id',
                    'ws.working_status_type_name AS working_status_type_name',
                ])
                    .where('ws.is_deleted = 0')
                    .andWhere('ws.is_active = 1');
                if (search?.trim()) {
                    qb.andWhere('ws.working_status_type_name ILIKE :search', {
                        search: `%${search}%`,
                    });
                }
                qb.orderBy('ws.working_status_type_name', 'ASC');
                return await qb.getRawMany();
            }
            catch (error) {
                console.error('getWorkingStatusesDropdown error:', error);
                throw new common_1.BadRequestException(error.message);
            }
        });
    }
    async fetchSingleAssetWorkingStatusData(deleteAssetWorkingStatusDto) {
        const { working_status_type_id } = deleteAssetWorkingStatusDto;
        if (!working_status_type_id) {
            throw new common_1.BadRequestException('Working status ID is required');
        }
        try {
            const statusData = await this.assetWorkingStatusRepository
                .createQueryBuilder('asset_working_status')
                .where('asset_working_status.working_status_type_id = :working_status_type_id', { working_status_type_id })
                .andWhere('asset_working_status.is_active = :is_active', { is_active: 1 })
                .andWhere('asset_working_status.is_deleted = :is_deleted', { is_deleted: 0 })
                .getOne();
            if (!statusData) {
                return {
                    status: 404,
                    message: `Working status with ID ${working_status_type_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Working status fetched successfully',
                data: { statusData },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the working status',
                error: error.message,
            };
        }
    }
    async updateWorkingStatusData(updateAssetWorkingStatusDto) {
        const { working_status_type_name, working_status_type_id, working_status_color, working_status_description, status_category, status_for_category, } = updateAssetWorkingStatusDto;
        const existingStatus = await this.assetWorkingStatusRepository.findOne({
            where: { working_status_type_id },
        });
        if (!existingStatus) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.NOT_FOUND, message: `Working status with ID ${working_status_type_id} not found.` }, common_1.HttpStatus.NOT_FOUND);
        }
        existingStatus.working_status_type_name = working_status_type_name;
        existingStatus.working_status_color = working_status_color;
        existingStatus.working_status_description = working_status_description;
        existingStatus.status_category = status_category;
        existingStatus.status_for_category = status_for_category;
        const updatedStatus = await this.assetWorkingStatusRepository.save(existingStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Working status updated successfully',
            data: {
                status: updatedStatus,
            },
        };
    }
    async deleteWorkingStatusData(dto) {
        let ids = [];
        if (Array.isArray(dto.working_status_type_ids) && dto.working_status_type_ids.length > 0) {
            ids = dto.working_status_type_ids;
        }
        else if (Array.isArray(dto.working_status_type_id)) {
            ids = dto.working_status_type_id;
        }
        else if (dto.working_status_type_id) {
            ids = [dto.working_status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No working_status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const statuses = await this.assetWorkingStatusRepository.find({
            where: { working_status_type_id: (0, typeorm_1.In)(ids) },
        });
        if (!statuses.length) {
            throw new common_1.HttpException({ status: 404, message: 'No valid working statuses found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (ids.length === 1) {
            const status = statuses[0];
            status.is_active = 0;
            status.is_deleted = 1;
            await this.assetWorkingStatusRepository.save(status);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
            return `Working condition "${status.working_status_type_name}" deleted successfully`;
        }
        for (const s of statuses) {
            s.is_active = 0;
            s.is_deleted = 1;
        }
        await this.assetWorkingStatusRepository.save(statuses);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return `${statuses.length} working conditions deleted successfully`;
    }
    async disableWorkingStatusData(dto) {
        let ids = [];
        if (dto.working_status_type_ids?.length > 0) {
            ids = dto.working_status_type_ids;
        }
        else if (dto.working_status_type_id) {
            ids = [dto.working_status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No working_status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let disabledName = null;
        for (const id of ids) {
            const existingStatus = await this.assetWorkingStatusRepository.findOne({
                where: { working_status_type_id: id },
            });
            if (!existingStatus)
                continue;
            if (ids.length === 1) {
                disabledName = existingStatus.working_status_type_name;
            }
            existingStatus.is_active = 0;
            await this.assetWorkingStatusRepository.save(existingStatus);
        }
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return ids.length === 1 && disabledName
            ? `Working condition "${disabledName}" marked as inactive`
            : `${ids.length} working conditions marked as inactive`;
    }
    async enableWorkingStatusData(dto) {
        let ids = [];
        if (dto.working_status_type_ids?.length > 0) {
            ids = dto.working_status_type_ids;
        }
        else if (dto.working_status_type_id) {
            ids = [dto.working_status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No working_status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let activatedName = null;
        for (const id of ids) {
            const existingStatus = await this.assetWorkingStatusRepository.findOne({
                where: { working_status_type_id: id },
            });
            if (!existingStatus)
                continue;
            if (ids.length === 1) {
                activatedName = existingStatus.working_status_type_name;
            }
            existingStatus.is_active = 1;
            existingStatus.is_deleted = 0;
            await this.assetWorkingStatusRepository.save(existingStatus);
        }
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.WORKING_STATUS);
        return ids.length === 1 && activatedName
            ? ` Working condition "${activatedName}" marked as active.`
            : `${ids.length} working conditions marked as active.`;
    }
    async getMaintenanceWorkingStatusesDropdown(search) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.WORKING_STATUS, { variant: 'maintenance', search }, async () => {
            try {
                const MAINTENANCE_CATEGORY = 1;
                const SCRAPPED_CATEGORY = 2;
                const qb = this.assetWorkingStatusRepository
                    .createQueryBuilder('ws')
                    .select([
                    'ws.working_status_type_id AS working_status_type_id',
                    'ws.working_status_type_name AS working_status_type_name',
                    'ws.working_status_color AS color_code',
                ])
                    .where('ws.is_deleted = 0')
                    .andWhere('ws.is_active = 1')
                    .andWhere(`
        (
          ws.status_category = :maintenanceCategory
          OR (
            ws.status_category = :scrappedCategory
            AND ws.status_for_category = :scrappedStatus
          )
        )
        `, {
                    maintenanceCategory: MAINTENANCE_CATEGORY,
                    scrappedCategory: SCRAPPED_CATEGORY,
                    scrappedStatus: 3,
                });
                if (search?.trim()) {
                    qb.andWhere('ws.working_status_type_name ILIKE :search', { search: `%${search}%` });
                }
                qb.orderBy('ws.working_status_type_name', 'ASC');
                return await qb.getRawMany();
            }
            catch (error) {
                console.error('getMaintenanceWorkingStatusesDropdown error:', error);
                throw new common_1.BadRequestException(error.message);
            }
        });
    }
    async getAssetTranferLocationWorkingStatusesDropdown(search) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.WORKING_STATUS, { variant: 'transfer', search }, async () => {
            try {
                const TRANSFER_CATEGORY = 3;
                const qb = this.assetWorkingStatusRepository
                    .createQueryBuilder('ws')
                    .select([
                    'ws.working_status_type_id AS working_status_type_id',
                    'ws.working_status_type_name AS working_status_type_name',
                    'ws.working_status_color AS color_code',
                ])
                    .where('ws.is_deleted = 0')
                    .andWhere('ws.is_active = 1')
                    .andWhere('ws.status_category = :category', {
                    category: TRANSFER_CATEGORY,
                });
                if (search?.trim()) {
                    qb.andWhere('ws.working_status_type_name ILIKE :search', { search: `%${search}%` });
                }
                qb.orderBy('ws.working_status_type_name', 'ASC');
                return await qb.getRawMany();
            }
            catch (error) {
                console.error('getMaintenanceWorkingStatusesDropdown error:', error);
                throw new common_1.BadRequestException(error.message);
            }
        });
    }
    async fetchScrapWorkingStatusDropdown(search) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.WORKING_STATUS, { variant: 'scrap', search }, async () => {
            try {
                const SCRAP_CATEGORY = 2;
                const qb = this.assetWorkingStatusRepository
                    .createQueryBuilder('ws')
                    .select([
                    'ws.working_status_type_id AS working_status_type_id',
                    'ws.working_status_type_name AS working_status_type_name',
                    'ws.working_status_color AS color_code',
                ])
                    .where('ws.is_deleted = 0')
                    .andWhere('ws.is_active = 1')
                    .andWhere('ws.status_category = :category', {
                    category: SCRAP_CATEGORY,
                });
                if (search?.trim()) {
                    qb.andWhere('ws.working_status_type_name ILIKE :search', { search: `%${search}%` });
                }
                qb.orderBy('ws.working_status_type_name', 'ASC');
                return await qb.getRawMany();
            }
            catch (error) {
                console.error('fetchScrapWorkingStatusDropdown error:', error);
                throw new common_1.BadRequestException(error.message);
            }
        });
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        console.log('public user id in asset', public_user_id);
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async exportWorkingStatusesExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const qb = this.assetWorkingStatusRepository
                .createQueryBuilder('ws')
                .where('ws.is_deleted = 0')
                .select([
                'ws.working_status_type_id AS working_status_type_id',
                'ws.working_status_type_name AS working_status_type_name',
                'ws.working_status_color AS working_status_color',
                'ws.working_status_description AS working_status_description',
                'ws.is_active AS is_active',
                'ws.is_deleted AS is_deleted',
                'ws.is_default AS is_default',
                'ws.created_at AS created_at',
                'ws.status_category AS status_category',
                'ws.status_for_category AS status_for_category',
                `COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'System') AS created_user`,
                `COUNT(serial.asset_stocks_unique_id) AS usagecount`,
            ])
                .leftJoin('asset_stock_serials', 'serial', `
            serial.working_status_type_id = ws.working_status_type_id
            AND serial.is_deleted = 0
          `)
                .leftJoin(organizational_user_entity_1.User, 'u', 'u.user_id = ws.created_by')
                .groupBy(`
          ws.working_status_type_id,
          ws.working_status_type_name,
          ws.working_status_color,
          ws.working_status_description,
          ws.is_active,
          ws.is_deleted,
          ws.is_default,
          ws.created_at,
          ws.status_category,
          ws.status_for_category,
          u.first_name,
          u.last_name
        `);
            if (selectedIds.length > 0) {
                qb.andWhere('ws.working_status_type_id IN (:...selectedIds)', { selectedIds });
            }
            if (dto.isSelectAll === true && dto.excludeIds && dto.excludeIds.length > 0) {
                qb.andWhere('ws.working_status_type_id NOT IN (:...excludeIds)', { excludeIds: dto.excludeIds });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
            ws.working_status_type_name ILIKE :search${index}
            OR ws.working_status_description ILIKE :search${index}
            OR CAST(ws.working_status_type_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
            });
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                const cleaned = f.values
                    .map(v => String(v))
                    .filter(v => v.toLowerCase() !== 'all' && v !== '' && v !== 'NaN');
                if (!cleaned.length)
                    continue;
                switch (f.column) {
                    case 'status':
                    case 'is_active': {
                        const activeValues = [];
                        cleaned.forEach((v) => {
                            if (v === '1' || v.toLowerCase() === 'active')
                                activeValues.push(1);
                            if (v === '0' || v === '2' || v.toLowerCase() === 'inactive')
                                activeValues.push(0);
                        });
                        if (activeValues.length === 1) {
                            qb.andWhere('ws.is_active = :activeVal', { activeVal: activeValues[0] });
                        }
                        break;
                    }
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(`ws.${s.column}`, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('ws.working_status_type_id', 'DESC');
            }
            const rawData = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Working Conditions');
            const headers = [
                'Sr. No.',
                'Condition Name',
                'Description',
                'Usage Count',
                'Created By',
                'Created On',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            rawData.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.working_status_type_name ?? '--');
                sheet.cell(row, 3).value(item.working_status_description ?? '--');
                sheet.cell(row, 4).value(Number(item.usagecount || 0));
                sheet.cell(row, 5).value(item.created_user ?? 'System');
                sheet.cell(row, 6).value(item.created_at ? new Date(item.created_at).toLocaleDateString() : '--');
                sheet.cell(row, 7).value(Number(item.is_active) === 1 ? 'Active' : 'Inactive');
            });
            headers.forEach((header, i) => {
                sheet.column(i + 1).width(Math.max(header.length + 10, 15));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error in exportWorkingStatusesExcel:', error);
            throw error;
        }
    }
};
exports.AssetWorkingStatusService = AssetWorkingStatusService;
exports.AssetWorkingStatusService = AssetWorkingStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        redis_service_1.RedisService,
        dropdown_cache_service_1.DropdownCacheService])
], AssetWorkingStatusService);
