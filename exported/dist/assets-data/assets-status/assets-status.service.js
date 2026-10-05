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
exports.AssetsStatusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const redis_service_1 = require("../../common/redis/redis.service");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const assets_status_entity_1 = require("./entities/assets-status.entity");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
let AssetsStatusService = class AssetsStatusService {
    constructor(assetsStatusRepository, dataSource, redisService, dropdownCache) {
        this.assetsStatusRepository = assetsStatusRepository;
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.dropdownCache = dropdownCache;
    }
    async createNewAssetStatus(dto) {
        const rawName = dto.status_type_name || '';
        const name = rawName.trim().replace(/\s+/g, ' ').toUpperCase();
        const normalizedName = name.replace(/ /g, '');
        const rawColor = dto.status_color_code || '';
        const color = rawColor.trim().toUpperCase();
        const description = dto.asset_status_description?.trim() || '';
        if (!name || !color) {
            return {
                status: 400,
                message: 'Both status name and color code are required.',
                data: null,
            };
        }
        const existingStatus = await this.assetsStatusRepository
            .createQueryBuilder('status')
            .where("REPLACE(UPPER(status.status_type_name), ' ', '') = :normalizedName", {
            normalizedName,
        })
            .andWhere('status.is_deleted = :isDeleted', { isDeleted: 0 })
            .getOne();
        const existingStatusColor = await this.assetsStatusRepository.findOne({
            where: { status_color_code: color, is_deleted: 0 },
        });
        if (existingStatus &&
            existingStatusColor &&
            existingStatus.status_type_id === existingStatusColor.status_type_id) {
            if (existingStatus.is_deleted === 1) {
                existingStatus.is_deleted = 0;
                existingStatus.is_active = 1;
                existingStatus.status_color_code = color;
                const updated = await this.assetsStatusRepository.save(existingStatus);
                await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
                return {
                    status: 200,
                    message: `Status '${name}' restored successfully.`,
                    data: updated,
                };
            }
            return {
                status: 409,
                message: `This entry already exists.`,
                data: null,
            };
        }
        if (existingStatus) {
            return {
                status: 409,
                message: `This entry already exists.`,
                data: null,
            };
        }
        const newStatus = this.assetsStatusRepository.create({
            status_type_name: name,
            status_color_code: color,
            asset_status_description: description,
            created_by: dto.created_by,
            is_active: 1,
            is_deleted: 0,
            created_at: new Date()
        });
        const saved = await this.assetsStatusRepository.save(newStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
        return {
            status: 201,
            message: 'Status created successfully.',
            data: saved,
        };
    }
    async bulkCreateAssetStatuses(dtos) {
        const statusNames = dtos.map((dto) => dto.status_type_name);
        const statusColors = dtos.map((dto) => dto.status_color_code);
        const existingStatuses = await this.assetsStatusRepository.find({
            where: [
                { status_type_name: (0, typeorm_2.In)(statusNames) },
                { status_color_code: (0, typeorm_2.In)(statusColors) },
            ],
        });
        const existingNameColorMap = new Map();
        existingStatuses.forEach((status) => {
            existingNameColorMap.set(status.status_type_name, status.status_color_code);
        });
        const alreadyExistEntries = [];
        const nameConflictEntries = [];
        const colorConflictEntries = [];
        const newStatuses = dtos
            .filter((dto) => {
            const existingColor = existingNameColorMap.get(dto.status_type_name);
            if (existingColor !== undefined) {
                if (existingColor === dto.status_color_code) {
                    alreadyExistEntries.push(dto);
                    return false;
                }
                else {
                    nameConflictEntries.push(dto);
                    return false;
                }
            }
            const colorConflict = existingStatuses.find((status) => status.status_color_code === dto.status_color_code &&
                status.status_type_name !== dto.status_type_name);
            if (colorConflict) {
                colorConflictEntries.push(dto);
                return false;
            }
            return true;
        })
            .map((dto) => ({
            status_type_name: dto.status_type_name,
            status_color_code: dto.status_color_code,
            is_active: 1,
            is_deleted: 0,
        }));
        if (newStatuses.length === 0) {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: 'No new statuses created. Conflicts found.',
                data: {
                    created_count: 0,
                    created_statuses: [],
                    already_exist_entries: alreadyExistEntries,
                    name_conflict_entries: nameConflictEntries,
                    color_conflict_entries: colorConflictEntries,
                },
            };
        }
        const savedStatuses = await this.assetsStatusRepository.save(newStatuses);
        if (savedStatuses.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
        }
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Bulk statuses created successfully with some conflicts.',
            data: {
                created_count: savedStatuses.length,
                created_statuses: savedStatuses,
                already_exist_entries: alreadyExistEntries,
                name_conflict_entries: nameConflictEntries,
                color_conflict_entries: colorConflictEntries,
            },
        };
    }
    async getAllStatuses2(dto) {
        console.time('GET_ALL_STATUSES_TOTAL');
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const checkPath = await queryRunner.query('SHOW search_path;');
            console.log("Search Path After SET:", checkPath);
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
            const cacheKey = await this.dropdownCache.buildKey(dropdown_entities_1.DROPDOWN.STATUS, {
                scope: 'statuses-list',
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
                console.timeEnd('GET_ALL_STATUSES_TOTAL');
                return cached;
            }
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                return qb
                    .where('asset_status.is_deleted = :isDeleted', { isDeleted: 0 })
                    .leftJoin('asset_stock_serials', 'serial', `serial.current_status_id = asset_status.status_type_id 
           AND serial.is_deleted = 0`)
                    .leftJoin('users', 'u', 'u.user_id = asset_status.created_by')
                    .select([
                    'asset_status.status_type_id AS status_type_id',
                    'asset_status.status_type_name AS status_type_name',
                    'asset_status.status_color_code AS status_color_code',
                    'asset_status.asset_status_description AS asset_status_description',
                    'asset_status.is_active AS is_active',
                    `CONCAT(u.first_name, ' ', u.last_name) AS created_user`,
                    'asset_status.created_at AS created_at',
                    'asset_status.is_default AS is_default',
                ])
                    .addSelect('COUNT(serial.asset_stocks_unique_id)', 'usagecount')
                    .groupBy(`
          asset_status.status_type_id,
          asset_status.status_type_name,
          asset_status.status_color_code,
          asset_status.asset_status_description,
          asset_status.is_active,
          asset_status.created_at,
          asset_status.is_default,
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
            asset_status.status_type_name ILIKE :search${index}
            OR asset_status.asset_status_description ILIKE :search${index}
            OR CAST(asset_status.status_type_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map(v => String(v))
                        .filter(v => v.toLowerCase() !== 'all' && v !== 'NaN');
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
                            qb.andWhere('asset_status.is_active = :activeVal', {
                                activeVal: activeValues[0],
                            });
                            break;
                        }
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
                            qb.andWhere('asset_status.is_default = :defaultVal', {
                                defaultVal: defaultValues[0],
                            });
                            break;
                        }
                        default:
                            qb.andWhere(`asset_status.${f.column} IN (:...vals)`, {
                                vals: cleaned,
                            });
                            break;
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'statuses-count:' +
                JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = queryRunner.manager
                    .getRepository(assets_status_entity_1.AssetsStatus)
                    .createQueryBuilder('asset_status')
                    .leftJoin('asset_mapping', 'mapping', `mapping.status_type_id = asset_status.status_type_id AND mapping.is_deleted = 0`)
                    .where('asset_status.is_deleted = 0');
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(queryRunner.manager.getRepository(assets_status_entity_1.AssetsStatus).createQueryBuilder('asset_status'));
            applySearchAndFilters(qb);
            const sortableMap = {
                status_type_id: 'asset_status.status_type_id',
                status_type_name: 'asset_status.status_type_name',
                status_color_code: 'asset_status.status_color_code',
                asset_status_description: 'asset_status.asset_status_description',
                is_active: 'asset_status.is_active',
                is_default: 'asset_status.is_default',
                created_at: 'asset_status.created_at',
                created_user: `CONCAT(u.first_name, ' ', u.last_name)`,
                usagecount: 'usagecount',
            };
            const idColumn = 'status_type_id';
            const idDbColumn = 'asset_status.status_type_id';
            const defaultSort = { column: 'status_type_name', order: 'ASC' };
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
            const mergedRows = rawRows.map((r) => ({
                ...r,
                usagecount: Number(r.usagecount || 0),
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
                    ? 'Statuses fetched successfully'
                    : 'No statuses found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            await this.redisService.set(cacheKey, response, 60);
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_ALL_STATUSES_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_STATUSES_TOTAL');
            console.error('getAllStatuses2 ERROR:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getStatusTypesFilter() {
        try {
            return await this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.STATUS, null, async () => this.assetsStatusRepository
                .createQueryBuilder("asset_status")
                .select([
                "asset_status.status_type_id",
                "asset_status.status_type_name"
            ])
                .where("asset_status.is_deleted = :deleted", { deleted: 0 })
                .andWhere("asset_status.is_active = :active", { active: 1 })
                .orderBy("asset_status.status_type_name", "ASC")
                .getMany());
        }
        catch (error) {
            console.error("Error fetching status types:", error);
            throw new common_1.BadRequestException("Status type fetch failed");
        }
    }
    async fetchSingleAssetStatusData(deleteAssetStatusDto) {
        const { status_type_id } = deleteAssetStatusDto;
        if (!status_type_id) {
            throw new common_1.BadRequestException('Status ID is required');
        }
        try {
            const statusData = await this.assetsStatusRepository
                .createQueryBuilder('asset_status')
                .where('asset_status.status_type_id = :status_type_id', {
                status_type_id,
            })
                .andWhere('asset_status.is_active = :is_active', { is_active: 1 })
                .andWhere('asset_status.is_deleted = :is_deleted', { is_deleted: 0 })
                .getOne();
            if (!statusData) {
                return {
                    status: 404,
                    message: `Status with ID ${status_type_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Status fetched successfully',
                data: { statusData },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the status',
                error: error.message,
            };
        }
    }
    async updateStatusData(updateAssetStatusDto) {
        const { status_type_name, status_type_id, status_color_code, asset_status_description } = updateAssetStatusDto;
        const rawName = status_type_name || '';
        const name = rawName.trim().replace(/\s+/g, ' ').toUpperCase();
        const color = status_color_code.toUpperCase();
        const description = updateAssetStatusDto.asset_status_description?.trim() || '';
        const existingStatus = await this.assetsStatusRepository.findOne({
            where: { status_type_id },
        });
        if (!existingStatus) {
            return {
                status: 404,
                message: `Status with ID ${status_type_id} not found.`,
                data: null,
            };
        }
        existingStatus.status_type_name = name;
        existingStatus.status_color_code = color;
        existingStatus.asset_status_description = description;
        const updatedStatus = await this.assetsStatusRepository.save(existingStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
        return {
            status: 200,
            message: 'Status Updated Successfully',
            data: {
                status: updatedStatus,
            },
        };
    }
    async deleteStatusData(deleteAssetStatusDto) {
        const { status_type_id, ids } = deleteAssetStatusDto;
        if (Array.isArray(ids) && ids.length > 0) {
            const statuses = await this.assetsStatusRepository.find({
                where: { status_type_id: (0, typeorm_2.In)(ids) },
            });
            if (!statuses.length) {
                throw new common_1.HttpException({ status: common_1.HttpStatus.NOT_FOUND, message: 'No valid statuses found for provided ids' }, common_1.HttpStatus.NOT_FOUND);
            }
            if (ids.length === 1) {
                const status = statuses[0];
                status.is_active = 0;
                status.is_deleted = 1;
                await this.assetsStatusRepository.save(status);
                await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
                return `Status ${status.status_type_name} deleted successfully`;
            }
            for (const s of statuses) {
                s.is_active = 0;
                s.is_deleted = 1;
            }
            await this.assetsStatusRepository.save(statuses);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
            return `${statuses.length} statuses deleted successfully`;
        }
        if (status_type_id !== undefined && status_type_id !== null) {
            const existingStatus = await this.assetsStatusRepository.findOne({
                where: { status_type_id },
            });
            if (!existingStatus) {
                throw new common_1.HttpException({ status: common_1.HttpStatus.NOT_FOUND, message: 'Status not found' }, common_1.HttpStatus.NOT_FOUND);
            }
            const statusName = existingStatus.status_type_name;
            existingStatus.is_active = 0;
            existingStatus.is_deleted = 1;
            await this.assetsStatusRepository.save(existingStatus);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
            return `Status "${statusName}" deleted successfully`;
        }
        throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'No status id(s) provided' }, common_1.HttpStatus.BAD_REQUEST);
    }
    async disableStatusData(dto) {
        let ids = [];
        if (dto.status_type_ids?.length > 0) {
            ids = dto.status_type_ids;
        }
        else if (dto.status_type_id) {
            ids = [dto.status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let disabledName = null;
        for (const id of ids) {
            const existingStatus = await this.assetsStatusRepository.findOne({
                where: { status_type_id: id },
            });
            if (!existingStatus)
                continue;
            if (ids.length === 1) {
                disabledName = existingStatus.status_type_name;
            }
            existingStatus.is_active = 0;
            await this.assetsStatusRepository.save(existingStatus);
        }
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
        return ids.length === 1 && disabledName
            ? `Status "${disabledName}" marked as inactive `
            : `${ids.length} statuses marked as inactive`;
    }
    async enableStatusData(dto) {
        let ids = [];
        if (dto.status_type_ids?.length > 0) {
            ids = dto.status_type_ids;
        }
        else if (dto.status_type_id) {
            ids = [dto.status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let activatedName = null;
        for (const id of ids) {
            const existingStatus = await this.assetsStatusRepository.findOne({
                where: { status_type_id: id },
            });
            if (!existingStatus)
                continue;
            if (ids.length === 1) {
                activatedName = existingStatus.status_type_name;
            }
            existingStatus.is_active = 1;
            existingStatus.is_deleted = 0;
            await this.assetsStatusRepository.save(existingStatus);
        }
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.STATUS);
        return ids.length === 1 && activatedName
            ? `Status "${activatedName}" marked as active.`
            : `${ids.length} statuses marked as inactive`;
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
    async exportAssetStatusesExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const qb = this.assetsStatusRepository
                .createQueryBuilder('asset_status')
                .where('asset_status.is_deleted = :isDeleted', { isDeleted: 0 })
                .leftJoin('asset_stock_serials', 'serial', `serial.current_status_id = asset_status.status_type_id AND serial.is_deleted = 0`)
                .leftJoin('users', 'u', 'u.user_id = asset_status.created_by')
                .select([
                'asset_status.status_type_id AS status_type_id',
                'asset_status.status_type_name AS status_type_name',
                'asset_status.status_color_code AS status_color_code',
                'asset_status.asset_status_description AS asset_status_description',
                'asset_status.is_active AS is_active',
                `COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'System') AS created_user`,
                'asset_status.created_at AS created_at',
                'asset_status.is_default AS is_default',
            ])
                .addSelect('COUNT(serial.asset_stocks_unique_id)', 'usagecount')
                .groupBy(`
          asset_status.status_type_id,
          asset_status.status_type_name,
          asset_status.status_color_code,
          asset_status.asset_status_description,
          asset_status.is_active,
          asset_status.created_at,
          asset_status.is_default,
          u.first_name,
          u.last_name
        `);
            if (selectedIds.length > 0) {
                qb.andWhere('asset_status.status_type_id IN (:...selectedIds)', { selectedIds });
            }
            if (dto.isSelectAll === true && dto.excludeIds && dto.excludeIds.length > 0) {
                qb.andWhere('asset_status.status_type_id NOT IN (:...excludeIds)', { excludeIds: dto.excludeIds });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
            asset_status.status_type_name ILIKE :search${index}
            OR asset_status.asset_status_description ILIKE :search${index}
            OR CAST(asset_status.status_type_id AS TEXT) ILIKE :search${index}
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
                            qb.andWhere('asset_status.is_active = :activeVal', { activeVal: activeValues[0] });
                        }
                        break;
                    }
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(`asset_status.${s.column}`, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('asset_status.status_type_id', 'DESC');
            }
            const rawData = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Asset Statuses');
            const headers = [
                'Sr. No.',
                'Status Name',
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
                sheet.cell(row, 2).value(item.status_type_name ?? '--');
                sheet.cell(row, 3).value(item.asset_status_description ?? '--');
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
            console.error('Error in exportAssetStatusesExcel:', error);
            throw error;
        }
    }
};
exports.AssetsStatusService = AssetsStatusService;
exports.AssetsStatusService = AssetsStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assets_status_entity_1.AssetsStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        dropdown_cache_service_1.DropdownCacheService])
], AssetsStatusService);
