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
exports.AssetItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const database_service_1 = require("../../dynamic-schema/database.service");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_item_entity_1 = require("./entities/asset-item.entity");
const asset_categories_service_1 = require("../asset-categories/asset-categories.service");
const asset_subcategories_service_1 = require("../asset-subcategories/asset-subcategories.service");
const asset_depreciation_service_1 = require("../../asset-depreciation/asset-depreciation.service");
const stock_summary_refresh_service_1 = require("../stocks/stock-summary-refresh.service");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const keyset_pagination_1 = require("../../common/pagination/keyset-pagination");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
const redis_service_1 = require("../../common/redis/redis.service");
const entity_lookup_service_1 = require("../../organizational-profile/entity-lookup.service");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_vendors_entity_1 = require("../../organizational-profile/entity/organizational-vendors.entity");
const block_of_assets_entity_1 = require("../../organizational-profile/public_schema_entity/block_of_assets.entity");
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_data_service_1 = require("../asset-data/asset-data.service");
const manufacturer_entity_1 = require("../asset-data/entities/manufacturer.entity");
const models_entity_1 = require("../asset-data/entities/models.entity");
const asset_items_fields_mapping_entity_1 = require("../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity");
const asset_ownership_status_entity_1 = require("../asset-ownership-status/entities/asset-ownership-status.entity");
const asset_subcategory_entity_1 = require("../asset-subcategories/entities/asset-subcategory.entity");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const stocks_service_1 = require("../stocks/stocks.service");
const asset_item_enums_1 = require("./entities/asset-item.enums");
const branch_access_1 = require("../../branch-access/branch-access");
const cache_key_util_1 = require("../../common/redis/cache-key.util");
const policy_attribute_entity_1 = require("../../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../../organizational-profile/entity/policy-builder/special-permission-master");
var ItemType;
(function (ItemType) {
    ItemType["PHYSICAL"] = "Physical";
    ItemType["VIRTUAL"] = "Virtual";
})(ItemType || (ItemType = {}));
let AssetItemsService = class AssetItemsService {
    constructor(dataSource, databaseService, redisService, entityLookupService, assetCategoriesService, assetSubCategoriesService, stocksService, assetDataService, assetItemRepository, categoryepository, subCategoryRepository, serialRepo, AssetItemsFieldsMapping, modelsRepo, manufacturerRepo, vendorsRepo, locationsRepo, ownershipRepo, AssetBlock, depViewService, stockSummaryRefresh, dropdownCache, specialPermissionRepo, policyAttrRepo) {
        this.dataSource = dataSource;
        this.databaseService = databaseService;
        this.redisService = redisService;
        this.entityLookupService = entityLookupService;
        this.assetCategoriesService = assetCategoriesService;
        this.assetSubCategoriesService = assetSubCategoriesService;
        this.stocksService = stocksService;
        this.assetDataService = assetDataService;
        this.assetItemRepository = assetItemRepository;
        this.categoryepository = categoryepository;
        this.subCategoryRepository = subCategoryRepository;
        this.serialRepo = serialRepo;
        this.AssetItemsFieldsMapping = AssetItemsFieldsMapping;
        this.modelsRepo = modelsRepo;
        this.manufacturerRepo = manufacturerRepo;
        this.vendorsRepo = vendorsRepo;
        this.locationsRepo = locationsRepo;
        this.ownershipRepo = ownershipRepo;
        this.AssetBlock = AssetBlock;
        this.depViewService = depViewService;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.dropdownCache = dropdownCache;
        this.specialPermissionRepo = specialPermissionRepo;
        this.policyAttrRepo = policyAttrRepo;
        this.STATIC_HEADERS = [
            {
                label: 'Manufacturer',
                required: false,
                type: 'dropdown',
                source: 'manufacturers',
            },
            { label: 'Model', required: false, type: 'dropdown', source: 'models' },
            { label: 'Display Name', required: true, type: 'text' },
            {
                label: 'Ownership',
                required: false,
                type: 'dropdown',
                source: 'ownership',
            },
            {
                label: 'Location',
                required: true,
                type: 'dropdown',
                source: 'locations',
            },
            { label: 'Notes', required: false, type: 'text' },
            { label: 'Vendor', required: false, type: 'dropdown', source: 'vendors' },
            { label: 'Bill No', required: false, type: 'text' },
            { label: 'Purchase Date', required: false, type: 'date' },
            { label: 'Quantity', required: true, type: 'number' },
            { label: 'Unit Price', required: false, type: 'number' },
            { label: 'Total Amount', required: false, type: 'formula' },
            { label: 'GST %', required: false, type: 'number' },
            { label: 'GST Amount', required: false, type: 'formula' },
            { label: 'Grand Total Amount', required: false, type: 'formula' },
        ];
        this.SAMPLE_ROW_TEMPLATE = {
            Manufacturer: 'Dell',
            Model: 'Dell Latitude',
            'Display Name': 'Sample Asset',
            Ownership: 'Owned',
            Location: 'Pune Office',
            Vendor: 'ABC Suppliers',
            'Bill No': 'BILL-1001',
            'Purchase Date': '13/04/2027',
            Quantity: 1,
            'Unit Price': 1000,
            'GST %': 18,
            'Warranty Start Date': '13/04/2027',
            'Warranty End Date': '13/04/2028',
            Notes: 'Sample row for reference',
        };
    }
    buildSampleRow(headers, dropdownSources) {
        return headers.map((h) => {
            const label = h.label;
            if (h.type === 'formula') {
                return undefined;
            }
            if (h.type === 'dropdown') {
                if (h.source && dropdownSources[h.source]?.length) {
                    return dropdownSources[h.source][0];
                }
                if (h.values?.length) {
                    return h.values[0];
                }
            }
            return this.SAMPLE_ROW_TEMPLATE[label] ?? '';
        });
    }
    async generateAssetTemplate(asset_item_id, includeSampleRow = false) {
        if (!asset_item_id) {
            throw new common_1.BadRequestException('Item ID is required');
        }
        const item = await this.assetItemRepository.findOne({
            where: { asset_item_id, is_active: 1 },
        });
        console.log('ITEM', item);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        const itemType = item.item_type;
        console.log('ITEM TYPE', itemType);
        const rawWarrantyType = item.warranty_type;
        const warrantyTypes = Array.isArray(rawWarrantyType)
            ? rawWarrantyType
            : typeof rawWarrantyType === 'string'
                ? rawWarrantyType.split(',')
                : [];
        const warrantySet = new Set(warrantyTypes
            .map((v) => v.trim())
            .filter((v) => Object.values(asset_item_enums_1.WarrantyType).includes(v)));
        const res = await this.assetDataService.getManufacturerDropdown(itemType, asset_item_id);
        let manufacturerOptions = [];
        const manufacturerModelMap = {};
        manufacturerOptions =
            res.dropdown?.map((m) => m.manufacturer_name) || [];
        for (const m of res.dropdown || []) {
            const models = await this.assetDataService.getModelByManufacturer(m.manufacturer_id);
            manufacturerModelMap[m.manufacturer_name] =
                models?.map((mod) => mod.model_name) || [];
        }
        console.log('manufacturerOptions:', manufacturerOptions);
        console.log('manufacturerModelMap:', manufacturerModelMap);
        try {
            const ownershipStatusOptions = (await this.ownershipRepo.find({
                where: { is_active: 1, is_deleted: 0 },
                select: ['ownership_status_type_name'],
            })).map((o) => o.ownership_status_type_name);
            const locationOptions = (await this.locationsRepo.find({
                where: { is_active: 1, is_deleted: 0 },
                select: ['location_name'],
            })).map((l) => l.location_name);
            const vendorOptions = (await this.vendorsRepo.find({
                where: { is_active: 1, is_deleted: 0 },
                select: ['vendor_name'],
            })).map((v) => v.vendor_name);
            const itemResponse = await this.fetchSingleItemDataForForm({
                asset_item_id,
            });
            if (!itemResponse || itemResponse.status !== 200)
                throw new common_1.NotFoundException('Item not found');
            const itemData = itemResponse.data;
            let customFields = itemData.customFields || [];
            const allowedTypes = ['text', 'dropdown', 'date'];
            customFields = customFields.filter((field) => allowedTypes.includes(field.asset_field_type) &&
                field.is_individual !== 1);
            console.log('customFields', customFields);
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('Asset_Template');
            const dataSheet = workbook.addSheet('Data');
            const HEADER_ROW = 7;
            const DATA_ROW = 8;
            const MAX_ROWS = 3000;
            mainSheet.cell(1, 1).value(`Item: ${itemData.asset_item_name}`).style({
                bold: true,
                fontColor: '000000',
                horizontalAlignment: 'left',
            });
            const instructions = [
                'Instructions:',
                '1. Fill asset details starting from row 8.',
                '2. Do not modify header row or excle cells any way.',
                '3. For Manufacturer and Model columns: You can either select from dropdown OR type your own value.',
                '4. Other dropdown columns: Must select from dropdown only.',
                '5. Column Colour Mean Red = Required, Orange = Required + Dropdown, SkyBlue = Dropdown Only, Lavender = Dropdown OR Free Text',
            ];
            instructions.forEach((text, idx) => {
                mainSheet
                    .cell(idx + 2, 1)
                    .value(text)
                    .style({ bold: true, fontColor: '0000FF' });
            });
            const staticHeaders = this.STATIC_HEADERS.map((header) => ({
                ...header,
            }));
            const normalizedItemType = String(itemType).trim().toLowerCase();
            staticHeaders.forEach((header) => {
                if (normalizedItemType === 'physical') {
                    if (header.label === 'Publisher') {
                        header.label = 'Manufacturer';
                    }
                    if (header.label === 'Software Name') {
                        header.label = 'Model';
                    }
                }
                if (normalizedItemType === 'virtual') {
                    if (header.label === 'Manufacturer') {
                        header.label = 'Publisher';
                    }
                    if (header.label === 'Model') {
                        header.label = 'Software Name';
                    }
                }
            });
            const headers = [...staticHeaders];
            const warrantyColumnsMap = {
                [asset_item_enums_1.WarrantyType.SUBSCRIPTION]: [
                    { label: 'Subscription Start Date', type: 'date' },
                    { label: 'Next Renewal Date', type: 'date' },
                    {
                        label: 'Subscription Type',
                        type: 'dropdown',
                        values: ['Subscription', 'Perpetual', 'Perpetual with Support'],
                    },
                    {
                        label: 'Billing Frequency',
                        type: 'dropdown',
                        values: [
                            'Monthly',
                            'Quarterly',
                            'Semi-Annually',
                            'Annually',
                            'One-Time',
                        ],
                    },
                ],
                [asset_item_enums_1.WarrantyType.WARRANTY_DETAILS]: [
                    { label: 'Warranty Start Date', type: 'date' },
                    { label: 'Warranty Duration', type: 'text' },
                    {
                        label: 'Warranty Type',
                        type: 'dropdown',
                        values: ['days', 'months', 'years', 'lifetime'],
                    },
                    { label: 'Warranty End Date', type: 'date' },
                ],
                [asset_item_enums_1.WarrantyType.SUPPORT]: [
                    {
                        label: 'Support Type',
                        type: 'dropdown',
                        values: ['Basic', 'On-site', 'NBD', 'ADP', 'none'],
                    },
                    { label: 'Support Contract', type: 'text' },
                    { label: 'Contract Number', type: 'text' },
                ],
                [asset_item_enums_1.WarrantyType.AMC]: [
                    { label: 'AMC Vendor', type: 'dropdown', source: 'vendors' },
                    {
                        label: 'AMC Frequency',
                        type: 'dropdown',
                        values: ['Daily', 'Monthly', 'Quarterly', 'Annually'],
                    },
                ],
                [asset_item_enums_1.WarrantyType.SERVICE]: [
                    { label: 'Last Service Date', type: 'date' },
                    { label: 'Next Service Due Date', type: 'date' },
                ],
            };
            warrantySet.forEach((type) => {
                const key = type;
                const cols = warrantyColumnsMap[key];
                if (cols?.length) {
                    headers.push(...cols);
                }
            });
            customFields.forEach((field) => {
                let type = 'text';
                if (field.asset_field_type === 'dropdown')
                    type = 'dropdown';
                else if (field.asset_field_type === 'date')
                    type = 'date';
                else
                    type = 'text';
                const header = {
                    label: field.asset_field_label_name,
                    required: field.aif_is_mandatory === 1,
                    type,
                    field_id: field.asset_field_id,
                };
                if (type === 'dropdown' && field.asset_field_type_details) {
                    const cleaned = field.asset_field_type_details
                        .replace(/{/g, '[')
                        .replace(/}/g, ']');
                    const values = JSON.parse(cleaned);
                    header.values = values;
                }
                headers.push(header);
            });
            function colToLetter(col) {
                let letter = '';
                while (col > 0) {
                    const r = (col - 1) % 26;
                    letter = String.fromCharCode(65 + r) + letter;
                    col = Math.floor((col - 1) / 26);
                }
                return letter;
            }
            const colMap = {};
            headers.forEach((header, idx) => {
                colMap[header.label] = colToLetter(idx + 1);
            });
            headers.forEach((header, idx) => {
                const col = idx + 1;
                if (header.label === 'Quantity') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'whole',
                        operator: 'greaterThan',
                        formula1: '0',
                        allowBlank: false,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Quantity',
                        error: 'Quantity must be greater than 0',
                    });
                }
                if (header.label === 'Warranty Duration') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'whole',
                        operator: 'greaterThan',
                        formula1: '0',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Warranty Duration',
                        error: 'Warranty duration must be a positive number',
                    });
                }
                if (header.label === 'Unit Price') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'decimal',
                        operator: 'greaterThanOrEqual',
                        formula1: '0',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Price',
                        error: 'Unit price must be 0 or greater',
                    });
                }
                if (header.label === 'GST %') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'decimal',
                        operator: 'between',
                        formula1: '0',
                        formula2: '100',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid GST',
                        error: 'GST must be between 0 and 100',
                    });
                }
                if (header.type === 'date') {
                    mainSheet
                        .range(DATA_ROW, col, MAX_ROWS, col)
                        .style('numberFormat', 'dd-mm-yyyy');
                }
                if (header.label === 'Purchase Date') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'date',
                        operator: 'lessThanOrEqual',
                        formula1: 'TODAY()',
                        allowBlank: true,
                        showInputMessage: true,
                        promptTitle: 'Purchase Date',
                        prompt: 'Enter date in DD-MM-YYYY format (cannot be in the future)',
                        showErrorMessage: true,
                        errorTitle: 'Invalid Date',
                        error: 'Enter a valid purchase date in DD-MM-YYYY format (cannot be in the future)',
                    });
                }
                if (header.label === 'Subscription Start Date') {
                    const purchaseCol = colMap['Purchase Date'];
                    const subStartCol = colMap['Subscription Start Date'];
                    for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                        mainSheet.cell(`${subStartCol}${r}`).dataValidation({
                            type: 'custom',
                            formula1: `=OR(${subStartCol}${r}="",${subStartCol}${r}>=${purchaseCol}${r})`,
                            allowBlank: true,
                            showInputMessage: true,
                            promptTitle: 'Subscription Start Date',
                            prompt: 'Enter date in DD-MM-YYYY format (must be on or after Purchase Date)',
                            showErrorMessage: true,
                            errorTitle: 'Invalid Subscription Start Date',
                            error: 'Subscription Start Date cannot be before Purchase Date',
                        });
                    }
                }
                if (header.label === 'Next Renewal Date') {
                    const subStartCol = colMap['Subscription Start Date'];
                    const renewalCol = colMap['Next Renewal Date'];
                    for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                        mainSheet.cell(`${renewalCol}${r}`).dataValidation({
                            type: 'custom',
                            formula1: `=OR(${renewalCol}${r}="",${renewalCol}${r}>=${subStartCol}${r})`,
                            allowBlank: true,
                            showInputMessage: true,
                            promptTitle: 'Next Renewal Date',
                            prompt: 'Enter date in DD-MM-YYYY format (must be on or after Subscription Start Date)',
                            showErrorMessage: true,
                            errorTitle: 'Invalid Renewal Date',
                            error: 'Must be on or after Subscription Start Date',
                        });
                    }
                }
                if (header.label === 'Last Service Date') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'date',
                        operator: 'lessThanOrEqual',
                        formula1: 'TODAY()',
                        allowBlank: true,
                        showInputMessage: true,
                        promptTitle: 'Last Service Date',
                        prompt: 'Enter date in DD-MM-YYYY format (cannot be in the future)',
                        showErrorMessage: true,
                        errorTitle: 'Invalid Last Service Date',
                        error: 'Last Service Date cannot be in the future',
                    });
                }
                if (header.label === 'Next Service Due Date') {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'date',
                        operator: 'greaterThan',
                        formula1: 'DATE(1900,1,1)',
                        allowBlank: true,
                        showInputMessage: true,
                        promptTitle: 'Next Service Due Date',
                        prompt: 'Enter upcoming service due date in DD-MM-YYYY format',
                        showErrorMessage: true,
                        errorTitle: 'Invalid Next Service Due Date',
                        error: 'Enter a valid date in DD-MM-YYYY format',
                    });
                }
                if (header.label === 'Billing Frequency') {
                    const billingCol = colMap['Billing Frequency'];
                    mainSheet
                        .range(DATA_ROW, billingCol, MAX_ROWS, billingCol)
                        .dataValidation({
                        type: 'list',
                        formula1: '"Monthly,Quarterly,Semi-Annually,Annually,One-Time"',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Billing Frequency',
                        error: 'Select a valid billing option',
                    });
                }
                if (header.label === 'Subscription Type') {
                    const subTypeCol = colMap['Subscription Type'];
                    mainSheet
                        .range(DATA_ROW, subTypeCol, MAX_ROWS, subTypeCol)
                        .dataValidation({
                        type: 'list',
                        formula1: '"Subscription,Perpetual,Perpetual with Support"',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Subscription Type',
                        error: 'Select valid subscription type',
                    });
                }
                if (header.label === 'Warranty Start Date') {
                    const purchaseCol = colMap['Purchase Date'];
                    const warrantyStartCol = colMap['Warranty Start Date'];
                    if (purchaseCol && warrantyStartCol) {
                        for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                            mainSheet.cell(`${warrantyStartCol}${r}`).dataValidation({
                                type: 'custom',
                                formula1: `=OR(${warrantyStartCol}${r}="",AND(ISNUMBER(${warrantyStartCol}${r}),${warrantyStartCol}${r}>=DATE(1900,1,1),${warrantyStartCol}${r}<=DATE(2099,12,31),OR(${purchaseCol}${r}="",${warrantyStartCol}${r}>=${purchaseCol}${r})))`,
                                allowBlank: true,
                                showInputMessage: true,
                                promptTitle: 'Warranty Start Date',
                                prompt: 'Enter date in DD-MM-YYYY format (must be on or after Purchase Date)',
                                showErrorMessage: true,
                                errorTitle: 'Invalid Warranty Start Date',
                                error: 'Enter a valid date in DD-MM-YYYY format (cannot be before Purchase Date)',
                            });
                        }
                    }
                    else {
                        mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                            type: 'date',
                            operator: 'between',
                            formula1: 'DATE(1900,1,1)',
                            formula2: 'DATE(2099,12,31)',
                            allowBlank: true,
                            showInputMessage: true,
                            promptTitle: 'Warranty Start Date',
                            prompt: 'Enter date in DD-MM-YYYY format (e.g. 15-08-2024)',
                            showErrorMessage: true,
                            errorTitle: 'Invalid Date',
                            error: 'Enter a valid date in DD-MM-YYYY format',
                        });
                    }
                }
                if (header.label === 'Warranty End Date') {
                    const warrantyTypeCol = colMap['Warranty Type'];
                    const warrantyStartCol = colMap['Warranty Start Date'];
                    const warrantyDurationCol = colMap['Warranty Duration'];
                    const warrantyEndCol = colMap['Warranty End Date'];
                    if (warrantyTypeCol &&
                        warrantyStartCol &&
                        warrantyDurationCol &&
                        warrantyEndCol) {
                        for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                            mainSheet.cell(`${warrantyEndCol}${r}`).formula(`
                IF(
                  OR(
                    ${warrantyStartCol}${r}="",
                    ${warrantyDurationCol}${r}="",
                    LOWER(TRIM(${warrantyTypeCol}${r}))="lifetime"
                  ),
                  "",
                  IF(
                    LOWER(TRIM(${warrantyTypeCol}${r}))="days",
                    ${warrantyStartCol}${r}+${warrantyDurationCol}${r},
                    IF(
                      LOWER(TRIM(${warrantyTypeCol}${r}))="months",
                      EDATE(${warrantyStartCol}${r},${warrantyDurationCol}${r}),
                      IF(
                        LOWER(TRIM(${warrantyTypeCol}${r}))="years",
                        EDATE(${warrantyStartCol}${r},${warrantyDurationCol}${r}*12),
                        ""
                      )
                    )
                  )
                )
              `);
                            mainSheet
                                .cell(`${warrantyEndCol}${r}`)
                                .style('numberFormat', 'dd-mm-yyyy');
                            mainSheet.cell(`${warrantyEndCol}${r}`).dataValidation({
                                type: 'custom',
                                formula1: `=OR(${warrantyEndCol}${r}="",LOWER(TRIM(${warrantyTypeCol}${r}))="lifetime",${warrantyEndCol}${r}>=${warrantyStartCol}${r})`,
                                allowBlank: true,
                                showInputMessage: true,
                                promptTitle: 'Warranty End Date',
                                prompt: 'Auto-calculated in DD-MM-YYYY format',
                                showErrorMessage: true,
                                errorTitle: 'Invalid Warranty End Date',
                                error: 'Warranty End Date must be after Start Date',
                            });
                        }
                    }
                }
                if (header.label === 'Warranty Type') {
                    const warrantyTypeCol = colMap['Warranty Type'];
                    mainSheet
                        .range(DATA_ROW, warrantyTypeCol, MAX_ROWS, warrantyTypeCol)
                        .dataValidation({
                        type: 'list',
                        formula1: '"days,months,years,lifetime"',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Warranty Type',
                        error: 'Select valid warranty type',
                    });
                }
                const knownDateLabels = [
                    'Purchase Date',
                    'Subscription Start Date',
                    'Next Renewal Date',
                    'Warranty Start Date',
                    'Warranty End Date',
                    'Last Service Date',
                    'Next Service Due Date',
                ];
                if (header.type === 'date' && !knownDateLabels.includes(header.label)) {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'date',
                        operator: 'between',
                        formula1: 'DATE(1900,1,1)',
                        formula2: 'DATE(2099,12,31)',
                        allowBlank: !header.required,
                        showInputMessage: true,
                        promptTitle: header.label,
                        prompt: `Enter date in DD-MM-YYYY format (e.g. 15-08-2024)`,
                        showErrorMessage: true,
                        errorTitle: `Invalid Date`,
                        error: `Please enter a valid date in DD-MM-YYYY format for ${header.label}`,
                    });
                }
                mainSheet.column(col).width(25);
                const cell = mainSheet.cell(HEADER_ROW, col);
                cell
                    .value(header.label)
                    .style({ bold: true, horizontalAlignment: 'center' });
                if (header.label === 'Manufacturer' ||
                    header.label === 'Publisher' ||
                    header.label === 'Model' ||
                    header.label === 'Software Name') {
                    cell.style({ fill: 'E6E6FA' });
                }
                else if (header.required && header.type === 'dropdown') {
                    cell.style({ fill: 'FFD580' });
                }
                else if (header.required) {
                    cell.style({ fill: 'FFCCCC' });
                }
                else if (header.type === 'dropdown') {
                    cell.style({ fill: 'CCECFF' });
                }
            });
            const dropdownSources = {
                manufacturers: manufacturerOptions.length
                    ? [...manufacturerOptions]
                    : [''],
                ownership: ownershipStatusOptions.length
                    ? [...ownershipStatusOptions]
                    : [''],
                locations: locationOptions.length ? [...locationOptions] : [''],
                vendors: vendorOptions.length ? [...vendorOptions] : [''],
            };
            if (includeSampleRow) {
                const sampleRow = this.buildSampleRow(headers, dropdownSources);
                sampleRow.forEach((value, idx) => {
                    if (value !== undefined) {
                        mainSheet.cell(DATA_ROW, idx + 1).value(value);
                    }
                });
            }
            let dropdownCol = 1;
            Object.keys(dropdownSources).forEach((key) => {
                const values = dropdownSources[key];
                values.forEach((val, i) => dataSheet.cell(i + 1, dropdownCol).value(val));
                dropdownSources[key] = { col: dropdownCol, length: values.length };
                dropdownCol++;
            });
            const mfrStartCol = dropdownCol;
            const maxModelRows = Math.max(...Object.values(manufacturerModelMap).map((m) => m.length), 1);
            Object.entries(manufacturerModelMap).forEach(([originalName, models]) => {
                dataSheet.cell(1, dropdownCol).value(originalName);
                models.forEach((val, i) => dataSheet.cell(i + 2, dropdownCol).value(val));
                dropdownCol++;
            });
            const mfrEndCol = dropdownCol - 1;
            headers.forEach((header) => {
                if (header.type === 'dropdown' && header.values?.length) {
                    const colRef = dropdownCol;
                    header.values.forEach((val, i) => dataSheet.cell(i + 1, colRef).value(val));
                    const colLetter = colToLetter(colRef);
                    header.formulaRange = `Data!$${colLetter}$1:$${colLetter}$${header.values.length}`;
                    dropdownCol++;
                }
            });
            headers.forEach((header, idx) => {
                if (header.type !== 'dropdown')
                    return;
                const col = idx + 1;
                if (header.label === 'Manufacturer' || header.label === 'Publisher') {
                    const mfrColLetter = colToLetter(col);
                    const mfrSourceCol = dropdownSources.manufacturers.col;
                    const mfrSourceLetter = colToLetter(mfrSourceCol);
                    const mfrRange = `Data!$${mfrSourceLetter}$1:$${mfrSourceLetter}$${dropdownSources.manufacturers.length}`;
                    for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                        mainSheet.cell(r, col).dataValidation({
                            type: 'list',
                            formula1: mfrRange,
                            allowBlank: true,
                            showErrorMessage: false,
                            showInputMessage: true,
                            promptTitle: 'Manufacturer',
                            prompt: 'Select from dropdown or type your own value.',
                        });
                    }
                    return;
                }
                if (header.label === 'Model' || header.label === 'Software Name') {
                    const manufacturerIndex = headers.findIndex((h) => h.label === 'Manufacturer' || h.label === 'Publisher');
                    const manufacturerColLetter = colToLetter(manufacturerIndex + 1);
                    const mfrStartColLetter = colToLetter(mfrStartCol);
                    const mfrEndColLetter = colToLetter(mfrEndCol);
                    for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                        mainSheet.cell(r, col).dataValidation({
                            type: 'list',
                            formula1: `=OFFSET(Data!$${mfrStartColLetter}$1,` +
                                `1,` +
                                `MATCH('Asset_Template'!$${manufacturerColLetter}${r},Data!$${mfrStartColLetter}$1:$${mfrEndColLetter}$1,0)-1,` +
                                `${maxModelRows},` +
                                `1)`,
                            allowBlank: true,
                            showErrorMessage: false,
                            showInputMessage: true,
                            promptTitle: 'Model Name',
                            prompt: 'Select from dropdown or type your own value.',
                        });
                    }
                    return;
                }
                let formulaRange;
                if (header.source && dropdownSources[header.source]) {
                    const meta = dropdownSources[header.source];
                    const colLetter = colToLetter(meta.col);
                    formulaRange = `Data!$${colLetter}$1:$${colLetter}$${meta.length}`;
                }
                else if (header.formulaRange) {
                    formulaRange = header.formulaRange;
                }
                if (formulaRange) {
                    mainSheet.range(DATA_ROW, col, MAX_ROWS, col).dataValidation({
                        type: 'list',
                        formula1: formulaRange,
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Value',
                        error: 'Please select a value from the dropdown list only.',
                    });
                }
            });
            const totalCol = colMap['Total Amount'];
            const gstAmountCol = colMap['GST Amount'];
            const grandTotalCol = colMap['Grand Total Amount'];
            const displayNameCol = colMap['Display Name'];
            const qtyCol = colMap['Quantity'];
            const unitCol = colMap['Unit Price'];
            const gstCol = colMap['GST %'];
            const manufacturerCol = colMap['Manufacturer'] || colMap['Publisher'];
            const modelCol = colMap['Model'] || colMap['Software Name'];
            for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                if (totalCol && qtyCol && unitCol) {
                    mainSheet
                        .cell(`${totalCol}${r}`)
                        .formula(`IF(AND(${qtyCol}${r}<>"",${unitCol}${r}<>""),${qtyCol}${r}*${unitCol}${r},"")`);
                }
                if (gstAmountCol && totalCol && gstCol) {
                    mainSheet
                        .cell(`${gstAmountCol}${r}`)
                        .formula(`IF(AND(${totalCol}${r}<>"",${gstCol}${r}<>""),${totalCol}${r}*${gstCol}${r}/100,"")`);
                }
                if (grandTotalCol && totalCol) {
                    if (gstAmountCol) {
                        mainSheet
                            .cell(`${grandTotalCol}${r}`)
                            .formula(`IF(${totalCol}${r}<>"",${totalCol}${r}+IF(${gstAmountCol}${r}<>"",${gstAmountCol}${r},0),"")`);
                    }
                    else {
                        mainSheet
                            .cell(`${grandTotalCol}${r}`)
                            .formula(`IF(${totalCol}${r}<>"",${totalCol}${r},"")`);
                    }
                }
                if (displayNameCol && manufacturerCol && modelCol) {
                    mainSheet
                        .cell(`${displayNameCol}${r}`)
                        .formula(`IF(AND(${manufacturerCol}${r}<>"",${modelCol}${r}<>""),TRIM(${manufacturerCol}${r}&" "&${modelCol}${r}),"")`);
                }
            }
            console.log('====================================');
            console.log('DATA SHEET DEBUG');
            for (let c = 1; c <= dropdownCol; c++) {
                const colLetter = colToLetter(c);
                const values = [];
                for (let r = 1; r <= 10; r++) {
                    const val = dataSheet.cell(r, c).value();
                    if (val)
                        values.push(String(val));
                }
                console.log(`COLUMN ${colLetter}:`, values);
            }
            dataSheet.hidden(true);
            const buffer = await workbook.outputAsync();
            return {
                buffer,
                itemName: item.asset_item_name,
            };
        }
        catch (error) {
            console.error('Error generating asset template:', error);
            throw new common_1.InternalServerErrorException('Failed to generate template');
        }
    }
    async getTemplateHeaders(asset_item_id) {
        if (!asset_item_id) {
            throw new common_1.BadRequestException('Item ID is required');
        }
        const itemResponse = await this.fetchSingleItemDataForForm({
            asset_item_id,
        });
        if (!itemResponse || itemResponse.status !== 200) {
            throw new common_1.NotFoundException('Item not found');
        }
        const itemData = itemResponse.data;
        const itemType = itemData.item_type;
        const rawWarrantyType = itemData.warranty_type;
        const warrantyTypes = Array.isArray(rawWarrantyType)
            ? rawWarrantyType
            : typeof rawWarrantyType === 'string'
                ? rawWarrantyType.split(',')
                : [];
        const warrantySet = new Set(warrantyTypes
            .map((v) => v.trim())
            .filter((v) => Object.values(asset_item_enums_1.WarrantyType).includes(v)));
        let customFields = itemData.customFields || [];
        console.log('RAW CUSTOM FIELDS:', customFields);
        const allowedTypes = ['text', 'dropdown', 'date'];
        const excludedFields = customFields
            .filter((field) => !allowedTypes.includes(field.asset_field_type) ||
            field.is_individual === 1)
            .map((field) => field.asset_field_label_name);
        customFields = customFields.filter((field) => allowedTypes.includes(field.asset_field_type) &&
            field.is_individual !== 1);
        console.log('FILTERED CUSTOM FIELDS:', customFields);
        const staticHeaders = [...this.STATIC_HEADERS];
        if (itemType === 'Virtual') {
            staticHeaders.forEach((h) => {
                if (h.label === 'Manufacturer') {
                    h.label = 'Publisher';
                }
                if (h.label === 'Model') {
                    h.label = 'Software Name';
                }
            });
        }
        const headers = [...staticHeaders];
        const warrantyColumnsMap = {
            [asset_item_enums_1.WarrantyType.SUBSCRIPTION]: [
                {
                    label: 'Subscription Start Date',
                    type: 'date',
                },
                {
                    label: 'Next Renewal Date',
                    type: 'date',
                },
                {
                    label: 'Subscription Type',
                    type: 'dropdown',
                    values: ['Subscription', 'Perpetual', 'Perpetual with Support'],
                },
                {
                    label: 'Billing Frequency',
                    type: 'dropdown',
                    values: [
                        'Monthly',
                        'Quarterly',
                        'Semi-Annually',
                        'Annually',
                        'One-Time',
                    ],
                },
            ],
            [asset_item_enums_1.WarrantyType.WARRANTY_DETAILS]: [
                {
                    label: 'Warranty Start Date',
                    type: 'date',
                },
                {
                    label: 'Warranty Duration',
                    type: 'text',
                },
                {
                    label: 'Warranty Type',
                    type: 'dropdown',
                    values: ['days', 'months', 'years', 'lifetime'],
                },
                {
                    label: 'Warranty End Date',
                    type: 'date',
                },
            ],
            [asset_item_enums_1.WarrantyType.SUPPORT]: [
                {
                    label: 'Support Type',
                    type: 'dropdown',
                    values: ['Basic', 'On-site', 'NBD', 'ADP', 'none'],
                },
                {
                    label: 'Support Contract',
                    type: 'text',
                },
                {
                    label: 'Contract Number',
                    type: 'text',
                },
            ],
            [asset_item_enums_1.WarrantyType.AMC]: [
                {
                    label: 'AMC Vendor',
                    type: 'dropdown',
                    source: 'vendors',
                },
                {
                    label: 'AMC Frequency',
                    type: 'dropdown',
                    values: ['Daily', 'Monthly', 'Quarterly', 'Annually'],
                },
            ],
            [asset_item_enums_1.WarrantyType.SERVICE]: [
                {
                    label: 'Last Service Date',
                    type: 'date',
                },
                {
                    label: 'Next Service Due Date',
                    type: 'date',
                },
            ],
        };
        warrantySet.forEach((type) => {
            const cols = warrantyColumnsMap[type];
            if (cols?.length) {
                headers.push(...cols);
            }
        });
        const dynamicHeaders = customFields.map((field) => {
            let type = 'text';
            if (field.asset_field_type === 'dropdown') {
                type = 'dropdown';
            }
            else if (field.asset_field_type === 'date') {
                type = 'date';
            }
            const header = {
                label: field.asset_field_label_name,
                required: field.aif_is_mandatory === 1,
                type,
                field_id: field.asset_field_id,
            };
            if (type === 'dropdown' && field.asset_field_type_details) {
                const cleaned = field.asset_field_type_details
                    .replace(/{/g, '[')
                    .replace(/}/g, ']');
                try {
                    const parsed = JSON.parse(cleaned);
                    header.values = Array.isArray(parsed) ? parsed : [];
                }
                catch (err) {
                    console.warn(`Failed to parse dropdown values for field ${field.asset_field_label_name}`);
                    console.warn(err);
                    header.values = [];
                }
            }
            return header;
        });
        headers.push(...dynamicHeaders);
        console.log('FINAL TEMPLATE HEADERS:', headers.map((h) => ({
            label: h.label,
            type: h.type,
            required: h.required,
        })));
        console.log('EXCLUDED FIELDS:', excludedFields);
        return {
            headers,
            excludedFields,
        };
    }
    async getOrCreateEntityId(entityName, repository, nameColumn = 'name', extraData = {}) {
        if (!entityName)
            return null;
        const existing = await repository.findOne({
            where: { [nameColumn]: entityName.trim() },
        });
        if (existing)
            return existing.id;
        const newRecord = repository.create({
            [nameColumn]: entityName.trim(),
            ...extraData,
        });
        const saved = await repository.save(newRecord);
        return saved.id;
    }
    excelDateToJSDate(value) {
        if (!value)
            return null;
        if (value instanceof Date) {
            return value;
        }
        const strValue = String(value).trim();
        if (!isNaN(Number(strValue))) {
            const serial = Number(strValue);
            const utc_days = Math.floor(serial - 25569);
            const date = new Date(utc_days * 86400 * 1000);
            return isNaN(date.getTime()) ? null : date;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
            const date = new Date(strValue);
            return isNaN(date.getTime()) ? null : date;
        }
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(strValue)) {
            const [day, month, year] = strValue.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }
        const parsed = new Date(strValue);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
        console.warn(`Invalid date value: ${value}`);
        return null;
    }
    async getSchemaNameFromRequest(req, decryptFn, prefix = 'org_') {
        let fullSchemaName = 'public';
        const schemaCookie = req?.cookies?.['x-organization-schema'];
        if (schemaCookie) {
            try {
                const decryptedSchema = decryptFn(schemaCookie);
                if (decryptedSchema)
                    fullSchemaName = `${prefix}${decryptedSchema}`;
            }
            catch (err) {
                console.error('Error decrypting schema name:', err.message);
            }
        }
        return fullSchemaName;
    }
    async createAssetAndStock(payload, asset_item_id, organizationID, userId, schema, req) {
        console.log('First Row:', payload[0]);
        const successAssets = [];
        const errorAssets = [];
        if (!organizationID || isNaN(organizationID)) {
            throw new Error('Invalid organization ID');
        }
        const item = await this.dataSource
            .getRepository(asset_item_entity_1.AssetItem)
            .findOne({ where: { asset_item_id } });
        if (!item)
            throw new Error('Asset item not found');
        const asset_main_category_id = item.main_category_id;
        const asset_sub_category_id = item.sub_category_id;
        const modelNames = [
            ...new Set(payload.map((p) => p['Model']).filter(Boolean)),
        ];
        const manufacturerNames = [
            ...new Set(payload.map((p) => p['Manufacturer']).filter(Boolean)),
        ];
        const vendorNames = [
            ...new Set(payload.map((p) => p['Vendor']).filter(Boolean)),
        ];
        const locationNames = [
            ...new Set(payload.map((p) => p['Location']).filter(Boolean)),
        ];
        const ownershipNames = [
            ...new Set(payload.map((p) => p['Ownership']).filter(Boolean)),
        ];
        const models = modelNames.length
            ? await this.dataSource
                .getRepository(models_entity_1.Models)
                .createQueryBuilder('m')
                .where('m.model_name IN (:...modelNames)', { modelNames })
                .getMany()
            : [];
        const manufacturers = manufacturerNames.length
            ? await this.dataSource
                .getRepository(manufacturer_entity_1.Manufacturer)
                .createQueryBuilder('m')
                .where('m.manufacturer_name IN (:...manufacturerNames)', {
                manufacturerNames,
            })
                .getMany()
            : [];
        const vendors = vendorNames.length
            ? await this.dataSource
                .getRepository(organizational_vendors_entity_1.OrganizationVendors)
                .createQueryBuilder('v')
                .where('v.vendor_name IN (:...vendorNames)', { vendorNames })
                .getMany()
            : [];
        const locations = locationNames.length
            ? await this.dataSource
                .getRepository(locations_entity_1.Locations)
                .createQueryBuilder('l')
                .where('l.location_name IN (:...locationNames)', { locationNames })
                .getMany()
            : [];
        const ownerships = ownershipNames.length
            ? await this.dataSource
                .getRepository(asset_ownership_status_entity_1.AssetOwnershipStatus)
                .createQueryBuilder('o')
                .where('o.ownership_status_type_name IN (:...ownershipNames)', {
                ownershipNames,
            })
                .getMany()
            : [];
        const toSafeNumber = (val) => {
            if (val === null || val === undefined || val === '' || val === ' ') {
                return null;
            }
            const num = Number(val);
            return isNaN(num) ? null : num;
        };
        const modelMap = new Map(models.map((m) => [m.model_name, m.model_id]));
        const manufacturerMap = new Map(manufacturers.map((m) => [m.manufacturer_name, m.manufacturer_id]));
        const manufacturerRepository = this.dataSource.getRepository(manufacturer_entity_1.Manufacturer);
        const modelRepository = this.dataSource.getRepository(models_entity_1.Models);
        const vendorMap = new Map(vendors.map((v) => [v.vendor_name, v.vendor_id]));
        const locationMap = new Map(locations.map((l) => [l.location_name, l]));
        const ownershipMap = new Map(ownerships.map((o) => [
            o.ownership_status_type_name,
            o.ownership_status_type_id,
        ]));
        const itemResponse = await this.fetchSingleItemDataForForm({ asset_item_id }, req);
        let customFields = itemResponse?.data?.customFields || [];
        console.log('customFields', customFields);
        customFields = customFields.filter((f) => ['text', 'dropdown', 'date'].includes(f.asset_field_type) &&
            f.is_individual !== 1);
        const assetPayloads = [];
        const stockPayloads = [];
        let displayName;
        for (const dto of payload) {
            try {
                let manufacturer_id = manufacturerMap.get(dto['Manufacturer']) ?? null;
                let model_id = modelMap.get(dto['Model']) ?? null;
                if (!manufacturer_id && dto['Manufacturer']) {
                    const manufacturer = await manufacturerRepository.save(manufacturerRepository.create({
                        manufacturer_name: dto['Manufacturer'].trim(),
                    }));
                    manufacturer_id = manufacturer.manufacturer_id;
                    manufacturerMap.set(dto['Manufacturer'], manufacturer.manufacturer_id);
                }
                if (!model_id && dto['Model']) {
                    const model = await modelRepository.save(modelRepository.create({
                        model_name: dto['Model'].trim(),
                        manufacturer_id,
                    }));
                    model_id = model.model_id;
                    modelMap.set(dto['Model'], model.model_id);
                }
                const vendor_id = vendorMap.get(dto['Vendor']) ?? null;
                const location = locationMap.get(dto['Location']);
                const location_id = location?.location_id ?? null;
                const branch_id = location?.branch_id ?? null;
                const ownership_status_type_id = ownershipMap.get(dto['Ownership']) ?? null;
                displayName = dto['Display Name'];
                if (!displayName) {
                    displayName =
                        dto['Manufacturer'] && dto['Model']
                            ? `${dto['Manufacturer']} ${dto['Model']}`
                            : dto['Manufacturer'] || dto['Model'] || null;
                }
                assetPayloads.push({
                    asset_item_id,
                    asset_main_category_id,
                    asset_sub_category_id,
                    asset_title: displayName,
                    asset_description: dto['Notes'] ?? null,
                    manufacturer_id,
                    model_id,
                    asset_added_by: userId,
                });
                const information_fields = customFields.map((field) => ({
                    asset_field_id: field.asset_field_id,
                    asset_field_category_id: field.asset_field_category_id,
                    asset_field_name: field.asset_field_name,
                    asset_field_label_name: field.asset_field_label_name,
                    value: dto[field.asset_field_label_name] ?? null,
                }));
                console.log('information_fields', information_fields);
                const quantity = dto['Quantity'] ?? 1;
                const assetDetails = Array.from({ length: quantity }).map(() => ({
                    serial_number: null,
                    department_id: null,
                    location_id,
                    project_id: null,
                    cost_center_id: null,
                    asset_used_by: null,
                    asset_managed_by: null,
                    asset_item_id,
                    status_type_id: 1,
                }));
                const warranty_details = dto['Warranty Start Date'] ||
                    dto['Warranty End Date'] ||
                    dto['Warranty Type'] ||
                    dto['Warranty Duration'] ||
                    dto['Last Service Date'] ||
                    dto['Next Service Due Date']
                    ? {
                        warranty_start_date: this.excelDateToJSDate(dto['Warranty Start Date']),
                        warranty_end_date: this.excelDateToJSDate(dto['Warranty End Date']),
                        warranty_duration_type: dto['Warranty Type'] ?? null,
                        warranty_in_year: toSafeNumber(dto['Warranty Duration']),
                        support_type: dto['Support Type'] ?? null,
                        last_service_date: this.excelDateToJSDate(dto['Last Service Date']),
                        next_service_due_date: this.excelDateToJSDate(dto['Next Service Due Date']),
                    }
                    : null;
                const subscription_details = dto['Subscription Start Date'] ||
                    dto['Next Renewal Date'] ||
                    dto['Subscription Type'] ||
                    dto['Billing Frequency'] ||
                    dto['Warranty Category']
                    ? {
                        sub_start_date: this.excelDateToJSDate(dto['Subscription Start Date']),
                        next_renewal_date: this.excelDateToJSDate(dto['Next Renewal Date']),
                        subscription_type: dto['Subscription Type'] ?? null,
                        billing_frequency: dto['Billing Frequency'] ?? null,
                        warranty_category: dto['Warranty Category']
                            ? Array.isArray(dto['Warranty Category'])
                                ? dto['Warranty Category']
                                : [dto['Warranty Category']]
                            : null,
                    }
                    : null;
                const toNullIfEmpty = (val) => val === '' || val === undefined || val === null ? null : val;
                const toNumber = (val) => {
                    if (val === null || val === undefined || val === '')
                        return 0;
                    const cleanedValue = String(val).replace(/%/g, '').trim();
                    const num = Number(cleanedValue);
                    return isNaN(num) ? 0 : num;
                };
                stockPayloads.push({
                    asset_title: displayName,
                    quantity: quantity || 0,
                    total_available_quantity: quantity,
                    branch_id,
                    department_id: null,
                    asset_ownership_status: ownership_status_type_id,
                    vendor_id,
                    location_id,
                    asset_item_id,
                    created_by: userId,
                    purchase_date: dto['Purchase Date']
                        ? this.excelDateToJSDate(dto['Purchase Date'])
                        : null,
                    buy_price: dto['Unit Price'] ?? 0,
                    total_amount: dto['Grand Total Amount'] ?? 0,
                    total_without_gst: dto['Total Amount'] ?? 0,
                    gst_amount: dto['GST Amount'] ?? 0,
                    gst_percent: toNumber(dto['GST %']),
                    bill_no: dto['Bill No'] ?? null,
                    information_fields: JSON.stringify(information_fields),
                    warranty_details,
                    subscription_details,
                    assetDetails,
                });
                console.log('stockPayloads', stockPayloads);
            }
            catch (error) {
                errorAssets.push({
                    row: dto,
                    reason: error.message,
                });
            }
        }
        const finalAssetPayloads = assetPayloads.map((asset) => asset);
        const assetResult = await this.assetDataService.bulkAddAssets(finalAssetPayloads, organizationID, userId);
        const savedAssets = assetResult.data;
        savedAssets.forEach((asset, index) => {
            stockPayloads[index].asset_id = asset.asset_id;
        });
        const finalStockPayloads = stockPayloads.map((stock) => stock);
        const stockResult = await this.stocksService.bulkCreateStocks(finalStockPayloads, organizationID, userId, schema, req);
        successAssets.push(...savedAssets);
        console.log('INVALIDATE: BULK IMPORT');
        await this.invalidateSerials(schema);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Bulk assets created successfully',
            data: {
                created_count: successAssets.length,
                created_records: successAssets,
                stock_result: stockResult,
                error_records: errorAssets,
            },
        };
    }
    async invalidateSerials(schema) {
        console.log('INVALIDATE:invalidateSerials ');
        await this.redisService.incr(`serials_version:${schema}`);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
    }
    async getItemData(payload) {
        const { search, customFilters = {} } = payload;
        const { status = ['All'] } = customFilters;
        console.log('search', search);
        console.log('customFilters', customFilters);
        const cacheKey = await this.dropdownCache.buildKey(dropdown_entities_1.DROPDOWN.ITEM, {
            scope: 'item-hierarchy',
            search: search ?? '',
            status,
        });
        const cachedHierarchy = await this.redisService.get(cacheKey);
        if (cachedHierarchy) {
            return cachedHierarchy;
        }
        const query = this.categoryepository
            .createQueryBuilder('cat')
            .leftJoinAndSelect('cat.subcategories', 'sub', 'sub.is_deleted = :subDeleted', { subDeleted: 0 })
            .leftJoinAndSelect('sub.items', 'item', 'item.is_deleted = :itemDeleted', { itemDeleted: 0 })
            .where('cat.is_deleted = :catDeleted', { catDeleted: 0 });
        if (status && status.length > 0 && !status.includes('All')) {
            const activeStatuses = [];
            if (status.includes('Active'))
                activeStatuses.push(1);
            if (status.includes('Inactive'))
                activeStatuses.push(0);
            if (activeStatuses.length > 0) {
                query.andWhere('item.is_active IN (:...activeStatuses)', {
                    activeStatuses,
                });
            }
        }
        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            query.andWhere(`(item.asset_item_name ILIKE :search OR 
        item.asset_item_description ILIKE :search OR 
        sub.sub_category_name ILIKE :search OR 
        cat.main_category_name ILIKE :search)`, { search: searchTerm });
        }
        query.orderBy('item.asset_item_name', 'ASC');
        const categories = await query.getMany();
        const itemCounts = await this.serialRepo
            .createQueryBuilder('serial')
            .select('serial.asset_item_id', 'id')
            .addSelect('COUNT(serial.asset_stocks_unique_id)', 'count')
            .where('serial.is_deleted = 0')
            .groupBy('serial.asset_item_id')
            .getRawMany();
        const subCounts = await this.serialRepo
            .createQueryBuilder('serial')
            .leftJoin('serial.asset_data', 'asset')
            .select('asset.asset_sub_category_id', 'id')
            .addSelect('COUNT(serial.asset_stocks_unique_id)', 'count')
            .where('serial.is_deleted = 0')
            .andWhere('asset.asset_is_deleted = 0')
            .groupBy('asset.asset_sub_category_id')
            .getRawMany();
        const catCounts = await this.serialRepo
            .createQueryBuilder('serial')
            .leftJoin('serial.asset_data', 'asset')
            .select('asset.asset_main_category_id', 'id')
            .addSelect('COUNT(serial.asset_stocks_unique_id)', 'count')
            .where('serial.is_deleted = 0')
            .andWhere('asset.asset_is_deleted = 0')
            .groupBy('asset.asset_main_category_id')
            .getRawMany();
        const itemCountMap = Object.fromEntries(itemCounts.map((r) => [r.id, Number(r.count)]));
        const subCountMap = Object.fromEntries(subCounts.map((r) => [r.id, Number(r.count)]));
        const catCountMap = Object.fromEntries(catCounts.map((r) => [r.id, Number(r.count)]));
        const result = categories.map((cat) => ({
            main_category_id: cat.main_category_id,
            main_category_name: cat.main_category_name,
            main_category_description: cat.main_category_description,
            is_active: cat.is_active,
            created_at: cat.created_at,
            main_category_icon: cat.main_category_icon,
            asset_count: catCountMap[cat.main_category_id] || 0,
            subcategories: (cat.subcategories || []).map((sub) => ({
                sub_category_id: sub.sub_category_id,
                sub_category_name: sub.sub_category_name,
                main_category_id: sub.main_category_id,
                sub_category_description: sub.sub_category_description,
                is_active: sub.is_active,
                created_at: sub.created_at,
                sub_category_icon: sub.sub_category_icon,
                asset_count: subCountMap[sub.sub_category_id] || 0,
                items: (sub.items || []).map((item) => ({
                    asset_item_id: item.asset_item_id,
                    name: item.asset_item_name,
                    main_category_id: item.main_category_id,
                    sub_category_id: item.sub_category_id,
                    asset_item_description: item.asset_item_description,
                    is_licensable: item.is_licensable,
                    item_type: item.item_type,
                    has_depreciation: item.has_depreciation,
                    company_act_asset_life: item.company_act_asset_life,
                    it_act_asset_life: item.it_act_asset_life,
                    company_depreciation_rate: item.company_depreciation_rate,
                    it_act_depreciation_rate: item.it_act_depreciation_rate,
                    company_act_residual_value: item.company_act_residual_value,
                    it_act_residual_value: item.it_act_residual_value,
                    preferred_method: item.preffered_method,
                    is_active: item.is_active,
                    asset_item_icon: item.asset_item_icon,
                    asset_count: itemCountMap[item.asset_item_id] || 0,
                })),
            })),
        }));
        await this.redisService.set(cacheKey, result, 60);
        return result;
    }
    async activateItems(asset_item_ids) {
        const results = [];
        const itemsToActivate = [];
        for (const id of asset_item_ids) {
            const item = await this.assetItemRepository.findOneBy({
                asset_item_id: id,
            });
            if (!item) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Item not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (item.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Item is already active.',
                    name: item.asset_item_name,
                });
                continue;
            }
            itemsToActivate.push(item);
            results.push({
                id,
                status: 'success',
                name: item.asset_item_name,
            });
        }
        if (itemsToActivate.length > 0) {
            await this.assetItemRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('asset_item_id IN (:...ids)', {
                ids: itemsToActivate.map((i) => i.asset_item_id),
            })
                .execute();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `"${successful[0].name}" marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} items marked as active.`;
        }
        else {
            message = 'No items were marked as active';
        }
        console.log('INVALIDATE REDIS:ITEM-ACTIVE');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateItems(asset_item_ids) {
        const results = [];
        const itemsToDeactivate = [];
        for (const id of asset_item_ids) {
            const item = await this.assetItemRepository.findOneBy({
                asset_item_id: id,
            });
            if (!item) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Item not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (!item.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Item is already inactive.',
                    name: item.asset_item_name,
                });
                continue;
            }
            itemsToDeactivate.push(item);
            results.push({
                id,
                status: 'success',
                name: item.asset_item_name,
            });
        }
        if (itemsToDeactivate.length > 0) {
            await this.assetItemRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('asset_item_id IN (:...ids)', {
                ids: itemsToDeactivate.map((i) => i.asset_item_id),
            })
                .execute();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `"${successful[0].name}" marked as inactive`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} items marked as inactive`;
        }
        else {
            message = 'No items were deactivated';
        }
        console.log('REDIS UPDATE:ITEM-DEACTIVE');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async moveItems(asset_item_id, main_category_id, sub_category_id) {
        const item = await this.assetItemRepository.findOne({
            where: { asset_item_id },
        });
        if (!item) {
            throw new Error(`Asset item with id ${asset_item_id} not found`);
        }
        item.main_category_id = main_category_id;
        item.sub_category_id = sub_category_id ?? null;
        await this.assetItemRepository.save(item);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        return item;
    }
    async testService() {
        const result = await this.serialRepo
            .createQueryBuilder('asset_stock_serials')
            .select('asset_stock_serials.license_key', 'license_key')
            .where('serial.license_key IS NOT NULL')
            .getRawMany();
        return result.map((row) => row.license_key);
    }
    async getAllDepreciationItems() {
        const serials = await this.serialRepo
            .createQueryBuilder('serial')
            .andWhere('serial.depreciation_start_date IS NOT NULL')
            .andWhere('serial.depreciation_end_date IS NOT NULL')
            .select([
            'serial.asset_stocks_unique_id',
            'serial.system_code',
            'serial.buy_price',
            'serial.depreciation_start_date',
            'serial.depreciation_end_date',
        ])
            .getMany();
        return serials;
    }
    async fetchOrganizationAllAssetItems2(dto, branchIds = [], userId, schema) {
        console.time('GET_ALL_ASSET_ITEMS_TOTAL');
        console.log('DTO:1', dto);
        try {
            console.time('INPUT');
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
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            console.timeEnd('INPUT');
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const roleId = await (async () => {
                const cachedRole = await this.redisService.get(roleCacheKey);
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
                await this.redisService.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            let hasSelfAccess = await this.redisService.get(permCacheKey);
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
                await this.redisService.set(permCacheKey, hasSelfAccess, 300);
            }
            console.time('CACHE_KEY');
            const cacheParams = {
                scope: 'organization-asset-items',
                search: dto.search || [],
                filters: dto.filters || [],
                sort: dto.sort || [],
                cursor: dto.cursor || null,
                page: usingOffset ? jumpPage : undefined,
                limit,
                jumpToLast,
                branchIds,
                userId: hasSelfAccess ? userId : null,
                hasSelfAccess,
            };
            console.log('cacheParams', cacheParams);
            const cacheKey = await this.dropdownCache.buildKey(dropdown_entities_1.DROPDOWN.ITEM, cacheParams);
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('REDIS HIT:ITEM LIST');
                return cached;
            }
            console.log('REDIS MISS:ITEM LIST');
            console.timeEnd('REDIS_GET');
            console.time('QUERY_BUILDER');
            const buildBaseQuery = (qb) => {
                return qb
                    .leftJoinAndSelect('asset_items.main_category', 'main_category')
                    .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
                    .where('asset_items.is_deleted = 0');
            };
            console.timeEnd('QUERY_BUILDER');
            console.time('SEARCH_FILTERS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values
                        .map((v) => v.trim())
                        .filter(Boolean)
                        .join(' ');
                    if (!value)
                        return;
                    qb.andWhere(`(
  asset_items.asset_item_name ILIKE :search${index}
  OR main_category.main_category_name ILIKE :search${index}
  OR sub_category.sub_category_name ILIKE :search${index}
  OR CAST(asset_items.item_type AS TEXT) ILIKE :search${index}
  OR CAST(asset_items.asset_item_id AS TEXT) ILIKE :search${index}
)`, {
                        [`search${index}`]: `%${value}%`,
                    });
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
                        case 'main_category_id':
                            qb.andWhere('asset_items.main_category_id IN (:...mainIds)', {
                                mainIds: cleaned.map(Number),
                            });
                            break;
                        case 'sub_category_id':
                            qb.andWhere('asset_items.sub_category_id IN (:...subIds)', {
                                subIds: cleaned.map(Number),
                            });
                            break;
                        case 'status': {
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
                            qb.andWhere('asset_items.is_active = :activeVal', {
                                activeVal: activeValues[0],
                            });
                            break;
                        }
                        case 'item_type':
                            qb.andWhere('asset_items.item_type IN (:...itemTypes)', {
                                itemTypes: cleaned,
                            });
                            break;
                    }
                }
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'asset-items-count:' + JSON.stringify({ search: searchArray, filters });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = this.assetItemRepository
                    .createQueryBuilder('asset_items')
                    .leftJoin('asset_items.main_category', 'main_category')
                    .leftJoin('asset_items.sub_category', 'sub_category')
                    .where('asset_items.is_deleted = 0');
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT_QUERY');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetItemRepository.createQueryBuilder('asset_items'));
            applySearchAndFilters(qb);
            qb.addSelect((subQ) => {
                subQ
                    .select('COUNT(serial.asset_stocks_unique_id)')
                    .from(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                    .leftJoin('stocks', 'st', 'st.stock_id = serial.stock_id')
                    .where('serial.asset_item_id = asset_items.asset_item_id')
                    .andWhere('serial.is_deleted = 0')
                    .andWhere('serial.is_active = 1');
                (0, branch_access_1.applyBranchFilter)({
                    qb: subQ,
                    entityKey: 'Stock',
                    branchIds,
                });
                if (hasSelfAccess) {
                    subQ.andWhere('serial.created_by = :selfUserId', {
                        selfUserId: userId,
                    });
                }
                return subQ;
            }, 'asset_count');
            const sortableMap = {
                asset_item_id: 'asset_items.asset_item_id',
                asset_item_name: 'asset_items.asset_item_name',
                created_at: 'asset_items.created_at',
                is_active: 'asset_items.is_active',
                main_category_name: 'main_category.main_category_name',
                sub_category_name: 'sub_category.sub_category_name',
                item_type: 'asset_items.item_type',
            };
            const idColumn = 'asset_item_id';
            const idDbColumn = 'asset_items.asset_item_id';
            const defaultSort = { column: 'asset_item_name', order: 'ASC' };
            const assetCountSort = sortArray.find((s) => s.column === 'asset_count');
            const keysetSort = sortArray.filter((s) => s.column !== 'asset_count' && sortableMap[s.column]);
            console.timeEnd('MAIN_QUERY');
            console.time('CURSOR_PAGINATION');
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: keysetSort,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: keysetSort,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: keysetSort,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                });
            }
            const result = usingOffset
                ? await qb.getRawAndEntities()
                : await qb.limit(limit + 1).getRawAndEntities();
            const mergedRows = result.entities.map((entity, index) => ({
                ...entity,
                asset_count: Number(result.raw[index]?.asset_count || 0),
            }));
            console.timeEnd('CURSOR_PAGINATION');
            console.time('DATA_MAPPING');
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
                    rows: mergedRows,
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
            if (assetCountSort) {
                data = data.sort((a, b) => assetCountSort.order?.toUpperCase() === 'DESC'
                    ? b.asset_count - a.asset_count
                    : a.asset_count - b.asset_count);
            }
            console.timeEnd('DATA_MAPPING');
            const response = {
                success: true,
                message: data.length
                    ? 'Items retrieved successfully'
                    : 'No items found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            console.timeEnd('GET_ALL_ASSET_ITEMS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_ALL_ASSET_ITEMS_TOTAL');
            console.error('fetchOrganizationAllAssetItems2 ERROR:', error);
            throw error;
        }
    }
    async exportOrganizationAllAssetItemsExcel(dto, branchIds = [], userId, schema) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || dto.ids || [];
            const isSelectAll = dto.isSelectAll || false;
            const excludeIds = dto.excludeIds || [];
            const visibleColumns = dto.visible_columns || [];
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const roleId = await (async () => {
                const cachedRole = await this.redisService.get(roleCacheKey);
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
                await this.redisService.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            let hasSelfAccess = await this.redisService.get(permCacheKey);
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
                await this.redisService.set(permCacheKey, hasSelfAccess, 300);
            }
            const qb = this.assetItemRepository
                .createQueryBuilder('asset_items')
                .leftJoinAndSelect('asset_items.main_category', 'main_category')
                .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
                .leftJoinAndSelect('asset_items.related_items', 'related_items', 'related_items.is_active = 1 AND related_items.is_deleted = 0')
                .leftJoinAndSelect('related_items.child_item', 'child_item')
                .where('asset_items.is_deleted = 0');
            if (selectedIds.length > 0) {
                qb.andWhere('asset_items.asset_item_id IN (:...selectedIds)', {
                    selectedIds,
                });
            }
            else if (isSelectAll && excludeIds.length > 0) {
                qb.andWhere('asset_items.asset_item_id NOT IN (:...excludeIds)', {
                    excludeIds,
                });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
  asset_items.asset_item_name ILIKE :search${index}
  OR main_category.main_category_name ILIKE :search${index}
  OR sub_category.sub_category_name ILIKE :search${index}
  OR CAST(asset_items.item_type AS TEXT) ILIKE :search${index}
  OR CAST(asset_items.asset_item_id AS TEXT) ILIKE :search${index}
)`, {
                    [`search${index}`]: `%${value}%`,
                });
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
                    case 'main_category_id':
                        qb.andWhere('asset_items.main_category_id IN (:...mainIds)', {
                            mainIds: cleaned.map(Number),
                        });
                        break;
                    case 'sub_category_id':
                        qb.andWhere('asset_items.sub_category_id IN (:...subIds)', {
                            subIds: cleaned.map(Number),
                        });
                        break;
                    case 'status': {
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
                        qb.andWhere('asset_items.is_active = :activeVal', {
                            activeVal: activeValues[0],
                        });
                        break;
                    }
                    case 'item_type':
                        qb.andWhere('asset_items.item_type IN (:...itemTypes)', {
                            itemTypes: cleaned,
                        });
                        break;
                }
            }
            if (dto.date_between?.column && dto.date_between?.date) {
                const [colStart, colEnd] = dto.date_between.column
                    .split(',')
                    .map((c) => c.trim());
                const selectedDate = new Date(dto.date_between.date);
                const start = new Date(selectedDate.setHours(0, 0, 0, 0));
                const end = new Date(selectedDate.setHours(23, 59, 59, 999));
                qb.andWhere(`(asset_items.${colStart} BETWEEN :start AND :end OR asset_items.${colEnd} BETWEEN :start AND :end)`, { start, end });
            }
            if (dto.range_filters?.length) {
                for (const rf of dto.range_filters) {
                    if (rf.from !== undefined) {
                        qb.andWhere(`asset_items.${rf.column} >= :from_${rf.column}`, {
                            [`from_${rf.column}`]: rf.from,
                        });
                    }
                    if (rf.to !== undefined) {
                        qb.andWhere(`asset_items.${rf.column} <= :to_${rf.column}`, {
                            [`to_${rf.column}`]: rf.to,
                        });
                    }
                }
            }
            qb.addSelect((subQ) => {
                subQ
                    .select('COUNT(serial.asset_stocks_unique_id)')
                    .from(asset_stock_serials_entity_1.AssetStockSerials, 'serial')
                    .leftJoin('stocks', 'st', 'st.stock_id = serial.stock_id')
                    .where('serial.asset_item_id = asset_items.asset_item_id')
                    .andWhere('serial.is_deleted = 0')
                    .andWhere('serial.is_active = 1');
                (0, branch_access_1.applyBranchFilter)({
                    qb: subQ,
                    entityKey: 'Stock',
                    branchIds,
                });
                if (hasSelfAccess) {
                    subQ.andWhere('serial.created_by = :selfUserId', {
                        selfUserId: userId,
                    });
                }
                return subQ;
            }, 'asset_count');
            const sortableMap = {
                asset_item_id: 'asset_items.asset_item_id',
                asset_item_name: 'asset_items.asset_item_name',
                created_at: 'asset_items.created_at',
                is_active: 'asset_items.is_active',
                main_category_name: 'main_category.main_category_name',
                sub_category_name: 'sub_category.sub_category_name',
                item_type: 'asset_items.item_type',
            };
            const assetCountSort = sortArray.find((s) => s.column === 'asset_count');
            const dbSorts = sortArray.filter((s) => s.column !== 'asset_count' && sortableMap[s.column]);
            if (dbSorts.length > 0) {
                dbSorts.forEach((s) => {
                    qb.addOrderBy(sortableMap[s.column], s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('asset_items.asset_item_name', 'ASC');
            }
            const result = await qb.getRawAndEntities();
            let data = result.entities.map((entity, index) => ({
                ...entity,
                asset_count: Number(result.raw[index]?.asset_count || 0),
            }));
            if (assetCountSort) {
                data = data.sort((a, b) => assetCountSort.order?.toUpperCase() === 'DESC'
                    ? b.asset_count - a.asset_count
                    : a.asset_count - b.asset_count);
            }
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Asset Items');
            const allHeaders = [
                { key: 'sr_no', label: 'Sr. No.' },
                { key: 'asset_item_id', label: 'Item ID' },
                { key: 'asset_item_name', label: 'Item Name' },
                { key: 'main_category_name', label: 'Main Category' },
                { key: 'sub_category_name', label: 'Sub Category' },
                { key: 'item_type', label: 'Item Type' },
                { key: 'asset_count', label: 'Asset Count' },
                { key: 'is_licensable', label: 'Licensable' },
                { key: 'is_active', label: 'Status' },
                { key: 'created_at', label: 'Created On' },
            ];
            let headersToExport = allHeaders;
            if (Array.isArray(visibleColumns) && visibleColumns.length > 0) {
                const visSet = new Set(visibleColumns);
                headersToExport = allHeaders.filter((h) => h.key === 'sr_no' ||
                    h.key === 'asset_item_name' ||
                    visSet.has(h.key));
            }
            headersToExport.forEach((h, i) => {
                sheet
                    .cell(1, i + 1)
                    .value(h.label)
                    .style({
                    bold: true,
                    fill: '1F4E78',
                    fontColor: 'FFFFFF',
                    horizontalAlignment: 'center',
                    verticalAlignment: 'center',
                });
            });
            data.forEach((item, index) => {
                const rowIdx = index + 2;
                headersToExport.forEach((h, colIdx) => {
                    const cell = sheet.cell(rowIdx, colIdx + 1);
                    let val = '';
                    switch (h.key) {
                        case 'sr_no':
                            val = index + 1;
                            break;
                        case 'asset_item_id':
                            val = item.asset_item_id;
                            break;
                        case 'asset_item_name':
                            val = item.asset_item_name || '';
                            break;
                        case 'main_category_name':
                            val = item.main_category?.main_category_name || '-';
                            break;
                        case 'sub_category_name':
                            val = item.sub_category?.sub_category_name || '-';
                            break;
                        case 'item_type':
                            val = item.item_type || '-';
                            break;
                        case 'asset_count':
                            val = item.asset_count ?? 0;
                            break;
                        case 'is_licensable':
                            val = item.is_licensable ? 'Yes' : 'No';
                            break;
                        case 'is_active':
                            val = item.is_active === 1 ? 'Active' : 'Inactive';
                            break;
                        case 'created_at':
                            val = item.created_at
                                ? new Date(item.created_at).toISOString().split('T')[0]
                                : '-';
                            break;
                        default:
                            val = item[h.key] ?? '-';
                            break;
                    }
                    cell.value(val);
                    cell.style({ verticalAlignment: 'center' });
                    if (typeof val === 'number') {
                        cell.style({ horizontalAlignment: 'right' });
                    }
                    else {
                        cell.style({ horizontalAlignment: 'left' });
                    }
                });
            });
            sheet.row(1).height(24);
            headersToExport.forEach((h, colIdx) => {
                let maxLen = h.label.length;
                data.forEach((item) => {
                    let strVal = '';
                    switch (h.key) {
                        case 'sr_no':
                            strVal = '9999';
                            break;
                        case 'asset_item_id':
                            strVal = String(item.asset_item_id || '');
                            break;
                        case 'asset_item_name':
                            strVal = String(item.asset_item_name || '');
                            break;
                        case 'main_category_name':
                            strVal = String(item.main_category?.main_category_name || '');
                            break;
                        case 'sub_category_name':
                            strVal = String(item.sub_category?.sub_category_name || '');
                            break;
                        case 'item_type':
                            strVal = String(item.item_type || '');
                            break;
                        case 'asset_count':
                            strVal = String(item.asset_count ?? 0);
                            break;
                        case 'is_licensable':
                            strVal = item.is_licensable ? 'Yes' : 'No';
                            break;
                        case 'is_active':
                            strVal = item.is_active === 1 ? 'Active' : 'Inactive';
                            break;
                        case 'created_at':
                            strVal = item.created_at
                                ? new Date(item.created_at).toISOString().split('T')[0]
                                : '';
                            break;
                    }
                    if (strVal.length > maxLen) {
                        maxLen = strVal.length;
                    }
                });
                sheet.column(colIdx + 1).width(Math.min(Math.max(maxLen + 4, 12), 40));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportOrganizationAllAssetItemsExcel ERROR:', error);
            throw error;
        }
    }
    async fetchAllActiveItems(searchQuery, category = [], subCategory = []) {
        try {
            let queryBuilder = this.assetItemRepository
                .createQueryBuilder('asset_items')
                .leftJoinAndSelect('asset_items.main_category', 'main_category')
                .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
                .where('asset_items.is_active = :active', { active: 1 })
                .andWhere('asset_items.is_deleted = :deleted', { deleted: 0 });
            if (searchQuery?.trim()) {
                queryBuilder = queryBuilder.andWhere('asset_items.asset_item_name ILIKE :search', { search: `%${searchQuery}%` });
            }
            if (category && category !== 'all') {
                let categoryIds = [];
                if (Array.isArray(category)) {
                    categoryIds = category.map((id) => Number(id));
                }
                else if (typeof category === 'string' && category.trim() !== '') {
                    categoryIds = category.split(',').map((id) => Number(id));
                }
                if (categoryIds.length > 0) {
                    queryBuilder = queryBuilder.andWhere('asset_items.main_category_id IN (:...categoryIds)', { categoryIds });
                }
            }
            if (subCategory && subCategory !== 'all') {
                let subCategoryIds = [];
                if (Array.isArray(subCategory)) {
                    subCategoryIds = subCategory.map(Number);
                }
                else if (typeof subCategory === 'string' && subCategory.trim()) {
                    subCategoryIds = subCategory.split(',').map(Number);
                }
                if (subCategoryIds.length > 0) {
                    queryBuilder = queryBuilder.andWhere('asset_items.sub_category_id IN (:...subCategoryIds)', { subCategoryIds });
                }
            }
            const { entities, raw } = await queryBuilder
                .addSelect((subQuery) => subQuery
                .select('COUNT(serials.asset_stocks_unique_id)', 'asset_count')
                .from(asset_stock_serials_entity_1.AssetStockSerials, 'serials')
                .where('serials.asset_item_id = asset_items.asset_item_id'), 'asset_count')
                .orderBy('asset_items.asset_item_name', 'ASC')
                .getRawAndEntities();
            return entities.map((entity, idx) => ({
                ...entity,
                asset_count: Number(raw[idx]?.asset_count) || 0,
            }));
        }
        catch (error) {
            console.error('Error fetching active asset items:', error);
            throw new common_1.BadRequestException(`Error fetching active asset items: ${error.message}`);
        }
    }
    async fetchAllActiveItems2(searchQuery, category = [], subCategory = [], branchIds = [], userId, schema) {
        try {
            if (!schema) {
                throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
            }
            const roleCacheKey = `user_role:${schema}:${userId}`;
            const roleId = await (async () => {
                const cachedRole = await this.redisService.get(roleCacheKey);
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
                await this.redisService.set(roleCacheKey, roleId, 600);
                return roleId;
            })();
            const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
            let hasSelfAccess = await this.redisService.get(permCacheKey);
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
                await this.redisService.set(permCacheKey, hasSelfAccess, 300);
            }
            let queryBuilder = this.assetItemRepository
                .createQueryBuilder('asset_items')
                .leftJoinAndSelect('asset_items.main_category', 'main_category')
                .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
                .where('asset_items.is_active = :active', { active: 1 })
                .andWhere('asset_items.is_deleted = :deleted', { deleted: 0 });
            if (searchQuery?.trim()) {
                queryBuilder = queryBuilder.andWhere('asset_items.asset_item_name ILIKE :search', { search: `%${searchQuery}%` });
            }
            if (category && category !== 'all') {
                let categoryIds = [];
                if (Array.isArray(category)) {
                    categoryIds = category.map(Number);
                }
                else if (typeof category === 'string' && category.trim()) {
                    categoryIds = category.split(',').map(Number);
                }
                if (categoryIds.length > 0) {
                    queryBuilder = queryBuilder.andWhere('asset_items.main_category_id IN (:...categoryIds)', { categoryIds });
                }
            }
            if (subCategory && subCategory !== 'all') {
                let subCategoryIds = [];
                if (Array.isArray(subCategory)) {
                    subCategoryIds = subCategory.map(Number);
                }
                else if (typeof subCategory === 'string' && subCategory.trim()) {
                    subCategoryIds = subCategory.split(',').map(Number);
                }
                if (subCategoryIds.length > 0) {
                    queryBuilder = queryBuilder.andWhere('asset_items.sub_category_id IN (:...subCategoryIds)', { subCategoryIds });
                }
            }
            const { entities, raw } = await queryBuilder
                .addSelect((subQuery) => {
                subQuery
                    .select('COUNT(serials.asset_stocks_unique_id)', 'asset_count')
                    .from(asset_stock_serials_entity_1.AssetStockSerials, 'serials')
                    .leftJoin('stocks', 'st', 'st.stock_id = serials.stock_id')
                    .where('serials.asset_item_id = asset_items.asset_item_id')
                    .andWhere('serials.is_deleted = 0');
                (0, branch_access_1.applyBranchFilter)({
                    qb: subQuery,
                    entityKey: 'Stock',
                    branchIds,
                });
                if (hasSelfAccess) {
                    subQuery.andWhere('serials.created_by = :selfUserId', {
                        selfUserId: userId,
                    });
                }
                return subQuery;
            }, 'asset_count')
                .orderBy('asset_items.asset_item_name', 'ASC')
                .getRawAndEntities();
            const flat = entities.map((entity, idx) => ({
                id: entity.asset_item_id,
                name: entity.asset_item_name,
                icon: entity.asset_item_icon,
                asset_count: Number(raw[idx]?.asset_count) || 0,
                category: entity.main_category?.main_category_name ?? 'Uncategorized',
                category_id: entity.main_category?.main_category_id ?? null,
                subCategory: entity.sub_category?.sub_category_name ?? '',
                subCategoryId: entity.sub_category?.sub_category_id ?? null,
            }));
            const grouped = {};
            for (const item of flat) {
                if (!grouped[item.category]) {
                    grouped[item.category] = { category_id: item.category_id, items: [] };
                }
                grouped[item.category].items.push(item);
            }
            const groupedArray = Object.entries(grouped)
                .map(([categoryName, val]) => ({
                category: categoryName,
                category_id: val.category_id,
                items: val.items,
            }))
                .sort((a, b) => {
                if (a.category === 'IT')
                    return -1;
                if (b.category === 'IT')
                    return 1;
                return a.category.localeCompare(b.category);
            });
            return groupedArray;
        }
        catch (error) {
            console.error('Error fetching active asset items:', error);
            throw new common_1.BadRequestException(`Error fetching active asset items: ${error.message}`);
        }
    }
    async exportFilteredExcelForAssetItems({ search, filters, }) {
        const queryBuilder = this.assetItemRepository
            .createQueryBuilder('asset_items')
            .leftJoinAndSelect('asset_items.main_category', 'main_category')
            .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
            .leftJoinAndSelect('asset_items.related_items', 'related_items', 'related_items.is_active = :related_is_active AND related_items.is_deleted = :related_is_deleted', { related_is_active: 1, related_is_deleted: 0 })
            .leftJoinAndSelect('related_items.child_item', 'child_item')
            .where('asset_items.is_active = :isActive', { isActive: 1 })
            .andWhere('asset_items.is_deleted = :isDeleted', { isDeleted: 0 });
        if (search && search.trim() !== '') {
            const normalizedSearch = search.trim().replace(/\s+/g, ' ');
            queryBuilder.andWhere('asset_items.asset_item_name ILIKE :search', {
                search: `%${normalizedSearch}%`,
            });
        }
        if (filters && Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value === undefined ||
                    value === null ||
                    value === '' ||
                    key === 'sortOrder')
                    continue;
                if (typeof value === 'object' && value.from && value.to) {
                    queryBuilder.andWhere(`asset_items.${key} BETWEEN :from_${key} AND :to_${key}`, {
                        [`from_${key}`]: value.from,
                        [`to_${key}`]: value.to,
                    });
                }
                else if (key === 'main_category_id') {
                    queryBuilder.andWhere('asset_items.main_category_id = :mainCategoryId', { mainCategoryId: value });
                }
                else if (key === 'sub_category_id') {
                    queryBuilder.andWhere('asset_items.sub_category_id = :subCategoryId', { subCategoryId: value });
                }
                else if (typeof value === 'boolean') {
                    queryBuilder.andWhere(`asset_items.${key} = :${key}`, {
                        [key]: value,
                    });
                }
                else {
                    queryBuilder.andWhere(`CAST(asset_items.${key} AS TEXT) ILIKE :${key}`, { [key]: `%${value}%` });
                }
            }
        }
        let sortField = 'asset_items.asset_item_name';
        let sortDirection = 'ASC';
        if (filters?.sortOrder) {
            const order = filters.sortOrder.toLowerCase();
            if (order === 'desc')
                sortDirection = 'DESC';
            else if (order === 'asc')
                sortDirection = 'ASC';
            else if (order === 'newest') {
                sortField = 'asset_items.created_at';
                sortDirection = 'DESC';
            }
            else if (order === 'oldest') {
                sortField = 'asset_items.created_at';
                sortDirection = 'ASC';
            }
        }
        queryBuilder.orderBy(sortField, sortDirection);
        const data = await queryBuilder.getMany();
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Asset Items');
        const headers = [
            'Sr. No.',
            'Item Name',
            'Main Category',
            'Sub Category',
            'Description',
            'Licensable',
        ];
        headers.forEach((header, i) => {
            sheet
                .cell(1, i + 1)
                .value(header)
                .style({ bold: true });
        });
        data.forEach((item, index) => {
            const row = index + 2;
            sheet.cell(row, 1).value(index + 1);
            sheet.cell(row, 2).value(item.asset_item_name || '');
            sheet.cell(row, 3).value(item.main_category?.main_category_name || '');
            sheet.cell(row, 4).value(item.sub_category?.sub_category_name || '');
            sheet.cell(row, 5).value(item.asset_item_description || '');
            sheet.cell(row, 6).value(item.is_licensable ? 'Yes' : 'No');
        });
        headers.forEach((_, i) => {
            sheet.column(i + 1).width(headers[i].length + 10);
        });
        return await workbook.outputAsync();
    }
    async exportItemsCSV() {
        try {
            const whereCondition = { is_active: 1, is_deleted: 0 };
            const [results, total] = await this.assetItemRepository
                .createQueryBuilder('item')
                .leftJoinAndSelect('item.main_category', 'mainCategory')
                .leftJoinAndSelect('item.sub_category', 'subCategory')
                .where(whereCondition)
                .orderBy('item.asset_item_id', 'DESC')
                .getManyAndCount();
            console.log('Fetched Items:', results);
            const decodedResults = results.map((item) => ({
                'Item Name': item.asset_item_name || '',
                'Main Category': item.main_category?.main_category_name || 'N/A',
                'Sub Category': item.sub_category?.sub_category_name || 'N/A',
                Description: item.asset_item_description || '',
                'Added By': item.added_by || '',
                'Created At': item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : '',
                'Updated At': item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString()
                    : '',
            }));
            return { decodedResults };
        }
        catch (error) {
            console.error('Error exporting items CSV:', error);
            throw new Error('An error occurred while exporting item data.');
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
    async createNewAssetItem(dto, file, organizationID) {
        console.log('CreateAssetItemNewDto', dto);
        console.log('ADD_ITEM_SERVICE');
        const parseWarranty = (value) => {
            if (!value)
                return null;
            let parsed = value;
            if (typeof value === 'string') {
                try {
                    parsed = JSON.parse(value);
                }
                catch {
                    return null;
                }
            }
            if (!Array.isArray(parsed))
                return null;
            return parsed[0] ? parsed : null;
        };
        console.log('ADD_ITEM_SERVICE 2');
        const toBoolean = (val) => {
            if (typeof val === 'boolean')
                return val;
            if (typeof val === 'string')
                return val === 'true';
            return false;
        };
        try {
            console.log('ADD_ITEM_SERVICE 3');
            const allItems = await this.assetItemRepository.find();
            const existingItem = allItems.find((item) => item.asset_item_name?.toLowerCase() ===
                dto.asset_item_name?.toLowerCase());
            if (existingItem) {
                console.log('ADD_ITEM_SERVICE 4');
                if (existingItem.is_deleted === 1) {
                    existingItem.is_deleted = 0;
                    existingItem.is_active = 1;
                    existingItem.updated_at = new Date();
                    existingItem.asset_item_description =
                        dto.asset_item_description ?? existingItem.asset_item_description;
                    existingItem.main_category_id = dto.main_category_id;
                    existingItem.sub_category_id = dto.sub_category_id;
                    existingItem.item_type = dto.item_type;
                    existingItem.license_metric =
                        dto.item_type === ItemType.VIRTUAL
                            ? dto.license_metric || existingItem.license_metric || 'PER_DEVICE'
                            : null;
                    asset_type: dto.asset_type ?? null,
                        (existingItem.asset_block = dto.asset_block);
                    existingItem.asset_block_it = dto.asset_block_it;
                    existingItem.company_act_asset_life = dto.company_act_asset_life;
                    existingItem.company_depreciation_rate =
                        dto.company_depreciation_rate;
                    existingItem.it_act_asset_life = dto.it_act_asset_life;
                    existingItem.it_act_depreciation_rate = dto.it_act_depreciation_rate;
                    existingItem.warranty_type = parseWarranty(dto.warranty_type);
                    existingItem.is_licensable = toBoolean(dto.is_licensable);
                    existingItem.import_barcode = toBoolean(dto.import_barcode);
                    existingItem.has_depreciation = toBoolean(dto.has_depreciation);
                    existingItem.has_serials = toBoolean(dto.has_serials);
                    existingItem.has_warranty = toBoolean(dto.has_warranty);
                    existingItem.upload_documents = toBoolean(dto.upload_documents);
                    existingItem.added_by = dto.added_by;
                    if (file) {
                        existingItem.asset_item_icon = await this.saveItemIcon(file);
                    }
                    const reactivatedItem = await this.assetItemRepository.save(existingItem);
                    const customFieldsArray = Array.isArray(dto.custom_fields)
                        ? dto.custom_fields
                        : JSON.parse(dto.custom_fields || '[]');
                    if (customFieldsArray.length) {
                        const mappingRepo = this.dataSource.getRepository(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping);
                        console.log('ADD_ITEM_SERVICE 4');
                        const newMappings = customFieldsArray.map((field, index) => {
                            const mapping = new asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping();
                            mapping.asset_item_id = reactivatedItem.asset_item_id;
                            mapping.asset_field_id = field.field_id;
                            mapping.asset_field_category_id =
                                field.asset_field_category_id ?? null;
                            mapping.aif_is_enabled = 1;
                            mapping.aif_is_mandatory = field.is_mandatory ?? 0;
                            mapping.is_individual = field.is_individual ?? 0;
                            mapping.aif_is_active = 1;
                            mapping.aif_is_deleted = 0;
                            mapping.aif_added_by = dto.added_by;
                            mapping.default_value = field.default_value || null;
                            mapping.aif_sequence = field.sequence ?? index + 1;
                            return mapping;
                        });
                        await mappingRepo.save(newMappings);
                    }
                    console.log('ADD_ITEM_SERVICE 3');
                    console.log('REDIS UPDATE:ITEM-ADD');
                    await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
                    await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Asset item reactivated successfully',
                        data: { user: reactivatedItem },
                    };
                }
                throw new common_1.BadRequestException({
                    status: common_1.HttpStatus.CONFLICT,
                    message: `Item '${dto.asset_item_name}' already exists.`,
                    data: existingItem,
                });
            }
            let filePath = null;
            if (file) {
                filePath = await this.saveItemIcon(file);
            }
            const newItem = this.assetItemRepository.create({
                asset_item_name: dto.asset_item_name,
                asset_item_icon: filePath,
                main_category_id: Number(dto.main_category_id),
                sub_category_id: Number(dto.sub_category_id),
                item_type: dto.item_type,
                license_metric: dto.item_type === ItemType.VIRTUAL
                    ? dto.license_metric || 'PER_DEVICE'
                    : null,
                asset_type: dto.asset_type ?? null,
                asset_block: dto.asset_block,
                asset_block_it: dto.asset_block_it,
                asset_item_description: dto.asset_item_description,
                warranty_type: parseWarranty(dto.warranty_type),
                is_licensable: toBoolean(dto.is_licensable),
                import_barcode: toBoolean(dto.import_barcode),
                has_depreciation: toBoolean(dto.has_depreciation),
                upload_documents: toBoolean(dto.upload_documents),
                has_serials: toBoolean(dto.has_serials),
                has_warranty: toBoolean(dto.has_warranty),
                company_act_asset_life: dto.company_act_asset_life,
                it_act_asset_life: dto.it_act_asset_life,
                company_depreciation_rate: dto.company_depreciation_rate,
                it_act_depreciation_rate: dto.it_act_depreciation_rate,
                company_act_residual_value: dto.company_act_residual_value,
                it_act_residual_value: dto.it_act_residual_value,
                added_by: dto.added_by,
                is_active: 1,
                is_deleted: 0,
                created_at: new Date(),
                updated_at: new Date(),
            });
            console.log('new item', newItem);
            const savedItem = (await this.assetItemRepository.save(newItem));
            console.log('new item', savedItem);
            const customFieldsArray = Array.isArray(dto.custom_fields)
                ? dto.custom_fields
                : JSON.parse(dto.custom_fields || '[]');
            if (customFieldsArray.length) {
                const mappingRepo = this.dataSource.getRepository(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping);
                const newMappings = customFieldsArray.map((field, index) => {
                    const mapping = new asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping();
                    mapping.asset_item_id = savedItem.asset_item_id;
                    mapping.asset_field_id = field.field_id;
                    mapping.asset_field_category_id =
                        field.asset_field_category_id ?? null;
                    mapping.aif_is_enabled = 1;
                    mapping.aif_is_mandatory = field.is_mandatory ?? 0;
                    mapping.is_individual = field.is_individual ?? 0;
                    mapping.aif_is_active = 1;
                    mapping.aif_is_deleted = 0;
                    mapping.aif_added_by = dto.added_by;
                    mapping.default_value = field.default_value || null;
                    mapping.aif_sequence = field.sequence ?? index + 1;
                    return mapping;
                });
                await mappingRepo.save(newMappings);
            }
            this.depViewService.scheduleRefresh(organizationID);
            this.stockSummaryRefresh.scheduleRefresh(organizationID);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
            return {
                status: common_1.HttpStatus.CREATED,
                message: 'Item created successfully',
                data: { user: savedItem },
            };
        }
        catch (error) {
            console.error('Error creating new asset item:', error);
            throw error;
        }
    }
    async saveItemIcon(file) {
        const ext = file.mimetype === 'image/svg+xml' ? 'svg' : file.mimetype.split('/')[1];
        const fileName = `item-${Date.now()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const savePath = path.join(uploadDir, fileName);
        fs.writeFileSync(savePath, file.buffer);
        return `/uploads/${fileName}`;
    }
    async generateItemTemplate() {
        try {
            const categories = await this.assetCategoriesService.findAll();
            const subCategories = await this.assetSubCategoriesService.findAll();
            const categoryNames = categories.map((cat) => cat.main_category_name.trim());
            const subCategoryMap = {};
            categories.forEach((cat) => {
                subCategoryMap[cat.main_category_name.trim()] = [];
            });
            subCategories.forEach((sub) => {
                const category = categories.find((cat) => cat.main_category_id === sub.main_category_id);
                if (category) {
                    const categoryName = category.main_category_name.trim();
                    if (!subCategoryMap[categoryName])
                        subCategoryMap[categoryName] = [];
                    if (sub.sub_category_name && sub.sub_category_name.trim()) {
                        subCategoryMap[categoryName].push(sub.sub_category_name.trim());
                    }
                }
                else {
                    console.log(`Category not found for main_category_id: ${sub.main_category_id}`);
                }
            });
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('Items_template');
            const dataSheet = workbook.addSheet('Data');
            const instructions = [
                'Instructions:',
                '1. Fill in all required fields starting from row 7.',
                '2. "Category" and "Sub-Category" must be selected from dropdowns.',
                '3. Do not edit the header row (Row 6).',
                '4. Use "Yes"/"No" only in the Licensable field.',
                '5. Use "Physical"/"Virtual" for Item Type.',
            ];
            instructions.forEach((text, index) => {
                mainSheet
                    .cell(index + 1, 1)
                    .value(text)
                    .style({
                    bold: true,
                    fontColor: '0000FF',
                });
            });
            const headers = [
                { label: 'Category', required: true },
                { label: 'Sub-Category', required: true },
                { label: 'Item Name', required: true },
                { label: 'Item Description', required: false },
                { label: 'Is item Licensable ?', required: true },
                { label: 'Item Type', required: true },
            ];
            headers.forEach((item, index) => {
                const cell = mainSheet.cell(6, index + 1);
                const label = item.required ? `${item.label} *` : item.label;
                cell.value(label).style({
                    bold: true,
                    fontColor: item.required ? 'FF0000' : '000000',
                });
            });
            const columnWidths = [25, 25, 30, 40, 25, 20];
            columnWidths.forEach((width, index) => {
                mainSheet.column(index + 1).width(width);
            });
            const startRow = 7;
            const endRow = 1048576;
            categoryNames.forEach((catName, i) => {
                dataSheet.cell(i + 1, 1).value(catName);
                const subs = subCategoryMap[catName];
                if (subs) {
                    subs.forEach((subName, j) => {
                        if (subName && subName.trim()) {
                            dataSheet.cell(i + 1, j + 2).value(subName.trim());
                        }
                    });
                }
            });
            categoryNames.forEach((catName, i) => {
                const safeName = catName.replace(/\s+/g, '_');
                const subs = subCategoryMap[catName];
                if (subs && subs.length > 0) {
                    const startCol = 2;
                    const endCol = startCol + subs.length - 1;
                    const colLetter = (colNum) => {
                        let temp = '';
                        let n = colNum;
                        while (n > 0) {
                            let remainder = (n - 1) % 26;
                            temp = String.fromCharCode(65 + remainder) + temp;
                            n = Math.floor((n - 1) / 26);
                        }
                        return temp;
                    };
                    const startAddress = `${colLetter(startCol)}${i + 1}`;
                    const endAddress = `${colLetter(endCol)}${i + 1}`;
                    const range = `${dataSheet.name()}!${startAddress}:${endAddress}`;
                    workbook.definedName(safeName, range);
                    console.log('====================================');
                    console.log('VERIFYING NAMED RANGES');
                    try {
                        const definedNames = workbook.definedNames();
                        console.log('DEFINED NAMES:', JSON.stringify(definedNames, null, 2));
                    }
                    catch (err) {
                        console.log('ERROR READING DEFINED NAMES', err);
                    }
                }
            });
            mainSheet.range(`A${startRow}:A${endRow}`).dataValidation({
                type: 'list',
                allowBlank: false,
                showInputMessage: true,
                formula1: `=Data!$A$1:$A$${categoryNames.length}`,
            });
            mainSheet.range(`B${startRow}:B${endRow}`).dataValidation({
                type: 'list',
                allowBlank: false,
                showInputMessage: true,
                formula1: `=INDIRECT(SUBSTITUTE(A${startRow}," ","_"))`,
            });
            mainSheet.range(`E${startRow}:E${endRow}`).dataValidation({
                type: 'list',
                allowBlank: false,
                formula1: `"Yes,No"`,
            });
            mainSheet.range(`F${startRow}:F${endRow}`).dataValidation({
                type: 'list',
                allowBlank: false,
                formula1: `"${ItemType.PHYSICAL},${ItemType.VIRTUAL}"`,
            });
            dataSheet.hidden(true);
            const buffer = await workbook.outputAsync();
            return buffer;
        }
        catch (error) {
            console.error('Error generating template:', error);
            throw new Error('Failed to generate Excel template');
        }
    }
    async bulkCreateItem(dtos, user_id) {
        const newItems = [];
        const errorItems = [];
        const successItems = [];
        console.log('🔵 [START] bulkCreateItem called:', {
            total_dtos: dtos.length,
            user_id,
        });
        const existingItems = await this.assetItemRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        console.log('📦 [INFO] Existing items count:', existingItems.length);
        const existingCategory = await this.categoryepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        const existingSubCategory = await this.subCategoryRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        for (const dto of dtos) {
            console.log('🔄 [PROCESSING] Incoming DTO:', dto);
            if (!dto.category || !dto.subcategory || !dto.items || !dto.item_type) {
                errorItems.push({
                    ...dto,
                    reason: 'Missing required fields (category, subcategory, item name, or item type)',
                });
                console.warn('⚠️ [SKIPPED] Missing required fields');
                continue;
            }
            dto.added_by = user_id;
            const matchedCategory = existingCategory.find((category) => category.main_category_name?.trim().toLowerCase() ===
                dto.category?.trim().toLowerCase());
            dto.main_category_id = matchedCategory?.main_category_id || null;
            const submatchedCategory = existingSubCategory.find((subcategory) => subcategory.sub_category_name?.trim().toLowerCase() ===
                dto.subcategory?.trim().toLowerCase());
            dto.sub_category_id = submatchedCategory?.sub_category_id || null;
            console.log('🧩 [MAPPED] Category IDs:', {
                main_category_id: dto.main_category_id,
                sub_category_id: dto.sub_category_id,
            });
            if (!dto.main_category_id || !dto.sub_category_id) {
                errorItems.push({ ...dto, reason: 'Invalid category or subcategory' });
                console.warn('⚠️ [SKIPPED] Invalid category or subcategory');
                continue;
            }
            if (!Object.values(ItemType).includes(dto.item_type)) {
                errorItems.push({
                    ...dto,
                    reason: `Invalid item type: must be ${ItemType.PHYSICAL} or ${ItemType.VIRTUAL}`,
                });
                console.warn('⚠️ [SKIPPED] Invalid item type:', dto.item_type);
                continue;
            }
            const isDuplicate = existingItems.find((item) => item.asset_item_name?.trim().toLowerCase() ===
                dto.items?.trim().toLowerCase() &&
                item.main_category_id === dto.main_category_id &&
                item.sub_category_id === dto.sub_category_id);
            if (isDuplicate) {
                errorItems.push({ ...dto, reason: 'Duplicate item exists' });
                console.warn('⚠️ [SKIPPED] Duplicate item found:', dto.items);
                continue;
            }
            const newItem = this.assetItemRepository.create({
                asset_item_name: dto.items.trim(),
                asset_item_description: dto.description?.trim() || '',
                is_licensable: dto.isLicensable,
                main_category_id: dto.main_category_id,
                sub_category_id: dto.sub_category_id,
                added_by: dto.added_by,
                item_type: dto.item_type.trim(),
            });
            try {
                const savedItem = await this.assetItemRepository.save(newItem);
                if (!savedItem) {
                    errorItems.push({ ...dto, reason: 'Failed to save item' });
                    console.error('❌ [SAVE FAILED]', dto.items);
                }
                else {
                    successItems.push(dto);
                    console.log('✅ [SAVED] Item created:', dto.items);
                }
            }
            catch (err) {
                console.error('❌ [ERROR] Exception while saving item:', err);
                errorItems.push({
                    ...dto,
                    reason: 'Exception while saving item: ' + err.message,
                });
            }
        }
        console.log('📦 [SUMMARY]', {
            created: successItems.length,
            failed: errorItems.length,
        });
        if (successItems.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        }
        return {
            status: successItems.length ? common_1.HttpStatus.CREATED : common_1.HttpStatus.CONFLICT,
            message: successItems.length && errorItems.length
                ? 'Bulk assets created successfully with some conflicts.'
                : successItems.length
                    ? 'All assets created successfully.'
                    : 'No new assets created. All entries had conflicts.',
            data: {
                created_count: successItems.length,
                created_items: successItems,
                error_items: errorItems,
            },
        };
    }
    async fetchSingleAssetItemData(deleteAssetItemDto, req) {
        const { asset_item_id } = deleteAssetItemDto;
        if (!asset_item_id) {
            throw new common_1.BadRequestException('Item ID is required');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (req) {
                const fullSchemaName = await this.getSchemaNameFromRequest(req, crypto_utils_1.decrypt);
                await queryRunner.query(`SET search_path TO "${fullSchemaName}";`);
            }
            const itemData = await queryRunner.manager
                .createQueryBuilder(asset_item_entity_1.AssetItem, 'asset_item')
                .leftJoinAndSelect('asset_item.main_category', 'main_category')
                .leftJoinAndSelect('asset_item.sub_category', 'sub_category')
                .where('asset_item.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('asset_item.is_deleted = 0')
                .getOne();
            if (!itemData) {
                await queryRunner.rollbackTransaction();
                return {
                    status: 404,
                    message: `Item with ID ${asset_item_id} not found or inactive`,
                    data: null,
                };
            }
            const customFields = await queryRunner.manager
                .createQueryBuilder(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping, 'mapping')
                .leftJoinAndSelect('mapping.asset_field', 'asset_field')
                .leftJoinAndSelect('asset_field.category', 'category', 'category.is_active = 1 AND category.is_deleted = 0')
                .where('mapping.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('mapping.aif_is_active = 1')
                .andWhere('mapping.aif_is_deleted = 0')
                .getMany();
            const customFieldArray = customFields.map((field) => ({
                asset_field_id: field.asset_field_id,
                is_multiple: field.asset_field.is_multiple,
                asset_field_name: field.asset_field.asset_field_name,
                asset_field_description: field.asset_field.asset_field_description,
                asset_field_label_name: field.asset_field.asset_field_label_name,
                asset_field_type: field.asset_field.asset_field_type,
                asset_field_type_details: field.asset_field.asset_field_type_details,
                aif_is_mandatory: field.aif_is_mandatory,
                is_individual: field.is_individual,
                is_custom_field: field.asset_field.is_custom_field,
                asset_field_category_id: field.asset_field_category_id,
                category: field.asset_field.category
                    ? {
                        asset_field_category_id: field.asset_field.category.asset_field_category_id,
                        asset_field_category_name: field.asset_field.category.asset_field_category_name,
                    }
                    : null,
            }));
            const combinedData = {
                ...itemData,
                customFields: customFieldArray,
                main_category_name: itemData?.main_category?.main_category_name || null,
                sub_category_name: itemData?.sub_category?.sub_category_name || null,
            };
            await queryRunner.commitTransaction();
            return {
                status: 200,
                message: 'Item fetched successfully',
                data: combinedData,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error fetching item:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching the item',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async fetchSingleItemDataForForm(deleteAssetItemDto, req) {
        const { asset_item_id } = deleteAssetItemDto;
        if (!asset_item_id) {
            throw new common_1.BadRequestException('Item ID is required');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        console.log('p1');
        try {
            if (req) {
                const fullSchemaName = await this.getSchemaNameFromRequest(req, crypto_utils_1.decrypt);
                console.log('p2');
                console.log('fullSchemaName:2', fullSchemaName);
                console.log('p3');
                await queryRunner.query(`SET search_path TO ${fullSchemaName};`);
                console.log('p4');
            }
            const itemData = await queryRunner.manager
                .createQueryBuilder(asset_item_entity_1.AssetItem, 'asset_item')
                .leftJoinAndSelect('asset_item.main_category', 'main_category')
                .leftJoinAndSelect('asset_item.sub_category', 'sub_category')
                .where('asset_item.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('asset_item.is_deleted = 0')
                .getOne();
            console.log('p5');
            if (!itemData) {
                await queryRunner.rollbackTransaction();
                return {
                    status: 404,
                    message: `Item with ID ${asset_item_id} not found or inactive`,
                    data: null,
                };
            }
            console.log('p6');
            const customFields = await queryRunner.manager
                .createQueryBuilder(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping, 'mapping')
                .leftJoinAndSelect('mapping.asset_field', 'asset_field')
                .leftJoinAndSelect('asset_field.category', 'category', 'category.is_active = 1 AND category.is_deleted = 0')
                .where('mapping.asset_item_id = :asset_item_id', { asset_item_id })
                .andWhere('mapping.aif_is_active = 1')
                .andWhere('mapping.aif_is_deleted = 0')
                .orderBy('mapping.asset_field_category_id', 'ASC')
                .addOrderBy('mapping.aif_sequence', 'ASC')
                .addOrderBy('asset_field.asset_field_name', 'ASC')
                .getMany();
            console.log('p7');
            const customFieldArray = customFields.map((field) => ({
                asset_field_id: field.asset_field_id,
                is_multiple: field.asset_field.is_multiple,
                asset_field_name: field.asset_field.asset_field_name,
                asset_field_description: field.asset_field.asset_field_description,
                asset_field_label_name: field.asset_field.asset_field_label_name,
                asset_field_type: field.asset_field.asset_field_type,
                asset_field_type_details: field.asset_field.asset_field_type_details,
                aif_is_mandatory: field.aif_is_mandatory,
                is_individual: field.is_individual,
                is_custom_field: field.asset_field.is_custom_field,
                aif_sequence: field.aif_sequence,
                asset_field_category_id: field.asset_field_category_id,
                category: field.asset_field.category
                    ? {
                        asset_field_category_id: field.asset_field.category.asset_field_category_id,
                        asset_field_category_name: field.asset_field.category.asset_field_category_name,
                    }
                    : null,
            }));
            console.log('p8');
            const combinedData = {
                ...itemData,
                customFields: customFieldArray,
                main_category_name: itemData?.main_category?.main_category_name || null,
                sub_category_name: itemData?.sub_category?.sub_category_name || null,
            };
            await queryRunner.commitTransaction();
            return {
                status: 200,
                message: 'Item fetched successfully',
                data: combinedData,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error fetching item:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching the item',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async validateLicenseMetricTransition(itemId, existingItem, targetMetric, targetItemType, schema) {
        const s = schema ? `"${schema}".` : '';
        if (existingItem.item_type === ItemType.VIRTUAL && targetItemType !== ItemType.VIRTUAL) {
            const activeSwLinks = await this.dataSource.query(`
        SELECT m.mapping_id
        FROM ${s}asset_mapping m
        JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id OR (m.target_id = ass.asset_stocks_unique_id AND m.target_type IN ('ASSET', 'SOFTWARE'))
        WHERE ass.asset_item_id = $1
          AND m.relation_type = 'REL-006'
          AND m.is_active = 1 AND m.is_deleted = 0
        LIMIT 1;
        `, [itemId]);
            if (activeSwLinks && activeSwLinks.length > 0) {
                throw new common_1.BadRequestException(`Cannot change Item Type to 'Physical': active software installations (REL-006) exist for '${existingItem.asset_item_name}'. Please unlink all installed instances first.`);
            }
        }
        if (targetItemType === ItemType.VIRTUAL &&
            targetMetric &&
            existingItem.license_metric &&
            targetMetric !== existingItem.license_metric) {
            if (targetMetric === 'PER_USER') {
                const conflictingRows = await this.dataSource.query(`
          SELECT 
            m.mapping_id, 
            m.relation_type, 
            m.target_type,
            COALESCE(ass.asset_serial_title, ass.system_code, 'Serial #' || ass.asset_stocks_unique_id::text) AS serial_name
          FROM ${s}asset_mapping m
          JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id OR (m.target_id = ass.asset_stocks_unique_id AND m.target_type IN ('ASSET', 'SOFTWARE'))
          WHERE ass.asset_item_id = $1
            AND m.is_active = 1 AND m.is_deleted = 0
            AND (
              m.relation_type = 'REL-006'
              OR m.target_type IN ('BRANCH', 'DEPARTMENT')
            );
          `, [itemId]);
                if (conflictingRows && conflictingRows.length > 0) {
                    throw new common_1.BadRequestException(`Cannot change License Metric to 'PER_USER': ${conflictingRows.length} license seat(s) of '${existingItem.asset_item_name}' currently have active device installations (REL-006) or branch assignments. Please unlink device installations or unassign branches first before switching to a User-based license.`);
                }
            }
            if (targetMetric === 'PER_DEVICE') {
                const directCustodyRows = await this.dataSource.query(`
          SELECT m.mapping_id
          FROM ${s}asset_mapping m
          JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
          WHERE ass.asset_item_id = $1
            AND m.is_active = 1 AND m.is_deleted = 0
            AND m.target_type IN ('USER', 'BRANCH', 'DEPARTMENT')
            AND (m.relation_type IS NULL OR m.relation_type = 'REL-001')
            AND (m.is_inherited = 0 OR m.is_inherited IS NULL);
          `, [itemId]);
                if (directCustodyRows && directCustodyRows.length > 0) {
                    throw new common_1.BadRequestException(`Cannot change License Metric to 'PER_DEVICE': ${directCustodyRows.length} license seat(s) of '${existingItem.asset_item_name}' are currently directly assigned to users or branches. Please unassign them before switching to a Per-Device dedicated license.`);
                }
                const multiHostRows = await this.dataSource.query(`
          SELECT m.asset_stocks_unique_id, COUNT(*) as host_count
          FROM ${s}asset_mapping m
          JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
          WHERE ass.asset_item_id = $1
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1 AND m.is_deleted = 0
          GROUP BY m.asset_stocks_unique_id
          HAVING COUNT(*) > 1;
          `, [itemId]);
                if (multiHostRows && multiHostRows.length > 0) {
                    throw new common_1.BadRequestException(`Cannot change License Metric to 'PER_DEVICE': one or more license seats of '${existingItem.asset_item_name}' are installed on multiple host devices. Per-Device licensing allows only 1 host per seat. Please unlink extra device installations first.`);
                }
            }
            if (targetMetric === 'SITE') {
                const userAssignedRows = await this.dataSource.query(`
          SELECT m.mapping_id
          FROM ${s}asset_mapping m
          JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
          WHERE ass.asset_item_id = $1
            AND m.target_type = 'USER'
            AND m.is_active = 1 AND m.is_deleted = 0
            AND (m.is_inherited = 0 OR m.is_inherited IS NULL);
          `, [itemId]);
                if (userAssignedRows && userAssignedRows.length > 0) {
                    throw new common_1.BadRequestException(`Cannot change License Metric to 'SITE': active user assignments exist for '${existingItem.asset_item_name}'. Site licenses cannot be assigned to individual users (they can only be assigned at the Branch level). Please unassign users first.`);
                }
            }
            if (targetMetric === 'FREE') {
                const custodyRows = await this.dataSource.query(`
          SELECT m.mapping_id
          FROM ${s}asset_mapping m
          JOIN ${s}asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
          WHERE ass.asset_item_id = $1
            AND m.target_type IN ('USER', 'BRANCH', 'DEPARTMENT')
            AND m.is_active = 1 AND m.is_deleted = 0
            AND (m.is_inherited = 0 OR m.is_inherited IS NULL);
          `, [itemId]);
                if (custodyRows && custodyRows.length > 0) {
                    throw new common_1.BadRequestException(`Cannot change License Metric to 'FREE': active operational assignments to users or branches exist for '${existingItem.asset_item_name}'. Freeware licenses cannot have user/branch assignments. Please unassign them first.`);
                }
            }
        }
    }
    async updateItemData(updateAssetItemDto, file, organizationID, schema) {
        console.log('updateAssetItemDto', updateAssetItemDto);
        const toBoolean = (val) => {
            if (typeof val === 'boolean')
                return val;
            if (typeof val === 'string')
                return val === 'true';
            return false;
        };
        const toNumber = (val) => {
            if (val === undefined || val === null || val === '' || val === 'null') {
                return null;
            }
            const num = Number(val);
            return isNaN(num) ? null : num;
        };
        const { asset_item_id, asset_item_name, asset_item_description, added_by, main_category_id, sub_category_id, item_type, asset_type, asset_block, asset_block_it, company_act_asset_life, it_act_asset_life, company_depreciation_rate, it_act_depreciation_rate, company_act_residual_value, it_act_residual_value, custom_fields, upload_documents, warranty_type, } = updateAssetItemDto;
        console.log('updateAssetItemDto', updateAssetItemDto);
        const existingItem = await this.assetItemRepository.findOne({
            where: { asset_item_id },
        });
        if (!existingItem) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Item with ID ${asset_item_id} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const targetMetric = item_type === ItemType.VIRTUAL
            ? updateAssetItemDto.license_metric || existingItem.license_metric || 'PER_DEVICE'
            : null;
        await this.validateLicenseMetricTransition(asset_item_id, existingItem, targetMetric, item_type, schema);
        existingItem.asset_item_name = asset_item_name;
        existingItem.asset_item_description = asset_item_description || '';
        existingItem.main_category_id = Number(main_category_id);
        existingItem.sub_category_id = Number(sub_category_id);
        existingItem.item_type = item_type;
        existingItem.license_metric = targetMetric;
        existingItem.asset_type = asset_type ?? null;
        existingItem.asset_block = toNumber(asset_block);
        existingItem.asset_block_it = toNumber(asset_block_it);
        let parsedWarranty = [];
        if (typeof warranty_type === 'string') {
            try {
                parsedWarranty = JSON.parse(warranty_type);
            }
            catch {
                parsedWarranty = [];
            }
        }
        else if (Array.isArray(warranty_type)) {
            parsedWarranty = warranty_type;
        }
        existingItem.warranty_type = parsedWarranty;
        existingItem.is_licensable = toBoolean(updateAssetItemDto.is_licensable);
        existingItem.import_barcode = toBoolean(updateAssetItemDto.import_barcode);
        existingItem.has_depreciation = toBoolean(updateAssetItemDto.has_depreciation);
        existingItem.upload_documents = toBoolean(updateAssetItemDto.upload_documents);
        existingItem.has_serials = toBoolean(updateAssetItemDto.has_serials);
        existingItem.has_warranty = toBoolean(updateAssetItemDto.has_warranty);
        existingItem.company_act_asset_life = toNumber(company_act_asset_life);
        existingItem.it_act_asset_life = toNumber(it_act_asset_life);
        existingItem.company_depreciation_rate = toNumber(company_depreciation_rate);
        existingItem.it_act_depreciation_rate = toNumber(it_act_depreciation_rate);
        existingItem.company_act_residual_value = toNumber(company_act_residual_value);
        existingItem.it_act_residual_value = toNumber(it_act_residual_value);
        if (file) {
            existingItem.asset_item_icon = await this.saveItemIcon(file);
        }
        existingItem.updated_at = new Date();
        existingItem.added_by = added_by;
        const updatedItem = await this.assetItemRepository.save(existingItem);
        const parsedCustomFields = Array.isArray(custom_fields)
            ? custom_fields
            : JSON.parse(custom_fields || '[]');
        const mappingRepo = this.dataSource.getRepository(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping);
        const existingMappings = await mappingRepo.find({
            where: { asset_item_id, aif_is_deleted: 0 },
        });
        const existingMap = new Map();
        existingMappings.forEach((m) => {
            existingMap.set(m.asset_field_id, m);
        });
        const payloadMap = new Map();
        parsedCustomFields.forEach((field) => {
            payloadMap.set(field.field_id, field);
        });
        let index = 0;
        for (const [fieldId, field] of payloadMap.entries()) {
            const sequence = field.sequence ?? index + 1;
            index++;
            if (existingMap.has(fieldId)) {
                const existing = existingMap.get(fieldId);
                existing.aif_is_mandatory = field.is_mandatory ?? 0;
                existing.is_individual = field.is_individual ?? 0;
                existing.default_value = field.default_value ?? null;
                existing.asset_field_category_id =
                    field.asset_field_category_id ?? null;
                existing.aif_sequence = sequence;
                existing.aif_is_active = 1;
                existing.aif_is_deleted = 0;
                await mappingRepo.save(existing);
            }
            else {
                const newMapping = mappingRepo.create({
                    asset_item_id,
                    asset_field_id: field.field_id,
                    asset_field_category_id: field.asset_field_category_id ?? null,
                    aif_is_enabled: 1,
                    aif_is_mandatory: field.is_mandatory ?? 0,
                    is_individual: field.is_individual ?? 0,
                    default_value: field.default_value ?? null,
                    aif_sequence: sequence,
                    aif_is_active: 1,
                    aif_is_deleted: 0,
                    aif_added_by: added_by,
                });
                await mappingRepo.save(newMapping);
            }
        }
        for (const [fieldId, existing] of existingMap.entries()) {
            if (!payloadMap.has(fieldId)) {
                existing.aif_is_deleted = 1;
                existing.aif_is_active = 0;
                await mappingRepo.save(existing);
            }
        }
        console.log('REDIS UPDATE:ITEM-UPDATE');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        this.depViewService.scheduleRefresh(organizationID);
        this.stockSummaryRefresh.scheduleRefresh(organizationID);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Item updated successfully',
            data: { item: updatedItem },
        };
    }
    async bulkDeleteItems(itemIds) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new common_1.BadRequestException('No asset item IDs provided for deletion.');
        }
        const results = [];
        const itemsToDelete = [];
        for (const id of itemIds) {
            const existingItem = await this.assetItemRepository.findOne({
                where: { asset_item_id: id },
            });
            if (!existingItem) {
                results.push({
                    id,
                    status: 'failed',
                    message: `Item with ID ${id} not found.`,
                });
                continue;
            }
            const isAssigned = await this.entityLookupService.checkItemHaveAssignedAsset(id);
            if (isAssigned) {
                results.push({
                    id,
                    status: 'failed',
                    name: existingItem.asset_item_name,
                    message: 'Asset item already assigned to assets',
                });
                continue;
            }
            itemsToDelete.push(existingItem);
            results.push({
                id,
                status: 'success',
                name: existingItem.asset_item_name,
            });
        }
        if (itemsToDelete.length > 0) {
            await this.assetItemRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0, is_deleted: 1 })
                .where('asset_item_id IN (:...ids)', {
                ids: itemsToDelete.map((item) => item.asset_item_id),
            })
                .execute();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        }
        const successful = results.filter((r) => r.status === 'success');
        const failed = results.filter((r) => r.status === 'failed');
        if (failed.length > 0) {
            throw new common_1.BadRequestException({
                success: false,
                message: `Could not delete the following item IDs: ${failed.map((f) => f.id).join(', ')}`,
                details: failed,
            });
        }
        let message = '';
        if (successful.length === 1) {
            message = `"${successful[0].name}" deleted successfully`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} items deleted successfully`;
        }
        else {
            message = 'No items were deleted';
        }
        console.log('REDIS UPDATE:ITEM-DELETE');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.ITEM);
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async getAssetItemWithRelations(assetItemId) {
        try {
            const assetItem = await this.assetItemRepository.findOne({
                where: { asset_item_id: assetItemId, is_active: 1, is_deleted: 0 },
                relations: ['main_category', 'sub_category'],
            });
            if (!assetItem) {
                throw new common_1.HttpException(`Asset Item with ID ${assetItemId} not found.`, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                assetItem,
                relations: [],
            };
        }
        catch (error) {
            console.error('Error fetching asset item with relations:', error);
            throw new common_1.HttpException('An error occurred while fetching asset item details.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSidebarMenuOption() {
        const categories = await this.categoryepository
            .createQueryBuilder('cat')
            .leftJoinAndSelect('cat.subcategories', 'sub', 'sub.is_deleted = :subDeleted', { subDeleted: 0 })
            .leftJoinAndSelect('sub.items', 'item', 'item.is_deleted = :itemDeleted', { itemDeleted: 0 })
            .where('cat.is_deleted = :catDeleted', { catDeleted: 0 })
            .orderBy('cat.main_category_name', 'ASC')
            .addOrderBy('sub.sub_category_name', 'ASC')
            .addOrderBy('item.asset_item_name', 'ASC')
            .getMany();
        return categories.map((cat) => ({
            main_category_id: cat.main_category_id,
            main_category_name: cat.main_category_name,
            main_category_icon: cat.main_category_icon,
            main_category_children: (cat.subcategories || []).map((sub) => ({
                sub_category_id: sub.sub_category_id,
                sub_category_name: sub.sub_category_name,
                sub_category_icon: sub.sub_category_icon,
                sub_category_children: (sub.items || []).map((item) => ({
                    asset_item_id: item.asset_item_id,
                    name: item.asset_item_name,
                    asset_item_icon: item.asset_item_icon,
                })),
            })),
        }));
    }
    async fetchAssetBlocks(searchQuery) {
        console.log('fetchAssetBlocks hit');
        try {
            const queryBuilder = this.dataSource
                .getRepository(block_of_assets_entity_1.AssetBlock)
                .createQueryBuilder('assetBlock')
                .where('assetBlock.is_active = :isActive', { isActive: 1 })
                .andWhere('assetBlock.is_deleted = :isDeleted', {
                isDeleted: 0,
            });
            const result = await queryBuilder
                .select([
                'assetBlock.block_id AS block_id',
                'assetBlock.block_name AS block_name',
            ])
                .orderBy('assetBlock.block_id', 'ASC')
                .getRawMany();
            console.log('fetchAssetBlocks res', result);
            return {
                status: 'success',
                message: 'Asset blocks retrieved successfully.',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching asset blocks: ${error.message}`);
        }
    }
    async exportAssetItemsExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const qb = this.assetItemRepository
                .createQueryBuilder('asset_items')
                .leftJoinAndSelect('asset_items.main_category', 'main_category')
                .leftJoinAndSelect('asset_items.sub_category', 'sub_category')
                .where('asset_items.is_deleted = 0');
            if (selectedIds.length > 0) {
                qb.andWhere('asset_items.asset_item_id IN (:...selectedIds)', {
                    selectedIds,
                });
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                if (!value)
                    return;
                qb.andWhere(`(
            asset_items.asset_item_name ILIKE :search${index}
            OR main_category.main_category_name ILIKE :search${index}
            OR sub_category.sub_category_name ILIKE :search${index}
            OR CAST(asset_items.asset_item_id AS TEXT) ILIKE :search${index}
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
                    case 'main_category_id':
                        qb.andWhere('asset_items.main_category_id IN (:...mainIds)', {
                            mainIds: cleaned.map(Number),
                        });
                        break;
                    case 'sub_category_id':
                        qb.andWhere('asset_items.sub_category_id IN (:...subIds)', {
                            subIds: cleaned.map(Number),
                        });
                        break;
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
                            qb.andWhere('asset_items.is_active = :activeVal', {
                                activeVal: activeValues[0],
                            });
                        }
                        break;
                    }
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    const colName = s.column.includes('.')
                        ? s.column
                        : `asset_items.${s.column}`;
                    qb.addOrderBy(colName, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.addOrderBy('asset_items.asset_item_id', 'DESC');
            }
            const data = await qb.getMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Asset Items');
            const headers = [
                'Sr. No.',
                'Item Name',
                'Main Category',
                'Sub Category',
                'Description',
                'Licensable',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet
                    .cell(1, index + 1)
                    .value(header)
                    .style({ bold: true });
            });
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.asset_item_name ?? '--');
                sheet
                    .cell(row, 3)
                    .value(item.main_category?.main_category_name ?? '--');
                sheet.cell(row, 4).value(item.sub_category?.sub_category_name ?? '--');
                sheet.cell(row, 5).value(item.asset_item_description ?? '--');
                sheet.cell(row, 6).value(item.is_licensable ? 'Yes' : 'No');
                sheet.cell(row, 7).value(item.is_active ? 'Active' : 'Inactive');
            });
            headers.forEach((header, i) => {
                sheet.column(i + 1).width(Math.max(header.length + 10, 15));
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error exporting asset items to excel:', error);
            throw error;
        }
    }
};
exports.AssetItemsService = AssetItemsService;
exports.AssetItemsService = AssetItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(8, (0, typeorm_1.InjectRepository)(asset_item_entity_1.AssetItem)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_category_entity_1.AssetCategory)),
    __param(10, (0, typeorm_1.InjectRepository)(asset_subcategory_entity_1.AssetSubcategory)),
    __param(11, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(12, (0, typeorm_1.InjectRepository)(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping)),
    __param(13, (0, typeorm_1.InjectRepository)(models_entity_1.Models)),
    __param(14, (0, typeorm_1.InjectRepository)(manufacturer_entity_1.Manufacturer)),
    __param(15, (0, typeorm_1.InjectRepository)(organizational_vendors_entity_1.OrganizationVendors)),
    __param(16, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(17, (0, typeorm_1.InjectRepository)(asset_ownership_status_entity_1.AssetOwnershipStatus)),
    __param(18, (0, typeorm_1.InjectRepository)(block_of_assets_entity_1.AssetBlock)),
    __param(22, (0, typeorm_1.InjectRepository)(special_permission_master_1.SpecialPermissionsMaster)),
    __param(23, (0, typeorm_1.InjectRepository)(policy_attribute_entity_1.PolicyAttribute)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        database_service_1.DatabaseService,
        redis_service_1.RedisService,
        entity_lookup_service_1.EntityLookupService,
        asset_categories_service_1.AssetCategoriesService,
        asset_subcategories_service_1.AssetSubcategoriesService,
        stocks_service_1.StocksService,
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
        asset_depreciation_service_1.DepreciationViewService,
        stock_summary_refresh_service_1.StockSummaryRefreshService,
        dropdown_cache_service_1.DropdownCacheService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetItemsService);
