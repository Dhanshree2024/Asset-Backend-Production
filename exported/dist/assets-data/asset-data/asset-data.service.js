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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bwip_js_1 = __importDefault(require("bwip-js"));
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const asset_id_settings_entity_1 = require("../../organizational-profile/entity/asset-id-settings.entity");
const branches_entity_1 = require("../../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const orgnization_stats_entity_1 = require("../../organizational-profile/entity/orgnization-stats.entity");
const qr_code_settings_entity_1 = require("../../organizational-profile/entity/qr-code-settings.entity");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_field_category_entity_1 = require("../asset-fields/entities/asset-field-category.entity");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_ownership_status_entity_1 = require("../asset-ownership-status/entities/asset-ownership-status.entity");
const asset_subcategory_entity_1 = require("../asset-subcategories/entities/asset-subcategory.entity");
const asset_working_status_entity_1 = require("../asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../stocks/entities/stocks.entity");
const asset_datum_entity_1 = require("./entities/asset-datum.entity");
const manufacturer_entity_1 = require("./entities/manufacturer.entity");
const models_entity_1 = require("./entities/models.entity");
const asset_depreciation_service_1 = require("../../asset-depreciation/asset-depreciation.service");
const stock_summary_refresh_service_1 = require("../stocks/stock-summary-refresh.service");
const branch_access_1 = require("../../branch-access/branch-access");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
const location_branch_mapping_entity_1 = require("../../organizational-profile/entity/location-branch-mapping.entity");
const asset_cost_center_entity_1 = require("../asset-cost-center/entities/asset-cost-center.entity");
const asset_item_enums_1 = require("../asset-items/entities/asset-item.enums");
const item_manufacturer_map_1 = require("../asset-items/entities/item-manufacturer-map");
const assets_project_entity_1 = require("../assets-projects/entities/assets-project.entity");
const asset_procurement_items_entity_1 = require("../stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../stocks/entities/asset_procurements.entity");
const asset_warranty_details_entity_1 = require("../stocks/entities/asset_warranty_details.entity");
const v_asset_stock_serials_view_entity_1 = require("../stocks/entities/v-asset-stock-serials-view.entity");
let AssetDataService = class AssetDataService {
    constructor(assetDataRepository, dataSource, assetFieldCategoryRepository, assetCategoryRepository, orgStatRepository, assetMappingRepository, stockRepository, userRepository, assetStockSerialsRepository, assetStockViewRepo, assetProcurementItemRepo, locationBranchMappingRepo, qrCodeSettingRepo, branchRepository, assetItemRepository, subCategoryRepository, departmentRepository, locationRepository, AssetOwnershipRepository, assetWorkingStatusRepository, modelRepository, manufacturerRepository, itemManufacturerRepository, assetCostCenterRepo, assetsProjectRepo, AssetWarrantyDetailsRepository, locationBranchMappingRepository, AssetProcurement, depViewService, notificationHelper, stockSummaryRefresh, dropdownCache) {
        this.assetDataRepository = assetDataRepository;
        this.dataSource = dataSource;
        this.assetFieldCategoryRepository = assetFieldCategoryRepository;
        this.assetCategoryRepository = assetCategoryRepository;
        this.orgStatRepository = orgStatRepository;
        this.assetMappingRepository = assetMappingRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.assetStockViewRepo = assetStockViewRepo;
        this.assetProcurementItemRepo = assetProcurementItemRepo;
        this.locationBranchMappingRepo = locationBranchMappingRepo;
        this.qrCodeSettingRepo = qrCodeSettingRepo;
        this.branchRepository = branchRepository;
        this.assetItemRepository = assetItemRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.departmentRepository = departmentRepository;
        this.locationRepository = locationRepository;
        this.AssetOwnershipRepository = AssetOwnershipRepository;
        this.assetWorkingStatusRepository = assetWorkingStatusRepository;
        this.modelRepository = modelRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.itemManufacturerRepository = itemManufacturerRepository;
        this.assetCostCenterRepo = assetCostCenterRepo;
        this.assetsProjectRepo = assetsProjectRepo;
        this.AssetWarrantyDetailsRepository = AssetWarrantyDetailsRepository;
        this.locationBranchMappingRepository = locationBranchMappingRepository;
        this.AssetProcurement = AssetProcurement;
        this.depViewService = depViewService;
        this.notificationHelper = notificationHelper;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.dropdownCache = dropdownCache;
        this.assetFields = [
            { id: 'display_name', name: 'Display Name', required: true },
            { id: 'item_name', name: 'Item Name', required: true },
            { id: 'branch_name', name: 'Branch Name', required: true },
            { id: 'location_name', name: 'Location Name', required: true },
            { id: 'assigned_to_name', name: 'Assign To', required: true },
            { id: 'target_type', name: 'Assignee Type', required: true },
            { id: 'serial_number', name: 'Serial Number', required: true },
            { id: 'ownership_type', name: 'Ownership Type', required: false },
            { id: 'manufacturer', name: 'Manufacturer', required: false },
            { id: 'model_no', name: 'Model Number', required: false },
            { id: 'category', name: 'Category', required: false },
            { id: 'subcategory', name: 'Subcategory', required: false },
            { id: 'cost_center', name: 'Cost Center', required: false },
            { id: 'project', name: 'Project', required: false },
        ];
    }
    async resolveManufacturer(dto, manager) {
        if (dto.manufacturer_id)
            return dto.manufacturer_id;
        if (!dto.manufacturer?.trim())
            return null;
        const repo = manager.getRepository(manufacturer_entity_1.Manufacturer);
        let manufacturer = await repo.findOne({
            where: { manufacturer_name: dto.manufacturer.trim() },
        });
        if (!manufacturer) {
            manufacturer = repo.create({
                manufacturer_name: dto.manufacturer.trim(),
            });
            manufacturer = await repo.save(manufacturer);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MANUFACTURER);
        }
        return manufacturer.manufacturer_id;
    }
    async resolveModel(dto, manufacturerId, manager) {
        if (dto.model_id)
            return dto.model_id;
        if (!dto.model?.trim())
            return null;
        const repo = manager.getRepository(models_entity_1.Models);
        let model = await repo.findOne({
            where: {
                model_name: dto.model.trim(),
                manufacturer_id: manufacturerId,
            },
        });
        if (!model) {
            model = repo.create({
                model_name: dto.model.trim(),
                manufacturer_id: manufacturerId,
            });
            model = await repo.save(model);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MODEL);
        }
        return model.model_id;
    }
    async addAsset(createAssetDatumDto, organizationId, userId, schema) {
        console.log('📥 Received DTO:', createAssetDatumDto);
        console.log('🏢 Organization ID:', organizationId);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (typeof schema === 'string' && /^org_[A-Za-z0-9_]+$/.test(schema)) {
                await queryRunner.query(`SET LOCAL search_path TO "${schema}", public`);
            }
            const manager = queryRunner.manager;
            const item = await manager.getRepository(asset_item_entity_1.AssetItem).findOne({
                where: { asset_item_id: createAssetDatumDto.asset_item_id },
                select: ['main_category_id', 'sub_category_id'],
            });
            if (!item)
                throw new Error('Asset item not found.');
            createAssetDatumDto.asset_main_category_id = item.main_category_id;
            createAssetDatumDto.asset_sub_category_id = item.sub_category_id;
            const manufacturerPromise = this.resolveManufacturer(createAssetDatumDto, manager);
            const manufacturerId = await manufacturerPromise;
            const modelPromise = this.resolveModel(createAssetDatumDto, manufacturerId, manager);
            const [modelId] = await Promise.all([modelPromise]);
            createAssetDatumDto.manufacturer_id = manufacturerId ?? null;
            createAssetDatumDto.model_id = modelId ?? null;
            createAssetDatumDto.manufacturer = null;
            const savedAssetResult = await manager
                .createQueryBuilder()
                .insert()
                .into(asset_datum_entity_1.AssetDatum)
                .values(createAssetDatumDto)
                .returning('*')
                .execute();
            const savedAsset = savedAssetResult.raw[0];
            console.log('💾 Asset Saved:', savedAsset);
            const [totalCountNow, createdUser] = await Promise.all([
                manager
                    .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                    .createQueryBuilder('serial')
                    .where('serial.is_active = :isActive', { isActive: 1 })
                    .andWhere('serial.is_deleted = :isDeleted', { isDeleted: 0 })
                    .getCount(),
                manager.getRepository(organizational_user_entity_1.User).findOne({
                    where: { user_id: userId },
                    select: [
                        'user_id',
                        'first_name',
                        'last_name',
                        'users_business_email',
                    ],
                }),
            ]);
            this.recordMetric('total_assets', totalCountNow).catch(console.error);
            if (createdUser?.users_business_email) {
                setImmediate(() => {
                    this.notificationHelper
                        .triggerEventNotification({
                        eventId: 48,
                        contextData: {
                            assignment: { asset_title: savedAsset.asset_title },
                            updatedUser: {
                                created_by: `${createdUser.first_name || ''} ${createdUser.last_name || ''}`.trim(),
                            },
                        },
                        recipients: [
                            {
                                recipient_type: 'user',
                                recipient_id: String(createdUser.user_id),
                                recipient_email: createdUser.users_business_email,
                            },
                        ],
                        meta: { trace_id: `ASSET_${savedAsset.asset_id}` },
                    })
                        .catch(console.error);
                });
            }
            const softwareCategory = await manager
                .getRepository(asset_category_entity_1.AssetCategory)
                .createQueryBuilder('mc')
                .where('LOWER(mc.main_category_name) IN (:...names)', {
                names: ['software', 'softwares'],
            })
                .select(['mc.main_category_id'])
                .getOne();
            const isSoftware = softwareCategory?.main_category_id ===
                savedAsset.asset_main_category_id;
            const successMessage = isSoftware
                ? 'Software added successfully.'
                : 'Asset added successfully.';
            await queryRunner.commitTransaction();
            this.depViewService.scheduleRefresh(organizationId);
            this.stockSummaryRefresh.scheduleRefresh(organizationId);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MANUFACTURER);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MODEL);
            return {
                status: 'success',
                message: successMessage,
                data: savedAsset,
            };
        }
        catch (error) {
            console.error('❌ Error in addAsset, rolling back:', error);
            await queryRunner.rollbackTransaction();
            return {
                status: 'error',
                message: 'An error occurred while inserting the asset.',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async bulkAddAssets(createAssetDatumDtos, organizationId, userId) {
        console.log('Bulk asset payload size:', createAssetDatumDtos.length);
        if (!createAssetDatumDtos.length) {
            return {
                status: 'error',
                message: 'No assets provided.',
            };
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const itemIds = [
                ...new Set(createAssetDatumDtos.map((a) => a.asset_item_id)),
            ];
            const items = await queryRunner.manager
                .getRepository(asset_item_entity_1.AssetItem)
                .createQueryBuilder('item')
                .where('item.asset_item_id IN (:...itemIds)', { itemIds })
                .getMany();
            const itemMap = new Map(items.map((i) => [i.asset_item_id, i]));
            const insertRows = [];
            for (const dto of createAssetDatumDtos) {
                const item = itemMap.get(dto.asset_item_id);
                if (!item) {
                    console.warn(`⚠️ Asset item not found: ${dto.asset_item_id}`);
                    continue;
                }
                dto.asset_main_category_id = item.main_category_id;
                dto.asset_sub_category_id = item.sub_category_id;
                const manufacturerId = await this.resolveManufacturer(dto, queryRunner.manager);
                dto.manufacturer_id = manufacturerId ?? null;
                const modelId = await this.resolveModel(dto, manufacturerId, queryRunner.manager);
                dto.model_id = modelId ?? null;
                dto.manufacturer = null;
                insertRows.push(dto);
            }
            const insertResult = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(asset_datum_entity_1.AssetDatum)
                .values(insertRows)
                .returning('*')
                .execute();
            const savedAssets = insertResult.raw;
            const totalCountNow = await queryRunner.manager
                .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                .createQueryBuilder('serial')
                .where('serial.is_active = :isActive', { isActive: 1 })
                .andWhere('serial.is_deleted = :isDeleted', { isDeleted: 0 })
                .getCount();
            const createdUser = await queryRunner.manager
                .getRepository(organizational_user_entity_1.User)
                .createQueryBuilder('users')
                .where('users.user_id = :userId', { userId })
                .getOne();
            const contextData = {
                updatedUser: {
                    first_name: createdUser?.first_name,
                    last_name: createdUser?.last_name,
                },
                assetCount: {
                    quantity: savedAssets.length,
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
                eventId: 48,
                contextData,
                recipients,
                meta: {
                    trace_id: `ASSET_BULK_${Date.now()}`,
                },
            });
            await queryRunner.commitTransaction();
            this.depViewService.scheduleRefresh(organizationId);
            this.stockSummaryRefresh.scheduleRefresh(organizationId);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MANUFACTURER);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.MODEL);
            return {
                status: 'success',
                message: 'Assets added successfully.',
                data: savedAssets,
            };
        }
        catch (error) {
            console.error('❌ Error in bulkAddAssets:', error);
            await queryRunner.rollbackTransaction();
            return {
                status: 'error',
                message: 'An error occurred while inserting assets.',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async getManufacturerDropdown(itemType, assetItemId) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.MANUFACTURER, { itemType, assetItemId }, async () => {
            try {
                let mapped = [];
                if (assetItemId) {
                    const mappedData = await this.itemManufacturerRepository
                        .createQueryBuilder('im')
                        .leftJoinAndSelect('im.manufacturer', 'm')
                        .where('im.asset_item_id = :assetItemId', { assetItemId })
                        .getMany();
                    mapped = mappedData.map((m) => ({
                        manufacturer_id: m.manufacturer.manufacturer_id,
                        manufacturer_name: m.manufacturer.manufacturer_name,
                    }));
                }
                if (mapped.length === 1) {
                    return {
                        autoSelected: true,
                        manufacturer: mapped[0],
                        dropdown: [mapped[0]],
                    };
                }
                if (mapped.length > 1) {
                    return {
                        autoSelected: false,
                        manufacturer: null,
                        dropdown: mapped,
                    };
                }
                let dropdown = [];
                if (itemType === asset_item_enums_1.ItemType.VIRTUAL) {
                    dropdown = await this.manufacturerRepository.find({
                        select: ['manufacturer_id', 'manufacturer_name'],
                        where: { item_type: asset_item_enums_1.ItemType.VIRTUAL },
                        order: { manufacturer_name: 'ASC' },
                    });
                }
                else {
                    dropdown = await this.manufacturerRepository.find({
                        select: ['manufacturer_id', 'manufacturer_name'],
                        where: { item_type: (0, typeorm_2.IsNull)() },
                        order: { manufacturer_name: 'ASC' },
                    });
                    if (!dropdown.length) {
                        dropdown = await this.manufacturerRepository
                            .createQueryBuilder('m')
                            .select(['m.manufacturer_id', 'm.manufacturer_name'])
                            .where('(m.item_type IS NULL OR m.item_type = :physical)', {
                            physical: asset_item_enums_1.ItemType.PHYSICAL,
                        })
                            .orderBy('m.manufacturer_name', 'ASC')
                            .getMany();
                    }
                }
                return {
                    autoSelected: false,
                    manufacturer: null,
                    dropdown,
                };
            }
            catch (error) {
                console.error('Error in getManufacturerDropdown:', error);
                throw new Error('Error fetching manufacturer dropdown.');
            }
        });
    }
    async getModelByManufacturer(manufacturer_id) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.MODEL, { manufacturerId: manufacturer_id }, async () => {
            try {
                const query = this.modelRepository
                    .createQueryBuilder('model')
                    .select([
                    'model.model_id',
                    'model.model_name',
                    'model.manufacturer_id',
                ]);
                if (manufacturer_id) {
                    query.andWhere('model.manufacturer_id = :manufacturer_id', {
                        manufacturer_id,
                    });
                }
                return await query.orderBy('model.model_name', 'ASC').getMany();
            }
            catch (error) {
                console.error('Error in getModelByManufacturer:', error);
                throw new Error('Error fetching models.');
            }
        });
    }
    async filterAssets(filters, branchIds = []) {
        const { category = ['All'], subCategory = ['All'], item = ['All'], asset = ['All'], status = ['All'], users = ['All'], location = ['All'], ownershipStatus = ['All'], workingStatus = ['All'], } = filters;
        const normalizeIds = (val) => {
            if (!val || (Array.isArray(val) && val.includes('All')))
                return ['All'];
            const flat = Array.isArray(val) ? val.flat() : [val];
            return flat.map((v) => (isNaN(Number(v)) ? v : Number(v)));
        };
        const _category = normalizeIds(category);
        const _subCategory = normalizeIds(subCategory);
        const _item = normalizeIds(item);
        const _asset = normalizeIds(asset);
        const _status = normalizeIds(status);
        const _users = normalizeIds(users);
        const _location = normalizeIds(location);
        const _ownershipStatus = normalizeIds(ownershipStatus);
        const _workingStatus = normalizeIds(workingStatus);
        let mappedSerialIds = null;
        if (!_users.includes('All')) {
            const mappings = await this.assetMappingRepository
                .createQueryBuilder('m')
                .select('DISTINCT m.asset_stocks_unique_id', 'serial_id')
                .where('m.target_type = :type', { type: 'USER' })
                .andWhere('m.target_id IN (:...uids)', { uids: _users })
                .andWhere('m.is_deleted = 0')
                .getRawMany();
            mappedSerialIds = mappings.map((m) => m.serial_id);
            if (mappedSerialIds.length === 0) {
                mappedSerialIds = [-1];
            }
        }
        const qb = this.assetDataRepository
            .createQueryBuilder('a')
            .where('a.asset_is_deleted = 0');
        if (!_category.includes('All')) {
            qb.andWhere('a.asset_main_category_id IN (:...cat)', { cat: _category });
        }
        if (!_subCategory.includes('All')) {
            qb.andWhere('a.asset_sub_category_id IN (:...sub)', {
                sub: _subCategory,
            });
        }
        if (!_item.includes('All')) {
            qb.andWhere('a.asset_item_id IN (:...it)', { it: _item });
        }
        if (!_asset.includes('All')) {
            qb.andWhere('a.asset_id IN (:...aid)', { aid: _asset });
        }
        if (!_status.includes('All')) {
            qb.andWhere('a.asset_is_active IN (:...stat)', { stat: _status });
        }
        const assets = await qb.getMany();
        const assetIds = assets.map((a) => a.asset_id);
        let serials = [];
        console.log('serials vk', serials);
        if (assetIds.length > 0) {
            const serialQB = this.assetStockSerialsRepository
                .createQueryBuilder('s')
                .leftJoin('stocks', 'st', 'st.stock_id = s.stock_id')
                .leftJoin('location_branch_mapping', 'loc', 'loc.location_mapping_id = st.location_id')
                .leftJoin('asset_locations', 'al', 'al.location_id = loc.location_id')
                .leftJoin('asset_procurement_items', 'pi', `(
            pi.procurement_item_id = s.procurement_item_id
            OR
            (s.procurement_item_id IS NULL AND pi.asset_id = s.asset_id)
          )`)
                .leftJoin('asset_procurements', 'p', 'p.procurement_id = pi.procurement_id')
                .leftJoin('asset_mapping', 'm', 'm.asset_stocks_unique_id = s.asset_stocks_unique_id AND m.is_deleted = 0')
                .where('s.asset_id IN (:...ids)', { ids: assetIds })
                .andWhere('s.is_deleted = 0')
                .select([
                's.asset_stocks_unique_id AS asset_stocks_unique_id',
                's.asset_serial_title AS asset_serial_title',
                's.asset_id AS asset_id',
                's.stock_serials AS stock_serials',
                's.system_code AS system_code',
                's.stock_id AS stock_id',
                'al.location_name AS location_name',
            ]);
            if (branchIds.length > 0) {
                (0, branch_access_1.applyBranchFilter)({ qb: serialQB, entityKey: 'Stock', branchIds });
            }
            if (mappedSerialIds) {
                serialQB.andWhere('s.asset_stocks_unique_id IN (:...mapped)', {
                    mapped: mappedSerialIds,
                });
            }
            if (!_location.includes('All')) {
                serialQB.andWhere('loc.location_mapping_id IN (:...loc)', {
                    loc: _location,
                });
            }
            if (!_asset.includes('All')) {
                serialQB.andWhere('s.asset_id IN (:...aid)', { aid: _asset });
            }
            if (!_ownershipStatus.includes('All')) {
                serialQB.andWhere('p.ownership_status_id IN (:...own)', {
                    own: _ownershipStatus,
                });
            }
            if (!_workingStatus.includes('All')) {
                serialQB.andWhere('s.working_status_type_id IN (:...work)', {
                    work: _workingStatus,
                });
            }
            serials = await serialQB.getRawMany();
        }
        const allSerialsQb = this.assetStockSerialsRepository
            .createQueryBuilder('s')
            .leftJoin('stocks', 'st', 'st.stock_id = s.stock_id')
            .leftJoin('location_branch_mapping', 'loc', 'loc.location_mapping_id = st.location_id')
            .leftJoin('asset_locations', 'al', 'al.location_id = loc.location_id')
            .where('s.is_deleted = 0')
            .select(['s.asset_id', 's.asset_serial_title']);
        if (branchIds.length > 0) {
            (0, branch_access_1.applyBranchFilter)({
                qb: allSerialsQb,
                entityKey: 'Stock',
                branchIds,
            });
        }
        console.log('ALL SERIAL SQL =>', allSerialsQb.getSql());
        const allSerialsForDropdown = await allSerialsQb.getMany();
        console.log('allSerialsForDropdown =>', allSerialsForDropdown);
        console.log('allSerialsForDropdown', allSerialsForDropdown);
        const assetMap = new Map();
        allSerialsForDropdown.forEach((s) => {
            if (!assetMap.has(s.asset_id) && s.asset_serial_title) {
                assetMap.set(s.asset_id, {
                    value: String(s.asset_id),
                    label: s.asset_serial_title,
                });
            }
        });
        const assetsDropdown = Array.from(assetMap.values());
        const userQb = this.userRepository
            .createQueryBuilder('user')
            .where('user.is_active = :isActive', { isActive: 1 })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: 0 });
        (0, branch_access_1.applyBranchFilter)({ qb: userQb, entityKey: 'User', branchIds });
        const usersList = await userQb.getMany();
        const locationQb = this.locationBranchMappingRepository
            .createQueryBuilder('location_branch_mapping')
            .leftJoinAndSelect('location_branch_mapping.location', 'location')
            .leftJoinAndSelect('location_branch_mapping.branch', 'branch')
            .where('location_branch_mapping.is_active = :isActive', { isActive: 1 })
            .andWhere('location_branch_mapping.is_deleted = :isDeleted', {
            isDeleted: 0,
        });
        (0, branch_access_1.applyBranchFilter)({
            qb: locationQb,
            entityKey: 'LocationBranch',
            branchIds,
        });
        const locations = await locationQb.getMany();
        const workingStatuses = await this.assetWorkingStatusRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        const ownershipStatuses = await this.AssetOwnershipRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        return {
            assets: assetsDropdown,
            users: usersList.map((u) => ({
                value: u.user_id,
                label: `${[u.first_name, u.last_name]
                    .filter(v => v && v.toLowerCase() !== 'null')
                    .join(' ')} (${u.users_business_email})`
            })),
            locations: locations.map((l) => ({
                value: String(l.location_mapping_id),
                label: l.location?.location_name,
                location_floor: l.location?.location_floor,
                location_room: l.location?.location_room,
                branch_name: l.branch?.branch_name || null,
                location_id: l.location_id,
                location_mapping_id: l.location_mapping_id,
            })),
            workingStatus: workingStatuses.map((w) => ({
                value: String(w.working_status_type_id),
                label: w.working_status_type_name,
            })),
            ownershipStatus: ownershipStatuses.map((o) => ({
                value: String(o.ownership_status_type_id),
                label: o.ownership_status_type_name,
            })),
            serialNumbers: serials.map((s) => ({
                value: s.asset_stocks_unique_id,
                label: s.asset_serial_title ?? '',
                asset_id: s.asset_id,
                stock_id: s.stock_id,
                system_code: s.system_code,
            })),
        };
    }
    async getFilters(branchIds = []) {
        const userQb = this.userRepository
            .createQueryBuilder('user')
            .where('user.is_active = :isActive', { isActive: 1 })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: 0 });
        (0, branch_access_1.applyBranchFilter)({
            qb: userQb,
            entityKey: 'User',
            branchIds,
        });
        const usersList = await userQb.getMany();
        const locationQb = this.locationRepository
            .createQueryBuilder('asset_locations')
            .leftJoinAndSelect('asset_locations.branch', 'branch')
            .where('asset_locations.is_active = :isActive', { isActive: 1 })
            .andWhere('asset_locations.is_deleted = :isDeleted', { isDeleted: 0 });
        (0, branch_access_1.applyBranchFilter)({
            qb: locationQb,
            entityKey: 'Locations',
            branchIds,
        });
        const locations = await locationQb.getMany();
        const [workingStatuses, ownershipStatuses] = await Promise.all([
            this.assetWorkingStatusRepository
                .createQueryBuilder('ws')
                .where('ws.is_active = :isActive', { isActive: 1 })
                .andWhere('ws.is_deleted = :isDeleted', { isDeleted: 0 })
                .getMany(),
            this.AssetOwnershipRepository.createQueryBuilder('os')
                .where('os.is_active = :isActive', { isActive: 1 })
                .andWhere('os.is_deleted = :isDeleted', { isDeleted: 0 })
                .getMany(),
        ]);
        return {
            users: usersList.map((u) => ({
                value: u.user_id,
                label: `${u.first_name} ${u.last_name} (${u.users_business_email})`,
            })),
            locations: locations.map((l) => ({
                value: String(l.location_id),
                label: l.location_name,
                location_floor: l.location_floor,
                location_room: l.location_room,
                branch_name: l.branch?.branch_name || null,
            })),
            workingStatus: workingStatuses.map((w) => ({
                value: String(w.working_status_type_id),
                label: w.working_status_type_name,
            })),
            ownershipStatus: ownershipStatuses.map((o) => ({
                value: String(o.ownership_status_type_id),
                label: o.ownership_status_type_name,
            })),
        };
    }
    async exportFilteredExcelForAssets(data) {
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Assets');
        const headers = [
            'Sr. No.',
            'Asset Title',
            'Manufacturer',
            'Model No.',
            'Total Stock',
            'Assigned Quantity',
            'Available Quantity',
            'Added By',
        ];
        headers.forEach((header, colIndex) => {
            sheet
                .cell(1, colIndex + 1)
                .value(header)
                .style({
                bold: true,
                fill: 'CCE5FF',
                horizontalAlignment: 'center',
                border: true,
            });
        });
        data.forEach((asset, index) => {
            const assignedQty = asset.total_asset_assigned || 0;
            const totalQty = asset.stock?.total_available_quantity || 0;
            const availableQty = totalQty - assignedQty;
            const row = [
                index + 1,
                asset.asset_title || '',
                asset.manufacturer || '',
                asset.model_no || '',
                totalQty,
                assignedQty,
                availableQty,
                asset.added_by_user
                    ? `${asset.added_by_user.first_name} ${asset.added_by_user.last_name}`
                    : '',
            ];
            row.forEach((value, colIndex) => {
                sheet
                    .cell(index + 2, colIndex + 1)
                    .value(value)
                    .style({ border: true });
            });
        });
        headers.forEach((_, i) => {
            const col = sheet.column(i + 1);
            col.width(Math.max(15, headers[i].length + 5));
        });
        sheet.freezePanes(2, 1);
        return await workbook.outputAsync();
    }
    async exportCSVData(asset_main_category_id, asset_sub_category_id, asset_item_id, searchQuery) {
        try {
            let whereCondition;
            if (asset_main_category_id.toString() != '') {
                whereCondition = {
                    asset_is_active: 1,
                    asset_is_deleted: 0,
                    asset_main_category_id: asset_main_category_id.toString(),
                };
                if (asset_sub_category_id.toString() != '') {
                    whereCondition = {
                        asset_is_active: 1,
                        asset_is_deleted: 0,
                        asset_main_category_id: asset_main_category_id.toString(),
                        asset_sub_category_id: asset_sub_category_id.toString(),
                    };
                    if (asset_item_id.toString() != '') {
                        whereCondition = {
                            asset_is_active: 1,
                            asset_is_deleted: 0,
                            asset_main_category_id: asset_main_category_id.toString(),
                            asset_sub_category_id: asset_sub_category_id.toString(),
                            asset_item_id: asset_item_id.toString(),
                        };
                    }
                }
            }
            else {
                whereCondition = { asset_is_active: 1, asset_is_deleted: 0 };
            }
            if (searchQuery && searchQuery.trim() !== '') {
                whereCondition['asset_title'] = (0, typeorm_2.ILike)(`%${searchQuery}%`);
            }
            const [results, total] = await this.assetDataRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.main_category', 'main_category')
                .leftJoinAndSelect('asset.sub_category', 'sub_category')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('asset.assigned_quantity', 'assigned_quantity')
                .leftJoinAndSelect('asset.added_by_user', 'added_by_user')
                .where(whereCondition)
                .orderBy('asset.asset_id', 'DESC')
                .getManyAndCount();
            console.log('RESULT ASSET CSV', results);
            const decodedResults = results.map((asset) => {
                try {
                    const retunArray = {
                        ...asset,
                        asset_main_category_name: asset.main_category?.main_category_name || 'N/A',
                        asset_sub_category_name: asset.sub_category?.sub_category_name || 'N/A',
                    };
                    return retunArray;
                }
                catch (error) {
                    console.error('Error decoding asset_information_fields:', error);
                    return asset;
                }
            });
            const uniqueAssetFields = [];
            const uniqueAssetFielIDS = [];
            decodedResults.forEach((asset) => {
            });
            return {
                decodedResults: decodedResults,
                uniqueAssetFields: uniqueAssetFields,
            };
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async countAll() {
        try {
            const totalCount = await this.assetDataRepository.count({
                where: {
                    asset_is_active: 1,
                    asset_is_deleted: 0,
                },
            });
            const unusedCount = await this.assetDataRepository
                .createQueryBuilder('asset')
                .where('asset.asset_is_active = :active', { active: 1 })
                .andWhere('asset.asset_is_deleted = :deleted', { deleted: 0 })
                .getCount();
            const usedCount = totalCount - unusedCount;
            console.log('counts', totalCount, usedCount);
            return { totalCount, unusedCount, usedCount };
        }
        catch (error) {
            console.error('Error in countAll:', error);
            throw new Error('An error occurred while fetching asset counts.');
        }
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
    async updateAssetInfo(updateAssetDatumDto) {
        try {
            const { asset_id, ...updateData } = updateAssetDatumDto;
            if (!asset_id) {
                throw new Error('Asset ID is required for updating.');
            }
            const existingAsset = await this.assetDataRepository.findOneBy({
                asset_id: asset_id,
            });
            if (!existingAsset) {
                throw new Error('Asset not found for updating.');
            }
            Object.assign(existingAsset, updateData);
            const updatedAsset = await this.assetDataRepository.save(existingAsset);
            return updatedAsset;
        }
        catch (error) {
            console.error('Error in insert:', error);
            throw new Error('An error occurred while inserting the item.');
        }
    }
    async findSingleAsset(asset_id, asset_stocks_unique_id, stock_id, req) {
        const schemaName = req?.cookies?.['x-organization-schema'];
        console.log('schemaName:001', schemaName);
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Schema decrypt error:', error.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO "${fullSchemaName}", public;`);
            const assetData = await queryRunner.manager
                .getRepository(asset_datum_entity_1.AssetDatum)
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.main_category', 'main_category')
                .leftJoinAndSelect('asset.sub_category', 'sub_category')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('asset.added_by_user', 'added_by_user')
                .leftJoinAndSelect('asset.manufacturer_name', 'manufacturer')
                .leftJoinAndSelect('asset.model_name', 'model')
                .where('asset.asset_id = :asset_id', { asset_id })
                .getOne();
            if (!assetData) {
                throw new Error('Asset not found');
            }
            const stocks = await queryRunner.manager
                .getRepository(stocks_entity_1.Stock)
                .createQueryBuilder('stock')
                .leftJoinAndSelect('stock.location', 'location')
                .leftJoinAndSelect('location.branch', 'branch')
                .where('stock.asset_id = :asset_id', { asset_id })
                .getMany();
            const serialData = await queryRunner.manager
                .getRepository(asset_stock_serials_entity_1.AssetStockSerials)
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.asset_working_status', 'asset_working_status')
                .leftJoinAndSelect('serial.current_status', 'current_status')
                .leftJoinAndSelect('serial.procurement_item', 'procurement_item')
                .leftJoinAndSelect('procurement_item.procurement', 'procurement')
                .leftJoinAndSelect('serial.asset_cost_center', 'asset_cost_center')
                .leftJoinAndSelect('serial.asset_project', 'asset_project')
                .leftJoinAndSelect('serial.stock', 'stock')
                .where('serial.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .getOne();
            const fieldsData = serialData?.information_fields;
            let mapping = await queryRunner.manager
                .getRepository(asset_mapping_entity_1.AssetMappingRepository)
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.assigned_by_user', 'assigned_by_user')
                .leftJoinAndSelect('mapping.returned_by_user', 'returned_by_user')
                .leftJoinAndSelect('mapping.stock_serial', 'serial')
                .where('mapping.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .andWhere('mapping.is_deleted = 0')
                .andWhere('mapping.is_active = 1')
                .andWhere('mapping.target_type IN (:...targetTypes)', {
                targetTypes: ['USER', 'BRANCH', 'DEPARTMENT', 'PROJECT'],
            })
                .orderBy('mapping.created_at', 'DESC')
                .getOne();
            if (!mapping) {
                mapping = await queryRunner.manager
                    .getRepository(asset_mapping_entity_1.AssetMappingRepository)
                    .createQueryBuilder('mapping')
                    .leftJoinAndSelect('mapping.assigned_by_user', 'assigned_by_user')
                    .leftJoinAndSelect('mapping.returned_by_user', 'returned_by_user')
                    .leftJoinAndSelect('mapping.stock_serial', 'serial')
                    .where('mapping.asset_stocks_unique_id = :serialId', {
                    serialId: asset_stocks_unique_id,
                })
                    .andWhere('mapping.is_deleted = 0')
                    .andWhere('mapping.target_type IN (:...targetTypes)', {
                    targetTypes: ['USER', 'BRANCH', 'DEPARTMENT', 'PROJECT'],
                })
                    .orderBy('mapping.created_at', 'DESC')
                    .getOne();
            }
            const assetId = [serialData.system_code];
            const qrcodepayload = [
                {
                    asset_id: serialData.asset_id,
                    system_code: serialData.system_code,
                },
            ];
            const barcode = await this.generateBarcodesForAssets(assetId);
            const schemaNameCookie = req?.cookies?.['x-organization-schema'];
            const qrcode = await this.generateQRCodes(qrcodepayload, req);
            console.log('barcode:1', barcode);
            let resolvedTarget = null;
            if (mapping?.target_id && mapping?.target_type) {
                switch (mapping.target_type) {
                    case 'USER':
                        const user = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                            where: { user_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (user) {
                            resolvedTarget = {
                                type: 'USER',
                                id: user.user_id,
                                name: [user.first_name, user.last_name]
                                    .filter(v => v?.trim() && v.trim().toLowerCase() !== 'null')
                                    .join(' '),
                                email: user.users_business_email,
                            };
                        }
                        break;
                    case 'DEPARTMENT':
                        const department = await queryRunner.manager.findOne(department_entity_1.Department, {
                            where: { department_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (department) {
                            resolvedTarget = {
                                type: 'DEPARTMENT',
                                id: department.department_id,
                                name: department.department_name,
                            };
                        }
                        break;
                    case 'BRANCH':
                        const branch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                            where: { branch_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (branch) {
                            resolvedTarget = {
                                type: 'BRANCH',
                                id: branch.branch_id,
                                name: branch.branch_name,
                                city: branch.city,
                                state: branch.state,
                            };
                        }
                        break;
                }
            }
            const formattedMapping = mapping
                ? {
                    mapping_id: mapping.mapping_id,
                    asset_stocks_unique_id: mapping.asset_stocks_unique_id,
                    assigned_by: mapping.assigned_by_user
                        ? {
                            id: mapping.assigned_by_user.user_id,
                            name: `${mapping.assigned_by_user.first_name} ${mapping.assigned_by_user.last_name}`.trim(),
                        }
                        : null,
                    returned_by: mapping.returned_by_user
                        ? {
                            id: mapping.returned_by_user.user_id,
                            name: `${mapping.returned_by_user.first_name} ${mapping.returned_by_user.last_name}`.trim(),
                        }
                        : null,
                    assignment_target: resolvedTarget,
                    status: mapping.status
                        ? {
                            id: mapping.status.status_type_id,
                            name: mapping.status.status_type_name,
                        }
                        : null,
                    assigned_from_date: mapping.assigned_from_date,
                    assigned_to_date: mapping.assigned_to_date,
                    created_at: mapping.created_at,
                }
                : null;
            const formattedSerialData = serialData
                ? {
                    ...serialData,
                    procurement: serialData.procurement_item?.procurement
                        ? {
                            procurement_id: serialData.procurement_item.procurement.procurement_id,
                            renewal_status: serialData.procurement_item.procurement.renewal_status,
                        }
                        : null,
                }
                : null;
            await queryRunner.commitTransaction();
            return {
                asset: assetData,
                stocks,
                serialData: formattedSerialData,
                mapping: formattedMapping,
                fieldsData,
                barcode,
                qrcode,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Error in getSingleAssetStocks:', error);
            throw new Error('An error occurred while fetching asset.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async findSingleAssetTopCard(asset_id, asset_stocks_unique_id, stock_id) {
        try {
            const assetData = await this.assetDataRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.main_category', 'main_category')
                .leftJoinAndSelect('asset.sub_category', 'sub_category')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('asset.added_by_user', 'added_by_user')
                .leftJoinAndSelect('asset.manufacturer_name', 'manufacturer')
                .leftJoinAndSelect('asset.model_name', 'model')
                .where('asset.asset_id = :asset_id', { asset_id })
                .getOne();
            if (!assetData) {
                throw new Error('Asset not found');
            }
            const stocks = await this.stockRepository
                .createQueryBuilder('stock')
                .leftJoinAndSelect('stock.location', 'locationMapping')
                .leftJoinAndSelect('locationMapping.location', 'location')
                .leftJoinAndSelect('locationMapping.type', 'locationType')
                .leftJoinAndSelect('locationMapping.branch', 'branch')
                .where('stock.asset_id = :asset_id', { asset_id })
                .getMany();
            const serialData = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.asset_working_status', 'asset_working_status')
                .leftJoinAndSelect('serial.current_status', 'current_status')
                .leftJoinAndSelect('serial.procurement_item', 'procurement_item')
                .leftJoinAndSelect('serial.asset_cost_center', 'asset_cost_center')
                .leftJoinAndSelect('serial.asset_project', 'asset_project')
                .leftJoinAndSelect('serial.stock', 'stock')
                .leftJoinAndSelect('serial.location_mapping', 'locationMapping')
                .leftJoinAndSelect('locationMapping.location', 'location')
                .leftJoinAndSelect('locationMapping.branch', 'branch')
                .where('serial.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .getOne();
            let mapping = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.assigned_by_user', 'assigned_by_user')
                .leftJoinAndSelect('mapping.returned_by_user', 'returned_by_user')
                .leftJoinAndSelect('mapping.stock_serial', 'serial')
                .where('mapping.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .andWhere('mapping.is_deleted = 0')
                .andWhere('mapping.is_active = 1')
                .andWhere('mapping.target_type IN (:...targetTypes)', {
                targetTypes: ['USER', 'BRANCH', 'DEPARTMENT', 'PROJECT'],
            })
                .orderBy('mapping.created_at', 'DESC')
                .getOne();
            if (!mapping) {
                mapping = await this.assetMappingRepository
                    .createQueryBuilder('mapping')
                    .leftJoinAndSelect('mapping.assigned_by_user', 'assigned_by_user')
                    .leftJoinAndSelect('mapping.returned_by_user', 'returned_by_user')
                    .leftJoinAndSelect('mapping.stock_serial', 'serial')
                    .where('mapping.asset_stocks_unique_id = :serialId', {
                    serialId: asset_stocks_unique_id,
                })
                    .andWhere('mapping.is_deleted = 0')
                    .andWhere('mapping.target_type IN (:...targetTypes)', {
                    targetTypes: ['USER', 'BRANCH', 'DEPARTMENT', 'PROJECT'],
                })
                    .orderBy('mapping.created_at', 'DESC')
                    .getOne();
            }
            let resolvedTarget = null;
            let subscription = null;
            if (mapping?.target_id && mapping?.target_type) {
                switch (mapping.target_type) {
                    case 'USER':
                        const user = await this.userRepository.findOne({
                            where: { user_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (user) {
                            resolvedTarget = {
                                type: 'USER',
                                id: user.user_id,
                                name: [user.first_name, user.last_name]
                                    .filter(v => v?.trim() && v.trim().toLowerCase() !== 'null')
                                    .join(' '),
                                email: user.users_business_email,
                            };
                        }
                        break;
                    case 'DEPARTMENT':
                        const department = await this.departmentRepository.findOne({
                            where: { department_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (department) {
                            resolvedTarget = {
                                type: 'DEPARTMENT',
                                id: department.department_id,
                                name: department.department_name,
                            };
                        }
                        break;
                    case 'BRANCH':
                        const branch = await this.branchRepository.findOne({
                            where: { branch_id: mapping.target_id, is_deleted: 0 },
                        });
                        if (branch) {
                            resolvedTarget = {
                                type: 'BRANCH',
                                id: branch.branch_id,
                                name: branch.branch_name,
                                city: branch.city,
                                state: branch.state,
                            };
                        }
                        break;
                }
            }
            const procurementId = serialData?.procurement_item?.procurement_id;
            if (procurementId) {
                subscription = await this.AssetProcurement.findOne({
                    where: { procurement_id: procurementId },
                    select: [
                        'sub_start_date',
                        'next_renewal_date',
                        'subscription_type',
                        'billing_frequency',
                    ],
                });
            }
            const formattedMapping = mapping
                ? {
                    mapping_id: mapping.mapping_id,
                    asset_stocks_unique_id: mapping.asset_stocks_unique_id,
                    assigned_by: mapping.assigned_by_user
                        ? {
                            id: mapping.assigned_by_user.user_id,
                            name: `${mapping.assigned_by_user.first_name} ${mapping.assigned_by_user.last_name}`.trim(),
                        }
                        : null,
                    returned_by: mapping.returned_by_user
                        ? {
                            id: mapping.returned_by_user.user_id,
                            name: `${mapping.returned_by_user.first_name} ${mapping.returned_by_user.last_name}`.trim(),
                        }
                        : null,
                    assignment_target: resolvedTarget,
                    status: mapping.status
                        ? {
                            id: mapping.status.status_type_id,
                            name: mapping.status.status_type_name,
                        }
                        : null,
                    assigned_from_date: mapping.assigned_from_date,
                    assigned_to_date: mapping.assigned_to_date,
                    created_at: mapping.created_at,
                }
                : null;
            let purchase_date = null;
            if (serialData?.procurement_item?.procurement_id) {
                const procurement = await this.AssetProcurement.createQueryBuilder('procurement')
                    .select(['procurement.purchase_date'])
                    .where('procurement.procurement_id = :procurementId', {
                    procurementId: serialData.procurement_item.procurement_id,
                })
                    .getOne();
                purchase_date = procurement?.purchase_date ?? null;
            }
            return {
                asset: assetData,
                stocks,
                serialData,
                mapping: formattedMapping,
                purchase_date,
                subscription,
            };
        }
        catch (error) {
            console.error('❌ Error in getSingleAssetStocks:', error);
            throw new Error('An error occurred while fetching asset.');
        }
    }
    async findBillingDetails(asset_id, asset_stocks_unique_id, stock_id) {
        try {
            console.log('billing data');
            const serialData = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .leftJoinAndSelect('serial.asset_item', 'asset_item')
                .leftJoinAndSelect('serial.asset_working_status', 'asset_working_status')
                .leftJoinAndSelect('serial.current_status', 'current_status')
                .leftJoinAndSelect('serial.procurement_item', 'procurement_item')
                .where('serial.asset_stocks_unique_id = :serialId', {
                serialId: asset_stocks_unique_id,
            })
                .getOne();
            const procurementId = serialData?.procurement_item?.procurement_id;
            console.log('procurementId', procurementId);
            let procurements = null;
            if (procurementId) {
                procurements = await this.AssetProcurement.createQueryBuilder('procurement')
                    .leftJoinAndSelect('procurement.vendor', 'vendor')
                    .leftJoinAndSelect('procurement.ownership_status', 'ownership')
                    .where('procurement.procurement_id = :procurementId', {
                    procurementId,
                })
                    .getOne();
            }
            let warranty = null;
            if (asset_stocks_unique_id) {
                warranty = await this.AssetWarrantyDetailsRepository.createQueryBuilder('warranty')
                    .leftJoinAndSelect('warranty.amcVendor', 'amcVendor')
                    .where('warranty.asset_stocks_unique_id = :serialId', {
                    serialId: asset_stocks_unique_id,
                })
                    .getOne();
            }
            let subscription = null;
            if (procurementId) {
                subscription = await this.AssetProcurement.findOne({
                    where: { procurement_id: procurementId },
                    select: [
                        'sub_start_date',
                        'next_renewal_date',
                        'subscription_type',
                        'billing_frequency',
                    ],
                });
            }
            return {
                serialData,
                procurements,
                warranty,
                subscription,
            };
        }
        catch (error) {
            console.error('❌ Error in getSingleAssetStocks:', error);
            throw new Error('An error occurred while fetching asset.');
        }
    }
    async updateAssetInformationFields(payload, asset_stocks_unique_id) {
        const record = await this.assetStockSerialsRepository.findOne({
            where: { asset_stocks_unique_id },
        });
        if (!record) {
            throw new Error(`Asset stock with ID ${asset_stocks_unique_id} not found`);
        }
        let infoFields = [];
        if (record.information_fields) {
            infoFields = JSON.parse(record.information_fields);
        }
        const existingFieldIds = new Set(infoFields.map((field) => field.asset_field_id));
        const updatedInfoFields = infoFields.map((field) => {
            const updatedField = payload.find((p) => p.asset_field_id === field.asset_field_id);
            return updatedField ? { ...field, value: updatedField.value } : field;
        });
        const newInfoFields = payload
            .filter((p) => !existingFieldIds.has(p.asset_field_id))
            .map((p) => ({ ...p }));
        const mergedInfoFields = [...updatedInfoFields, ...newInfoFields];
        record.information_fields = JSON.stringify(mergedInfoFields);
        await this.assetStockSerialsRepository.save(record);
        const categories = await this.assetFieldCategoryRepository.find();
        const categoryMap = new Map(categories.map((c) => [c.asset_field_category_id, c]));
        const enrichedFields = mergedInfoFields.map((field) => {
            const category = categoryMap.get(field.asset_field_category_id);
            return {
                asset_field_id: field.asset_field_id,
                asset_field_category_id: field.asset_field_category_id,
                asset_field_category_name: category?.asset_field_category_name ||
                    field.asset_field_category_name ||
                    null,
                asset_field_category_description: category?.asset_field_category_description ||
                    field.asset_field_category_description ||
                    '',
                asset_field_name: field.asset_field_name,
                asset_field_label_name: field.asset_field_label_name,
                value: field.value ?? '',
            };
        });
        return enrichedFields;
    }
    async fieldForQRCode() {
        console.log('[Backend] Inside fieldForQRCode:', this.assetFields);
        return this.assetFields;
    }
    async generateQRCodes(serials, req, schemaName1) {
        const schemaName = req?.cookies?.['x-organization-schema'] || schemaName1;
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Schema decrypt error:', error.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO "${fullSchemaName}", public;`);
            const settings = await queryRunner.manager.findOne(qr_code_settings_entity_1.QrCodeSetting, {
                where: { is_current: true },
                order: { created_at: 'DESC' },
            });
            if (!settings) {
                throw new Error('QR Code settings not found');
            }
            const assetIds = [...new Set(serials.map((s) => s.asset_id))];
            const systemCodes = [...new Set(serials.map((s) => s.system_code))];
            const serialInfos = await queryRunner.manager.find(asset_stock_serials_entity_1.AssetStockSerials, {
                where: {
                    asset_id: (0, typeorm_2.In)(assetIds),
                    system_code: (0, typeorm_2.In)(systemCodes),
                    is_deleted: 0,
                },
            });
            const serialMap = new Map(serialInfos.map((item) => [
                `${item.asset_id}_${item.system_code}`,
                item,
            ]));
            const projectIds = [
                ...new Set(serialInfos.map((i) => i.project_id).filter(Boolean)),
            ];
            console.log('POINT 1 PROJECT IDS:', projectIds);
            const costCenterIds = [
                ...new Set(serialInfos.map((i) => i.cost_center_id).filter(Boolean)),
            ];
            console.log('POINT 2 COST CENTER IDS:', costCenterIds);
            const procurementItemIds = [
                ...new Set(serialInfos.map((i) => i.procurement_item_id).filter(Boolean)),
            ];
            const assetStocksUniqueIds = [
                ...new Set(serialInfos.map((i) => i.asset_stocks_unique_id).filter(Boolean)),
            ];
            const assetInfos = await queryRunner.manager.find(asset_datum_entity_1.AssetDatum, {
                where: {
                    asset_id: (0, typeorm_2.In)(assetIds),
                },
            });
            const assetMap = new Map(assetInfos.map((item) => [item.asset_id, item]));
            const modelIds = [
                ...new Set(assetInfos.map((i) => i.model_id).filter(Boolean)),
            ];
            const manufacturerIds = [
                ...new Set(assetInfos.map((i) => i.manufacturer_id).filter(Boolean)),
            ];
            const [models, manufacturers] = await Promise.all([
                queryRunner.manager.find(models_entity_1.Models, {
                    where: {
                        model_id: (0, typeorm_2.In)(modelIds),
                    },
                }),
                queryRunner.manager.find(manufacturer_entity_1.Manufacturer, {
                    where: {
                        manufacturer_id: (0, typeorm_2.In)(manufacturerIds),
                    },
                }),
            ]);
            const modelMap = new Map(models.map((item) => [item.model_id, item]));
            const manufacturerMap = new Map(manufacturers.map((item) => [item.manufacturer_id, item]));
            let projects = [];
            let costCenters = [];
            if (projectIds.length > 0) {
                console.log('POINT 3 FETCHING PROJECTS');
                projects = await queryRunner.manager.find(assets_project_entity_1.AssetsProject, {
                    where: {
                        project_id: (0, typeorm_2.In)(projectIds),
                    },
                });
            }
            if (costCenterIds.length > 0) {
                console.log('POINT 4 FETCHING COST CENTERS');
                costCenters = await queryRunner.manager.find(asset_cost_center_entity_1.AssetCostCenter, {
                    where: {
                        cost_center_id: (0, typeorm_2.In)(costCenterIds),
                    },
                });
            }
            const projectMap = new Map(projects.map((item) => [item.project_id, item]));
            const costCenterMap = new Map(costCenters.map((item) => [item.cost_center_id, item]));
            const procurementItems = await queryRunner.manager.find(asset_procurement_items_entity_1.AssetProcurementItem, {
                where: {
                    procurement_item_id: (0, typeorm_2.In)(procurementItemIds),
                },
                relations: ['procurement', 'procurement.ownership_status'],
            });
            const procurementMap = new Map(procurementItems.map((item) => [item.procurement_item_id, item]));
            const stockViews = await queryRunner.manager.find(v_asset_stock_serials_view_entity_1.AssetStockSerialsView, {
                where: {
                    asset_stocks_unique_id: (0, typeorm_2.In)(assetStocksUniqueIds),
                },
                select: {
                    asset_stocks_unique_id: true,
                    asset_title: true,
                    asset_main_category_name: true,
                    asset_sub_category_name: true,
                    asset_item_name: true,
                    location_branch_name: true,
                    location_branch_id: true,
                    asset_location: true,
                    location_name: true,
                    location_full_path: true,
                    location_hierarchy_text: true,
                    target_type: true,
                    assigned_to_name: true,
                    stock_serials: true,
                },
            });
            const stockViewMap = new Map(stockViews.map((item) => [item.asset_stocks_unique_id, item]));
            let selectedFields = [];
            if (Array.isArray(settings.settings?.selectedFields)) {
                selectedFields = settings.settings.selectedFields;
            }
            else {
                selectedFields = Object.keys(settings.settings)
                    .filter((key) => !isNaN(Number(key)))
                    .map((key) => settings.settings[key]);
            }
            const results = await Promise.all(serials.map(async (serial) => {
                const { asset_id, system_code } = serial;
                const serialInfo = serialMap.get(`${asset_id}_${system_code}`);
                if (!serialInfo) {
                    return null;
                }
                const assetInfo = assetMap.get(asset_id);
                if (!assetInfo) {
                    return null;
                }
                const procurementItem = procurementMap.get(serialInfo.procurement_item_id);
                const ownershipType = procurementItem?.procurement?.ownership_status
                    ?.ownership_status_type_name || '';
                const viewData = stockViewMap.get(serialInfo.asset_stocks_unique_id);
                console.log('VIEW DATA CHECK:', viewData);
                const project = projectMap.get(serialInfo.project_id);
                const costCenter = costCenterMap.get(serialInfo.cost_center_id);
                const model = modelMap.get(assetInfo.model_id);
                const manufacturer = manufacturerMap.get(assetInfo.manufacturer_id);
                const fieldLabels = this.assetFields.reduce((acc, field) => {
                    acc[field.id] = field.name;
                    return acc;
                }, {});
                const assetFieldsMap = {
                    item_name: viewData?.asset_item_name || '',
                    manufacturer: manufacturer?.manufacturer_name || '',
                    model_no: model?.model_name || '',
                    display_name: viewData?.asset_title || serialInfo.asset_serial_title || '',
                    ownership_type: ownershipType,
                    category: viewData?.asset_main_category_name || '',
                    subcategory: viewData?.asset_sub_category_name || '',
                    project: project?.project_name || '',
                    cost_center: costCenter?.cost_center_name || '',
                    branch_name: viewData?.location_branch_name || '',
                    location_name: viewData?.location_name || '',
                    location_full_path: viewData?.location_full_path || viewData?.location_name || '',
                    location_hierarchy_text: viewData?.location_hierarchy_text || '',
                    assigned_to_name: viewData?.assigned_to_name || '',
                    target_type: viewData?.target_type || '',
                    serial_number: viewData?.stock_serials || '',
                };
                console.log('MAPPING DATA CHECK:', assetFieldsMap);
                const qrText = [
                    `Asset ID: ${system_code}`,
                    ...selectedFields
                        .map((field) => {
                        const label = fieldLabels[field] || field;
                        const value = assetFieldsMap[field] || '';
                        return value ? `${label}: ${value}` : null;
                    })
                        .filter(Boolean),
                ].join(' | ');
                const pngBuffer = await new Promise((resolve, reject) => {
                    bwip_js_1.default.toBuffer({
                        bcid: 'qrcode',
                        text: qrText,
                        scale: 3,
                        includetext: false,
                    }, (err, png) => (err ? reject(err) : resolve(png)));
                });
                return {
                    asset_id,
                    system_code,
                    qrCode: `data:image/png;base64,${pngBuffer.toString('base64')}`,
                };
            }));
            await queryRunner.commitTransaction();
            return results.filter(Boolean);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('generateQRCodes ERROR', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async generateQRCodePdf(serials, printOptions, req) {
        const schemaName = req?.cookies?.['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Schema decrypt error:', error.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO "${fullSchemaName}", public;`);
            const PDFDocument = require('pdfkit');
            const qrCodes = await this.generateQRCodes(serials, req);
            const paperSize = (printOptions?.paper_size || 'A4').toString();
            const size = (printOptions?.size || 'small').toString();
            const PAPER = {
                A4: [210, 297],
                A5: [148, 210],
                Letter: [216, 279],
            };
            const QR_SIZES = {
                small: 20,
                medium: 35,
                large: 50,
            };
            const LABEL_FONT_SIZE = {
                small: 5,
                medium: 6,
                large: 7,
            };
            const CHARS_PER_LINE = {
                small: 10,
                medium: 16,
                large: 22,
            };
            const LINE_HEIGHT_MM = 3.5;
            const codeSize = QR_SIZES[size];
            const labelFontSize = LABEL_FONT_SIZE[size];
            const charsPerLine = CHARS_PER_LINE[size];
            const mmToPt = (mm) => mm * 2.83465;
            const [pw, ph] = PAPER[paperSize];
            const margin = 5;
            const borderPadding = 1;
            const gapX = 2;
            const gapY = 2;
            const getLabelHeight = (text) => {
                const lines = Math.ceil(text.length / charsPerLine);
                return lines * LINE_HEIGHT_MM;
            };
            const longestCode = qrCodes.reduce((max, qr) => qr.system_code.length > max.length ? qr.system_code : max, '');
            const maxLabelHeight = getLabelHeight(longestCode);
            const cellHeightWorstCase = codeSize + maxLabelHeight + borderPadding * 2 + gapY;
            const cellWidth = codeSize + borderPadding * 2 + gapX;
            const usableWidth = pw - margin * 2;
            const usableHeight = ph - margin * 2;
            let columns = Math.floor(usableWidth / cellWidth);
            let rows = Math.floor(usableHeight / cellHeightWorstCase);
            if (columns < 1)
                columns = 1;
            if (rows < 1)
                rows = 1;
            console.log('POINT 1 SAFE GRID:', { columns, rows });
            const doc = new PDFDocument({
                size: [mmToPt(pw), mmToPt(ph)],
                margin: 0,
            });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            const pdfPromise = new Promise((resolve) => {
                doc.on('end', () => {
                    resolve(Buffer.concat(buffers).toString('base64'));
                });
            });
            let row = 0;
            let col = 0;
            for (const qr of qrCodes) {
                const base64Data = qr.qrCode.replace(/^data:image\/png;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                const dynamicLabelHeight = getLabelHeight(qr.system_code);
                const cellHeight = codeSize + dynamicLabelHeight + borderPadding * 2 + gapY;
                const boxX = margin + col * cellWidth;
                const boxY = margin + row * cellHeightWorstCase;
                const qrX = boxX + borderPadding;
                const qrY = boxY + borderPadding;
                doc
                    .rect(mmToPt(boxX), mmToPt(boxY), mmToPt(cellWidth - gapX), mmToPt(cellHeight - gapY))
                    .stroke();
                doc.image(imageBuffer, mmToPt(qrX), mmToPt(qrY), {
                    width: mmToPt(codeSize),
                    height: mmToPt(codeSize),
                });
                doc
                    .fontSize(labelFontSize)
                    .text(qr.system_code, mmToPt(qrX), mmToPt(qrY + codeSize + 1), {
                    width: mmToPt(codeSize),
                    align: 'center',
                    lineBreak: true,
                });
                col++;
                if (col >= columns) {
                    col = 0;
                    row++;
                }
                if (row >= rows) {
                    doc.addPage();
                    row = 0;
                    col = 0;
                }
            }
            doc.end();
            const pdfBase64 = await pdfPromise;
            await queryRunner.commitTransaction();
            return pdfBase64;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log('generateQRCodePdf ERROR', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async generateBarcodesForAssets(assetIds) {
        try {
            const results = await Promise.all(assetIds.map(async (id) => {
                const pngBuffer = await new Promise((resolve, reject) => {
                    bwip_js_1.default.toBuffer({
                        bcid: 'code128',
                        text: id,
                        scale: 3,
                        height: 15,
                        includetext: false,
                        textxalign: 'center',
                        textsize: 13,
                        textyoffset: 2,
                        paddingwidth: 10,
                        paddingheight: 10,
                    }, (err, png) => {
                        if (err)
                            reject(err);
                        else
                            resolve(png);
                    });
                });
                return {
                    assetId: id,
                    barcode: `data:image/png;base64,${pngBuffer.toString('base64')}`,
                };
            }));
            return results;
        }
        catch (error) {
            console.error('Error generating multiple barcodes:', error);
            throw new Error('Failed to generate barcodes.');
        }
    }
    async generateBarcodePdf(assetIds, printOptions) {
        try {
            const PDFDocument = require('pdfkit');
            const barcodes = await this.generateBarcodesForAssets(assetIds);
            const paperSize = (printOptions?.paper_size || 'A4').toString();
            const size = (printOptions?.size || 'small').toString().toLowerCase();
            const PAPER = {
                A4: [210, 297],
                A5: [148, 210],
                Letter: [216, 279],
            };
            const BARCODE_SIZES = {
                small: { width: 36, height: 12 },
                medium: { width: 46, height: 22 },
                large: { width: 56, height: 32 },
            };
            const selected = BARCODE_SIZES[size] || BARCODE_SIZES.small;
            const codeWidth = Number(selected.width);
            const codeHeight = Number(selected.height);
            const mmToPt = (mm) => Number(mm) * 2.83465;
            const [pw, ph] = (PAPER[paperSize] || PAPER.A4).map(Number);
            const margin = 5;
            const labelHeight = 4;
            const borderPadding = 1;
            const gapX = 2;
            const gapY = 2;
            const cellWidth = Number(codeWidth + borderPadding * 2 + gapX);
            const cellHeight = Number(codeHeight + labelHeight + borderPadding * 2 + gapY);
            const usableWidth = Number(pw - margin * 2);
            const usableHeight = Number(ph - margin * 2);
            let columns = Math.floor(usableWidth / cellWidth);
            let rows = Math.floor(usableHeight / cellHeight);
            columns = isNaN(columns) || columns < 1 ? 1 : columns;
            rows = isNaN(rows) || rows < 1 ? 1 : rows;
            console.log('BARCODE SAFE GRID:', {
                columns,
                rows,
                paperSize,
                size,
                cellWidth: cellWidth.toFixed(2),
                cellHeight: cellHeight.toFixed(2),
                totalCellsPerPage: columns * rows,
            });
            if (paperSize === 'A5') {
                const safeColumns = Math.floor(usableWidth / (cellWidth * 1.1));
                columns = Math.max(1, Math.min(columns, safeColumns || 2));
                const safeRows = Math.floor(usableHeight / (cellHeight * 1.05));
                rows = Math.max(1, Math.min(rows, safeRows));
            }
            const doc = new PDFDocument({
                size: [mmToPt(pw), mmToPt(ph)],
                margin: 0,
                compress: true,
            });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            const pdfPromise = new Promise((resolve) => {
                doc.on('end', () => {
                    resolve(Buffer.concat(buffers).toString('base64'));
                });
            });
            let row = 0;
            let col = 0;
            for (const b of barcodes) {
                const base64Data = b.barcode.replace(/^data:image\/png;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                const boxX = margin + col * cellWidth;
                const boxY = margin + row * cellHeight;
                const barcodeX = boxX + borderPadding;
                const barcodeY = boxY + borderPadding;
                doc
                    .rect(mmToPt(boxX), mmToPt(boxY), mmToPt(cellWidth - gapX), mmToPt(cellHeight - gapY))
                    .stroke();
                doc.image(imageBuffer, mmToPt(barcodeX), mmToPt(barcodeY), {
                    width: mmToPt(codeWidth),
                    height: mmToPt(codeHeight),
                });
                doc.fontSize(8);
                doc.text(String(b.assetId || ''), mmToPt(barcodeX), mmToPt(barcodeY + codeHeight + 1), {
                    width: mmToPt(codeWidth),
                    align: 'center',
                });
                col++;
                if (col >= columns) {
                    col = 0;
                    row++;
                }
                if (row >= rows) {
                    doc.addPage();
                    row = 0;
                    col = 0;
                }
            }
            doc.end();
            return await pdfPromise;
        }
        catch (error) {
            console.log('generateBarcodePdf ERROR', error);
            throw error;
        }
    }
    async streamBarcodeOrQrPdf(data, res) {
        try {
            const PDFDocument = require('pdfkit');
            console.log('point:1');
            const { type, assetIds = [], serials = [], paperSize, size } = data;
            console.log('point:2', data);
            const PAPER = {
                A4: [595.28, 841.89],
                A5: [419.53, 595.28],
                Letter: [612, 792],
            };
            const [pageWidth, pageHeight] = PAPER[paperSize];
            const mmToPt = (mm) => mm * 2.83465;
            const QR_SIZES = {
                small: 25,
                medium: 40,
                large: 55,
            };
            const BARCODE_SIZES = {
                small: { width: 40, height: 20 },
                medium: { width: 50, height: 25 },
                large: { width: 70, height: 35 },
            };
            const COLUMNS = {
                QRcode: {
                    small: 6,
                    medium: 4,
                    large: 3,
                },
                Barcode: {
                    small: 4,
                    medium: 3,
                    large: 2,
                },
            };
            const codeWidth = type === 'Barcode' ? BARCODE_SIZES[size].width : QR_SIZES[size];
            const codeHeight = type === 'Barcode' ? BARCODE_SIZES[size].height : QR_SIZES[size];
            const columns = COLUMNS[type][size];
            const margin = 8;
            const rowGap = 10;
            const borderPadding = 2;
            const labelHeight = type === 'QRcode' ? 6 : 0;
            const cellHeight = codeHeight + labelHeight;
            const fullRowHeight = cellHeight + rowGap;
            const usableWidth = pageWidth - mmToPt(margin * 2);
            const columnWidth = usableWidth / columns;
            const maxRows = Math.floor((pageHeight - mmToPt(margin * 2)) / mmToPt(fullRowHeight));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${type}.pdf`);
            const doc = new PDFDocument({
                size: [pageWidth, pageHeight],
                margin: 0,
                compress: true,
            });
            doc.pipe(res);
            let row = 0;
            let col = 0;
            let settings = null;
            if (type === 'QRcode') {
                settings = await this.qrCodeSettingRepo.findOne({
                    where: { is_current: true },
                    order: { created_at: 'DESC' },
                });
                if (!settings) {
                    throw new Error('QR Code settings not found');
                }
            }
            let assetMap = new Map();
            let serialMap = new Map();
            let manufacturerMap = new Map();
            let modelMap = new Map();
            let costCenterMap = new Map();
            let projectMap = new Map();
            let viewMap = new Map();
            let procurementMap = new Map();
            if (type === 'QRcode') {
                const assetIdsOnly = serials.map((s) => s.asset_id);
                const assets = await this.assetDataRepository.find({
                    where: {
                        asset_id: (0, typeorm_2.In)(assetIdsOnly),
                    },
                });
                assetMap = new Map(assets.map((a) => [a.asset_id, a]));
                const serialEntities = await this.assetStockSerialsRepository.find({
                    where: {
                        asset_id: (0, typeorm_2.In)(assetIdsOnly),
                        is_deleted: 0,
                    },
                });
                serialMap = new Map(serialEntities.map((s) => [`${s.asset_id}_${s.system_code}`, s]));
                const modelIds = [
                    ...new Set(assets.map((x) => x.model_id).filter(Boolean)),
                ];
                const manufacturerIds = [
                    ...new Set(assets.map((x) => x.manufacturer_id).filter(Boolean)),
                ];
                const models = await this.modelRepository.find({
                    where: {
                        model_id: (0, typeorm_2.In)(modelIds),
                    },
                });
                modelMap = new Map(models.map((m) => [m.model_id, m]));
                const manufacturers = await this.manufacturerRepository.find({
                    where: {
                        manufacturer_id: (0, typeorm_2.In)(manufacturerIds),
                    },
                });
                manufacturerMap = new Map(manufacturers.map((m) => [m.manufacturer_id, m]));
                const costCenterIds = [
                    ...new Set(serialEntities.map((x) => x.cost_center_id).filter(Boolean)),
                ];
                const projectIds = [
                    ...new Set(serialEntities.map((x) => x.project_id).filter(Boolean)),
                ];
                const costCenters = await this.assetCostCenterRepo.find({
                    where: {
                        cost_center_id: (0, typeorm_2.In)(costCenterIds),
                    },
                });
                costCenterMap = new Map(costCenters.map((c) => [c.cost_center_id, c]));
                const projects = await this.assetsProjectRepo.find({
                    where: {
                        project_id: (0, typeorm_2.In)(projectIds),
                    },
                });
                projectMap = new Map(projects.map((p) => [p.project_id, p]));
                const uniqueIds = [
                    ...new Set(serialEntities.map((x) => x.asset_stocks_unique_id).filter(Boolean)),
                ];
                const views = await this.assetStockViewRepo.find({
                    where: {
                        asset_stocks_unique_id: (0, typeorm_2.In)(uniqueIds),
                    },
                });
                viewMap = new Map(views.map((v) => [v.asset_stocks_unique_id, v]));
                const procurementIds = [
                    ...new Set(serialEntities.map((x) => x.procurement_item_id).filter(Boolean)),
                ];
                const procurements = await this.assetProcurementItemRepo.find({
                    where: {
                        procurement_item_id: (0, typeorm_2.In)(procurementIds),
                    },
                    relations: ['procurement', 'procurement.ownership_status'],
                });
                procurementMap = new Map(procurements.map((p) => [p.procurement_item_id, p]));
            }
            const items = type === 'Barcode' ? assetIds : serials;
            for (const item of items) {
                let pngBuffer;
                if (type === 'Barcode') {
                    const assetId = item;
                    pngBuffer = await new Promise((resolve, reject) => {
                        bwip_js_1.default.toBuffer({
                            bcid: 'code128',
                            text: assetId,
                            scale: 3,
                            height: 15,
                            includetext: true,
                            textxalign: 'center',
                            textsize: 13,
                            textyoffset: 2,
                            paddingwidth: 0,
                            paddingheight: 0,
                        }, (err, png) => {
                            if (err)
                                reject(err);
                            else
                                resolve(png);
                        });
                    });
                }
                else {
                    const serial = item;
                    const assetInfo = assetMap.get(serial.asset_id);
                    if (!assetInfo)
                        continue;
                    const serialInfo = serialMap.get(`${serial.asset_id}_${serial.system_code}`);
                    if (!serialInfo)
                        continue;
                    const model = modelMap.get(assetInfo.model_id);
                    const manufacturer = manufacturerMap.get(assetInfo.manufacturer_id);
                    const costCenter = costCenterMap.get(serialInfo.cost_center_id);
                    const project = projectMap.get(serialInfo.project_id);
                    const viewData = viewMap.get(serialInfo.asset_stocks_unique_id);
                    const procurement = procurementMap.get(serialInfo.procurement_item_id);
                    const ownershipType = procurement?.procurement?.ownership_status
                        ?.ownership_status_type_name || '';
                    const assetFieldsMap = {
                        item_name: viewData?.asset_item_name || '',
                        manufacturer: manufacturer?.manufacturer_name || '',
                        model_no: model?.model_name || '',
                        display_name: viewData?.asset_title || '',
                        ownership_type: ownershipType,
                        subcategory: viewData?.asset_sub_category_name || '',
                        project: project?.project_name || '',
                        cost_center: costCenter?.cost_center_name || '',
                        branch_name: viewData?.location_branch_name || '',
                        location_name: viewData?.location_name || '',
                        location_full_path: viewData?.location_full_path || viewData?.location_name || '',
                        location_hierarchy_text: viewData?.location_hierarchy_text || '',
                        assigned_to_name: viewData?.assigned_to_name || '',
                        target_type: viewData?.target_type || '',
                    };
                    let selectedFields = [];
                    if (Array.isArray(settings.settings?.selectedFields)) {
                        selectedFields = settings.settings.selectedFields;
                    }
                    const qrText = [
                        `Asset ID: ${serial.system_code}`,
                        ...selectedFields
                            .map((field) => {
                            const label = field
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (c) => c.toUpperCase());
                            const value = assetFieldsMap[field] || '';
                            return value ? `${label}: ${value}` : null;
                        })
                            .filter(Boolean),
                    ].join(' | ');
                    pngBuffer = await new Promise((resolve, reject) => {
                        bwip_js_1.default.toBuffer({
                            bcid: 'qrcode',
                            text: qrText,
                            scale: 3,
                            includetext: false,
                            paddingwidth: 0,
                            paddingheight: 0,
                        }, (err, png) => {
                            if (err)
                                reject(err);
                            else
                                resolve(png);
                        });
                    });
                }
                const x = mmToPt(margin) +
                    col * columnWidth +
                    (columnWidth - mmToPt(codeWidth)) / 2;
                const y = mmToPt(margin) + row * mmToPt(fullRowHeight);
                doc
                    .rect(x - mmToPt(borderPadding), y - mmToPt(borderPadding), mmToPt(codeWidth + borderPadding * 2), mmToPt(cellHeight + borderPadding * 2))
                    .stroke();
                doc.image(pngBuffer, x, y, {
                    width: mmToPt(codeWidth),
                    height: mmToPt(codeHeight),
                });
                col++;
                if (col >= columns) {
                    col = 0;
                    row++;
                }
                if (row >= maxRows) {
                    doc.addPage();
                    row = 0;
                    col = 0;
                }
            }
            doc.end();
        }
        catch (error) {
            console.error('streamBarcodeOrQrPdf ERROR', error);
            throw error;
        }
    }
    async assetIDGenerateFormula(assetIds, templateId, lastGeneratedInRequest, organizationID, req) {
        const schemaName = req?.cookies?.['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (error) {
                console.error('Schema decrypt error:', error.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET LOCAL search_path TO "${fullSchemaName}", public;`);
            const settings = await queryRunner.manager.findOne(asset_id_settings_entity_1.AssetIDSettings, {
                where: { is_current: true },
                order: { created_at: 'DESC' },
            });
            if (!settings)
                throw new Error('Asset ID settings not found');
            const [branch, department, category, subCategory, item] = await Promise.all([
                assetIds.branchId
                    ? queryRunner.manager.findOne(branches_entity_1.Branch, {
                        where: { branch_id: assetIds.branchId },
                    })
                    : null,
                assetIds.departmentId
                    ? queryRunner.manager.findOne(department_entity_1.Department, {
                        where: { department_id: assetIds.departmentId },
                    })
                    : null,
                assetIds.categoryId
                    ? queryRunner.manager.findOne(asset_category_entity_1.AssetCategory, {
                        where: { main_category_id: assetIds.categoryId },
                    })
                    : null,
                assetIds.subCategoryId
                    ? queryRunner.manager.findOne(asset_subcategory_entity_1.AssetSubcategory, {
                        where: { sub_category_id: assetIds.subCategoryId },
                    })
                    : null,
                assetIds.itemId
                    ? queryRunner.manager.findOne(asset_item_entity_1.AssetItem, {
                        where: { asset_item_id: assetIds.itemId },
                    })
                    : null,
            ]);
            const formatSource = (source, entity, type, length) => {
                if (!entity)
                    return '';
                let value = '';
                switch (type) {
                    case 'branch':
                        value =
                            source === 'CODE'
                                ? entity.branch_code || entity.branch_name || ''
                                : entity.branch_name || entity.branch_code || '';
                        break;
                    case 'department':
                        value =
                            source === 'CODE'
                                ? entity.department_code || entity.department_name || ''
                                : entity.department_name || entity.department_code || '';
                        break;
                    case 'category':
                        value = entity.main_category_name || '';
                        break;
                    case 'subCategory':
                        value = entity.sub_category_name || '';
                        break;
                    case 'item':
                        value = entity.asset_item_name || '';
                        break;
                }
                return length ? value.substring(0, length) : value;
            };
            const parts = [];
            if (settings.prefix)
                parts.push(settings.prefix);
            if (settings.include_year) {
                parts.push(new Date().getFullYear().toString());
            }
            if (settings.include_date &&
                settings.date_format &&
                settings.date_format !== 'None') {
                parts.push(this.formatDate(new Date(), settings.date_format));
            }
            if (settings.include_branch) {
                parts.push(formatSource(settings.branch_source, branch, 'branch', settings.branch_length));
            }
            if (settings.include_department) {
                parts.push(formatSource(settings.department_source, department, 'department', settings.department_length));
            }
            if (settings.include_category) {
                parts.push(formatSource(settings.category_source, category, 'category', settings.category_length));
            }
            if (settings.include_sub_category) {
                parts.push(formatSource(settings.sub_category_source, subCategory, 'subCategory', settings.sub_category_length));
            }
            if (settings.include_item) {
                parts.push(formatSource(settings.item_source, item, 'item', settings.item_length));
            }
            const separator = settings.separator || '-';
            let lastGeneratedId = lastGeneratedInRequest || null;
            if (!lastGeneratedId) {
                const lastSerial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { is_active: 1, is_deleted: 0 },
                    order: { asset_stocks_unique_id: 'DESC' },
                    select: ['system_code'],
                });
                lastGeneratedId = lastSerial?.system_code || null;
            }
            let nextSeqNumber = settings.starting_number || 1;
            if (lastGeneratedId) {
                let cleanId = lastGeneratedId;
                if (settings.suffix) {
                    const suffixPart = `${separator}${settings.suffix}`;
                    if (cleanId.endsWith(suffixPart)) {
                        cleanId = cleanId.slice(0, -suffixPart.length);
                    }
                }
                const match = cleanId.match(/(\d+)$/);
                if (match) {
                    nextSeqNumber = parseInt(match[1], 10) + 1;
                }
            }
            const paddedSeq = String(nextSeqNumber).padStart(Number(settings.sequence_length) || 3, '0');
            parts.push(paddedSeq);
            if (settings.suffix) {
                parts.push(settings.suffix);
            }
            let finalId = parts.join(separator);
            if (settings.word_case === 'upper')
                finalId = finalId.toUpperCase();
            else if (settings.word_case === 'lower')
                finalId = finalId.toLowerCase();
            await queryRunner.commitTransaction();
            return finalId;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Asset ID Generation Failed:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    formatDate(date, pattern) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const yyyy = date.getFullYear().toString();
        switch (pattern) {
            case 'DDMMYY':
                return `${dd}${mm}${yy}`;
            case 'YYYYMMDD':
                return `${yyyy}${mm}${dd}`;
            case 'YYMM':
                return `${yy}${mm}`;
            case 'YYYY':
                return yyyy;
            case 'YY':
                return yy;
            default:
                return '';
        }
    }
    async recordMetric(metric, value) {
        return this.orgStatRepository.save({
            metric,
            value,
        });
    }
    async getWeeklyOverview() {
        const metrics = [
            'total_users',
            'total_branches',
            'total_departments',
            'total_locations',
            'total_assets',
        ];
        const result = {};
        const now = new Date();
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        for (const metric of metrics) {
            const thisWeek = await this.orgStatRepository.findOne({
                where: {
                    metric,
                    recorded_at: (0, typeorm_2.MoreThan)(thisWeekStart),
                },
                order: { recorded_at: 'DESC' },
            });
            const lastWeek = await this.orgStatRepository.findOne({
                where: {
                    metric,
                    recorded_at: (0, typeorm_2.Between)(lastWeekStart, thisWeekStart),
                },
                order: { recorded_at: 'DESC' },
            });
            const latestValue = thisWeek?.value ?? 0;
            const prevValue = lastWeek?.value ?? 0;
            let trend = 'stable';
            let percent = 0;
            if (prevValue > 0) {
                percent = ((latestValue - prevValue) / prevValue) * 100;
            }
            if (percent > 0)
                trend = 'up';
            else if (percent < 0)
                trend = 'down';
            result[metric] = {
                value: latestValue,
                trend,
                percentage: Math.round(percent),
            };
        }
        return result;
    }
};
exports.AssetDataService = AssetDataService;
exports.AssetDataService = AssetDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(2, (0, typeorm_1.InjectRepository)(asset_field_category_entity_1.AssetFieldCategory)),
    __param(3, (0, typeorm_1.InjectRepository)(asset_category_entity_1.AssetCategory)),
    __param(4, (0, typeorm_1.InjectRepository)(orgnization_stats_entity_1.OrgStat)),
    __param(5, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(6, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __param(7, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(8, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(9, (0, typeorm_1.InjectRepository)(v_asset_stock_serials_view_entity_1.AssetStockSerialsView)),
    __param(10, (0, typeorm_1.InjectRepository)(asset_procurement_items_entity_1.AssetProcurementItem)),
    __param(11, (0, typeorm_1.InjectRepository)(location_branch_mapping_entity_1.LocationBranchMapping)),
    __param(12, (0, typeorm_1.InjectRepository)(qr_code_settings_entity_1.QrCodeSetting)),
    __param(13, (0, typeorm_1.InjectRepository)(branches_entity_1.Branch)),
    __param(14, (0, typeorm_1.InjectRepository)(asset_item_entity_1.AssetItem)),
    __param(15, (0, typeorm_1.InjectRepository)(asset_subcategory_entity_1.AssetSubcategory)),
    __param(16, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(17, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(18, (0, typeorm_1.InjectRepository)(asset_ownership_status_entity_1.AssetOwnershipStatus)),
    __param(19, (0, typeorm_1.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __param(20, (0, typeorm_1.InjectRepository)(models_entity_1.Models)),
    __param(21, (0, typeorm_1.InjectRepository)(manufacturer_entity_1.Manufacturer)),
    __param(22, (0, typeorm_1.InjectRepository)(item_manufacturer_map_1.ItemManufacturer)),
    __param(23, (0, typeorm_1.InjectRepository)(asset_cost_center_entity_1.AssetCostCenter)),
    __param(24, (0, typeorm_1.InjectRepository)(assets_project_entity_1.AssetsProject)),
    __param(25, (0, typeorm_1.InjectRepository)(asset_warranty_details_entity_1.AssetWarrantyDetailsRepository)),
    __param(26, (0, typeorm_1.InjectRepository)(location_branch_mapping_entity_1.LocationBranchMapping)),
    __param(27, (0, typeorm_1.InjectRepository)(asset_procurements_entity_1.AssetProcurement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
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
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        asset_depreciation_service_1.DepreciationViewService,
        notifications_helper_1.NotificationHelper,
        stock_summary_refresh_service_1.StockSummaryRefreshService,
        dropdown_cache_service_1.DropdownCacheService])
], AssetDataService);
