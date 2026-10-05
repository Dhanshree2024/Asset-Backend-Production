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
exports.AssetDepreciationService = exports.DepreciationViewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_depreciation_view_entity_1 = require("./entities/asset-depreciation-view.entity");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const typeorm_3 = require("typeorm");
const redis_service_1 = require("../common/redis/redis.service");
const keyset_pagination_1 = require("../common/pagination/keyset-pagination");
let DepreciationViewService = class DepreciationViewService {
    constructor(dataSource, redis) {
        this.dataSource = dataSource;
        this.redis = redis;
        this.pendingRefresh = new Map();
        this.refreshInFlight = new Set();
        this.DEBOUNCE_MS = 1000;
    }
    async resolveSchema(organizationId) {
        const cacheKey = `organization_organization_schema_name:${organizationId}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return cached;
        const org = await this.dataSource.query(`SELECT organization_schema_name FROM public.register_organization WHERE organization_id = $1 LIMIT 1`, [organizationId]);
        if (!org?.length) {
            throw new Error(`No schema found for organizationId=${organizationId}`);
        }
        const schema = `org_${org[0].organization_schema_name}`;
        await this.redis.set(cacheKey, schema, 3600);
        return schema;
    }
    async scheduleRefresh(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.pendingRefresh.get(schema);
        if (existing) {
            clearTimeout(existing);
        }
        const timer = setTimeout(() => {
            this.pendingRefresh.delete(schema);
            this.runRefresh(schema).catch((err) => console.error(`[DepViewRefresh] failed for ${schema}:`, err));
        }, this.DEBOUNCE_MS);
        this.pendingRefresh.set(schema, timer);
    }
    async forceRefreshNow(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.pendingRefresh.get(schema);
        if (existing) {
            clearTimeout(existing);
            this.pendingRefresh.delete(schema);
        }
        await this.runRefresh(schema);
    }
    async runRefresh(schema) {
        if (this.refreshInFlight.has(schema)) {
            const timer = setTimeout(() => {
                this.pendingRefresh.delete(schema);
                this.runRefresh(schema).catch((err) => console.error(`[DepViewRefresh] failed for ${schema}:`, err));
            }, this.DEBOUNCE_MS);
            this.pendingRefresh.set(schema, timer);
            return;
        }
        this.refreshInFlight.add(schema);
        console.time(`depViewRefresh:${schema}`);
        try {
            await this.redis.incr(`dep_version:${schema}`);
            await this.dataSource.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${schema}.asset_depreciation_serial_view`);
            console.log(`[DepViewRefresh] cache busted + view refreshed for ${schema}`);
        }
        catch (err) {
            console.error(`[DepViewRefresh] error refreshing ${schema}:`, err);
        }
        finally {
            console.timeEnd(`depViewRefresh:${schema}`);
            this.refreshInFlight.delete(schema);
        }
    }
};
exports.DepreciationViewService = DepreciationViewService;
exports.DepreciationViewService = DepreciationViewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_3.DataSource,
        redis_service_1.RedisService])
], DepreciationViewService);
function isValidFyLabel(fy) {
    return /^\d{4}-\d{2}$/.test(fy);
}
function groupBySerial(rows) {
    const map = new Map();
    for (const row of rows) {
        const id = row.asset_stocks_unique_id;
        if (!map.has(id)) {
            map.set(id, {
                asset_stocks_unique_id: id,
                system_code: row.system_code,
                asset_id: row.asset_id,
                asset_title: row.asset_title,
                asset_item_id: row.asset_item_id,
                asset_item_name: row.asset_item_name,
                main_category_name: row.main_category_name,
                sub_category_name: row.sub_category_name,
                block_id_company: row.block_id_company,
                block_id_it: row.block_id_it,
                block_name_company: row.block_name_company,
                block_name_it: row.block_name_it,
                buy_price: Number(row.buy_price),
                depreciation_start_date: row.depreciation_start_date,
                company_depreciation_rate: Number(row.company_depreciation_rate),
                it_act_depreciation_rate: Number(row.it_act_depreciation_rate),
                company_act_residual_value: Number(row.company_act_residual_value),
                it_act_residual_value: Number(row.it_act_residual_value),
                is_half_year_it: row.is_half_year_it,
                company_y1_fraction: Number(row.company_y1_fraction),
                it_act_asset_life: Number(row.it_act_asset_life),
                company_act_asset_life: Number(row.company_act_asset_life),
                asset_type: (row.asset_type),
                location_id: Number(row.location_id),
                location_mapping_id: Number(row.location_mapping_id),
                location_name: (row.location_name),
                schedule: [],
            });
        }
        const yearRow = {
            fy_label: row.fy_label,
            year_number: row.year_number,
            it_opening_wdv: Number(row.it_opening_wdv),
            it_depreciation: Number(row.it_depreciation),
            it_closing_wdv: Number(row.it_closing_wdv),
            company_opening_wdv: Number(row.company_opening_wdv),
            company_depreciation: Number(row.company_depreciation),
            company_closing_wdv: Number(row.company_closing_wdv),
        };
        map.get(id).schedule.push(yearRow);
    }
    return Array.from(map.values());
}
const sortColumnMap = {
    asset_stocks_unique_id: 'dep.asset_stocks_unique_id',
    asset_title: 'dep.asset_title',
    asset_type: 'dep.asset_type',
    company_depreciation_rate: 'dep.company_depreciation_rate',
    company_useful_life: 'dep.company_useful_life',
    company_wdv_value: 'dep.company_wdv_value',
    company_opening_wdv: 'dep.company_opening_wdv',
    company_closing_wdv: 'dep.company_closing_wdv',
    it_depreciation_rate: 'dep.it_depreciation_rate',
    it_wdv_value: 'dep.it_wdv_value',
    it_opening_wdv: 'dep.it_opening_wdv',
    it_closing_wdv: 'dep.it_closing_wdv',
};
let AssetDepreciationService = class AssetDepreciationService {
    constructor(depView) {
        this.depView = depView;
    }
    async getAllSerials(payload) {
        try {
            const { search = '', filters = {}, sortField, sortOrder = 'ASC', } = payload;
            const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
            const d = payload;
            const limit = clamp(Number(payload.pagination?.limit || payload.limit || 10), 1, 100);
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || payload.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalRaw = payload?.knownTotal ?? payload?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const sortColumn = sortField;
            const dbSortColumn = sortColumnMap[sortColumn] ??
                'dep.asset_stocks_unique_id';
            console.log("dbSortColumn", dbSortColumn);
            const qb = this.depView
                .createQueryBuilder('dep');
            if (search?.trim()) {
                qb.andWhere(`
        (
          dep.asset_title ILIKE :search
          OR dep.asset_item_name ILIKE :search
          OR dep.system_code ILIKE :search
          OR dep.asset_stocks_unique_id::text ILIKE :search
        )
        `, {
                    search: `%${search}%`,
                });
            }
            const filterColumnMap = {
                block_id_company: 'dep.block_id_company',
                block_id_it: 'dep.block_id_it',
                asset_type: 'dep.asset_type',
                fy_label: 'dep.fy_label',
                location_mapping_id: 'dep.location_mapping_id',
                company_act_asset_life: 'dep.company_act_asset_life',
                it_act_asset_life: 'dep.it_act_asset_life',
                company_depreciation_rate: 'dep.company_depreciation_rate',
                it_act_depreciation_rate: 'dep.it_act_depreciation_rate',
            };
            const fromDate = filters?.depreciation_from_date?.[0];
            const toDate = filters?.depreciation_to_date?.[0];
            if (fromDate) {
                qb.andWhere('dep.depreciation_start_date >= :fromDate', { fromDate });
            }
            if (toDate) {
                qb.andWhere('dep.depreciation_start_date <= :toDate', { toDate });
            }
            const applyRangeFilter = (column, from, to) => {
                let min = from !== undefined &&
                    from !== null &&
                    from !== ''
                    ? Number(from)
                    : undefined;
                let max = to !== undefined &&
                    to !== null &&
                    to !== ''
                    ? Number(to)
                    : undefined;
                if (min !== undefined &&
                    max !== undefined &&
                    min > max) {
                    [min, max] = [max, min];
                }
                if (min !== undefined) {
                    qb.andWhere(`${column} >= :${column
                        .replace(/\./g, '_')}_min`, {
                        [`${column.replace(/\./g, '_')}_min`]: min,
                    });
                }
                if (max !== undefined) {
                    qb.andWhere(`${column} <= :${column
                        .replace(/\./g, '_')}_max`, {
                        [`${column.replace(/\./g, '_')}_max`]: max,
                    });
                }
            };
            applyRangeFilter('dep.company_opening_wdv', filters?.company_opening_wdv_from?.[0], filters?.company_opening_wdv_to?.[0]);
            applyRangeFilter('dep.company_depreciation', filters?.company_depreciation_from?.[0], filters?.company_depreciation_to?.[0]);
            applyRangeFilter('dep.company_closing_wdv', filters?.company_closing_wdv_from?.[0], filters?.company_closing_wdv_to?.[0]);
            applyRangeFilter('dep.it_opening_wdv', filters?.it_opening_wdv_from?.[0], filters?.it_opening_wdv_to?.[0]);
            applyRangeFilter('dep.it_depreciation', filters?.it_depreciation_from?.[0], filters?.it_depreciation_to?.[0]);
            applyRangeFilter('dep.it_closing_wdv', filters?.it_closing_wdv_from?.[0], filters?.it_closing_wdv_to?.[0]);
            Object.keys(filters).forEach((key) => {
                if (key === 'depreciation_from_date' ||
                    key === 'depreciation_to_date' ||
                    key === 'company_opening_wdv_from' ||
                    key === 'company_opening_wdv_to' ||
                    key === 'company_depreciation_from' ||
                    key === 'company_depreciation_to' ||
                    key === 'company_closing_wdv_from' ||
                    key === 'company_closing_wdv_to' ||
                    key === 'it_opening_wdv_from' ||
                    key === 'it_opening_wdv_to' ||
                    key === 'it_depreciation_from' ||
                    key === 'it_depreciation_to' ||
                    key === 'it_closing_wdv_from' ||
                    key === 'it_closing_wdv_to') {
                    return;
                }
                if (!filters[key]?.length)
                    return;
                const dbColumn = filterColumnMap[key];
                if (!dbColumn)
                    return;
                qb.andWhere(`${dbColumn} IN (:...${key})`, {
                    [key]: filters[key],
                });
            });
            const total = knownTotalVal != null ? knownTotalVal : Number((await qb
                .clone()
                .select('COUNT(DISTINCT dep.asset_stocks_unique_id)', 'count')
                .getRawOne())?.count || 0);
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            const phase1Qb = qb
                .clone()
                .select('DISTINCT dep.asset_stocks_unique_id', 'asset_stocks_unique_id');
            const keysetColumnMap = {
                asset_stocks_unique_id: 'dep.asset_stocks_unique_id',
            };
            const idColumn = 'asset_stocks_unique_id';
            const idDbColumn = 'dep.asset_stocks_unique_id';
            const defaultSort = { column: 'asset_stocks_unique_id', order: 'ASC' };
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: phase1Qb, columnMap: keysetColumnMap, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: phase1Qb, columnMap: keysetColumnMap, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(phase1Qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: phase1Qb, columnMap: keysetColumnMap, defaultSort,
                    idColumn, idDbColumn, cursor: cursorToken, direction,
                });
            }
            const phase1Rows = usingOffset
                ? await phase1Qb.getRawMany()
                : await phase1Qb.limit(limit + 1).getRawMany();
            const normalizedRows = phase1Rows.map((r) => ({
                asset_stocks_unique_id: Number(r.asset_stocks_unique_id),
            }));
            let pageData;
            let meta;
            if (usingOffset) {
                pageData = normalizedRows;
                const first = pageData[0];
                const last = pageData[pageData.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data: pageData,
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
                    rows: normalizedRows, limit, plan, idColumn, hadCursor: !!cursorToken,
                });
                pageData = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > pageData.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page, limit, total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const serialIds = pageData.map((r) => r.asset_stocks_unique_id);
            if (!serialIds.length) {
                return {
                    success: true,
                    message: 'No depreciation records found',
                    data: [],
                    meta,
                };
            }
            const rows = await this.depView
                .createQueryBuilder('dep')
                .where('dep.asset_stocks_unique_id IN (:...serialIds)', { serialIds })
                .andWhere('dep.fy_label = :fy', {
                fy: filters?.fy_label?.[0] ??
                    this.currentFyLabel(),
            })
                .orderBy(dbSortColumn, sortOrder)
                .getMany();
            const groupedData = groupBySerial(rows);
            return {
                success: true,
                message: groupedData.length > 0
                    ? 'Depreciation records retrieved successfully'
                    : 'No depreciation records found',
                data: groupedData,
                meta,
            };
        }
        catch (error) {
            console.error('getAllSerials ERROR:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getSerialById(serialId) {
        const rows = await this.depView.find({
            where: { asset_stocks_unique_id: serialId },
            order: { year_number: 'ASC' },
        });
        if (!rows.length) {
            throw new common_1.NotFoundException(`No depreciation data found for serial id ${serialId}`);
        }
        return groupBySerial(rows)[0];
    }
    currentFyLabel() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const fyStartYear = month >= 4 ? year : year - 1;
        const fyEndYY = String(fyStartYear + 1).slice(-2);
        return `${fyStartYear}-${fyEndYY}`;
    }
    async getBlockWiseReport(fy) {
        const targetFy = fy ?? this.currentFyLabel();
        const rows = await this.depView.find({
            where: {
                fy_label: targetFy,
            },
            order: {
                block_name_it: 'ASC',
                system_code: 'ASC',
            },
        });
        const blocks = new Map();
        for (const row of rows) {
            const blockId = row.block_id_it;
            if (!blocks.has(blockId)) {
                blocks.set(blockId, {
                    block_id_it: blockId,
                    block_name_it: row.block_name_it,
                    opening_wdv_it: 0,
                    depreciation_it: 0,
                    closing_wdv_it: 0,
                    opening_wdv_company: 0,
                    depreciation_company: 0,
                    closing_wdv_company: 0,
                    assets: [],
                });
            }
            const block = blocks.get(blockId);
            block.opening_wdv_it += Number(row.it_opening_wdv);
            block.depreciation_it += Number(row.it_depreciation);
            block.closing_wdv_it += Number(row.it_closing_wdv);
            block.opening_wdv_company += Number(row.company_opening_wdv);
            block.depreciation_company += Number(row.company_depreciation);
            block.closing_wdv_company += Number(row.company_closing_wdv);
            block.assets.push({
                asset_stocks_unique_id: row.asset_stocks_unique_id,
                system_code: row.system_code,
                asset_title: row.asset_title,
                it_opening_wdv: Number(row.it_opening_wdv),
                it_depreciation: Number(row.it_depreciation),
                it_closing_wdv: Number(row.it_closing_wdv),
                company_opening_wdv: Number(row.company_opening_wdv),
                company_depreciation: Number(row.company_depreciation),
                company_closing_wdv: Number(row.company_closing_wdv),
            });
        }
        return Array.from(blocks.values()).map(block => ({
            ...block,
            opening_wdv_it: Number(block.opening_wdv_it.toFixed(2)),
            depreciation_it: Number(block.depreciation_it.toFixed(2)),
            closing_wdv_it: Number(block.closing_wdv_it.toFixed(2)),
            opening_wdv_company: Number(block.opening_wdv_company.toFixed(2)),
            depreciation_company: Number(block.depreciation_company.toFixed(2)),
            closing_wdv_company: Number(block.closing_wdv_company.toFixed(2)),
        }));
    }
    async getBlockAssets(fy, blockIds, expandBlockIds, actType = 'it', search = '') {
        const expandSet = new Set(Array.isArray(expandBlockIds) ? expandBlockIds : []);
        const qb = this.depView
            .createQueryBuilder('v')
            .where('v.fy_label = :fy', { fy })
            .orderBy('v.block_name_it', 'ASC')
            .addOrderBy('v.system_code', 'ASC');
        if (blockIds?.length) {
            qb.andWhere('v.block_id_it IN (:...blockIds)', { blockIds });
        }
        if (search?.trim()) {
            qb.andWhere(`(v.asset_title ILIKE :search 
      OR v.system_code ILIKE :search 
      OR v.asset_item_name ILIKE :search 
      OR v.block_name_it ILIKE :search
      OR CAST(v.it_opening_wdv AS TEXT) ILIKE :search
      OR CAST(v.it_closing_wdv AS TEXT) ILIKE :search
      OR CAST(v.it_depreciation AS TEXT) ILIKE :search
      OR CAST(v.buy_price AS TEXT) ILIKE :search)`, { search: `%${search.trim()}%` });
        }
        if (blockIds?.length) {
            qb.andWhere('v.block_id_it IN (:...blockIds)', { blockIds });
        }
        const rows = await qb.getMany();
        const blocks = new Map();
        for (const row of rows) {
            const blockId = row.block_id_it;
            const includeAssets = expandSet.has(blockId);
            if (!blocks.has(blockId)) {
                blocks.set(blockId, {
                    block_id_it: blockId,
                    block_name_it: row.block_name_it,
                    opening_wdv: 0,
                    addition_gt180: 0,
                    addition_lt180: 0,
                    depreciation_first_half: 0,
                    depreciation_second_half: 0,
                    depreciation_total: 0,
                    closing_wdv: 0,
                    wdv_written_off: 0,
                    asset_count: 0,
                    assets: includeAssets ? [] : undefined,
                });
            }
            const block = blocks.get(blockId);
            block.asset_count++;
            const isIt = actType === 'it';
            const opening = Number(isIt ? row.it_opening_wdv : row.company_opening_wdv);
            const depr = Number(isIt ? row.it_depreciation : row.company_depreciation);
            const closing = Number(isIt ? row.it_closing_wdv : row.company_closing_wdv);
            const isActive = isIt ? row.it_active : row.company_active;
            const wdvWrittenOff = (!isActive && closing > 0) ? closing : 0;
            block.opening_wdv += opening;
            block.depreciation_total += depr;
            block.closing_wdv += closing;
            block.wdv_written_off += wdvWrittenOff;
            const isNewAsset = Number(row.year_number) === 1;
            if (isNewAsset) {
                if (row.is_half_year_it)
                    block.addition_lt180 += Number(row.buy_price);
                else
                    block.addition_gt180 += Number(row.buy_price);
            }
            if (actType === 'it') {
                if (row.is_half_year_it)
                    block.depreciation_second_half += depr;
                else
                    block.depreciation_first_half += depr;
            }
            if (includeAssets) {
                block.assets.push({
                    asset_stocks_unique_id: row.asset_stocks_unique_id,
                    system_code: row.system_code,
                    asset_title: row.asset_title,
                    is_half_year_it: row.is_half_year_it,
                    year_number: row.year_number,
                    buy_price: Number(row.buy_price),
                    opening_wdv: opening,
                    depreciation: depr,
                    closing_wdv: closing,
                    wdv_written_off: wdvWrittenOff,
                    addition_gt180: isNewAsset && !row.is_half_year_it ? Number(row.buy_price) : 0,
                    addition_lt180: isNewAsset && row.is_half_year_it ? Number(row.buy_price) : 0,
                });
            }
        }
        return Array.from(blocks.values()).map(block => ({
            ...block,
            opening_wdv: Number(block.opening_wdv.toFixed(2)),
            addition_gt180: Number(block.addition_gt180.toFixed(2)),
            addition_lt180: Number(block.addition_lt180.toFixed(2)),
            depreciation_first_half: Number(block.depreciation_first_half.toFixed(2)),
            depreciation_second_half: Number(block.depreciation_second_half.toFixed(2)),
            depreciation_total: Number(block.depreciation_total.toFixed(2)),
            wdv_written_off: Number(block.wdv_written_off.toFixed(2)),
            closing_wdv: Number(block.closing_wdv.toFixed(2)),
        }));
    }
    async exportDepreciationExcel(dto) {
        const { search: rawSearch = '', filters = {}, sort = [], selectedIds = [], excludeIds = [], isSelectAll = false, itActEnabled = true, companyActEnabled = true, } = dto;
        const search = String(rawSearch ?? '');
        const qb = this.depView.createQueryBuilder('dep');
        if (isSelectAll) {
            if (excludeIds.length) {
                qb.andWhere('dep.asset_stocks_unique_id NOT IN (:...excludeIds)', { excludeIds });
            }
        }
        else if (selectedIds.length) {
            qb.andWhere('dep.asset_stocks_unique_id IN (:...selectedIds)', { selectedIds });
        }
        if (search?.trim()) {
            qb.andWhere(`(dep.asset_title ILIKE :search OR dep.asset_item_name ILIKE :search OR dep.system_code ILIKE :search OR dep.asset_stocks_unique_id::text ILIKE :search)`, { search: `%${search}%` });
        }
        const filterColumnMap = {
            block_id_company: 'dep.block_id_company',
            block_id_it: 'dep.block_id_it',
            asset_type: 'dep.asset_type',
            fy_label: 'dep.fy_label',
            location_mapping_id: 'dep.location_mapping_id',
            company_act_asset_life: 'dep.company_act_asset_life',
            it_act_asset_life: 'dep.it_act_asset_life',
            company_depreciation_rate: 'dep.company_depreciation_rate',
            it_act_depreciation_rate: 'dep.it_act_depreciation_rate',
        };
        const fromDate = filters?.depreciation_from_date?.[0];
        const toDate = filters?.depreciation_to_date?.[0];
        if (fromDate)
            qb.andWhere('dep.depreciation_start_date >= :fromDate', { fromDate });
        if (toDate)
            qb.andWhere('dep.depreciation_start_date <= :toDate', { toDate });
        const applyRangeFilter = (column, from, to) => {
            let min = from !== undefined && from !== null && from !== '' ? Number(from) : undefined;
            let max = to !== undefined && to !== null && to !== '' ? Number(to) : undefined;
            if (min !== undefined && max !== undefined && min > max)
                [min, max] = [max, min];
            const key = column.replace(/\./g, '_');
            if (min !== undefined)
                qb.andWhere(`${column} >= :${key}_min`, { [`${key}_min`]: min });
            if (max !== undefined)
                qb.andWhere(`${column} <= :${key}_max`, { [`${key}_max`]: max });
        };
        applyRangeFilter('dep.company_opening_wdv', filters?.company_opening_wdv_from?.[0], filters?.company_opening_wdv_to?.[0]);
        applyRangeFilter('dep.company_depreciation', filters?.company_depreciation_from?.[0], filters?.company_depreciation_to?.[0]);
        applyRangeFilter('dep.company_closing_wdv', filters?.company_closing_wdv_from?.[0], filters?.company_closing_wdv_to?.[0]);
        applyRangeFilter('dep.it_opening_wdv', filters?.it_opening_wdv_from?.[0], filters?.it_opening_wdv_to?.[0]);
        applyRangeFilter('dep.it_depreciation', filters?.it_depreciation_from?.[0], filters?.it_depreciation_to?.[0]);
        applyRangeFilter('dep.it_closing_wdv', filters?.it_closing_wdv_from?.[0], filters?.it_closing_wdv_to?.[0]);
        const rangeKeys = new Set([
            'depreciation_from_date', 'depreciation_to_date',
            'company_opening_wdv_from', 'company_opening_wdv_to',
            'company_depreciation_from', 'company_depreciation_to',
            'company_closing_wdv_from', 'company_closing_wdv_to',
            'it_opening_wdv_from', 'it_opening_wdv_to',
            'it_depreciation_from', 'it_depreciation_to',
            'it_closing_wdv_from', 'it_closing_wdv_to',
        ]);
        Object.keys(filters).forEach(key => {
            if (rangeKeys.has(key) || !filters[key]?.length)
                return;
            const dbColumn = filterColumnMap[key];
            if (!dbColumn)
                return;
            qb.andWhere(`${dbColumn} IN (:...${key})`, { [key]: filters[key] });
        });
        qb.andWhere('dep.fy_label = :fy', {
            fy: filters?.fy_label?.[0] ?? this.currentFyLabel(),
        });
        if (sort.length) {
            sort.forEach(s => {
                const dbCol = sortColumnMap[s.column] ?? 'dep.asset_stocks_unique_id';
                qb.addOrderBy(dbCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
            });
        }
        else {
            qb.orderBy('dep.asset_stocks_unique_id', 'ASC');
        }
        const rows = await qb.getMany();
        const grouped = groupBySerial(rows);
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Depreciation');
        const commonHeaders = [
            'Sr. No.', 'System Code', 'Asset Title', 'Asset Item',
            'Main Category', 'Sub Category', 'Asset Type',
            'Block (Company)', 'Block (IT)',
            'Buy Price', 'Depreciation Start Date',
            'Location',
        ];
        const companyHeaders = companyActEnabled ? [
            'Company Rate (%)', 'Company Life (Yrs)', 'Company Residual (%)',
            'Company Opening WDV', 'Company Depreciation', 'Company Closing WDV',
        ] : [];
        const itHeaders = itActEnabled ? [
            'IT Rate (%)', 'IT Life (Yrs)', 'IT Residual (%)',
            'Half Year (IT)', 'IT Opening WDV', 'IT Depreciation', 'IT Closing WDV',
        ] : [];
        const headers = [...commonHeaders, ...companyHeaders, ...itHeaders];
        headers.forEach((h, i) => {
            sheet.cell(1, i + 1).value(h).style({ bold: true, fill: 'BFBFBF' });
        });
        if (companyActEnabled) {
            const companyStart = commonHeaders.length + 1;
            const companyEnd = companyStart + companyHeaders.length - 1;
            for (let c = companyStart; c <= companyEnd; c++) {
                sheet.cell(1, c).style({ fill: 'FFF2CC' });
            }
        }
        if (itActEnabled) {
            const itStart = commonHeaders.length + (companyActEnabled ? companyHeaders.length : 0) + 1;
            const itEnd = itStart + itHeaders.length - 1;
            for (let c = itStart; c <= itEnd; c++) {
                sheet.cell(1, c).style({ fill: 'D9EAD3' });
            }
        }
        grouped.forEach((item, index) => {
            const fy = item.schedule?.[0];
            const row = index + 2;
            let col = 1;
            const set = (val) => sheet.cell(row, col++).value(val ?? '');
            set(index + 1);
            set(item.system_code);
            set(item.asset_title);
            set(item.asset_item_name);
            set(item.main_category_name);
            set(item.sub_category_name);
            set(item.asset_type);
            set(item.block_name_company);
            set(item.block_name_it);
            set(Number(item.buy_price));
            set(item.depreciation_start_date);
            set(item.location_name);
            if (companyActEnabled) {
                set(item.company_depreciation_rate);
                set(item.company_act_asset_life);
                set(item.company_act_residual_value);
                set(fy?.company_opening_wdv ?? '');
                set(fy?.company_depreciation ?? '');
                set(fy?.company_closing_wdv ?? '');
            }
            if (itActEnabled) {
                set(item.it_act_depreciation_rate);
                set(item.it_act_asset_life);
                set(item.it_act_residual_value);
                set(item.is_half_year_it ? 'Yes' : 'No');
                set(fy?.it_opening_wdv ?? '');
                set(fy?.it_depreciation ?? '');
                set(fy?.it_closing_wdv ?? '');
            }
        });
        headers.forEach((_, i) => sheet.column(i + 1).width(22));
        return await workbook.outputAsync();
    }
    async exportBlockReportExcel(fy, blockIds, actType, search) {
        const allBlocks = await this.getBlockAssets(fy, blockIds, [], actType, search);
        const allBlockIds = allBlocks.map(b => b.block_id_it);
        const blocksWithAssets = allBlockIds.length
            ? await this.getBlockAssets(fy, blockIds, allBlockIds, actType, search)
            : [];
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('WDV Report');
        const actLabel = actType === 'it' ? 'Income Tax Act' : 'Company Act';
        sheet.cell(1, 1)
            .value(`WDV Block Report — ${actLabel} — FY ${fy}`)
            .style({ bold: true, fontSize: 18 });
        sheet.range(1, 1, 1, 11).merged(true);
        const headers = [
            'Block of Assets', 'System Code', 'Asset Title',
            'Opening WDV',
            'Addition >180 Days', 'Addition <180 Days',
            'Deletion >180 Days', 'Deletion <180 Days',
            'WDV Written Off', 'Depreciation', 'Closing WDV',
        ];
        headers.forEach((h, i) => {
            sheet.cell(3, i + 1)
                .value(h)
                .style({ bold: true, fill: 'BFBFBF', horizontalAlignment: 'center' });
        });
        let rowNum = 4;
        let grandOpening = 0;
        let grandAddGt180 = 0;
        let grandAddLt180 = 0;
        let grandWdvOff = 0;
        let grandDepr = 0;
        let grandClosing = 0;
        for (const block of blocksWithAssets) {
            const assets = block.assets ?? [];
            let blockAddGt180 = 0;
            let blockAddLt180 = 0;
            for (const asset of assets) {
                const isNewAsset = Number(asset.year_number) === 1;
                const addGt180 = isNewAsset && !asset.is_half_year_it ? asset.buy_price : 0;
                const addLt180 = isNewAsset && asset.is_half_year_it ? asset.buy_price : 0;
                blockAddGt180 += addGt180;
                blockAddLt180 += addLt180;
                const cols = [
                    block.block_name_it,
                    asset.system_code,
                    asset.asset_title,
                    asset.opening_wdv,
                    addGt180,
                    addLt180,
                    0,
                    0,
                    asset.wdv_written_off,
                    asset.depreciation,
                    asset.closing_wdv,
                ];
                cols.forEach((val, i) => {
                    const cell = sheet.cell(rowNum, i + 1).value(val ?? '');
                    if (i === 0)
                        cell.style({ fontColor: '6B7280' });
                });
                rowNum++;
            }
            const subtotalCols = [
                `${block.block_name_it} — Total`,
                '', '',
                Number(block.opening_wdv.toFixed(2)),
                Number(blockAddGt180.toFixed(2)),
                Number(blockAddLt180.toFixed(2)),
                0,
                0,
                Number(block.wdv_written_off.toFixed(2)),
                Number(block.depreciation_total.toFixed(2)),
                Number(block.closing_wdv.toFixed(2)),
            ];
            subtotalCols.forEach((val, i) => {
                sheet.cell(rowNum, i + 1).value(val).style({ bold: true, fill: 'DCE6F1' });
            });
            rowNum++;
            rowNum++;
            grandOpening += block.opening_wdv;
            grandAddGt180 += blockAddGt180;
            grandAddLt180 += blockAddLt180;
            grandWdvOff += block.wdv_written_off;
            grandDepr += block.depreciation_total;
            grandClosing += block.closing_wdv;
        }
        const grandCols = [
            'GRAND TOTAL', '', '',
            Number(grandOpening.toFixed(2)),
            Number(grandAddGt180.toFixed(2)),
            Number(grandAddLt180.toFixed(2)),
            0,
            0,
            Number(grandWdvOff.toFixed(2)),
            Number(grandDepr.toFixed(2)),
            Number(grandClosing.toFixed(2)),
        ];
        grandCols.forEach((val, i) => {
            sheet.cell(rowNum, i + 1).value(val).style({ bold: true, fill: '1F3864', fontColor: 'FFFFFF' });
        });
        const widths = [28, 14, 28, 16, 20, 20, 18, 18, 18, 16, 16];
        widths.forEach((w, i) => sheet.column(i + 1).width(w));
        return await workbook.outputAsync();
    }
};
exports.AssetDepreciationService = AssetDepreciationService;
exports.AssetDepreciationService = AssetDepreciationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_depreciation_view_entity_1.AssetDepreciationViewEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AssetDepreciationService);
