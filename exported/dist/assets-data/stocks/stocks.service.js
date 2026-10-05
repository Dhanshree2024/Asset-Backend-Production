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
exports.StocksService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const typeorm_1 = require("@nestjs/typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const asset_depreciation_service_1 = require("../../asset-depreciation/asset-depreciation.service");
const asset_events_service_1 = require("../../asset-events/asset-events.service");
const asset_events_entity_1 = require("../../asset-events/entities/asset-events.entity");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const asset_transfer_history_entity_1 = require("../../asset-mapping/entities/asset_transfer_history.entity");
const asset_datum_entity_1 = require("../asset-data/entities/asset-datum.entity");
const branch_access_1 = require("../../branch-access/branch-access");
const request_context_service_1 = require("../../common/context/request-context.service");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const cache_key_util_1 = require("../../common/redis/cache-key.util");
const asset_action_rules_1 = require("../../common/asset-rules/asset-action-rules");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const redis_service_1 = require("../../common/redis/redis.service");
const restriction_util_1 = require("../../common/restriction/restriction-util");
const usage_util_1 = require("../../common/usage/usage-util");
const scrap_entity_1 = require("../../manage-asset/entities/scrap.entity");
const asset_id_settings_entity_1 = require("../../organizational-profile/entity/asset-id-settings.entity");
const branches_entity_1 = require("../../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const location_branch_mapping_entity_1 = require("../../organizational-profile/entity/location-branch-mapping.entity");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const organizational_vendors_entity_1 = require("../../organizational-profile/entity/organizational-vendors.entity");
const policy_attribute_entity_1 = require("../../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../../organizational-profile/entity/policy-builder/special-permission-master");
const cache_service_helper_1 = require("../../utils/cache-service-helper");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_data_service_1 = require("../asset-data/asset-data.service");
const asset_field_category_entity_1 = require("../asset-fields/entities/asset-field-category.entity");
const asset_ownership_status_types_entity_1 = require("../asset-fields/entities/asset-ownership-status-types.entity");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_working_status_entity_1 = require("../asset-working-status/entities/asset-working-status.entity");
const asset_procurement_items_entity_1 = require("./entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("./entities/asset_procurements.entity");
const asset_software_subscription_entity_1 = require("./entities/asset_software_subscription.entity");
const asset_softwares_1 = require("./entities/asset_softwares");
const asset_stock_serials_entity_1 = require("./entities/asset_stock_serials.entity");
const asset_warranty_details_entity_1 = require("./entities/asset_warranty_details.entity");
const item_licence_type_entity_1 = require("./entities/item_licence_type.entity");
const perpetual_softwares_1 = require("./entities/perpetual_softwares");
const stocks_entity_1 = require("./entities/stocks.entity");
const v_asset_stock_serials_view_entity_1 = require("./entities/v-asset-stock-serials-view.entity");
const view_asset_stock_details_1 = require("./entities/view_asset_stock_details");
const stock_summary_refresh_service_1 = require("./stock-summary-refresh.service");
let StocksService = class StocksService {
    constructor(stockRepository, dataSource, redis, assetEventsService, redisService, assetDataService, assetMappingRepository, userRepo, assetStockSerialsRepository, assetProcurementItemRepository, assetProcurementRepository, assetWarrantyDetailsRepository, AssetTransferHistory, assetRepository, vendorRepository, licenceRepo, AssetItem, viewRepo, locationsRepo, assetFieldCategoryRepository, stockViewRepo, softwareViewRepo, perpetualSoftwareRepo, AssetProcurement, specialPermissionRepo, policyAttrRepo, notificationHelper, depViewService, stockSummaryRefresh, requestContext, dropdownCache) {
        this.stockRepository = stockRepository;
        this.dataSource = dataSource;
        this.redis = redis;
        this.assetEventsService = assetEventsService;
        this.redisService = redisService;
        this.assetDataService = assetDataService;
        this.assetMappingRepository = assetMappingRepository;
        this.userRepo = userRepo;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.assetProcurementItemRepository = assetProcurementItemRepository;
        this.assetProcurementRepository = assetProcurementRepository;
        this.assetWarrantyDetailsRepository = assetWarrantyDetailsRepository;
        this.AssetTransferHistory = AssetTransferHistory;
        this.assetRepository = assetRepository;
        this.vendorRepository = vendorRepository;
        this.licenceRepo = licenceRepo;
        this.AssetItem = AssetItem;
        this.viewRepo = viewRepo;
        this.locationsRepo = locationsRepo;
        this.assetFieldCategoryRepository = assetFieldCategoryRepository;
        this.stockViewRepo = stockViewRepo;
        this.softwareViewRepo = softwareViewRepo;
        this.perpetualSoftwareRepo = perpetualSoftwareRepo;
        this.AssetProcurement = AssetProcurement;
        this.specialPermissionRepo = specialPermissionRepo;
        this.policyAttrRepo = policyAttrRepo;
        this.notificationHelper = notificationHelper;
        this.depViewService = depViewService;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.requestContext = requestContext;
        this.dropdownCache = dropdownCache;
    }
    scheduleStockRefreshFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (orgId && !isNaN(orgId)) {
                this.depViewService.scheduleRefresh(orgId);
                this.stockSummaryRefresh.scheduleRefresh(orgId);
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async resolveSchemaFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return null;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (!orgId || isNaN(orgId))
                return null;
            const cacheKey = `organization_organization_schema_name:${orgId}`;
            const cached = await this.redisService.get(cacheKey);
            if (cached)
                return cached;
            const org = await this.dataSource.query(`SELECT organization_schema_name FROM public.register_organization WHERE organization_id = $1 LIMIT 1`, [orgId]);
            if (!org?.length)
                return null;
            const schema = `org_${org[0].organization_schema_name}`;
            await this.redisService.set(cacheKey, schema, 3600);
            return schema;
        }
        catch {
            return null;
        }
    }
    async invalidateSerials(schema) {
        await this.redisService.incr(`serials_version:${schema}`);
    }
    async generateSystemCodes(manager, assetDetails, baseCode, branchId) {
        const settings = await manager
            .createQueryBuilder(asset_id_settings_entity_1.AssetIDSettings, 's')
            .setLock('pessimistic_write')
            .where('s.is_current = true')
            .getOne();
        if (!settings) {
            throw new Error('Asset ID settings not found');
        }
        const separator = settings.separator || '-';
        const sequenceLength = settings.sequence_length || 3;
        const count = assetDetails.length;
        let startSeq = settings.next_number || settings.starting_number || 1;
        await manager
            .createQueryBuilder()
            .update(asset_id_settings_entity_1.AssetIDSettings)
            .set({ next_number: startSeq + count })
            .execute();
        let branch = null;
        if (settings.include_branch && branchId) {
            branch = await manager.getRepository(branches_entity_1.Branch).findOne({
                where: { branch_id: branchId },
                select: ['branch_name', 'branch_code'],
            });
        }
        let parts = baseCode.split(separator);
        if (settings.suffix && parts[parts.length - 1] === settings.suffix) {
            parts.pop();
        }
        if (/^\d+$/.test(parts[parts.length - 1])) {
            parts.pop();
        }
        const finalBaseParts = [];
        if (settings.prefix) {
            finalBaseParts.push(settings.prefix);
        }
        if (settings.include_branch && branch) {
            let branchValue = settings.branch_source === 'NAME'
                ? branch.branch_name
                : branch.branch_code;
            if (branchValue) {
                if (settings.branch_length) {
                    branchValue = branchValue.substring(0, settings.branch_length);
                }
                if (settings.word_case === 'upper') {
                    branchValue = branchValue.toUpperCase();
                }
                finalBaseParts.push(branchValue);
            }
        }
        if (settings.include_year) {
            finalBaseParts.push(new Date().getFullYear().toString());
        }
        for (let i = 0; i < count; i++) {
            const seq = startSeq + i;
            const padded = String(seq).padStart(sequenceLength, '0');
            const finalParts = [...finalBaseParts, padded];
            if (settings.suffix) {
                finalParts.push(settings.suffix);
            }
            assetDetails[i].system_code = finalParts.join(separator);
        }
    }
    async createStocks(createStockDto, organizationID, schema, req) {
        const result = await this.dataSource.transaction(async (manager) => {
            try {
                if (typeof schema === 'string' && /^org_[A-Za-z0-9_]+$/.test(schema)) {
                    await manager.query(`SET LOCAL search_path TO "${schema}", public`);
                }
                const toNull = (val) => val === '' || val === undefined ? null : val;
                [
                    'vendor_id',
                    'location_id',
                    'buy_price',
                    'gst_percent',
                    'gst_amount',
                    'total_without_gst',
                    'total_amount',
                    'purchase_date',
                    'invoice_no',
                ].forEach((field) => {
                    createStockDto[field] = toNull(createStockDto[field]);
                });
                const safeParse = (val) => {
                    if (!val)
                        return null;
                    if (typeof val !== 'string')
                        return val;
                    try {
                        return JSON.parse(val);
                    }
                    catch {
                        return null;
                    }
                };
                createStockDto.assetDetails = safeParse(createStockDto.assetDetails);
                createStockDto.information_fields = safeParse(createStockDto.information_fields);
                createStockDto.warranty_details = safeParse(createStockDto.warranty_details);
                createStockDto.licence = safeParse(createStockDto.licence);
                createStockDto.subscription_details = safeParse(createStockDto.subscription_details);
                if (!Array.isArray(createStockDto.assetDetails) ||
                    !createStockDto.assetDetails.length) {
                    throw new Error('Asset details missing');
                }
                const [asset, createdUser] = await Promise.all([
                    manager.getRepository(asset_datum_entity_1.AssetDatum).findOne({
                        where: { asset_id: createStockDto.asset_id },
                        select: [
                            'asset_id',
                            'asset_item_id',
                            'asset_main_category_id',
                            'asset_sub_category_id',
                            'asset_description',
                        ],
                    }),
                    manager.getRepository(organizational_user_entity_1.User).findOne({
                        where: { user_id: createStockDto.created_by },
                    }),
                ]);
                console.log('Asset:log', asset);
                if (!asset)
                    throw new Error('Asset not found');
                const { asset_item_id, asset_main_category_id, asset_sub_category_id } = asset;
                const assetItem = await manager.getRepository(asset_item_entity_1.AssetItem).findOne({
                    where: { asset_item_id },
                    select: ['asset_item_id', 'item_type'],
                });
                const isVirtual = assetItem?.item_type === 'Virtual';
                const incomingSerials = createStockDto.assetDetails
                    .map((d) => d.serial_number)
                    .filter(Boolean);
                if (incomingSerials.length) {
                    const duplicates = await manager
                        .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                        .createQueryBuilder('serial')
                        .select('serial.stock_serials')
                        .where('serial.stock_serials IN (:...serials)', {
                        serials: incomingSerials,
                    })
                        .andWhere('serial.asset_item_id = :asset_item_id', {
                        asset_item_id,
                    })
                        .andWhere('serial.is_deleted = 0')
                        .getRawMany();
                    if (duplicates.length) {
                        throw new common_1.HttpException(`Duplicate serial(s): ${duplicates.map((d) => d.serial_stock_serials).join(', ')}`, common_1.HttpStatus.CONFLICT);
                    }
                }
                const baseCode = await this.assetDataService.assetIDGenerateFormula({
                    assetId: createStockDto.asset_id,
                    branchId: createStockDto.branch_id ?? null,
                    departmentId: createStockDto.department_id ?? null,
                    categoryId: asset_main_category_id,
                    subCategoryId: asset_sub_category_id,
                    itemId: asset_item_id,
                }, undefined, null, organizationID, req);
                await this.generateSystemCodes(manager, createStockDto.assetDetails, baseCode, createStockDto.branch_id);
                const stockRepo = manager.getRepository(stocks_entity_1.Stock);
                let savedStock = await stockRepo.findOne({
                    where: { asset_id: createStockDto.asset_id, is_deleted: 0 },
                    order: { stock_id: 'DESC' },
                });
                if (savedStock) {
                    savedStock.quantity += Number(createStockDto.quantity ?? 1);
                    savedStock.updated_at = new Date();
                    savedStock.updated_by = createStockDto.created_by ?? null;
                }
                else {
                    savedStock = stockRepo.create({
                        asset_id: createStockDto.asset_id,
                        quantity: createStockDto.quantity ?? 1,
                        location_id: createStockDto.location_id,
                        created_by: createStockDto.created_by,
                    });
                }
                savedStock = await stockRepo.save(savedStock);
                const previousSerial = await manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .findOne({
                    where: {
                        asset_item_id: asset_item_id,
                        is_deleted: 0,
                    },
                    order: { asset_stocks_unique_id: 'DESC' },
                });
                let previousProcurementItemId = null;
                let previousProcurementId = null;
                console.log('previousSerial:', previousSerial);
                if (previousSerial?.procurement_item_id) {
                    const prevItem = await manager
                        .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                        .findOne({
                        where: {
                            procurement_item_id: previousSerial.procurement_item_id,
                        },
                    });
                    console.log('prevItem:', prevItem);
                    if (prevItem) {
                        previousProcurementItemId = prevItem.procurement_item_id;
                        previousProcurementId = prevItem.procurement_id;
                    }
                    console.log('previousProcurementItemId:', previousProcurementItemId);
                    console.log('previousProcurementId:', previousProcurementId);
                }
                if (!previousProcurementId) {
                    const fallbackItem = await manager
                        .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                        .createQueryBuilder('item')
                        .leftJoin('asset_stock_serials', 'serial', 'serial.procurement_item_id = item.procurement_item_id')
                        .where('item.asset_id = :assetId', {
                        assetId: createStockDto.asset_id,
                    })
                        .orderBy('item.procurement_item_id', 'DESC')
                        .getOne();
                    if (fallbackItem) {
                        previousProcurementItemId = fallbackItem.procurement_item_id;
                        previousProcurementId = fallbackItem.procurement_id;
                    }
                }
                const procurement = await manager.getRepository(asset_procurements_entity_1.AssetProcurement).save({
                    asset_id: createStockDto.asset_id,
                    vendor_id: createStockDto.vendor_id,
                    invoice_no: createStockDto.invoice_no,
                    bill_no: createStockDto.bill_no,
                    purchase_date: createStockDto.purchase_date,
                    unit_price: createStockDto.buy_price,
                    gst_percent: createStockDto.gst_percent,
                    gst_amount: createStockDto.gst_amount,
                    total_without_gst: createStockDto.total_without_gst,
                    total_amount: createStockDto.total_amount,
                    documents: createStockDto.documents,
                    license_details: createStockDto.licence,
                    created_by: createStockDto.created_by,
                    stock_id: savedStock.stock_id,
                    ownership_status_id: createStockDto.asset_ownership_status ?? 1,
                    warranty_category: createStockDto.subscription_details
                        ?.warranty_category
                        ? createStockDto.subscription_details.warranty_category.map((val) => val)
                        : null,
                    sub_start_date: createStockDto.subscription_details?.sub_start_date ?? null,
                    next_renewal_date: createStockDto.subscription_details?.next_renewal_date ?? null,
                    subscription_type: createStockDto.subscription_details?.subscription_type ?? null,
                    billing_frequency: createStockDto.subscription_details?.billing_frequency ?? null,
                    previous_procurement_id: previousProcurementId ?? null,
                });
                const procurementItem = await manager
                    .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                    .save({
                    procurement_id: procurement.procurement_id,
                    asset_id: createStockDto.asset_id,
                    quantity: createStockDto.quantity ?? 1,
                    location_id: createStockDto.location_id,
                    previous_procurement_item_id: previousProcurementItemId ?? null,
                });
                const serialRows = createStockDto.assetDetails.map((detail) => ({
                    asset_id: createStockDto.asset_id,
                    stock_id: savedStock.stock_id,
                    asset_item_id,
                    stock_serials: detail.serial_number ?? null,
                    system_code: detail.system_code ?? null,
                    asset_serial_title: createStockDto.asset_title,
                    procurement_item_id: procurementItem.procurement_item_id,
                    location_id: createStockDto.location_id ?? null,
                    current_status_id: 1,
                    working_status_type_id: isVirtual ? null : 18,
                    created_by: createStockDto.created_by,
                    information_fields: createStockDto.information_fields
                        ? JSON.stringify(createStockDto.information_fields)
                        : null,
                }));
                const serialInsert = await manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .insert(serialRows);
                const serialIds = serialInsert.raw.map((r) => r.asset_stocks_unique_id);
                await Promise.all([
                    createStockDto.warranty_details
                        ? manager.getRepository(asset_warranty_details_entity_1.AssetWarrantyDetailsRepository).insert(serialIds.map((id) => ({
                            procurement_id: procurement.procurement_id,
                            asset_stocks_unique_id: id,
                            asset_id: createStockDto.asset_id,
                            stock_id: savedStock.stock_id,
                            asset_item_id,
                            ...createStockDto.warranty_details,
                        })))
                        : Promise.resolve(),
                    createStockDto.subscription_details
                        ? manager.getRepository(asset_software_subscription_entity_1.AssetSoftwareSubscription).insert(serialIds.map((id) => ({
                            procurement_id: procurement.procurement_id,
                            asset_stocks_unique_id: id,
                            asset_id: createStockDto.asset_id,
                            stock_id: savedStock.stock_id,
                            asset_item_id,
                            ...createStockDto.subscription_details,
                        })))
                        : Promise.resolve(),
                ]);
                await manager.getRepository(asset_events_entity_1.AssetEvent).insert(serialIds.map((id) => ({
                    asset_id: createStockDto.asset_id,
                    asset_stocks_unique_id: id,
                    title: 'Asset Created',
                    description: asset?.asset_description ||
                        createStockDto.description ||
                        'Asset created',
                    reference_table: 'asset_procurements',
                    reference_id: procurement.procurement_id,
                    metadata: {
                        stock_id: savedStock.stock_id,
                        procurement_id: procurement.procurement_id,
                    },
                    performed_by: createStockDto.created_by,
                    performed_at: new Date(),
                    created_at: new Date(),
                    event_category: 'LIFECYCLE',
                    event_type_id: 18,
                })));
                if (createdUser?.users_business_email) {
                    this.notificationHelper
                        .triggerEventNotification({
                        eventId: 56,
                        contextData: {
                            updatedUser: {
                                first_name: createdUser.first_name,
                                last_name: createdUser.last_name,
                            },
                            assetStockSerial: {
                                quantity: serialIds.length,
                                asset_name: serialRows[0]?.asset_serial_title || 'N/A',
                            },
                        },
                        recipients: [
                            {
                                recipient_type: 'user',
                                recipient_id: String(createdUser.user_id),
                                recipient_email: createdUser.users_business_email,
                            },
                        ],
                        meta: { trace_id: `STOCK_CREATE_${Date.now()}` },
                    })
                        .catch(console.error);
                }
                const softwareCategory = await manager
                    .getRepository(asset_category_entity_1.AssetCategory)
                    .createQueryBuilder('mc')
                    .where('LOWER(mc.main_category_name) IN (:...names)', {
                    names: ['software', 'softwares'],
                })
                    .select(['mc.main_category_id'])
                    .getOne();
                const isSoftware = softwareCategory?.main_category_id === asset.asset_main_category_id;
                const featureIdForAssetCreation = 2;
                const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
                if (enableFeatureRestriction) {
                    try {
                        const totalAssetsAfterInsert = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .createQueryBuilder('serial')
                            .where('serial.is_active = :isActive', { isActive: 1 })
                            .andWhere('serial.is_deleted = :isDeleted', { isDeleted: 0 })
                            .getCount();
                        await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationID, featureIdForAssetCreation, totalAssetsAfterInsert.toString());
                    }
                    catch (err) {
                        console.error('Usage update failed:', err.message);
                    }
                }
                this.refreshStockSummaryFromContext();
                this.depViewService.scheduleRefresh(organizationID);
                await this.redisService.delByPattern('software-list:*');
                this.redisService.delByPattern('perpetualSoftwares-list:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
                await this.redisService.delByPattern('organization-branches*');
                await this.redisService.delByPattern('organization-branches-count*');
                return {
                    ...(isSoftware
                        ? {}
                        : {
                            message: 'Stock created successfully',
                        }),
                    asset_id: createStockDto.asset_id,
                    stock_id: savedStock.stock_id,
                    quantity: createStockDto.quantity ?? createStockDto.assetDetails.length,
                };
            }
            catch (error) {
                if (error instanceof common_1.HttpException)
                    throw error;
                throw new common_1.InternalServerErrorException(error.message || 'Stock creation failed');
            }
        });
        await this.stockSummaryRefresh.refreshNow(organizationID);
        await this.invalidateSerials(schema);
        return result;
    }
    refreshStockSummaryFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (orgId && !isNaN(orgId)) {
                this.stockSummaryRefresh.scheduleRefresh(orgId);
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async exportFilteredExcelForStocks(data) {
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Stock List');
        const headers = [
            'Sr. No.',
            'Stock Name',
            'Asset Name',
            'Vendor Name',
            'Ownership Status',
            'Created By',
            'Created At',
        ];
        headers.forEach((header, i) => {
            sheet
                .cell(1, i + 1)
                .value(header)
                .style({ bold: true });
        });
        data.forEach((stock, index) => {
            sheet.cell(index + 2, 1).value(index + 1);
            sheet.cell(index + 2, 2).value(stock.stock_serials || '');
            sheet.cell(index + 2, 3).value(stock.asset_info?.asset_title || '');
            sheet.cell(index + 2, 4).value(stock.vendor_info?.vendor_name || '');
            sheet
                .cell(index + 2, 5)
                .value(stock.ownership_information?.ownership_status_type_name || '');
            sheet
                .cell(index + 2, 6)
                .value(`${stock.created_user?.first_name} ${stock.created_user?.last_name}` ||
                '');
            sheet
                .cell(index + 2, 7)
                .value(stock.created_at
                ? new Date(stock.created_at).toLocaleDateString()
                : '');
        });
        headers.forEach((_, i) => {
            sheet.column(i + 1).width(headers[i].length + 10);
        });
        return await workbook.outputAsync();
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
    async getUserIdByRegisterLoginId(registerUserLoginId) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .select('user.user_id', 'user_id')
            .where('user.register_user_login_id = :id', { id: registerUserLoginId })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: 0 })
            .andWhere('user.is_active = :isActive', { isActive: 1 })
            .getRawOne();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.user_id;
    }
    async updateAssetDetails(payload) {
        const { asset_stocks_unique_id, title, stockSerial, project_id, cost_center_id, user_id, } = payload;
        const login_user_id = await this.getUserByPublicID(user_id);
        const currentAsset = await this.assetStockSerialsRepository
            .createQueryBuilder()
            .where('asset_stocks_unique_id = :id', { id: asset_stocks_unique_id })
            .getOne();
        if (!currentAsset) {
            throw new Error('Asset not found');
        }
        const allProjects = await this.assetStockSerialsRepository.manager
            .createQueryBuilder()
            .select([
            'proj.project_id AS project_id',
            'proj.project_name AS project_name',
        ])
            .from('asset_project', 'proj')
            .getRawMany();
        const projectMap = Object.fromEntries(allProjects.map((p) => [p.project_id, p.project_name]));
        const allCostCenters = await this.assetStockSerialsRepository.manager
            .createQueryBuilder()
            .select([
            'cc.cost_center_id AS cost_center_id',
            'cc.cost_center_name AS cost_center_name',
        ])
            .from('asset_cost_centers', 'cc')
            .getRawMany();
        const costCenterMap = Object.fromEntries(allCostCenters.map((c) => [c.cost_center_id, c.cost_center_name]));
        const updateData = {};
        const changedFields = [];
        if (title !== undefined && currentAsset.asset_serial_title !== title) {
            updateData.asset_serial_title = title;
            changedFields.push({
                field: 'title',
                oldValue: currentAsset.asset_serial_title,
                newValue: title,
            });
        }
        if (stockSerial !== undefined &&
            currentAsset.stock_serials !== stockSerial) {
            updateData.stock_serials = stockSerial;
            changedFields.push({
                field: 'Serial',
                oldValue: currentAsset.stock_serials || 'N/A',
                newValue: stockSerial || 'N/A',
            });
        }
        if (project_id !== undefined && currentAsset.project_id !== project_id) {
            updateData.project_id = project_id;
            changedFields.push({
                field: 'Project',
                oldValue: projectMap[currentAsset.project_id] || 'N/A',
                newValue: projectMap[project_id] || 'N/A',
            });
        }
        if (cost_center_id !== undefined &&
            currentAsset.cost_center_id !== cost_center_id) {
            updateData.cost_center_id = cost_center_id;
            changedFields.push({
                field: 'Cost Center',
                oldValue: costCenterMap[currentAsset.cost_center_id] || 'N/A',
                newValue: costCenterMap[cost_center_id] || 'N/A',
            });
        }
        updateData.updated_by = +login_user_id;
        const fieldsToUpdate = { ...updateData };
        delete fieldsToUpdate.updated_by;
        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new Error('No fields to update');
        }
        const queryRunner = this.assetStockSerialsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await queryRunner.manager
                .createQueryBuilder()
                .update(asset_stock_serials_entity_1.AssetStockSerials)
                .set(updateData)
                .where('asset_stocks_unique_id = :id', { id: asset_stocks_unique_id })
                .returning('*')
                .execute();
            if (result.affected === 0) {
                throw new Error('Asset not found or nothing updated');
            }
            const updatedAsset = result.raw[0];
            for (const change of changedFields) {
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: updatedAsset.asset_id,
                    asset_stocks_unique_id: updatedAsset.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.UPDATE,
                    performed_by: login_user_id,
                    reference_table: 'asset_stock_serials',
                    reference_id: updatedAsset.asset_stocks_unique_id,
                    metadata: {
                        field: change.field,
                        old_value: change.oldValue,
                        new_value: change.newValue,
                    },
                    title: `Asset ${change.field} updated`,
                    description: `Field '${change.field}' changed from '${change.oldValue}' to '${change.newValue}'`,
                    event_type_id: null,
                    created_at: new Date(),
                });
            }
            await queryRunner.commitTransaction();
            this.scheduleStockRefreshFromContext();
            return updatedAsset;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async validateSerialOrLicense(serial, license) {
        const query = this.assetStockSerialsRepository.createQueryBuilder('serials');
        if (serial) {
            query.orWhere('serials.stock_serials = :serial', { serial });
        }
        if (license) {
            query.orWhere('serials.license_key = :license', { license });
        }
        const duplicate = await query.getOne();
        return { isDuplicate: !!duplicate };
    }
    async findAllSerials2(dto, userId, branchIds = [], schema) {
        try {
            console.log('vk branch:', branchIds);
            let visibleColumns = dto.visible_columns;
            if (visibleColumns &&
                typeof visibleColumns === 'object' &&
                !Array.isArray(visibleColumns)) {
                visibleColumns = Object.keys(visibleColumns).filter((k) => visibleColumns[k] === true);
            }
            if (typeof visibleColumns === 'string') {
                try {
                    visibleColumns = JSON.parse(visibleColumns);
                }
                catch {
                    visibleColumns = [];
                }
            }
            if (!Array.isArray(visibleColumns))
                visibleColumns = [];
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const rangeFilters = dto.range_filters || [];
            const dateBetween = dto.date_between;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalRaw = d.knownTotal ?? d.known_total;
            const knownTotal = knownTotalRaw !== undefined && knownTotalRaw !== null
                ? Number(knownTotalRaw)
                : null;
            const version = (await this.redis.get(`serials_version:${schema}`)) || 1;
            const cacheKey = `v${version}:${(0, cache_key_util_1.buildSerialsKey)(userId, branchIds, {
                ...dto,
                visible_columns: visibleColumns,
            })}`;
            console.time('redisCacheGet');
            const cached = await this.redis.get(cacheKey);
            console.timeEnd('redisCacheGet');
            if (cached) {
                console.log('GET ALL SERIAL LIST CACHE REDIS');
                return cached;
            }
            console.log('GET ALL SERIAL LIST FROM DATABASE');
            const roleCacheKey = `user_role:${schema}:${userId}`;
            console.time('userRoleQuery');
            const roleId = await (async () => {
                const cachedRole = await this.redis.get(roleCacheKey);
                if (cachedRole !== null && cachedRole !== undefined) {
                    console.log('Role Cache Hit:', cachedRole);
                    return cachedRole;
                }
                console.log('Role Cache Miss');
                const user = await this.dataSource.query(`
      SELECT role_id
      FROM ${schema}.users
      WHERE user_id = $1
      LIMIT 1
      `, [userId]);
                if (!user?.length) {
                    throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
                }
                const roleId = user[0].role_id;
                await this.redis.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            console.timeEnd('userRoleQuery');
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const viewName = `${schema}.v_asset_stock_serials`;
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            console.time('permissionCheck');
            let hasSelfAccess = await this.redis.get(permCacheKey);
            if (hasSelfAccess === null) {
                const selfPermission = await this.specialPermissionRepo.findOne({
                    where: { attr_key: 'view_self_added_assets' },
                    select: ['id'],
                });
                const selfPolicy = selfPermission
                    ? await this.policyAttrRepo
                        .createQueryBuilder('pa')
                        .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                        .andWhere('pa.special_permission_master_id = :spId', {
                        spId: selfPermission.id,
                    })
                        .getOne()
                    : null;
                hasSelfAccess = !!selfPolicy;
                await this.redis.set(permCacheKey, hasSelfAccess, 300);
            }
            console.timeEnd('permissionCheck');
            const qb = this.dataSource
                .createQueryBuilder()
                .select(['v.*'])
                .from(viewName, 'v')
                .where('1=1');
            const hasSoftwareFilter = filters?.some(f => ['is_software', 'item_type', 'sub_category_id', 'main_category_id', 'sub_category_name', 'asset_main_category_name', 'asset_item_id', 'procurement_id', 'type'].includes(f.column));
            if (!hasSoftwareFilter) {
                qb.andWhere('v.sub_category_id <> 15');
            }
            if (branchIds.length && hasSelfAccess) {
                qb.andWhere(`v.asset_added_by = :userId AND v.location_branch_id IN (:...branchIds)`, { userId, branchIds });
            }
            else if (branchIds.length) {
                qb.andWhere(`v.location_branch_id IN (:...branchIds)`, { branchIds });
            }
            else if (hasSelfAccess) {
                qb.andWhere(`v.asset_added_by = :userId`, { userId });
            }
            let searchMatchedCount = null;
            for (const s of searchArray) {
                if (!s.values?.length)
                    continue;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                if (!value)
                    continue;
                const pattern = `%${value}%`;
                const rows = await this.dataSource.query(`
WITH matched AS (

    SELECT serial.asset_stocks_unique_id
    FROM ${schema}.asset_stock_serials serial
    WHERE serial.is_deleted = 0
      AND (
            serial.stock_serials ILIKE $1
         OR serial.system_code ILIKE $1
         OR serial.asset_serial_title ILIKE $1
      )

    UNION

    SELECT serial.asset_stocks_unique_id
    FROM ${schema}.asset_stock_serials serial
    JOIN ${schema}.asset_items item
      ON serial.asset_item_id = item.asset_item_id
    WHERE serial.is_deleted = 0
      AND (
            item.asset_item_name ILIKE $1
         OR item.item_type::text ILIKE $1
      )

    UNION

    SELECT serial.asset_stocks_unique_id
    FROM ${schema}.asset_stock_serials serial
    JOIN ${schema}.assets asset
      ON serial.asset_id = asset.asset_id
    JOIN ${schema}.asset_main_category main_cat
      ON asset.asset_main_category_id = main_cat.main_category_id
    WHERE serial.is_deleted = 0
      AND main_cat.main_category_name ILIKE $1

    UNION

    SELECT serial.asset_stocks_unique_id
    FROM ${schema}.asset_stock_serials serial
    JOIN ${schema}.assets asset
      ON serial.asset_id = asset.asset_id
    JOIN ${schema}.asset_sub_category sub_cat
      ON asset.asset_sub_category_id = sub_cat.sub_category_id
    WHERE serial.is_deleted = 0
      AND sub_cat.sub_category_name ILIKE $1

    UNION

    SELECT serial.asset_stocks_unique_id
    FROM ${schema}.asset_stock_serials serial
    JOIN ${schema}.asset_procurement_items p_item
      ON serial.procurement_item_id = p_item.procurement_item_id
    JOIN ${schema}.location_branch_mapping lbm
      ON p_item.location_id = lbm.location_mapping_id
     AND lbm.is_deleted = 0
     AND lbm.is_active = 1
    JOIN ${schema}.asset_locations loc
      ON lbm.location_id = loc.location_id
    WHERE serial.is_deleted = 0
      AND loc.location_name ILIKE $1

)

SELECT
    asset_stocks_unique_id,
    COUNT(*) OVER() AS total
FROM matched
LIMIT 5000;
`, [pattern]);
                const matchedIds = rows.map((r) => r.asset_stocks_unique_id);
                searchMatchedCount = rows.length > 0 ? Number(rows[0].total) : 0;
                if (!matchedIds.length) {
                    qb.andWhere('1=0');
                }
                else {
                    qb.andWhere('v.asset_stocks_unique_id IN (:...matchedIds)', {
                        matchedIds,
                    });
                }
            }
            const intColumns = [
                'asset_id',
                'asset_item_id',
                'stock_id',
                'procurement_id',
                'procurement_item_id',
                'main_category_id',
                'sub_category_id',
                'branch_id',
                'asset_status_type_id',
                'department_id',
                'asset_managed_by',
                'asset_used_by',
                'asset_location',
                'asset_ownership_status',
                'manufacturer_id',
                'working_status_type_id',
            ];
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                if (f.column === 'item_type') {
                    qb.andWhere(`v.item_type::text IN (:...item_type)`, {
                        item_type: f.values,
                    });
                    continue;
                }
                if (f.column === 'type') {
                    const val = f.values?.[0];
                    if (val === 'ASSIGNED') {
                        qb.andWhere('v.mapping_id IS NOT NULL');
                    }
                    else if (val === 'INSTOCK') {
                        qb.andWhere('v.asset_status_type_id IN (:...statusIds)', {
                            statusIds: [1, 5],
                        });
                        qb.andWhere('v.mapping_id IS NULL');
                    }
                    continue;
                }
                if (f.column === 'branch_id') {
                    const vals = f.values.map((v) => parseInt(v)).filter(Boolean);
                    if (vals.length) {
                        qb.andWhere(vals.length > 1
                            ? `v.location_branch_id IN (:...branch_id)`
                            : `v.location_branch_id = :branch_id`, {
                            branch_id: vals.length > 1 ? vals : vals[0],
                        });
                    }
                    continue;
                }
                const isInt = intColumns.includes(f.column);
                const values = f.values
                    .map((v) => (isInt ? parseInt(v, 10) : v))
                    .filter((v) => v !== null && v !== undefined && !isNaN(v));
                if (!values.length)
                    continue;
                if (isInt) {
                    qb.andWhere(values.length > 1
                        ? `v.${f.column} IN (:...${f.column})`
                        : `v.${f.column} = :${f.column}`, {
                        [f.column]: values.length > 1 ? values : values[0],
                    });
                }
                else {
                    values.forEach((val, i) => {
                        qb.andWhere(`v.${f.column} ILIKE :${f.column}_${i}`, {
                            [`${f.column}_${i}`]: `%${val}%`,
                        });
                    });
                }
            }
            if (dateBetween?.column && (dateBetween?.start || dateBetween?.end)) {
                if (dateBetween.start && dateBetween.end) {
                    const start = new Date(dateBetween.start);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateBetween.end);
                    end.setHours(23, 59, 59, 999);
                    qb.andWhere(`v.${dateBetween.column} BETWEEN :start AND :end`, {
                        start,
                        end,
                    });
                }
                else if (dateBetween.start) {
                    const start = new Date(dateBetween.start);
                    start.setHours(0, 0, 0, 0);
                    qb.andWhere(`v.${dateBetween.column} >= :start`, { start });
                }
                else if (dateBetween.end) {
                    const end = new Date(dateBetween.end);
                    end.setHours(23, 59, 59, 999);
                    qb.andWhere(`v.${dateBetween.column} <= :end`, { end });
                }
            }
            for (const rf of rangeFilters) {
                if (!rf.column)
                    continue;
                if (rf.from !== undefined) {
                    qb.andWhere(`v.${rf.column} >= :min_${rf.column}`, {
                        [`min_${rf.column}`]: rf.from,
                    });
                }
                if (rf.to !== undefined) {
                    qb.andWhere(`v.${rf.column} <= :max_${rf.column}`, {
                        [`max_${rf.column}`]: rf.to,
                    });
                }
            }
            const whereClause = qb.expressionMap.wheres
                .map((w) => w.condition)
                .join(' AND ');
            const whereParams = qb.getParameters();
            const countHash = Buffer.from(JSON.stringify({
                search: searchArray,
                filters,
                rangeFilters,
                dateBetween,
                branchIds,
                hasSelfAccess,
            })).toString('base64');
            const countCacheKey = `v${version}:serials_count:${schema}:${userId}:${countHash}`;
            console.time('countQuery');
            let count = null;
            const isSearching = searchArray.length > 0;
            if (knownTotal != null) {
                count = knownTotal;
            }
            else {
                const cachedCount = await this.redis.get(countCacheKey);
                count = cachedCount;
                if (count === null || count === undefined) {
                    const lateralCols = new Set([
                        'asset_used_by',
                        'asset_managed_by',
                        'department_id',
                    ]);
                    const supportedCols = new Set([
                        'main_category_id',
                        'sub_category_id',
                        'manufacturer_id',
                        'asset_item_id',
                        'asset_id',
                        'stock_id',
                        'asset_status_type_id',
                        'working_status_type_id',
                        'item_type',
                        'asset_location',
                        'branch_id',
                        'asset_ownership_status',
                    ]);
                    const activeFilters = filters.filter((f) => f.values?.length);
                    const mustUseView = isSearching ||
                        activeFilters.some((f) => lateralCols.has(f.column)) ||
                        activeFilters.some((f) => !supportedCols.has(f.column)) ||
                        rangeFilters.some((rf) => rf.column && rf.column !== 'purchase_date') ||
                        (!!dateBetween?.column && dateBetween.column !== 'purchase_date');
                    if (mustUseView) {
                        if (isSearching) {
                            count = searchMatchedCount ?? 0;
                        }
                        else {
                            count = await this.dataSource
                                .createQueryBuilder()
                                .select('COUNT(*)', 'count')
                                .from(viewName, 'v')
                                .where(whereClause)
                                .setParameters(whereParams)
                                .getRawOne()
                                .then((r) => Number(r.count));
                        }
                    }
                    else {
                        const p = [];
                        const wheres = ['serial.is_deleted = 0'];
                        let needAsset = false;
                        let needItem = false;
                        let needPItem = false;
                        let needLbm = false;
                        let needProc = false;
                        const addIntIn = (expr, vals) => {
                            const nums = vals
                                .map((v) => Number(v))
                                .filter((v) => !Number.isNaN(v));
                            if (!nums.length)
                                return;
                            p.push(nums);
                            wheres.push(`${expr} = ANY($${p.length}::int[])`);
                        };
                        if (branchIds.length) {
                            needPItem = true;
                            needLbm = true;
                            p.push(branchIds);
                            wheres.push(`lbm.branch_id = ANY($${p.length}::int[])`);
                        }
                        if (hasSelfAccess) {
                            needAsset = true;
                            p.push(userId);
                            wheres.push(`asset.asset_added_by = $${p.length}`);
                        }
                        needAsset = true;
                        wheres.push(`(asset.asset_sub_category_id IS DISTINCT FROM 15)`);
                        for (const f of activeFilters) {
                            switch (f.column) {
                                case 'main_category_id':
                                    needAsset = true;
                                    addIntIn('asset.asset_main_category_id', f.values);
                                    break;
                                case 'sub_category_id':
                                    needAsset = true;
                                    addIntIn('asset.asset_sub_category_id', f.values);
                                    break;
                                case 'manufacturer_id':
                                    needAsset = true;
                                    addIntIn('asset.manufacturer_id', f.values);
                                    break;
                                case 'asset_item_id':
                                    addIntIn('serial.asset_item_id', f.values);
                                    break;
                                case 'asset_id':
                                    addIntIn('serial.asset_id', f.values);
                                    break;
                                case 'stock_id':
                                    addIntIn('serial.stock_id', f.values);
                                    break;
                                case 'asset_status_type_id':
                                    addIntIn('serial.current_status_id', f.values);
                                    break;
                                case 'working_status_type_id':
                                    addIntIn('serial.working_status_type_id', f.values);
                                    break;
                                case 'asset_location':
                                    needPItem = true;
                                    needLbm = true;
                                    addIntIn('lbm.location_mapping_id', f.values);
                                    break;
                                case 'branch_id':
                                    needPItem = true;
                                    needLbm = true;
                                    addIntIn('lbm.branch_id', f.values);
                                    break;
                                case 'asset_ownership_status':
                                    needPItem = true;
                                    needProc = true;
                                    addIntIn('proc.ownership_status_id', f.values);
                                    break;
                                case 'item_type':
                                    needItem = true;
                                    p.push(f.values.map(String));
                                    wheres.push(`item.item_type::text = ANY($${p.length}::text[])`);
                                    break;
                            }
                        }
                        if (dateBetween?.column === 'purchase_date' && (dateBetween?.start || dateBetween?.end)) {
                            needPItem = true;
                            needProc = true;
                            if (dateBetween.start) {
                                const start = new Date(dateBetween.start);
                                start.setHours(0, 0, 0, 0);
                                p.push(start);
                                wheres.push(`proc.purchase_date >= $${p.length}`);
                            }
                            if (dateBetween.end) {
                                const end = new Date(dateBetween.end);
                                end.setHours(23, 59, 59, 999);
                                p.push(end);
                                wheres.push(`proc.purchase_date <= $${p.length}`);
                            }
                        }
                        for (const rf of rangeFilters) {
                            if (rf.column !== 'purchase_date')
                                continue;
                            needPItem = true;
                            needProc = true;
                            if (rf.from !== undefined) {
                                p.push(rf.from);
                                wheres.push(`proc.purchase_date >= $${p.length}`);
                            }
                            if (rf.to !== undefined) {
                                p.push(rf.to);
                                wheres.push(`proc.purchase_date <= $${p.length}`);
                            }
                        }
                        let joins = '';
                        if (needAsset)
                            joins += ` LEFT JOIN ${schema}.assets asset ON serial.asset_id = asset.asset_id`;
                        if (needItem)
                            joins += ` LEFT JOIN ${schema}.asset_items item ON serial.asset_item_id = item.asset_item_id`;
                        if (needPItem)
                            joins += ` LEFT JOIN ${schema}.asset_procurement_items p_item ON serial.procurement_item_id = p_item.procurement_item_id`;
                        if (needLbm)
                            joins += ` LEFT JOIN ${schema}.location_branch_mapping lbm ON p_item.location_id = lbm.location_mapping_id AND lbm.is_deleted = 0 AND lbm.is_active = 1`;
                        if (needProc)
                            joins += ` LEFT JOIN ${schema}.asset_procurements proc ON p_item.procurement_id = proc.procurement_id`;
                        const sql = `SELECT COUNT(*)::bigint AS count FROM ${schema}.asset_stock_serials serial` +
                            joins +
                            ` WHERE ` +
                            wheres.join(' AND ');
                        const res = await this.dataSource.query(sql, p);
                        count = Number(res?.[0]?.count ?? 0);
                    }
                    await this.redis.set(countCacheKey, count, 300);
                }
            }
            console.timeEnd('countQuery');
            const sortableMap = {
                system_code: 'v.system_code',
                asset_title: 'v.asset_title',
                stock_serials: 'v.stock_serials',
                item_type: 'v.item_type',
                asset_item_name: 'v.asset_item_name',
                asset_status_type_name: 'v.asset_status_type_name',
                asset_used_by: 'v.asset_used_by',
                asset_location: 'v.asset_location',
                purchase_date: 'v.purchase_date',
                asset_stocks_unique_id: 'v.asset_stocks_unique_id',
            };
            const idColumn = 'asset_stocks_unique_id';
            const idDbColumn = 'v.asset_stocks_unique_id';
            const defaultSort = {
                column: 'asset_stocks_unique_id',
                order: 'DESC',
            };
            const activeSortCol = sortArray?.[0]?.column;
            const isTimestampSort = activeSortCol === 'purchase_date';
            if (dto.getAll === true) {
                console.time('totalExecution');
                (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    timestampSort: isTimestampSort,
                });
                const rawRows = await qb.getRawMany();
                console.timeEnd('totalExecution');
                const total = rawRows.length;
                const response = {
                    success: true,
                    message: total
                        ? 'Stock Serials fetched successfully'
                        : 'No stock serials found',
                    data: rawRows,
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
                console.timeEnd('findAllSerials2_total_time');
                return response;
            }
            console.time('totalExecution');
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
                    timestampSort: isTimestampSort,
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
                    timestampSort: isTimestampSort,
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
                    timestampSort: isTimestampSort,
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            console.timeEnd('totalExecution');
            const total = count;
            const totalPages = total != null && total > 0
                ? Math.max(1, Math.ceil(total / limit))
                : null;
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
                        hasNextPage: totalPages != null
                            ? jumpPage < totalPages
                            : data.length === limit,
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
                    page.hasPrevPage =
                        total != null ? total > data.length : data.length === limit;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast && totalPages != null ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Stock Serials fetched successfully'
                    : 'No stock serials found',
                data,
                meta,
            };
            const ttl = cursorToken ? 30 : 60;
            if (count !== null) {
                await this.redis.set(countCacheKey, count, ttl);
            }
            console.timeEnd('findAllSerials2_total_time');
            return response;
        }
        catch (err) {
            console.error('findAllSerials2 ERROR:', err);
            throw err;
        }
    }
    async bulkCreateStocks(createStockDtos, organizationID, userId, schema, req) {
        console.log("schema", schema);
        const bulkResult = await this.dataSource.transaction(async (manager) => {
            const results = [];
            const allEventRows = [];
            const skippedAssets = [];
            let count = 0;
            const featureIdForAssetCreation = 2;
            const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
            let maxAssets = null;
            let remainingSlots = Infinity;
            if (enableFeatureRestriction) {
                const { assetRestriction, billingRestriction } = await restriction_util_1.RestrictionUtil.checkRestrictionAndLimitation(organizationID, featureIdForAssetCreation);
                if (billingRestriction?.value) {
                    maxAssets = Number(billingRestriction.value);
                }
                else if (assetRestriction?.overrideValue) {
                    maxAssets = Number(assetRestriction.overrideValue);
                }
                if (maxAssets !== null && !isNaN(maxAssets)) {
                    const totalExistingAssets = await manager
                        .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                        .createQueryBuilder('serial')
                        .where('serial.is_active = :isActive', { isActive: 1 })
                        .andWhere('serial.is_deleted = :isDeleted', { isDeleted: 0 })
                        .getCount();
                    remainingSlots = maxAssets - totalExistingAssets;
                    if (remainingSlots <= 0) {
                        throw new common_1.HttpException(`🚫 Asset limit reached. No more assets can be created.`, common_1.HttpStatus.FORBIDDEN);
                    }
                }
            }
            for (const createStockDto of createStockDtos) {
                console.log('SANGAM:A1');
                console.log('createStockDto', createStockDto);
                console.log('createStockDtos', createStockDtos);
                console.log('SANGAM:A2');
                try {
                    const toNullIfEmpty = (val) => val === '' || val === undefined ? null : val;
                    console.log('SANGAM:A3');
                    createStockDto.vendor_id = toNullIfEmpty(createStockDto.vendor_id);
                    createStockDto.location_id = toNullIfEmpty(createStockDto.location_id);
                    createStockDto.buy_price = toNullIfEmpty(createStockDto.buy_price);
                    createStockDto.gst_percent = toNullIfEmpty(createStockDto.gst_percent);
                    createStockDto.gst_amount = toNullIfEmpty(createStockDto.gst_amount);
                    createStockDto.total_without_gst = toNullIfEmpty(createStockDto.total_without_gst);
                    createStockDto.total_amount = toNullIfEmpty(createStockDto.total_amount);
                    createStockDto.purchase_date = toNullIfEmpty(createStockDto.purchase_date);
                    createStockDto.invoice_no = toNullIfEmpty(createStockDto.invoice_no);
                    console.log('SANGAM:A4');
                    if (typeof createStockDto.assetDetails === 'string') {
                        createStockDto.assetDetails = JSON.parse(createStockDto.assetDetails);
                    }
                    console.log('SANGAM:A5');
                    if (typeof createStockDto.information_fields === 'string') {
                        createStockDto.information_fields = JSON.parse(createStockDto.information_fields);
                    }
                    console.log('SANGAM:A6');
                    if (typeof createStockDto.warranty_details === 'string') {
                        createStockDto.warranty_details = JSON.parse(createStockDto.warranty_details);
                    }
                    console.log('SANGAM:A7');
                    if (typeof createStockDto.licence === 'string') {
                        createStockDto.licence = JSON.parse(createStockDto.licence);
                    }
                    console.log('SANGAM:A8');
                    if (!Array.isArray(createStockDto.assetDetails) ||
                        !createStockDto.assetDetails.length) {
                        throw new Error('Asset details missing');
                    }
                    console.log('SANGAM:A9');
                    let incomingCount = createStockDto.assetDetails?.length
                        ? createStockDto.assetDetails.length
                        : createStockDto.quantity || 1;
                    if (remainingSlots <= 0) {
                        skippedAssets.push({
                            asset_id: createStockDto.asset_id,
                            asset_title: 'N/A',
                            skipped_count: incomingCount,
                            reason: 'Limit reached',
                        });
                        continue;
                    }
                    let allowedCount = incomingCount;
                    if (incomingCount > remainingSlots) {
                        allowedCount = remainingSlots;
                    }
                    createStockDto.assetDetails = createStockDto.assetDetails.slice(0, allowedCount);
                    createStockDto.quantity = allowedCount;
                    if (!createStockDto.assetDetails.length)
                        continue;
                    const asset = await manager
                        .getRepository(asset_datum_entity_1.AssetDatum)
                        .createQueryBuilder('asset')
                        .select([
                        'asset.asset_item_id',
                        'asset.asset_main_category_id',
                        'asset.asset_sub_category_id',
                        'asset.asset_title',
                        'asset_description',
                    ])
                        .where('asset.asset_id = :asset_id', {
                        asset_id: createStockDto.asset_id,
                    })
                        .getRawOne();
                    if (!asset)
                        throw new Error('Asset not found');
                    const asset_title = asset.asset_asset_title;
                    const asset_item_id = asset.asset_asset_item_id;
                    const main_category_id = asset.asset_asset_main_category_id;
                    const sub_category_id = asset.asset_asset_sub_category_id;
                    const baseCode = await this.assetDataService.assetIDGenerateFormula({
                        assetId: createStockDto.asset_id,
                        branchId: createStockDto.branch_id ?? null,
                        departmentId: createStockDto.department_id ?? null,
                        categoryId: main_category_id,
                        subCategoryId: sub_category_id,
                        itemId: asset_item_id,
                    }, undefined, null, organizationID, req);
                    await this.generateSystemCodes(manager, createStockDto.assetDetails, baseCode, createStockDto.branch_id);
                    const stockRepo = manager.getRepository(stocks_entity_1.Stock);
                    let existingStock = await stockRepo.findOne({
                        where: {
                            asset_id: createStockDto.asset_id,
                            is_deleted: 0,
                        },
                        order: { stock_id: 'DESC' },
                    });
                    let savedStock;
                    if (existingStock) {
                        existingStock.quantity =
                            Number(existingStock.quantity) +
                                Number(createStockDto.quantity ?? 1);
                        existingStock.updated_at = new Date();
                        existingStock.updated_by = createStockDto.created_by ?? null;
                        savedStock = await stockRepo.save(existingStock);
                    }
                    else {
                        const newStock = stockRepo.create({
                            asset_id: createStockDto.asset_id,
                            quantity: createStockDto.quantity ?? 1,
                            location_id: createStockDto.location_id ?? null,
                            created_by: createStockDto.created_by ?? null,
                        });
                        savedStock = await stockRepo.save(newStock);
                    }
                    let previousProcurementItemId = null;
                    let previousProcurementId = null;
                    const previousSerial = await manager
                        .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                        .findOne({
                        where: {
                            asset_item_id: asset_item_id,
                            is_deleted: 0,
                        },
                        order: { asset_stocks_unique_id: 'DESC' },
                    });
                    if (previousSerial?.procurement_item_id) {
                        const prevItem = await manager
                            .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                            .findOne({
                            where: {
                                procurement_item_id: previousSerial.procurement_item_id,
                            },
                        });
                        if (prevItem) {
                            previousProcurementItemId = prevItem.procurement_item_id;
                            previousProcurementId = prevItem.procurement_id;
                        }
                    }
                    if (!previousProcurementId) {
                        const fallbackItem = await manager
                            .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                            .createQueryBuilder('item')
                            .leftJoin('asset_stock_serials', 'serial', 'serial.procurement_item_id = item.procurement_item_id')
                            .where('item.asset_id = :assetId', {
                            assetId: createStockDto.asset_id,
                        })
                            .orderBy('item.procurement_item_id', 'DESC')
                            .getOne();
                        if (fallbackItem) {
                            previousProcurementItemId = fallbackItem.procurement_item_id;
                            previousProcurementId = fallbackItem.procurement_id;
                        }
                    }
                    const procurementRepo = manager.getRepository(asset_procurements_entity_1.AssetProcurement);
                    console.log('SANGAM:A10');
                    const procurement = procurementRepo.create({
                        asset_id: createStockDto.asset_id,
                        vendor_id: createStockDto.vendor_id ?? null,
                        invoice_no: createStockDto.invoice_no ?? null,
                        bill_no: createStockDto.bill_no ?? null,
                        purchase_date: createStockDto.purchase_date ?? null,
                        unit_price: createStockDto.buy_price ?? null,
                        gst_percent: createStockDto.gst_percent ?? null,
                        gst_amount: createStockDto.gst_amount ?? null,
                        total_without_gst: createStockDto.total_without_gst ?? null,
                        total_amount: createStockDto.total_amount ?? null,
                        documents: createStockDto.documents ?? null,
                        license_details: createStockDto.licence ?? null,
                        created_by: createStockDto.created_by ?? null,
                        stock_id: savedStock.stock_id,
                        ownership_status_id: createStockDto.asset_ownership_status ?? null,
                        warranty_category: createStockDto.subscription_details
                            ?.warranty_category
                            ? createStockDto.subscription_details.warranty_category.map((val) => val)
                            : null,
                        sub_start_date: createStockDto.subscription_details?.sub_start_date ?? null,
                        next_renewal_date: createStockDto.subscription_details?.next_renewal_date ?? null,
                        subscription_type: createStockDto.subscription_details?.subscription_type ?? null,
                        billing_frequency: createStockDto.subscription_details?.billing_frequency ?? null,
                        previous_procurement_id: previousProcurementId ?? null,
                    });
                    const savedProcurement = await procurementRepo.save(procurement);
                    console.log('SANGAM:A11');
                    const procurementItemRepo = manager.getRepository(asset_procurement_items_entity_1.AssetProcurementItem);
                    const procurementItem = procurementItemRepo.create({
                        procurement_id: savedProcurement.procurement_id,
                        asset_id: createStockDto.asset_id,
                        quantity: createStockDto.quantity ?? 1,
                        location_id: createStockDto.location_id ?? null,
                        previous_procurement_item_id: previousProcurementItemId ?? null,
                    });
                    const savedProcurementItem = await procurementItemRepo.save(procurementItem);
                    const serialRepo = manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials);
                    console.log('SANGAM:A12');
                    const serialRows = createStockDto.assetDetails.map((detail) => ({
                        asset_id: createStockDto.asset_id,
                        stock_id: savedStock.stock_id,
                        asset_item_id,
                        stock_serials: detail.serial_number ?? null,
                        system_code: detail.system_code ?? null,
                        asset_serial_title: createStockDto.asset_title,
                        procurement_item_id: savedProcurementItem.procurement_item_id,
                        location_id: createStockDto.location_id ?? null,
                        current_status_id: 1,
                        working_status_type_id: 18,
                        created_by: createStockDto.created_by ?? null,
                    }));
                    const serialInsert = await serialRepo.insert(serialRows);
                    const serialIds = serialInsert.raw.map((r) => r.asset_stocks_unique_id);
                    console.log('SANGAM:A13');
                    await Promise.all([
                        createStockDto.warranty_details
                            ? manager.getRepository(asset_warranty_details_entity_1.AssetWarrantyDetailsRepository).insert(serialIds.map((id) => ({
                                procurement_id: savedProcurement.procurement_id,
                                asset_stocks_unique_id: id,
                                asset_id: createStockDto.asset_id,
                                stock_id: savedStock.stock_id,
                                asset_item_id,
                                ...createStockDto.warranty_details,
                            })))
                            : Promise.resolve(),
                        createStockDto.subscription_details
                            ? manager.getRepository(asset_software_subscription_entity_1.AssetSoftwareSubscription).insert(serialIds.map((id) => ({
                                procurement_id: savedProcurement.procurement_id,
                                asset_stocks_unique_id: id,
                                asset_id: createStockDto.asset_id,
                                stock_id: savedStock.stock_id,
                                asset_item_id,
                                ...createStockDto.subscription_details,
                            })))
                            : Promise.resolve(),
                    ]);
                    console.log('SANGAM:A14');
                    const insertedCount = serialInsert.identifiers.length;
                    remainingSlots -= insertedCount;
                    const eventRows = serialIds.map((serialId) => ({
                        asset_id: createStockDto.asset_id,
                        asset_stocks_unique_id: serialId,
                        title: 'Asset Created Via Bulk Add Opration',
                        description: asset.asset_description || 'Asset Created',
                        reference_table: 'asset_procurements',
                        reference_id: savedProcurement.procurement_id,
                        metadata: {
                            stock_id: savedStock.stock_id,
                            procurement_id: savedProcurement.procurement_id,
                        },
                        performed_by: createStockDto.created_by ?? null,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: 'LIFECYCLE',
                        event_type_id: 18,
                    }));
                    allEventRows.push(...eventRows);
                    console.log('SANGAM:A16');
                    results.push({
                        asset_id: createStockDto.asset_id,
                        asset_title,
                        stock_id: savedStock.stock_id,
                        quantity: createStockDto.quantity,
                        serial_count: serialInsert.identifiers.length,
                        status: 'SUCCESS',
                    });
                    console.log('SANGAM:A17');
                    if (incomingCount > allowedCount) {
                        skippedAssets.push({
                            asset_id: createStockDto.asset_id,
                            asset_title,
                            skipped_count: incomingCount - allowedCount,
                            reason: 'Limit exceeded',
                        });
                    }
                    count++;
                    console.log('SANGAM:A18');
                }
                catch (error) {
                    results.push({
                        asset_id: createStockDto.asset_id,
                        asset_title: 'N/A',
                        error: error.message,
                        status: 'FAILED',
                    });
                }
            }
            console.log('SANGAM:A19');
            if (allEventRows.length) {
                const eventRepo = manager.getRepository(asset_events_entity_1.AssetEvent);
                await eventRepo.insert(allEventRows);
            }
            const STOCK_CREATION_EVENT_ID = 49;
            console.log("USER:LOG", schema);
            const createdUserResult = await this.dataSource.query(`SELECT user_id, first_name, last_name, users_business_email FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            const createdUser = createdUserResult[0];
            const totalAssetsCreated = results.reduce((acc, curr) => {
                return acc + (curr.serial_count || 0);
            }, 0);
            const contextData = {
                updatedUser: {
                    first_name: createdUser?.first_name,
                    last_name: createdUser?.last_name,
                },
                assetStockSerial: {
                    quantity: totalAssetsCreated,
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
                eventId: STOCK_CREATION_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: `STOCK_BULK_${Date.now()}`,
                },
            });
            if (enableFeatureRestriction) {
                try {
                    const totalAssetsAfterInsert = await manager
                        .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                        .createQueryBuilder('serial')
                        .where('serial.is_active = :isActive', { isActive: 1 })
                        .andWhere('serial.is_deleted = :isDeleted', { isDeleted: 0 })
                        .getCount();
                    await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationID, featureIdForAssetCreation, totalAssetsAfterInsert.toString());
                }
                catch (err) {
                    console.error('Usage update failed:', err.message);
                }
            }
            return {
                message: 'Bulk stock creation completed',
                data: results,
                skipped: skippedAssets,
                remaining_capacity: remainingSlots,
            };
        });
        this.depViewService.scheduleRefresh(organizationID);
        this.stockSummaryRefresh.scheduleRefresh(organizationID);
        return bulkResult;
    }
    async selectionPreflight(body, userId, branchIds, schema) {
        const action = body?.action;
        if (!action || !asset_action_rules_1.ASSET_ACTION_RULES[action]) {
            throw new common_1.HttpException(`Unknown action '${action}'`, common_1.HttpStatus.BAD_REQUEST);
        }
        let ids = [];
        if (body.isSelectAll) {
            const rawFilters = Array.isArray(body.filters?.filters)
                ? body.filters.filters
                : Array.isArray(body.filters)
                    ? body.filters
                    : Array.isArray(body.filters)
                        ? body.filters
                        : [];
            const resolved = await this.findAllSerials2({ filters: rawFilters, getAll: true }, userId, branchIds, schema);
            ids = (resolved?.data || []).map((r) => Number(r.asset_stocks_unique_id));
            const excl = new Set((body.excludeIds || []).map(Number));
            if (excl.size)
                ids = ids.filter((id) => !excl.has(id));
        }
        else {
            ids = [...new Set((body.ids || []).map(Number))].filter((n) => Number.isInteger(n));
        }
        const totalMatched = ids.length;
        if (!totalMatched) {
            return {
                success: true,
                action,
                totalMatched: 0,
                eligibleCount: 0,
                blockedCount: 0,
                driftDetected: body.expectedCount != null && body.expectedCount !== 0,
                summary: [],
                blocked: { page: 1, limit: 0, total: 0, rows: [] },
                rows: { page: 1, limit: 0, total: 0, scope: body.scope ?? 'blocked', rows: [] },
                stats: {
                    assignedCount: 0,
                    unassignedCount: 0,
                    softwareCount: 0,
                    assetCount: 0,
                    allAssigned: false,
                    allUnassigned: false,
                    isMixedAssignment: false,
                    allSoftware: false,
                    allAsset: false,
                    isMixedKind: false,
                },
            };
        }
        const caseSql = (0, asset_action_rules_1.buildRuleCaseSql)(action, schema);
        const view = `${schema}.v_asset_stock_serials`;
        const rows = await this.dataSource.query(`SELECT v.asset_stocks_unique_id,
              v.system_code,
              v.stock_serials,
              v.asset_id,
              v.asset_title,
              v.asset_item_name,
              v.asset_main_category_name,
              v.asset_sub_category_name,
              v.asset_status_type_id,
              v.asset_status_type_name,
              v.asset_status_for_category,
              v.working_status_type_id,
              v.working_status_type_name,
              v.asset_used_by,
              v.assigned_to_name,
              v.mapping_id,
              v.target_type,
              v.target_id,
              v.is_software,
              v.location_name,
              v.license_metric,
              v.item_type,
              ${caseSql ?? 'NULL'} AS rule_code
       FROM ${view} v
       WHERE v.asset_stocks_unique_id = ANY($1::int[])`, [ids]);
        const rules = asset_action_rules_1.ASSET_ACTION_RULES[action];
        const blockedRows = rows.filter((r) => r.rule_code);
        const counts = new Map();
        for (const r of blockedRows) {
            counts.set(r.rule_code, (counts.get(r.rule_code) || 0) + 1);
        }
        const summary = rules
            .filter((r) => counts.has(r.code))
            .map((r) => ({
            ruleCode: r.code,
            label: r.label,
            count: counts.get(r.code),
            remediable: r.remediable === true,
        }));
        const page = Math.max(1, Number(body.blockedPage) || 1);
        const limit = Math.min(200, Math.max(1, Number(body.blockedLimit) || 50));
        const start = (page - 1) * limit;
        const byCode = new Map(rules.map((r) => [r.code, r]));
        const pageRows = blockedRows.slice(start, start + limit).map((r) => {
            const rule = byCode.get(r.rule_code);
            return {
                asset_stocks_unique_id: r.asset_stocks_unique_id,
                system_code: r.system_code,
                asset_title: r.asset_title,
                asset_item_name: r.asset_item_name,
                current_status_id: r.asset_status_type_id,
                current_status_name: r.asset_status_type_name,
                working_status_type_id: r.working_status_type_id,
                working_status_name: r.working_status_type_name,
                assigned_to_name: r.asset_used_by ?? null,
                location_name: r.location_name ?? null,
                license_metric: r.license_metric ?? null,
                item_type: r.item_type ?? null,
                ruleCode: r.rule_code,
                reason: rule?.reason ?? 'Not eligible for this action.',
                remediable: rule?.remediable === true,
            };
        });
        const scope = body.scope ?? 'blocked';
        const scoped = scope === 'all'
            ? rows
            : scope === 'eligible'
                ? rows.filter((r) => !r.rule_code)
                : blockedRows;
        scoped.sort((a, b) => Number(a.asset_stocks_unique_id) - Number(b.asset_stocks_unique_id));
        const scopedPage = scoped.slice(start, start + limit).map((r) => {
            const rule = r.rule_code ? byCode.get(r.rule_code) : undefined;
            return {
                asset_stocks_unique_id: r.asset_stocks_unique_id,
                system_code: r.system_code,
                stock_serials: r.stock_serials ?? null,
                asset_id: r.asset_id,
                asset_title: r.asset_title,
                asset_item_name: r.asset_item_name,
                main_category: r.asset_main_category_name ?? null,
                sub_category: r.asset_sub_category_name ?? null,
                item_name: r.asset_item_name ?? null,
                asset_main_category_name: r.asset_main_category_name ?? null,
                asset_sub_category_name: r.asset_sub_category_name ?? null,
                asset_status_type_id: r.asset_status_type_id,
                asset_status_type_name: r.asset_status_type_name,
                asset_status_for_category: r.asset_status_for_category ?? null,
                current_status_id: r.asset_status_type_id,
                current_status_name: r.asset_status_type_name,
                working_status_type_id: r.working_status_type_id,
                working_status_type_name: r.working_status_type_name,
                working_status_name: r.working_status_type_name,
                asset_used_by: r.asset_used_by ?? null,
                assigned_to_name: r.assigned_to_name ?? null,
                displayname: r.asset_title,
                mapping_id: r.mapping_id ?? null,
                target_type: r.target_type ?? null,
                target_id: r.target_id ?? null,
                is_software: r.is_software ?? false,
                location_name: r.location_name ?? null,
                license_metric: r.license_metric ?? null,
                item_type: r.item_type ?? null,
                eligible: !r.rule_code,
                ruleCode: r.rule_code ?? null,
                reason: r.rule_code
                    ? (rule?.reason ?? 'Not eligible for this action.')
                    : null,
                remediable: rule?.remediable === true,
            };
        });
        const assignedCount = rows.filter((r) => Number(r.asset_status_type_id) === 7).length;
        const softwareCount = rows.filter((r) => r.is_software === true).length;
        const n = rows.length;
        const stats = {
            assignedCount,
            unassignedCount: n - assignedCount,
            softwareCount,
            assetCount: n - softwareCount,
            allAssigned: n > 0 && assignedCount === n,
            allUnassigned: n > 0 && assignedCount === 0,
            isMixedAssignment: n > 0 && assignedCount > 0 && assignedCount < n,
            allSoftware: n > 0 && softwareCount === n,
            allAsset: n > 0 && softwareCount === 0,
            isMixedKind: n > 0 && softwareCount > 0 && softwareCount < n,
        };
        let relationshipImpact = {
            hasImpact: false,
            hosting: { hostServerCount: 0, totalGuestVmsCount: 0, hosts: [] },
            software: { deviceCount: 0, totalSoftwareCount: 0, devices: [] },
        };
        if (ids.length > 0 && ['SCRAP', 'MAINTENANCE', 'TRANSFER'].includes(action)) {
            try {
                const [hostedRows, softwareRows] = await Promise.all([
                    this.dataSource.query(`
            SELECT 
              m.mapping_id,
              (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) AS host_serial_id,
              (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS guest_serial_id,
              COALESCE(ass_host.system_code, 'ID ' || (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END)::text) AS host_system_code,
              COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host') AS host_name,
              COALESCE(ass_guest.system_code, 'ID ' || (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS guest_system_code,
              COALESCE(ass_guest.asset_serial_title, a_guest.asset_title, 'Guest VM') AS guest_name
            FROM ${schema}.asset_mapping m
            LEFT JOIN ${schema}.asset_stock_serials ass_source ON ass_source.asset_stocks_unique_id = m.asset_stocks_unique_id
            LEFT JOIN ${schema}.assets a_source ON a_source.asset_id = ass_source.asset_id
            LEFT JOIN ${schema}.asset_stock_serials ass_target ON ass_target.asset_stocks_unique_id = m.target_id
            LEFT JOIN ${schema}.assets a_target ON a_target.asset_id = ass_target.asset_id
            LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END)
            LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
            LEFT JOIN ${schema}.asset_stock_serials ass_guest ON ass_guest.asset_stocks_unique_id = (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.asset_stocks_unique_id ELSE m.target_id END)
            LEFT JOIN ${schema}.assets a_guest ON a_guest.asset_id = ass_guest.asset_id
            WHERE m.relation_type = 'REL-010'
              AND m.is_active = 1
              AND m.is_deleted = 0
              AND (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) = ANY($1::int[]);
            `, [ids]),
                    this.dataSource.query(`
            SELECT 
              m.mapping_id,
              (CASE WHEN m.target_type = 'SOFTWARE' THEN m.asset_stocks_unique_id ELSE m.target_id END) AS device_serial_id,
              COALESCE(ass_dev.system_code, 'ID ' || (CASE WHEN m.target_type = 'SOFTWARE' THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS device_system_code,
              COALESCE(ass_dev.asset_serial_title, a_dev.asset_title, 'Device') AS device_name,
              (CASE WHEN m.target_type = 'SOFTWARE' THEN m.target_id ELSE m.asset_stocks_unique_id END) AS software_id,
              COALESCE(ass_sw.asset_serial_title, a_sw.asset_title, 'Software') AS software_name,
              ass_sw.system_code AS software_code
            FROM ${schema}.asset_mapping m
            LEFT JOIN ${schema}.asset_stock_serials ass_dev ON ass_dev.asset_stocks_unique_id = (CASE WHEN m.target_type = 'SOFTWARE' THEN m.asset_stocks_unique_id ELSE m.target_id END)
            LEFT JOIN ${schema}.assets a_dev ON a_dev.asset_id = ass_dev.asset_id
            LEFT JOIN ${schema}.asset_stock_serials ass_sw ON ass_sw.asset_stocks_unique_id = (CASE WHEN m.target_type = 'SOFTWARE' THEN m.target_id ELSE m.asset_stocks_unique_id END)
            LEFT JOIN ${schema}.assets a_sw ON a_sw.asset_id = ass_sw.asset_id
            WHERE m.relation_type = 'REL-006'
              AND m.is_active = 1
              AND m.is_deleted = 0
              AND (CASE WHEN m.target_type = 'SOFTWARE' THEN m.asset_stocks_unique_id ELSE m.target_id END) = ANY($1::int[]);
            `, [ids]),
                ]);
                const hostMap = new Map();
                for (const row of hostedRows || []) {
                    const hostId = Number(row.host_serial_id);
                    if (!hostMap.has(hostId)) {
                        hostMap.set(hostId, {
                            host_id: hostId,
                            host_system_code: row.host_system_code,
                            host_name: row.host_name,
                            guest_vms: [],
                        });
                    }
                    hostMap.get(hostId).guest_vms.push({
                        guest_id: Number(row.guest_serial_id),
                        guest_system_code: row.guest_system_code,
                        guest_name: row.guest_name,
                    });
                }
                const swMap = new Map();
                for (const row of softwareRows || []) {
                    const devId = Number(row.device_serial_id);
                    if (!swMap.has(devId)) {
                        swMap.set(devId, {
                            device_id: devId,
                            device_system_code: row.device_system_code,
                            device_name: row.device_name,
                            software_list: [],
                        });
                    }
                    swMap.get(devId).software_list.push({
                        software_id: Number(row.software_id),
                        software_name: row.software_name,
                        software_code: row.software_code,
                    });
                }
                relationshipImpact = {
                    hasImpact: hostMap.size > 0 || swMap.size > 0,
                    hosting: {
                        hostServerCount: hostMap.size,
                        totalGuestVmsCount: (hostedRows || []).length,
                        hosts: Array.from(hostMap.values()),
                    },
                    software: {
                        deviceCount: swMap.size,
                        totalSoftwareCount: (softwareRows || []).length,
                        devices: Array.from(swMap.values()),
                    },
                };
            }
            catch (impactErr) {
                console.error('Failed to compute relationshipImpact in selectionPreflight:', impactErr);
            }
        }
        return {
            success: true,
            action,
            totalMatched,
            eligibleCount: totalMatched - blockedRows.length,
            blockedCount: blockedRows.length,
            rows: {
                page,
                limit,
                scope,
                total: scoped.length,
                totalPages: Math.max(1, Math.ceil(scoped.length / limit)),
                rows: scopedPage,
            },
            stats,
            relationshipImpact,
            driftDetected: body.expectedCount != null && body.expectedCount !== totalMatched,
            expectedCount: body.expectedCount ?? null,
            summary,
            blocked: {
                page,
                limit,
                total: blockedRows.length,
                rows: pageRows,
            },
        };
    }
    async resolveSelectionIds(body, userId, branchIds, schema) {
        const CAP = 20000;
        const pre = await this.selectionPreflight({ ...body, scope: 'eligible', blockedPage: 1, blockedLimit: 1 }, userId, branchIds, schema);
        if (!pre?.success)
            return pre;
        if (pre.eligibleCount > CAP) {
            throw new common_1.HttpException(`Selection too large: ${pre.eligibleCount} eligible assets exceeds the ${CAP} limit for a single bulk action. Narrow the filters and run it in batches.`, common_1.HttpStatus.PAYLOAD_TOO_LARGE);
        }
        const full = await this.selectionPreflight({
            ...body,
            scope: 'eligible',
            blockedPage: 1,
            blockedLimit: Math.max(1, pre.eligibleCount),
        }, userId, branchIds, schema);
        return {
            success: true,
            action: body.action,
            totalMatched: full.totalMatched,
            eligibleCount: full.eligibleCount,
            blockedCount: full.blockedCount,
            driftDetected: full.driftDetected,
            summary: full.summary,
            ids: (full.rows?.rows ?? []).map((r) => r.asset_stocks_unique_id),
            rows: full.rows?.rows ?? [],
        };
    }
    async exportAssetsToExcel(dto, userId, branchIds = [], schema) {
        try {
            const d = dto;
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const rangeFilters = dto.range_filters || [];
            const dateBetween = dto.date_between;
            const selectedIds = dto.selectedIds || [];
            const isSelectAll = dto.isSelectAll === true;
            const excludeIds = (dto.excludeIds || [])
                .map(Number)
                .filter((n) => Number.isInteger(n));
            const EXPORT_ROW_CAP = 50000;
            let visibleColumns = dto.visible_columns;
            if (visibleColumns &&
                typeof visibleColumns === 'object' &&
                !Array.isArray(visibleColumns)) {
                visibleColumns = Object.keys(visibleColumns).filter((k) => visibleColumns[k] === true);
            }
            if (typeof visibleColumns === 'string') {
                try {
                    visibleColumns = JSON.parse(visibleColumns);
                }
                catch {
                    visibleColumns = [];
                }
            }
            if (!Array.isArray(visibleColumns))
                visibleColumns = [];
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const cachedRole = await this.redis.get(roleCacheKey);
            let roleId;
            if (cachedRole !== null && cachedRole !== undefined) {
                roleId = cachedRole;
            }
            else {
                const user = await this.dataSource.query(`
        SELECT role_id
        FROM ${schema}.users
        WHERE user_id = $1
        LIMIT 1
        `, [userId]);
                if (!user?.length) {
                    throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
                }
                roleId = user[0].role_id;
                await this.redis.set(roleCacheKey, roleId, 600);
            }
            const permCacheKey = `perm:${roleId}`;
            let hasSelfAccess = await this.redis.get(permCacheKey);
            if (hasSelfAccess === null) {
                const selfPermission = await this.specialPermissionRepo.findOne({
                    where: { attr_key: 'view_self_added_assets' },
                    select: ['id'],
                });
                const selfPolicy = selfPermission
                    ? await this.policyAttrRepo
                        .createQueryBuilder('pa')
                        .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                        .andWhere('pa.special_permission_master_id = :spId', {
                        spId: selfPermission.id,
                    })
                        .getOne()
                    : null;
                hasSelfAccess = !!selfPolicy;
                await this.redis.set(permCacheKey, hasSelfAccess, 300);
            }
            const whereConditions = [];
            const params = [];
            let paramCounter = 1;
            const hasSoftwareFilter = filters?.some(f => ['is_software', 'item_type', 'sub_category_id', 'main_category_id', 'sub_category_name', 'asset_main_category_name'].includes(f.column));
            if (!hasSoftwareFilter) {
                whereConditions.push('v.sub_category_id <> 15');
            }
            if (branchIds.length && hasSelfAccess) {
                whereConditions.push(`v.asset_added_by = $${paramCounter++}`);
                params.push(userId);
                whereConditions.push(`v.location_branch_id = ANY($${paramCounter++}::int[])`);
                params.push(branchIds);
            }
            else if (branchIds.length) {
                whereConditions.push(`v.location_branch_id = ANY($${paramCounter++}::int[])`);
                params.push(branchIds);
            }
            else if (hasSelfAccess) {
                whereConditions.push(`v.asset_added_by = $${paramCounter++}`);
                params.push(userId);
            }
            if (isSelectAll) {
                if (excludeIds.length) {
                    whereConditions.push(`v.asset_stocks_unique_id <> ALL($${paramCounter++}::int[])`);
                    params.push(excludeIds);
                }
            }
            else if (selectedIds.length) {
                whereConditions.push(`v.asset_stocks_unique_id = ANY($${paramCounter++}::int[])`);
                params.push(selectedIds);
            }
            for (const s of searchArray) {
                if (!s.values?.length)
                    continue;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                if (!value)
                    continue;
                const pattern = `%${value}%`;
                const rows = await this.dataSource.query(`
        WITH matched AS (
          SELECT serial.asset_stocks_unique_id
          FROM ${schema}.asset_stock_serials serial
          WHERE serial.is_deleted = 0
            AND (
              serial.stock_serials ILIKE $1
              OR serial.system_code ILIKE $1
              OR serial.asset_serial_title ILIKE $1
            )

          UNION

          SELECT serial.asset_stocks_unique_id
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.asset_items item
            ON serial.asset_item_id = item.asset_item_id
          WHERE serial.is_deleted = 0
            AND (
              item.asset_item_name ILIKE $1
              OR item.item_type::text ILIKE $1
            )

          UNION

          SELECT serial.asset_stocks_unique_id
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.assets asset
            ON serial.asset_id = asset.asset_id
          JOIN ${schema}.asset_main_category main_cat
            ON asset.asset_main_category_id = main_cat.main_category_id
          WHERE serial.is_deleted = 0
            AND main_cat.main_category_name ILIKE $1

          UNION

          SELECT serial.asset_stocks_unique_id
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.assets asset
            ON serial.asset_id = asset.asset_id
          JOIN ${schema}.asset_sub_category sub_cat
            ON asset.asset_sub_category_id = sub_cat.sub_category_id
          WHERE serial.is_deleted = 0
            AND sub_cat.sub_category_name ILIKE $1

          UNION

          SELECT serial.asset_stocks_unique_id
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.asset_procurement_items p_item
            ON serial.procurement_item_id = p_item.procurement_item_id
          JOIN ${schema}.location_branch_mapping lbm
            ON p_item.location_id = lbm.location_mapping_id
           AND lbm.is_deleted = 0
           AND lbm.is_active = 1
          JOIN ${schema}.asset_locations loc
            ON lbm.location_id = loc.location_id
          WHERE serial.is_deleted = 0
            AND loc.location_name ILIKE $1
        )
        SELECT asset_stocks_unique_id
        FROM matched
        LIMIT 5000;
        `, [pattern]);
                const matchedIds = rows.map((r) => r.asset_stocks_unique_id);
                if (!matchedIds.length) {
                    whereConditions.push('1=0');
                }
                else {
                    whereConditions.push(`v.asset_stocks_unique_id = ANY($${paramCounter++}::int[])`);
                    params.push(matchedIds);
                }
            }
            const intColumns = [
                'asset_id',
                'asset_item_id',
                'stock_id',
                'procurement_id',
                'procurement_item_id',
                'main_category_id',
                'sub_category_id',
                'branch_id',
                'asset_status_type_id',
                'department_id',
                'asset_managed_by',
                'asset_used_by',
                'asset_location',
                'asset_ownership_status',
                'manufacturer_id',
                'working_status_type_id',
            ];
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                if (f.column === 'item_type') {
                    whereConditions.push(`v.item_type::text = ANY($${paramCounter++}::text[])`);
                    params.push(f.values);
                    continue;
                }
                if (f.column === 'type') {
                    const val = f.values?.[0];
                    if (val === 'ASSIGNED') {
                        whereConditions.push('v.mapping_id IS NOT NULL');
                    }
                    else if (val === 'INSTOCK') {
                        whereConditions.push('v.asset_status_type_id IN (1, 5) AND v.mapping_id IS NULL');
                    }
                    continue;
                }
                if (f.column === 'branch_id') {
                    const vals = f.values.map((v) => parseInt(v)).filter(Boolean);
                    if (vals.length) {
                        whereConditions.push(`v.location_branch_id = ANY($${paramCounter++}::int[])`);
                        params.push(vals);
                    }
                    continue;
                }
                const isInt = intColumns.includes(f.column);
                const values = f.values
                    .map((v) => (isInt ? parseInt(v, 10) : v))
                    .filter((v) => v !== null && v !== undefined && !isNaN(v));
                if (!values.length)
                    continue;
                if (isInt) {
                    whereConditions.push(`v.${f.column} = ANY($${paramCounter++}::int[])`);
                    params.push(values);
                }
                else {
                    const orConditions = values.map((val, i) => `v.${f.column} ILIKE $${paramCounter + i}`);
                    whereConditions.push(`(${orConditions.join(' OR ')})`);
                    values.forEach((val) => {
                        params.push(`%${val}%`);
                        paramCounter++;
                    });
                }
            }
            if (dateBetween?.column && (dateBetween?.start || dateBetween?.end)) {
                if (dateBetween.start && dateBetween.end) {
                    const start = new Date(dateBetween.start);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateBetween.end);
                    end.setHours(23, 59, 59, 999);
                    whereConditions.push(`v.${dateBetween.column} BETWEEN $${paramCounter++} AND $${paramCounter++}`);
                    params.push(start, end);
                }
                else if (dateBetween.start) {
                    const start = new Date(dateBetween.start);
                    start.setHours(0, 0, 0, 0);
                    whereConditions.push(`v.${dateBetween.column} >= $${paramCounter++}`);
                    params.push(start);
                }
                else if (dateBetween.end) {
                    const end = new Date(dateBetween.end);
                    end.setHours(23, 59, 59, 999);
                    whereConditions.push(`v.${dateBetween.column} <= $${paramCounter++}`);
                    params.push(end);
                }
            }
            for (const rf of rangeFilters) {
                if (!rf.column)
                    continue;
                if (rf.from !== undefined) {
                    whereConditions.push(`v.${rf.column} >= $${paramCounter++}`);
                    params.push(rf.from);
                }
                if (rf.to !== undefined) {
                    whereConditions.push(`v.${rf.column} <= $${paramCounter++}`);
                    params.push(rf.to);
                }
            }
            const sortableMap = {
                system_code: 'v.system_code',
                asset_title: 'v.asset_title',
                stock_serials: 'v.stock_serials',
                item_type: 'v.item_type',
                asset_item_name: 'v.asset_item_name',
                asset_status_type_name: 'v.asset_status_type_name',
                asset_used_by: 'v.asset_used_by',
                asset_location: 'v.asset_location',
                purchase_date: 'v.purchase_date',
                asset_stocks_unique_id: 'v.asset_stocks_unique_id',
            };
            let orderByClause = 'v.asset_stocks_unique_id DESC';
            if (sortArray.length > 0) {
                const orderParts = sortArray.map((s) => {
                    const column = sortableMap[s.column] || `v.${s.column}`;
                    const direction = s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
                    return `${column} ${direction}`;
                });
                orderByClause = orderParts.join(', ');
            }
            const viewName = `${schema}.v_asset_stock_serials`;
            const whereClause = whereConditions.length > 0
                ? `WHERE ${whereConditions.join(' AND ')}`
                : '';
            const query = `
      SELECT 
        v.*
      FROM ${viewName} v
      ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT ${EXPORT_ROW_CAP + 1}
    `;
            const rawRows = await this.dataSource.query(query, params);
            if (rawRows.length > EXPORT_ROW_CAP) {
                throw new common_1.HttpException(`This export matches more than ${EXPORT_ROW_CAP.toLocaleString()} assets. ` +
                    `Narrow the filters and try again.`, common_1.HttpStatus.PAYLOAD_TOO_LARGE);
            }
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Assets');
            const tableColumns = [
                { key: 'system_code', label: 'Asset ID' },
                { key: 'asset_title', label: 'Asset Title' },
                { key: 'stock_serials', label: 'Serial Number / Licence Key' },
                { key: 'item_type', label: 'Asset Type' },
                { key: 'asset_item_name', label: 'Category' },
                { key: 'asset_status_type_name', label: 'Status' },
                { key: 'assigned_to_name', label: 'Assigned To' },
                { key: 'location_name', label: 'Location' },
                { key: 'purchase_date', label: 'Purchase Date' },
            ];
            let headersToUse = tableColumns;
            if (visibleColumns.length > 0) {
                const visibleKeys = new Set(visibleColumns);
                headersToUse = tableColumns.filter(col => {
                    if (col.key === 'assigned_to_name' && visibleKeys.has('asset_used_by')) {
                        return true;
                    }
                    if (col.key === 'location_name' && visibleKeys.has('asset_location')) {
                        return true;
                    }
                    return visibleKeys.has(col.key);
                });
            }
            const headers = ['Sr. No.', ...headersToUse.map(h => h.label)];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            rawRows.forEach((row, index) => {
                const rowNum = index + 2;
                sheet.cell(rowNum, 1).value(index + 1);
                headersToUse.forEach((col, colIndex) => {
                    const cellIndex = colIndex + 2;
                    let value = row[col.key];
                    if (col.key === 'purchase_date' && value) {
                        value = new Date(value).toLocaleDateString();
                    }
                    else if (col.key === 'item_type' && value) {
                        value =
                            value === 'software'
                                ? 'Software'
                                : value === 'hardware'
                                    ? 'Hardware'
                                    : value === 'Virtual'
                                        ? 'Virtual'
                                        : value;
                    }
                    else if (!value) {
                        value = '--';
                    }
                    sheet.cell(rowNum, cellIndex).value(value);
                });
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(Math.max(headers[i].length + 15, 20));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportAssetsToExcel ERROR:', error);
            throw error;
        }
    }
    async getAllStocksFromDto(dto, branchIds = [], userId, schema) {
        console.log(' vk branchIds', branchIds);
        try {
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page
                ? Number(d.page)
                : dto.pagination?.page
                    ? Number(dto.pagination.page)
                    : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalRaw = d.knownTotal ?? d.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            let locationIds = null;
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const roleId = await (async () => {
                const cachedRole = await this.redis.get(roleCacheKey);
                if (cachedRole !== null && cachedRole !== undefined) {
                    return cachedRole;
                }
                const user = await this.dataSource.query(`
        SELECT role_id
        FROM ${schema}.users
        WHERE user_id = $1
        LIMIT 1
        `, [userId]);
                if (!user?.length) {
                    throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
                }
                const roleId = user[0].role_id;
                await this.redis.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            let hasSelfAccess = await this.redis.get(permCacheKey);
            if (hasSelfAccess === null) {
                const selfPermission = await this.specialPermissionRepo.findOne({
                    where: { attr_key: 'view_self_added_assets' },
                    select: ['id'],
                });
                const selfPolicy = selfPermission
                    ? await this.policyAttrRepo
                        .createQueryBuilder('pa')
                        .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                        .andWhere('pa.special_permission_master_id = :spId', {
                        spId: selfPermission.id,
                    })
                        .getOne()
                    : null;
                hasSelfAccess = !!selfPolicy;
                await this.redis.set(permCacheKey, hasSelfAccess, 300);
            }
            let selfItemIds = null;
            if (hasSelfAccess) {
                const ownedItems = await this.dataSource.query(`SELECT DISTINCT serial.asset_item_id
         FROM ${schema}.asset_stock_serials serial
         WHERE serial.created_by = $1
           AND serial.is_deleted = 0`, [userId]);
                selfItemIds = ownedItems.map((r) => r.asset_item_id);
            }
            const qb = this.stockViewRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            if (branchIds.length > 0) {
                const branchLocationIds = await this.dataSource.query(`SELECT DISTINCT lbm.location_mapping_id
   FROM location_branch_mapping lbm
   WHERE lbm.branch_id = ANY($1)
     AND lbm.is_deleted = 0
     AND lbm.is_active = 1`, [branchIds]);
                const allowedLocationIds = branchLocationIds.map((l) => l.location_mapping_id);
                console.log('vk allowedLocationIds', allowedLocationIds);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('1=0');
                }
            }
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    qb.andWhere('(v.location_id IN (:...filterLocationIds) OR v.location_id IS NULL)', { filterLocationIds: locationIds });
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const useSelfFilter = hasSelfAccess === true;
            const hasOwnedItems = !!(selfItemIds && selfItemIds.length > 0);
            const filterConditions = [];
            if (useLocFilter)
                filterConditions.push('v.location_id IN (:...locationIds)');
            if (useSelfFilter) {
                filterConditions.push(hasOwnedItems ? 'v.asset_item_id IN (:...selfItemIds)' : '1=0');
            }
            const buildAggExpr = (col) => filterConditions.length > 0
                ? `COALESCE(SUM(v.${col}) FILTER (WHERE ${filterConditions.join(' AND ')}), 0)`
                : `SUM(v.${col})`;
            const totalAssetExpr = buildAggExpr('total_asset_quantity');
            const totalAssignedExpr = buildAggExpr('total_assigned_quantity');
            const totalInStockExpr = buildAggExpr('total_in_stock_quantity');
            const totalScrapExpr = buildAggExpr('total_scrap_quantity');
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            qb.addSelect(totalScrapExpr, 'total_scrap_quantity');
            if (useLocFilter) {
                qb.setParameter('locationIds', locationIds);
            }
            if (useSelfFilter && hasOwnedItems) {
                qb.setParameter('selfItemIds', selfItemIds);
            }
            qb.groupBy(`
    v.asset_item_id,
    v.asset_item_name,
    v.main_category_name,
    v.sub_category_name
  `);
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ');
                qb.andWhere(`(
        v.asset_item_name ILIKE :search${index}
        OR v.main_category_name ILIKE :search${index}
        OR v.sub_category_name ILIKE :search${index}
      )`, { [`search${index}`]: `%${searchValue}%` });
            });
            const columnMap = {
                asset_item_name: 'v.asset_item_name',
                total_asset_quantity: totalAssetExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            const idColumn = 'asset_item_id';
            const idDbColumn = 'v.asset_item_id';
            const defaultSort = { column: 'asset_item_id', order: 'DESC' };
            const cloneForCount = qb.clone();
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const totalItems = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    predicate: 'having',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    predicate: 'having',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                    predicate: 'having',
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const totalPages = totalItems > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 1;
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
                    total: totalItems,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage = totalItems > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit,
                    total: totalItems,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            return {
                success: true,
                message: data.length
                    ? 'Item-wise assets fetched successfully'
                    : 'No assets found',
                data,
                meta,
            };
        }
        catch (error) {
            console.error('Error in getAllStocksFromDto (VIEW):', error);
            throw error;
        }
    }
    async exportStocks(dto, branchIds = [], userId, schema) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const selectedIds = dto.selectedIds || [];
            const sortArray = dto.sort || [];
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const roleId = await (async () => {
                const cachedRole = await this.redis.get(roleCacheKey);
                if (cachedRole !== null && cachedRole !== undefined) {
                    return cachedRole;
                }
                const user = await this.dataSource.query(`
        SELECT role_id
        FROM ${schema}.users
        WHERE user_id = $1
        LIMIT 1
        `, [userId]);
                if (!user?.length) {
                    throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
                }
                const roleId = user[0].role_id;
                await this.redis.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            let hasSelfAccess = await this.redis.get(permCacheKey);
            if (hasSelfAccess === null) {
                const selfPermission = await this.specialPermissionRepo.findOne({
                    where: { attr_key: 'view_self_added_assets' },
                    select: ['id'],
                });
                const selfPolicy = selfPermission
                    ? await this.policyAttrRepo
                        .createQueryBuilder('pa')
                        .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                        .andWhere('pa.special_permission_master_id = :spId', {
                        spId: selfPermission.id,
                    })
                        .getOne()
                    : null;
                hasSelfAccess = !!selfPolicy;
                await this.redis.set(permCacheKey, hasSelfAccess, 300);
            }
            let selfItemIds = null;
            if (hasSelfAccess) {
                const ownedItems = await this.dataSource.query(`SELECT DISTINCT serial.asset_item_id
         FROM ${schema}.asset_stock_serials serial
         WHERE serial.created_by = $1
           AND serial.is_deleted = 0`, [userId]);
                selfItemIds = ownedItems.map((r) => r.asset_item_id);
            }
            const qb = this.stockViewRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            if (branchIds.length > 0) {
                const branchLocationIds = await this.dataSource.query(`SELECT DISTINCT lbm.location_mapping_id
         FROM location_branch_mapping lbm
         WHERE lbm.branch_id = ANY($1)
           AND lbm.is_deleted = 0
           AND lbm.is_active = 1`, [branchIds]);
                const allowedLocationIds = branchLocationIds.map((l) => l.location_mapping_id);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('1=0');
                }
            }
            let locationIds = null;
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    qb.andWhere('(v.location_id IN (:...filterLocationIds) OR v.location_id IS NULL)', { filterLocationIds: locationIds });
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            if (selectedIds && selectedIds.length > 0) {
                qb.andWhere('v.asset_item_id IN (:...selectedIds)', { selectedIds });
            }
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const useSelfFilter = hasSelfAccess === true;
            const hasOwnedItems = !!(selfItemIds && selfItemIds.length > 0);
            const filterConditions = [];
            if (useLocFilter)
                filterConditions.push('v.location_id IN (:...locationIds)');
            if (useSelfFilter) {
                filterConditions.push(hasOwnedItems ? 'v.asset_item_id IN (:...selfItemIds)' : '1=0');
            }
            const buildAggExpr = (col) => filterConditions.length > 0
                ? `COALESCE(SUM(v.${col}) FILTER (WHERE ${filterConditions.join(' AND ')}), 0)`
                : `SUM(v.${col})`;
            const totalAssetExpr = buildAggExpr('total_asset_quantity');
            const totalAssignedExpr = buildAggExpr('total_assigned_quantity');
            const totalInStockExpr = buildAggExpr('total_in_stock_quantity');
            const totalScrapExpr = buildAggExpr('total_scrap_quantity');
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            qb.addSelect(totalScrapExpr, 'total_scrap_quantity');
            if (useLocFilter) {
                qb.setParameter('locationIds', locationIds);
            }
            if (useSelfFilter && hasOwnedItems) {
                qb.setParameter('selfItemIds', selfItemIds);
            }
            qb.groupBy(`
      v.asset_item_id,
      v.asset_item_name,
      v.main_category_name,
      v.sub_category_name
    `);
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ');
                qb.andWhere(`(
          v.asset_item_name ILIKE :search${index}
          OR v.main_category_name ILIKE :search${index}
          OR v.sub_category_name ILIKE :search${index}
        )`, { [`search${index}`]: `%${searchValue}%` });
            });
            const columnMap = {
                asset_item_name: 'v.asset_item_name',
                total_asset_quantity: totalAssetExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    const orderCol = columnMap[s.column] || `v.${s.column}`;
                    qb.addOrderBy(orderCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.orderBy('v.asset_item_name', 'ASC');
            }
            const rawRows = await qb.getRawMany();
            const data = rawRows.map((row) => ({
                asset_item_name: row.asset_item_name || '--',
                main_category_name: row.main_category_name || '--',
                sub_category_name: row.sub_category_name || '--',
                total_asset_quantity: Number(row.total_asset_quantity) || 0,
                total_assigned_quantity: Number(row.total_assigned_quantity) || 0,
                total_in_stock_quantity: Number(row.total_in_stock_quantity) || 0,
                total_scrap_quantity: Number(row.total_scrap_quantity) || 0,
            }));
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Stocks');
            const headers = [
                'Sr. No.',
                'Item Name',
                'Category',
                'Sub Category',
                'Total Assets',
                'Assigned Assets',
                'In Stock',
                'Scrap Assets',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.asset_item_name);
                sheet.cell(row, 3).value(item.main_category_name);
                sheet.cell(row, 4).value(item.sub_category_name);
                sheet.cell(row, 5).value(item.total_asset_quantity);
                sheet.cell(row, 6).value(item.total_assigned_quantity);
                sheet.cell(row, 7).value(item.total_in_stock_quantity);
                sheet.cell(row, 8).value(item.total_scrap_quantity);
            });
            headers.forEach((_, i) => {
                const headerLength = headers[i].length;
                let maxDataLength = headerLength;
                data.forEach((item) => {
                    const cellValue = String(i === 0
                        ? data.indexOf(item) + 1
                        : i === 1
                            ? item.asset_item_name
                            : i === 2
                                ? item.main_category_name
                                : i === 3
                                    ? item.sub_category_name
                                    : i === 4
                                        ? item.total_asset_quantity
                                        : i === 5
                                            ? item.total_assigned_quantity
                                            : i === 6
                                                ? item.total_in_stock_quantity
                                                : item.total_scrap_quantity).length;
                    maxDataLength = Math.max(maxDataLength, cellValue);
                });
                sheet.column(i + 1).width(Math.min(maxDataLength + 10, 50));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportStocks ERROR:', error);
            throw error;
        }
    }
    async exportSoftwares(dto, branchIds = []) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const selectedIds = dto.selectedIds || [];
            const sortArray = dto.sort || [];
            const qb = this.softwareViewRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            qb.addSelect('MIN(v.manufacturer_name)', 'manufacturer_name');
            qb.addSelect('MIN(v.model_name)', 'model_name');
            if (branchIds.length > 0) {
                const branchLocationIds = await this.dataSource.query(`SELECT DISTINCT lbm.location_mapping_id
         FROM location_branch_mapping lbm
         WHERE lbm.branch_id = ANY($1)
           AND lbm.is_deleted = 0
           AND lbm.is_active = 1`, [branchIds]);
                const allowedLocationIds = branchLocationIds.map((l) => l.location_mapping_id);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL OR v.location_id = 0)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('(v.location_id IS NULL OR v.location_id = 0)');
                }
            }
            let locationIds = null;
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            if (selectedIds && selectedIds.length > 0) {
                qb.andWhere('v.asset_item_id IN (:...selectedIds)', { selectedIds });
            }
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const totalAssetExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_asset_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_asset_quantity), 0)`;
            const totalAssignedExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_assigned_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_assigned_quantity), 0)`;
            const totalInStockExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_in_stock_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_in_stock_quantity), 0)`;
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            if (useLocFilter) {
                qb.setParameter('locationIds', locationIds);
            }
            qb.groupBy(`
        v.asset_item_id,
        v.asset_item_name,
        v.main_category_name,
        v.sub_category_name
      `);
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ').trim();
                if (!searchValue)
                    return;
                qb.andWhere(`(
          v.asset_item_name ILIKE :search${index}
          OR v.main_category_name ILIKE :search${index}
          OR v.sub_category_name ILIKE :search${index}
        )`, { [`search${index}`]: `%${searchValue}%` });
            });
            const columnMap = {
                asset_item_name: 'v.asset_item_name',
                model_name: 'MIN(v.model_name)',
                manufacturer_name: 'MIN(v.manufacturer_name)',
                total_asset_quantity: totalAssetExpr,
                total_assigned_quantity: totalAssignedExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            const defaultSort = { column: 'asset_item_id', order: 'DESC' };
            const requested = sortArray && sortArray.length > 0 ? sortArray[0] : defaultSort;
            const sortColumn = requested.column && columnMap[requested.column] ? requested.column : defaultSort.column;
            const sortDbColumn = columnMap[sortColumn] || sortColumn;
            const requestedOrder = String(requested.order || defaultSort.order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            qb.orderBy(sortDbColumn, requestedOrder, 'NULLS LAST');
            qb.addOrderBy('v.asset_item_id', requestedOrder);
            const rawRows = await qb.getRawMany();
            const data = rawRows.map((row) => ({
                asset_item_name: row.asset_item_name || '--',
                main_category_name: row.main_category_name || '--',
                sub_category_name: row.sub_category_name || '--',
                model_name: row.model_name || '--',
                manufacturer_name: row.manufacturer_name || '--',
                total_asset_quantity: Number(row.total_asset_quantity) || 0,
                total_assigned_quantity: Number(row.total_assigned_quantity) || 0,
                total_in_stock_quantity: Number(row.total_in_stock_quantity) || 0,
            }));
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Softwares');
            const headers = [
                'Sr. No.',
                'Item Name',
                'Software Name',
                'Publisher',
                'Category',
                'Sub Category',
                'Total Assets',
                'Assigned Assets',
                'Available',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.asset_item_name);
                sheet.cell(row, 3).value(item.model_name);
                sheet.cell(row, 4).value(item.manufacturer_name);
                sheet.cell(row, 5).value(item.main_category_name);
                sheet.cell(row, 6).value(item.sub_category_name);
                sheet.cell(row, 7).value(item.total_asset_quantity);
                sheet.cell(row, 8).value(item.total_assigned_quantity);
                sheet.cell(row, 9).value(item.total_in_stock_quantity);
            });
            headers.forEach((_, i) => {
                const headerLength = headers[i].length;
                let maxDataLength = headerLength;
                data.forEach((item) => {
                    const cellValue = String(i === 0 ? data.indexOf(item) + 1
                        : i === 1 ? item.asset_item_name
                            : i === 2 ? item.model_name
                                : i === 3 ? item.manufacturer_name
                                    : i === 4 ? item.main_category_name
                                        : i === 5 ? item.sub_category_name
                                            : i === 6 ? item.total_asset_quantity
                                                : i === 7 ? item.total_assigned_quantity
                                                    : item.total_in_stock_quantity).length;
                    maxDataLength = Math.max(maxDataLength, cellValue);
                });
                sheet.column(i + 1).width(Math.min(maxDataLength + 10, 50));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportSoftwares ERROR:', error);
            throw error;
        }
    }
    async exportAssetItemFullDetails(asset_item_id, type, sortField, sortDirection = 'ASC', locationFilter, branchIds = [], selectedIds, isSelectAll, excludeIds) {
        try {
            let sanitizedLocationFilter = null;
            if (locationFilter?.length) {
                sanitizedLocationFilter = locationFilter
                    .filter((val) => val !== 'All')
                    .map((val) => Number(val))
                    .filter((val) => !isNaN(val));
                if (!sanitizedLocationFilter.length) {
                    sanitizedLocationFilter = null;
                }
            }
            const serialQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(organizational_user_entity_1.User, 'u', `mapping.target_type = 'USER' AND mapping.target_id = u.user_id`)
                .leftJoin(branches_entity_1.Branch, 'b', `mapping.target_type = 'BRANCH' AND mapping.target_id = b.branch_id`)
                .leftJoin(department_entity_1.Department, 'd', `mapping.target_type = 'DEPARTMENT' AND mapping.target_id = d.department_id`)
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('serial.asset_working_status', 'working_status')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = proc_item.procurement_id')
                .select([
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_id AS asset_id',
                'serial.information_fields AS information_fields',
                'asset.asset_title AS asset_title',
                'man.manufacturer_name AS manufacturer_name',
                'mod.model_name AS model_name',
                'stock.location_id AS location_id',
                'serial.working_status_type_id AS working_status_type_id',
                'working_status.working_status_type_name AS working_status_type_name',
                'procurement.purchase_date AS purchase_date',
                'mapping.mapping_id AS mapping_id',
                'mapping.target_type AS assigned_type',
                'mapping.target_id AS assigned_to_id',
                'mapping.created_at AS allocation_date',
                `CASE
            WHEN mapping.target_type = 'USER' THEN CONCAT(u.first_name, ' ', u.last_name)
            WHEN mapping.target_type = 'BRANCH' THEN b.branch_name
            WHEN mapping.target_type = 'DEPARTMENT' THEN d.department_name
            ELSE '-'
          END AS assigned_to_name`,
            ])
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            (0, branch_access_1.applyBranchFilter)({
                qb: serialQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                serialQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (type === 'ASSIGNED') {
                serialQuery.andWhere('mapping.mapping_id IS NOT NULL');
            }
            if (type === 'INSTOCK') {
                serialQuery.andWhere('mapping.target_id IS NULL');
            }
            if (type === 'SCRAP') {
                serialQuery
                    .leftJoin(scrap_entity_1.AssetScrap, 'scrap', `scrap.asset_stocks_unique_id = serial.asset_stocks_unique_id
             AND scrap.is_deleted = 0
             AND scrap.is_active = 1`)
                    .addSelect([
                    'scrap.scrap_date AS scrap_date',
                    'scrap.scrapped_by AS scrapped_by',
                ])
                    .andWhere('serial.working_status_type_id IN (4,12)');
            }
            if (isSelectAll) {
                if (excludeIds?.length) {
                    serialQuery.andWhere('serial.asset_stocks_unique_id NOT IN (:...excludeIds)', {
                        excludeIds,
                    });
                }
            }
            else if (selectedIds?.length) {
                serialQuery.andWhere('serial.asset_stocks_unique_id IN (:...selectedIds)', {
                    selectedIds,
                });
            }
            const sortableMap = {
                asset_stocks_unique_id: 'serial.asset_stocks_unique_id',
                system_code: 'serial.system_code',
                stock_id: 'serial.stock_id',
                asset_id: 'serial.asset_id',
                asset_title: 'asset.asset_title',
                manufacturer_name: 'man.manufacturer_name',
                model_name: 'mod.model_name',
                location_id: 'stock.location_id',
                working_status_type_id: 'serial.working_status_type_id',
                working_status_type_name: 'working_status.working_status_type_name',
                purchase_date: 'procurement.purchase_date',
                mapping_id: 'mapping.mapping_id',
                allocation_date: 'mapping.created_at',
            };
            const orderByColumn = sortField && sortableMap[sortField] ? sortableMap[sortField] : 'serial.asset_stocks_unique_id';
            const orderByOrder = sortDirection === 'DESC' ? 'DESC' : 'ASC';
            serialQuery.orderBy(orderByColumn, orderByOrder);
            const data = await serialQuery.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name(type);
            let headers = [];
            if (type === 'ALL') {
                headers = [
                    'Sr. No.',
                    'System Code',
                    'Display Name',
                    'Serial Number',
                    'Purchase Date',
                    'Manufacturer',
                    'Model',
                    'Working Condition',
                ];
            }
            else if (type === 'ASSIGNED') {
                headers = [
                    'Sr. No.',
                    'Asset ID',
                    'Display Name',
                    'Serial Number',
                    'Assign Type',
                    'Assigned To',
                    'Allocation Date',
                ];
            }
            else if (type === 'INSTOCK') {
                headers = [
                    'Sr. No.',
                    'Asset ID',
                    'Display Name',
                    'Serial Number',
                ];
            }
            else if (type === 'SCRAP') {
                headers = [
                    'Sr. No.',
                    'Asset ID',
                    'Serial Number',
                    'Display Name',
                    'Scrapped By',
                    'Scrap Date',
                ];
            }
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            data.forEach((row, index) => {
                const rowIndex = index + 2;
                sheet.cell(rowIndex, 1).value(index + 1);
                if (type === 'ALL') {
                    sheet.cell(rowIndex, 2).value(row.system_code || '-');
                    sheet.cell(rowIndex, 3).value(row.asset_title || '-');
                    sheet.cell(rowIndex, 4).value(row.stock_serials || '-');
                    sheet.cell(rowIndex, 5).value(row.purchase_date ? new Date(row.purchase_date).toLocaleDateString() : '-');
                    sheet.cell(rowIndex, 6).value(row.manufacturer_name || '-');
                    sheet.cell(rowIndex, 7).value(row.model_name || '-');
                    sheet.cell(rowIndex, 8).value(row.working_status_type_name || '-');
                }
                else if (type === 'ASSIGNED') {
                    sheet.cell(rowIndex, 2).value(row.system_code || '-');
                    sheet.cell(rowIndex, 3).value(row.asset_title || '-');
                    sheet.cell(rowIndex, 4).value(row.stock_serials || '-');
                    sheet.cell(rowIndex, 5).value(row.assigned_type || '-');
                    sheet.cell(rowIndex, 6).value(row.assigned_to_name || '-');
                    sheet.cell(rowIndex, 7).value(row.allocation_date ? new Date(row.allocation_date).toLocaleDateString() : '-');
                }
                else if (type === 'INSTOCK') {
                    sheet.cell(rowIndex, 2).value(row.system_code || '-');
                    sheet.cell(rowIndex, 3).value(row.asset_title || '-');
                    sheet.cell(rowIndex, 4).value(row.stock_serials || '-');
                }
                else if (type === 'SCRAP') {
                    sheet.cell(rowIndex, 2).value(row.system_code || '-');
                    sheet.cell(rowIndex, 3).value(row.stock_serials || '-');
                    sheet.cell(rowIndex, 4).value(row.asset_title || '-');
                    sheet.cell(rowIndex, 5).value(row.scrapped_by || '-');
                    sheet.cell(rowIndex, 6).value(row.scrap_date ? new Date(row.scrap_date).toLocaleDateString() : '-');
                }
            });
            headers.forEach((_, i) => {
                sheet.column(i + 1).width(20);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('❌ Error in exportAssetItemFullDetails:', error);
            throw error;
        }
    }
    async getAllSoftwares(dto, branchIds = []) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'software-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('✅ SOFTWARE CACHE HIT');
                return cached;
            }
            console.log('❌ SOFTWARE CACHE MISS');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page
                ? Number(d.page)
                : dto.pagination?.page
                    ? Number(dto.pagination.page)
                    : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalRaw = d.knownTotal ?? d.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            let locationIds = null;
            const qb = this.softwareViewRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            qb.addSelect('MIN(v.manufacturer_name)', 'manufacturer_name');
            qb.addSelect('MIN(v.model_name)', 'model_name');
            qb.addSelect('MIN(v.procurement_id)', 'procurement_id');
            qb.addSelect('MIN(v.procurement_item_id)', 'procurement_item_id');
            if (branchIds.length > 0) {
                const lbmRows = await this.dataSource.query(`SELECT DISTINCT location_mapping_id
         FROM location_branch_mapping
         WHERE branch_id = ANY($1)
           AND is_deleted = 0
           AND is_active = 1`, [branchIds]);
                console.log('branchIds vk', branchIds);
                const allowedLocationIds = lbmRows.map((r) => r.location_mapping_id);
                console.log('allowedLocationIds', allowedLocationIds);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL OR v.location_id = 0)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('(v.location_id IS NULL OR v.location_id = 0)');
                }
            }
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ').trim();
                if (!searchValue)
                    return;
                qb.andWhere(`(
          v.asset_item_name ILIKE :search${index}
          OR v.main_category_name ILIKE :search${index}
          OR v.sub_category_name ILIKE :search${index}
        )`, { [`search${index}`]: `%${searchValue}%` });
            });
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const totalAssetExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_asset_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_asset_quantity), 0)`;
            const totalAssignedExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_assigned_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_assigned_quantity), 0)`;
            const totalInStockExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_in_stock_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_in_stock_quantity), 0)`;
            const totalScrapExpr = useLocFilter
                ? `COALESCE(SUM(CASE WHEN v.location_id IN (:...locationIds) THEN v.total_scrap_quantity ELSE 0 END), 0)`
                : `COALESCE(SUM(v.total_scrap_quantity), 0)`;
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            qb.addSelect(totalScrapExpr, 'total_scrap_quantity');
            if (useLocFilter) {
                qb.setParameter('locationIds', locationIds);
            }
            qb.groupBy(`
      v.asset_item_id,
      v.asset_item_name,
      v.main_category_name,
      v.sub_category_name
    `);
            const columnMap = {
                asset_item_name: 'v.asset_item_name',
                total_asset_quantity: totalAssetExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            const idColumn = 'asset_item_id';
            const idDbColumn = 'v.asset_item_id';
            const defaultSort = { column: 'asset_item_id', order: 'DESC' };
            const cloneForCount = qb.clone();
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const totalItems = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    predicate: 'having',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    predicate: 'having',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                    predicate: 'having',
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const totalPages = totalItems > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 1;
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
                    total: totalItems,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage = totalItems > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit,
                    total: totalItems,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Item-wise assets fetched successfully'
                    : 'No assets found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.error('Error in getAllSoftwares (VIEW):', error);
            throw error;
        }
    }
    async getAllPerpetualSoftwares(dto, branchIds = []) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'perpetualSoftwares-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('✅ PERPETUALSOFTWARE CACHE HIT');
                return cached;
            }
            console.log('❌ PERPETUALSOFTWARE CACHE MISS');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page
                ? Number(d.page)
                : dto.pagination?.page
                    ? Number(dto.pagination.page)
                    : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalRaw = d.knownTotal ?? d.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            let locationIds = null;
            const qb = this.perpetualSoftwareRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            qb.addSelect('MIN(v.manufacturer_name)', 'manufacturer_name');
            qb.addSelect('MIN(v.model_name)', 'model_name');
            qb.addSelect('MIN(v.procurement_id)', 'procurement_id');
            qb.addSelect('MIN(v.procurement_item_id)', 'procurement_item_id');
            if (branchIds.length > 0) {
                const lbmRows = await this.dataSource.query(`SELECT DISTINCT location_mapping_id
       FROM location_branch_mapping
       WHERE branch_id = ANY($1)
         AND is_deleted = 0
         AND is_active = 1`, [branchIds]);
                const allowedLocationIds = lbmRows.map((r) => r.location_mapping_id);
                console.log('branchIds vk', branchIds);
                console.log('allowedLocationIds', allowedLocationIds);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL OR v.location_id = 0)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('(v.location_id IS NULL OR v.location_id = 0)');
                }
            }
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    console.log('🎯 perpetual location filter', locationIds);
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ').trim();
                if (!searchValue)
                    return;
                qb.andWhere(`(
        v.asset_item_name ILIKE :search${index}
        OR v.main_category_name ILIKE :search${index}
        OR v.sub_category_name ILIKE :search${index}
        OR v.manufacturer_name ILIKE :search${index}
        OR v.model_name ILIKE :search${index}
      )`, {
                    [`search${index}`]: `%${searchValue}%`,
                });
            });
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const totalAssetExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_asset_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_asset_quantity), 0)';
            const totalAssignedExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_assigned_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_assigned_quantity), 0)';
            const totalInStockExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_in_stock_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_in_stock_quantity), 0)';
            const totalScrapExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_scrap_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_scrap_quantity), 0)';
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            qb.addSelect(totalScrapExpr, 'total_scrap_quantity');
            if (useLocFilter) {
                qb.setParameter('locationIds', locationIds);
            }
            qb.groupBy(`
    v.asset_item_id,
    v.asset_item_name,
    v.main_category_name,
    v.sub_category_name
  `);
            const columnMap = {
                asset_item_name: 'v.asset_item_name',
                model_name: 'MIN(v.model_name)',
                manufacturer_name: 'MIN(v.manufacturer_name)',
                total_asset_quantity: totalAssetExpr,
                total_assigned_quantity: totalAssignedExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            const idColumn = 'asset_item_id';
            const idDbColumn = 'v.asset_item_id';
            const defaultSort = { column: 'asset_item_id', order: 'DESC' };
            const cloneForCount = qb.clone();
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const runCount = async () => Number((await countQb.getRawOne()).count);
            let totalItems;
            if (knownTotalVal != null) {
                totalItems = knownTotalVal;
            }
            else {
                const perpetualSchema = await this.resolveSchemaFromContext();
                let countCacheKey = null;
                if (perpetualSchema) {
                    const version = (await this.redisService.get(`stock_summary_version:${perpetualSchema}`)) || null;
                    if (version != null) {
                        const signature = crypto
                            .createHash('sha256')
                            .update(JSON.stringify({
                            filters: [...filters].sort((a, b) => String(a.column).localeCompare(String(b.column))),
                            search: searchArray,
                            branchIds: [...branchIds].sort((a, b) => a - b),
                            locationIds: locationIds
                                ? [...locationIds].sort((a, b) => a - b)
                                : null,
                        }))
                            .digest('hex')
                            .slice(0, 16);
                        countCacheKey = `perpetual_count:${perpetualSchema}:v${version}:${signature}`;
                    }
                }
                if (countCacheKey) {
                    totalItems = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countCacheKey, runCount, 300, null);
                }
                else {
                    totalItems = await runCount();
                }
            }
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    predicate: 'having',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    predicate: 'having',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                    predicate: 'having',
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const totalPages = totalItems > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 1;
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
                    total: totalItems,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage = totalItems > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit,
                    total: totalItems,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Item-wise assets fetched successfully'
                    : 'No assets found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.error('Error in getAllPerpetualSoftwares (VIEW):', error);
            throw error;
        }
    }
    async exportPerpetualSoftwares(dto, branchIds = []) {
        try {
            let locationIds = null;
            const qb = this.perpetualSoftwareRepo
                .createQueryBuilder('v')
                .select([
                'v.asset_item_id AS asset_item_id',
                'v.asset_item_name AS asset_item_name',
                'v.main_category_name AS main_category_name',
                'v.sub_category_name AS sub_category_name',
            ]);
            qb.addSelect('MIN(v.manufacturer_name)', 'manufacturer_name');
            qb.addSelect('MIN(v.model_name)', 'model_name');
            qb.addSelect('MIN(v.procurement_id)', 'procurement_id');
            qb.addSelect('MIN(v.procurement_item_id)', 'procurement_item_id');
            if (branchIds.length > 0) {
                const lbmRows = await this.dataSource.query(`SELECT DISTINCT location_mapping_id
       FROM location_branch_mapping
       WHERE branch_id = ANY($1)
         AND is_deleted = 0
         AND is_active = 1`, [branchIds]);
                const allowedLocationIds = lbmRows.map((r) => r.location_mapping_id);
                if (allowedLocationIds.length > 0) {
                    qb.andWhere('(v.location_id IN (:...allowedLocationIds) OR v.location_id IS NULL OR v.location_id = 0)', { allowedLocationIds });
                }
                else {
                    qb.andWhere('(v.location_id IS NULL OR v.location_id = 0)');
                }
            }
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of dto.filters || []) {
                if (!f.values || f.values.length === 0)
                    continue;
                if (f.column === 'location_id') {
                    locationIds = f.values.map((val) => Number(val));
                    continue;
                }
                const parsedValues = f.values.map((val) => !isNaN(Number(val)) ? Number(val) : val);
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                if (parsedValues.length > 1) {
                    qb.andWhere(`${column} IN (:...${f.column})`, {
                        [f.column]: parsedValues,
                    });
                }
                else {
                    qb.andWhere(`${column} = :${f.column}`, {
                        [f.column]: parsedValues[0],
                    });
                }
            }
            const searchArray = dto.search || [];
            searchArray.forEach((s, index) => {
                if (!s.values || s.values.length === 0)
                    return;
                const searchValue = s.values.join(' ').trim();
                if (!searchValue)
                    return;
                qb.andWhere(`(
        v.asset_item_name ILIKE :search${index}
        OR v.main_category_name ILIKE :search${index}
        OR v.sub_category_name ILIKE :search${index}
        OR v.manufacturer_name ILIKE :search${index}
        OR v.model_name ILIKE :search${index}
      )`, {
                    [`search${index}`]: `%${searchValue}%`,
                });
            });
            const useLocFilter = !!(locationIds && locationIds.length > 0);
            const totalAssetExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_asset_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_asset_quantity), 0)';
            const totalAssignedExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_assigned_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_assigned_quantity), 0)';
            const totalInStockExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_in_stock_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_in_stock_quantity), 0)';
            const totalScrapExpr = useLocFilter
                ? `COALESCE(
        SUM(
          CASE
            WHEN v.location_id IN (:...locationIds)
            THEN v.total_scrap_quantity
            ELSE 0
          END
        ),
      0)`
                : 'COALESCE(SUM(v.total_scrap_quantity), 0)';
            qb.addSelect(totalAssetExpr, 'total_asset_quantity');
            qb.addSelect(totalAssignedExpr, 'total_assigned_quantity');
            qb.addSelect(totalInStockExpr, 'total_in_stock_quantity');
            qb.addSelect(totalScrapExpr, 'total_scrap_quantity');
            if (useLocFilter) {
                qb.setParameters({ locationIds });
            }
            qb.groupBy('v.asset_item_id')
                .addGroupBy('v.asset_item_name')
                .addGroupBy('v.main_category_name')
                .addGroupBy('v.sub_category_name');
            const sortArray = dto.sort || [];
            const allowedSortColumns = {
                asset_item_name: 'v.asset_item_name',
                model_name: 'MIN(v.model_name)',
                manufacturer_name: 'MIN(v.manufacturer_name)',
                total_asset_quantity: totalAssetExpr,
                total_assigned_quantity: totalAssignedExpr,
                total_in_stock_quantity: totalInStockExpr,
                asset_item_id: 'v.asset_item_id',
            };
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    const col = allowedSortColumns[s.column];
                    if (col) {
                        qb.addOrderBy(col, s.order === 'DESC' ? 'DESC' : 'ASC');
                    }
                });
                qb.addOrderBy('v.asset_item_id', 'DESC');
            }
            else {
                qb.orderBy('v.asset_item_id', 'DESC');
            }
            const rawRows = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Perpetual Softwares');
            const headers = [
                'Sr. No.',
                'Items',
                'Category',
                'Sub Category',
                'Software Name',
                'Publisher',
                'Total',
                'Assigned',
                'Available',
            ];
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            rawRows.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.asset_item_name || '--');
                sheet.cell(row, 3).value(item.main_category_name || '--');
                sheet.cell(row, 4).value(item.sub_category_name || '--');
                sheet.cell(row, 5).value(item.model_name || '--');
                sheet.cell(row, 6).value(item.manufacturer_name || '--');
                sheet.cell(row, 7).value(Number(item.total_asset_quantity) || 0);
                sheet.cell(row, 8).value(Number(item.total_assigned_quantity) || 0);
                sheet.cell(row, 9).value(Number(item.total_in_stock_quantity) || 0);
            });
            headers.forEach((_, i) => {
                const headerLength = headers[i].length;
                let maxDataLength = headerLength;
                rawRows.forEach((item) => {
                    const cellValue = String(i === 0
                        ? rawRows.indexOf(item) + 1
                        : i === 1
                            ? item.asset_item_name
                            : i === 2
                                ? item.main_category_name
                                : i === 3
                                    ? item.sub_category_name
                                    : i === 4
                                        ? item.model_name
                                        : i === 5
                                            ? item.manufacturer_name
                                            : i === 6
                                                ? item.total_asset_quantity
                                                : i === 7
                                                    ? item.total_assigned_quantity
                                                    : item.total_in_stock_quantity).length;
                    maxDataLength = Math.max(maxDataLength, cellValue);
                });
                sheet.column(i + 1).width(Math.min(maxDataLength + 10, 50));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error in exportPerpetualSoftwares (SERVICE):', error);
            throw error;
        }
    }
    async findSingleAsset(asset_id, asset_stocks_unique_id) {
        try {
            const assetData = await this.assetRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.main_category', 'main_category')
                .leftJoinAndSelect('asset.sub_category', 'sub_category')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('asset.added_by_user', 'added_by_user')
                .leftJoinAndSelect('asset.manufacturer_name', 'manufacturer')
                .leftJoinAndSelect('asset.model_name', 'model')
                .where('asset.asset_id = :asset_id', { asset_id })
                .getOne();
            if (!assetData)
                throw new Error('Asset not found');
            const stocks = await this.stockRepository
                .createQueryBuilder('stock')
                .leftJoinAndSelect('stock.location', 'location_mapping')
                .leftJoinAndSelect('location_mapping.location', 'location')
                .leftJoinAndSelect('location_mapping.type', 'location_type')
                .where('stock.asset_id = :asset_id', { asset_id })
                .getMany();
            const cleanedStocks = stocks.map((stock) => ({
                ...stock,
                location: stock.location
                    ? {
                        location_mapping_id: stock.location.location_mapping_id,
                        branch_id: stock.location.branch_id,
                        location_name: stock.location.location?.location_name || null,
                        location_type: stock.location.type?.type_name || null,
                    }
                    : null,
            }));
            const serials = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.asset_working_status', 'asset_working_status')
                .leftJoinAndSelect('serial.current_status', 'current_status')
                .leftJoinAndMapOne('serial.procurement', asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.stock_id = serial.stock_id')
                .leftJoinAndSelect('procurement.vendor', 'vendor')
                .leftJoinAndSelect('procurement.ownership_status', 'ownership_status')
                .leftJoinAndSelect('serial.location_mapping', 'locationMapping')
                .leftJoinAndSelect('locationMapping.location', 'location')
                .leftJoinAndSelect('locationMapping.branch', 'branch')
                .where('serial.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .getOne();
            const fieldsData = serials.information_fields;
            console.log('serials', serials);
            console.log('fieldsData', fieldsData);
            const procurement = serials.procurement;
            return {
                asset: assetData,
                stocks: cleanedStocks,
                serials,
                fieldsData,
                procurement,
            };
        }
        catch (error) {
            console.error('❌ Error in findSingleAsset:', error);
            throw new Error('An error occurred while fetching asset.');
        }
    }
    async assetsForMapping(branchIds = []) {
        console.log('🔥 Service reached: getMappedAssetsDropdown() - SERIAL BASED');
        try {
            const qb = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .innerJoin('serial.asset_data', 'asset')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_item', 'item')
                .select([
                'NULL AS mapping_id',
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.asset_id AS asset_id',
                'asset.asset_title AS asset_title',
                'main_category.main_category_name AS main_category',
                'sub_category.sub_category_name AS sub_category',
                'item.asset_item_name AS item_name',
                'item.license_metric AS license_metric',
                'item.item_type AS item_type',
                'serial.system_code AS system_code',
            ])
                .where('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1')
                .andWhere('serial.current_status_id = :statusId', { statusId: 1 })
                .andWhere('(serial.working_status_type_id IN (:...workingIds) OR serial.working_status_type_id IS NULL)', {
                workingIds: [18, 19],
            });
            (0, branch_access_1.applyBranchFilter)({
                qb,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            const rows = await qb.getRawMany();
            console.log('✅ dropdown-list res', rows.length);
            return rows;
        }
        catch (error) {
            console.error('❌ getMappedAssetsDropdown error', error);
            throw new common_1.InternalServerErrorException('Failed to load mapped assets dropdown');
        }
    }
    async getAssetItemFullDetails(asset_item_id, type, page = 1, limit = 10, sortField, sortDirection = 'ASC', locationFilter, branchIds = [], cursor, direction, isLastPageMode, knownTotal) {
        try {
            const cursorToken = typeof cursor === 'string' ? cursor : null;
            const dir = direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = isLastPageMode === true;
            const jumpPage = page ? Number(page) : undefined;
            const usingOffset = !cursorToken && !!jumpPage && jumpPage > 1 && !jumpToLast;
            const knownTotalVal = knownTotal != null && !Number.isNaN(Number(knownTotal))
                ? Number(knownTotal)
                : null;
            let sanitizedLocationFilter = null;
            if (locationFilter?.length) {
                sanitizedLocationFilter = locationFilter
                    .filter((val) => val !== 'All')
                    .map((val) => Number(val))
                    .filter((val) => !isNaN(val));
                if (!sanitizedLocationFilter.length) {
                    sanitizedLocationFilter = null;
                }
            }
            const countsQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'parent_mapping', `parent_mapping.is_deleted = 0 AND parent_mapping.is_active = 1 AND parent_mapping.target_type = 'ASSET' AND parent_mapping.target_id = serial.asset_stocks_unique_id`);
            (0, branch_access_1.applyBranchFilter)({
                qb: countsQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                countsQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            const counts = await countsQuery
                .select([
                'COUNT(DISTINCT serial.asset_stocks_unique_id)::int AS total_assets',
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE mapping.mapping_id IS NOT NULL OR parent_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)::int AS total_assigned`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE mapping.mapping_id IS NULL AND parent_mapping.mapping_id IS NULL AND NOT (serial.current_status_id = 7 OR serial.working_status_type_id = 5) AND NOT (serial.working_status_type_id IN (4,12)))::int AS total_instock`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE serial.working_status_type_id IN (4,12))::int AS total_scrap`,
            ])
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1')
                .getRawOne();
            const serialQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'parent_mapping', `parent_mapping.is_deleted = 0 AND parent_mapping.is_active = 1 AND parent_mapping.target_type = 'ASSET' AND parent_mapping.target_id = serial.asset_stocks_unique_id`)
                .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'parent_serial', 'parent_serial.asset_stocks_unique_id = parent_mapping.asset_stocks_unique_id')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'parent_asset', 'parent_asset.asset_id = parent_serial.asset_id')
                .leftJoin('parent_asset.asset_item', 'parent_item')
                .leftJoin(organizational_user_entity_1.User, 'u', `mapping.target_type = 'USER' AND mapping.target_id = u.user_id`)
                .leftJoin(branches_entity_1.Branch, 'b', `mapping.target_type = 'BRANCH' AND mapping.target_id = b.branch_id`)
                .leftJoin(department_entity_1.Department, 'd', `mapping.target_type = 'DEPARTMENT' AND mapping.target_id = d.department_id`)
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('serial.asset_working_status', 'working_status')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = proc_item.procurement_id')
                .leftJoin('asset.asset_item', 'item')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .select([
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_id AS asset_id',
                'serial.information_fields AS information_fields',
                'asset.asset_title AS asset_title',
                'item.license_metric AS license_metric',
                'item.item_type AS item_type',
                'main_category.main_category_name AS main_category_name',
                'sub_category.sub_category_name AS sub_category_name',
                'man.manufacturer_name AS manufacturer_name',
                'mod.model_name AS model_name',
                'stock.location_id AS location_id',
                'serial.working_status_type_id AS working_status_type_id',
                'working_status.working_status_type_name AS working_status_type_name',
                'procurement.purchase_date AS purchase_date',
                'COALESCE(mapping.mapping_id, parent_mapping.mapping_id) AS mapping_id',
                'COALESCE(mapping.target_type, parent_mapping.target_type) AS assigned_type',
                'COALESCE(mapping.target_id, parent_mapping.asset_stocks_unique_id) AS assigned_to_id',
                'COALESCE(mapping.created_at, parent_mapping.created_at) AS allocation_date',
                `CASE
          WHEN mapping.target_type = 'USER' THEN CONCAT(u.first_name, ' ', u.last_name)
          WHEN mapping.target_type = 'BRANCH' THEN b.branch_name
          WHEN mapping.target_type = 'DEPARTMENT' THEN d.department_name
          WHEN parent_mapping.target_type = 'ASSET' THEN CONCAT(parent_item.asset_item_name, ' (', COALESCE(parent_serial.system_code, parent_serial.stock_serials, CONCAT('ID: ', parent_serial.asset_stocks_unique_id)), ')')
          ELSE '-'
        END AS assigned_to_name`,
            ])
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            (0, branch_access_1.applyBranchFilter)({
                qb: serialQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                serialQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (type === 'ASSIGNED') {
                serialQuery.andWhere('(mapping.mapping_id IS NOT NULL OR parent_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)');
            }
            if (type === 'INSTOCK') {
                serialQuery.andWhere('mapping.mapping_id IS NULL AND parent_mapping.mapping_id IS NULL AND NOT (serial.current_status_id = 7 OR serial.working_status_type_id = 5) AND NOT (serial.working_status_type_id IN (4,12))');
            }
            if (type === 'SCRAP') {
                serialQuery
                    .leftJoin(scrap_entity_1.AssetScrap, 'scrap', `scrap.asset_stocks_unique_id = serial.asset_stocks_unique_id
           AND scrap.is_deleted = 0
           AND scrap.is_active = 1`)
                    .addSelect([
                    'scrap.scrap_date AS scrap_date',
                    'scrap.scrapped_by AS scrapped_by',
                ])
                    .andWhere('serial.working_status_type_id IN (4,12)');
            }
            if (sortField === 'information_fields') {
                throw new Error('Sorting not supported for information_fields');
            }
            const sortableMap = {
                asset_stocks_unique_id: 'serial.asset_stocks_unique_id',
                system_code: 'serial.system_code',
                stock_id: 'serial.stock_id',
                asset_id: 'serial.asset_id',
                asset_title: 'asset.asset_title',
                manufacturer_name: 'man.manufacturer_name',
                model_name: 'mod.model_name',
                location_id: 'stock.location_id',
                working_status_type_id: 'serial.working_status_type_id',
                working_status_type_name: 'working_status.working_status_type_name',
                purchase_date: 'procurement.purchase_date',
                mapping_id: 'COALESCE(mapping.mapping_id, parent_mapping.mapping_id)',
                allocation_date: 'COALESCE(mapping.created_at, parent_mapping.created_at)',
            };
            const idColumn = 'asset_stocks_unique_id';
            const idDbColumn = 'serial.asset_stocks_unique_id';
            const defaultSort = {
                column: 'asset_stocks_unique_id',
                order: (sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'),
            };
            const sortArray = sortField && sortableMap[sortField]
                ? [{ column: sortField, order: defaultSort.order }]
                : [];
            const isTimestampSort = sortField === 'purchase_date' || sortField === 'allocation_date';
            const cloneForCount = serialQuery.clone();
            cloneForCount.offset(0).limit(0);
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const total = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            const totalPages = total != null && total > 0
                ? Math.max(1, Math.ceil(total / limit))
                : null;
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    timestampSort: isTimestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    timestampSort: isTimestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(serialQuery, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction: dir,
                    timestampSort: isTimestampSort,
                });
            }
            const rawRows = usingOffset
                ? await serialQuery.getRawMany()
                : await serialQuery.limit(limit + 1).getRawMany();
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
                        hasNextPage: totalPages != null
                            ? jumpPage < totalPages
                            : data.length === limit,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage =
                        total != null ? total > data.length : data.length === limit;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit,
                    total,
                    currentPage: jumpToLast && totalPages != null ? totalPages : 1,
                });
            }
            return {
                success: true,
                asset_item_id,
                counts: {
                    total_assets: counts.total_assets,
                    total_assigned: counts.total_assigned,
                    total_instock: counts.total_instock,
                    total_scrap: counts.total_scrap,
                },
                data,
                meta,
            };
        }
        catch (error) {
            console.error('❌ Error in getAssetItemFullDetails:', error);
            throw error;
        }
    }
    async getSoftwareDetails(type, limit = 10, cursor = null, isLastPageMode = false, sortField, sortDirection = 'ASC', locationFilter, branchIds = [], purchase_date, asset_item_id, direction, knownTotal, page) {
        try {
            const cursorToken = typeof cursor === 'string' ? cursor : null;
            const dir = direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = isLastPageMode === true;
            const pageLimit = Math.min(Math.max(Number(limit || 10), 1), 100);
            const jumpPage = page && Number(page) > 0 ? Number(page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast && !cursorToken;
            const knownTotalVal = knownTotal != null && !Number.isNaN(Number(knownTotal))
                ? Number(knownTotal)
                : null;
            let sanitizedLocationFilter = null;
            if (locationFilter?.length) {
                sanitizedLocationFilter = locationFilter
                    .filter((val) => val !== 'All')
                    .map((val) => Number(val))
                    .filter((val) => !isNaN(val));
                if (!sanitizedLocationFilter.length) {
                    sanitizedLocationFilter = null;
                }
            }
            const countsQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'host_mapping', `host_mapping.is_deleted = 0 AND host_mapping.is_active = 1 AND host_mapping.relation_type = 'REL-006' AND (host_mapping.target_id = serial.asset_stocks_unique_id OR (host_mapping.asset_stocks_unique_id = serial.asset_stocks_unique_id AND host_mapping.target_type = 'SOFTWARE'))`)
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = proc_item.procurement_id')
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            (0, branch_access_1.applyBranchFilter)({
                qb: countsQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                countsQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (purchase_date) {
                countsQuery.andWhere('DATE(procurement.purchase_date) = DATE(:purchase_date)', { purchase_date });
            }
            if (type === 'ASSIGNED') {
                countsQuery.andWhere('(mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL)');
            }
            if (type === 'INSTOCK') {
                countsQuery.andWhere('serial.current_status_id IN (:...statusIds)', {
                    statusIds: [1, 5],
                });
                countsQuery.andWhere('mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL');
            }
            const counts = await countsQuery
                .select([
                'COUNT(DISTINCT serial.asset_stocks_unique_id)::int AS total_assets',
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL)::int AS total_assigned`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL)::int AS total_instock`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id) FILTER (WHERE serial.working_status_type_id IN (4,12))::int AS total_scrap`,
            ])
                .getRawOne();
            const serialQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'host_mapping', `host_mapping.is_deleted = 0 AND host_mapping.is_active = 1 AND host_mapping.relation_type = 'REL-006' AND (host_mapping.target_id = serial.asset_stocks_unique_id OR (host_mapping.asset_stocks_unique_id = serial.asset_stocks_unique_id AND host_mapping.target_type = 'SOFTWARE'))`)
                .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'host_serial', 'host_serial.asset_stocks_unique_id = (CASE WHEN host_mapping.target_id = serial.asset_stocks_unique_id THEN host_mapping.asset_stocks_unique_id ELSE host_mapping.target_id END)')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'host_asset', 'host_asset.asset_id = host_serial.asset_id')
                .leftJoin(organizational_user_entity_1.User, 'u', `mapping.target_type = 'USER' AND mapping.target_id = u.user_id`)
                .leftJoin(branches_entity_1.Branch, 'b', `mapping.target_type = 'BRANCH' AND mapping.target_id = b.branch_id`)
                .leftJoin(department_entity_1.Department, 'd', `mapping.target_type = 'DEPARTMENT' AND mapping.target_id = d.department_id`)
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('serial.asset_working_status', 'working_status')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = proc_item.procurement_id')
                .leftJoin(asset_software_subscription_entity_1.AssetSoftwareSubscription, 'sub', 'sub.asset_stocks_unique_id = serial.asset_stocks_unique_id')
                .select([
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_id AS asset_id',
                'serial.information_fields AS information_fields',
                'asset.asset_title AS asset_title',
                'man.manufacturer_name AS manufacturer_name',
                'mod.model_name AS model_name',
                'stock.location_id AS location_id',
                'serial.working_status_type_id AS working_status_type_id',
                'working_status.working_status_type_name AS working_status_type_name',
                'procurement.purchase_date AS purchase_date',
                'COALESCE(mapping.mapping_id, host_mapping.mapping_id) AS mapping_id',
                `CASE
          WHEN host_mapping.mapping_id IS NOT NULL THEN 'SOFTWARE'
          ELSE mapping.target_type
        END AS assigned_type`,
                `CASE
          WHEN host_mapping.mapping_id IS NOT NULL THEN (CASE WHEN host_mapping.target_id = serial.asset_stocks_unique_id THEN host_mapping.asset_stocks_unique_id ELSE host_mapping.target_id END)
          ELSE mapping.target_id
        END AS assigned_to_id`,
                'COALESCE(mapping.created_at, host_mapping.created_at) AS allocation_date',
                `CASE
          WHEN mapping.target_type = 'USER' THEN CONCAT(u.first_name, ' ', u.last_name)
          WHEN mapping.target_type = 'BRANCH' THEN b.branch_name
          WHEN mapping.target_type = 'DEPARTMENT' THEN d.department_name
          WHEN host_mapping.mapping_id IS NOT NULL THEN CONCAT(COALESCE(host_serial.system_code, 'ID ' || host_serial.asset_stocks_unique_id::text), ' (', COALESCE(host_serial.asset_serial_title, host_asset.asset_title, 'Host'), ')')
          ELSE '-'
        END AS assigned_to_name`,
                'sub.sub_start_date AS sub_start_date',
                'sub.next_renewal_date AS next_renewal_date',
                'sub.subscription_type AS subscription_type',
                'sub.billing_frequency AS billing_frequency',
                'main_category.main_category_name AS main_category_name',
                'sub_category.sub_category_name AS sub_category_name',
            ])
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            (0, branch_access_1.applyBranchFilter)({
                qb: serialQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                serialQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (purchase_date) {
                serialQuery.andWhere('DATE(procurement.purchase_date) = DATE(:purchase_date)', { purchase_date });
            }
            if (type === 'ASSIGNED') {
                serialQuery.andWhere('(mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL)');
            }
            if (type === 'INSTOCK') {
                serialQuery.andWhere('serial.current_status_id IN (:...statusIds)', {
                    statusIds: [1, 5],
                });
                serialQuery.andWhere('mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL');
            }
            const assignedToExpr = `CASE
        WHEN mapping.target_type='USER' THEN CONCAT(u.first_name,' ',u.last_name)
        WHEN mapping.target_type='BRANCH' THEN b.branch_name
        WHEN mapping.target_type='DEPARTMENT' THEN d.department_name
        WHEN host_mapping.mapping_id IS NOT NULL THEN CONCAT(COALESCE(host_serial.system_code, 'ID ' || host_serial.asset_stocks_unique_id::text), ' (', COALESCE(host_serial.asset_serial_title, host_asset.asset_title, 'Host'), ')')
        ELSE '-'
      END`;
            const sortableMap = {
                asset_title: 'asset.asset_title',
                stock_serials: 'serial.stock_serials',
                serial_number: 'serial.stock_serials',
                manufacturer_name: 'man.manufacturer_name',
                model_name: 'mod.model_name',
                assigned_type: `CASE WHEN host_mapping.mapping_id IS NOT NULL THEN 'SOFTWARE' ELSE mapping.target_type END`,
                assigned_to_name: assignedToExpr,
                purchase_date: 'procurement.purchase_date',
                allocation_date: 'COALESCE(mapping.created_at, host_mapping.created_at)',
                asset_stocks_unique_id: 'serial.asset_stocks_unique_id',
            };
            const sortAliasMap = {
                date: 'purchase_date',
                purchase_date: 'purchase_date',
                asset_title: 'asset_title',
                displayname: 'asset_title',
                serial_number: 'stock_serials',
                stock_serials: 'stock_serials',
                serialNumber: 'stock_serials',
                manufacturer: 'manufacturer_name',
                manufacturer_name: 'manufacturer_name',
                model: 'model_name',
                model_name: 'model_name',
                assigned_type: 'assigned_type',
                assignedType: 'assigned_type',
                assigned_to_name: 'assigned_to_name',
                assignedToName: 'assigned_to_name',
                allocation_date: 'allocation_date',
                allocationDate: 'allocation_date',
            };
            const normalizedSortField = sortField
                ? sortAliasMap[sortField] || sortField
                : undefined;
            const idColumn = 'asset_stocks_unique_id';
            const idDbColumn = 'serial.asset_stocks_unique_id';
            const defaultSort = {
                column: 'asset_stocks_unique_id',
                order: 'DESC',
            };
            const sortOrder = sortDirection === 'DESC' ? 'DESC' : 'ASC';
            const sortArray = normalizedSortField && sortableMap[normalizedSortField]
                ? [{ column: normalizedSortField, order: sortOrder }]
                : [];
            const isTimestampSort = normalizedSortField === 'purchase_date' || normalizedSortField === 'allocation_date';
            const cloneForCount = serialQuery.clone();
            cloneForCount.expressionMap.limit = undefined;
            cloneForCount.expressionMap.offset = undefined;
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const total = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            const totalPages = total != null && total > 0
                ? Math.max(1, Math.ceil(total / pageLimit))
                : null;
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    timestampSort: isTimestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    timestampSort: isTimestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(serialQuery, jumpPage, pageLimit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction: dir,
                    timestampSort: isTimestampSort,
                });
            }
            const rawRows = usingOffset
                ? await serialQuery.getRawMany()
                : await serialQuery.limit(pageLimit + 1).getRawMany();
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
                    limit: pageLimit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit: pageLimit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit: pageLimit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            return {
                success: true,
                asset_item_id,
                counts: {
                    total_assets: counts?.total_assets || 0,
                    total_assigned: counts?.total_assigned || 0,
                    total_instock: counts?.total_instock || 0,
                    total_scrap: counts?.total_scrap || 0,
                },
                data,
                meta,
            };
        }
        catch (error) {
            console.error('❌ Error in getSoftwareDetails:', error);
            throw error;
        }
    }
    async getSoftwareDetailsByProcurement(type, limit = 10, cursor = null, isLastPageMode = false, sortField, sortDirection = 'ASC', locationFilter, branchIds = [], purchase_date, procurement_id, direction, knownTotal, page) {
        try {
            const cursorToken = typeof cursor === 'string' ? cursor : null;
            const dir = direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = isLastPageMode === true;
            const pageLimit = Math.min(Math.max(Number(limit || 10), 1), 100);
            const knownTotalVal = knownTotal != null && !Number.isNaN(Number(knownTotal))
                ? Number(knownTotal)
                : null;
            const jumpPage = page && Number(page) > 0 ? Number(page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast && !cursorToken;
            let sanitizedLocationFilter = null;
            if (locationFilter?.length) {
                sanitizedLocationFilter = locationFilter
                    .filter((val) => val !== 'All')
                    .map((val) => Number(val))
                    .filter((val) => !isNaN(val));
                if (!sanitizedLocationFilter.length) {
                    sanitizedLocationFilter = null;
                }
            }
            const targetProcurementIds = procurement_id
                ? [procurement_id]
                : await this.getAllLinkedProcurementIds(procurement_id);
            const procurementItems = await this.assetProcurementItemRepository.find({
                select: ['procurement_item_id'],
                where: {
                    procurement_id: (0, typeorm_2.In)(targetProcurementIds),
                },
            });
            const procurementItemIds = procurementItems.map((item) => item.procurement_item_id);
            if (!procurementItemIds.length) {
                return {
                    success: true,
                    procurement_id,
                    counts: {
                        total_assets: 0,
                        total_assigned: 0,
                        total_instock: 0,
                        total_scrap: 0,
                    },
                    data: [],
                    meta: (0, keyset_pagination_1.buildListMeta)({
                        page: {
                            data: [],
                            startCursor: null,
                            endCursor: null,
                            hasNextPage: false,
                            hasPrevPage: false,
                        },
                        limit: pageLimit,
                        total: 0,
                        currentPage: 1,
                    }),
                };
            }
            const countsQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'host_mapping', `host_mapping.is_deleted = 0 AND host_mapping.is_active = 1 AND host_mapping.relation_type = 'REL-006' AND (host_mapping.target_id = serial.asset_stocks_unique_id OR (host_mapping.asset_stocks_unique_id = serial.asset_stocks_unique_id AND host_mapping.target_type = 'SOFTWARE'))`)
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = proc_item.procurement_id')
                .where('serial.procurement_item_id IN (:...procurementItemIds)', {
                procurementItemIds,
            })
                .andWhere('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            (0, branch_access_1.applyBranchFilter)({
                qb: countsQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                countsQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (purchase_date) {
                countsQuery.andWhere('procurement.purchase_date::date = :purchase_date::date', { purchase_date });
            }
            if (type === 'ASSIGNED') {
                countsQuery.andWhere('(mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL)');
            }
            if (type === 'INSTOCK') {
                countsQuery.andWhere('serial.current_status_id IN (:...statusIds)', {
                    statusIds: [1, 5],
                });
                countsQuery.andWhere('mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL');
            }
            const counts = await countsQuery
                .select([
                'COUNT(DISTINCT serial.asset_stocks_unique_id)::int AS total_assets',
                `COUNT(DISTINCT serial.asset_stocks_unique_id)
         FILTER (
           WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL
         )::int AS total_assigned`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id)
         FILTER (
           WHERE mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL
         )::int AS total_instock`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id)
         FILTER (
           WHERE serial.working_status_type_id IN (4,12)
         )::int AS total_scrap`,
            ])
                .getRawOne();
            const serialQuery = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'host_mapping', `host_mapping.is_deleted = 0 AND host_mapping.is_active = 1 AND host_mapping.relation_type = 'REL-006' AND (host_mapping.target_id = serial.asset_stocks_unique_id OR (host_mapping.asset_stocks_unique_id = serial.asset_stocks_unique_id AND host_mapping.target_type = 'SOFTWARE'))`)
                .leftJoin(asset_stock_serials_entity_1.AssetStockSerials, 'host_serial', 'host_serial.asset_stocks_unique_id = (CASE WHEN host_mapping.target_id = serial.asset_stocks_unique_id THEN host_mapping.asset_stocks_unique_id ELSE host_mapping.target_id END)')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'host_asset', 'host_asset.asset_id = host_serial.asset_id')
                .leftJoin(organizational_user_entity_1.User, 'u', `mapping.target_type='USER'
        AND mapping.target_id=u.user_id`)
                .leftJoin(branches_entity_1.Branch, 'b', `mapping.target_type='BRANCH'
        AND mapping.target_id=b.branch_id`)
                .leftJoin(department_entity_1.Department, 'd', `mapping.target_type='DEPARTMENT'
        AND mapping.target_id=d.department_id`)
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('serial.asset_working_status', 'working_status')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id=proc_item.procurement_id')
                .leftJoin(asset_software_subscription_entity_1.AssetSoftwareSubscription, 'sub', 'sub.asset_stocks_unique_id = serial.asset_stocks_unique_id')
                .leftJoin('asset.asset_item', 'item')
                .select([
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'serial.stock_id AS stock_id',
                'serial.asset_id AS asset_id',
                'serial.information_fields AS information_fields',
                'asset.asset_title AS asset_title',
                'item.license_metric AS license_metric',
                'item.item_type AS item_type',
                'man.manufacturer_name AS manufacturer_name',
                'mod.model_name AS model_name',
                'stock.location_id AS location_id',
                'serial.working_status_type_id AS working_status_type_id',
                'working_status.working_status_type_name AS working_status_type_name',
                'procurement.purchase_date AS purchase_date',
                'COALESCE(mapping.mapping_id, host_mapping.mapping_id) AS mapping_id',
                `CASE
          WHEN host_mapping.mapping_id IS NOT NULL THEN 'SOFTWARE'
          ELSE mapping.target_type
        END AS assigned_type`,
                `CASE
          WHEN host_mapping.mapping_id IS NOT NULL THEN (CASE WHEN host_mapping.target_id = serial.asset_stocks_unique_id THEN host_mapping.asset_stocks_unique_id ELSE host_mapping.target_id END)
          ELSE mapping.target_id
        END AS assigned_to_id`,
                'COALESCE(mapping.created_at, host_mapping.created_at) AS allocation_date',
                `CASE
          WHEN mapping.target_type = 'USER' THEN CONCAT(u.first_name, ' ', u.last_name)
          WHEN mapping.target_type = 'BRANCH' THEN b.branch_name
          WHEN mapping.target_type = 'DEPARTMENT' THEN d.department_name
          WHEN host_mapping.mapping_id IS NOT NULL THEN CONCAT(COALESCE(host_serial.system_code, 'ID ' || host_serial.asset_stocks_unique_id::text), ' (', COALESCE(host_serial.asset_serial_title, host_asset.asset_title, 'Host'), ')')
          ELSE '-'
        END AS assigned_to_name`,
                'sub.sub_start_date AS sub_start_date',
                'sub.next_renewal_date AS next_renewal_date',
                'sub.subscription_type AS subscription_type',
                'sub.billing_frequency AS billing_frequency',
                'main_category.main_category_name AS main_category_name',
                'sub_category.sub_category_name AS sub_category_name',
            ])
                .where('serial.procurement_item_id IN (:...procurementItemIds)', {
                procurementItemIds,
            })
                .andWhere('serial.is_deleted=0')
                .andWhere('serial.is_active=1');
            (0, branch_access_1.applyBranchFilter)({
                qb: serialQuery,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                serialQuery.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (purchase_date) {
                serialQuery.andWhere('procurement.purchase_date::date = :purchase_date::date', { purchase_date });
            }
            if (type === 'ASSIGNED') {
                serialQuery.andWhere('(mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL)');
            }
            if (type === 'INSTOCK') {
                serialQuery.andWhere('serial.current_status_id IN (:...statusIds)', {
                    statusIds: [1, 5],
                });
                serialQuery.andWhere('mapping.mapping_id IS NULL AND host_mapping.mapping_id IS NULL');
            }
            const assignedToExpr = `CASE
        WHEN mapping.target_type='USER' THEN CONCAT(u.first_name,' ',u.last_name)
        WHEN mapping.target_type='BRANCH' THEN b.branch_name
        WHEN mapping.target_type='DEPARTMENT' THEN d.department_name
        WHEN host_mapping.mapping_id IS NOT NULL THEN CONCAT(COALESCE(host_serial.system_code, 'ID ' || host_serial.asset_stocks_unique_id::text), ' (', COALESCE(host_serial.asset_serial_title, host_asset.asset_title, 'Host'), ')')
        ELSE '-'
      END`;
            const sortableMap = {
                purchase_date: 'procurement.purchase_date',
                asset_title: 'asset.asset_title',
                stock_serials: 'serial.stock_serials',
                serial_number: 'serial.stock_serials',
                manufacturer_name: 'man.manufacturer_name',
                model_name: 'mod.model_name',
                assigned_type: `CASE WHEN host_mapping.mapping_id IS NOT NULL THEN 'SOFTWARE' ELSE mapping.target_type END`,
                assigned_to_name: assignedToExpr,
                asset_stocks_unique_id: 'serial.asset_stocks_unique_id',
            };
            const sortAliasMap = {
                date: 'purchase_date',
                purchase_date: 'purchase_date',
                asset_title: 'asset_title',
                displayname: 'asset_title',
                serial_number: 'stock_serials',
                stock_serials: 'stock_serials',
                serialNumber: 'stock_serials',
                manufacturer: 'manufacturer_name',
                manufacturer_name: 'manufacturer_name',
                model: 'model_name',
                model_name: 'model_name',
                assigned_type: 'assigned_type',
                assignedType: 'assigned_type',
                assigned_to_name: 'assigned_to_name',
                assignedToName: 'assigned_to_name',
            };
            const normalizedSortField = sortField
                ? sortAliasMap[sortField]
                : undefined;
            const idColumn = 'asset_stocks_unique_id';
            const idDbColumn = 'serial.asset_stocks_unique_id';
            const defaultSort = {
                column: 'asset_stocks_unique_id',
                order: 'DESC',
            };
            const sortOrder = sortDirection === 'ASC' ? 'ASC' : 'DESC';
            const sortArray = normalizedSortField && sortableMap[normalizedSortField]
                ? [{ column: normalizedSortField, order: sortOrder }]
                : [];
            const isTimestampSort = normalizedSortField === 'purchase_date';
            const cloneForCount = serialQuery.clone();
            cloneForCount.expressionMap.limit = undefined;
            cloneForCount.expressionMap.offset = undefined;
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const total = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            const totalPages = total != null && total > 0
                ? Math.max(1, Math.ceil(total / pageLimit))
                : null;
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    timestampSort: isTimestampSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    timestampSort: isTimestampSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(serialQuery, jumpPage, pageLimit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb: serialQuery,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction: dir,
                    timestampSort: isTimestampSort,
                });
            }
            const rawRows = usingOffset
                ? await serialQuery.getRawMany()
                : await serialQuery.limit(pageLimit + 1).getRawMany();
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
                    limit: pageLimit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const pageResult = (0, keyset_pagination_1.finalizePage)({
                    rows: rawRows,
                    limit: pageLimit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = pageResult.data;
                if (jumpToLast) {
                    pageResult.hasNextPage = false;
                    pageResult.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: pageResult,
                    limit: pageLimit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            return {
                success: true,
                procurement_id,
                counts: {
                    total_assets: counts?.total_assets || 0,
                    total_assigned: counts?.total_assigned || 0,
                    total_instock: counts?.total_instock || 0,
                    total_scrap: counts?.total_scrap || 0,
                },
                data,
                meta,
            };
        }
        catch (error) {
            console.log('❌ Error in getSoftwareDetails:', error);
            throw error;
        }
    }
    async exportSoftwareProcurementExcel(dto, branchIds = []) {
        try {
            const { procurement_id, type = 'ALL', sortField, sortDirection = 'ASC', locationFilter, purchase_date, selectedIds = [], isSelectAll, excludeIds = [], } = dto;
            let procurementItemIds = [];
            if (procurement_id) {
                const targetProcurementIds = [Number(procurement_id)];
                const procurementItems = await this.assetProcurementItemRepository.find({
                    select: ['procurement_item_id'],
                    where: {
                        procurement_id: (0, typeorm_2.In)(targetProcurementIds),
                    },
                });
                procurementItemIds = procurementItems.map((item) => item.procurement_item_id);
            }
            let sanitizedLocationFilter = null;
            if (locationFilter?.length) {
                sanitizedLocationFilter = locationFilter
                    .filter((val) => val !== 'All')
                    .map((val) => Number(val))
                    .filter((val) => !isNaN(val));
                if (!sanitizedLocationFilter.length) {
                    sanitizedLocationFilter = null;
                }
            }
            const qb = this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_data', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(organizational_user_entity_1.User, 'u', "mapping.target_type='USER' AND mapping.target_id=u.user_id")
                .leftJoin(branches_entity_1.Branch, 'b', "mapping.target_type='BRANCH' AND mapping.target_id=b.branch_id")
                .leftJoin(department_entity_1.Department, 'd', "mapping.target_type='DEPARTMENT' AND mapping.target_id=d.department_id")
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('serial.asset_working_status', 'working_status')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', 'proc_item.procurement_item_id = serial.procurement_item_id')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id=proc_item.procurement_id')
                .leftJoin(asset_software_subscription_entity_1.AssetSoftwareSubscription, 'sub', 'sub.asset_stocks_unique_id = serial.asset_stocks_unique_id')
                .select([
                'serial.asset_stocks_unique_id AS asset_stocks_unique_id',
                'serial.stock_serials AS stock_serials',
                'serial.system_code AS system_code',
                'asset.asset_title AS asset_title',
                'mod.model_name AS model_name',
                'man.manufacturer_name AS manufacturer_name',
                'procurement.purchase_date AS purchase_date',
                'mapping.target_type AS assigned_type',
                'mapping.created_at AS allocation_date',
                'sub.next_renewal_date AS next_renewal_date',
                'sub.billing_frequency AS billing_frequency',
                `CASE
            WHEN mapping.target_type='USER' THEN CONCAT(u.first_name,' ',u.last_name)
            WHEN mapping.target_type='BRANCH' THEN b.branch_name
            WHEN mapping.target_type='DEPARTMENT' THEN d.department_name
            ELSE '-'
          END AS assigned_to_name`,
            ])
                .where('serial.is_deleted = 0')
                .andWhere('serial.is_active = 1');
            if (procurement_id && procurementItemIds.length > 0) {
                qb.andWhere('serial.procurement_item_id IN (:...procurementItemIds)', {
                    procurementItemIds,
                });
            }
            else if (dto.asset_item_id) {
                qb.andWhere('asset.asset_item_id = :asset_item_id', {
                    asset_item_id: Number(dto.asset_item_id),
                });
            }
            (0, branch_access_1.applyBranchFilter)({
                qb,
                entityKey: 'AssetStockSerials',
                branchIds,
            });
            if (sanitizedLocationFilter?.length) {
                qb.andWhere('stock.location_id IN (:...locationFilter)', {
                    locationFilter: sanitizedLocationFilter,
                });
            }
            if (purchase_date) {
                qb.andWhere('procurement.purchase_date::date = :purchase_date::date', { purchase_date });
            }
            if (type === 'ASSIGNED') {
                qb.andWhere('mapping.mapping_id IS NOT NULL');
            }
            else if (type === 'INSTOCK') {
                qb.andWhere('serial.current_status_id IN (:...statusIds)', {
                    statusIds: [1, 5],
                });
                qb.andWhere('mapping.mapping_id IS NULL');
            }
            if (isSelectAll) {
                if (excludeIds && excludeIds.length > 0) {
                    const numericExcludes = excludeIds.map(Number);
                    qb.andWhere('serial.asset_stocks_unique_id NOT IN (:...numericExcludes)', { numericExcludes });
                }
            }
            else if (selectedIds && selectedIds.length > 0) {
                const numericIds = selectedIds.map(Number);
                qb.andWhere('serial.asset_stocks_unique_id IN (:...numericIds)', { numericIds });
            }
            const assignedToExpr = `CASE
        WHEN mapping.target_type='USER' THEN CONCAT(u.first_name,' ',u.last_name)
        WHEN mapping.target_type='BRANCH' THEN b.branch_name
        WHEN mapping.target_type='DEPARTMENT' THEN d.department_name
        ELSE '-'
      END`;
            const sortableMap = {
                purchase_date: 'procurement.purchase_date',
                asset_title: 'asset.asset_title',
                stock_serials: 'serial.stock_serials',
                serial_number: 'serial.stock_serials',
                manufacturer_name: 'man.manufacturer_name',
                model_name: 'mod.model_name',
                assigned_type: 'mapping.target_type',
                assigned_to_name: assignedToExpr,
                asset_stocks_unique_id: 'serial.asset_stocks_unique_id',
            };
            const sortAliasMap = {
                date: 'purchase_date',
                purchase_date: 'purchase_date',
                asset_title: 'asset_title',
                displayname: 'asset_title',
                serial_number: 'stock_serials',
                stock_serials: 'stock_serials',
                serialNumber: 'stock_serials',
                manufacturer: 'manufacturer_name',
                manufacturer_name: 'manufacturer_name',
                model: 'model_name',
                model_name: 'model_name',
                assigned_type: 'assigned_type',
                assignedType: 'assigned_type',
                assigned_to_name: 'assigned_to_name',
                assignedToName: 'assigned_to_name',
            };
            const normalizedSortField = sortField ? sortAliasMap[sortField] : undefined;
            const orderDir = sortDirection === 'DESC' ? 'DESC' : 'ASC';
            if (normalizedSortField && sortableMap[normalizedSortField]) {
                const sortCol = sortableMap[normalizedSortField];
                qb.orderBy(sortCol, orderDir, 'NULLS LAST').addOrderBy('serial.asset_stocks_unique_id', orderDir);
            }
            else {
                qb.orderBy('serial.asset_stocks_unique_id', 'DESC');
            }
            const rawRows = await qb.getRawMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            let headers = [];
            let rowMapper = () => [];
            if (type === 'INSTOCK') {
                sheet.name('Available Softwares');
                headers = [
                    'Sr. No.',
                    'Display Name',
                    'Serial Number',
                ];
                rowMapper = (item, index) => [
                    index + 1,
                    item.asset_title || '-',
                    item.stock_serials || '-',
                ];
            }
            else if (type === 'ASSIGNED') {
                sheet.name('Assigned Softwares');
                headers = [
                    'Sr. No.',
                    'Display Name',
                    'Serial Number',
                    'Assigned To',
                    'Assign Type',
                    'Allocation Date',
                ];
                rowMapper = (item, index) => [
                    index + 1,
                    item.asset_title || '-',
                    item.stock_serials || '-',
                    item.assigned_to_name || '-',
                    item.assigned_type || '-',
                    item.allocation_date ? new Date(item.allocation_date).toLocaleDateString() : '-',
                ];
            }
            else {
                sheet.name('Total Softwares');
                headers = [
                    'Sr. No.',
                    'Display Name',
                    'Serial Number',
                    'Software Name',
                    'Assign Type',
                    'Assign To Name',
                ];
                rowMapper = (item, index) => [
                    index + 1,
                    item.asset_title || '-',
                    item.stock_serials || '-',
                    item.model_name || '-',
                    item.assigned_type || '-',
                    item.assigned_to_name || '-',
                ];
            }
            headers.forEach((header, index) => {
                sheet.cell(1, index + 1).value(header).style({ bold: true });
            });
            rawRows.forEach((item, index) => {
                const row = index + 2;
                const rowValues = rowMapper(item, index);
                rowValues.forEach((val, colIndex) => {
                    sheet.cell(row, colIndex + 1).value(val);
                });
            });
            headers.forEach((_, i) => {
                const headerLength = headers[i].length;
                let maxDataLength = headerLength;
                rawRows.forEach((item, index) => {
                    const rowValues = rowMapper(item, index);
                    const cellValue = String(rowValues[i]).length;
                    maxDataLength = Math.max(maxDataLength, cellValue);
                });
                sheet.column(i + 1).width(Math.min(maxDataLength + 10, 50));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportSoftwareProcurementExcel ERROR:', error);
            throw error;
        }
    }
    async getAllLinkedProcurementIds(procurementId) {
        const result = await this.dataSource.query(`
    -- ✅ Get ROOT first
    WITH RECURSIVE root AS (
      SELECT procurement_id, previous_procurement_id
      FROM asset_procurements
      WHERE procurement_id = $1

      UNION ALL

      SELECT ap.procurement_id, ap.previous_procurement_id
      FROM asset_procurements ap
      INNER JOIN root r
        ON r.previous_procurement_id = ap.procurement_id
    )

    SELECT procurement_id FROM root
    `, [procurementId]);
        const rootId = result[result.length - 1]?.procurement_id;
        const forward = await this.dataSource.query(`
    WITH RECURSIVE chain AS (
      SELECT procurement_id, previous_procurement_id
      FROM asset_procurements
      WHERE procurement_id = $1

      UNION ALL

      SELECT ap.procurement_id, ap.previous_procurement_id
      FROM asset_procurements ap
      INNER JOIN chain c
        ON ap.previous_procurement_id = c.procurement_id
    )

    SELECT procurement_id FROM chain
    `, [rootId]);
        return forward.map((r) => r.procurement_id);
    }
    async getSoftwareListViewByPurchaseDate(asset_item_id, page = 1, limit = 10, sortField = 'purchase_date', sortDirection = 'ASC', locationFilter, branchIds = [], procurement_id, filterType = 'CURRENT', cursor = null, isLastPageMode = false, direction, knownTotal) {
        try {
            const cursorToken = typeof cursor === 'string' ? cursor : null;
            const dir = direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = isLastPageMode === true;
            const pageLimit = Math.min(Math.max(Number(limit || 10), 1), 100);
            const knownTotalVal = knownTotal != null && !Number.isNaN(Number(knownTotal))
                ? Number(knownTotal)
                : null;
            let ids = [];
            if (procurement_id) {
                ids = await this.getAllLinkedProcurementIds(procurement_id);
            }
            else {
                const root = await this.assetProcurementRepository.findOne({
                    where: { asset_id: asset_item_id },
                    order: { created_at: 'ASC' },
                });
                if (root) {
                    ids = await this.getAllLinkedProcurementIds(root.procurement_id);
                }
            }
            if (!ids.length) {
                return {
                    success: true,
                    message: 'No assets found',
                    data: [],
                    meta: (0, keyset_pagination_1.buildListMeta)({
                        page: {
                            data: [],
                            startCursor: null,
                            endCursor: null,
                            hasNextPage: false,
                            hasPrevPage: false,
                        },
                        limit: pageLimit,
                        total: 0,
                        currentPage: 1,
                    }),
                };
            }
            const qb = this.assetProcurementRepository
                .createQueryBuilder('procurement')
                .leftJoin(asset_procurement_items_entity_1.AssetProcurementItem, 'proc_item', `proc_item.procurement_id = procurement.procurement_id`)
                .leftJoin(this.assetStockSerialsRepository.metadata.target, 'serial', `serial.procurement_item_id = proc_item.procurement_item_id
         AND serial.is_deleted = 0
         AND serial.is_active = 1`)
                .leftJoin('proc_item.asset', 'asset')
                .leftJoin('serial.stock', 'stock')
                .leftJoin('asset.manufacturer_name', 'man')
                .leftJoin('asset.model_name', 'mod')
                .leftJoin('procurement.renewal_status_details', 'renewalStatus')
                .leftJoin(asset_software_subscription_entity_1.AssetSoftwareSubscription, 'sub', 'sub.asset_stocks_unique_id = serial.asset_stocks_unique_id')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(asset_mapping_entity_1.AssetMappingRepository, 'host_mapping', `host_mapping.is_deleted = 0 AND host_mapping.is_active = 1 AND host_mapping.relation_type = 'REL-006' AND (host_mapping.target_id = serial.asset_stocks_unique_id OR (host_mapping.asset_stocks_unique_id = serial.asset_stocks_unique_id AND host_mapping.target_type = 'SOFTWARE'))`)
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere(`(
          procurement.procurement_id IN (:...ids)
          OR procurement.previous_procurement_id IN (:...ids)
        )`, { ids });
            if (filterType === 'CURRENT') {
                qb.andWhere(`
        proc_item.procurement_item_id NOT IN (
          SELECT previous_procurement_item_id
          FROM asset_procurement_items
          WHERE previous_procurement_item_id IS NOT NULL
        )
      `);
                qb.andWhere(`(
          procurement.renewal_status IS NULL
          OR procurement.renewal_status = :renewedStatus
        )`, { renewedStatus: 23 });
            }
            qb.select([
                `procurement.procurement_id AS procurement_id`,
                `proc_item.procurement_item_id AS procurement_item_id`,
                `proc_item.previous_procurement_item_id AS previous_procurement_item_id`,
                `proc_item.quantity AS quantity`,
                `DATE(procurement.purchase_date) AS purchase_date`,
                `(
        SELECT COALESCE(SUM(pi.quantity), 0)
        FROM asset_procurement_items pi
        WHERE pi.procurement_id = procurement.procurement_id
      )::int AS total`,
                `COUNT(DISTINCT serial.asset_stocks_unique_id)
        FILTER (WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)::int AS assigned_count`,
                `GREATEST(0, (
        (
          SELECT COALESCE(SUM(pi.quantity), 0)
          FROM asset_procurement_items pi
          WHERE pi.procurement_id = procurement.procurement_id
        )
        -
        COUNT(DISTINCT serial.asset_stocks_unique_id)
          FILTER (WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)
      ))::int AS instock_count`,
                `MIN(asset.asset_title) AS asset_title`,
                `MIN(man.manufacturer_name) AS manufacturer_name`,
                `MIN(mod.model_name) AS model_name`,
                `MIN(procurement.subscription_type) AS subscription_type`,
                `MIN(procurement.billing_frequency) AS billing_frequency`,
                `MIN(procurement.bill_no) AS bill_no`,
                `MIN(procurement.sub_start_date) AS sub_start_date`,
                `MIN(procurement.next_renewal_date) AS next_renewal_date`,
                `MIN(renewalStatus.working_status_type_name) AS renewal_status_name`,
                `MIN(renewalStatus.working_status_color) AS renewal_status_color`,
            ]).groupBy(`
      procurement.procurement_id,
      proc_item.procurement_item_id,
      proc_item.previous_procurement_item_id,
      proc_item.quantity,
      procurement.purchase_date
    `);
            const sortMap = {
                purchase_date: `DATE(procurement.purchase_date)`,
                asset_title: `MIN(asset.asset_title)`,
                manufacturer_name: `MIN(man.manufacturer_name)`,
                model_name: `MIN(mod.model_name)`,
                billing_frequency: `MIN(procurement.billing_frequency)`,
                bill_no: `MIN(procurement.bill_no)`,
                subscription_type: `MIN(procurement.subscription_type)`,
                renewal_status_name: `MIN(renewalStatus.working_status_type_name)`,
                next_renewal_date: `MIN(procurement.next_renewal_date)`,
                sub_start_date: `MIN(procurement.sub_start_date)`,
                total: `(
        SELECT COALESCE(SUM(pi.quantity), 0)
        FROM asset_procurement_items pi
        WHERE pi.procurement_id = procurement.procurement_id
      )`,
                assigned_count: `
        COUNT(DISTINCT serial.asset_stocks_unique_id)
        FILTER (WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)
      `,
                instock_count: `
        GREATEST(0, (
          (
            SELECT COALESCE(SUM(pi.quantity), 0)
            FROM asset_procurement_items pi
            WHERE pi.procurement_id = procurement.procurement_id
          )
          -
          COUNT(DISTINCT serial.asset_stocks_unique_id)
            FILTER (WHERE mapping.mapping_id IS NOT NULL OR host_mapping.mapping_id IS NOT NULL OR serial.current_status_id = 7 OR serial.working_status_type_id = 5)
        ))
      `,
            };
            const sortableMap = {
                purchase_date: sortMap.purchase_date,
                asset_title: sortMap.asset_title,
                manufacturer_name: sortMap.manufacturer_name,
                model_name: sortMap.model_name,
                billing_frequency: sortMap.billing_frequency,
                bill_no: sortMap.bill_no,
                subscription_type: sortMap.subscription_type,
                renewal_status_name: sortMap.renewal_status_name,
                next_renewal_date: sortMap.next_renewal_date,
                sub_start_date: sortMap.sub_start_date,
                total: sortMap.total,
                assigned_count: sortMap.assigned_count,
                instock_count: sortMap.instock_count,
                procurement_item_id: `proc_item.procurement_item_id`,
            };
            const idColumn = 'procurement_item_id';
            const idDbColumn = `proc_item.procurement_item_id`;
            const defaultSort = {
                column: 'purchase_date',
                order: (sortDirection === 'ASC' ? 'ASC' : 'DESC'),
            };
            const sortArray = sortField && sortableMap[sortField]
                ? [
                    {
                        column: sortField,
                        order: (sortDirection === 'ASC' ? 'ASC' : 'DESC'),
                    },
                ]
                : [];
            const isTimestampSort = sortField === 'purchase_date' ||
                sortField === 'next_renewal_date' ||
                sortField === 'sub_start_date' ||
                !sortMap[sortField];
            qb.expressionMap.orderBys = {};
            const cloneForCount = qb.clone();
            cloneForCount.expressionMap.limit = undefined;
            cloneForCount.expressionMap.offset = undefined;
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const totalItems = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            const totalPages = totalItems != null && totalItems > 0
                ? Math.max(1, Math.ceil(totalItems / pageLimit))
                : null;
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
                    predicate: 'having',
                    timestampSort: isTimestampSort,
                });
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
                    direction: dir,
                    predicate: 'having',
                    timestampSort: isTimestampSort,
                });
            }
            const rawRows = await qb.limit(pageLimit + 1).getRawMany();
            const pageResult = (0, keyset_pagination_1.finalizePage)({
                rows: rawRows,
                limit: pageLimit,
                plan,
                idColumn,
                hadCursor: !!cursorToken,
            });
            if (jumpToLast) {
                pageResult.hasNextPage = false;
                pageResult.hasPrevPage =
                    totalItems != null ? totalItems > pageResult.data.length : false;
            }
            const meta = (0, keyset_pagination_1.buildListMeta)({
                page: pageResult,
                limit: pageLimit,
                total: totalItems,
                currentPage: jumpToLast && totalPages != null ? totalPages : 1,
            });
            return {
                success: true,
                message: pageResult.data.length
                    ? 'List view fetched successfully'
                    : 'No assets found',
                data: pageResult.data,
                meta,
            };
        }
        catch (error) {
            console.error('❌ Error in list view:', error);
            throw error;
        }
    }
    async updateAssetImage(serialId, file, login_user_id, req) {
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Error decrypting schema name:', error.message);
            }
        }
        const queryRunner = this.assetStockSerialsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO ${fullSchemaName};`);
            if (!login_user_id || isNaN(Number(login_user_id))) {
                throw new Error('Invalid login user');
            }
            const user = await queryRunner.manager
                .createQueryBuilder()
                .select('user.user_id', 'user_id')
                .from(organizational_user_entity_1.User, 'user')
                .where('user.register_user_login_id = :id', { id: login_user_id })
                .andWhere('user.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('user.is_active = :isActive', { isActive: 1 })
                .getRawOne();
            const currentAsset = await queryRunner.manager
                .createQueryBuilder()
                .from(asset_stock_serials_entity_1.AssetStockSerials, 'asset')
                .where('asset.asset_stocks_unique_id = :id', { id: serialId })
                .getRawOne();
            if (!currentAsset) {
                throw new Error('Asset not found');
            }
            const uploadDir = path.join(process.cwd(), 'uploads', 'asset-image');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `asset-${Date.now()}-${file.originalname}`;
            const fullPath = path.join(uploadDir, fileName);
            fs.writeFileSync(fullPath, file.buffer);
            const dbPath = `/uploads/asset-image/${fileName}`;
            await queryRunner.manager
                .createQueryBuilder()
                .update(asset_stock_serials_entity_1.AssetStockSerials)
                .set({
                asset_image: dbPath,
                updated_by: Number(user.user_id),
            })
                .where('asset_stocks_unique_id = :id', { id: serialId })
                .execute();
            await this.assetEventsService.generateEvent(queryRunner.manager, {
                asset_id: currentAsset.asset_id,
                asset_stocks_unique_id: serialId,
                event_category: asset_events_entity_1.AssetEventCategory.UPDATE,
                performed_by: user.user_id,
                reference_table: 'asset_stock_serials',
                reference_id: serialId,
                metadata: {
                    field: 'asset_image',
                },
                title: `Asset image updated`,
                description: `Asset image was updated`,
                event_type_id: null,
                created_at: new Date(),
            });
            await queryRunner.commitTransaction();
            return {
                status: common_1.HttpStatus.OK,
                message: 'Asset image updated successfully',
                data: {
                    asset_image: dbPath,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error updating asset image:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async markProcurementForRenewal(procurement_id, login_user_id, schema) {
        const queryRunner = this.dataSource.createQueryRunner();
        const RENEWAL_STATUS_ID = 22;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const procurement = await queryRunner.manager.findOne(asset_procurements_entity_1.AssetProcurement, {
                where: { procurement_id },
                relations: ['renewal_status_details'],
            });
            if (!procurement) {
                throw new Error('Procurement not found');
            }
            if (procurement.renewal_status === RENEWAL_STATUS_ID) {
                throw new Error('This software is already marked for renewal');
            }
            const oldStatusName = procurement.renewal_status_details?.working_status_type_name ||
                'Unknown';
            const newStatus = await queryRunner.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: { working_status_type_id: RENEWAL_STATUS_ID },
            });
            const newStatusName = newStatus?.working_status_type_name || 'Renewal';
            procurement.renewal_status = RENEWAL_STATUS_ID;
            await queryRunner.manager.save(procurement);
            const user = await queryRunner.manager
                .createQueryBuilder()
                .select('user.user_id', 'user_id')
                .from(organizational_user_entity_1.User, 'user')
                .where('user.register_user_login_id = :id', { id: login_user_id })
                .andWhere('user.is_deleted = 0')
                .andWhere('user.is_active = 1')
                .getRawOne();
            const serials = await queryRunner.manager
                .createQueryBuilder(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                .leftJoin('serial.procurement_item', 'pi')
                .where('pi.procurement_id = :procurement_id', { procurement_id })
                .select(['serial.asset_stocks_unique_id', 'serial.asset_id'])
                .getMany();
            for (const serial of serials) {
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serial.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.RENEWALS,
                    performed_by: user.user_id,
                    reference_table: 'asset_procurements',
                    reference_id: procurement.procurement_id,
                    metadata: {
                        field: 'renewal_status',
                        old_value: oldStatusName,
                        new_value: newStatusName,
                    },
                    title: 'Software marked for renewal',
                    description: `Software marked for renewal`,
                    event_type_id: null,
                    created_at: new Date(),
                });
            }
            await queryRunner.commitTransaction();
            this.redisService.delByPattern('software-list:*');
            this.redisService.delByPattern('renewalSoftwares-list:*');
            this.invalidateSerials(schema);
            this.scheduleStockRefreshFromContext();
            return { success: true };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getRenewalSoftwares(dto, branchIds = []) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'renewalSoftwares-list',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            console.log('cacheKey', cacheKey);
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('✅ SCRAP CACHE HIT');
                return cached;
            }
            console.log('❌ SCRAP CACHE MISS');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const page = Number(d.page || 1);
            const jumpPage = page > 1 ? page : null;
            const usingOffset = jumpPage !== null && !cursorToken;
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const isLastPageMode = jumpToLast;
            const knownTotalRaw = d.knownTotal ?? d.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            const sortField = dto.sort?.[0]?.column || 'created_at';
            const sortDirection = dto.sort?.[0]?.order === 'ASC' ? 'ASC' : 'DESC';
            const sortColumnMap = {
                asset_item_name: 'asset_item_name',
                software_name: 'asset_item_name',
                publisher: 'v.publisher',
                license_type: 'v.license_type',
                billing_frequency: 'proc.billing_frequency',
                renewal_date: 'proc.next_renewal_date',
                renewal_status: 'rs.working_status_type_name',
                total_quantity: 'total_quantity',
                total_asset_quantity: 'total_asset_quantity',
                created_at: 'proc.created_at',
            };
            const quantitySubQuery = this.dataSource
                .createQueryBuilder()
                .select('p.procurement_id', 'procurement_id')
                .addSelect('SUM(pi.quantity)::int', 'total_quantity')
                .from('asset_procurements', 'p')
                .innerJoin('asset_procurement_items', 'pi', 'pi.procurement_id = p.procurement_id')
                .groupBy('p.procurement_id');
            const qb = this.softwareViewRepo
                .createQueryBuilder('v')
                .leftJoin('assets', 'a', 'a.asset_item_id = v.asset_item_id')
                .leftJoin('asset_procurements', 'proc', `proc.asset_id = a.asset_id`)
                .leftJoin('asset_procurement_items', 'api', 'api.procurement_id = proc.procurement_id')
                .leftJoin(`(${quantitySubQuery.getQuery()})`, 'q', `q.procurement_id = proc.procurement_id`)
                .setParameters(quantitySubQuery.getParameters())
                .leftJoin('asset_working_status_types', 'rs', 'rs.working_status_type_id = proc.renewal_status')
                .select([
                'proc.procurement_id AS procurement_id',
                'proc.created_at AS created_at',
                'proc.next_renewal_date AS next_renewal_date',
                'MAX(v.asset_item_id) AS asset_item_id',
                'MAX(v.asset_item_name) AS asset_item_name',
                'MAX(v.main_category_name) AS main_category_name',
                'MAX(v.sub_category_name) AS sub_category_name',
            ])
                .addSelect('proc.renewal_status', 'renewal_status')
                .addSelect('rs.working_status_type_name', 'renewal_status_name')
                .addSelect('rs.working_status_color', 'renewal_status_color')
                .addSelect('COALESCE(q.total_quantity,0)::int', 'total_quantity')
                .addSelect('COALESCE(MAX(v.total_asset_quantity),0)', 'total_asset_quantity')
                .addSelect('COALESCE(MAX(v.total_assigned_quantity),0)', 'total_assigned_quantity')
                .addSelect('COALESCE(MAX(v.total_in_stock_quantity),0)', 'total_in_stock_quantity')
                .addSelect('COALESCE(MAX(v.total_scrap_quantity),0)', 'total_scrap_quantity')
                .groupBy(`
proc.procurement_id,
proc.created_at,
proc.next_renewal_date,
proc.renewal_status,
rs.working_status_type_name,
rs.working_status_color,
q.total_quantity
`)
                .where(`
      proc.procurement_id IS NOT NULL
      AND proc.renewal_status IN (:...statuses)
    `, { statuses: [21, 22, 23, 24, 25] });
            (0, branch_access_1.applyBranchFilter)({
                qb,
                entityKey: 'AssetProcurementItem',
                branchIds,
            });
            const sortColumn = sortColumnMap[sortField] || 'proc.created_at';
            const idColumn = 'procurement_id';
            const idDbColumn = 'proc.procurement_id';
            const isDateSort = sortColumn === 'proc.created_at' ||
                sortColumn === 'proc.next_renewal_date';
            const allowedFilterColumns = {
                asset_item_id: 'v.asset_item_id',
                main_category_name: 'v.main_category_name',
                sub_category_name: 'v.sub_category_name',
            };
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                const column = allowedFilterColumns[f.column];
                if (!column)
                    continue;
                qb.andWhere(`${column} IN (:...${f.column})`, {
                    [f.column]: f.values,
                });
            }
            searchArray.forEach((s, index) => {
                const value = s.values?.join(' ').trim();
                if (!value)
                    return;
                qb.andWhere(`(v.asset_item_name ILIKE :search${index}
        OR v.main_category_name ILIKE :search${index}
        OR v.sub_category_name ILIKE :search${index})`, { [`search${index}`]: `%${value}%` });
            });
            if (dto.isSelectAll) {
                if (dto.excludeIds?.length > 0) {
                    qb.andWhere('proc.procurement_id NOT IN (:...excludeIds)', {
                        excludeIds: dto.excludeIds,
                    });
                }
            }
            else if (dto.selectedIds?.length > 0) {
                qb.andWhere('proc.procurement_id IN (:...selectedIds)', {
                    selectedIds: dto.selectedIds,
                });
            }
            const cloneForCount = qb.clone();
            cloneForCount.expressionMap.limit = undefined;
            cloneForCount.expressionMap.offset = undefined;
            const countQb = this.dataSource
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(`(${cloneForCount.getQuery()})`, 'sub')
                .setParameters(cloneForCount.getParameters());
            const totalItems = knownTotalVal != null
                ? knownTotalVal
                : Number((await countQb.getRawOne()).count);
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortColumnMap,
                    sort: dto.sort,
                    defaultSort: { column: 'created_at', order: 'DESC' },
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                    predicate: 'having',
                    timestampSort: isDateSort,
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortColumnMap,
                    sort: dto.sort,
                    defaultSort: { column: 'created_at', order: 'DESC' },
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                    predicate: 'having',
                    timestampSort: isDateSort,
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortColumnMap,
                    sort: dto.sort,
                    defaultSort: { column: 'created_at', order: 'DESC' },
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                    predicate: 'having',
                    timestampSort: isDateSort,
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const totalPages = totalItems != null && totalItems > 0
                ? Math.max(1, Math.ceil(totalItems / limit))
                : null;
            let data;
            let meta;
            if (usingOffset) {
                data = rawRows.map((item) => ({
                    ...item,
                    total_quantity: Number(item.total_quantity || 0),
                }));
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
                        hasNextPage: totalPages != null
                            ? jumpPage < totalPages
                            : data.length === limit,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total: totalItems,
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
                data = page.data.map((item) => ({
                    ...item,
                    total_quantity: Number(item.total_quantity || 0),
                }));
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage =
                        totalItems != null ? totalItems > data.length : data.length === limit;
                }
                page.data = data;
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total: totalItems,
                    currentPage: jumpToLast && totalPages != null ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Renewal softwares fetched successfully'
                    : 'No renewal records found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 30);
            return response;
        }
        catch (error) {
            console.error('Error in getRenewalSoftwares:', error);
            throw error;
        }
    }
    async exportRenewalSoftwares(dto, branchIds = []) {
        try {
            dto.pagination = { ...dto.pagination, limit: 1000000 };
            const response = await this.getRenewalSoftwares(dto, branchIds);
            const rows = response.data || [];
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Renewals');
            const headers = [
                'Items',
                'Software Name',
                'Publisher',
                'License Type',
                'Assigned',
                'Billing Frequency',
                'Renewal Date',
                'Renewal Status',
            ];
            headers.forEach((header, i) => {
                const cell = sheet.cell(1, i + 1);
                cell.value(header);
                cell.style('bold', true);
            });
            rows.forEach((row, i) => {
                const rowIndex = i + 2;
                sheet.cell(rowIndex, 1).value(row.asset_item_name || '-');
                sheet.cell(rowIndex, 2).value(row.model_name || '-');
                sheet.cell(rowIndex, 3).value(row.manufacturer_name || '-');
                sheet.cell(rowIndex, 4).value(row.subscription_type || '-');
                sheet.cell(rowIndex, 5).value(`${row.total_assigned_quantity || 0}/${row.total_quantity || 0}`);
                sheet.cell(rowIndex, 6).value(row.billing_frequency || '-');
                sheet.cell(rowIndex, 7).value(row.next_renewal_date ? new Date(row.next_renewal_date).toLocaleDateString('en-GB') : '-');
                sheet.cell(rowIndex, 8).value(row.renewal_status_name || 'Unknown');
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error exporting renewal softwares:', error);
            throw error;
        }
    }
    async approveRenewal(procurementId, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        const ACTIVE_STATUS_ID = 23;
        const CLOSED_STATUS_ID = 24;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newProc = await queryRunner.manager.findOne(asset_procurements_entity_1.AssetProcurement, {
                where: { procurement_id: procurementId },
            });
            if (!newProc) {
                throw new Error('Procurement not found');
            }
            newProc.renewal_status = ACTIVE_STATUS_ID;
            newProc.is_approved = true;
            await queryRunner.manager.save(newProc);
            if (newProc.previous_procurement_id) {
                await queryRunner.manager.update(asset_procurements_entity_1.AssetProcurement, { procurement_id: newProc.previous_procurement_id }, {
                    renewal_status: CLOSED_STATUS_ID,
                });
            }
            const user = await queryRunner.manager
                .createQueryBuilder(organizational_user_entity_1.User, 'user')
                .select('user.user_id', 'user_id')
                .where('user.register_user_login_id = :id', { id: userId })
                .andWhere('user.is_deleted = 0')
                .andWhere('user.is_active = 1')
                .getRawOne();
            const serials = await queryRunner.manager
                .createQueryBuilder(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                .leftJoin('serial.procurement_item', 'pi')
                .where('pi.procurement_id = :procurementId', { procurementId })
                .select(['serial.asset_stocks_unique_id', 'serial.asset_id'])
                .getMany();
            for (const serial of serials) {
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serial.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.RENEWALS,
                    performed_by: user?.user_id,
                    reference_table: 'asset_procurements',
                    reference_id: procurementId,
                    metadata: {
                        field: 'renewal_status',
                        new_value: 'Approved',
                    },
                    title: 'Software renewal approved',
                    description: 'Renewal approved and activated',
                    event_type_id: null,
                    created_at: new Date(),
                });
            }
            await queryRunner.commitTransaction();
            this.scheduleStockRefreshFromContext();
            return {
                success: true,
                message: 'Renewal approved successfully',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelRenewal(procurementId, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        const CANCEL_STATUS_ID = 25;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log('👉 Cancel called for:', procurementId);
            const user = await queryRunner.manager
                .createQueryBuilder(organizational_user_entity_1.User, 'user')
                .select('user.user_id', 'user_id')
                .where('user.register_user_login_id = :id', { id: userId })
                .andWhere('user.is_deleted = 0')
                .andWhere('user.is_active = 1')
                .getRawOne();
            if (!user)
                throw new Error('User not found');
            const procurement = await queryRunner.manager.findOne(asset_procurements_entity_1.AssetProcurement, {
                where: { procurement_id: procurementId },
                relations: ['renewal_status_details'],
            });
            console.log('👉 Found procurement:', procurement);
            if (!procurement) {
                throw new Error('Procurement not found');
            }
            if (procurement.renewal_status === CANCEL_STATUS_ID) {
                throw new Error('Already cancelled');
            }
            const oldStatusName = procurement.renewal_status_details?.working_status_type_name ||
                'Unknown';
            const updateResult = await queryRunner.manager.update(asset_procurements_entity_1.AssetProcurement, { procurement_id: procurementId }, {
                renewal_status: CANCEL_STATUS_ID,
                is_approved: false,
            });
            console.log('👉 Update result:', updateResult);
            if (updateResult.affected === 0) {
                throw new Error('Update failed');
            }
            const newStatus = await queryRunner.manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: { working_status_type_id: CANCEL_STATUS_ID },
            });
            const newStatusName = newStatus?.working_status_type_name || 'Cancelled';
            const serials = await queryRunner.manager
                .createQueryBuilder(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                .leftJoin('serial.procurement_item', 'pi')
                .where('pi.procurement_id = :procurementId', { procurementId })
                .select(['serial.asset_stocks_unique_id', 'serial.asset_id'])
                .getMany();
            console.log('👉 Serial count:', serials.length);
            for (const serial of serials) {
                await this.assetEventsService.generateEvent(queryRunner.manager, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serial.asset_stocks_unique_id,
                    event_category: asset_events_entity_1.AssetEventCategory.RENEWALS,
                    performed_by: user.user_id,
                    reference_table: 'asset_procurements',
                    reference_id: procurementId,
                    metadata: {
                        field: 'renewal_status',
                        old_value: oldStatusName,
                        new_value: newStatusName,
                    },
                    title: 'Software renewal cancelled',
                    description: 'Renewal cancelled',
                    event_type_id: null,
                    created_at: new Date(),
                });
            }
            await queryRunner.commitTransaction();
            this.redisService.delByPattern('renewalSoftwares-list:*');
            this.scheduleStockRefreshFromContext();
            return {
                success: true,
                message: 'Renewal cancelled successfully',
            };
        }
        catch (error) {
            console.error('❌ ERROR:', error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findByProcurement(procurement_id, asset_item_id) {
        try {
            const assetData = await this.assetRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.main_category', 'main_category')
                .leftJoinAndSelect('asset.sub_category', 'sub_category')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('asset.manufacturer_name', 'manufacturer')
                .leftJoinAndSelect('asset.model_name', 'model')
                .where('asset.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('asset.asset_is_deleted = 0')
                .getOne();
            if (!assetData)
                throw new Error('Asset not found');
            const procurementItems = await this.assetProcurementItemRepository
                .createQueryBuilder('api')
                .leftJoinAndSelect('api.procurement', 'ap')
                .leftJoinAndSelect('ap.vendor', 'vendor')
                .leftJoinAndSelect('ap.ownership_status', 'ownership_status')
                .where('api.procurement_id = :procurement_id', { procurement_id })
                .getMany();
            const procurementItemIds = procurementItems.map((item) => item.procurement_item_id);
            const procurementItemMap = new Map(procurementItems.map((item) => [item.procurement_item_id, item]));
            const serials = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.asset_working_status', 'asset_working_status')
                .leftJoinAndSelect('serial.current_status', 'current_status')
                .where('serial.procurement_item_id IN (:...ids)', {
                ids: procurementItemIds,
            })
                .andWhere('serial.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .getMany();
            const enrichedSerials = serials.map((serial) => {
                const procurementItem = procurementItemMap.get(Number(serial.procurement_item_id));
                return {
                    ...serial,
                    procurement_item: procurementItem || null,
                    procurement: procurementItem?.procurement || null,
                };
            });
            const grouped = {
                procurement_id,
                procurement: procurementItems[0]?.procurement || null,
                procurement_items: procurementItems,
                serials: enrichedSerials,
            };
            const stockIds = enrichedSerials.map((s) => s.stock_id).filter(Boolean);
            const stocks = stockIds.length
                ? await this.stockRepository
                    .createQueryBuilder('stock')
                    .leftJoinAndSelect('stock.location', 'location')
                    .where('stock.stock_id IN (:...stockIds)', { stockIds })
                    .andWhere('stock.is_deleted = 0')
                    .getMany()
                : [];
            const assignedQuantity = enrichedSerials.filter((s) => Number(s.current_status_id) === 7).length;
            return {
                asset: assetData,
                stocks,
                chain: grouped,
                serials: enrichedSerials,
                assigned_quantity: assignedQuantity,
                procurement_id,
            };
        }
        catch (error) {
            console.error('❌ Error in findByProcurement:', error);
            throw new Error('An error occurred while fetching data.');
        }
    }
    async createRenewal(procurementId, asset_item_id, formData, userId, isProrata, decrypted_organizationID, req) {
        try {
            let serials = [];
            if (Array.isArray(formData?.quickScanSerials) &&
                formData.quickScanSerials.length > 0) {
                serials = formData.quickScanSerials
                    .map((s) => s?.serialNumber?.trim())
                    .filter((s) => !!s);
            }
            else if (formData?.hardwareFields?.bulkSerialNumbers) {
                serials = formData.hardwareFields.bulkSerialNumbers
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => !!s);
            }
            const uniqueSerials = [...new Set(serials)];
            formData.assetDetails = uniqueSerials.map((serial) => ({
                serial_number: serial,
                license_key: '',
                system_code: '',
                license_details: {},
            }));
            const toNull = (val) => val === '' || val === undefined ? null : val;
            if (formData?.systemFields) {
                formData.systemFields.buy_price = toNull(formData.systemFields.buy_price);
                formData.systemFields.gst = toNull(formData.systemFields.gst);
                formData.systemFields.gstAmount = toNull(formData.systemFields.gstAmount);
                formData.systemFields.totalAmount = toNull(formData.systemFields.totalAmount);
                formData.systemFields.total_without_gst = toNull(formData.systemFields.total_without_gst);
                formData.systemFields.bill_no = toNull(formData.systemFields.bill_no);
                formData.systemFields.purchaseDate = toNull(formData.systemFields.purchaseDate);
            }
            console.log('Renewal quickScanSerials:', formData?.quickScanSerials);
            console.log('Renewal bulkSerialNumbers:', formData?.hardwareFields?.bulkSerialNumbers);
            console.log('Renewal generated assetDetails:', JSON.stringify(formData.assetDetails, null, 2));
            if (isProrata) {
                return this.createProrataStock(procurementId, asset_item_id, formData, userId, decrypted_organizationID, req);
            }
            this.redisService.delByPattern('renewalSoftwares-list:*');
            this.scheduleStockRefreshFromContext();
            return this.createNormalRenewal(procurementId, asset_item_id, formData, userId);
        }
        catch (error) {
            console.error('createRenewal error:', error);
            throw new common_1.InternalServerErrorException(error?.message || 'Failed to create renewal');
        }
    }
    async createProrataStock(procurementId, asset_item_id, formData, userId, decrypted_organizationID, req) {
        const prorataResult = await this.dataSource.transaction(async (manager) => {
            const oldProc = await manager.findOne(asset_procurements_entity_1.AssetProcurement, {
                where: { procurement_id: procurementId },
            });
            if (!oldProc)
                throw new Error('Old procurement not found');
            const user = await manager.findOne(organizational_user_entity_1.User, {
                where: { register_user_login_id: userId },
            });
            if (!user)
                throw new Error('User not found');
            let stock = await manager.findOne(stocks_entity_1.Stock, {
                where: { asset_id: oldProc.asset_id, is_deleted: 0 },
                order: { stock_id: 'DESC' },
            });
            if (!stock)
                throw new Error('Stock not found');
            const addQty = Number(formData.systemFields?.quantity || 0);
            stock.quantity += addQty;
            stock.updated_by = user.user_id;
            stock.updated_at = new Date();
            stock = await manager.save(stock);
            const newProc = manager.create(asset_procurements_entity_1.AssetProcurement, {
                asset_id: oldProc.asset_id,
                stock_id: stock.stock_id,
                license_details: oldProc.license_details,
                ownership_status_id: oldProc.ownership_status_id,
                warranty_category: oldProc.warranty_category,
                vendor_id: formData.systemFields?.vendor,
                bill_no: formData.systemFields?.bill_no,
                purchase_date: formData.systemFields?.purchaseDate || null,
                unit_price: formData.systemFields?.buy_price,
                gst_percent: formData.systemFields?.gst,
                gst_amount: formData.systemFields?.gstAmount,
                total_amount: formData.systemFields?.totalAmount,
                total_without_gst: formData.systemFields?.total_without_gst,
                subscription_type: formData.subscriptionFields?.subscription_type,
                billing_frequency: formData.subscriptionFields?.billing_frequency,
                sub_start_date: formData.subscriptionFields?.subscriptionStartDate || null,
                next_renewal_date: formData.subscriptionFields?.next_renewal_date || null,
                previous_procurement_id: procurementId,
                created_by: user.user_id,
                is_prorated: true,
            });
            const savedProc = await manager.save(newProc);
            const oldItems = await manager.find(asset_procurement_items_entity_1.AssetProcurementItem, {
                where: { procurement_id: procurementId },
            });
            if (!oldItems.length) {
                throw new Error('No procurement items found');
            }
            const mappingMap = new Map();
            for (const oldItem of oldItems) {
                const newItem = manager.create(asset_procurement_items_entity_1.AssetProcurementItem, {
                    procurement_id: savedProc.procurement_id,
                    asset_id: oldItem.asset_id,
                    quantity: addQty || oldItem.quantity,
                    location_id: oldItem.location_id,
                    previous_procurement_item_id: oldItem.procurement_item_id,
                });
                const savedItem = await manager.save(newItem);
                mappingMap.set(Number(oldItem.procurement_item_id), savedItem.procurement_item_id);
            }
            const assetItem = await manager.findOne(asset_item_entity_1.AssetItem, {
                where: { asset_item_id },
                relations: ['main_category', 'sub_category'],
            });
            const asset_main_category_id = assetItem?.main_category?.main_category_id;
            const asset_sub_category_id = assetItem?.sub_category?.sub_category_id;
            const baseCode = await this.assetDataService.assetIDGenerateFormula({
                assetId: oldProc.asset_id,
                branchId: null,
                departmentId: null,
                categoryId: asset_main_category_id,
                subCategoryId: asset_sub_category_id,
                itemId: asset_item_id,
            }, undefined, null, decrypted_organizationID, req);
            const serialRows = [];
            const incomingSerials = formData.assetDetails || [];
            for (const oldItem of oldItems) {
                const newItemId = mappingMap.get(Number(oldItem.procurement_item_id));
                if (!newItemId)
                    continue;
                for (let i = 0; i < addQty; i++) {
                    const detail = incomingSerials[i];
                    serialRows.push({
                        asset_id: oldProc.asset_id,
                        stock_id: stock.stock_id,
                        asset_item_id,
                        procurement_item_id: newItemId,
                        location_id: oldItem.location_id ?? null,
                        stock_serials: detail?.serial_number || null,
                        system_code: detail?.system_code || null,
                        current_status_id: 1,
                        created_by: user.user_id,
                        asset_serial_title: formData.systemFields?.asset_title || null,
                    });
                }
            }
            await this.generateSystemCodes(manager, serialRows, baseCode, null);
            const serialInsert = await manager
                .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                .insert(serialRows);
            const serialIds = serialInsert.raw.map((r) => r.asset_stocks_unique_id);
            await manager.getRepository(asset_events_entity_1.AssetEvent).insert(serialIds.map((id) => ({
                asset_id: oldProc.asset_id,
                asset_stocks_unique_id: id,
                title: 'Pro-rata License Added',
                description: `Added ${addQty} licenses`,
                reference_table: 'asset_procurements',
                reference_id: savedProc.procurement_id,
                performed_by: user.user_id,
                performed_at: new Date(),
                event_type_id: 18,
            })));
            return {
                success: true,
                message: 'Pro-rata licenses added successfully',
            };
        });
        this.depViewService.scheduleRefresh(decrypted_organizationID);
        this.stockSummaryRefresh.scheduleRefresh(decrypted_organizationID);
        return prorataResult;
    }
    async createNormalRenewal(procurementId, asset_item_id, formData, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                where: { register_user_login_id: userId },
            });
            if (!user)
                throw new Error('User not found');
            const oldProc = await queryRunner.manager.findOne(asset_procurements_entity_1.AssetProcurement, {
                where: { procurement_id: procurementId },
            });
            if (!oldProc)
                throw new Error('Procurement not found');
            const oldItems = await queryRunner.manager.find(asset_procurement_items_entity_1.AssetProcurementItem, {
                where: { procurement_id: procurementId },
            });
            if (!oldItems.length)
                throw new Error('No procurement items found');
            const oldItemIds = oldItems.map((i) => i.procurement_item_id);
            const serials = await queryRunner.manager.find(asset_stock_serials_entity_1.AssetStockSerials, {
                where: {
                    procurement_item_id: (0, typeorm_2.In)(oldItemIds),
                    asset_item_id,
                    is_deleted: 0,
                },
            });
            const existingSerialCount = serials.length;
            const totalQty = Number(formData.systemFields?.quantity || oldItems[0].quantity);
            await queryRunner.manager.update(asset_procurements_entity_1.AssetProcurement, { procurement_id: procurementId }, {
                is_approved: false,
                renewal_status: 24,
            });
            const newProc = await queryRunner.manager.save(asset_procurements_entity_1.AssetProcurement, {
                asset_id: oldProc.asset_id,
                vendor_id: this.toNumberOrNull(formData.systemFields?.vendor),
                bill_no: formData.systemFields?.bill_no || null,
                purchase_date: formData.systemFields?.purchaseDate || null,
                unit_price: this.toNumberOrNull(formData.systemFields?.buy_price),
                gst_percent: this.toNumberOrNull(formData.systemFields?.gst),
                gst_amount: this.toNumberOrNull(formData.systemFields?.gstAmount),
                total_amount: this.toNumberOrNull(formData.systemFields?.totalAmount),
                total_without_gst: this.toNumberOrNull(formData.systemFields?.total_without_gst),
                stock_id: oldProc.stock_id,
                subscription_type: formData.subscriptionFields?.subscription_type,
                billing_frequency: formData.subscriptionFields?.billing_frequency,
                sub_start_date: formData.subscriptionFields?.subscriptionStartDate || null,
                next_renewal_date: formData.subscriptionFields?.next_renewal_date || null,
                ownership_status_id: oldProc.ownership_status_id,
                warranty_category: oldProc.warranty_category,
                previous_procurement_id: procurementId,
                renewal_status: 23,
                created_by: user.user_id,
            });
            const newProcItem = await queryRunner.manager.save(asset_procurement_items_entity_1.AssetProcurementItem, {
                procurement_id: newProc.procurement_id,
                asset_id: oldProc.asset_id,
                quantity: totalQty,
                location_id: oldItems[0].location_id,
                previous_procurement_item_id: oldItems[0].procurement_item_id,
            });
            const stockRepo = queryRunner.manager.getRepository(stocks_entity_1.Stock);
            const stock = await stockRepo.findOne({
                where: { asset_id: oldProc.asset_id, is_deleted: 0 },
            });
            if (stock) {
                stock.quantity += totalQty;
                stock.updated_at = new Date();
                stock.updated_by = user.user_id;
                await stockRepo.save(stock);
            }
            const mappingSerials = [];
            for (const s of serials) {
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: s.asset_stocks_unique_id }, {
                    procurement_item_id: newProcItem.procurement_item_id,
                    asset_serial_title: s.asset_serial_title,
                });
                await queryRunner.manager.insert(asset_events_entity_1.AssetEvent, {
                    asset_id: oldProc.asset_id,
                    asset_stocks_unique_id: s.asset_stocks_unique_id,
                    title: 'Asset Renewed',
                    description: 'Existing serial mapped to renewal',
                    reference_table: 'asset_procurements',
                    reference_id: newProc.procurement_id,
                    performed_by: user.user_id,
                    performed_at: new Date(),
                    created_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.RENEWALS,
                    event_type_id: 19,
                });
            }
            const lastSerial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                where: {
                    asset_item_id,
                    is_deleted: 0,
                },
                order: {
                    asset_stocks_unique_id: 'DESC',
                },
            });
            let counter = 1;
            if (lastSerial?.system_code) {
                const match = lastSerial.system_code.match(/(\d+)$/);
                if (match) {
                    counter = parseInt(match[1], 10) + 1;
                }
            }
            const remaining = totalQty - existingSerialCount;
            if (remaining > 0) {
                for (let i = 0; i < remaining; i++) {
                    const system_code = `${lastSerial?.system_code?.replace(/\d+$/, '') || 'AST-'}${counter + i}`;
                    const insertResult = await queryRunner.manager.insert(asset_stock_serials_entity_1.AssetStockSerials, {
                        asset_id: oldProc.asset_id,
                        stock_id: stock.stock_id,
                        asset_item_id,
                        system_code,
                        asset_serial_title: serials[0]?.asset_serial_title || 'Renewal',
                        procurement_item_id: newProcItem.procurement_item_id,
                        current_status_id: 1,
                        working_status_type_id: 18,
                        created_by: user.user_id,
                    });
                    const insertedId = insertResult.identifiers?.[0]?.asset_stocks_unique_id;
                    await queryRunner.manager.insert(asset_events_entity_1.AssetEvent, {
                        asset_id: oldProc.asset_id,
                        asset_stocks_unique_id: insertedId,
                        title: 'Asset Created (Renewal)',
                        description: 'New serial created during renewal',
                        reference_table: 'asset_procurements',
                        reference_id: newProc.procurement_id,
                        performed_by: user.user_id,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.RENEWALS,
                        event_type_id: 18,
                    });
                }
            }
            await queryRunner.commitTransaction();
            this.scheduleStockRefreshFromContext();
            return {
                success: true,
                message: 'Renewal created successfully',
                procurement_id: newProc.procurement_id,
                procurement_item_id: newProcItem.procurement_item_id,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Renewal error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    toNumberOrNull(value) {
        if (value === '' || value === undefined || value === null)
            return null;
        return Number(value);
    }
    async getRenewalHistory(asset_item_id, procurement_id) {
        try {
            console.log('Fetching history for asset_item_id:', asset_item_id);
            const serials = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.procurement_item', 'item')
                .leftJoinAndSelect('item.procurement', 'procurement')
                .leftJoinAndSelect('procurement.vendor', 'vendor')
                .leftJoinAndSelect('procurement.ownership_status', 'ownership_status')
                .where('serial.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('serial.is_deleted = 0')
                .orderBy('serial.created_at', 'ASC')
                .getMany();
            console.log('Total serial records found:', serials.length);
            if (!serials.length) {
                return { history: [] };
            }
            let filteredSerials = serials;
            if (procurement_id) {
                const allowedProcurementIds = await this.getAllLinkedProcurementIds(procurement_id);
                filteredSerials = serials.filter((s) => allowedProcurementIds.includes(s.procurement_item?.procurement_id));
            }
            const grouped = new Map();
            for (const s of filteredSerials) {
                const item = s.procurement_item;
                const proc = item?.procurement;
                const key = s.procurement_item_id;
                if (!grouped.has(key)) {
                    grouped.set(key, {
                        procurement_item_id: key,
                        procurement_id: proc?.procurement_id,
                        asset_id: proc?.asset_id,
                        subscription_type: proc?.subscription_type,
                        billing_frequency: proc?.billing_frequency,
                        sub_start_date: proc?.sub_start_date,
                        next_renewal_date: proc?.next_renewal_date,
                        renewal_status: proc?.renewal_status,
                        vendor: proc?.vendor || null,
                        ownership_status: proc?.ownership_status || null,
                        previous_procurement_id: proc?.previous_procurement_id || null,
                        created_at: s.created_at,
                        serials: [],
                    });
                }
                grouped.get(key).serials.push({
                    asset_stocks_unique_id: s.asset_stocks_unique_id,
                    stock_id: s.stock_id,
                    system_code: s.system_code,
                    current_status_id: s.current_status_id,
                    working_status_type_id: s.working_status_type_id,
                    asset_serial_title: s.asset_serial_title,
                    created_at: s.created_at,
                });
            }
            const history = Array.from(grouped.values());
            history.sort((a, b) => {
                const aDate = new Date(a.sub_start_date || a.created_at).getTime();
                const bDate = new Date(b.sub_start_date || b.created_at).getTime();
                return bDate - aDate;
            });
            return { history };
        }
        catch (error) {
            console.error('❌ getRenewalHistory error:', error);
            throw new Error('Failed to fetch procurement history');
        }
    }
    async getBillEditDetails(procurement_item_id, branchIds) {
        console.log('procurement_item_id', procurement_item_id);
        try {
            const details = await this.assetProcurementItemRepository
                .createQueryBuilder('item')
                .leftJoin(asset_procurements_entity_1.AssetProcurement, 'procurement', 'procurement.procurement_id = item.procurement_id')
                .leftJoin(asset_datum_entity_1.AssetDatum, 'asset', 'asset.asset_id = item.asset_id')
                .leftJoin('asset.main_category', 'main_category')
                .leftJoin('asset.sub_category', 'sub_category')
                .leftJoin('asset.manufacturer_name', 'manufacturer')
                .leftJoin('asset.model_name', 'model')
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'location', 'location.location_mapping_id = item.location_id')
                .leftJoin(organizational_vendors_entity_1.OrganizationVendors, 'vendor', 'vendor.vendor_id = procurement.vendor_id')
                .leftJoin(asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes, 'ownership', 'ownership.ownership_status_type_id = procurement.ownership_status_id')
                .select([
                'item.procurement_item_id                        AS procurement_item_id',
                'item.procurement_id                             AS procurement_id',
                'item.asset_id                                   AS asset_id',
                'CAST(item.quantity AS INTEGER)                  AS quantity',
                'item.location_id                                AS location_id',
                'asset.asset_title                               AS asset_title',
                'main_category.main_category_name                AS main_category_name',
                'sub_category.sub_category_name                  AS sub_category_name',
                'manufacturer.manufacturer_name                  AS manufacturer_name',
                'model.model_name                                AS model_name',
                'procurement.vendor_id                           AS vendor_id',
                'vendor.vendor_name                              AS vendor_name',
                'procurement.bill_no                             AS bill_no',
                'procurement.invoice_no                          AS invoice_no',
                'procurement.purchase_date::text AS purchase_date',
                'CAST(procurement.unit_price AS NUMERIC(15,2))   AS unit_price',
                'CAST(procurement.gst_percent AS NUMERIC(5,2))   AS gst_percent',
                'CAST(procurement.gst_amount AS NUMERIC(15,2))   AS gst_amount',
                'CAST(procurement.total_without_gst AS NUMERIC(15,2)) AS total_without_gst',
                'CAST(procurement.total_amount AS NUMERIC(15,2)) AS total_amount',
                'procurement.documents                           AS documents',
                'procurement.subscription_type                   AS subscription_type',
                'procurement.billing_frequency                   AS billing_frequency',
                'procurement.sub_start_date                      AS sub_start_date',
                'procurement.next_renewal_date                   AS next_renewal_date',
                'procurement.ownership_status_id                 AS ownership_status_id',
                'ownership.ownership_status_type_name            AS ownership_status_name',
            ])
                .where('item.procurement_item_id = :procurement_item_id', {
                procurement_item_id,
            })
                .getRawOne();
            if (!details)
                throw new common_1.NotFoundException('Procurement item not found');
            const toInt = (v) => v !== null && v !== undefined ? parseInt(v, 10) : null;
            const toFloat = (v) => v !== null && v !== undefined ? parseFloat(v) : null;
            const serials = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoin('serial.asset_mappings', 'mapping', 'mapping.is_deleted = 0 AND mapping.is_active = 1 AND (mapping.target_type NOT IN (\'SOFTWARE\', \'ASSET\') OR mapping.target_type IS NULL)')
                .leftJoin(organizational_user_entity_1.User, 'u', `mapping.target_type='USER'       AND mapping.target_id=u.user_id`)
                .leftJoin(branches_entity_1.Branch, 'b', `mapping.target_type='BRANCH'     AND mapping.target_id=b.branch_id`)
                .leftJoin(department_entity_1.Department, 'd', `mapping.target_type='DEPARTMENT' AND mapping.target_id=d.department_id`)
                .leftJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'lbm', 'lbm.location_mapping_id = serial.location_id')
                .leftJoin(locations_entity_1.Locations, 'loc', 'loc.location_id = lbm.location_id')
                .leftJoin(branches_entity_1.Branch, 'locBranch', 'locBranch.branch_id = lbm.branch_id')
                .leftJoin('serial.asset_working_status', 'working_status')
                .select([
                'serial.asset_stocks_unique_id                   AS asset_stocks_unique_id',
                'serial.stock_serials                            AS stock_serials',
                'serial.system_code                              AS system_code',
                'loc.location_name AS location_name',
                'locBranch.branch_name AS branch_name',
                'serial.stock_id                                 AS stock_id',
                'serial.asset_id                                 AS asset_id',
                'serial.procurement_item_id                      AS procurement_item_id',
                'serial.is_active                                AS is_active',
                'serial.is_deleted                               AS is_deleted',
                'serial.working_status_type_id                   AS working_status_type_id',
                'working_status.working_status_type_name         AS working_status_type_name',
                'mapping.mapping_id                              AS mapping_id',
                'mapping.target_type                             AS assigned_type',
                'mapping.target_id                               AS assigned_to_id',
                `CASE
           WHEN mapping.target_type='USER'       THEN CONCAT(u.first_name,' ',u.last_name)
           WHEN mapping.target_type='BRANCH'     THEN b.branch_name
           WHEN mapping.target_type='DEPARTMENT' THEN d.department_name
           ELSE '-'
         END                                             AS assigned_to_name`,
            ])
                .where('serial.procurement_item_id = :procurement_item_id', {
                procurement_item_id,
            })
                .andWhere('serial.is_deleted = 0')
                .orderBy('serial.asset_stocks_unique_id', 'ASC')
                .getRawMany();
            const assignedCount = serials.filter((s) => !!s.mapping_id).length;
            const removableCount = serials.filter((s) => !s.mapping_id).length;
            const formattedSerials = serials.map((serial) => ({
                ...serial,
                is_assigned: !!serial.mapping_id,
                can_remove: !serial.mapping_id,
                removal_reason: serial.mapping_id
                    ? `Assigned to ${serial.assigned_to_name}`
                    : null,
            }));
            return {
                procurement_item_id: toInt(details.procurement_item_id),
                procurement_id: toInt(details.procurement_id),
                asset_details: {
                    asset_id: toInt(details.asset_id),
                    asset_title: details.asset_title,
                    main_category_name: details.main_category_name,
                    sub_category_name: details.sub_category_name,
                    manufacturer_name: details.manufacturer_name,
                    model_name: details.model_name,
                    location_id: toInt(details.location_id),
                },
                billing_details: {
                    quantity: toInt(details.quantity),
                    vendor_id: toInt(details.vendor_id),
                    vendor_name: details.vendor_name,
                    bill_no: details.bill_no,
                    invoice_no: details.invoice_no,
                    purchase_date: details.purchase_date,
                    unit_price: toFloat(details.unit_price),
                    gst_percent: toFloat(details.gst_percent),
                    gst_amount: toFloat(details.gst_amount),
                    total_without_gst: toFloat(details.total_without_gst),
                    total_amount: toFloat(details.total_amount),
                    ownership_status_id: toInt(details.ownership_status_id),
                    ownership_status_name: details.ownership_status_name,
                    documents: (() => {
                        if (!details.documents)
                            return [];
                        if (Array.isArray(details.documents))
                            return details.documents;
                        try {
                            return JSON.parse(details.documents);
                        }
                        catch {
                            return [];
                        }
                    })(),
                    subscription_type: details.subscription_type,
                    billing_frequency: details.billing_frequency,
                    sub_start_date: details.sub_start_date,
                    next_renewal_date: details.next_renewal_date,
                },
                serial_summary: {
                    total_serials: formattedSerials.length,
                    assigned_serials: assignedCount,
                    removable_serials: removableCount,
                },
                serials: formattedSerials,
            };
        }
        catch (error) {
            console.log('❌ Error in getBillEditDetails:', error);
            throw error;
        }
    }
    async updateStockBill(dto, organizationID) {
        console.log('UpdateStockBillDto', dto);
        return await this.dataSource.transaction(async (manager) => {
            try {
                const toNull = (val) => val === '' || val === undefined ? null : val;
                const normalize = (val) => {
                    if (val === '' || val === undefined || val === null)
                        return null;
                    const n = Number(val);
                    if (!isNaN(n) && val !== '' && val !== true && val !== false)
                        return n;
                    return val;
                };
                const [existingProcurement, existingItem] = await Promise.all([
                    manager.getRepository(asset_procurements_entity_1.AssetProcurement).findOne({
                        where: { procurement_id: dto.procurement_id },
                    }),
                    manager.getRepository(asset_procurement_items_entity_1.AssetProcurementItem).findOne({
                        where: { procurement_item_id: dto.procurement_item_id },
                    }),
                ]);
                if (!existingProcurement)
                    throw new common_1.NotFoundException(`Procurement ${dto.procurement_id} not found`);
                if (!existingItem)
                    throw new common_1.NotFoundException(`Procurement item ${dto.procurement_item_id} not found`);
                const asset = await manager.getRepository(asset_datum_entity_1.AssetDatum).findOne({
                    where: { asset_id: dto.asset_id },
                    select: ['asset_id', 'asset_item_id', 'asset_main_category_id'],
                });
                if (!asset)
                    throw new common_1.NotFoundException('Asset not found');
                const assetItem = await manager.getRepository(asset_item_entity_1.AssetItem).findOne({
                    where: { asset_item_id: asset.asset_item_id },
                    select: ['asset_item_id', 'item_type', 'has_serials'],
                });
                const changes = {};
                const trackChange = (field, oldVal, newVal) => {
                    if (newVal === undefined)
                        return;
                    const o = normalize(oldVal);
                    const n = normalize(newVal);
                    if (String(o ?? '') !== String(n ?? '')) {
                        changes[field] = { old: o, new: n };
                    }
                };
                trackChange('vendor_id', existingProcurement.vendor_id, dto.vendor_id);
                trackChange('bill_no', existingProcurement.bill_no, dto.bill_no);
                trackChange('invoice_no', existingProcurement.invoice_no, dto.invoice_no);
                trackChange('purchase_date', existingProcurement.purchase_date, dto.purchase_date);
                trackChange('unit_price', existingProcurement.unit_price, dto.buy_price);
                trackChange('gst_percent', existingProcurement.gst_percent, dto.gst_percent);
                trackChange('gst_amount', existingProcurement.gst_amount, dto.gst_amount);
                trackChange('total_without_gst', existingProcurement.total_without_gst, dto.total_without_gst);
                trackChange('total_amount', existingProcurement.total_amount, dto.total_amount);
                trackChange('ownership_status_id', existingProcurement.ownership_status_id, dto.ownership_status_id);
                trackChange('subscription_type', existingProcurement.subscription_type, dto.subscription_type);
                trackChange('billing_frequency', existingProcurement.billing_frequency, dto.billing_frequency);
                trackChange('sub_start_date', existingProcurement.sub_start_date, dto.sub_start_date);
                trackChange('next_renewal_date', existingProcurement.next_renewal_date, dto.next_renewal_date);
                trackChange('quantity', existingItem.quantity, dto.quantity);
                trackChange('location_id', existingItem.location_id, dto.location_id);
                const procurementUpdate = {};
                if (dto.vendor_id !== undefined)
                    procurementUpdate.vendor_id = toNull(dto.vendor_id);
                if (dto.bill_no !== undefined)
                    procurementUpdate.bill_no = toNull(dto.bill_no);
                if (dto.invoice_no !== undefined)
                    procurementUpdate.invoice_no = toNull(dto.invoice_no);
                if (dto.purchase_date !== undefined)
                    procurementUpdate.purchase_date = toNull(dto.purchase_date);
                if (dto.buy_price !== undefined)
                    procurementUpdate.unit_price = toNull(dto.buy_price);
                if (dto.gst_percent !== undefined)
                    procurementUpdate.gst_percent = toNull(dto.gst_percent);
                if (dto.gst_amount !== undefined)
                    procurementUpdate.gst_amount = toNull(dto.gst_amount);
                if (dto.total_without_gst !== undefined)
                    procurementUpdate.total_without_gst = toNull(dto.total_without_gst);
                if (dto.total_amount !== undefined)
                    procurementUpdate.total_amount = toNull(dto.total_amount);
                if (dto.ownership_status_id !== undefined)
                    procurementUpdate.ownership_status_id = dto.ownership_status_id;
                if (dto.documents !== undefined)
                    procurementUpdate.documents = toNull(dto.documents);
                if (dto.subscription_type !== undefined)
                    procurementUpdate.subscription_type = toNull(dto.subscription_type);
                if (dto.billing_frequency !== undefined)
                    procurementUpdate.billing_frequency = toNull(dto.billing_frequency);
                if (dto.sub_start_date !== undefined)
                    procurementUpdate.sub_start_date = toNull(dto.sub_start_date);
                if (dto.next_renewal_date !== undefined)
                    procurementUpdate.next_renewal_date = toNull(dto.next_renewal_date);
                if (Object.keys(procurementUpdate).length > 0) {
                    await manager
                        .getRepository(asset_procurements_entity_1.AssetProcurement)
                        .update({ procurement_id: dto.procurement_id }, procurementUpdate);
                }
                const parseDocs = (val) => {
                    if (!val)
                        return [];
                    if (Array.isArray(val))
                        return val;
                    try {
                        return JSON.parse(val);
                    }
                    catch {
                        return [];
                    }
                };
                const oldDocsStr = JSON.stringify(parseDocs(existingProcurement.documents));
                const newDocsStr = JSON.stringify(dto.documents ?? []);
                const documentsChanged = dto.documents !== undefined && oldDocsStr !== newDocsStr;
                const itemUpdate = {};
                if (dto.quantity !== undefined)
                    itemUpdate.quantity = dto.quantity;
                if (dto.location_id !== undefined)
                    itemUpdate.location_id = toNull(dto.location_id);
                if (Object.keys(itemUpdate).length > 0) {
                    await manager
                        .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                        .update({ procurement_item_id: dto.procurement_item_id }, itemUpdate);
                }
                const allExistingSerials = await manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .find({
                    where: {
                        procurement_item_id: dto.procurement_item_id,
                        is_deleted: 0,
                    },
                    select: ['asset_stocks_unique_id', 'stock_serials'],
                });
                const itemIsSerialTracked = assetItem?.has_serials === true ||
                    allExistingSerials.some((s) => s.stock_serials !== null && s.stock_serials !== '');
                const toRemove = [];
                const insertedSerialIds = [];
                if (itemIsSerialTracked) {
                    const retainedSet = new Set(dto.retained_serial_ids ?? []);
                    const serialsToRemove = allExistingSerials.filter((s) => !retainedSet.has(s.asset_stocks_unique_id));
                    toRemove.push(...serialsToRemove);
                    if (toRemove.length > 0) {
                        await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).update({
                            asset_stocks_unique_id: (0, typeorm_2.In)(toRemove.map((s) => s.asset_stocks_unique_id)),
                        }, { is_deleted: 1, is_active: 0 });
                    }
                    const activeAfterRemoval = allExistingSerials.length - toRemove.length;
                    const targetQuantity = dto.quantity ?? activeAfterRemoval;
                    const explicitNewSerials = dto.new_serials ?? [];
                    const emptySlotCount = Math.max(0, targetQuantity - activeAfterRemoval - explicitNewSerials.length);
                    const allNewSerials = [
                        ...explicitNewSerials,
                        ...Array(emptySlotCount).fill(null),
                    ];
                    if (allNewSerials.length > 0) {
                        const nonNullSerials = allNewSerials.filter(Boolean);
                        if (nonNullSerials.length) {
                            const duplicates = await manager
                                .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                                .createQueryBuilder('serial')
                                .select('serial.stock_serials')
                                .where('serial.stock_serials IN (:...serials)', {
                                serials: nonNullSerials,
                            })
                                .andWhere('serial.asset_item_id = :asset_item_id', {
                                asset_item_id: asset.asset_item_id,
                            })
                                .andWhere('serial.is_deleted = 0')
                                .getRawMany();
                            if (duplicates.length) {
                                throw new common_1.HttpException(`Duplicate serial(s): ${duplicates.map((d) => d.serial_stock_serials).join(', ')}`, common_1.HttpStatus.CONFLICT);
                            }
                        }
                        const stock = await manager.getRepository(stocks_entity_1.Stock).findOne({
                            where: { asset_id: dto.asset_id, is_deleted: 0 },
                            order: { stock_id: 'DESC' },
                        });
                        if (!stock)
                            throw new common_1.NotFoundException('Stock record not found');
                        const siblingSerial = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .findOne({
                            where: {
                                procurement_item_id: dto.procurement_item_id,
                                is_deleted: 0,
                            },
                            order: { asset_stocks_unique_id: 'ASC' },
                        });
                        const lastSerial = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .createQueryBuilder('s')
                            .where('s.asset_item_id = :asset_item_id', {
                            asset_item_id: asset.asset_item_id,
                        })
                            .andWhere('s.is_deleted = 0')
                            .andWhere('s.system_code IS NOT NULL')
                            .orderBy(`CAST(REGEXP_REPLACE(s.system_code, '[^0-9]', '', 'g') AS INTEGER)`, 'DESC')
                            .limit(1)
                            .getOne();
                        const generateNextCode = (lastCode, offset) => {
                            if (!lastCode)
                                return null;
                            const match = lastCode.match(/^(.*?)(\d+)$/);
                            if (!match)
                                return null;
                            const prefix = match[1];
                            const num = parseInt(match[2], 10);
                            const padLength = match[2].length;
                            return `${prefix}${String(num + offset).padStart(padLength, '0')}`;
                        };
                        const newSerialRows = allNewSerials.map((serial, i) => ({
                            asset_id: dto.asset_id,
                            stock_id: stock.stock_id,
                            asset_item_id: asset.asset_item_id,
                            stock_serials: serial ?? null,
                            system_code: generateNextCode(lastSerial?.system_code ?? null, i + 1),
                            asset_serial_title: siblingSerial?.asset_serial_title ?? null,
                            information_fields: siblingSerial?.information_fields ?? null,
                            procurement_item_id: dto.procurement_item_id,
                            location_id: stock?.location_id ?? siblingSerial?.location_id ?? null,
                            current_status_id: siblingSerial?.current_status_id ?? 1,
                            working_status_type_id: assetItem?.item_type === 'Virtual' ? null : 18,
                            created_by: dto.updated_by,
                        }));
                        const insertResult = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .insert(newSerialRows);
                        insertedSerialIds.push(...insertResult.raw.map((r) => r.asset_stocks_unique_id));
                    }
                }
                else {
                    const currentCount = allExistingSerials.length;
                    const targetQuantity = dto.quantity ?? currentCount;
                    const delta = targetQuantity - currentCount;
                    if (delta < 0) {
                        const rowsToRemove = allExistingSerials
                            .sort((a, b) => b.asset_stocks_unique_id - a.asset_stocks_unique_id)
                            .slice(0, Math.abs(delta));
                        toRemove.push(...rowsToRemove);
                        await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).update({
                            asset_stocks_unique_id: (0, typeorm_2.In)(rowsToRemove.map((s) => s.asset_stocks_unique_id)),
                        }, { is_deleted: 1, is_active: 0 });
                    }
                    else if (delta > 0) {
                        const stock = await manager.getRepository(stocks_entity_1.Stock).findOne({
                            where: { asset_id: dto.asset_id, is_deleted: 0 },
                            order: { stock_id: 'DESC' },
                        });
                        if (!stock)
                            throw new common_1.NotFoundException('Stock record not found');
                        const siblingSerial = allExistingSerials[0]
                            ? await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).findOne({
                                where: {
                                    asset_stocks_unique_id: allExistingSerials[0].asset_stocks_unique_id,
                                },
                            })
                            : null;
                        const lastSerial = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .createQueryBuilder('s')
                            .where('s.asset_item_id = :asset_item_id', {
                            asset_item_id: asset.asset_item_id,
                        })
                            .andWhere('s.is_deleted = 0')
                            .andWhere('s.system_code IS NOT NULL')
                            .orderBy(`CAST(REGEXP_REPLACE(s.system_code, '[^0-9]', '', 'g') AS INTEGER)`, 'DESC')
                            .limit(1)
                            .getOne();
                        const generateNextCode = (lastCode, offset) => {
                            if (!lastCode)
                                return null;
                            const match = lastCode.match(/^(.*?)(\d+)$/);
                            if (!match)
                                return null;
                            const prefix = match[1];
                            const num = parseInt(match[2], 10);
                            const padLength = match[2].length;
                            return `${prefix}${String(num + offset).padStart(padLength, '0')}`;
                        };
                        const newRows = Array.from({ length: delta }, (_, i) => ({
                            asset_id: dto.asset_id,
                            stock_id: stock.stock_id,
                            asset_item_id: asset.asset_item_id,
                            stock_serials: null,
                            system_code: generateNextCode(lastSerial?.system_code ?? null, i + 1),
                            asset_serial_title: siblingSerial?.asset_serial_title ?? null,
                            information_fields: siblingSerial?.information_fields ?? null,
                            procurement_item_id: dto.procurement_item_id,
                            location_id: stock?.location_id ?? siblingSerial?.location_id ?? null,
                            current_status_id: siblingSerial?.current_status_id ?? 1,
                            working_status_type_id: assetItem?.item_type === 'Virtual' ? null : 18,
                            created_by: dto.updated_by,
                        }));
                        const insertResult = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .insert(newRows);
                        insertedSerialIds.push(...insertResult.raw.map((r) => r.asset_stocks_unique_id));
                    }
                }
                let newStockQty;
                if (itemIsSerialTracked) {
                    newStockQty = await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).count({
                        where: { asset_id: dto.asset_id, is_deleted: 0, is_active: 1 },
                    });
                }
                else {
                    const qtyResult = await manager
                        .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                        .createQueryBuilder('item')
                        .select('SUM(item.quantity)', 'total')
                        .innerJoin(asset_procurements_entity_1.AssetProcurement, 'proc', 'proc.procurement_id = item.procurement_id')
                        .where('proc.asset_id = :asset_id', { asset_id: dto.asset_id })
                        .getRawOne();
                    newStockQty = Number(qtyResult?.total ?? 0);
                }
                await manager
                    .getRepository(stocks_entity_1.Stock)
                    .update({ asset_id: dto.asset_id, is_deleted: 0 }, { quantity: newStockQty });
                const eventRows = [];
                const fieldLabels = {
                    purchase_date: 'Purchase Date',
                    bill_no: 'Bill No',
                    invoice_no: 'Invoice No',
                    unit_price: 'Unit Price',
                    gst_percent: 'GST %',
                    gst_amount: 'GST Amount',
                    total_amount: 'Grand Total',
                    total_without_gst: 'Total Without GST',
                    location_id: 'Location',
                    vendor_id: 'Vendor',
                    ownership_status_id: 'Ownership Type',
                    subscription_type: 'Subscription Type',
                    billing_frequency: 'Billing Frequency',
                    sub_start_date: 'Subscription Start Date',
                    next_renewal_date: 'Next Renewal Date',
                };
                const updaterUser = await manager.getRepository(organizational_user_entity_1.User).findOne({
                    where: { user_id: dto.updated_by },
                    select: ['user_id', 'first_name', 'last_name'],
                });
                const updatedByLabel = updaterUser
                    ? `${updaterUser.first_name} ${updaterUser.last_name}`.trim()
                    : dto.updated_by
                        ? `User #${dto.updated_by}`
                        : 'System';
                const billingOnlyChanges = Object.fromEntries(Object.entries(changes).filter(([field]) => field !== 'quantity'));
                if (Object.keys(billingOnlyChanges).length > 0) {
                    const affectedSerials = await manager
                        .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                        .find({
                        where: {
                            procurement_item_id: dto.procurement_item_id,
                            is_deleted: 0,
                        },
                        select: ['asset_stocks_unique_id'],
                    });
                    const changeLines = Object.entries(billingOnlyChanges).map(([field, value]) => {
                        const label = fieldLabels[field] || field;
                        const oldVal = value.old !== null ? value.old : '(empty)';
                        const newVal = value.new !== null ? value.new : '(empty)';
                        return `  • ${label}: ${oldVal} → ${newVal}`;
                    });
                    const description = `Bill updated by ${updatedByLabel}.\n` +
                        `Changed fields:\n${changeLines.join('\n')}`;
                    affectedSerials.forEach((s) => {
                        eventRows.push({
                            asset_id: dto.asset_id,
                            asset_stocks_unique_id: s.asset_stocks_unique_id,
                            title: 'Bill Updated',
                            description,
                            reference_table: 'asset_procurements',
                            reference_id: dto.procurement_id,
                            metadata: {
                                procurement_id: dto.procurement_id,
                                procurement_item_id: dto.procurement_item_id,
                                updated_by: dto.updated_by,
                                changes: billingOnlyChanges,
                            },
                            performed_by: dto.updated_by,
                            performed_at: new Date(),
                            created_at: new Date(),
                            event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                            event_type_id: null,
                        });
                    });
                }
                if (!itemIsSerialTracked && changes['quantity']) {
                    eventRows.push({
                        asset_id: dto.asset_id,
                        asset_stocks_unique_id: null,
                        title: 'Quantity Updated',
                        description: `Quantity changed by ${updatedByLabel}: ${changes['quantity'].old ?? '(empty)'} → ${changes['quantity'].new}.`,
                        reference_table: 'asset_procurement_items',
                        reference_id: dto.procurement_item_id,
                        metadata: {
                            procurement_id: dto.procurement_id,
                            procurement_item_id: dto.procurement_item_id,
                            updated_by: dto.updated_by,
                            old_quantity: changes['quantity'].old,
                            new_quantity: changes['quantity'].new,
                        },
                        performed_by: dto.updated_by,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.LIFECYCLE,
                        event_type_id: null,
                    });
                }
                toRemove.forEach((s) => {
                    eventRows.push({
                        asset_id: dto.asset_id,
                        asset_stocks_unique_id: s.asset_stocks_unique_id,
                        title: 'Asset Removed',
                        description: `Asset removed by ${updatedByLabel} while editing bill` +
                            (s.stock_serials ? ` (serial: ${s.stock_serials})` : '') +
                            '.',
                        reference_table: 'asset_procurement_items',
                        reference_id: dto.procurement_item_id,
                        metadata: {
                            procurement_id: dto.procurement_id,
                            removed_serial: s.stock_serials,
                            updated_by: dto.updated_by,
                        },
                        performed_by: dto.updated_by,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.LIFECYCLE,
                        event_type_id: null,
                    });
                });
                insertedSerialIds.forEach((id, i) => {
                    const serialLabel = itemIsSerialTracked
                        ? ((dto.new_serials ?? [])[i] ?? null)
                        : null;
                    eventRows.push({
                        asset_id: dto.asset_id,
                        asset_stocks_unique_id: id,
                        title: 'Asset Added',
                        description: `Asset added by ${updatedByLabel} to existing bill` +
                            (serialLabel ? ` (serial: ${serialLabel})` : '') +
                            '.',
                        reference_table: 'asset_procurement_items',
                        reference_id: dto.procurement_item_id,
                        metadata: {
                            procurement_id: dto.procurement_id,
                            procurement_item_id: dto.procurement_item_id,
                            added_serial: serialLabel,
                            updated_by: dto.updated_by,
                            source: 'bill_edit',
                        },
                        performed_by: dto.updated_by,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.LIFECYCLE,
                        event_type_id: null,
                    });
                });
                if (documentsChanged) {
                    const parseDocs = (val) => {
                        if (!val)
                            return [];
                        if (Array.isArray(val))
                            return val;
                        try {
                            return JSON.parse(val);
                        }
                        catch {
                            return [];
                        }
                    };
                    const oldDocs = parseDocs(existingProcurement.documents);
                    const newDocs = parseDocs(dto.documents);
                    const added = newDocs.filter((d) => !oldDocs.some((o) => o.path === d.path));
                    const removed = oldDocs.filter((o) => !newDocs.some((d) => d.path === o.path));
                    if (added.length > 0 || removed.length > 0) {
                        const docLines = [];
                        added.forEach((d) => docLines.push(`  + Added: ${d.name}`));
                        removed.forEach((d) => docLines.push(`  - Removed: ${d.name}`));
                        const affectedSerials = await manager
                            .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                            .find({
                            where: {
                                procurement_item_id: dto.procurement_item_id,
                                is_deleted: 0,
                            },
                            select: ['asset_stocks_unique_id'],
                        });
                        affectedSerials.forEach((s) => {
                            eventRows.push({
                                asset_id: dto.asset_id,
                                asset_stocks_unique_id: s.asset_stocks_unique_id,
                                title: 'Documents Updated',
                                description: `Bill documents updated by ${updatedByLabel}.\n` +
                                    docLines.join('\n'),
                                reference_table: 'asset_procurements',
                                reference_id: dto.procurement_id,
                                metadata: {
                                    procurement_id: dto.procurement_id,
                                    procurement_item_id: dto.procurement_item_id,
                                    updated_by: dto.updated_by,
                                    docs_added: added.map((d) => d.name),
                                    docs_removed: removed.map((d) => d.name),
                                },
                                performed_by: dto.updated_by,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                                event_type_id: null,
                            });
                        });
                    }
                }
                if (eventRows.length > 0) {
                    await manager.getRepository(asset_events_entity_1.AssetEvent).insert(eventRows);
                }
                this.depViewService.scheduleRefresh(organizationID);
                this.stockSummaryRefresh.scheduleRefresh(organizationID);
                return {
                    message: 'Bill updated successfully',
                    procurement_id: dto.procurement_id,
                    procurement_item_id: dto.procurement_item_id,
                    is_serial_tracked: itemIsSerialTracked,
                    serials_removed: toRemove.length,
                    serials_added: insertedSerialIds.length,
                    stock_quantity: newStockQty,
                    changes_logged: Object.keys(changes),
                    updated_by: dto.updated_by,
                };
            }
            catch (error) {
                if (error instanceof common_1.HttpException)
                    throw error;
                throw new common_1.InternalServerErrorException(error.message || 'Bill update failed');
            }
        });
    }
    async uploadBillDocument(dto, files, userId, organizationID) {
        console.log('UploadBillDocumentDto', dto);
        return await this.dataSource.transaction(async (manager) => {
            try {
                const [existingProcurement, existingItem] = await Promise.all([
                    manager.getRepository(asset_procurements_entity_1.AssetProcurement).findOne({
                        where: { procurement_id: dto.procurement_id },
                    }),
                    manager.getRepository(asset_procurement_items_entity_1.AssetProcurementItem).findOne({
                        where: { procurement_item_id: dto.procurement_item_id },
                    }),
                ]);
                if (!existingProcurement)
                    throw new common_1.NotFoundException(`Procurement ${dto.procurement_id} not found`);
                if (!existingItem)
                    throw new common_1.NotFoundException(`Procurement item ${dto.procurement_item_id} not found`);
                const newDocMeta = (files ?? []).map((file) => ({
                    name: file.originalname,
                    path: `/uploads/billing_documents/${file.filename}`,
                    size: file.size,
                    type: file.mimetype,
                    uploadedDate: new Date(),
                }));
                if (newDocMeta.length === 0) {
                    throw new common_1.HttpException('No documents uploaded', common_1.HttpStatus.BAD_REQUEST);
                }
                await manager
                    .createQueryBuilder()
                    .update(asset_procurements_entity_1.AssetProcurement)
                    .set({
                    documents: JSON.stringify(newDocMeta),
                    updated_by: userId,
                })
                    .where('procurement_id = :id', { id: dto.procurement_id })
                    .execute();
                const procurementItems = await manager
                    .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                    .find({
                    where: { procurement_id: dto.procurement_id },
                    select: ['procurement_item_id'],
                });
                const procurementItemIds = procurementItems.map((i) => i.procurement_item_id);
                const affectedSerials = procurementItemIds.length
                    ? await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).find({
                        where: {
                            procurement_item_id: (0, typeorm_2.In)(procurementItemIds),
                            is_deleted: 0,
                        },
                        select: ['asset_stocks_unique_id'],
                    })
                    : [];
                const description = `${newDocMeta.length} document(s) uploaded: ${newDocMeta
                    .map((d) => d.name)
                    .join(', ')}`;
                const eventRows = [];
                if (affectedSerials.length > 0) {
                    affectedSerials.forEach((s) => {
                        eventRows.push({
                            asset_id: dto.asset_id,
                            asset_stocks_unique_id: s.asset_stocks_unique_id,
                            title: 'Billing Document Uploaded',
                            description,
                            reference_table: 'asset_procurements',
                            reference_id: dto.procurement_id,
                            metadata: {
                                procurement_id: dto.procurement_id,
                                updated_by: userId,
                                uploaded_files: newDocMeta.map((d) => ({
                                    name: d.name,
                                    path: d.path,
                                })),
                            },
                            performed_by: userId,
                            performed_at: new Date(),
                            created_at: new Date(),
                            event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                            event_type_id: null,
                        });
                    });
                }
                else {
                    eventRows.push({
                        asset_id: dto.asset_id,
                        asset_stocks_unique_id: null,
                        title: 'Billing Document Uploaded',
                        description,
                        reference_table: 'asset_procurements',
                        reference_id: dto.procurement_id,
                        metadata: {
                            procurement_id: dto.procurement_id,
                            updated_by: userId,
                            uploaded_files: newDocMeta.map((d) => ({
                                name: d.name,
                                path: d.path,
                            })),
                        },
                        performed_by: userId,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                        event_type_id: null,
                    });
                }
                await manager.getRepository(asset_events_entity_1.AssetEvent).insert(eventRows);
                return {
                    status: common_1.HttpStatus.OK,
                    message: 'Document(s) uploaded successfully',
                    data: {
                        documents: newDocMeta,
                    },
                };
            }
            catch (error) {
                console.error('Error uploading bill document:', error);
                throw error;
            }
        });
    }
    async updateWarranty(dto, organizationID) {
        return await this.dataSource.transaction(async (manager) => {
            try {
                const toNull = (val) => val === '' || val === undefined ? null : val;
                const normalize = (val) => {
                    if (val === '' || val === undefined || val === null)
                        return null;
                    if (Array.isArray(val))
                        return JSON.stringify(val);
                    const n = Number(val);
                    if (!isNaN(n) && val !== true && val !== false)
                        return n;
                    return val;
                };
                const repo = manager.getRepository(asset_warranty_details_entity_1.AssetWarrantyDetailsRepository);
                let existing = await repo.findOne({
                    where: { asset_stocks_unique_id: dto.asset_stocks_unique_id },
                });
                const isNew = !existing;
                const changes = {};
                const trackChange = (field, oldVal, newVal) => {
                    if (newVal === undefined)
                        return;
                    const o = normalize(oldVal);
                    const n = normalize(newVal);
                    if (String(o ?? '') !== String(n ?? '')) {
                        changes[field] = { old: o, new: n };
                    }
                };
                const fields = [
                    'warranty_category',
                    'warranty_in_year',
                    'warranty_duration_type',
                    'warranty_start_date',
                    'warranty_end_date',
                    'support_type',
                    'support_contract',
                    'contract_number',
                    'amc_vendor',
                    'amc_frequency',
                    'last_service_date',
                    'next_service_due_date',
                ];
                fields.forEach((f) => trackChange(f, existing ? existing[f] : null, dto[f]));
                if (Object.keys(changes).length === 0) {
                    return {
                        message: 'No changes detected',
                        asset_stocks_unique_id: dto.asset_stocks_unique_id,
                        changes_logged: [],
                    };
                }
                const update = {};
                fields.forEach((f) => {
                    if (dto[f] !== undefined)
                        update[f] = toNull(dto[f]);
                });
                if (isNew) {
                    await repo.insert({
                        asset_stocks_unique_id: dto.asset_stocks_unique_id,
                        asset_id: dto.asset_id,
                        stock_id: dto.stock_id,
                        asset_item_id: dto.asset_item_id,
                        procurement_id: dto.procurement_id,
                        ...update,
                    });
                }
                else {
                    await repo.update({ asset_stocks_unique_id: dto.asset_stocks_unique_id }, update);
                }
                const fieldLabels = {
                    warranty_category: 'Warranty Category',
                    warranty_in_year: 'Warranty Duration (Years)',
                    warranty_duration_type: 'Warranty Duration Type',
                    warranty_start_date: 'Warranty Start Date',
                    warranty_end_date: 'Warranty End Date',
                    support_type: 'Support Type',
                    support_contract: 'Support Contract',
                    contract_number: 'Contract Number',
                    amc_vendor: 'AMC Vendor',
                    amc_frequency: 'AMC Frequency',
                    last_service_date: 'Last Service Date',
                    next_service_due_date: 'Next Service Due Date',
                };
                const updaterUser = await manager.getRepository(organizational_user_entity_1.User).findOne({
                    where: { user_id: dto.updated_by },
                    select: ['user_id', 'first_name', 'last_name'],
                });
                const updatedByLabel = updaterUser
                    ? `${updaterUser.first_name} ${updaterUser.last_name}`.trim()
                    : dto.updated_by
                        ? `User #${dto.updated_by}`
                        : 'System';
                const changeLines = Object.entries(changes).map(([field, value]) => {
                    const label = fieldLabels[field] || field;
                    const oldVal = value.old !== null ? value.old : '(empty)';
                    const newVal = value.new !== null ? value.new : '(empty)';
                    return isNew
                        ? `  • ${label}: ${newVal}`
                        : `  • ${label}: ${oldVal} → ${newVal}`;
                });
                const description = isNew
                    ? `Warranty details added by ${updatedByLabel}.\nFields set:\n${changeLines.join('\n')}`
                    : `Warranty details updated by ${updatedByLabel}.\nChanged fields:\n${changeLines.join('\n')}`;
                const event = {
                    asset_id: dto.asset_id,
                    asset_stocks_unique_id: dto.asset_stocks_unique_id,
                    title: isNew ? 'Warranty Added' : 'Warranty Updated',
                    description,
                    reference_table: 'asset_warranty_details',
                    reference_id: dto.asset_stocks_unique_id,
                    metadata: {
                        asset_stocks_unique_id: dto.asset_stocks_unique_id,
                        updated_by: dto.updated_by,
                        changes,
                    },
                    performed_by: dto.updated_by,
                    performed_at: new Date(),
                    created_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                    event_type_id: null,
                };
                await manager.getRepository(asset_events_entity_1.AssetEvent).insert(event);
                this.depViewService.scheduleRefresh(organizationID);
                return {
                    message: 'Warranty updated successfully',
                    asset_stocks_unique_id: dto.asset_stocks_unique_id,
                    changes_logged: Object.keys(changes),
                    updated_by: dto.updated_by,
                };
            }
            catch (error) {
                if (error instanceof common_1.HttpException)
                    throw error;
                throw new common_1.InternalServerErrorException(error.message || 'Warranty update failed');
            }
        });
    }
    async updateSubscription(dto, organizationID) {
        console.log('UpdateSubscriptionDto', dto);
        return await this.dataSource.transaction(async (manager) => {
            try {
                const toNull = (val) => val === '' || val === undefined ? null : val;
                const normalize = (val) => {
                    if (val === '' || val === undefined || val === null)
                        return null;
                    if (Array.isArray(val))
                        return JSON.stringify(val);
                    const n = Number(val);
                    if (!isNaN(n) && val !== true && val !== false)
                        return n;
                    return val;
                };
                if (!dto.procurement_id) {
                    throw new common_1.HttpException('procurement_id is required', common_1.HttpStatus.BAD_REQUEST);
                }
                const repo = manager.getRepository(asset_procurements_entity_1.AssetProcurement);
                const existing = await repo.findOne({
                    where: { procurement_id: dto.procurement_id },
                });
                if (!existing) {
                    throw new common_1.NotFoundException(`Procurement ${dto.procurement_id} not found`);
                }
                const changes = {};
                const trackChange = (field, oldVal, newVal) => {
                    if (newVal === undefined)
                        return;
                    const o = normalize(oldVal);
                    const n = normalize(newVal);
                    if (String(o ?? '') !== String(n ?? '')) {
                        changes[field] = { old: o, new: n };
                    }
                };
                const fields = [
                    'warranty_category',
                    'sub_start_date',
                    'next_renewal_date',
                    'subscription_type',
                    'billing_frequency',
                ];
                fields.forEach((f) => trackChange(f, existing[f], dto[f]));
                if (Object.keys(changes).length === 0) {
                    return {
                        message: 'No changes detected',
                        procurement_id: dto.procurement_id,
                        changes_logged: [],
                    };
                }
                const update = {};
                fields.forEach((f) => {
                    if (dto[f] !== undefined)
                        update[f] = toNull(dto[f]);
                });
                await repo.update({ procurement_id: dto.procurement_id }, update);
                const fieldLabels = {
                    warranty_category: 'Category',
                    sub_start_date: 'Subscription Start Date',
                    next_renewal_date: 'Next Renewal Date',
                    subscription_type: 'Subscription Type',
                    billing_frequency: 'Billing Frequency',
                };
                const updaterUser = await manager.getRepository(organizational_user_entity_1.User).findOne({
                    where: { user_id: dto.updated_by },
                    select: ['user_id', 'first_name', 'last_name'],
                });
                const updatedByLabel = updaterUser
                    ? `${updaterUser.first_name} ${updaterUser.last_name}`.trim()
                    : dto.updated_by
                        ? `User #${dto.updated_by}`
                        : 'System';
                const changeLines = Object.entries(changes).map(([field, value]) => {
                    const label = fieldLabels[field] || field;
                    const oldVal = value.old !== null ? value.old : '(empty)';
                    const newVal = value.new !== null ? value.new : '(empty)';
                    return `  • ${label}: ${oldVal} → ${newVal}`;
                });
                const description = `Subscription details updated by ${updatedByLabel}.\nChanged fields:\n${changeLines.join('\n')}`;
                const procurementItems = await manager
                    .getRepository(asset_procurement_items_entity_1.AssetProcurementItem)
                    .find({
                    where: { procurement_id: dto.procurement_id },
                    select: ['procurement_item_id'],
                });
                const procurementItemIds = procurementItems.map((i) => i.procurement_item_id);
                const affectedSerials = procurementItemIds.length
                    ? await manager.getRepository(asset_stock_serials_entity_1.AssetStockSerials).find({
                        where: {
                            procurement_item_id: (0, typeorm_2.In)(procurementItemIds),
                            is_deleted: 0,
                        },
                        select: ['asset_stocks_unique_id'],
                    })
                    : [];
                const eventRows = [];
                if (affectedSerials.length > 0) {
                    affectedSerials.forEach((s) => {
                        eventRows.push({
                            asset_id: dto.asset_id,
                            asset_stocks_unique_id: s.asset_stocks_unique_id,
                            title: 'Subscription Updated',
                            description,
                            reference_table: 'asset_procurements',
                            reference_id: dto.procurement_id,
                            metadata: {
                                procurement_id: dto.procurement_id,
                                updated_by: dto.updated_by,
                                changes,
                            },
                            performed_by: dto.updated_by,
                            performed_at: new Date(),
                            created_at: new Date(),
                            event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                            event_type_id: null,
                        });
                    });
                }
                else {
                    eventRows.push({
                        asset_id: dto.asset_id,
                        asset_stocks_unique_id: dto.asset_stocks_unique_id,
                        title: 'Subscription Updated',
                        description,
                        reference_table: 'asset_procurements',
                        reference_id: dto.procurement_id,
                        metadata: {
                            procurement_id: dto.procurement_id,
                            updated_by: dto.updated_by,
                            changes,
                        },
                        performed_by: dto.updated_by,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.FINANCIAL,
                        event_type_id: null,
                    });
                }
                await manager.getRepository(asset_events_entity_1.AssetEvent).insert(eventRows);
                this.depViewService.scheduleRefresh(organizationID);
                return {
                    message: 'Subscription updated successfully',
                    procurement_id: dto.procurement_id,
                    asset_stocks_unique_id: dto.asset_stocks_unique_id,
                    changes_logged: Object.keys(changes),
                    updated_by: dto.updated_by,
                };
            }
            catch (error) {
                if (error instanceof common_1.HttpException)
                    throw error;
                throw new common_1.InternalServerErrorException(error.message || 'Subscription update failed');
            }
        });
    }
    async deleteAssetImage(serialId, login_user_id, req) {
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Error decrypting schema name:', error.message);
            }
        }
        const queryRunner = this.assetStockSerialsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO ${fullSchemaName};`);
            if (!login_user_id || isNaN(Number(login_user_id))) {
                throw new Error('Invalid login user');
            }
            const user = await queryRunner.manager
                .createQueryBuilder()
                .select('user.user_id', 'user_id')
                .from(organizational_user_entity_1.User, 'user')
                .where('user.register_user_login_id = :id', { id: login_user_id })
                .andWhere('user.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('user.is_active = :isActive', { isActive: 1 })
                .getRawOne();
            const currentAsset = await queryRunner.manager
                .createQueryBuilder()
                .from(asset_stock_serials_entity_1.AssetStockSerials, 'asset')
                .where('asset.asset_stocks_unique_id = :id', { id: serialId })
                .getRawOne();
            if (!currentAsset) {
                throw new Error('Asset not found');
            }
            if (!currentAsset.asset_image) {
                throw new Error('No image to delete');
            }
            const filePath = path.join(process.cwd(), currentAsset.asset_image);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            catch (fileErr) {
                console.error('Error deleting asset image file:', fileErr.message);
            }
            await queryRunner.manager
                .createQueryBuilder()
                .update(asset_stock_serials_entity_1.AssetStockSerials)
                .set({
                asset_image: null,
                updated_by: Number(user.user_id),
            })
                .where('asset_stocks_unique_id = :id', { id: serialId })
                .execute();
            await this.assetEventsService.generateEvent(queryRunner.manager, {
                asset_id: currentAsset.asset_id,
                asset_stocks_unique_id: serialId,
                event_category: asset_events_entity_1.AssetEventCategory.UPDATE,
                performed_by: user.user_id,
                reference_table: 'asset_stock_serials',
                reference_id: serialId,
                metadata: {
                    field: 'asset_image',
                },
                title: `Asset image removed`,
                description: `Asset image was removed`,
                event_type_id: null,
                created_at: new Date(),
            });
            await queryRunner.commitTransaction();
            return {
                status: common_1.HttpStatus.OK,
                message: 'Asset image deleted successfully',
                data: {
                    asset_image: null,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error deleting asset image:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.StocksService = StocksService;
exports.StocksService = StocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => asset_data_service_1.AssetDataService))),
    __param(6, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(7, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(8, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_procurement_items_entity_1.AssetProcurementItem)),
    __param(10, (0, typeorm_1.InjectRepository)(asset_procurements_entity_1.AssetProcurement)),
    __param(11, (0, typeorm_1.InjectRepository)(asset_warranty_details_entity_1.AssetWarrantyDetailsRepository)),
    __param(12, (0, typeorm_1.InjectRepository)(asset_transfer_history_entity_1.AssetTransferHistory)),
    __param(13, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(14, (0, typeorm_1.InjectRepository)(organizational_vendors_entity_1.OrganizationVendors)),
    __param(15, (0, typeorm_1.InjectRepository)(item_licence_type_entity_1.ItemLicenceType)),
    __param(16, (0, typeorm_1.InjectRepository)(asset_item_entity_1.AssetItem)),
    __param(17, (0, typeorm_1.InjectRepository)(v_asset_stock_serials_view_entity_1.AssetStockSerialsView)),
    __param(18, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(19, (0, typeorm_1.InjectRepository)(asset_field_category_entity_1.AssetFieldCategory)),
    __param(20, (0, typeorm_1.InjectRepository)(view_asset_stock_details_1.AssetAllStockDetailsView)),
    __param(21, (0, typeorm_1.InjectRepository)(asset_softwares_1.AssetSoftwaresView)),
    __param(22, (0, typeorm_1.InjectRepository)(perpetual_softwares_1.PerpetualSoftwaresView)),
    __param(23, (0, typeorm_1.InjectRepository)(asset_procurements_entity_1.AssetProcurement)),
    __param(24, (0, typeorm_1.InjectRepository)(special_permission_master_1.SpecialPermissionsMaster)),
    __param(25, (0, typeorm_1.InjectRepository)(policy_attribute_entity_1.PolicyAttribute)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        asset_events_service_1.AssetEventsService,
        redis_service_1.RedisService,
        asset_data_service_1.AssetDataService,
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
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_helper_1.NotificationHelper,
        asset_depreciation_service_1.DepreciationViewService,
        stock_summary_refresh_service_1.StockSummaryRefreshService,
        request_context_service_1.RequestContextService,
        dropdown_cache_service_1.DropdownCacheService])
], StocksService);
