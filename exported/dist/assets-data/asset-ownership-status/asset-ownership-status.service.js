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
exports.AssetOwnershipStatusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const redis_service_1 = require("../../common/redis/redis.service");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const asset_procurement_items_entity_1 = require("../stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../stocks/entities/asset_procurements.entity");
const stocks_entity_1 = require("../stocks/entities/stocks.entity");
const asset_ownership_status_entity_1 = require("./entities/asset-ownership-status.entity");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
let AssetOwnershipStatusService = class AssetOwnershipStatusService {
    constructor(dataSource, redisService, assetOwnershipStatusRepository, stocksRepository, dropdownCache) {
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.assetOwnershipStatusRepository = assetOwnershipStatusRepository;
        this.stocksRepository = stocksRepository;
        this.dropdownCache = dropdownCache;
    }
    async createAssetOwnershipStatus(dto) {
        const ownershipStatusName = dto.ownership_status_type_name.trim().toUpperCase();
        const existingOwnershipStatus = await this.assetOwnershipStatusRepository.findOne({
            where: { ownership_status_type_name: ownershipStatusName },
        });
        if (existingOwnershipStatus) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.CONFLICT, message: `Ownership status '${dto.ownership_status_type_name}' already exists` }, common_1.HttpStatus.CONFLICT);
        }
        const newOwnershipStatus = this.assetOwnershipStatusRepository.create({
            ownership_status_type_name: ownershipStatusName,
            asset_ownership_status_color: dto.asset_ownership_status_color,
            ownership_status_description: dto.ownership_status_description,
            ownership_status_type: dto.ownership_status_type,
            created_by: dto.created_by,
            is_active: 1,
            is_deleted: 0,
            created_at: new Date()
        });
        const savedOwnershipStatus = await this.assetOwnershipStatusRepository.save(newOwnershipStatus);
        console.log('REDIS UPDATE:OWNERSHIP-STATSU-ADD');
        await this.redisService.delByPattern('ownership-statuses:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Ownership status created successfully',
            data: {
                ownership_status: savedOwnershipStatus,
            },
        };
    }
    async bulkCreateAssetOwnershipStatuses(dtos) {
        const ownershipStatusNames = dtos.map(dto => dto.ownership_status_type_name.trim().toUpperCase());
        const ownershipStatusColors = dtos.map(dto => dto.asset_ownership_status_color.trim());
        const existingStatuses = await this.assetOwnershipStatusRepository.find({
            where: [
                { ownership_status_type_name: (0, typeorm_2.In)(ownershipStatusNames) },
                { asset_ownership_status_color: (0, typeorm_2.In)(ownershipStatusColors) },
            ],
        });
        const existingNameColorMap = new Map();
        existingStatuses.forEach(status => {
            existingNameColorMap.set(status.ownership_status_type_name, status.asset_ownership_status_color);
        });
        const alreadyExistEntries = [];
        const nameConflictEntries = [];
        const colorConflictEntries = [];
        const newOwnershipStatuses = dtos.filter(dto => {
            const existingColor = existingNameColorMap.get(dto.ownership_status_type_name);
            if (existingColor !== undefined) {
                if (existingColor === dto.asset_ownership_status_color) {
                    alreadyExistEntries.push(dto);
                    return false;
                }
                else {
                    nameConflictEntries.push(dto);
                    return false;
                }
            }
            const colorConflict = existingStatuses.find(status => status.asset_ownership_status_color === dto.asset_ownership_status_color && status.ownership_status_type_name !== dto.ownership_status_type_name);
            if (colorConflict) {
                colorConflictEntries.push(dto);
                return false;
            }
            return true;
        }).map(dto => ({
            ownership_status_type_name: dto.ownership_status_type_name,
            asset_ownership_status_color: dto.asset_ownership_status_color,
            is_active: 1,
            is_deleted: 0,
        }));
        if (newOwnershipStatuses.length === 0) {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: 'No new ownership statuses created. Conflicts found.',
                data: {
                    created_count: 0,
                    created_statuses: [],
                    already_exist_entries: alreadyExistEntries,
                    name_conflict_entries: nameConflictEntries,
                    color_conflict_entries: colorConflictEntries,
                },
            };
        }
        const savedStatuses = await this.assetOwnershipStatusRepository.save(newOwnershipStatuses);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Bulk ownership statuses created successfully with some conflicts.',
            data: {
                created_count: savedStatuses.length,
                created_statuses: savedStatuses,
                already_exist_entries: alreadyExistEntries,
                name_conflict_entries: nameConflictEntries,
                color_conflict_entries: colorConflictEntries,
            },
        };
    }
    async getAllAssetOwnershipStatuses2(dto) {
        console.log('📥 DTO:', JSON.stringify(dto, null, 2));
        console.time('GET_ALL_OWNERSHIP_STATUSES_TOTAL');
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const visibleColumns = dto.visible_columns || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            console.timeEnd('INPUT');
            console.time('CACHE_KEY');
            const cacheKey = `ownership-statuses:${JSON.stringify({
                search: dto.search || [],
                filters: dto.filters || [],
                sort: dto.sort || [],
                cursor: dto.cursor || null,
                limit,
                visibleColumns: dto.visible_columns || [],
                jumpToLast,
            })}`;
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                let query = qb
                    .where('os.is_deleted = :isDeleted', { isDeleted: 0 })
                    .leftJoin(asset_procurements_entity_1.AssetProcurement, 'ap', 'ap.ownership_status_id = os.ownership_status_type_id')
                    .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'api', 'api.procurement_id = ap.procurement_id')
                    .leftJoin(organizational_user_entity_1.User, 'u', 'u.user_id = os.created_by');
                if (visibleColumns.length > 0) {
                    visibleColumns.forEach(col => query.addSelect(`os.${col}`, col));
                }
                else {
                    query.select([
                        'os.ownership_status_type_id AS ownership_status_type_id',
                        'os.ownership_status_type_name AS ownership_status_type_name',
                        'os.asset_ownership_status_color AS asset_ownership_status_color',
                        'os.ownership_status_description AS ownership_status_description',
                        'os.is_active AS is_active',
                        'os.is_deleted AS is_deleted',
                        'os.ownership_status_type AS ownership_status_type',
                        'os.created_at AS created_at',
                        'os.is_default AS is_default',
                        `COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'System') AS created_user`,
                        `
            COALESCE((
              SELECT SUM(api2.quantity)
              FROM asset_procurements ap2
              JOIN asset_procurement_items api2
              ON api2.procurement_id = ap2.procurement_id
              WHERE ap2.ownership_status_id = os.ownership_status_type_id
            ), 0) AS usagecount
          `
                    ]);
                }
                query.groupBy(`
        os.ownership_status_type_id,
        os.ownership_status_type_name,
        os.asset_ownership_status_color,
        os.ownership_status_description,
        os.is_active,
        os.is_deleted,
        os.ownership_status_type,
        os.created_at,
        os.is_default,
        u.first_name,
        u.last_name
      `);
                return query;
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
            os.ownership_status_type_name ILIKE :search${index}
            OR os.ownership_status_description ILIKE :search${index}
            OR CAST(os.ownership_status_type_id AS TEXT) ILIKE :search${index}
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
                            qb.andWhere('os.is_active = :activeVal', {
                                activeVal: activeValues[0],
                            });
                            break;
                        }
                        case 'exp':
                        case 'ownership_status_type':
                            qb.andWhere('os.ownership_status_type IN (:...types)', {
                                types: cleaned,
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
                            qb.andWhere('os.is_default = :defaultVal', {
                                defaultVal: defaultValues[0],
                            });
                            break;
                        }
                        default:
                            qb.andWhere(`os.${f.column} IN (:...vals)`, {
                                vals: cleaned,
                            });
                            break;
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'ownership-statuses-count:' +
                JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = queryRunner.manager
                    .getRepository(asset_ownership_status_entity_1.AssetOwnershipStatus)
                    .createQueryBuilder('os')
                    .where('os.is_deleted = :isDeleted', { isDeleted: 0 });
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(queryRunner.manager.getRepository(asset_ownership_status_entity_1.AssetOwnershipStatus).createQueryBuilder('os'));
            applySearchAndFilters(qb);
            const sortableMap = {
                ownership_status_type_id: 'os.ownership_status_type_id',
                ownership_status_type_name: 'os.ownership_status_type_name',
                asset_ownership_status_color: 'os.asset_ownership_status_color',
                ownership_status_description: 'os.ownership_status_description',
                is_active: 'os.is_active',
                is_deleted: 'os.is_deleted',
                ownership_status_type: 'os.ownership_status_type',
                created_at: 'os.created_at',
                is_default: 'os.is_default',
                created_user: `CONCAT(u.first_name, ' ', u.last_name)`,
                usagecount: 'usagecount',
            };
            const idColumn = 'ownership_status_type_id';
            const idDbColumn = 'os.ownership_status_type_id';
            const defaultSort = { column: 'ownership_status_type_id', order: 'ASC' };
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
                ownership_status_type_id: Number(r.ownership_status_type_id),
                ownership_status_type_name: r.ownership_status_type_name,
                asset_ownership_status_color: r.asset_ownership_status_color,
                ownership_status_description: r.ownership_status_description,
                is_active: Number(r.is_active),
                is_deleted: Number(r.is_deleted),
                ownership_status_type: r.ownership_status_type,
                created_at: r.created_at,
                is_default: r.is_default,
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
                    ? 'Ownership statuses fetched successfully'
                    : 'No ownership statuses found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_ALL_OWNERSHIP_STATUSES_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_OWNERSHIP_STATUSES_TOTAL');
            console.error('getAllAssetOwnershipStatuses2 ERROR:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAssetOwnershipStatusDropdown(payload) {
        const { search } = payload;
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS, { search }, async () => {
            try {
                const qb = this.assetOwnershipStatusRepository
                    .createQueryBuilder('aos')
                    .select(['aos.ownership_status_type_id', 'aos.ownership_status_type_name'])
                    .where('aos.is_deleted = :isDeleted', { isDeleted: 0 })
                    .andWhere('aos.is_active = :isActive', { isActive: 1 });
                if (search && search.trim() !== '') {
                    qb.andWhere('aos.ownership_status_type_name ILIKE :search', {
                        search: `%${search.trim()}%`,
                    });
                }
                const data = await qb.orderBy('aos.ownership_status_type_id', 'ASC').getMany();
                return data.map((item) => ({
                    label: item.ownership_status_type_name,
                    value: item.ownership_status_type_id,
                }));
            }
            catch (error) {
                throw new common_1.BadRequestException(`Error fetching asset ownership status dropdown: ${error.message}`);
            }
        });
    }
    async getAssetOwnershipStatusById(deleteAssetOwnershipStatusDto) {
        const { ownership_status_type_id } = deleteAssetOwnershipStatusDto;
        if (!ownership_status_type_id) {
            throw new common_1.BadRequestException('Ownership status ID is required');
        }
        try {
            const ownershipStatusData = await this.assetOwnershipStatusRepository
                .createQueryBuilder('asset_ownership_status')
                .where('asset_ownership_status.ownership_status_type_id = :ownership_status_type_id', { ownership_status_type_id })
                .andWhere('asset_ownership_status.is_active = :is_active', { is_active: 1 })
                .andWhere('asset_ownership_status.is_deleted = :is_deleted', { is_deleted: 0 })
                .getOne();
            if (!ownershipStatusData) {
                return {
                    status: 404,
                    message: `Ownership status with ID ${ownership_status_type_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Ownership status fetched successfully',
                data: { ownershipStatusData },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the ownership status',
                error: error.message,
            };
        }
    }
    async updateAssetOwnershipStatus(updateAssetOwnershipStatusDto) {
        const { ownership_status_type_id, ownership_status_type_name, asset_ownership_status_color, ownership_status_description } = updateAssetOwnershipStatusDto;
        const existingOwnershipStatus = await this.assetOwnershipStatusRepository.findOne({
            where: { ownership_status_type_id },
        });
        if (!existingOwnershipStatus) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.NOT_FOUND, message: `Ownership status with ID ${ownership_status_type_id} not found.` }, common_1.HttpStatus.NOT_FOUND);
        }
        existingOwnershipStatus.ownership_status_type_name = ownership_status_type_name;
        existingOwnershipStatus.asset_ownership_status_color = asset_ownership_status_color;
        existingOwnershipStatus.ownership_status_description = ownership_status_description;
        const updatedOwnershipStatus = await this.assetOwnershipStatusRepository.save(existingOwnershipStatus);
        console.log('REDIS UPDATE:OWNERSHIP-STATSU-UPDATE');
        await this.redisService.delByPattern('ownership-statuses:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Ownership status updated successfully',
            data: {
                ownership_status: updatedOwnershipStatus,
            },
        };
    }
    async deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto) {
        let ids = [];
        if (deleteAssetOwnershipStatusDto.ownership_status_type_ids?.length > 0) {
            ids = deleteAssetOwnershipStatusDto.ownership_status_type_ids;
        }
        else if (deleteAssetOwnershipStatusDto.ownership_status_type_id) {
            ids = [deleteAssetOwnershipStatusDto.ownership_status_type_id];
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'No ownership_status_type_id provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        let deletedName = null;
        let successCount = 0;
        for (const id of ids) {
            const existing = await this.assetOwnershipStatusRepository.findOne({
                where: { ownership_status_type_id: id },
            });
            if (!existing)
                continue;
            if (ids.length === 1) {
                deletedName = existing.ownership_status_type_name;
            }
            existing.is_active = 0;
            existing.is_deleted = 1;
            await this.assetOwnershipStatusRepository.save(existing);
            successCount++;
        }
        console.log('REDIS UPDATE:OWNERSHIP-STATSU-DELETE');
        await this.redisService.delByPattern('ownership-statuses:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return ids.length === 1 && deletedName
            ? `Ownership status "${deletedName}" deleted successfully`
            : `${successCount} ownership statuses deleted successfully`;
    }
    async disableAssetOwnershipStatus(deleteAssetOwnershipStatusDto) {
        let ids = [];
        if (deleteAssetOwnershipStatusDto.ownership_status_type_ids?.length > 0) {
            ids = deleteAssetOwnershipStatusDto.ownership_status_type_ids;
        }
        else if (deleteAssetOwnershipStatusDto.ownership_status_type_id) {
            ids = [deleteAssetOwnershipStatusDto.ownership_status_type_id];
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'No ownership_status_type_id provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        let disabledName = null;
        for (const id of ids) {
            const existing = await this.assetOwnershipStatusRepository.findOne({
                where: { ownership_status_type_id: id },
            });
            if (!existing)
                continue;
            if (ids.length === 1) {
                disabledName = existing.ownership_status_type_name;
            }
            existing.is_active = 0;
            await this.assetOwnershipStatusRepository.save(existing);
        }
        console.log('REDIS UPDATE:OWNERSHIP-STATSU-INACTIVE');
        await this.redisService.delByPattern('ownership-statuses:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return ids.length === 1 && disabledName
            ? `Ownership status "${disabledName}" marked as inactive`
            : `${ids.length} ownership statuses marked as inactive`;
    }
    async enableAssetOwnershipStatus(dto) {
        let ids = [];
        if (dto.ownership_status_type_ids?.length > 0) {
            ids = dto.ownership_status_type_ids;
        }
        else if (dto.ownership_status_type_id) {
            ids = [dto.ownership_status_type_id];
        }
        else {
            throw new common_1.HttpException({ status: 400, message: 'No ownership_status_type_id provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let activatedName = null;
        for (const id of ids) {
            const existingStatus = await this.assetOwnershipStatusRepository.findOne({
                where: { ownership_status_type_id: id },
            });
            if (!existingStatus)
                continue;
            if (ids.length === 1) {
                activatedName = existingStatus.ownership_status_type_name;
            }
            existingStatus.is_active = 1;
            existingStatus.is_deleted = 0;
            await this.assetOwnershipStatusRepository.save(existingStatus);
        }
        console.log('REDIS UPDATE:OWNERSHIP-STATSU-ACTIVE');
        await this.redisService.delByPattern('ownership-statuses:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.OWNERSHIP_STATUS);
        return ids.length === 1 && activatedName
            ? `Ownership status "${activatedName}" marked as active.`
            : `${ids.length} ownership statuses marked as active.`;
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
    async exportOwnershipStatusesExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const qb = this.assetOwnershipStatusRepository
                .createQueryBuilder('os')
                .where('os.is_deleted = :isDeleted', { isDeleted: 0 })
                .leftJoin(organizational_user_entity_1.User, 'u', 'u.user_id = os.created_by')
                .select([
                'os.ownership_status_type_id AS ownership_status_type_id',
                'os.ownership_status_type_name AS ownership_status_type_name',
                'os.asset_ownership_status_color AS asset_ownership_status_color',
                'os.ownership_status_description AS ownership_status_description',
                'os.is_active AS is_active',
                'os.is_deleted AS is_deleted',
                'os.ownership_status_type AS ownership_status_type',
                'os.created_at AS created_at',
                'os.is_default AS is_default',
                `COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'System') AS created_user`,
                `
            COALESCE((
              SELECT SUM(api2.quantity)
              FROM asset_procurements ap2
              JOIN asset_procurement_items api2
              ON api2.procurement_id = ap2.procurement_id
              WHERE ap2.ownership_status_id = os.ownership_status_type_id
            ), 0) AS usagecount
          `
            ])
                .groupBy(`
          os.ownership_status_type_id,
          os.ownership_status_type_name,
          os.asset_ownership_status_color,
          os.ownership_status_description,
          os.is_active,
          os.is_deleted,
          os.ownership_status_type,
          os.created_at,
          os.is_default,
          u.first_name,
          u.last_name
        `);
            if (selectedIds.length > 0) {
                qb.andWhere('os.ownership_status_type_id IN (:...selectedIds)', { selectedIds });
            }
            if (dto.isSelectAll === true && dto.excludeIds && dto.excludeIds.length > 0) {
                qb.andWhere('os.ownership_status_type_id NOT IN (:...excludeIds)', { excludeIds: dto.excludeIds });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
            os.ownership_status_type_name ILIKE :search${index}
            OR os.ownership_status_description ILIKE :search${index}
            OR CAST(os.ownership_status_type_id AS TEXT) ILIKE :search${index}
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
                            qb.andWhere('os.is_active = :activeVal', { activeVal: activeValues[0] });
                        }
                        break;
                    }
                    case 'exp':
                    case 'ownership_status_type': {
                        const expTypes = cleaned.map((v) => v.toLowerCase());
                        qb.andWhere('LOWER(os.ownership_status_type::text) IN (:...expTypes)', { expTypes });
                        break;
                    }
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(`os.${s.column}`, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('os.ownership_status_type_id', 'DESC');
            }
            const rawData = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Ownership Statuses');
            const headers = [
                'Sr. No.',
                'Ownership Name',
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
                sheet.cell(row, 2).value(item.ownership_status_type_name ?? '--');
                sheet.cell(row, 3).value(item.ownership_status_description ?? '--');
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
            console.error('Error in exportOwnershipStatusesExcel:', error);
            throw error;
        }
    }
};
exports.AssetOwnershipStatusService = AssetOwnershipStatusService;
exports.AssetOwnershipStatusService = AssetOwnershipStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(asset_ownership_status_entity_1.AssetOwnershipStatus)),
    __param(3, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        dropdown_cache_service_1.DropdownCacheService])
], AssetOwnershipStatusService);
