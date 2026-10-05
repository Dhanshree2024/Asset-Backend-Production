"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_data_service_1 = require("../../assets-data/asset-data/asset-data.service");
const asset_categories_service_1 = require("../../assets-data/asset-categories/asset-categories.service");
const asset_subcategories_service_1 = require("../../assets-data/asset-subcategories/asset-subcategories.service");
const asset_items_service_1 = require("../../assets-data/asset-items/asset-items.service");
const asset_item_enums_1 = require("../../assets-data/asset-items/entities/asset-item.enums");
const asset_fields_service_1 = require("../../assets-data/asset-fields/asset-fields.service");
const asset_items_fields_mapping_service_1 = require("../../assets-data/asset-items-fields-mapping/asset-items-fields-mapping.service");
const stocks_service_1 = require("../../assets-data/stocks/stocks.service");
const database_service_1 = require("../../dynamic-schema/database.service");
const device_repository_1 = require("../store/device.repository");
const asset_mapping_service_1 = require("../../asset-mapping/asset-mapping.service");
const software_inventory_service_1 = require("./software-inventory.service");
const auto_collect_service_1 = require("../endpoint/auto-collect.service");
const CATEGORY_HINTS = {
    'windows-host': [
        'IT',
        'Hardware',
        'Laptop',
        'Desktop',
        'Workstation',
        'Computer',
        'Windows',
        'PC',
    ],
    'linux-host': [
        'IT',
        'Hardware',
        'Server',
        'Linux Server',
        'Computer',
        'Linux',
    ],
    'virtual-machine': [
        'IT',
        'Cloud Asset',
        'Virtual Machine',
        'VM',
        'Virtual Server',
        'Server',
    ],
    server: ['IT', 'Hardware', 'Server', 'Rack Server', 'Tower Server'],
    laptop: ['IT', 'Hardware', 'Laptop', 'Notebook', 'Computer'],
    desktop: ['IT', 'Hardware', 'Desktop', 'Computer', 'Workstation', 'PC'],
    router: ['IT', 'Network Field', 'Router', 'Gateway'],
    switch: ['IT', 'Network Field', 'Switch', 'Network Switch'],
    'access-point': [
        'IT',
        'Network Field',
        'Access Point',
        'Wireless Access Point',
        'WiFi',
    ],
    nas: ['IT', 'Network Field', 'NAS', 'Storage', 'Network Storage'],
    printer: [
        'IT',
        'Hardware',
        'Printer',
        'Laser Printer',
        'Inkjet Printer',
        'Multifunction Printer',
    ],
    'ip-camera': ['IT', 'CCTV & Biometrics', 'Camera', 'IP Camera', 'CCTV'],
    'dvr-nvr': ['IT', 'CCTV & Biometrics', 'DVR', 'NVR', 'Video Recorder'],
    attendance: [
        'IT',
        'CCTV & Biometrics',
        'Attendance',
        'Biometric',
        'Fingerprint',
        'Face Recognition',
    ],
    monitor: ['IT', 'Hardware', 'Monitor', 'Display', 'LCD', 'LED Monitor'],
    tv: ['IT', 'Audio & Video', 'Television', 'TV', 'Smart TV', 'Display'],
    projector: ['IT', 'Audio & Video', 'Projector', 'Display'],
    phone: ['IT', 'Mobile Devices', 'Phone', 'Smartphone', 'Mobile'],
    ups: [
        'IT',
        'IT-Peripherals',
        'UPS',
        'Power Backup',
        'Offline UPS',
        'Online UPS',
    ],
    hvac: ['Non IT', 'HVAC', 'Air Conditioner', 'Cooling', 'Facility'],
    iot: ['IT', 'IoT', 'IoT Device', 'Sensor', 'Smart Device'],
    unknown: [],
};
const MIN_CATEGORY_CONFIDENCE = 0.34;
const MIN_FIELD_CONFIDENCE = 0.5;
const FALLBACK_LOCATION_NAME = 'Network Discovery';
let DiscoveryImportService = class DiscoveryImportService {
    constructor(deviceRepository, databaseService, dataSource, assetDataService, stocksService, assetItemsService, assetCategoriesService, assetSubcategoriesService, assetFieldsService, itemFieldsMappingService, softwareInventoryService, assetMappingService, autoCollect) {
        this.deviceRepository = deviceRepository;
        this.databaseService = databaseService;
        this.dataSource = dataSource;
        this.assetDataService = assetDataService;
        this.stocksService = stocksService;
        this.assetItemsService = assetItemsService;
        this.assetCategoriesService = assetCategoriesService;
        this.assetSubcategoriesService = assetSubcategoriesService;
        this.assetFieldsService = assetFieldsService;
        this.itemFieldsMappingService = itemFieldsMappingService;
        this.softwareInventoryService = softwareInventoryService;
        this.assetMappingService = assetMappingService;
        this.autoCollect = autoCollect;
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async suggest(schema, deviceIds) {
        this.assertSchema(schema);
        if (!Array.isArray(deviceIds) || !deviceIds.length) {
            throw new common_1.BadRequestException('deviceIds is required');
        }
        await this.databaseService.setSchema(schema);
        const devices = [];
        for (const id of deviceIds) {
            const device = await this.deviceRepository.getDevice(schema, String(id));
            if (!device) {
                devices.push({
                    deviceId: id,
                    found: false,
                    message: 'Device not found',
                });
                continue;
            }
            const dedupe = await this.checkDedupe(schema, device);
            const endpointBootstrap = await this.autoCollect.bootstrapForDevice(schema, String(id), null, device.hostname || device.ip);
            const suggestion = await this.suggestCategorySubItem(schema, device);
            console.log('Suggestion:', suggestion);
            const suggestedTitle = device.hostname ||
                [device.vendor, device.model].filter(Boolean).join(' ') ||
                device.ip;
            let specMatches = [];
            if (suggestion.item) {
                specMatches = await this.matchSpecsToItemFields(schema, device, suggestion.item.asset_item_id);
            }
            const softwareMatches = await this.softwareInventoryService.suggestForDevice(schema, device.software ?? [], dedupe.existingSerial?.asset_stocks_unique_id ?? null);
            let softwareGovernance = null;
            if (softwareMatches.length && suggestion.category) {
                const softwareMainCategoryId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
                softwareGovernance = await this.assetMappingService.checkGovernanceByCategory('REL-006', { main_category_id: softwareMainCategoryId }, {
                    main_category_id: suggestion.category.main_category_id,
                    sub_category_id: suggestion.subCategory?.sub_category_id ?? null,
                    item_id: suggestion.item?.asset_item_id ?? null,
                }, schema);
            }
            devices.push({
                deviceId: id,
                found: true,
                device: {
                    id: device.id,
                    ip: device.ip,
                    mac: device.mac,
                    hostname: device.hostname,
                    vendor: device.vendor,
                    model: device.model,
                    category: device.category,
                    os: device.os,
                },
                dedupe: {
                    status: dedupe.status,
                    serialUniqueId: dedupe.existingSerial?.asset_stocks_unique_id ?? null,
                },
                suggestedTitle,
                suggestedCategory: suggestion.category,
                suggestedSubCategory: suggestion.subCategory,
                suggestedItem: suggestion.item,
                specMatches,
                softwareMatches,
                softwareGovernance,
                endpointJobsQueued: endpointBootstrap.queued,
            });
        }
        const categoryTree = await this.getCategoryTree(schema);
        const locations = await this.getLocationOptions(schema);
        const ownershipTypes = await this.getOwnershipTypes(schema);
        const softwareLookups = await this.softwareInventoryService.getSoftwareLookups(schema);
        return {
            status: true,
            devices,
            lookups: { categoryTree, locations, ownershipTypes, ...softwareLookups },
        };
    }
    async execute(schema, dto, organizationId, userId, req) {
        this.assertSchema(schema);
        if (!Array.isArray(dto?.items) || !dto.items.length) {
            throw new common_1.BadRequestException('items is required');
        }
        await this.databaseService.setSchema(schema);
        const idSettings = await this.getCurrentAssetIdSettings(schema);
        if (!idSettings) {
            throw new common_1.BadRequestException('Asset ID settings not found for this organization -- configure asset ID settings before importing discovered devices.');
        }
        console.log('========== Execute Import ==========');
        console.log('Schema:', schema);
        console.log('Organization ID:', organizationId);
        console.log('User ID:', userId);
        console.log('Defaults:', dto.defaults);
        console.log('Items Count:', dto.items.length);
        console.log('Items:', JSON.stringify(dto.items, null, 2));
        const results = [];
        for (const item of dto.items) {
            console.log('--------------------------------');
            console.log('Processing Device:', item.deviceId);
            console.log('Import Payload:', JSON.stringify(item, null, 2));
            try {
                const result = await this.importOne(schema, item, dto.defaults, organizationId, userId, req);
                console.log('Import Result:', JSON.stringify(result, null, 2));
                results.push(result);
            }
            catch (error) {
                results.push({
                    deviceId: item?.deviceId,
                    status: 'failed',
                    message: error?.message ?? 'Unknown error during import',
                });
            }
        }
        return {
            status: true,
            results,
            summary: {
                total: results.length,
                created: results.filter((r) => r.status === 'created').length,
                updated: results.filter((r) => r.status === 'updated').length,
                skipped: results.filter((r) => r.status === 'skipped').length,
                failed: results.filter((r) => r.status === 'failed').length,
            },
        };
    }
    async getCurrentAssetIdSettings(schema) {
        const rows = await this.dataSource.query(`SELECT id FROM ${schema}.asset_id_settings_v2 WHERE is_current = true LIMIT 1`);
        return rows[0] ?? null;
    }
    async importOne(schema, item, defaults, organizationId, userId, req) {
        const effectiveUserId = defaults?.addedBy ?? userId;
        const device = await this.deviceRepository.getDevice(schema, String(item.deviceId));
        if (!device) {
            return {
                deviceId: item.deviceId,
                status: 'failed',
                message: 'Device not found',
            };
        }
        const dedupe = await this.checkDedupe(schema, device);
        if (dedupe.status !== 'new') {
            if (item.mode !== 'update') {
                return {
                    deviceId: item.deviceId,
                    status: 'skipped',
                    message: dedupe.status === 'imported'
                        ? 'Device already imported'
                        : 'An existing serial matches this device\'s MAC address -- pass mode="update" to merge',
                    serialUniqueId: dedupe.existingSerial?.asset_stocks_unique_id,
                };
            }
            const existing = dedupe.existingSerial;
            const setClauses = [];
            const params = [];
            const push = (v) => {
                params.push(v);
                return `$${params.length}`;
            };
            setClauses.push(`source_device_id = ${push(Number(device.id))}`);
            setClauses.push(`discovered_mac = ${push(device.mac ?? null)}::macaddr`);
            setClauses.push(`updated_by = ${push(effectiveUserId)}`);
            if (item.specs?.length) {
                const fields = await this.buildInformationFields(schema, item, existing.asset_item_id, effectiveUserId);
                setClauses.push(`information_fields = ${push(JSON.stringify(fields))}`);
            }
            if (item.locationMappingId || item.newLocation) {
                const locationMappingId = await this.resolveLocation(schema, item, defaults, effectiveUserId);
                setClauses.push(`location_id = ${push(locationMappingId)}`);
            }
            if (item.title?.trim()) {
                setClauses.push(`asset_serial_title = ${push(item.title.trim())}`);
            }
            const whereParam = push(existing.asset_stocks_unique_id);
            await this.dataSource.query(`UPDATE ${schema}.asset_stock_serials SET ${setClauses.join(', ')} WHERE asset_stocks_unique_id = ${whereParam}`, params);
            const softwareSummary = await this.processSoftwareForHost(schema, item, Number(existing.asset_stocks_unique_id), Number(device.id), existing.location_id ? Number(existing.location_id) : null, device.hostname || device.ip, organizationId, effectiveUserId, req);
            return {
                deviceId: item.deviceId,
                status: 'updated',
                assetId: existing.asset_id,
                serialUniqueId: existing.asset_stocks_unique_id,
                software: softwareSummary,
            };
        }
        const assetItemId = await this.resolveItem(schema, item, organizationId, effectiveUserId);
        const locationMappingId = await this.resolveLocation(schema, item, defaults, effectiveUserId);
        const informationFields = await this.buildInformationFields(schema, item, assetItemId, effectiveUserId);
        const title = item.title?.trim() ||
            device.hostname ||
            [device.vendor, device.model].filter(Boolean).join(' ') ||
            device.ip;
        const serialNumber = device.mac || device.hostname || `discovery-${device.id}`;
        const specKeyMatch = (keys) => item.specs?.find((spec) => keys.includes(String(spec.key || '').toLowerCase().trim().replace(/^system\./, '')))?.value;
        const manufacturerRaw = device.vendor ||
            device.specs?.system?.manufacturer ||
            specKeyMatch(['manufacturer', 'vendor', 'make', 'system manufacturer']) ||
            null;
        const manufacturer = typeof manufacturerRaw === 'string' && manufacturerRaw.trim()
            ? manufacturerRaw.trim()
            : null;
        const modelRaw = device.model || device.specs?.system?.model || specKeyMatch(['model', 'system model']) || null;
        const model = manufacturer && typeof modelRaw === 'string' && modelRaw.trim() ? modelRaw.trim() : null;
        console.log('==============================');
        console.log('Device Vendor:', device.vendor);
        console.log('Manufacturer from Specs:', item.specs?.find((spec) => ['manufacturer', 'vendor', 'make'].includes(spec.key.toLowerCase().trim()))?.value);
        console.log('Resolved Manufacturer:', manufacturer);
        console.log('Device Model:', device.model);
        const assetDto = {
            asset_item_id: assetItemId,
            asset_title: title,
            asset_description: `Imported from network discovery (${device.ip})`,
            manufacturer,
            model,
            asset_added_by: effectiveUserId,
        };
        console.log('Asset DTO:', JSON.stringify(assetDto, null, 2));
        console.log('==============================');
        const assetResult = await this.assetDataService.addAsset(assetDto, organizationId, effectiveUserId, schema);
        if (assetResult?.status !== 'success') {
            return {
                deviceId: item.deviceId,
                status: 'failed',
                message: assetResult?.message ||
                    assetResult?.error ||
                    'Failed to create asset',
            };
        }
        const assetId = assetResult.data.asset_id;
        const stockDto = {
            asset_id: assetId,
            asset_item_id: assetItemId,
            asset_title: title,
            quantity: 1,
            total_available_quantity: 1,
            location_id: locationMappingId,
            asset_ownership_status: item.ownershipStatusId ?? 1,
            created_by: effectiveUserId,
            information_fields: JSON.stringify(informationFields),
            assetDetails: [
                {
                    serial_number: serialNumber,
                    department_id: null,
                    location_id: locationMappingId,
                    project_id: null,
                    cost_center_id: null,
                    asset_used_by: null,
                    asset_managed_by: null,
                    asset_item_id: assetItemId,
                    status_type_id: 1,
                },
            ],
        };
        let stockResult;
        try {
            stockResult = await this.stocksService.createStocks(stockDto, organizationId, schema, req);
        }
        catch (error) {
            return {
                deviceId: item.deviceId,
                status: 'failed',
                message: error?.message || 'Failed to create stock',
                assetId,
            };
        }
        await this.dataSource.query(`UPDATE ${schema}.asset_stock_serials
       SET source_device_id = $1, discovered_mac = $2::macaddr
       WHERE asset_id = $3 AND asset_item_id = $4 AND stock_serials = $5`, [
            Number(device.id),
            device.mac ?? null,
            assetId,
            assetItemId,
            serialNumber,
        ]);
        const serialRows = await this.dataSource.query(`SELECT asset_stocks_unique_id FROM ${schema}.asset_stock_serials
       WHERE asset_id = $1 AND asset_item_id = $2 AND stock_serials = $3 AND is_deleted = 0
       ORDER BY asset_stocks_unique_id DESC LIMIT 1`, [assetId, assetItemId, serialNumber]);
        const hostSerialId = serialRows[0]?.asset_stocks_unique_id
            ? Number(serialRows[0].asset_stocks_unique_id)
            : null;
        let softwareSummary;
        if (hostSerialId) {
            softwareSummary = await this.processSoftwareForHost(schema, item, hostSerialId, Number(device.id), locationMappingId, title, organizationId, effectiveUserId, req);
        }
        return {
            deviceId: item.deviceId,
            status: 'created',
            assetId,
            stockId: stockResult?.stock_id,
            serialUniqueId: hostSerialId ?? undefined,
            software: softwareSummary,
        };
    }
    async processSoftwareForHost(schema, item, hostSerialId, hostDeviceId, hostLocationMappingId, hostName, organizationId, userId, req) {
        if (!Array.isArray(item.software) || !item.software.length)
            return undefined;
        try {
            return await this.softwareInventoryService.processForHost({
                schema,
                hostSerialId,
                hostDeviceId,
                hostLocationMappingId,
                hostName,
                organizationId,
                userId,
                req,
            }, item.software);
        }
        catch (error) {
            console.error('Discovery import: software processing failed:', error);
            return {
                discovered: item.software.length,
                tracked: 0,
                notTracked: 0,
                failed: item.software.length,
                details: item.software.map((sw) => ({
                    softwareKey: sw.softwareKey || '',
                    name: sw.name,
                    status: 'FAILED',
                    maintainInventory: !!sw.maintainInventory,
                    message: error?.message ?? 'Software processing failed',
                })),
            };
        }
    }
    async checkDedupe(schema, device) {
        if (device.id) {
            const rows = await this.dataSource.query(`SELECT * FROM ${schema}.asset_stock_serials WHERE source_device_id = $1 AND is_deleted = 0 LIMIT 1`, [Number(device.id)]);
            if (rows[0])
                return { status: 'imported', existingSerial: rows[0] };
        }
        if (device.mac) {
            const rows = await this.dataSource.query(`SELECT * FROM ${schema}.asset_stock_serials WHERE discovered_mac = $1::macaddr AND is_deleted = 0 LIMIT 1`, [device.mac]);
            if (rows[0])
                return { status: 'update-candidate', existingSerial: rows[0] };
        }
        return { status: 'new' };
    }
    async resolveItem(schema, item, organizationId, userId) {
        if (item.itemId) {
            const rows = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_id = $1 AND is_deleted = 0 LIMIT 1`, [item.itemId]);
            if (!rows[0])
                throw new common_1.BadRequestException(`Asset item ${item.itemId} not found`);
            return rows[0].asset_item_id;
        }
        let mainCategoryId = item.categoryId;
        if (!mainCategoryId) {
            if (!item.newCategoryName?.trim()) {
                throw new common_1.BadRequestException('categoryId or newCategoryName is required when itemId is not provided');
            }
            mainCategoryId = await this.findOrCreateCategory(schema, item.newCategoryName, userId);
        }
        let subCategoryId = item.subCategoryId;
        if (!subCategoryId) {
            if (!item.newSubCategoryName?.trim()) {
                throw new common_1.BadRequestException('subCategoryId or newSubCategoryName is required when itemId is not provided');
            }
            subCategoryId = await this.findOrCreateSubCategory(schema, item.newSubCategoryName, mainCategoryId, userId);
        }
        return this.findOrCreateItem(schema, item, subCategoryId, mainCategoryId, organizationId, userId);
    }
    async findOrCreateCategory(schema, name, userId) {
        const trimmed = name.trim();
        const existingRows = await this.dataSource.query(`SELECT main_category_id FROM ${schema}.asset_main_category WHERE main_category_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [trimmed]);
        if (existingRows[0])
            return existingRows[0].main_category_id;
        await this.assetCategoriesService.create({
            main_category_name: trimmed,
            added_by: userId,
        });
        const createdRows = await this.dataSource.query(`SELECT main_category_id FROM ${schema}.asset_main_category WHERE main_category_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [trimmed]);
        if (!createdRows[0])
            throw new common_1.BadRequestException(`Failed to create category '${trimmed}'`);
        return createdRows[0].main_category_id;
    }
    async findOrCreateSubCategory(schema, name, mainCategoryId, userId) {
        const trimmed = name.trim();
        const existingRows = await this.dataSource.query(`SELECT sub_category_id FROM ${schema}.asset_sub_category
       WHERE sub_category_name ILIKE $1 AND main_category_id = $2 AND is_deleted = 0 LIMIT 1`, [trimmed, mainCategoryId]);
        if (existingRows[0])
            return existingRows[0].sub_category_id;
        try {
            await this.assetSubcategoriesService.createNewAssetSubCategory({
                sub_category_name: trimmed,
                main_category_id: mainCategoryId,
                added_by: userId,
            });
        }
        catch {
        }
        const createdRows = await this.dataSource.query(`SELECT sub_category_id FROM ${schema}.asset_sub_category
       WHERE sub_category_name ILIKE $1 AND main_category_id = $2 AND is_deleted = 0 LIMIT 1`, [trimmed, mainCategoryId]);
        if (!createdRows[0])
            throw new common_1.BadRequestException(`Failed to create subcategory '${trimmed}'`);
        return createdRows[0].sub_category_id;
    }
    async findOrCreateItem(schema, item, subCategoryId, mainCategoryId, organizationId, userId) {
        if (!item.newItemName?.trim()) {
            throw new common_1.BadRequestException('itemId or newItemName is required');
        }
        const trimmed = item.newItemName.trim();
        const existingRows = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [trimmed]);
        if (existingRows[0])
            return existingRows[0].asset_item_id;
        try {
            const newItemDto = {
                asset_item_name: trimmed,
                sub_category_id: subCategoryId,
                main_category_id: mainCategoryId,
                item_type: item.itemType || asset_item_enums_1.ItemType.PHYSICAL,
                is_licensable: false,
                has_depreciation: false,
                added_by: userId,
            };
            await this.assetItemsService.createNewAssetItem(newItemDto, undefined, organizationId);
        }
        catch {
        }
        const createdRows = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [trimmed]);
        if (!createdRows[0])
            throw new common_1.BadRequestException(`Failed to create asset item '${trimmed}'`);
        return createdRows[0].asset_item_id;
    }
    async resolveLocation(schema, item, defaults, userId) {
        if (item.locationMappingId) {
            const rows = await this.dataSource.query(`SELECT location_mapping_id FROM ${schema}.location_branch_mapping WHERE location_mapping_id = $1 AND is_deleted = 0 LIMIT 1`, [item.locationMappingId]);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Location mapping ${item.locationMappingId} not found`);
            }
            return rows[0].location_mapping_id;
        }
        if (item.newLocation?.name?.trim()) {
            return this.createLocation(schema, item.newLocation, userId);
        }
        if (defaults?.locationMappingId) {
            const rows = await this.dataSource.query(`SELECT location_mapping_id FROM ${schema}.location_branch_mapping WHERE location_mapping_id = $1 AND is_deleted = 0 LIMIT 1`, [defaults.locationMappingId]);
            if (rows[0])
                return rows[0].location_mapping_id;
        }
        return this.ensureDiscoveryLocation(schema, userId);
    }
    async firstActiveBranchId(schema) {
        const rows = await this.dataSource.query(`SELECT branch_id FROM ${schema}.branches WHERE is_active = 1 AND is_deleted = 0 ORDER BY branch_id ASC LIMIT 1`);
        return rows[0]?.branch_id ?? null;
    }
    async createLocation(schema, newLocation, userId) {
        const branchId = newLocation.branchId ?? (await this.firstActiveBranchId(schema));
        if (!branchId) {
            throw new common_1.BadRequestException('No active branch found to attach the new location to');
        }
        let locationType = null;
        if (newLocation.locationTypeId) {
            const rows = await this.dataSource.query(`SELECT type_id, type_code FROM ${schema}.location_types WHERE type_id = $1 LIMIT 1`, [newLocation.locationTypeId]);
            locationType = rows[0] ?? null;
        }
        else {
            const rows = await this.dataSource.query(`SELECT type_id, type_code FROM ${schema}.location_types WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 1`);
            locationType = rows[0] ?? null;
        }
        const insertedRows = await this.dataSource.query(`INSERT INTO ${schema}.asset_locations
         (location_name, location_type_id, location_type_code, location_level, path, is_active, is_deleted, created_by)
       VALUES ($1, $2, $3, 0, '/', 1, 0, $4)
       RETURNING location_id`, [
            newLocation.name.trim(),
            locationType?.type_id ?? null,
            locationType?.type_code ?? null,
            userId,
        ]);
        const locationId = insertedRows[0].location_id;
        await this.dataSource.query(`UPDATE ${schema}.asset_locations SET path = $1 WHERE location_id = $2`, [`/${locationId}/`, locationId]);
        const mappingRows = await this.dataSource.query(`INSERT INTO ${schema}.location_branch_mapping
         (location_id, branch_id, type_id, is_active, is_deleted, updated_by)
       VALUES ($1, $2, $3, 1, 0, $4)
       RETURNING location_mapping_id`, [locationId, branchId, locationType?.type_id ?? null, userId]);
        return mappingRows[0].location_mapping_id;
    }
    async ensureDiscoveryLocation(schema, userId) {
        const locationRows = await this.dataSource.query(`SELECT location_id, location_type_id FROM ${schema}.asset_locations
       WHERE location_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [FALLBACK_LOCATION_NAME]);
        let locationId;
        let locationTypeId;
        if (!locationRows.length) {
            const typeRows = await this.dataSource.query(`SELECT type_id, type_code FROM ${schema}.location_types WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 1`);
            const locationType = typeRows[0] ?? null;
            const insertedRows = await this.dataSource.query(`INSERT INTO ${schema}.asset_locations
           (location_name, location_type_id, location_type_code, location_level, path, is_active, is_deleted, created_by)
         VALUES ($1, $2, $3, 0, '/', 1, 0, $4)
         RETURNING location_id, location_type_id`, [
                FALLBACK_LOCATION_NAME,
                locationType?.type_id ?? null,
                locationType?.type_code ?? null,
                userId,
            ]);
            locationId = insertedRows[0].location_id;
            locationTypeId = insertedRows[0].location_type_id ?? null;
            await this.dataSource.query(`UPDATE ${schema}.asset_locations SET path = $1 WHERE location_id = $2`, [`/${locationId}/`, locationId]);
        }
        else {
            locationId = locationRows[0].location_id;
            locationTypeId = locationRows[0].location_type_id ?? null;
        }
        let mappingRows = await this.dataSource.query(`SELECT location_mapping_id FROM ${schema}.location_branch_mapping WHERE location_id = $1 AND is_deleted = 0 LIMIT 1`, [locationId]);
        if (!mappingRows.length) {
            const branchId = await this.firstActiveBranchId(schema);
            if (!branchId) {
                throw new common_1.BadRequestException(`No active branch found to attach the fallback "${FALLBACK_LOCATION_NAME}" location to`);
            }
            mappingRows = await this.dataSource.query(`INSERT INTO ${schema}.location_branch_mapping
           (location_id, branch_id, type_id, is_active, is_deleted, updated_by)
         VALUES ($1, $2, $3, 1, 0, $4)
         RETURNING location_mapping_id`, [locationId, branchId, locationTypeId, userId]);
        }
        return mappingRows[0].location_mapping_id;
    }
    async fetchItemFields(schema, itemId) {
        const rows = await this.dataSource.query(`SELECT
         m.aif_mapping_id,
         m.asset_field_id,
         m.asset_field_category_id,
         fc.asset_field_category_name,
         f.asset_field_name,
         f.asset_field_label_name,
         f.asset_field_type
       FROM ${schema}.asset_items_fields_mapping m
       LEFT JOIN ${schema}.asset_fields f ON f.asset_field_id = m.asset_field_id
       LEFT JOIN ${schema}.asset_field_category fc ON fc.asset_field_category_id = m.asset_field_category_id
       WHERE m.asset_item_id = $1 AND m.aif_is_active = 1 AND m.aif_is_deleted = 0
       ORDER BY m.asset_field_category_id ASC, m.aif_sequence ASC`, [itemId]);
        return rows.map((m) => ({
            aif_mapping_id: m.aif_mapping_id,
            asset_field_id: m.asset_field_id,
            asset_field_category_id: m.asset_field_category_id ?? null,
            asset_field_category_name: m.asset_field_category_name ?? null,
            asset_field_name: m.asset_field_name ?? null,
            asset_field_label_name: m.asset_field_label_name ?? null,
            asset_field_type: m.asset_field_type ?? null,
        }));
    }
    async buildInformationFields(schema, item, assetItemId, userId) {
        const specs = item.specs || [];
        if (!specs.length)
            return [];
        const fields = await this.fetchItemFields(schema, assetItemId);
        const out = [];
        for (const spec of specs) {
            let field = spec.fieldId
                ? (fields.find((f) => f.asset_field_id === spec.fieldId) ?? null)
                : null;
            if (!field) {
                let best = null;
                for (const f of fields) {
                    const score = Math.max(fuzzyScore(spec.key, f.asset_field_label_name), fuzzyScore(spec.key, f.asset_field_name));
                    if (score > (best?.score ?? 0))
                        best = { field: f, score };
                }
                if (best && best.score >= MIN_FIELD_CONFIDENCE)
                    field = best.field;
            }
            if (!field && spec.createField) {
                field = await this.createFieldForItem(schema, spec, assetItemId, userId);
            }
            if (!field)
                continue;
            out.push({
                asset_field_id: field.asset_field_id,
                asset_field_category_id: field.asset_field_category_id,
                asset_field_category_name: field.asset_field_category_name,
                asset_field_label_name: field.asset_field_label_name,
                value: spec.value,
            });
        }
        return out;
    }
    async defaultFieldCategoryId(schema) {
        const rows = await this.dataSource.query(`SELECT asset_field_category_id FROM ${schema}.asset_field_category
       WHERE is_active = 1 AND is_deleted = 0 ORDER BY asset_field_category_id ASC LIMIT 1`);
        if (!rows[0]) {
            throw new common_1.BadRequestException('No asset field category exists to attach a new field to');
        }
        return rows[0].asset_field_category_id;
    }
    async createFieldForItem(schema, spec, assetItemId, userId) {
        const label = spec.createField.label?.trim() || spec.key;
        const fieldCategoryId = spec.createField.fieldCategoryId ??
            (await this.defaultFieldCategoryId(schema));
        const createDto = {
            asset_field_category_id: fieldCategoryId,
            asset_field_name: label,
            asset_field_description: null,
            asset_field_label_name: label,
            asset_field_type_details: null,
            asset_field_type: 'text',
            is_active: 1,
            is_deleted: 0,
            added_by: userId,
            created_at: new Date(),
            updated_at: new Date(),
            is_custom_field: true,
            is_multiple: false,
        };
        const createResult = await this.assetFieldsService.create(createDto);
        let savedField = createResult?.data ?? null;
        if (!savedField) {
            const rows = await this.dataSource.query(`SELECT asset_field_id, asset_field_name, asset_field_label_name, asset_field_type
         FROM ${schema}.asset_fields WHERE asset_field_label_name ILIKE $1 LIMIT 1`, [label]);
            savedField = rows[0] ?? null;
        }
        if (!savedField)
            throw new common_1.BadRequestException(`Failed to create field '${label}'`);
        const mappingDto = {
            asset_item_id: assetItemId,
            aif_is_enabled: 1,
            aif_is_mandatory: 0,
            is_individual: 0,
            aif_is_active: 1,
            aif_is_deleted: 0,
            aif_added_by: userId,
            aif_description: null,
            asset_field_category_id: fieldCategoryId,
            asset_field_id: savedField.asset_field_id,
            assetFields: { asset_field_id: savedField.asset_field_id },
        };
        await this.itemFieldsMappingService.addItemFields([
            mappingDto,
        ]);
        const categoryRows = await this.dataSource.query(`SELECT asset_field_category_name FROM ${schema}.asset_field_category WHERE asset_field_category_id = $1 LIMIT 1`, [fieldCategoryId]);
        return {
            aif_mapping_id: 0,
            asset_field_id: savedField.asset_field_id,
            asset_field_category_id: fieldCategoryId,
            asset_field_category_name: categoryRows[0]?.asset_field_category_name ?? null,
            asset_field_name: savedField.asset_field_name,
            asset_field_label_name: savedField.asset_field_label_name,
            asset_field_type: savedField.asset_field_type,
        };
    }
    async suggestCategorySubItem(schema, device) {
        const hints = [
            ...(CATEGORY_HINTS[device.category] || []),
            device.vendor || '',
            device.model || '',
            device.category || '',
        ].filter(Boolean);
        console.log('Hints:', hints);
        console.log('Device:', {
            category: device.category,
            vendor: device.vendor,
            model: device.model,
            hostname: device.hostname,
            os: device.os,
        });
        const categories = await this.dataSource.query(`SELECT main_category_id, main_category_name FROM ${schema}.asset_main_category
       WHERE is_active = 1 AND is_deleted = 0`);
        const categoryBest = bestMatch(categories, (c) => c.main_category_name, hints);
        const subCategories = categoryBest
            ? await this.dataSource.query(`SELECT sub_category_id, sub_category_name, main_category_id FROM ${schema}.asset_sub_category
           WHERE main_category_id = $1 AND is_active = 1 AND is_deleted = 0`, [categoryBest.candidate.main_category_id])
            : await this.dataSource.query(`SELECT sub_category_id, sub_category_name, main_category_id FROM ${schema}.asset_sub_category
           WHERE is_active = 1 AND is_deleted = 0`);
        console.log('SubCategories:', subCategories);
        const subCategoryBest = bestMatch(subCategories, (s) => s.sub_category_name, hints);
        let itemsSql = `SELECT asset_item_id, asset_item_name, sub_category_id, main_category_id
                     FROM ${schema}.asset_items WHERE is_active = 1 AND is_deleted = 0`;
        const itemParams = [];
        if (subCategoryBest) {
            itemsSql += ' AND sub_category_id = $1';
            itemParams.push(subCategoryBest.candidate.sub_category_id);
        }
        else if (categoryBest) {
            itemsSql += ' AND main_category_id = $1';
            itemParams.push(categoryBest.candidate.main_category_id);
        }
        const items = await this.dataSource.query(itemsSql, itemParams);
        const itemBest = bestMatch(items, (i) => i.asset_item_name || '', hints);
        return {
            category: categoryBest
                ? {
                    main_category_id: categoryBest.candidate.main_category_id,
                    main_category_name: categoryBest.candidate.main_category_name,
                    confidence: round2(categoryBest.score),
                }
                : null,
            subCategory: subCategoryBest
                ? {
                    sub_category_id: subCategoryBest.candidate.sub_category_id,
                    sub_category_name: subCategoryBest.candidate.sub_category_name,
                    confidence: round2(subCategoryBest.score),
                }
                : null,
            item: itemBest
                ? {
                    asset_item_id: itemBest.candidate.asset_item_id,
                    asset_item_name: itemBest.candidate.asset_item_name,
                    confidence: round2(itemBest.score),
                }
                : null,
        };
    }
    flattenSpecs(device) {
        const out = [];
        const seen = new Set();
        const push = (key, value) => {
            if (value === undefined || value === null || value === '')
                return;
            if (seen.has(key))
                return;
            seen.add(key);
            out.push({ key, value });
        };
        const specs = device.specs;
        if (specs) {
            push('hostname', specs.hostname);
            push('domain', specs.domain);
            push('current user', specs.currentUser);
            push('operating system', specs.os?.caption);
            push('os version', specs.os?.version);
            push('os build', specs.os?.build);
            push('os architecture', specs.os?.arch);
            push('cpu model', specs.cpu?.model);
            push('cpu cores', specs.cpu?.cores);
            push('cpu speed ghz', specs.cpu?.speedGHz);
            push('ram gb', specs.ramGB);
            if (Array.isArray(specs.disks) && specs.disks.length) {
                push('disk model', specs.disks[0]?.model);
                push('disk size gb', specs.disks[0]?.sizeGB);
            }
            push('manufacturer', specs.system?.manufacturer);
            push('model', specs.system?.model);
            push('serial number', specs.system?.serial);
            push('asset tag', specs.system?.asset);
        }
        push('manufacturer', device.vendor);
        push('model', device.model);
        push('ip address', device.ip);
        push('mac address', device.mac);
        push('hostname', device.hostname);
        push('operating system', device.os);
        push('device type', device.category && device.category !== 'unknown'
            ? device.category
            : undefined);
        if (Array.isArray(device.openPorts) && device.openPorts.length) {
            push('open ports', device.openPorts.join(', '));
        }
        if (Array.isArray(device.services) && device.services.length) {
            push('services', device.services.join(', '));
        }
        return out;
    }
    async matchSpecsToItemFields(schema, device, itemId) {
        const fields = await this.fetchItemFields(schema, itemId);
        const specs = this.flattenSpecs(device);
        console.log('Item Id:', itemId);
        console.log('Fields:', fields);
        console.log('Specs:', specs);
        console.log('MIN_FIELD_CONFIDENCE:', MIN_FIELD_CONFIDENCE);
        return specs.map((spec) => {
            let best = null;
            for (const field of fields) {
                const labelScore = fuzzyScore(spec.key, field.asset_field_label_name);
                const nameScore = fuzzyScore(spec.key, field.asset_field_name);
                const score = Math.max(fuzzyScore(spec.key, field.asset_field_label_name), fuzzyScore(spec.key, field.asset_field_name));
                console.log({
                    spec: spec.key,
                    field: field.asset_field_label_name,
                    labelScore,
                    nameScore,
                    score,
                });
                if (score > (best?.score ?? 0))
                    best = { field, score };
            }
            return {
                key: spec.key,
                value: spec.value,
                matchedField: best && best.score >= MIN_FIELD_CONFIDENCE ? best.field : null,
                confidence: best ? round2(best.score) : 0,
            };
        });
    }
    async getCategoryTree(schema) {
        const categories = await this.dataSource.query(`SELECT main_category_id, main_category_name FROM ${schema}.asset_main_category
       WHERE is_active = 1 AND is_deleted = 0 ORDER BY main_category_name ASC`);
        const subCategories = await this.dataSource.query(`SELECT sub_category_id, sub_category_name, main_category_id FROM ${schema}.asset_sub_category
       WHERE is_active = 1 AND is_deleted = 0 ORDER BY sub_category_name ASC`);
        const items = await this.dataSource.query(`SELECT asset_item_id, asset_item_name, sub_category_id, item_type FROM ${schema}.asset_items
       WHERE is_active = 1 AND is_deleted = 0 ORDER BY asset_item_name ASC`);
        return categories.map((c) => ({
            main_category_id: c.main_category_id,
            main_category_name: c.main_category_name,
            subCategories: subCategories
                .filter((s) => s.main_category_id === c.main_category_id)
                .map((s) => ({
                sub_category_id: s.sub_category_id,
                sub_category_name: s.sub_category_name,
                items: items
                    .filter((i) => i.sub_category_id === s.sub_category_id)
                    .map((i) => ({
                    asset_item_id: i.asset_item_id,
                    asset_item_name: i.asset_item_name,
                    item_type: i.item_type,
                })),
            })),
        }));
    }
    async getLocationOptions(schema) {
        const rows = await this.dataSource.query(`SELECT
         lbm.location_mapping_id,
         lbm.location_id,
         loc.location_name,
         lbm.branch_id,
         br.branch_name
       FROM ${schema}.location_branch_mapping lbm
       JOIN ${schema}.asset_locations loc ON loc.location_id = lbm.location_id AND loc.is_deleted = 0
       LEFT JOIN ${schema}.branches br ON br.branch_id = lbm.branch_id
       WHERE lbm.is_deleted = 0 AND lbm.is_active = 1`);
        return rows.map((m) => ({
            location_mapping_id: m.location_mapping_id,
            location_id: m.location_id,
            location_name: m.location_name ?? null,
            branch_id: m.branch_id,
            branch_name: m.branch_name ?? null,
        }));
    }
    async getOwnershipTypes(schema) {
        const rows = await this.dataSource.query(`SELECT ownership_status_type_id, ownership_status_type_name FROM ${schema}.asset_ownership_status_types
       WHERE is_active = 1 ORDER BY ownership_status_type_name ASC`);
        return rows.map((r) => ({
            ownership_status_type_id: r.ownership_status_type_id,
            ownership_status_type_name: r.ownership_status_type_name,
        }));
    }
};
exports.DiscoveryImportService = DiscoveryImportService;
exports.DiscoveryImportService = DiscoveryImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository,
        database_service_1.DatabaseService,
        typeorm_2.DataSource,
        asset_data_service_1.AssetDataService,
        stocks_service_1.StocksService,
        asset_items_service_1.AssetItemsService,
        asset_categories_service_1.AssetCategoriesService,
        asset_subcategories_service_1.AssetSubcategoriesService,
        asset_fields_service_1.AssetFieldsService,
        asset_items_fields_mapping_service_1.AssetItemsFieldsMappingService,
        software_inventory_service_1.SoftwareInventoryService,
        asset_mapping_service_1.AssetMappingService,
        auto_collect_service_1.EndpointAutoCollectService])
], DiscoveryImportService);
function normalize(s) {
    return (s || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}
function fuzzyScore(a, b) {
    const na = normalize(a);
    const nb = normalize(b);
    if (!na || !nb)
        return 0;
    if (na === nb)
        return 1;
    if (na.includes(nb) || nb.includes(na))
        return 0.8;
    const aTokens = new Set(na.split(' ').filter(Boolean));
    const bTokens = new Set(nb.split(' ').filter(Boolean));
    let overlap = 0;
    for (const t of aTokens)
        if (bTokens.has(t))
            overlap++;
    const denom = Math.max(aTokens.size, bTokens.size) || 1;
    return overlap / denom;
}
function bestMatch(candidates, nameOf, hints) {
    let best = null;
    for (const c of candidates) {
        const name = nameOf(c);
        let score = 0;
        for (const hint of hints) {
            score = Math.max(score, fuzzyScore(name, hint));
        }
        if (score > (best?.score ?? 0))
            best = { candidate: c, score };
        console.log('Final score:', name, score);
    }
    return best && best.score >= MIN_CATEGORY_CONFIDENCE ? best : null;
}
function round2(n) {
    return Number(n.toFixed(2));
}
