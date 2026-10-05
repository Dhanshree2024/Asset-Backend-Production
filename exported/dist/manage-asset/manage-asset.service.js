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
exports.ManageAssetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const asset_events_service_1 = require("../asset-events/asset-events.service");
const asset_events_entity_1 = require("../asset-events/entities/asset-events.entity");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const branch_access_1 = require("../branch-access/branch-access");
const serial_branch_scope_1 = require("../branch-access/serial-branch-scope");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_service_1 = require("../common/mail/mail.service");
const render_email_1 = require("../common/mail/render-email");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const location_transfers_entity_1 = require("../location-transfer/entities/location-transfers.entity");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const maintenance_entity_1 = require("./entities/maintenance.entity");
const scrap_entity_1 = require("./entities/scrap.entity");
const asset_depreciation_service_1 = require("../asset-depreciation/asset-depreciation.service");
const asset_relationship_hook_service_1 = require("../asset-mapping/services/asset-relationship-hook.service");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../assets-data/stocks/entities/asset_procurements.entity");
const stock_summary_refresh_service_1 = require("../assets-data/stocks/stock-summary-refresh.service");
const stocks_service_1 = require("../assets-data/stocks/stocks.service");
const request_context_service_1 = require("../common/context/request-context.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const keyset_pagination_1 = require("../common/pagination/keyset-pagination");
const redis_service_1 = require("../common/redis/redis.service");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const cache_service_helper_1 = require("../utils/cache-service-helper");
let ManageAssetService = class ManageAssetService {
    constructor(mailConfigService, mailService, dataSource, redisService, assetEventsService, notificationHelper, userRepository, assetDatumRepo, stockRepo, assetStockSerials, assetMappingRepo, assetMaintenanceRepo, assetScrapRepo, locationTransfer, assetWorkingStatusRepo, assetProcurementItemRepo, assetProcurementRepo, requestContext, stockSummaryRefresh, depViewService, stocksService, assetRelationshipHookService) {
        this.mailConfigService = mailConfigService;
        this.mailService = mailService;
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.assetEventsService = assetEventsService;
        this.notificationHelper = notificationHelper;
        this.userRepository = userRepository;
        this.assetDatumRepo = assetDatumRepo;
        this.stockRepo = stockRepo;
        this.assetStockSerials = assetStockSerials;
        this.assetMappingRepo = assetMappingRepo;
        this.assetMaintenanceRepo = assetMaintenanceRepo;
        this.assetScrapRepo = assetScrapRepo;
        this.locationTransfer = locationTransfer;
        this.assetWorkingStatusRepo = assetWorkingStatusRepo;
        this.assetProcurementItemRepo = assetProcurementItemRepo;
        this.assetProcurementRepo = assetProcurementRepo;
        this.requestContext = requestContext;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.depViewService = depViewService;
        this.stocksService = stocksService;
        this.assetRelationshipHookService = assetRelationshipHookService;
    }
    refreshStockSummaryFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (orgId && !isNaN(orgId)) {
                this.stockSummaryRefresh.scheduleRefresh(orgId);
                this.depViewService.scheduleRefresh(orgId);
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
    async generateMaintenanceRefId(manager) {
        const lastRecord = await manager
            .createQueryBuilder()
            .select('am.maintenance_ref_id', 'maintenance_ref_id')
            .from(maintenance_entity_1.AssetMaintenance, 'am')
            .orderBy('am.maintenance_id', 'DESC')
            .limit(1)
            .getRawOne();
        let nextNumber = 1;
        if (lastRecord?.maintenance_ref_id) {
            nextNumber =
                parseInt(lastRecord.maintenance_ref_id.split('-')[1], 10) + 1;
        }
        return `MNT-${String(nextNumber).padStart(3, '0')}`;
    }
    async scheduleMaintenanceByAssetId(assetStockIds, schema, userId, isSelectAll, filters, branchIds = [], excludeIds = [], expectedCount) {
        if (isSelectAll) {
            const dto = {
                ...filters,
                getAll: true,
            };
            const result = await this.stocksService.findAllSerials2(dto, userId, branchIds, schema);
            if (result && result.success && Array.isArray(result.data)) {
                assetStockIds = result.data.map((item) => item.asset_stocks_unique_id);
                if (excludeIds && excludeIds.length) {
                    const excludeSet = new Set(excludeIds.map(Number));
                    assetStockIds = assetStockIds.filter(id => !excludeSet.has(Number(id)));
                }
            }
            else {
                assetStockIds = [];
            }
        }
        if (!Array.isArray(assetStockIds) || assetStockIds.length === 0) {
            return { success: false, message: 'No assets provided' };
        }
        assetStockIds = (await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
            runner: this.assetStockSerials.manager,
            schema,
            ids: assetStockIds,
            branchIds,
            label: 'schedule-maintenance',
        })).ids;
        if (!assetStockIds.length) {
            return { success: false, message: 'No assets in your branch access' };
        }
        if (expectedCount != null && Number(expectedCount) !== assetStockIds.length) {
            throw new common_1.ConflictException({
                code: 'SELECTION_DRIFT',
                expected: Number(expectedCount),
                actual: assetStockIds.length,
                message: 'The list changed while you were choosing. Please re-select and try again.',
            });
        }
        const STATUS_DAMAGED = 2;
        const WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE = 8;
        const WORKING_STATUS_MAINTENANCE_COMPLETED = 10;
        const STATUS_DECOMMISSIONED_SCARP = 3;
        let notificationPayloads = [];
        const result = await this.assetStockSerials.manager.transaction(async (manager) => {
            const assetRepo = manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials);
            const assets = await assetRepo.find({
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(assetStockIds),
                    is_deleted: 0,
                },
                relations: ['procurement_item'],
            });
            const blockedAssets = [];
            const transferableAssets = [];
            const existingMaintenance = await manager.find(this.assetMaintenanceRepo.target, {
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(assetStockIds),
                    status_type_id: STATUS_DAMAGED,
                    asset_working_condition_id: (0, typeorm_2.Not)(WORKING_STATUS_MAINTENANCE_COMPLETED),
                    is_deleted: 0,
                },
                select: ['asset_stocks_unique_id'],
            });
            const existingIds = new Set(existingMaintenance.map((e) => e.asset_stocks_unique_id));
            for (const asset of assets) {
                if (Number(asset.current_status_id) === STATUS_DECOMMISSIONED_SCARP) {
                    blockedAssets.push({
                        system_code: asset.system_code,
                        reason: 'Asset is decommissioned',
                        asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    });
                    continue;
                }
                if (existingIds.has(asset.asset_stocks_unique_id)) {
                    blockedAssets.push({
                        system_code: asset.system_code,
                        reason: 'Already in active maintenance',
                        asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    });
                    continue;
                }
                transferableAssets.push(asset);
            }
            if (transferableAssets.length === 0) {
                return {
                    success: false,
                    message: 'No eligible assets to schedule for maintenance',
                    blockedAssets,
                };
            }
            const validIds = transferableAssets.map((a) => a.asset_stocks_unique_id);
            await manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: (0, typeorm_2.In)(validIds) }, {
                current_status_id: STATUS_DAMAGED,
                working_status_type_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
            });
            const updatedAssets = await assetRepo.find({
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(validIds),
                    is_deleted: 0,
                },
                select: ['asset_stocks_unique_id', 'system_code'],
            });
            const systemCodeMap = new Map(updatedAssets.map((a) => [
                a.asset_stocks_unique_id,
                a.system_code ?? null,
            ]));
            const mappingsToUpdate = await manager.find(asset_mapping_entity_1.AssetMappingRepository, {
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(validIds),
                    is_deleted: 0,
                    target_type: (0, typeorm_2.Not)((0, typeorm_2.In)(['SOFTWARE', 'ASSET'])),
                },
            });
            if (mappingsToUpdate.length > 0) {
                const mappingIds = mappingsToUpdate.map((m) => m.mapping_id);
                await manager.update(asset_mapping_entity_1.AssetMappingRepository, { mapping_id: (0, typeorm_2.In)(mappingIds) }, {
                    status_type_id: STATUS_DAMAGED,
                    asset_working_condition_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
                });
            }
            try {
                await this.assetRelationshipHookService.cascadeImpactToChildren(manager, schema, validIds, 'PARENT_UNDER_MAINTENANCE');
            }
            catch (cascadeErr) {
                console.error('Failed to cascade maintenance impact overlay:', cascadeErr);
            }
            const firstRefId = await this.generateMaintenanceRefId(manager);
            let currentNumber = parseInt(firstRefId.split('-')[1], 10);
            const maintenanceRecords = [];
            for (const asset of transferableAssets) {
                const maintenanceRefId = `MNT-${String(currentNumber).padStart(3, '0')}`;
                maintenanceRecords.push(manager.create(this.assetMaintenanceRepo.target, {
                    maintenance_ref_id: maintenanceRefId,
                    asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    asset_id: asset.asset_id,
                    status_type_id: STATUS_DAMAGED,
                    asset_working_condition_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
                    scheduled_date: new Date(),
                    location: asset.procurement_item?.location_id?.toString() ?? null,
                    created_by: userId,
                    updated_by: userId,
                }));
                await this.assetEventsService.generateEvent(manager, {
                    asset_id: asset.asset_id,
                    asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.MAINTENANCE,
                    performed_by: userId,
                    reference_table: 'asset_maintenance',
                    reference_id: null,
                    metadata: {
                        ticket: maintenanceRefId,
                        performed_by: userId,
                        previous_asset_working_condition_id: asset.working_status_type_id,
                        asset_working_condition_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
                        system_code: systemCodeMap.get(asset.asset_stocks_unique_id) ?? null,
                    },
                    title: `Asset Is Schedule For Maintanance`,
                    description: `Asset is scheduled for Maintenance`,
                    event_type_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
                    created_at: new Date(),
                });
                currentNumber++;
            }
            const saved = await manager.save(this.assetMaintenanceRepo.target, maintenanceRecords);
            const updatedUser = await manager.findOne(organizational_user_entity_1.User, {
                where: { user_id: userId },
            });
            const previousWorkingStatusMap = new Map(transferableAssets.map((a) => [
                a.asset_stocks_unique_id,
                a.working_status_type_id,
            ]));
            for (const maintenance of saved) {
                const asset = await manager.findOne(asset_datum_entity_1.AssetDatum, {
                    where: { asset_id: maintenance.asset_id },
                });
                notificationPayloads.push({
                    maintenance,
                    asset,
                    updatedUser,
                    previousWorkingStatusId: previousWorkingStatusMap.get(maintenance.asset_stocks_unique_id),
                    systemCode: systemCodeMap.get(maintenance.asset_stocks_unique_id) ?? null,
                });
            }
            await this.redisService.delByPattern('sidebar-count:*');
            await this.redisService.delByPattern('maintenance-list:*');
            await this.invalidateSerials(schema);
            this.refreshStockSummaryFromContext();
            return {
                success: true,
                message: 'Maintenance scheduled successfully',
                maintenance_ids: saved.map((m) => m.maintenance_id),
                blockedAssets,
            };
        });
        if (result.success) {
            this.sendMaintenanceNotificationsAsync(notificationPayloads).catch((err) => console.error('Notification error (non-blocking):', err));
        }
        this.refreshStockSummaryFromContext();
        return result;
    }
    async invalidateSerials(schema) {
        console.log("INVALIDATE:invalidateSerials ");
        await this.redisService.incr(`serials_version:${schema}`);
    }
    async sendMaintenanceNotificationsAsync(payloads) {
        const MAINTENANCE_EVENT_ID = 28;
        const MAINTENANCE_RESCHEDULE_EVENT_ID = 60;
        const WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE = 8;
        for (const { maintenance, asset, updatedUser, previousWorkingStatusId, systemCode, } of payloads) {
            try {
                const fromStatus = await this.assetMaintenanceRepo.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                    where: { working_status_type_id: previousWorkingStatusId },
                });
                const toStatus = await this.assetMaintenanceRepo.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                    where: {
                        working_status_type_id: WORKING_STATUS_SCHEDULE_FOR_MAINTENANCE,
                    },
                });
                const recipients = [];
                if (updatedUser?.users_business_email) {
                    recipients.push({
                        recipient_type: 'user',
                        recipient_id: String(updatedUser.user_id),
                        recipient_email: updatedUser.users_business_email,
                    });
                }
                const contextData = {
                    asset: {
                        ...asset,
                        system_code: systemCode,
                        status_type_id: toStatus?.working_status_type_name ?? '',
                        from_status_type_id: fromStatus?.working_status_type_name ?? '',
                    },
                    updatedUser,
                };
                await this.notificationHelper.triggerEventNotification({
                    eventId: MAINTENANCE_EVENT_ID,
                    contextData,
                    recipients,
                    meta: { trace_id: maintenance.maintenance_ref_id },
                });
                const secondContext = {
                    asset: {
                        asset_id: systemCode,
                        asset_title: asset?.asset_title ?? '',
                        created_by: `${updatedUser?.first_name ?? ''} ${updatedUser?.last_name ?? ''}`,
                        maintenance_type: maintenance.maintenance_type,
                        schedule_date: new Date().toLocaleDateString('en-GB'),
                        maintenance_ref_id: maintenance.maintenance_ref_id,
                    },
                };
                await this.notificationHelper.triggerEventNotification({
                    eventId: MAINTENANCE_RESCHEDULE_EVENT_ID,
                    contextData: secondContext,
                    recipients,
                    meta: { trace_id: maintenance.maintenance_ref_id },
                });
            }
            catch (err) {
                console.error(`Failed notification for maintenance ${maintenance.maintenance_ref_id}:`, err);
            }
        }
    }
    async getAllMaintenance(dto) {
        console.log("MAINTENANCE DTO", dto);
        try {
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast) || Boolean(dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'maintenance-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id
            });
            console.log("cacheKey", cacheKey);
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log("✅ MAINTENANCE CACHE HIT");
                return cached;
            }
            console.log("❌ MAINTENANCE CACHE MISS");
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            m.maintenance_ref_id ILIKE :s${index}
            OR a.asset_title ILIKE :s${index}
            OR serial.stock_serials ILIKE :s${index}
            OR serial.system_code ILIKE :s${index}
            OR m.maintenance_type ILIKE :s${index}
            OR m.managed_by ILIKE :s${index}
            OR loc.location_name ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
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
                        case 'asset_working_condition_id':
                            qb.andWhere('m.asset_working_condition_id IN (:...asset_working_condition_id)', {
                                asset_working_condition_id: cleaned.map(Number),
                            });
                            break;
                        case 'location':
                            qb.andWhere('m.location IN (:...location)', {
                                location: cleaned,
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin('m.asset_info', 'a')
                .leftJoin('m.asset_serial', 'serial')
                .leftJoin('m.status_info', 'status')
                .leftJoin('m.working_status_info', 'working')
                .leftJoin(locations_entity_1.Locations, 'loc', 'CAST(loc.location_id AS VARCHAR) = m.location')
                .where('m.is_deleted = :deleted', { deleted: 0 })
                .andWhere('m.asset_working_condition_id != :completed', {
                completed: 10,
            });
            const countQb = buildJoins(this.assetMaintenanceRepo.createQueryBuilder('m'));
            applySearchAndFilters(countQb);
            const qb = buildJoins(this.assetMaintenanceRepo.createQueryBuilder('m'));
            qb.select([
                'm.maintenance_id AS maintenance_id',
                'm.maintenance_ref_id AS maintenance_ref_id',
                'm.maintenance_type AS maintenance_type',
                'm.scheduled_date AS scheduled_date',
                'm.managed_by AS managed_by',
                'm.actual_cost AS actual_cost',
                'm.estimated_cost AS estimated_cost',
                'm.priority AS priority',
                'loc.location_name AS location',
                'm.location AS location_id',
                'm.asset_working_condition_id AS asset_working_condition_id',
                'CAST(m.created_at AS TEXT) AS created_at',
                'a.asset_title AS asset_title',
                'a.asset_id AS asset_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.current_status_id AS current_status_id',
                'serial.working_status_type_id AS working_status_type_id',
                'status.status_type_name AS status_type_name',
                'working.working_status_type_name AS working_status_type_name',
            ]);
            applySearchAndFilters(qb);
            qb.groupBy(`
      m.maintenance_id, m.maintenance_ref_id, m.maintenance_type,
      m.scheduled_date, m.managed_by, m.actual_cost, m.estimated_cost,
      m.priority, loc.location_name, m.location, m.asset_working_condition_id, m.created_at,
      a.asset_title, a.asset_id,
      serial.stock_serials, serial.system_code, serial.stock_id,
      serial.asset_stocks_unique_id, serial.current_status_id,
      serial.working_status_type_id,
      status.status_type_name,
      working.working_status_type_name
    `);
            const sortableMap = {
                maintenance_id: 'm.maintenance_id',
                maintenance_ref_id: 'm.maintenance_ref_id',
                maintenance_type: 'm.maintenance_type',
                scheduled_date: 'm.scheduled_date',
                managed_by: 'm.managed_by',
                priority: 'm.priority',
                location: 'm.location',
                asset_title: 'a.asset_title',
                system_code: 'serial.system_code',
                created_at: 'm.created_at',
            };
            const idColumn = 'maintenance_id';
            const idDbColumn = 'm.maintenance_id';
            const defaultSort = { column: 'created_at', order: 'DESC' };
            const activeSortCol = sortArray?.[0]?.column;
            const effectiveSortCol = activeSortCol && sortableMap[activeSortCol]
                ? activeSortCol
                : defaultSort.column;
            const timestampSort = effectiveSortCol === 'created_at' || effectiveSortCol === 'scheduled_date';
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'prev', timestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'next', timestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: cursorToken, direction, timestampSort,
                });
            }
            const countKey = 'maintenance-count:' + JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => countQb.getCount(), 30, knownTotalVal);
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
            const response = {
                success: true,
                message: data.length
                    ? 'Maintenance fetched successfully'
                    : 'No records found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 30);
            return response;
        }
        catch (error) {
            console.error('getAllMaintenance ERROR:', error);
            throw error;
        }
    }
    async getSingleMaintenance(maintenance_id) {
        try {
            const maintenance = await this.assetMaintenanceRepo
                .createQueryBuilder('m')
                .where('m.is_deleted = :deleted', { deleted: 0 })
                .andWhere('m.maintenance_id = :maintenance_id', { maintenance_id })
                .leftJoinAndSelect('m.asset_info', 'asset')
                .leftJoinAndSelect('m.asset_serial', 'serial')
                .leftJoinAndSelect('asset.main_category', 'mainCategory')
                .leftJoinAndSelect('asset.sub_category', 'subCategory')
                .leftJoinAndSelect('asset.asset_item', 'item')
                .leftJoinAndSelect('m.asset_mapping', 'asset_mapping')
                .leftJoinAndSelect('m.status_info', 'status')
                .leftJoinAndSelect('m.working_status_info', 'working_status')
                .getOne();
            if (!maintenance) {
                return {
                    status: 404,
                    message: `No maintenance found for ID ${maintenance_id}`,
                    data: null,
                };
            }
            let location_name = '';
            if (maintenance.location) {
                const loc = await this.assetMaintenanceRepo.manager.findOne(locations_entity_1.Locations, {
                    where: { location_id: Number(maintenance.location) },
                });
                if (loc) {
                    location_name = loc.location_name;
                }
            }
            return {
                status: 200,
                message: 'Maintenance fetched successfully',
                data: {
                    ...maintenance,
                    location_name,
                },
            };
        }
        catch (error) {
            console.error('Error fetching maintenance:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching maintenance',
                error: error.message,
            };
        }
    }
    async updateMaintenance(payload, schema) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        let isTransactionStarted = false;
        try {
            await queryRunner.startTransaction();
            isTransactionStarted = true;
            const { maintenance_id, maintenance_type, scheduled_date, managed_by, priority, estimated_cost, description, location, updated_by, } = payload;
            const WORKING_STATUS_MAINTENANCE_IN_PROGRESS = 9;
            const MAINTENANCE_STATUS = 6;
            const maintenance = await queryRunner.manager.findOne(maintenance_entity_1.AssetMaintenance, {
                where: { maintenance_id, is_deleted: 0 },
            });
            if (!maintenance) {
                if (isTransactionStarted)
                    await queryRunner.rollbackTransaction();
                return {
                    status: 404,
                    message: `Maintenance not found for ID ${maintenance_id}`,
                    data: null,
                };
            }
            maintenance.maintenance_type = maintenance_type;
            maintenance.scheduled_date = scheduled_date;
            maintenance.managed_by = managed_by;
            maintenance.priority = priority;
            maintenance.estimated_cost = estimated_cost;
            maintenance.description = description;
            maintenance.location = location;
            maintenance.updated_by = updated_by;
            maintenance.updated_at = new Date();
            maintenance.asset_working_condition_id =
                WORKING_STATUS_MAINTENANCE_IN_PROGRESS;
            await queryRunner.manager.save(maintenance);
            await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, {
                asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                is_deleted: 0,
            }, {
                current_status_id: MAINTENANCE_STATUS,
                working_status_type_id: WORKING_STATUS_MAINTENANCE_IN_PROGRESS,
            });
            const mappingsToUpdate = await queryRunner.manager.find(asset_mapping_entity_1.AssetMappingRepository, {
                where: {
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    is_deleted: 0,
                },
            });
            if (mappingsToUpdate.length > 0) {
                await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, {
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    is_deleted: 0,
                }, {
                    asset_working_condition_id: WORKING_STATUS_MAINTENANCE_IN_PROGRESS,
                });
            }
            await this.assetEventsService.generateEvent(queryRunner.manager, {
                asset_id: maintenance.asset_id,
                asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                event_category: asset_events_entity_1.AssetEventCategory.MAINTENANCE,
                performed_by: updated_by,
                reference_table: 'asset_maintenance',
                reference_id: maintenance.maintenance_id,
                metadata: {
                    ticket: maintenance.maintenance_ref_id,
                    performed_by: updated_by,
                    previous_asset_working_condition_id: maintenance.asset_working_condition_id,
                    asset_working_condition_id: WORKING_STATUS_MAINTENANCE_IN_PROGRESS,
                    managed_by: maintenance.managed_by,
                },
                title: `Maintenance updated`,
                description: description || `Maintenance is updated.`,
                event_type_id: WORKING_STATUS_MAINTENANCE_IN_PROGRESS,
                created_at: new Date(),
            });
            await queryRunner.commitTransaction();
            await this.redisService.delByPattern('sidebar-count:*');
            await this.redisService.delByPattern('maintenance-list:*');
            await this.invalidateSerials(schema);
            this.refreshStockSummaryFromContext();
            isTransactionStarted = false;
            const MAINTENANCE_EVENT_ID = 28;
            const updatedUser = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                where: { user_id: maintenance.updated_by },
            });
            const asset = await queryRunner.manager.findOne(asset_datum_entity_1.AssetDatum, {
                where: { asset_id: maintenance.asset_id },
            });
            const contextData = {
                asset: { ...asset },
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
                eventId: MAINTENANCE_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: maintenance.maintenance_ref_id,
                },
            });
            try {
                let emailToSend = updatedUser?.users_business_email;
                if (!emailToSend && maintenance.updated_by) {
                    const fallbackUser = await this.dataSource
                        .getRepository(organizational_user_entity_1.User)
                        .createQueryBuilder('u')
                        .select(['u.user_id', 'u.users_business_email'])
                        .where('u.user_id = :id', { id: maintenance.updated_by })
                        .getOne();
                    emailToSend = fallbackUser?.users_business_email;
                }
                if (emailToSend) {
                    const scheduledDateObj = new Date(maintenance.scheduled_date);
                    const html = await (0, render_email_1.renderEmail)(render_email_1.EmailTemplate.MAINTENANCE_RESCHEDULED, {
                        assetName: asset?.asset_title || '',
                        tagNumber: maintenance.asset_stocks_unique_id,
                        date: scheduledDateObj.toLocaleDateString('en-GB'),
                        time: scheduledDateObj.toLocaleTimeString('en-IN', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                        }),
                        reason: description || 'Maintenance updated',
                        ctaLink: '#',
                    }, this.mailConfigService);
                    await this.mailService.sendEmail(emailToSend, 'Maintenance Updated', html);
                }
            }
            catch (e) {
                console.error('Maintenance email failed:', e);
            }
            return {
                status: 200,
                message: 'Maintenance updated successfully',
                data: maintenance,
            };
        }
        catch (error) {
            if (isTransactionStarted) {
                await queryRunner.rollbackTransaction();
            }
            return {
                status: 500,
                message: 'Failed to update maintenance',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateMaintenanceStatus(payload, schema) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        let isTransactionStarted = false;
        try {
            await queryRunner.startTransaction();
            isTransactionStarted = true;
            const { maintenance_id, status_id } = payload;
            const SCRAP_WORKING_STATUS_ID = 12;
            const SCRAP_STATUS_TYPE_ID = 3;
            const WORKING_STATUS_IN_USE = 7;
            const maintenance = await queryRunner.manager.findOne(maintenance_entity_1.AssetMaintenance, {
                where: {
                    maintenance_id,
                    is_deleted: 0,
                },
            });
            if (!maintenance) {
                if (isTransactionStarted) {
                    await queryRunner.rollbackTransaction();
                }
                return {
                    status: 404,
                    message: `Maintenance not found for ID ${maintenance_id}`,
                };
            }
            const mappings = await queryRunner.manager.find(asset_mapping_entity_1.AssetMappingRepository, {
                where: {
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    is_deleted: 0,
                },
            });
            const hasMapping = mappings.length > 0;
            const oldStatusId = maintenance.asset_working_condition_id;
            if (status_id === SCRAP_WORKING_STATUS_ID) {
                await queryRunner.manager.update(maintenance_entity_1.AssetMaintenance, { maintenance_id }, {
                    is_deleted: 1,
                    is_active: 0,
                    updated_at: new Date(),
                });
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, {
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    is_deleted: 0,
                }, {
                    current_status_id: SCRAP_STATUS_TYPE_ID,
                    working_status_type_id: SCRAP_WORKING_STATUS_ID,
                });
                await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, {
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    is_deleted: 0,
                }, {
                    status_type_id: SCRAP_STATUS_TYPE_ID,
                    asset_working_condition_id: SCRAP_WORKING_STATUS_ID,
                });
                const scrapRefId = await this.generateScrapRefId(queryRunner.manager);
                const insertResult = await queryRunner.manager.insert(scrap_entity_1.AssetScrap, {
                    scrap_ref_id: scrapRefId,
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    asset_id: maintenance.asset_id,
                    scrap_date: new Date(),
                    created_by: maintenance.updated_by,
                    updated_by: maintenance.updated_by,
                    status_type_id: SCRAP_STATUS_TYPE_ID,
                    asset_working_condition_id: SCRAP_WORKING_STATUS_ID,
                });
                const scrap_id = insertResult.identifiers[0]?.scrap_id;
                const stock = await queryRunner.manager.findOne(stocks_entity_1.Stock, {
                    where: {
                        asset_id: maintenance.asset_id,
                    },
                });
                if (!stock) {
                    throw new Error('Stock not found');
                }
                if (Number(stock.quantity) <= 0) {
                    throw new Error('Stock already zero');
                }
                stock.quantity = Number(stock.quantity) - 1;
                stock.updated_at = new Date();
                stock.updated_by = maintenance.updated_by;
                await queryRunner.manager.save(stocks_entity_1.Stock, stock);
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: maintenance.asset_id,
                    asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.SCRAPE,
                    performed_by: maintenance.updated_by,
                    reference_table: 'asset_scrap',
                    reference_id: scrap_id,
                    metadata: {
                        ticket: scrapRefId,
                        performed_by: maintenance.updated_by,
                        previous_asset_working_condition_id: oldStatusId,
                        asset_working_condition_id: SCRAP_WORKING_STATUS_ID,
                    },
                    title: `Asset scrapped from Maintenance`,
                    description: `Scrap record created from Maintenance`,
                    event_type_id: SCRAP_WORKING_STATUS_ID,
                    created_at: new Date(),
                });
                await queryRunner.commitTransaction();
                await this.redisService.delByPattern('sidebar-count:*');
                await this.redisService.delByPattern('maintenance-list:*');
                await this.redisService.delByPattern('maintenance-count:*');
                await this.invalidateSerials(schema);
                isTransactionStarted = false;
                this.refreshStockSummaryFromContext();
                return {
                    status: 200,
                    message: 'Asset scrapped successfully',
                };
            }
            maintenance.asset_working_condition_id = status_id;
            const serialUpdatePayload = {
                working_status_type_id: status_id,
            };
            if (status_id === 10) {
                const STATUS_REPARED = 5;
                serialUpdatePayload.current_status_id = STATUS_REPARED;
                maintenance.status_type_id = STATUS_REPARED;
            }
            else if (status_id === 9) {
                serialUpdatePayload.current_status_id = 6;
                maintenance.status_type_id = 6;
            }
            else {
                maintenance.status_type_id = 2;
            }
            maintenance.updated_at = new Date();
            await queryRunner.manager.save(maintenance);
            await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, {
                asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                is_deleted: 0,
            }, serialUpdatePayload);
            await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, {
                asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                is_deleted: 0,
            }, {
                status_type_id: serialUpdatePayload.current_status_id ?? undefined,
                asset_working_condition_id: status_id,
            });
            try {
                if (status_id === 10) {
                    await this.assetRelationshipHookService.clearImpactOnChildren(queryRunner.manager, schema, [Number(maintenance.asset_stocks_unique_id)]);
                }
                else if ([9, 2].includes(status_id) || [2, 6].includes(Number(serialUpdatePayload.current_status_id))) {
                    await this.assetRelationshipHookService.cascadeImpactToChildren(queryRunner.manager, schema, [Number(maintenance.asset_stocks_unique_id)], 'PARENT_UNDER_MAINTENANCE');
                }
            }
            catch (impactErr) {
                console.error('Failed to update maintenance impact overlay:', impactErr);
            }
            await this.assetEventsService.generateEvent(queryRunner.manager, {
                asset_id: maintenance.asset_id,
                asset_stocks_unique_id: maintenance.asset_stocks_unique_id,
                event_category: asset_events_entity_1.AssetEventCategory.MAINTENANCE,
                performed_by: maintenance.updated_by,
                reference_table: 'asset_maintenance',
                reference_id: maintenance.maintenance_id,
                metadata: {
                    ticket: maintenance.maintenance_ref_id,
                    performed_by: maintenance.updated_by,
                    previous_asset_working_condition_id: oldStatusId,
                    asset_working_condition_id: status_id,
                },
                title: `Maintenance status updated for asset`,
                description: `Maintenance status changed`,
                event_type_id: status_id,
            });
            await queryRunner.commitTransaction();
            await this.redisService.delByPattern('sidebar-count:*');
            await this.redisService.delByPattern('maintenance-list:*');
            await this.redisService.delByPattern('maintenance-count:*');
            await this.invalidateSerials(schema);
            isTransactionStarted = false;
            this.refreshStockSummaryFromContext();
            const MAINTENANCE_EVENT_ID = 28;
            const updatedUser = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                where: {
                    user_id: maintenance.updated_by,
                },
            });
            const asset = await queryRunner.manager.findOne(asset_datum_entity_1.AssetDatum, {
                where: {
                    asset_id: maintenance.asset_id,
                },
            });
            const fromStatus = await queryRunner.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: {
                    working_status_type_id: oldStatusId,
                },
            });
            const toStatus = await queryRunner.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: {
                    working_status_type_id: status_id,
                },
            });
            const contextData = {
                asset: {
                    ...asset,
                    status_type_id: toStatus?.working_status_type_name ?? '',
                    from_status_type_id: fromStatus?.working_status_type_name ?? '',
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
                eventId: MAINTENANCE_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: maintenance.maintenance_ref_id,
                },
            });
            return {
                status: 200,
                message: 'Maintenance status updated successfully',
            };
        }
        catch (error) {
            if (isTransactionStarted) {
                await queryRunner.rollbackTransaction();
            }
            console.error('Update Maintenance Status Error:', error);
            return {
                status: 500,
                message: 'Failed to update maintenance status',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async generateScrapRefId(manager) {
        const lastRecord = await manager
            .createQueryBuilder()
            .select('as.scrap_ref_id', 'scrap_ref_id')
            .from(scrap_entity_1.AssetScrap, 'as')
            .orderBy('as.scrap_id', 'DESC')
            .limit(1)
            .getRawOne();
        let nextNumber = 1;
        if (lastRecord?.scrap_ref_id) {
            nextNumber = parseInt(lastRecord.scrap_ref_id.split('-')[1], 10) + 1;
        }
        return `SCR-${String(nextNumber).padStart(3, '0')}`;
    }
    async markAssetsForScrapByMappingId(stockIds, userId, schema, isSelectAll, filters, branchIds = [], excludeIds = [], expectedCount) {
        if (isSelectAll) {
            const dto = {
                ...filters,
                getAll: true,
            };
            const result = await this.stocksService.findAllSerials2(dto, userId, branchIds, schema);
            if (result && result.success && Array.isArray(result.data)) {
                stockIds = result.data.map((item) => item.asset_stocks_unique_id);
                if (excludeIds && excludeIds.length) {
                    const excludeSet = new Set(excludeIds.map(Number));
                    stockIds = stockIds.filter(id => !excludeSet.has(Number(id)));
                }
            }
            else {
                stockIds = [];
            }
        }
        if (!Array.isArray(stockIds) || stockIds.length === 0) {
            return { success: false, message: 'No assets provided' };
        }
        stockIds = [...new Set(stockIds)];
        stockIds = (await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
            runner: this.assetStockSerials.manager,
            schema,
            ids: stockIds,
            branchIds,
            label: 'mark-for-scrap',
        })).ids;
        if (!stockIds.length) {
            return { success: false, message: 'No assets in your branch access' };
        }
        if (expectedCount != null && Number(expectedCount) !== stockIds.length) {
            throw new common_1.ConflictException({
                code: 'SELECTION_DRIFT',
                expected: Number(expectedCount),
                actual: stockIds.length,
                message: 'The list changed while you were choosing. Please re-select and try again.',
            });
        }
        const STATUS_SCRAPPED = 3;
        const WORKING_STATUS_SCRAPPED = 13;
        const STATUS_DAMAGED = 2;
        const WORKING_STATUS_MAINTENANCE_COMPLETED = 10;
        const scrapResult = await this.assetStockSerials.manager.transaction(async (manager) => {
            const serialRepo = manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials);
            const assets = await serialRepo.find({
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(stockIds),
                    is_deleted: 0,
                },
            });
            if (!assets.length) {
                return { success: false, message: 'Assets not found' };
            }
            const blockedAssets = [];
            const activeHostServersQuery = `
        SELECT DISTINCT 

          (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) AS host_serial_id,
          COALESCE(ass_host.system_code, 'ID ' || (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END)::text) AS host_system_code,
          COUNT(m.mapping_id) as vm_count
          
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.asset_stock_serials ass_source ON ass_source.asset_stocks_unique_id = m.asset_stocks_unique_id
        LEFT JOIN ${schema}.assets a_source ON a_source.asset_id = ass_source.asset_id
        LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END)
        WHERE m.relation_type = 'REL-010'
          AND m.is_active = 1
          AND m.is_deleted = 0
          AND (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) = ANY($1::int[])
        GROUP BY (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END), ass_host.system_code;
      `;
            const activeHostServers = await manager.query(activeHostServersQuery, [stockIds]);
            const hostServerMap = new Map();
            for (const h of activeHostServers || []) {
                hostServerMap.set(Number(h.host_serial_id), {
                    system_code: h.host_system_code,
                    vm_count: Number(h.vm_count),
                });
            }
            const scrapableAssets = [];
            for (const asset of assets) {
                console.log('asset:1', asset);
                if (Number(asset.current_status_id) === STATUS_SCRAPPED) {
                    blockedAssets.push({
                        asset_stocks_unique_id: asset.asset_stocks_unique_id,
                        system_code: asset.system_code,
                        reason: 'Asset already marked as scrap',
                    });
                    continue;
                }
                if (hostServerMap.has(asset.asset_stocks_unique_id)) {
                    const info = hostServerMap.get(asset.asset_stocks_unique_id);
                    blockedAssets.push({
                        asset_stocks_unique_id: asset.asset_stocks_unique_id,
                        system_code: asset.system_code,
                        reason: `Host server currently hosts ${info?.vm_count || 1} active virtual machine(s). Migrate or unlink VMs first.`,
                    });
                    continue;
                }
                scrapableAssets.push(asset);
            }
            if (!scrapableAssets.length) {
                return {
                    success: false,
                    message: 'No assets eligible for scrap',
                    blockedAssets,
                };
            }
            const scrapableIds = scrapableAssets.map((a) => a.asset_stocks_unique_id);
            await this.assetRelationshipHookService.validatePreScrap(manager, schema, scrapableIds);
            await this.assetRelationshipHookService.handlePostScrap(manager, schema, scrapableIds, userId);
            const activeMappings = await manager.find(asset_mapping_entity_1.AssetMappingRepository, {
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(scrapableIds),
                    is_active: 1,
                    is_deleted: 0,
                    target_type: (0, typeorm_2.Not)((0, typeorm_2.In)(['SOFTWARE', 'ASSET'])),
                },
            });
            if (activeMappings.length) {
                await manager.update(asset_mapping_entity_1.AssetMappingRepository, {
                    mapping_id: (0, typeorm_2.In)(activeMappings.map((m) => m.mapping_id)),
                }, {
                    is_active: 0,
                    target_type: null,
                    target_id: null,
                    updated_at: new Date(),
                });
            }
            const autoReturnedCount = activeMappings.length;
            await manager.update(this.assetMaintenanceRepo.target, {
                asset_stocks_unique_id: (0, typeorm_2.In)(scrapableIds),
                status_type_id: STATUS_DAMAGED,
                asset_working_condition_id: (0, typeorm_2.Not)(WORKING_STATUS_MAINTENANCE_COMPLETED),
                is_deleted: 0,
            }, {
                is_deleted: 1,
                is_active: 0,
                updated_at: new Date(),
                updated_by: userId,
            });
            await manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: (0, typeorm_2.In)(scrapableIds) }, {
                current_status_id: STATUS_SCRAPPED,
                working_status_type_id: WORKING_STATUS_SCRAPPED,
            });
            const mappings = await manager.find(asset_mapping_entity_1.AssetMappingRepository, {
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(scrapableIds),
                    is_deleted: 0,
                },
            });
            if (mappings.length > 0) {
                await manager.update(asset_mapping_entity_1.AssetMappingRepository, { asset_stocks_unique_id: (0, typeorm_2.In)(scrapableIds) }, { status_type_id: STATUS_SCRAPPED });
            }
            const firstRefId = await this.generateScrapRefId(manager);
            let currentNumber = parseInt(firstRefId.split('-')[1], 10);
            const scrapRecords = [];
            for (const asset of scrapableAssets) {
                const scrapRef = `SCR-${String(currentNumber).padStart(3, '0')}`;
                const scrapEntity = manager.create(scrap_entity_1.AssetScrap, {
                    scrap_ref_id: scrapRef,
                    asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    asset_id: asset.asset_id,
                    scrap_date: new Date(),
                    status_type_id: STATUS_SCRAPPED,
                    asset_working_condition_id: WORKING_STATUS_SCRAPPED,
                    created_by: userId,
                    updated_by: userId,
                });
                scrapRecords.push(scrapEntity);
                await this.assetEventsService.generateEvent(manager, {
                    asset_id: asset.asset_id,
                    asset_stocks_unique_id: asset.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.SCRAPE,
                    performed_by: userId,
                    reference_table: 'asset_scrap',
                    reference_id: null,
                    metadata: {
                        ticket: scrapRef,
                        performed_by: userId,
                        previous_asset_working_condition_id: asset.working_status_type_id,
                        asset_working_condition_id: WORKING_STATUS_SCRAPPED,
                    },
                    title: `Asset marked as scrap`,
                    description: `Asset was marked as scrap by user`,
                    event_type_id: WORKING_STATUS_SCRAPPED,
                    created_at: new Date(),
                });
                currentNumber++;
            }
            const saved = await manager.save(scrap_entity_1.AssetScrap, scrapRecords);
            const previousWorkingStatusMap = new Map();
            for (const asset of scrapableAssets) {
                previousWorkingStatusMap.set(asset.asset_stocks_unique_id, asset.working_status_type_id);
            }
            const SCRAP_EVENT_ID = 28;
            const updatedUser = await manager.findOne(organizational_user_entity_1.User, {
                where: { user_id: userId },
            });
            const allStatuses = await manager.find(asset_working_status_entity_1.AssetWorkingStatus);
            const statusMap = new Map(allStatuses.map((s) => [
                s.working_status_type_id,
                s.working_status_type_name,
            ]));
            for (const scrap of saved) {
                const asset = await manager.findOne(asset_datum_entity_1.AssetDatum, {
                    where: { asset_id: scrap.asset_id },
                });
                const previousWorkingStatusId = previousWorkingStatusMap.get(scrap.asset_stocks_unique_id);
                const fromStatusName = statusMap.get(previousWorkingStatusId) ?? '';
                const toStatusName = statusMap.get(WORKING_STATUS_SCRAPPED) ?? '';
                const contextData = {
                    asset: {
                        ...asset,
                        status_type_id: toStatusName,
                        from_status_type_id: fromStatusName,
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
                    eventId: SCRAP_EVENT_ID,
                    contextData,
                    recipients,
                    meta: {
                        trace_id: scrap.scrap_ref_id,
                    },
                });
            }
            this.redisService.delByPattern('sidebar-count:*');
            this.redisService.delByPattern('scrap-list:*');
            await this.invalidateSerials(schema);
            return {
                success: true,
                message: blockedAssets.length > 0
                    ? `Marked ${saved.length} asset(s) for scrap. ${blockedAssets.length} skipped.`
                    : 'Assets successfully marked for scrap',
                scrap_ids: saved.map((s) => s.scrap_id),
                processedCount: saved.length,
                skippedCount: blockedAssets.length,
                autoReturnedCount,
                blockedAssets,
            };
        });
        this.refreshStockSummaryFromContext();
        return scrapResult;
    }
    async getAllScrap(dto) {
        console.log("SCRAP DTO", dto);
        try {
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast) || Boolean(dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'scrap-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id
            });
            console.log("cacheKey", cacheKey);
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log("✅ SCRAP CACHE HIT");
                return cached;
            }
            console.log("❌ SCRAP CACHE MISS");
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            s.scrap_ref_id ILIKE :s${index}
            OR asset.asset_title ILIKE :s${index}
            OR serial.stock_serials ILIKE :s${index}
            OR serial.system_code ILIKE :s${index}
            OR s.scrap_reason ILIKE :s${index}
            OR s.disposal_method ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
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
                        case 'asset_working_condition_id':
                            qb.andWhere('s.asset_working_condition_id IN (:...asset_working_condition_id)', {
                                asset_working_condition_id: cleaned.map(Number),
                            });
                            break;
                        case 'disposal_method':
                            qb.andWhere('s.disposal_method IN (:...disposal_method)', {
                                disposal_method: cleaned,
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin('s.asset_serial', 'serial')
                .leftJoin('s.asset_info', 'asset')
                .leftJoin('s.status_info', 'status')
                .leftJoin('s.working_status_info', 'working')
                .where('s.is_deleted = :deleted', { deleted: 0 });
            const countQb = buildJoins(this.assetScrapRepo.createQueryBuilder('s'));
            applySearchAndFilters(countQb);
            const qb = buildJoins(this.assetScrapRepo.createQueryBuilder('s'));
            qb.select([
                's.scrap_id AS scrap_id',
                's.scrap_ref_id AS scrap_ref_id',
                's.scrap_date AS scrap_date',
                's.disposal_method AS disposal_method',
                's.scrap_reason AS scrap_reason',
                's.status_type_id AS status_type_id',
                's.asset_working_condition_id AS asset_working_condition_id',
                's.approved_by AS approved_by',
                'CAST(s.created_at AS TEXT) AS created_at',
                'CAST(s.updated_at AS TEXT) AS updated_at',
                'asset.asset_title AS asset_title',
                'asset.asset_id AS asset_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.current_status_id AS current_status_id',
                'serial.working_status_type_id AS working_status_type_id',
                'status.status_type_name AS status_type_name',
                'working.working_status_type_name AS working_status_type_name',
                'working.working_status_color AS working_status_color',
            ]);
            applySearchAndFilters(qb);
            qb.groupBy(`
      s.scrap_id, s.scrap_ref_id, s.scrap_date,
      s.disposal_method, s.scrap_reason,
      s.status_type_id, s.asset_working_condition_id,
      s.approved_by, s.created_at, s.updated_at,
      asset.asset_title, asset.asset_id,
      serial.stock_serials, serial.system_code, serial.stock_id,
      serial.asset_stocks_unique_id, serial.current_status_id,
      serial.working_status_type_id,
      status.status_type_name,
      working.working_status_type_name,
      working.working_status_color
    `);
            const sortableMap = {
                scrap_id: 's.scrap_id',
                scrapId: 's.scrap_id',
                scrap_ref_id: 's.scrap_ref_id',
                scrapRefId: 's.scrap_ref_id',
                asset_code: 'serial.system_code',
                assetCode: 'serial.system_code',
                system_code: 'serial.system_code',
                systemCode: 'serial.system_code',
                asset_name: 'asset.asset_title',
                assetName: 'asset.asset_title',
                asset_title: 'asset.asset_title',
                asset: 'asset.asset_title',
                scrap_reason: 's.scrap_reason',
                scrapReason: 's.scrap_reason',
                reason: 's.scrap_reason',
                scrap_date: 's.scrap_date',
                scrapDate: 's.scrap_date',
                approved_by: 's.approved_by',
                approvedBy: 's.approved_by',
                workingCondition: 'working.working_status_type_name',
                working_condition_id: 's.asset_working_condition_id',
                disposal_method: 's.disposal_method',
                disposalMethod: 's.disposal_method',
                created_at: 's.created_at',
                updated_at: 's.updated_at',
            };
            const idColumn = 'scrap_id';
            const idDbColumn = 's.scrap_id';
            const defaultSort = { column: 'created_at', order: 'DESC' };
            const activeSortCol = sortArray?.[0]?.column;
            const effectiveSortCol = activeSortCol && sortableMap[activeSortCol]
                ? activeSortCol
                : defaultSort.column;
            const timestampSort = effectiveSortCol === 'created_at' ||
                effectiveSortCol === 'updated_at' ||
                effectiveSortCol === 'scrap_date';
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'prev', timestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: null, direction: 'next', timestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb, columnMap: sortableMap, sort: sortArray, defaultSort,
                    idColumn, idDbColumn, cursor: cursorToken, direction, timestampSort,
                });
            }
            const countKey = 'scrap-count:' + JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => countQb.getCount(), 30, knownTotalVal);
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const mapRow = (record) => ({
                id: record.scrap_id?.toString() || '',
                scrapRefId: record.scrap_ref_id || '',
                asset: record.asset_title || '-',
                assetCode: record.system_code || '-',
                serialNo: record.stock_serials || '-',
                asset_id: record.asset_id || '-',
                stock_id: record.stock_id || '-',
                asset_stocks_unique_id: record.asset_stocks_unique_id || '-',
                scrapDate: record.scrap_date || null,
                disposalMethod: record.disposal_method || '-',
                scrapReason: record.scrap_reason || '-',
                workingCondition: record.working_status_type_name || '-',
                workingConditionId: record.working_status_type_id || '-',
                statusId: record.status_type_id,
                statusName: record.status_type_name || '-',
                statuscolour: record.working_status_color || '-',
                approved_by: record.approved_by,
                created_at: record.created_at,
                updated_at: record.updated_at,
            });
            let data;
            let meta;
            if (usingOffset) {
                const first = rawRows[0];
                const last = rawRows[rawRows.length - 1];
                data = rawRows.map(mapRow);
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
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > page.data.length;
                }
                const mapped = page.data.map(mapRow);
                data = mapped;
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: { ...page, data: mapped },
                    limit, total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Scrap records fetched successfully'
                    : 'No records found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 30);
            return response;
        }
        catch (error) {
            console.error('getAllScrap ERROR:', error);
            throw error;
        }
    }
    async getSingleScrap(scrap_id) {
        try {
            const scrap = await this.assetScrapRepo
                .createQueryBuilder('s')
                .where('s.is_deleted = :deleted', { deleted: 0 })
                .andWhere('s.scrap_id = :scrap_id', { scrap_id })
                .leftJoinAndSelect('s.asset_serial', 'serial')
                .leftJoinAndSelect('s.asset_info', 'asset')
                .leftJoinAndSelect('s.status_info', 'status')
                .leftJoinAndSelect('s.working_status_info', 'working')
                .leftJoinAndSelect('s.vendor_info', 'vendor')
                .getOne();
            if (!scrap) {
                return {
                    status: 404,
                    message: `No scrap record found for ID ${scrap_id}`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Scrap record fetched successfully',
                data: scrap,
            };
        }
        catch (error) {
            console.error('Error fetching scrap detail:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching scrap details',
                error: error.message,
            };
        }
    }
    async updateScrap(payload, schema) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        console.log("POINT:1", payload);
        const notificationPayloads = [];
        await queryRunner.startTransaction();
        try {
            const { scrap_ids, ...dto } = payload;
            const updatedRecords = [];
            for (const scrap_id of scrap_ids) {
                const scrap = await queryRunner.manager.findOne(scrap_entity_1.AssetScrap, {
                    where: { scrap_id },
                });
                if (!scrap) {
                    await queryRunner.rollbackTransaction();
                    return {
                        status: 404,
                        message: `Scrap record not found for ID ${scrap_id}`,
                        data: null,
                    };
                }
                const previousDisposalMethod = scrap.disposal_method;
                const currentDto = { ...dto };
                Object.keys(currentDto).forEach((key) => {
                    if (currentDto[key] === '' || currentDto[key] === 'null') {
                        currentDto[key] = null;
                    }
                });
                currentDto.scrapValue = currentDto.scrapValue != null ? Number(currentDto.scrapValue) : null;
                currentDto.finalAuctionValue = currentDto.finalAuctionValue != null ? Number(currentDto.finalAuctionValue) : null;
                currentDto.vendorId = currentDto.vendorId != null ? Number(currentDto.vendorId) : null;
                currentDto.condition = currentDto.condition != null ? Number(currentDto.condition) : null;
                scrap.vendor_id = currentDto.vendorId;
                Object.assign(scrap, currentDto);
                const setIfPresent = (col, val) => {
                    if (val !== undefined)
                        scrap[col] = val;
                };
                setIfPresent('scrap_date', currentDto.scrapDate);
                setIfPresent('scrap_reason', currentDto.reason);
                setIfPresent('asset_working_condition_id', currentDto.condition);
                setIfPresent('disposal_method', currentDto.disposalMethod);
                setIfPresent('pickup_date', currentDto.pickupDate);
                setIfPresent('scrap_value', currentDto.scrapValue);
                setIfPresent('reference_invoice_no', currentDto.referenceInvoiceNo);
                setIfPresent('certificate_of_disposal', currentDto.certificateOfDisposal);
                setIfPresent('donated_to', currentDto.donatedTo);
                setIfPresent('handover_date', currentDto.handoverDate);
                setIfPresent('asset_condition', currentDto.assetCondition);
                setIfPresent('donation_letter_no', currentDto.donationLetterNo);
                setIfPresent('authorization_approval', currentDto.authorizationApproval);
                setIfPresent('auction_reference_no', currentDto.auctionReferenceNo);
                setIfPresent('auction_date', currentDto.auctionDate);
                setIfPresent('final_auction_value', currentDto.finalAuctionValue);
                setIfPresent('buyer_details', currentDto.buyerDetails);
                setIfPresent('approval_document', currentDto.approvalDocument);
                setIfPresent('approved_by', currentDto.approvedBy);
                setIfPresent('scrapped_by', currentDto.scrappedBy);
                setIfPresent('notes', currentDto.notes);
                scrap.updated_at = new Date();
                const updated = await queryRunner.manager.save(scrap_entity_1.AssetScrap, scrap);
                updatedRecords.push(updated);
                const shouldReduceStock = previousDisposalMethod == null && updated.disposal_method != null;
                if (shouldReduceStock) {
                    const stock = await queryRunner.manager.findOne(stocks_entity_1.Stock, {
                        where: { asset_id: updated.asset_id },
                    });
                    if (!stock)
                        throw new Error('Stock not found for this asset');
                    if (Number(stock.quantity) <= 0)
                        throw new Error('Stock quantity already zero');
                    stock.quantity = Number(stock.quantity) - 1;
                    stock.updated_at = new Date();
                    stock.updated_by = updated.updated_by;
                    await queryRunner.manager.save(stocks_entity_1.Stock, stock);
                }
                const SCRAP_STATUS_TYPE_ID = 3;
                const SCRAP_WORKING_STATUS_ID = 12;
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, {
                    asset_stocks_unique_id: updated.asset_stocks_unique_id,
                    is_deleted: 0,
                }, {
                    current_status_id: SCRAP_STATUS_TYPE_ID,
                    working_status_type_id: SCRAP_WORKING_STATUS_ID,
                });
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: updated.asset_id,
                    asset_stocks_unique_id: updated.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.SCRAPE,
                    performed_by: updated.updated_by,
                    reference_table: 'asset_scrap',
                    reference_id: updated.scrap_id,
                    metadata: {
                        ticket: scrap.scrap_ref_id,
                        performed_by: updated.updated_by,
                        approved_by: updated.approved_by,
                        scrapped_by: updated.scrapped_by,
                        notes: updated.notes,
                        previous_asset_working_condition_id: scrap.asset_working_condition_id,
                        asset_working_condition_id: SCRAP_WORKING_STATUS_ID,
                    },
                    title: `Scrap Record updated for asset`,
                    description: `Scrap Record updated`,
                    event_type_id: updated.asset_working_condition_id,
                });
                const updatedUser = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                    where: {
                        user_id: updated.updated_by,
                    },
                });
                const asset = await queryRunner.manager.findOne(asset_datum_entity_1.AssetDatum, {
                    where: {
                        asset_id: updated.asset_id,
                    },
                });
                notificationPayloads.push({
                    scrapRefId: scrap.scrap_ref_id,
                    assetStocksUniqueId: updated.asset_stocks_unique_id,
                    updatedUser,
                    asset,
                });
            }
            await queryRunner.commitTransaction();
            for (const payloadItem of notificationPayloads) {
                if (payloadItem) {
                    console.log("notificationPayload:2", payloadItem);
                    this.sendScrapNotificationsAsync(payloadItem).catch((err) => console.error('Scrap notification error:', err));
                }
            }
            this.redisService.delByPattern('scrap-list:*');
            this.redisService.delByPattern('sidebar-count:*');
            this.refreshStockSummaryFromContext();
            this.invalidateSerials(schema);
            return {
                status: 200,
                message: 'Scrap records updated successfully',
                data: updatedRecords,
            };
        }
        catch (error) {
            try {
                await queryRunner.rollbackTransaction();
            }
            catch (_) { }
            return {
                status: 500,
                message: 'Failed to update scrap record',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async sendScrapNotificationsAsync(payload) {
        try {
            const SCRAP_EVENT_ID = 31;
            const { updatedUser, asset } = payload;
            const recipients = [];
            if (updatedUser?.users_business_email) {
                recipients.push({
                    recipient_type: 'user',
                    recipient_id: String(updatedUser.user_id),
                    recipient_email: updatedUser.users_business_email,
                });
            }
            await this.notificationHelper.triggerEventNotification({
                eventId: SCRAP_EVENT_ID,
                contextData: {
                    asset: asset ? { ...asset } : null,
                    updatedUser,
                },
                recipients,
                meta: {
                    trace_id: payload.scrapRefId,
                },
            });
        }
        catch (err) {
            console.error(`Failed scrap notification for ${payload.scrapRefId}:`, err);
        }
    }
    async updateScrapStatus(payload) {
        try {
            const { scrap_id, status_id, schema, login_user_id } = payload;
            const scrap = await this.assetScrapRepo.findOne({
                where: { scrap_id },
            });
            if (!scrap) {
                return {
                    status: 404,
                    message: `Scrap record not found for ID ${scrap_id}`,
                    data: null,
                };
            }
            scrap.asset_working_condition_id = status_id;
            scrap.updated_at = new Date();
            await this.assetScrapRepo.save(scrap);
            const SCRAP_EVENT_ID = 31;
            const updatedUser = await this.userRepository.findOne({
                where: { user_id: scrap.updated_by },
            });
            const asset = await this.assetDatumRepo.findOne({
                where: { asset_id: scrap.asset_id },
            });
            const contextData = {
                asset: {
                    ...asset,
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
                eventId: SCRAP_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: scrap.scrap_ref_id,
                },
            });
            console.log("REDIS UPDATE: SCRAPE UPDATE");
            this.redisService.delByPattern('scrap-list:*');
            this.redisService.delByPattern('sidebar-count:*');
            this.refreshStockSummaryFromContext();
            this.invalidateSerials(schema);
            return {
                status: 200,
                message: 'Scrap status updated successfully',
            };
        }
        catch (error) {
            console.error('Update Scrap Status Error:', error);
            return {
                status: 500,
                message: 'Failed to update scrap status',
                error: error.message,
            };
        }
    }
    async markOverdueMaintenance(schema) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const now = new Date();
            const scheduledStatusId = 8;
            const overdueStatusId = 11;
            const maintenanceList = await queryRunner.manager.find(maintenance_entity_1.AssetMaintenance, {
                where: {
                    scheduled_date: (0, typeorm_2.LessThan)(now),
                    asset_working_condition_id: scheduledStatusId,
                },
            });
            for (const maintenance of maintenanceList) {
                const previousStatus = maintenance.asset_working_condition_id;
                maintenance.asset_working_condition_id = overdueStatusId;
                maintenance.updated_at = new Date();
                const updated = await queryRunner.manager.save(maintenance);
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: updated.asset_id,
                    asset_stocks_unique_id: updated.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.MAINTENANCE,
                    performed_by: 0,
                    reference_table: 'asset_maintenance',
                    reference_id: updated.maintenance_id,
                    metadata: {
                        ticket: maintenance.maintenance_ref_id,
                        performed_by: null,
                        previous_asset_working_condition_id: maintenance.asset_working_condition_id,
                        asset_working_condition_id: overdueStatusId,
                    },
                    title: `Maintenance overdue for asset`,
                    description: `Maintenance automatically marked as overdue`,
                    event_type_id: overdueStatusId,
                    created_at: new Date(),
                });
            }
            await queryRunner.commitTransaction();
            this.redisService.delByPattern('scrap-list:*');
            this.redisService.delByPattern('sidebar-count:*');
            this.refreshStockSummaryFromContext();
            this.invalidateSerials(schema);
            return {
                status: 200,
                message: `${maintenanceList.length} maintenance(s) marked as overdue`,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            return {
                status: 500,
                message: 'Failed to mark overdue maintenance',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async manageAssetsSidebarCount(branchIds = []) {
        console.log("manageAssetsSidebarCount:POINT:1");
        try {
            const cacheKey = `sidebar-count:${branchIds.sort().join(',')}`;
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('SIDE BAR COUNT:REDIS HIT');
                return cached;
            }
            console.log('REDIS MISS');
            let transferQb = this.locationTransfer
                .createQueryBuilder('lt')
                .where('lt.transfer_status = :status', { status: 16 })
                .andWhere('lt.is_active = :active', { active: 1 })
                .andWhere('lt.is_deleted = :deleted', { deleted: 0 });
            transferQb = (0, branch_access_1.applyBranchFilter)({
                qb: transferQb,
                entityKey: 'LocationTransfer',
                branchIds,
            });
            const transferPending = await transferQb.getCount();
            let maintenanceQb = this.assetMaintenanceRepo
                .createQueryBuilder('m')
                .where('m.asset_working_condition_id IN (:...statuses)', {
                statuses: [8, 11],
            })
                .andWhere('m.is_active = :active', { active: 1 })
                .andWhere('m.is_deleted = :deleted', { deleted: 0 });
            maintenanceQb = (0, branch_access_1.applyBranchFilter)({
                qb: maintenanceQb,
                entityKey: 'AssetMaintenance',
                branchIds,
            });
            const repairPending = await maintenanceQb.getCount();
            let scrapQb = this.assetScrapRepo
                .createQueryBuilder('s')
                .where('s.asset_working_condition_id = :status', {
                status: 13,
            })
                .andWhere('s.is_active = :active', { active: 1 })
                .andWhere('s.is_deleted = :deleted', { deleted: 0 });
            scrapQb = (0, branch_access_1.applyBranchFilter)({
                qb: scrapQb,
                entityKey: 'AssetScrap',
                branchIds,
            });
            const scrapPending = await scrapQb.getCount();
            let renewalQb = this.assetProcurementRepo
                .createQueryBuilder('p')
                .leftJoin('asset_procurement_items', 'api', 'api.procurement_id = p.procurement_id')
                .where('p.renewal_status = :status', {
                status: 22,
            });
            renewalQb = (0, branch_access_1.applyBranchFilter)({
                qb: renewalQb,
                entityKey: 'AssetProcurementItem',
                branchIds,
            });
            const renewalPending = await renewalQb.getCount();
            const totalPending = transferPending +
                repairPending +
                scrapPending +
                renewalPending;
            const response = {
                status: 200,
                message: 'Manage asset sidebar count fetched successfully',
                totalPending,
                breakdown: {
                    transfer: transferPending,
                    repair: repairPending,
                    scrap: scrapPending,
                    renewal: renewalPending,
                },
            };
            await this.redisService.set(cacheKey, response, 60);
            return response;
        }
        catch (error) {
            console.error('Error fetching manage asset sidebar counts:', error);
            return {
                status: 500,
                message: 'Failed to fetch manage asset sidebar counts',
                error: error.message,
            };
        }
    }
    async exportMaintenanceToExcel(dto) {
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
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            m.maintenance_ref_id ILIKE :s${index}
            OR a.asset_title ILIKE :s${index}
            OR serial.stock_serials ILIKE :s${index}
            OR serial.system_code ILIKE :s${index}
            OR m.maintenance_type ILIKE :s${index}
            OR m.managed_by ILIKE :s${index}
            OR loc.location_name ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
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
                        case 'asset_working_condition_id':
                            qb.andWhere('m.asset_working_condition_id IN (:...asset_working_condition_id)', {
                                asset_working_condition_id: cleaned.map(Number),
                            });
                            break;
                        case 'location':
                            qb.andWhere('m.location IN (:...location)', {
                                location: cleaned,
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin('m.asset_info', 'a')
                .leftJoin('m.asset_serial', 'serial')
                .leftJoin('m.status_info', 'status')
                .leftJoin('m.working_status_info', 'working')
                .leftJoin(locations_entity_1.Locations, 'loc', 'CAST(loc.location_id AS VARCHAR) = m.location')
                .where('m.is_deleted = :deleted', { deleted: 0 })
                .andWhere('m.asset_working_condition_id != :completed', {
                completed: 10,
            });
            const qb = buildJoins(this.assetMaintenanceRepo.createQueryBuilder('m'));
            qb.select([
                'm.maintenance_id AS maintenance_id',
                'm.maintenance_ref_id AS maintenance_ref_id',
                'm.maintenance_type AS maintenance_type',
                'm.scheduled_date AS scheduled_date',
                'm.managed_by AS managed_by',
                'm.actual_cost AS actual_cost',
                'm.estimated_cost AS estimated_cost',
                'm.priority AS priority',
                'loc.location_name AS location',
                'a.asset_title AS asset_title',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'working.working_status_type_name AS working_status_type_name',
            ]);
            applySearchAndFilters(qb);
            if (isSelectAll) {
                if (excludeIds.length > 0) {
                    qb.andWhere('m.maintenance_id NOT IN (:...excludeIds)', { excludeIds });
                }
            }
            else if (selectedIds.length > 0) {
                qb.andWhere('m.maintenance_id IN (:...selectedIds)', { selectedIds });
            }
            qb.groupBy(`
        m.maintenance_id, m.maintenance_ref_id, m.maintenance_type,
        m.scheduled_date, m.managed_by, m.actual_cost, m.estimated_cost,
        m.priority, loc.location_name, a.asset_title, serial.stock_serials,
        serial.system_code, working.working_status_type_name
      `);
            const sortableMap = {
                maintenance_id: 'm.maintenance_id',
                maintenance_ref_id: 'm.maintenance_ref_id',
                maintenanceRefId: 'm.maintenance_ref_id',
                maintenance_type: 'm.maintenance_type',
                type: 'm.maintenance_type',
                scheduled_date: 'm.scheduled_date',
                date: 'm.scheduled_date',
                managed_by: 'm.managed_by',
                technician: 'm.managed_by',
                priority: 'm.priority',
                location: 'm.location',
                asset_title: 'a.asset_title',
                asset: 'a.asset_title',
                system_code: 'serial.system_code',
                serial: 'serial.stock_serials',
                cost: 'm.actual_cost',
                working_condition_id: 'm.asset_working_condition_id',
                created_at: 'm.created_at',
            };
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    const dbCol = sortableMap[s.column] || s.column;
                    qb.addOrderBy(dbCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('m.maintenance_id', 'DESC');
            }
            const data = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Asset Maintenance');
            const headers = [
                'Sr. No.',
                'Maintenance ID',
                'Asset ID',
                'Asset Display Name',
                'Serial Number',
                'Type',
                'Date',
                'Technician',
                'Cost',
                'Priority',
                'Location',
                'Condition',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.maintenance_ref_id ?? '--');
                sheet.cell(row, 3).value(item.system_code ?? '--');
                sheet.cell(row, 4).value(item.asset_title ?? '--');
                sheet.cell(row, 5).value(item.stock_serials ?? '--');
                sheet.cell(row, 6).value(item.maintenance_type ?? '--');
                sheet.cell(row, 7).value(item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : '--');
                sheet.cell(row, 8).value(item.managed_by ?? '--');
                sheet.cell(row, 9).value(item.actual_cost ?? item.estimated_cost ?? '--');
                sheet.cell(row, 10).value(item.priority ?? '--');
                sheet.cell(row, 11).value(item.location ?? '--');
                sheet.cell(row, 12).value(item.working_status_type_name ?? '--');
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(headers[i].length + 10);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportMaintenanceToExcel ERROR:', error);
            throw error;
        }
    }
    async exportScrapToExcel(dto) {
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
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            s.scrap_ref_id ILIKE :s${index}
            OR asset.asset_title ILIKE :s${index}
            OR serial.stock_serials ILIKE :s${index}
            OR serial.system_code ILIKE :s${index}
            OR s.scrap_reason ILIKE :s${index}
            OR s.disposal_method ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
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
                        case 'asset_working_condition_id':
                            qb.andWhere('s.asset_working_condition_id IN (:...asset_working_condition_id)', {
                                asset_working_condition_id: cleaned.map(Number),
                            });
                            break;
                        case 'disposal_method':
                            qb.andWhere('s.disposal_method IN (:...disposal_method)', {
                                disposal_method: cleaned,
                            });
                            break;
                    }
                }
            };
            const buildJoins = (qb) => qb
                .leftJoin('s.asset_serial', 'serial')
                .leftJoin('s.asset_info', 'asset')
                .leftJoin('s.status_info', 'status')
                .leftJoin('s.working_status_info', 'working')
                .where('s.is_deleted = :deleted', { deleted: 0 });
            const qb = buildJoins(this.assetScrapRepo.createQueryBuilder('s'));
            qb.select([
                's.scrap_id AS scrap_id',
                's.scrap_ref_id AS scrap_ref_id',
                's.scrap_date AS scrap_date',
                's.disposal_method AS disposal_method',
                's.scrap_reason AS scrap_reason',
                's.approved_by AS approved_by',
                'asset.asset_title AS asset_title',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'working.working_status_type_name AS working_status_type_name',
            ]);
            applySearchAndFilters(qb);
            if (isSelectAll) {
                if (excludeIds.length > 0) {
                    qb.andWhere('s.scrap_id NOT IN (:...excludeIds)', { excludeIds });
                }
            }
            else if (selectedIds.length > 0) {
                qb.andWhere('s.scrap_id IN (:...selectedIds)', { selectedIds });
            }
            qb.groupBy(`
        s.scrap_id, s.scrap_ref_id, s.scrap_date, s.disposal_method,
        s.scrap_reason, s.approved_by, asset.asset_title, serial.stock_serials,
        serial.system_code, working.working_status_type_name
      `);
            const sortableMap = {
                scrap_id: 's.scrap_id',
                scrapId: 's.scrap_id',
                scrap_ref_id: 's.scrap_ref_id',
                scrapRefId: 's.scrap_ref_id',
                asset_code: 'serial.system_code',
                assetCode: 'serial.system_code',
                system_code: 'serial.system_code',
                systemCode: 'serial.system_code',
                asset_name: 'asset.asset_title',
                assetName: 'asset.asset_title',
                asset_title: 'asset.asset_title',
                asset: 'asset.asset_title',
                scrap_reason: 's.scrap_reason',
                scrapReason: 's.scrap_reason',
                reason: 's.scrap_reason',
                scrap_date: 's.scrap_date',
                scrapDate: 's.scrap_date',
                approved_by: 's.approved_by',
                approvedBy: 's.approved_by',
                workingCondition: 'working.working_status_type_name',
                working_condition_id: 's.asset_working_condition_id',
                disposal_method: 's.disposal_method',
                disposalMethod: 's.disposal_method',
                created_at: 's.created_at',
                updated_at: 's.updated_at',
            };
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    const dbCol = sortableMap[s.column] || sortableMap[s.column?.toLowerCase()] || null;
                    if (dbCol) {
                        qb.addOrderBy(dbCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                    }
                    else {
                        console.warn(`Unmapped export sort column ignored: ${s.column}`);
                    }
                });
            }
            else {
                qb.addOrderBy('s.scrap_id', 'DESC');
            }
            const data = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Scrap Assets');
            const headers = [
                'Sr. No.',
                'Scrap ID',
                'Asset ID',
                'Asset Name',
                'Reason',
                'Scrap Date',
                'Approved By',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.scrap_ref_id ?? '--');
                sheet.cell(row, 3).value(item.system_code ?? '--');
                sheet.cell(row, 4).value(item.asset_title ?? '--');
                sheet.cell(row, 5).value(item.scrap_reason ?? '--');
                sheet.cell(row, 6).value(item.scrap_date ? new Date(item.scrap_date).toLocaleDateString() : '--');
                sheet.cell(row, 7).value(item.approved_by ?? '--');
                sheet.cell(row, 8).value(item.working_status_type_name ?? '--');
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(headers[i].length + 10);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportScrapToExcel ERROR:', error);
            throw error;
        }
    }
};
exports.ManageAssetService = ManageAssetService;
exports.ManageAssetService = ManageAssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(7, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(8, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(10, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(11, (0, typeorm_1.InjectRepository)(maintenance_entity_1.AssetMaintenance)),
    __param(12, (0, typeorm_1.InjectRepository)(scrap_entity_1.AssetScrap)),
    __param(13, (0, typeorm_1.InjectRepository)(location_transfers_entity_1.LocationTransfer)),
    __param(14, (0, typeorm_1.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __param(15, (0, typeorm_1.InjectRepository)(asset_procurement_items_entity_1.AssetProcurementItem)),
    __param(16, (0, typeorm_1.InjectRepository)(asset_procurements_entity_1.AssetProcurement)),
    __metadata("design:paramtypes", [mail_config_service_1.MailConfigService,
        mail_service_1.MailService,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        asset_events_service_1.AssetEventsService,
        notifications_helper_1.NotificationHelper,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
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
        asset_depreciation_service_1.DepreciationViewService,
        stocks_service_1.StocksService,
        asset_relationship_hook_service_1.AssetRelationshipHookService])
], ManageAssetService);
