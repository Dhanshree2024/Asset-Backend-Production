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
exports.LocationTransferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_events_service_1 = require("../asset-events/asset-events.service");
const asset_events_entity_1 = require("../asset-events/entities/asset-events.entity");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_relationship_hook_service_1 = require("../asset-mapping/services/asset-relationship-hook.service");
const relationship_error_codes_1 = require("../asset-mapping/constants/relationship-error-codes");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const stock_summary_refresh_service_1 = require("../assets-data/stocks/stock-summary-refresh.service");
const asset_depreciation_service_1 = require("../asset-depreciation/asset-depreciation.service");
const request_context_service_1 = require("../common/context/request-context.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../common/pagination/keyset-pagination");
const redis_service_1 = require("../common/redis/redis.service");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const location_branch_mapping_entity_1 = require("../organizational-profile/entity/location-branch-mapping.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const cache_service_helper_1 = require("../utils/cache-service-helper");
const typeorm_2 = require("typeorm");
const location_transfers_entity_1 = require("./entities/location-transfers.entity");
const serial_branch_scope_1 = require("../branch-access/serial-branch-scope");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const stocks_service_1 = require("../assets-data/stocks/stocks.service");
let LocationTransferService = class LocationTransferService {
    constructor(dataSource, notificationHelper, assetEventsService, redisService, assetDatumRepo, assetProcurementItem, assetMappingRepo, locationTransferRepo, assetStockSerialsRepository, locationsRepository, stockRepository, assetWorkingStatus, requestContext, stockSummaryRefresh, stocksService, depViewService, relationshipHookService) {
        this.dataSource = dataSource;
        this.notificationHelper = notificationHelper;
        this.assetEventsService = assetEventsService;
        this.redisService = redisService;
        this.assetDatumRepo = assetDatumRepo;
        this.assetProcurementItem = assetProcurementItem;
        this.assetMappingRepo = assetMappingRepo;
        this.locationTransferRepo = locationTransferRepo;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.locationsRepository = locationsRepository;
        this.stockRepository = stockRepository;
        this.assetWorkingStatus = assetWorkingStatus;
        this.requestContext = requestContext;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.stocksService = stocksService;
        this.depViewService = depViewService;
        this.relationshipHookService = relationshipHookService;
    }
    async invalidateSerials(schema) {
        console.log('INVALIDATE:invalidateSerials ');
        await this.redisService.incr(`serials_version:${schema}`);
    }
    refreshStockSummaryFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (orgId && !isNaN(orgId)) {
                this.stockSummaryRefresh.scheduleRefresh(orgId).catch((err) => {
                    console.error('[StockSummaryRefresh] scheduleRefresh failed:', err.message);
                });
                this.depViewService.scheduleRefresh(orgId).catch((err) => {
                    console.error('[DepViewService] scheduleRefresh failed:', err.message);
                });
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async generateLocationTransferTicket(locationTransferId) {
        return `LTR-${String(locationTransferId).padStart(4, '0')}`;
    }
    async addSourceLocationForBlockedAssets(sourceLocationId, asset_stocks_unique_ids, schema) {
        if (!asset_stocks_unique_ids || !asset_stocks_unique_ids.length) {
            return { success: false, message: 'No asset stocks unique IDs provided' };
        }
        const locationMappingId = Number(sourceLocationId);
        if (!Number.isInteger(locationMappingId) || locationMappingId <= 0) {
            return { success: false, message: 'Invalid source location' };
        }
        const ids = [
            ...new Set(asset_stocks_unique_ids.map(Number).filter((n) => Number.isInteger(n))),
        ];
        if (!ids.length) {
            return { success: false, message: 'No valid asset ids provided' };
        }
        const mapping = await this.dataSource
            .getRepository(location_branch_mapping_entity_1.LocationBranchMapping)
            .findOne({
            where: {
                location_mapping_id: locationMappingId,
                is_deleted: 0,
                is_active: 1,
            },
        });
        if (!mapping) {
            return { success: false, message: 'Source location not found' };
        }
        const res = await this.assetStockSerialsRepository.update({ asset_stocks_unique_id: (0, typeorm_2.In)(ids), is_deleted: 0 }, { location_id: locationMappingId });
        const updated = res.affected ?? 0;
        if (!updated) {
            return { success: false, message: 'No matching assets found to update' };
        }
        if (schema) {
            await this.invalidateSerials(schema);
        }
        this.refreshStockSummaryFromContext();
        return {
            success: true,
            updated,
            message: `Source location updated for ${updated} asset${updated === 1 ? '' : 's'}`,
        };
    }
    async addToLocationTransferListService(userId, transferIds, mode = 'transfer', schema, isSelectAll, filters, branchIds = [], excludeIds = [], expectedCount) {
        if (isSelectAll) {
            const dto = {
                ...filters,
                getAll: true,
            };
            const result = await this.stocksService.findAllSerials2(dto, userId, branchIds, schema);
            if (result && result.success && Array.isArray(result.data)) {
                transferIds = result.data.map((item) => item.asset_stocks_unique_id);
                if (excludeIds && excludeIds.length) {
                    const excludeSet = new Set(excludeIds.map(Number));
                    transferIds = transferIds.filter(id => !excludeSet.has(Number(id)));
                }
            }
            else {
                transferIds = [];
            }
        }
        if (!transferIds || !transferIds.length) {
            return {
                success: false,
                message: 'No assets provided for transfer',
            };
        }
        transferIds = [...new Set(transferIds)];
        transferIds = (await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
            runner: this.dataSource,
            schema,
            ids: transferIds,
            branchIds,
            label: 'location-transfer',
        })).ids;
        if (!transferIds.length) {
            return {
                success: false,
                message: 'No assets in your branch access',
            };
        }
        if (expectedCount != null && Number(expectedCount) !== transferIds.length) {
            throw new common_1.ConflictException({
                code: 'SELECTION_DRIFT',
                expected: Number(expectedCount),
                actual: transferIds.length,
                message: 'The list changed while you were choosing. Please re-select and try again.',
            });
        }
        const TRANSFER_PENDING = 16;
        const DECOMMISSIONED = 3;
        const result = await this.assetStockSerialsRepository
            .createQueryBuilder('ass')
            .select([
            'ass.asset_id AS asset_id',
            'ass.asset_stocks_unique_id AS asset_stocks_unique_id',
            'ass.system_code AS system_code',
            'ass.current_status_id AS status_type_id',
            'ass.location_id AS location_id',
            'ass.impact_status AS impact_status',
            'ass.impact_reason AS impact_reason',
        ])
            .where('ass.asset_stocks_unique_id IN (:...ids)', {
            ids: transferIds,
        })
            .andWhere('ass.is_deleted = 0')
            .getRawMany();
        if (!result.length) {
            return {
                success: false,
                message: 'Assets not found',
            };
        }
        const existingTransfers = await this.locationTransferRepo.find({
            where: {
                asset_stocks_unique_id: (0, typeorm_2.In)(result.map((r) => r.asset_stocks_unique_id)),
                transfer_status: TRANSFER_PENDING,
                is_deleted: 0,
            },
            select: ['asset_stocks_unique_id'],
        });
        const existingIds = new Set(existingTransfers.map((e) => e.asset_stocks_unique_id));
        const serialIds = result.map((r) => Number(r.asset_stocks_unique_id));
        const transferIdSet = new Set(serialIds);
        const relRows = await this.dataSource.query(`
      SELECT 
        m.mapping_id,
        m.relation_type,
        m.asset_stocks_unique_id,
        m.target_id,
        a_src.asset_sub_category_id AS src_sub_cat,
        COALESCE(mc_src.main_category_name, '') AS src_main_cat,
        COALESCE(sc_src.sub_category_name, '') AS src_sub_cat_name,
        ass_src.system_code AS src_system_code,
        ass_tgt.system_code AS tgt_system_code,
        COALESCE(ass_src.asset_serial_title, a_src.asset_title, '') AS src_name,
        COALESCE(ass_tgt.asset_serial_title, a_tgt.asset_title, '') AS tgt_name
      FROM ${schema}.asset_mapping m
      JOIN ${schema}.asset_stock_serials ass_src ON ass_src.asset_stocks_unique_id = m.asset_stocks_unique_id
      JOIN ${schema}.assets a_src ON a_src.asset_id = ass_src.asset_id
      LEFT JOIN ${schema}.asset_main_category mc_src ON mc_src.main_category_id = a_src.asset_main_category_id
      LEFT JOIN ${schema}.asset_sub_category sc_src ON sc_src.sub_category_id = a_src.asset_sub_category_id
      JOIN ${schema}.asset_stock_serials ass_tgt ON ass_tgt.asset_stocks_unique_id = m.target_id
      JOIN ${schema}.assets a_tgt ON a_tgt.asset_id = ass_tgt.asset_id
      WHERE m.is_active = 1
        AND m.is_deleted = 0
        AND m.relation_type IN ('REL-010', 'REL-006', 'REL-007')
        AND (m.asset_stocks_unique_id = ANY($1::bigint[]) OR m.target_id = ANY($1::bigint[]));
      `, [serialIds]);
        const rel010VmMap = new Map();
        const rel006SwMap = new Map();
        const rel007PeripheralMap = new Map();
        for (const r of relRows || []) {
            if (r.relation_type === 'REL-010') {
                const isSrcVm = r.src_sub_cat === 7 || (r.src_sub_cat_name || '').toLowerCase().includes('cloud');
                const vmId = isSrcVm ? Number(r.asset_stocks_unique_id) : Number(r.target_id);
                const hostId = isSrcVm ? Number(r.target_id) : Number(r.asset_stocks_unique_id);
                const hostCode = isSrcVm ? r.tgt_system_code : r.src_system_code;
                const hostName = isSrcVm ? r.tgt_name : r.src_name;
                rel010VmMap.set(vmId, { host_system_code: hostCode, host_name: hostName, host_id: hostId });
            }
            else if (r.relation_type === 'REL-006') {
                const isSrcSw = (r.src_main_cat || '').toLowerCase().includes('software') ||
                    (r.src_sub_cat_name || '').toLowerCase().includes('software');
                const swId = isSrcSw ? Number(r.asset_stocks_unique_id) : Number(r.target_id);
                const hostId = isSrcSw ? Number(r.target_id) : Number(r.asset_stocks_unique_id);
                const hostCode = isSrcSw ? r.tgt_system_code : r.src_system_code;
                const hostName = isSrcSw ? r.tgt_name : r.src_name;
                rel006SwMap.set(swId, { host_system_code: hostCode, host_name: hostName, host_id: hostId });
            }
            else if (r.relation_type === 'REL-007') {
                const isSrcPeripheral = [13, 14].includes(Number(r.src_sub_cat)) ||
                    (r.src_sub_cat_name || '').toLowerCase().includes('peripheral') ||
                    (r.src_name || '').toLowerCase().includes('monitor') ||
                    (r.src_name || '').toLowerCase().includes('dock');
                const pId = isSrcPeripheral ? Number(r.asset_stocks_unique_id) : Number(r.target_id);
                const hostId = isSrcPeripheral ? Number(r.target_id) : Number(r.asset_stocks_unique_id);
                const hostCode = isSrcPeripheral ? r.tgt_system_code : r.src_system_code;
                const hostName = isSrcPeripheral ? r.tgt_name : r.src_name;
                rel007PeripheralMap.set(pId, { host_system_code: hostCode, host_name: hostName, host_id: hostId });
            }
        }
        const blockedAssets = [];
        const transferableAssets = [];
        for (const item of result) {
            const serialIdNum = Number(item.asset_stocks_unique_id);
            if (item.impact_status === 'IMPACTED' || [8, 9].includes(Number(item.status_type_id))) {
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.PARENT_UNAVAILABLE](item.system_code, 'Asset', item.impact_reason || 'maintenance / impacted'),
                    asset_stocks_unique_id: item.asset_stocks_unique_id,
                });
                continue;
            }
            if (rel006SwMap.has(serialIdNum)) {
                const hostInfo = rel006SwMap.get(serialIdNum);
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED](item.system_code, hostInfo?.host_system_code, hostInfo?.host_name, false),
                    asset_stocks_unique_id: item.asset_stocks_unique_id,
                });
                continue;
            }
            if (rel010VmMap.has(serialIdNum)) {
                const hostInfo = rel010VmMap.get(serialIdNum);
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED](item.system_code, hostInfo?.host_system_code, hostInfo?.host_name, true),
                    asset_stocks_unique_id: item.asset_stocks_unique_id,
                });
                continue;
            }
            if (rel007PeripheralMap.has(serialIdNum)) {
                const hostInfo = rel007PeripheralMap.get(serialIdNum);
                if (hostInfo && transferIdSet.has(hostInfo.host_id)) {
                    continue;
                }
                else {
                    blockedAssets.push({
                        system_code: item.system_code,
                        reason: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CHILD_LINKED_TRANSFER](item.system_code, hostInfo?.host_name, hostInfo?.host_system_code),
                        asset_stocks_unique_id: item.asset_stocks_unique_id,
                    });
                    continue;
                }
            }
            if (existingIds.has(item.asset_stocks_unique_id)) {
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: 'Already in pending transfer',
                });
                continue;
            }
            if (Number(item.status_type_id) === DECOMMISSIONED) {
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: 'Asset is decommissioned',
                });
                continue;
            }
            if (!item.location_id) {
                blockedAssets.push({
                    system_code: item.system_code,
                    reason: 'No source location',
                    asset_stocks_unique_id: item.asset_stocks_unique_id,
                });
                continue;
            }
            transferableAssets.push(item);
        }
        if (mode === 'check') {
            return {
                success: true,
                mode: 'check',
                transferableCount: transferableAssets.length,
                eligibleCount: transferableAssets.length,
                blockedCount: blockedAssets.length,
                blockedAssets,
            };
        }
        const transferRows = transferableAssets.map((item) => ({
            from_location_id: item.location_id,
            to_location_id: null,
            asset_id: item.asset_id.toString(),
            asset_stocks_unique_id: item.asset_stocks_unique_id,
            transfer_status: TRANSFER_PENDING,
            requested_by: userId,
            is_active: 1,
            is_deleted: 0,
        }));
        if (transferRows.length) {
            await this.dataSource.transaction(async (manager) => {
                const transferRepo = manager.getRepository(location_transfers_entity_1.LocationTransfer);
                const savedTransfers = await transferRepo.save(transferRows);
                for (const transfer of savedTransfers) {
                    const ticket = await this.generateLocationTransferTicket(transfer.location_transfer_id);
                    await transferRepo.update({
                        location_transfer_id: transfer.location_transfer_id,
                    }, {
                        location_transfer_ticket: ticket,
                    });
                    await this.assetEventsService.generateEvent(manager, {
                        asset_id: transfer.asset_id,
                        asset_stocks_unique_id: transfer.asset_stocks_unique_id,
                        event_category: asset_events_entity_1.AssetEventCategory.LIFECYCLE,
                        performed_by: userId,
                        reference_table: 'location_transfer',
                        reference_id: transfer.location_transfer_id,
                        metadata: {
                            ticket: ticket,
                            asset_working_condition_id: TRANSFER_PENDING,
                        },
                        title: `Asset sent for location transfer`,
                        description: `Transfer ticket generated`,
                        event_type_id: TRANSFER_PENDING,
                    });
                }
                await manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .createQueryBuilder()
                    .update()
                    .set({
                    working_status_type_id: TRANSFER_PENDING,
                })
                    .where('asset_stocks_unique_id IN (:...ids)', {
                    ids: transferableAssets.map((i) => i.asset_stocks_unique_id),
                })
                    .andWhere('is_deleted = 0')
                    .execute();
            });
        }
        await this.redisService.delByPattern('sidebar-count:*');
        await this.redisService.delByPattern('location-transfer-list:*');
        await this.invalidateSerials(schema);
        this.refreshStockSummaryFromContext();
        return {
            success: true,
            mode: 'transfer',
            addedCount: transferRows.length,
            processedCount: transferRows.length,
            skippedCount: blockedAssets.length,
            message: blockedAssets.length > 0
                ? `${transferRows.length} asset(s) queued for transfer. ${blockedAssets.length} skipped.`
                : `${transferRows.length} asset(s) queued for transfer.`,
            blockedAssets,
        };
    }
    async getAllLocationTransferAssetsList(dto) {
        console.log("LOCATION TRANSFER DTO", dto);
        try {
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast || dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'location-transfer-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            console.log('cacheKey', cacheKey);
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log(' LOCATION TRANSFER CACHE HIT');
                return cached;
            }
            console.log(' LOCATION TRANSFER CACHE MISS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            lt.location_transfer_ticket ILIKE :s${index}
            OR ass.system_code ILIKE :s${index}
            OR ass.stock_serials ILIKE :s${index}
            OR a.asset_title ILIKE :s${index}
            OR fromloc.location_name ILIKE :s${index}
            OR toloc.location_name ILIKE :s${index}
            OR frombranch.branch_name ILIKE :s${index}
            OR tobranch.branch_name ILIKE :s${index}
            OR wstatus.working_status_type_name ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    console.log('Filter column:', f.column);
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map((v) => String(v))
                        .filter((v) => v.toLowerCase() !== 'all' && v !== 'NaN');
                    if (!cleaned.length)
                        continue;
                    switch (f.column) {
                        case 'transfer_status_id':
                        case 'lt.transfer_status':
                            qb.andWhere('wstatus.working_status_type_id IN (:...transfer_status_id)', {
                                transfer_status_id: cleaned.map(Number),
                            });
                            break;
                        case 'from_location_id':
                            qb.andWhere('fromloc.location_id IN (:...from_location_id)', {
                                from_location_id: cleaned.map(Number),
                            });
                            break;
                        case 'to_location_id':
                            qb.andWhere('toloc.location_id IN (:...to_location_id)', {
                                to_location_id: cleaned.map(Number),
                            });
                            break;
                        case 'from_branch_id':
                            qb.andWhere('frombranch.branch_id IN (:...from_branch_id)', {
                                from_branch_id: cleaned.map(Number),
                            });
                            break;
                        case 'to_branch_id':
                            qb.andWhere('tobranch.branch_id IN (:...to_branch_id)', {
                                to_branch_id: cleaned.map(Number),
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'ass', 'ass.asset_stocks_unique_id = lt.asset_stocks_unique_id')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'a', 'a.asset_id = ass.asset_id')
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'fromlbm', 'fromlbm.location_mapping_id = lt.from_location_id AND fromlbm.is_deleted = 0 AND fromlbm.is_active = 1')
                .leftJoin(locations_entity_1.Locations, 'fromloc', 'fromloc.location_id = fromlbm.location_id')
                .leftJoin(branches_entity_1.Branch, 'frombranch', 'frombranch.branch_id = fromlbm.branch_id')
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'tolbm', 'tolbm.location_mapping_id = lt.to_location_id AND tolbm.is_deleted = 0 AND tolbm.is_active = 1')
                .leftJoin(locations_entity_1.Locations, 'toloc', 'toloc.location_id = tolbm.location_id')
                .leftJoin(branches_entity_1.Branch, 'tobranch', 'tobranch.branch_id = tolbm.branch_id')
                .leftJoin(asset_working_status_entity_1.AssetWorkingStatus, 'wstatus', 'wstatus.working_status_type_id = lt.transfer_status')
                .where('lt.is_deleted = :deleted', { deleted: 0 })
                .andWhere('lt.transfer_status != :completedStatus', {
                completedStatus: 15,
            });
            const countQb = buildJoins(this.locationTransferRepo.createQueryBuilder('lt'));
            applySearchAndFilters(countQb);
            const qb = buildJoins(this.locationTransferRepo.createQueryBuilder('lt'));
            qb.select([
                'lt.location_transfer_id AS location_transfer_id',
                'ass.system_code AS system_code',
                'ass.stock_serials AS stock_serials',
                'a.asset_title AS asset_title',
                'ass.asset_stocks_unique_id AS asset_stocks_unique_id',
                'ass.asset_id AS asset_id',
                'ass.stock_id AS stock_id',
                'fromlbm.location_mapping_id AS from_location_mapping_id',
                'fromloc.location_id AS from_location_id',
                'fromloc.location_name AS from_location',
                'fromloc.location_floor AS from_floor',
                'frombranch.branch_id AS from_branch_id',
                'frombranch.branch_name AS from_branch',
                'tolbm.location_mapping_id AS to_location_mapping_id',
                'toloc.location_id AS to_location_id',
                'toloc.location_name AS to_location',
                'toloc.location_floor AS to_floor',
                'tobranch.branch_id AS to_branch_id',
                'tobranch.branch_name AS to_branch',
                'wstatus.working_status_type_id AS transfer_status_id',
                'wstatus.working_status_type_name AS transfer_status_name',
                'wstatus.working_status_color AS working_status_color',
                'CAST(lt.requested_at AS TEXT) AS requested_at',
                'lt.reason_for_transfer AS reason_for_transfer',
                'lt.comment_for_location_transfer AS comment_for_location_transfer',
                'lt.location_transfer_ticket AS location_transfer_ticket',
            ]);
            applySearchAndFilters(qb);
            qb.groupBy(`
      lt.location_transfer_id, lt.requested_at, lt.reason_for_transfer,
      lt.comment_for_location_transfer, lt.location_transfer_ticket,
      ass.system_code, ass.stock_serials, a.asset_title,
      ass.asset_stocks_unique_id, ass.asset_id, ass.stock_id,
      fromlbm.location_mapping_id, fromloc.location_id, fromloc.location_name,
      fromloc.location_floor, frombranch.branch_id, frombranch.branch_name,
      tolbm.location_mapping_id, toloc.location_id, toloc.location_name,
      toloc.location_floor, tobranch.branch_id, tobranch.branch_name,
      wstatus.working_status_type_id, wstatus.working_status_type_name,
      wstatus.working_status_color
    `);
            const sortableMap = {
                location_transfer_id: 'lt.location_transfer_id',
                location_transfer_ticket: 'lt.location_transfer_ticket',
                system_code: 'ass.system_code',
                stock_serials: 'ass.stock_serials',
                asset_title: 'a.asset_title',
                from_location: 'fromloc.location_name',
                to_location: 'toloc.location_name',
                from_branch: 'frombranch.branch_name',
                to_branch: 'tobranch.branch_name',
                transfer_status_name: 'wstatus.working_status_type_name',
                requested_at: 'lt.requested_at',
            };
            const idColumn = 'location_transfer_id';
            const idDbColumn = 'lt.location_transfer_id';
            const defaultSort = { column: 'requested_at', order: 'DESC' };
            const activeSortCol = sortArray?.[0]?.column;
            const effectiveSortCol = activeSortCol && sortableMap[activeSortCol]
                ? activeSortCol
                : defaultSort.column;
            const timestampSort = effectiveSortCol === 'requested_at';
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    timestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    timestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                    timestampSort,
                });
            }
            const total = knownTotalVal != null ? knownTotalVal : await countQb.getCount();
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            let data;
            let meta;
            if (usingOffset) {
                data = rawRows;
                const first = data[0];
                const last = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: first
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: first[plan.sortColumn] ?? null,
                                id: first[idColumn],
                            })
                            : null,
                        endCursor: last
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: last[plan.sortColumn] ?? null,
                                id: last[idColumn],
                            })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Location transfer assets fetched successfully'
                    : 'No location transfers found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.error('getAllLocationTransferAssetsList ERROR:', error);
            throw error;
        }
    }
    async completeAllAssetsLocationTransfers(userId, schema, dtos) {
        if (!dtos || !dtos.length) {
            return {
                success: false,
                message: 'No assets provided for transfer',
            };
        }
        const TRANSFER_COMPLETED = 15;
        const transferResult = await this.dataSource.transaction(async (manager) => {
            const allLocationsForLog = await manager.find(locations_entity_1.Locations, {
                where: { is_deleted: 0 },
            });
            const locationMapName = new Map(allLocationsForLog.map((loc) => [loc.location_id, loc.location_name]));
            for (const dto of dtos) {
                const transfer = await manager
                    .getRepository(location_transfers_entity_1.LocationTransfer)
                    .createQueryBuilder('lt')
                    .setLock('pessimistic_write')
                    .where('lt.location_transfer_id = :id', {
                    id: dto.location_transfer_id,
                })
                    .getOne();
                if (!transfer?.location_transfer_ticket) {
                    throw new common_1.BadRequestException('Transfer ticket missing. Cannot complete transfer.');
                }
                const serial = await manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .createQueryBuilder('s')
                    .setLock('pessimistic_write')
                    .where('s.asset_stocks_unique_id = :id', {
                    id: transfer.asset_stocks_unique_id,
                })
                    .andWhere('s.is_deleted = 0')
                    .getOne();
                if (!serial) {
                    throw new common_1.BadRequestException('Serial not found');
                }
                const oldStock = await manager
                    .getRepository(stocks_entity_1.Stock)
                    .createQueryBuilder('st')
                    .setLock('pessimistic_write')
                    .where('st.stock_id = :id', { id: serial.stock_id })
                    .andWhere('st.is_deleted = 0')
                    .getOne();
                if (!oldStock) {
                    throw new common_1.BadRequestException('Old stock not found');
                }
                if (Number(oldStock.quantity) <= 0) {
                    throw new common_1.BadRequestException('Old stock quantity is invalid');
                }
                let newStock = await manager
                    .getRepository(stocks_entity_1.Stock)
                    .createQueryBuilder('st')
                    .setLock('pessimistic_write')
                    .where('st.asset_id = :asset_id', { asset_id: serial.asset_id })
                    .andWhere('st.location_id = :location_id', {
                    location_id: dto.to_location_id,
                })
                    .andWhere('st.is_deleted = 0')
                    .getOne();
                if (!newStock) {
                    newStock = await manager.getRepository(stocks_entity_1.Stock).save({
                        asset_id: serial.asset_id,
                        location_id: dto.to_location_id,
                        quantity: 0,
                        is_active: 1,
                        is_deleted: 0,
                        created_by: userId,
                    });
                }
                await manager
                    .getRepository(stocks_entity_1.Stock)
                    .increment({ stock_id: newStock.stock_id }, 'quantity', 1);
                await manager
                    .getRepository(stocks_entity_1.Stock)
                    .decrement({ stock_id: oldStock.stock_id }, 'quantity', 1);
                await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).update({ asset_stocks_unique_id: serial.asset_stocks_unique_id }, {
                    stock_id: newStock.stock_id,
                    location_id: dto.to_location_id,
                    working_status_type_id: TRANSFER_COMPLETED,
                });
                await manager.getRepository(location_transfers_entity_1.LocationTransfer).update({ location_transfer_id: dto.location_transfer_id }, {
                    to_location_id: dto.to_location_id,
                    transfer_status: TRANSFER_COMPLETED,
                    reason_for_transfer: dto.reason_for_transfer,
                    comment_for_location_transfer: dto.comment_for_location_transfer,
                    completed_by: userId,
                    completed_at: new Date(),
                });
                const fromLocationName = locationMapName.get(transfer.from_location_id) ?? 'Unknown';
                const toLocationName = locationMapName.get(dto.to_location_id) ?? 'Unknown';
                await this.assetEventsService.generateEvent(manager, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serial.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.LOCATION,
                    performed_by: userId,
                    reference_table: 'location_transfer',
                    reference_id: dto.location_transfer_id,
                    metadata: {
                        from_location_id: transfer.from_location_id,
                        to_location_id: dto.to_location_id,
                        transfer_status: TRANSFER_COMPLETED,
                        old_stock_id: oldStock.stock_id,
                        new_stock_id: newStock.stock_id,
                        fromLocationName,
                        toLocationName,
                    },
                    title: `Asset location transfer completed`,
                    description: dto.comment_for_location_transfer
                        ? dto.comment_for_location_transfer
                        : `Transfer completed: ${fromLocationName} → ${toLocationName} (Ticket: ${transfer.location_transfer_ticket})`,
                    event_type_id: TRANSFER_COMPLETED,
                });
                if (this.relationshipHookService && dto.to_location_id) {
                    await this.relationshipHookService.cascadeLocationTransfer(manager, schema, Number(serial.asset_stocks_unique_id), Number(dto.to_location_id), dto.dependents || [], userId, dto.location_transfer_id);
                }
            }
            const LOCATION_TRANSFER_COMPLETED_EVENT_ID = 32;
            const updatedUser = await manager.findOne(organizational_user_entity_1.User, {
                where: { user_id: userId },
            });
            const allLocations = await manager.find(locations_entity_1.Locations, {
                where: { is_deleted: 0 },
            });
            const locationMap = new Map(allLocations.map((loc) => [loc.location_id, loc.location_name]));
            for (const dto of dtos) {
                const transfer = await manager.findOne(location_transfers_entity_1.LocationTransfer, {
                    where: { location_transfer_id: dto.location_transfer_id },
                });
                if (!transfer)
                    continue;
                const serial = await manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: transfer.asset_stocks_unique_id },
                });
                if (!serial)
                    continue;
                const asset = await manager.findOne(asset_datum_entity_1.AssetDatum, {
                    where: { asset_id: serial.asset_id },
                });
                const fromLocationName = locationMap.get(transfer.from_location_id) ?? '';
                const toLocationName = locationMap.get(transfer.to_location_id) ?? '';
                const contextData = {
                    stockTransfer: {
                        asset_title: serial?.asset_serial_title ?? '',
                        from_location: fromLocationName,
                        to_location: toLocationName,
                    },
                    updatedUser,
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
                    eventId: LOCATION_TRANSFER_COMPLETED_EVENT_ID,
                    contextData,
                    recipients,
                    meta: {
                        trace_id: transfer.location_transfer_ticket,
                    },
                });
                await this.redisService.delByPattern('sidebar-count:*');
                await this.redisService.delByPattern('location-transfer-list:*');
                await this.invalidateSerials(schema);
                this.refreshStockSummaryFromContext();
            }
            return {
                success: true,
                message: 'Assets transfer completed',
                count: dtos.length,
            };
        });
        this.refreshStockSummaryFromContext();
        return transferResult;
    }
    async getMultipleLocationTransfers(transferIds) {
        if (!transferIds?.length) {
            return { success: false, message: 'Transfer IDs are required' };
        }
        const transfers = await this.locationTransferRepo.find({
            where: { location_transfer_id: (0, typeorm_2.In)(transferIds) },
        });
        if (!transfers.length) {
            return { success: false, message: 'No location transfers found' };
        }
        const stockUniqueIds = transfers.map((t) => t.asset_stocks_unique_id);
        const assetStocks = await this.assetStockSerialsRepository
            .createQueryBuilder('ass')
            .leftJoin('ass.stock', 'stock')
            .leftJoin('ass.asset_data', 'a')
            .select([
            'ass.asset_stocks_unique_id AS asset_stocks_unique_id',
            'ass.asset_id AS asset_id',
            'ass.system_code AS system_code',
            'ass.stock_serials AS stock_serials',
            'ass.asset_serial_title AS asset_title',
            'stock.location_id AS location_id',
        ])
            .where('ass.asset_stocks_unique_id IN (:...ids)', { ids: stockUniqueIds })
            .getRawMany();
        console.log('assetStocks:getMultipleLocationTransfers', assetStocks);
        const assetStockMap = new Map(assetStocks.map((a) => [String(a.asset_stocks_unique_id), a]));
        const mergedResults = transfers.map((t) => {
            const stockData = assetStockMap.get(String(t.asset_stocks_unique_id));
            return {
                ...t,
                ...(stockData || {}),
            };
        });
        console.log('getMultipleLocationTransfers:mergedResults', mergedResults);
        return {
            success: true,
            message: 'Location transfers fetched successfully',
            data: mergedResults,
        };
    }
    async getLocationTransferDetail(transferId) {
        if (!transferId) {
            return { success: false, message: 'Transfer ID is required' };
        }
        const transfer = await this.locationTransferRepo.findOne({
            where: { location_transfer_id: transferId },
            relations: [
                'fromLocation',
                'fromLocation.location',
                'fromLocation.branch',
                'toLocation',
                'toLocation.location',
                'toLocation.branch',
                'assetStock',
                'assetStock.asset_data',
                'requestedByUser',
                'completedByUser',
                'approvedByUser',
                'status_info'
            ]
        });
        if (!transfer) {
            return { success: false, message: 'Location transfer not found' };
        }
        return {
            success: true,
            data: {
                location_transfer_id: transfer.location_transfer_id,
                location_transfer_ticket: transfer.location_transfer_ticket,
                asset_title: transfer.assetStock?.asset_data?.asset_title || null,
                system_code: transfer.assetStock?.system_code || null,
                transfer_status_name: transfer.status_info?.working_status_type_name || null,
                working_status_color: transfer.status_info?.working_status_color || null,
                from_location_name: transfer.fromLocation?.location?.location_name || null,
                from_location_type_code: transfer.fromLocation?.location?.location_type_code || null,
                from_location_branch_name: transfer.fromLocation?.branch?.branch_name || null,
                to_location_name: transfer.toLocation?.location?.location_name || null,
                to_location_type_code: transfer.toLocation?.location?.location_type_code || null,
                to_location_branch_name: transfer.toLocation?.branch?.branch_name || null,
                requested_at: transfer.requested_at,
                requested_by: transfer.requested_by,
                completed_at: transfer.completed_at,
                completed_by: transfer.completed_by,
                reason_for_transfer: transfer.reason_for_transfer,
                comment_for_location_transfer: transfer.comment_for_location_transfer
            }
        };
    }
    async exportLocationTransfersToExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const isSelectAll = dto.isSelectAll === true;
            const excludeIds = dto.excludeIds || [];
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.join(' ').trim();
                    if (!value)
                        return;
                    qb.andWhere(`(
              ass.system_code ILIKE :s${index}
              OR ass.stock_serials ILIKE :s${index}
              OR a.asset_title ILIKE :s${index}
              OR fromloc.location_name ILIKE :s${index}
              OR toloc.location_name ILIKE :s${index}
              OR wstatus.working_status_type_name ILIKE :s${index}
            )`, { [`s${index}`]: `%${value}%` });
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
                        case 'transfer_status_id':
                        case 'lt.transfer_status':
                            qb.andWhere('wstatus.working_status_type_id IN (:...transfer_status_id)', {
                                transfer_status_id: cleaned.map(Number),
                            });
                            break;
                        case 'from_location_id':
                            qb.andWhere('fromloc.location_id IN (:...from_location_id)', {
                                from_location_id: cleaned.map(Number),
                            });
                            break;
                        case 'to_location_id':
                            qb.andWhere('toloc.location_id IN (:...to_location_id)', {
                                to_location_id: cleaned.map(Number),
                            });
                            break;
                        case 'from_branch_id':
                            qb.andWhere('frombranch.branch_id IN (:...from_branch_id)', {
                                from_branch_id: cleaned.map(Number),
                            });
                            break;
                        case 'to_branch_id':
                            qb.andWhere('tobranch.branch_id IN (:...to_branch_id)', {
                                to_branch_id: cleaned.map(Number),
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'ass', 'ass.asset_stocks_unique_id = lt.asset_stocks_unique_id')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'a', 'a.asset_id = ass.asset_id')
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'fromlbm', 'fromlbm.location_mapping_id = lt.from_location_id AND fromlbm.is_deleted = 0 AND fromlbm.is_active = 1')
                .leftJoin(locations_entity_1.Locations, 'fromloc', 'fromloc.location_id = fromlbm.location_id')
                .leftJoin(branches_entity_1.Branch, 'frombranch', 'frombranch.branch_id = fromlbm.branch_id')
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'tolbm', 'tolbm.location_mapping_id = lt.to_location_id AND tolbm.is_deleted = 0 AND tolbm.is_active = 1')
                .leftJoin(locations_entity_1.Locations, 'toloc', 'toloc.location_id = tolbm.location_id')
                .leftJoin(branches_entity_1.Branch, 'tobranch', 'tobranch.branch_id = tolbm.branch_id')
                .leftJoin(asset_working_status_entity_1.AssetWorkingStatus, 'wstatus', 'wstatus.working_status_type_id = lt.transfer_status')
                .where('lt.is_deleted = :deleted', { deleted: 0 })
                .andWhere('lt.transfer_status != :completedStatus', {
                completedStatus: 15,
            });
            const qb = buildJoins(this.locationTransferRepo.createQueryBuilder('lt'));
            qb.select([
                'lt.location_transfer_id AS location_transfer_id',
                'ass.system_code AS system_code',
                'ass.stock_serials AS stock_serials',
                'a.asset_title AS asset_title',
                'fromloc.location_name AS from_location',
                'frombranch.branch_name AS from_branch',
                'toloc.location_name AS to_location',
                'tobranch.branch_name AS to_branch',
                'wstatus.working_status_type_name AS transfer_status_name',
                'lt.requested_at AS requested_at',
                'lt.location_transfer_ticket AS location_transfer_ticket',
            ]);
            applySearchAndFilters(qb);
            if (isSelectAll) {
                if (excludeIds.length > 0) {
                    qb.andWhere('lt.location_transfer_id NOT IN (:...excludeIds)', { excludeIds });
                }
            }
            else if (selectedIds.length > 0) {
                qb.andWhere('lt.location_transfer_id IN (:...selectedIds)', { selectedIds });
            }
            qb.groupBy(`
        lt.location_transfer_id, lt.requested_at, lt.location_transfer_ticket,
        ass.system_code, ass.stock_serials, a.asset_title,
        fromloc.location_name, frombranch.branch_name,
        toloc.location_name, tobranch.branch_name,
        wstatus.working_status_type_name
      `);
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(s.column === 'requested_at' ? 'lt.requested_at' : s.column, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('lt.location_transfer_id', 'DESC');
            }
            const data = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Location Transfers');
            const headers = [
                'Sr. No.',
                'Transfer ID',
                'Asset ID',
                'Asset Display Name',
                'From',
                'To',
                'Status',
                'Transfer Date',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.location_transfer_ticket ?? '--');
                sheet.cell(row, 3).value(item.system_code ?? '--');
                sheet.cell(row, 4).value(item.asset_title ?? '--');
                sheet.cell(row, 5).value(item.from_location ?? '--');
                sheet.cell(row, 6).value(item.to_location ?? '--');
                sheet.cell(row, 7).value(item.transfer_status_name ?? '--');
                sheet.cell(row, 8).value(item.requested_at ? new Date(item.requested_at).toLocaleDateString() : '--');
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(headers[i].length + 10);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportLocationTransfersToExcel ERROR:', error);
            throw error;
        }
    }
    async getTransferImpactPreview(schema, hostSerialId, toLocationId) {
        return this.relationshipHookService.getTransferImpactPreview(schema, hostSerialId, toLocationId);
    }
};
exports.LocationTransferService = LocationTransferService;
exports.LocationTransferService = LocationTransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(5, (0, typeorm_1.InjectRepository)(asset_procurement_items_entity_1.AssetProcurementItem)),
    __param(6, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(7, (0, typeorm_1.InjectRepository)(location_transfers_entity_1.LocationTransfer)),
    __param(8, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(9, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(10, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __param(11, (0, typeorm_1.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        notifications_helper_1.NotificationHelper,
        asset_events_service_1.AssetEventsService,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        request_context_service_1.RequestContextService,
        stock_summary_refresh_service_1.StockSummaryRefreshService,
        stocks_service_1.StocksService,
        asset_depreciation_service_1.DepreciationViewService,
        asset_relationship_hook_service_1.AssetRelationshipHookService])
], LocationTransferService);
