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
exports.AssetFieldsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redis_service_1 = require("../../common/redis/redis.service");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_datum_entity_1 = require("../asset-data/entities/asset-datum.entity");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const asset_field_category_entity_1 = require("./entities/asset-field-category.entity");
const asset_field_entity_1 = require("./entities/asset-field.entity");
const asset_ownership_status_types_entity_1 = require("./entities/asset-ownership-status-types.entity");
const asset_status_types_entity_1 = require("./entities/asset-status-types.entity");
const asset_working_status_types_entity_1 = require("./entities/asset-working-status-types.entity");
const asset_items_fields_mapping_entity_1 = require("../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity");
let AssetFieldsService = class AssetFieldsService {
    constructor(assetFieldRepository, dataSource, redisService, assetStatusTypeRepository, assetWorkingStatusTypeRepository, assetOwnershipStatusTypeRepository, assetFieldCategoryRepository, assetRepository, assetItemsFieldsMappingRepository, AssetStockSerialsRepository) {
        this.assetFieldRepository = assetFieldRepository;
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.assetStatusTypeRepository = assetStatusTypeRepository;
        this.assetWorkingStatusTypeRepository = assetWorkingStatusTypeRepository;
        this.assetOwnershipStatusTypeRepository = assetOwnershipStatusTypeRepository;
        this.assetFieldCategoryRepository = assetFieldCategoryRepository;
        this.assetRepository = assetRepository;
        this.assetItemsFieldsMappingRepository = assetItemsFieldsMappingRepository;
        this.AssetStockSerialsRepository = AssetStockSerialsRepository;
    }
    async create(createAssetFieldDto) {
        try {
            const normalizedName = createAssetFieldDto.asset_field_label_name.trim().toLowerCase();
            const existingField = await this.assetFieldRepository
                .createQueryBuilder('field')
                .where('LOWER(TRIM(field.asset_field_label_name)) = :name', { name: normalizedName })
                .andWhere('field.is_custom_field = :isCustom', { isCustom: true })
                .getOne();
            if (existingField) {
                return {
                    success: false,
                    message: 'Custom field with this name already exists',
                };
            }
            createAssetFieldDto.asset_field_label_name = createAssetFieldDto.asset_field_label_name.trim();
            createAssetFieldDto.created_at = new Date();
            createAssetFieldDto.is_custom_field = true;
            const savedItem = await this.assetFieldRepository.save(createAssetFieldDto);
            return {
                success: true,
                message: 'Custom field created successfully',
                data: savedItem,
            };
        }
        catch (error) {
            console.error('Error in insert:', error);
            return {
                success: false,
                message: 'An error occurred while inserting the item.',
            };
        }
    }
    findAllFieldCategories() {
        try {
            return this.assetFieldCategoryRepository.find({
                order: {
                    asset_field_category_name: 'ASC',
                },
            });
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getAssetStatusTypes() {
        try {
            let whereCondition;
            whereCondition = { is_active: 1, is_deleted: 0 };
            const results = await this.assetStatusTypeRepository
                .createQueryBuilder('asset_status_types')
                .orderBy('status_type_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getAssetWorkingStatusType() {
        try {
            let whereCondition;
            whereCondition = { is_active: 1, is_deleted: 0 };
            const results = await this.assetWorkingStatusTypeRepository
                .createQueryBuilder('asset_working_status_types')
                .orderBy('working_status_type_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getAssetOwnershipStatusType() {
        try {
            let whereCondition;
            whereCondition = { is_deleted: 0 };
            const results = await this.assetOwnershipStatusTypeRepository
                .createQueryBuilder('asset_ownership_status_types')
                .orderBy('ownership_status_type_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async findAll() {
        try {
            const whereCondition = { is_deleted: 0 };
            const results = await this.assetFieldRepository
                .createQueryBuilder('asset_fields')
                .leftJoinAndSelect('asset_fields.category', 'category')
                .orderBy('asset_field_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    countAll() {
        try {
            return this.assetFieldRepository.countBy({
                is_deleted: 0,
            });
        }
        catch (error) {
            console.error('Error in countAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async fetchSingleFieldData(deleteAssetFieldDto) {
        const { asset_field_id } = deleteAssetFieldDto;
        console.log('Asset Field ID payload:', asset_field_id);
        if (!asset_field_id) {
            throw new common_1.BadRequestException('Asset Field ID is required');
        }
        try {
            let whereCondition = {
                asset_field_id: asset_field_id,
                is_active: 1,
                is_deleted: 0,
            };
            const fieldData = await this.assetFieldRepository
                .createQueryBuilder('asset_fields')
                .leftJoinAndSelect('asset_fields.category', 'category')
                .orderBy('asset_field_name', 'ASC')
                .where(whereCondition)
                .getOne();
            if (!fieldData) {
                return {
                    status: 404,
                    message: `Field with ID ${asset_field_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Field fetched successfully',
                data: { fieldData },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the user',
                error: error.message,
            };
        }
    }
    async getDefaultAssetFields(dto) {
        console.time('GET_DEFAULT_ASSET_FIELDS_TOTAL');
        try {
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 20), 1), 100);
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
            const cacheKey = `default-asset-fields:${JSON.stringify({
                search: dto.search || [],
                filters: dto.filters || [],
                sort: dto.sort || [],
                cursor: dto.cursor || null,
                limit,
                jumpToLast,
            })}`;
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                return qb
                    .leftJoinAndSelect('asset_fields.category', 'category', 'category.is_deleted = 0')
                    .where('asset_fields.is_deleted = 0')
                    .andWhere('asset_fields.is_custom_field = false');
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
            asset_fields.asset_field_name ILIKE :search${index}
            OR asset_fields.asset_field_label_name ILIKE :search${index}
            OR category.asset_field_category_name ILIKE :search${index}
            OR CAST(asset_fields.asset_field_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map((v) => String(v))
                        .filter((v) => v.toLowerCase() !== 'all' && v !== 'NaN');
                    if (!cleaned.length)
                        continue;
                    switch (f.column) {
                        case 'is_active':
                            qb.andWhere('asset_fields.is_active IN (:...activeVals)', {
                                activeVals: cleaned.map(Number),
                            });
                            break;
                        case 'is_custom_field':
                            qb.andWhere('asset_fields.is_custom_field IN (:...customVals)', {
                                customVals: cleaned.map(Number),
                            });
                            break;
                        case 'asset_field_type':
                            qb.andWhere('asset_fields.asset_field_type IN (:...typeVals)', {
                                typeVals: cleaned,
                            });
                            break;
                        default:
                            qb.andWhere(`asset_fields.${f.column} IN (:...vals)`, {
                                vals: cleaned,
                            });
                            break;
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'default-asset-fields-count:' +
                JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.assetFieldRepository.createQueryBuilder('asset_fields'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetFieldRepository.createQueryBuilder('asset_fields'));
            applySearchAndFilters(qb);
            const sortableMap = {
                asset_field_id: 'asset_fields.asset_field_id',
                asset_field_name: 'asset_fields.asset_field_name',
                asset_field_label_name: 'asset_fields.asset_field_label_name',
                asset_field_type: 'asset_fields.asset_field_type',
                is_active: 'asset_fields.is_active',
                is_custom_field: 'asset_fields.is_custom_field',
                category_name: 'category.asset_field_category_name',
                created_at: 'asset_fields.created_at',
                updated_at: 'asset_fields.updated_at',
            };
            const idColumn = 'asset_field_id';
            const idDbColumn = 'asset_fields.asset_field_id';
            const defaultSort = { column: 'asset_field_name', order: 'ASC' };
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
            const fetched = usingOffset
                ? await qb.getMany()
                : await qb.limit(limit + 1).getMany();
            const fieldIds = fetched
                .map((r) => r.asset_field_id)
                .filter((id) => id != null);
            const mappingCountMap = new Map();
            if (fieldIds.length) {
                const mappingCounts = await this.assetItemsFieldsMappingRepository
                    .createQueryBuilder('mapping')
                    .select('mapping.asset_field_id', 'asset_field_id')
                    .addSelect('COUNT(DISTINCT mapping.asset_item_id)', 'mapped_item_count')
                    .where('mapping.asset_field_id IN (:...fieldIds)', { fieldIds })
                    .andWhere('mapping.aif_is_deleted = 0')
                    .andWhere('mapping.aif_is_active = 1')
                    .groupBy('mapping.asset_field_id')
                    .getRawMany();
                mappingCounts.forEach((row) => {
                    mappingCountMap.set(Number(row.asset_field_id), Number(row.mapped_item_count));
                });
            }
            const rows = fetched.map((r) => {
                const mappedItemCount = mappingCountMap.get(Number(r.asset_field_id)) ?? 0;
                return {
                    ...r,
                    category_name: r?.category?.asset_field_category_name ?? null,
                    is_mapped: mappedItemCount > 0,
                    mapped_item_count: mappedItemCount,
                };
            });
            console.timeEnd('CURSOR_PAGINATION');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = rows;
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
                    rows, limit, plan, idColumn, hadCursor: !!cursorToken,
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
                    ? 'Default asset fields fetched successfully'
                    : 'No default asset fields found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_DEFAULT_ASSET_FIELDS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_DEFAULT_ASSET_FIELDS_TOTAL');
            console.error('getDefaultAssetFields ERROR:', error);
            throw error;
        }
    }
    async getDefaultAssetFieldsDropdown() {
        try {
            const whereCondition = { is_active: 1, is_deleted: 0, is_custom_field: false };
            const results = await this.assetFieldRepository
                .createQueryBuilder('asset_fields')
                .leftJoinAndSelect('asset_fields.category', 'category')
                .orderBy('asset_field_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getCustomAssetFieldsDropdown() {
        try {
            const whereCondition = { is_active: 1, is_deleted: 0, is_custom_field: true };
            const results = await this.assetFieldRepository
                .createQueryBuilder('asset_fields')
                .leftJoinAndSelect('asset_fields.category', 'category')
                .orderBy('asset_field_name', 'ASC')
                .where(whereCondition)
                .getMany();
            return results;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getCustomAssetFields(dto) {
        console.time('GET_CUSTOM_ASSET_FIELDS_TOTAL');
        try {
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 20), 1), 100);
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
            const cacheKey = `custom-asset-fields:${JSON.stringify({
                search: dto.search || [],
                filters: dto.filters || [],
                sort: dto.sort || [],
                cursor: dto.cursor || null,
                limit,
                jumpToLast,
            })}`;
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                return qb
                    .leftJoinAndSelect('asset_fields.category', 'category', 'category.is_deleted = 0')
                    .where('asset_fields.is_deleted = 0')
                    .andWhere('asset_fields.is_custom_field = true');
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
            asset_fields.asset_field_name ILIKE :search${index}
            OR asset_fields.asset_field_label_name ILIKE :search${index}
            OR category.asset_field_category_name ILIKE :search${index}
            OR CAST(asset_fields.asset_field_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                const filterMap = {};
                filters.forEach((f) => {
                    filterMap[f.column] = f.values || [];
                });
                Object.keys(filterMap).forEach((key) => {
                    let values = filterMap[key] || [];
                    values = values
                        .map(v => String(v))
                        .filter(v => v.toLowerCase() !== 'all' && v !== 'NaN');
                    if (!key || values.length === 0)
                        return;
                    if (['is_active', 'is_custom_field'].includes(key)) {
                        const numValues = values.map(v => {
                            if (v === '1' || v.toLowerCase() === 'active')
                                return 1;
                            if (v === '0' || v.toLowerCase() === 'inactive')
                                return 0;
                            return Number(v);
                        });
                        if (numValues.includes(0) && numValues.includes(1))
                            return;
                        qb.andWhere(`asset_fields.${key} = :val`, { val: numValues[0] });
                        return;
                    }
                    qb.andWhere(`asset_fields.${key} IN (:...vals)`, { vals: values });
                });
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'custom-asset-fields-count:' +
                JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.assetFieldRepository.createQueryBuilder('asset_fields'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetFieldRepository.createQueryBuilder('asset_fields'));
            applySearchAndFilters(qb);
            const sortableMap = {
                asset_field_id: 'asset_fields.asset_field_id',
                asset_field_name: 'asset_fields.asset_field_name',
                asset_field_label_name: 'asset_fields.asset_field_label_name',
                asset_field_type: 'asset_fields.asset_field_type',
                is_active: 'asset_fields.is_active',
                is_custom_field: 'asset_fields.is_custom_field',
                category_name: 'category.asset_field_category_name',
                created_at: 'asset_fields.created_at',
            };
            const idColumn = 'asset_field_id';
            const idDbColumn = 'asset_fields.asset_field_id';
            const defaultSort = { column: 'asset_field_name', order: 'ASC' };
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
            const fetched = usingOffset
                ? await qb.getMany()
                : await qb.limit(limit + 1).getMany();
            const fieldIds = fetched
                .map((r) => r.asset_field_id)
                .filter((id) => id != null);
            const mappingCountMap = new Map();
            if (fieldIds.length) {
                const mappingCounts = await this.assetItemsFieldsMappingRepository
                    .createQueryBuilder('mapping')
                    .select('mapping.asset_field_id', 'asset_field_id')
                    .addSelect('COUNT(DISTINCT mapping.asset_item_id)', 'mapped_item_count')
                    .where('mapping.asset_field_id IN (:...fieldIds)', { fieldIds })
                    .andWhere('mapping.aif_is_deleted = 0')
                    .andWhere('mapping.aif_is_active = 1')
                    .groupBy('mapping.asset_field_id')
                    .getRawMany();
                mappingCounts.forEach((row) => {
                    mappingCountMap.set(Number(row.asset_field_id), Number(row.mapped_item_count));
                });
            }
            const rows = fetched.map((r) => {
                const mappedItemCount = mappingCountMap.get(Number(r.asset_field_id)) ?? 0;
                return {
                    ...r,
                    category_name: r?.category?.asset_field_category_name ?? null,
                    is_mapped: mappedItemCount > 0,
                    mapped_item_count: mappedItemCount,
                };
            });
            console.timeEnd('CURSOR_PAGINATION');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = rows;
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
                    rows, limit, plan, idColumn, hadCursor: !!cursorToken,
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
                    ? 'Custom asset fields fetched successfully'
                    : 'No custom asset fields found',
                data,
                meta,
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_CUSTOM_ASSET_FIELDS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_CUSTOM_ASSET_FIELDS_TOTAL');
            console.error('getCustomAssetFields ERROR:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAssetFieldsDropdown(search) {
        try {
            const query = this.assetFieldRepository
                .createQueryBuilder('field')
                .leftJoinAndSelect('field.category', 'category', 'category.is_deleted = :catDeleted', { catDeleted: 0 })
                .select([
                'field.asset_field_id',
                'field.asset_field_label_name',
                'field.asset_field_name',
                'field.is_custom_field',
                'category.asset_field_category_id',
                'category.asset_field_category_name',
            ])
                .where('field.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('field.is_active = :isActive', { isActive: 1 });
            if (search && search.trim() !== '') {
                query.andWhere(`(field.asset_field_name ILIKE :search 
        OR field.asset_field_label_name ILIKE :search 
        OR category.asset_field_category_name ILIKE :search)`, { search: `%${search}%` });
            }
            const results = await query
                .orderBy('field.asset_field_label_name', 'ASC')
                .getMany();
            const customFields = results.filter((f) => f.is_custom_field !== null);
            const defaultFields = results.filter((f) => f.is_custom_field === null);
            return {
                customFields,
                defaultFields,
            };
        }
        catch (error) {
            console.error('Error in getAssetFieldsDropdown:', error);
            throw new common_1.BadRequestException('Error fetching asset fields dropdown.');
        }
    }
    async exportFilteredExcelForAssetFields({ search, filters, }) {
        const queryBuilder = this.assetFieldRepository
            .createQueryBuilder('asset_fields')
            .leftJoinAndSelect('asset_fields.category', 'category');
        queryBuilder
            .where('asset_fields.is_active = :isActive', { isActive: 1 })
            .andWhere('asset_fields.is_deleted = :isDeleted', { isDeleted: 0 });
        if (search && search.trim() !== '') {
            queryBuilder.andWhere('(asset_fields.asset_field_name ILIKE :search OR category.main_category_name ILIKE :search)', { search: `%${search.trim()}%` });
        }
        const allowedFilters = [
            'asset_field_name',
            'asset_field_description',
            'asset_field_label_name',
            'asset_field_type_details',
            'asset_field_type',
            'asset_field_category_id',
            'parent_organization_id',
            'added_by',
            'created_at',
            'updated_at',
            'main_category_name',
        ];
        if (filters && Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (!allowedFilters.includes(key) ||
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    key === 'sortOrder') {
                    continue;
                }
                if (typeof value === 'object' && value.from && value.to) {
                    queryBuilder.andWhere(`asset_fields.${key} BETWEEN :from_${key} AND :to_${key}`, {
                        [`from_${key}`]: value.from,
                        [`to_${key}`]: value.to,
                    });
                }
                else if (key === 'main_category_name') {
                    queryBuilder.andWhere('category.main_category_name ILIKE :mainCategoryName', { mainCategoryName: `%${value}%` });
                }
                else {
                    queryBuilder.andWhere(`CAST(asset_fields.${key} AS TEXT) ILIKE :${key}`, { [key]: `%${value}%` });
                }
            }
        }
        let sortField = 'asset_fields.asset_field_name';
        let sortDirection = 'ASC';
        if (filters?.sortOrder) {
            const sortOrder = filters.sortOrder.toLowerCase();
            if (sortOrder === 'desc') {
                sortDirection = 'DESC';
            }
            else if (sortOrder === 'asc') {
                sortDirection = 'ASC';
            }
            else if (sortOrder === 'newest') {
                sortField = 'asset_fields.created_at';
                sortDirection = 'DESC';
            }
            else if (sortOrder === 'oldest') {
                sortField = 'asset_fields.created_at';
                sortDirection = 'ASC';
            }
        }
        queryBuilder.orderBy(sortField, sortDirection);
        const results = await queryBuilder.getMany();
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Asset Fields');
        const headers = [
            'Sr. No.',
            'Asset Field Name',
            'Label Name',
            'Type',
            'Type Details',
            'Description',
            'Main Category',
            'Created At',
        ];
        headers.forEach((header, i) => {
            sheet.cell(1, i + 1).value(header).style({ bold: true });
        });
        results.forEach((item, index) => {
            sheet.cell(index + 2, 1).value(index + 1);
            sheet.cell(index + 2, 2).value(item.asset_field_name || '');
            sheet.cell(index + 2, 3).value(item.asset_field_label_name || '');
            sheet.cell(index + 2, 4).value(item.asset_field_type || '');
            sheet.cell(index + 2, 5).value(item.asset_field_type_details || '');
            sheet.cell(index + 2, 6).value(item.asset_field_description || '');
            sheet.cell(index + 2, 8).value(item.created_at?.toISOString() || '');
        });
        return await workbook.outputAsync();
    }
    async getAssetFieldCategoryDropdown() {
        const categories = await this.assetFieldCategoryRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        return categories.map((cat) => ({
            label: cat.asset_field_category_name,
        }));
    }
    async deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto) {
        const { asset_field_id } = deleteAssetOwnershipStatusDto;
        const existingOwnershipStatus = await this.assetFieldRepository.findOne({
            where: { asset_field_id },
        });
        if (!existingOwnershipStatus) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.NOT_FOUND, message: `Ownership status with ID ${asset_field_id} not found` }, common_1.HttpStatus.NOT_FOUND);
        }
        existingOwnershipStatus.is_active = 0;
        existingOwnershipStatus.is_deleted = 1;
        await this.assetFieldRepository.save(existingOwnershipStatus);
        return {
            status: common_1.HttpStatus.OK,
            message: `Ownership status with ID ${asset_field_id} has been deactivated and deleted`,
        };
    }
    async activateFields(asset_field_ids) {
        const results = [];
        const itemsToActivate = [];
        for (const id of asset_field_ids) {
            const item = await this.assetFieldRepository.findOneBy({ asset_field_id: id });
            if (!item) {
                results.push({ id, status: 'failed', message: 'Field not found.', name: `ID ${id}` });
                continue;
            }
            if (item.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Field is already active.',
                    name: item.asset_field_name,
                });
                continue;
            }
            itemsToActivate.push(item);
            results.push({ id, status: 'success', name: item.asset_field_name });
        }
        if (itemsToActivate.length > 0) {
            await this.assetFieldRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('asset_field_id IN (:...ids)', {
                ids: itemsToActivate.map((i) => i.asset_field_id),
            })
                .execute();
        }
        return {
            success: results.every((r) => r.status === 'success'),
            message: results.every((r) => r.status === 'success')
                ? `${results.length} field activated successfully.`
                : 'Some field could not be activated.',
            details: results,
        };
    }
    async deactivateFields(asset_field_ids) {
        const results = [];
        const itemsToDeactivate = [];
        for (const id of asset_field_ids) {
            const item = await this.assetFieldRepository.findOneBy({ asset_field_id: id });
            if (!item) {
                results.push({ id, status: 'failed', message: 'Field not found.', name: `ID ${id}` });
                continue;
            }
            if (!item.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Field is already inactive.',
                    name: item.asset_field_name,
                });
                continue;
            }
            itemsToDeactivate.push(item);
            results.push({ id, status: 'success', name: item.asset_field_name });
        }
        if (itemsToDeactivate.length > 0) {
            await this.assetFieldRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('asset_field_id IN (:...ids)', {
                ids: itemsToDeactivate.map((i) => i.asset_field_id),
            })
                .execute();
        }
        return {
            success: results.every((r) => r.status === 'success'),
            message: results.every((r) => r.status === 'success')
                ? `${results.length} field deactivated successfully.`
                : 'Some fields could not be deactivated.',
            details: results,
        };
    }
    async getFieldById(id) {
        try {
            const field = await this.assetFieldRepository.findOne({
                where: { asset_field_id: id },
            });
            return {
                success: true,
                message: "Field fetched successfully",
                data: field,
            };
        }
        catch (error) {
            console.error("Fetch error:", error);
            return {
                success: false,
                message: "Failed to fetch field",
            };
        }
    }
    async updateField(id, updateDto) {
        const field = await this.assetFieldRepository.findOne({
            where: { asset_field_id: id },
        });
        if (!field) {
            throw new common_1.NotFoundException('Field not found');
        }
        const patterns = [
            `"asset_field_id":${id},`,
            `"asset_field_id":${id}}`,
            `"asset_field_id": ${id},`,
            `"asset_field_id": ${id}}`,
            `"asset_field_id"${id}`,
        ];
        const fieldInUse = await this.dataSource
            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
            .createQueryBuilder('serial')
            .where(patterns
            .map((_, i) => `serial.information_fields LIKE :pattern${i}`)
            .join(' OR '), Object.fromEntries(patterns.map((pat, i) => [`pattern${i}`, `%${pat}%`])))
            .getExists();
        if (fieldInUse) {
            const fieldName = field.asset_field_label_name || field.asset_field_name;
            throw new common_1.BadRequestException(`Cannot modify the field "${fieldName}". ` +
                `It is already assigned to one or more assets. ` +
                `To prevent data inconsistency, used fields cannot be edited.`);
        }
        Object.assign(field, updateDto, { updated_at: new Date() });
        const updated = await this.assetFieldRepository.save(field);
        return {
            success: true,
            message: 'Field updated successfully',
            data: updated,
        };
    }
    async exportAssetFieldsExcel(dto, isCustomField) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const qb = this.assetFieldRepository
                .createQueryBuilder('asset_fields')
                .leftJoinAndSelect('asset_fields.category', 'category')
                .where('asset_fields.is_deleted = 0');
            if (isCustomField !== undefined) {
                qb.andWhere('asset_fields.is_custom_field = :isCustom', { isCustom: isCustomField });
            }
            if (selectedIds.length > 0) {
                qb.andWhere('asset_fields.asset_field_id IN (:...selectedIds)', { selectedIds });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values.map((v) => v.trim()).filter(Boolean).join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
            asset_fields.asset_field_name ILIKE :search${index}
            OR asset_fields.asset_field_label_name ILIKE :search${index}
            OR category.asset_field_category_name ILIKE :search${index}
            OR CAST(asset_fields.asset_field_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
            });
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                const cleaned = f.values
                    .map((v) => String(v))
                    .filter((v) => v.toLowerCase() !== 'all' && v !== '' && v !== 'NaN');
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
                            qb.andWhere('asset_fields.is_active = :activeVal', { activeVal: activeValues[0] });
                        }
                        break;
                    }
                    case 'is_custom_field':
                        qb.andWhere('asset_fields.is_custom_field IN (:...customVals)', {
                            customVals: cleaned.map(Number),
                        });
                        break;
                    case 'data_type':
                    case 'asset_field_type':
                        qb.andWhere('asset_fields.asset_field_type IN (:...typeVals)', {
                            typeVals: cleaned,
                        });
                        break;
                    default:
                        qb.andWhere(`asset_fields.${f.column} IN (:...vals)`, {
                            vals: cleaned,
                        });
                        break;
                }
            }
            const sortableMap = {
                asset_field_id: 'asset_fields.asset_field_id',
                asset_field_name: 'asset_fields.asset_field_name',
                asset_field_label_name: 'asset_fields.asset_field_label_name',
                asset_field_type: 'asset_fields.asset_field_type',
                type: 'asset_fields.asset_field_type',
                is_active: 'asset_fields.is_active',
                is_custom_field: 'asset_fields.is_custom_field',
                category_name: 'category.asset_field_category_name',
                created_at: 'asset_fields.created_at',
                updated_at: 'asset_fields.updated_at',
            };
            const defaultSort = { column: 'asset_field_name', order: 'ASC' };
            const requested = sortArray.length > 0 ? sortArray[0] : defaultSort;
            const sortColumn = requested.column && sortableMap[requested.column]
                ? requested.column
                : 'asset_field_name';
            const sortDbColumn = sortableMap[sortColumn];
            const scanOrder = (requested.order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            qb.orderBy(sortDbColumn, scanOrder, 'NULLS LAST').addOrderBy('asset_fields.asset_field_id', scanOrder);
            const data = await qb.getMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name(isCustomField === true ? 'Custom Fields' : isCustomField === false ? 'Default Fields' : 'Asset Fields');
            const headers = [
                'Sr. No.',
                'Field Name',
                'Label Name',
                'Data Type',
                'Category',
                'Field Type',
                'Created On',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.asset_field_name ?? '--');
                sheet.cell(row, 3).value(item.asset_field_label_name ?? '--');
                sheet.cell(row, 4).value(item.data_type ?? item.asset_field_type ?? '--');
                sheet.cell(row, 5).value(item.category?.asset_field_category_name ?? '--');
                sheet.cell(row, 6).value(item.is_custom_field ? 'Custom' : 'Default');
                sheet.cell(row, 7).value(item.created_at ? new Date(item.created_at).toLocaleDateString() : '--');
                sheet.cell(row, 8).value(item.is_active ? 'Active' : 'Inactive');
            });
            headers.forEach((header, i) => {
                sheet.column(i + 1).width(Math.max(header.length + 10, 15));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error exporting asset fields to excel:', error);
            throw error;
        }
    }
};
exports.AssetFieldsService = AssetFieldsService;
exports.AssetFieldsService = AssetFieldsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_field_entity_1.AssetField)),
    __param(3, (0, typeorm_1.InjectRepository)(asset_status_types_entity_1.AssetStatusTypes)),
    __param(4, (0, typeorm_1.InjectRepository)(asset_working_status_types_entity_1.AssetWorkingStatusTypes)),
    __param(5, (0, typeorm_1.InjectRepository)(asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes)),
    __param(6, (0, typeorm_1.InjectRepository)(asset_field_category_entity_1.AssetFieldCategory)),
    __param(7, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(8, (0, typeorm_1.InjectRepository)(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetFieldsService);
