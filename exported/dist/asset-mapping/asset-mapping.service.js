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
exports.AssetMappingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const serial_branch_scope_1 = require("../branch-access/serial-branch-scope");
const OPERATIONAL_RELATION_TYPE = 'REL-001';
const asset_mapping_entity_1 = require("./entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const asset_transfer_history_entity_1 = require("./entities/asset_transfer_history.entity");
const asset_events_entity_1 = require("../asset-events/entities/asset-events.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../assets-data/stocks/entities/asset_procurements.entity");
const stock_summary_refresh_service_1 = require("../assets-data/stocks/stock-summary-refresh.service");
const request_context_service_1 = require("../common/context/request-context.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const redis_service_1 = require("../common/redis/redis.service");
const scrap_entity_1 = require("../manage-asset/entities/scrap.entity");
const entity_lookup_service_1 = require("../organizational-profile/entity-lookup.service");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../organizational-profile/entity/department.entity");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const asset_assignment_log_entity_1 = require("./entities/asset-assignment-log.entity");
const relationship_error_codes_1 = require("./constants/relationship-error-codes");
let AssetMappingService = class AssetMappingService {
    getMappedAssegetAllMappedAssetsSortedBySerialIdtsToAssets(asset_id) {
        throw new Error('Method not implemented.');
    }
    constructor(dataSource, EntityLookupService, notificationHelper, redisService, requestContext, stockSummaryRefresh, assetMappingRepository, assetStockSerialsRepository, stockRepository, assetItemRepository, AssetDatum, assetTransferHistoryRepository, assignmentEventRepository, AssetProcurement, AssetProcurementItem, AssetWorkingStatus) {
        this.dataSource = dataSource;
        this.EntityLookupService = EntityLookupService;
        this.notificationHelper = notificationHelper;
        this.redisService = redisService;
        this.requestContext = requestContext;
        this.stockSummaryRefresh = stockSummaryRefresh;
        this.assetMappingRepository = assetMappingRepository;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.stockRepository = stockRepository;
        this.assetItemRepository = assetItemRepository;
        this.AssetDatum = AssetDatum;
        this.assetTransferHistoryRepository = assetTransferHistoryRepository;
        this.assignmentEventRepository = assignmentEventRepository;
        this.AssetProcurement = AssetProcurement;
        this.AssetProcurementItem = AssetProcurementItem;
        this.AssetWorkingStatus = AssetWorkingStatus;
    }
    refreshStockSummaryFromContext(fallbackSchema) {
        try {
            let orgId = null;
            const encryptedOrg = this.requestContext.get('organization_id');
            if (encryptedOrg) {
                orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            }
            if (orgId && !isNaN(orgId)) {
                this.stockSummaryRefresh.scheduleRefresh(orgId);
            }
            else if (fallbackSchema) {
                this.resolveOrgIdFromSchema(fallbackSchema).then((resolvedId) => {
                    if (resolvedId)
                        this.stockSummaryRefresh.scheduleRefresh(resolvedId);
                });
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async refreshStockSummaryNowFromContext(fallbackSchema) {
        try {
            let orgId = null;
            const encryptedOrg = this.requestContext.get('organization_id');
            if (encryptedOrg) {
                orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            }
            if ((!orgId || isNaN(orgId)) && fallbackSchema) {
                orgId = await this.resolveOrgIdFromSchema(fallbackSchema);
            }
            if (orgId && !isNaN(orgId)) {
                await this.stockSummaryRefresh.refreshNow(orgId);
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async resolveOrgIdFromSchema(schema) {
        try {
            const cleanSchema = schema.replace(/^org_/, '');
            const org = await this.dataSource.query(`SELECT organization_id FROM public.register_organization WHERE organization_schema_name = $1 LIMIT 1;`, [cleanSchema]);
            return org?.[0]?.organization_id ? Number(org[0].organization_id) : null;
        }
        catch {
            return null;
        }
    }
    async findAll(page, limit, searchQuery, customFilters, asset_id, status) {
        console.log('customFilters', customFilters);
        try {
            const qb = this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.asset', 'asset')
                .leftJoinAndSelect('asset.asset_item', 'asset_item')
                .leftJoinAndSelect('mapping.user', 'user')
                .leftJoinAndSelect('mapping.managed_user', 'managed_user')
                .leftJoinAndSelect('mapping.map_branch', 'map_branch')
                .leftJoinAndSelect('mapping.status', 'status')
                .leftJoinAndSelect('mapping.department', 'department')
                .leftJoinAndSelect('mapping.unique_mapping', 'unique_mapping')
                .where('mapping.is_active = :active AND mapping.is_deleted = :deleted', {
                active: 1,
                deleted: 0,
            });
            if (asset_id) {
                qb.andWhere('mapping.asset_id = :asset_id', { asset_id });
            }
            const search = `%${searchQuery.trim()}%`;
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('mapping.description ILIKE :search')
                    .orWhere('asset.asset_title ILIKE :search')
                    .orWhere('asset.manufacturer ILIKE :search')
                    .orWhere('unique_mapping.stock_serials ILIKE :search')
                    .orWhere('unique_mapping.system_code ILIKE :search')
                    .orWhere("user.first_name || ' ' || user.last_name ILIKE :search")
                    .orWhere("managed_user.first_name || ' ' || managed_user.last_name ILIKE :search")
                    .orWhere('map_branch.branch_name ILIKE :search');
            })).setParameters({ search });
            if (status === 'assigned') {
                qb.andWhere(new typeorm_2.Brackets((qb) => {
                    qb.where('mapping.mapping_type = 1').orWhere(`(mapping.mapping_type = 2 AND asset_item.item_type = 'Virtual')`);
                }));
            }
            else if (status === 'unassigned') {
                qb.andWhere(new typeorm_2.Brackets((qb) => {
                    qb.where('mapping.mapping_type = 0').orWhere(`(mapping.mapping_type = 2 AND asset_item.item_type = 'Physical')`);
                }));
            }
            if (customFilters && Object.keys(customFilters).length > 0) {
                for (const [key, value] of Object.entries(customFilters)) {
                    if (value === undefined ||
                        value === null ||
                        value === '' ||
                        key === 'sortOrder') {
                        continue;
                    }
                    if (typeof value === 'object' && value.from && value.to) {
                        qb.andWhere(`mapping.${key} BETWEEN :from_${key} AND :to_${key}`, {
                            [`from_${key}`]: value.from,
                            [`to_${key}`]: value.to,
                        });
                    }
                    else {
                        qb.andWhere(`CAST(mapping.${key} AS TEXT) ILIKE :${key}`, {
                            [key]: `%${value}%`,
                        });
                    }
                }
            }
            let sortField = 'mapping.mapping_id';
            let sortDirection = 'ASC';
            if (customFilters?.sortOrder) {
                const sort = customFilters.sortOrder.toLowerCase();
                if (sort === 'desc')
                    sortDirection = 'DESC';
                else if (sort === 'asc')
                    sortDirection = 'ASC';
                else if (sort === 'newest') {
                    sortField = 'mapping.created_at';
                    sortDirection = 'DESC';
                }
                else if (sort === 'oldest') {
                    sortField = 'mapping.created_at';
                    sortDirection = 'ASC';
                }
            }
            const [results, total] = await qb
                .orderBy(sortField, sortDirection)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data: results,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new common_1.BadRequestException('Error fetching asset mappings');
        }
    }
    async exportFilteredExcelForAssetsMapping(data) {
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name('Assets Mapping');
        function formatDate(dateStr) {
            if (!dateStr)
                return '';
            const date = new Date(dateStr);
            return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        }
        const headers = [
            'Sr.No.',
            'Asset Name',
            'Serial No',
            'Department',
            'Branch',
            'User',
            'Manager',
            'Quantity',
            'Mapped Date',
            'Status',
        ];
        headers.forEach((header, i) => {
            sheet
                .cell(1, i + 1)
                .value(header)
                .style({ bold: true });
        });
        data.forEach((item, index) => {
            sheet.cell(index + 2, 1).value(index + 1);
            sheet.cell(index + 2, 2).value(item.asset?.asset_title || '');
            sheet
                .cell(index + 2, 3)
                .value(item.unique_mapping?.stock_serials ||
                item.unique_mapping?.system_code ||
                '');
            sheet.cell(index + 2, 4).value(item.department?.departmentName || '');
            sheet.cell(index + 2, 5).value(item.map_branch?.branch_name || '');
            sheet
                .cell(index + 2, 6)
                .value(`${item.user?.first_name || ''} ${item.user?.middle_name || ''} ${item.user?.last_name || ''}`.trim());
            sheet
                .cell(index + 2, 7)
                .value(`${item.managed_user?.first_name || ''} ${item.managed_user?.middle_name || ''} ${item.managed_user?.last_name || ''}`.trim());
            sheet.cell(index + 2, 8).value(item.quantity || '');
            sheet.cell(index + 2, 9).value(formatDate(item.created_at));
            sheet.cell(index + 2, 10).value(item.status?.status_type_name || '');
        });
        headers.forEach((_, i) => {
            sheet.column(i + 1).width(headers[i].length + 10);
        });
        return await workbook.outputAsync();
    }
    async fetchSingleAssetAvailableQty(asset_id) {
        console.log('Asset ID received for qty:', asset_id);
        if (!asset_id)
            throw new common_1.BadRequestException('Asset ID is required');
        try {
            const stockSerials = await this.assetStockSerialsRepository
                .createQueryBuilder('serial')
                .where('serial.asset_id = :asset_id', { asset_id })
                .getMany();
            const serialToUniqueIdMap = new Map();
            stockSerials.forEach((serial) => {
                if (serial.system_code) {
                    const key = String(serial.system_code).trim().toUpperCase();
                    serialToUniqueIdMap.set(key, serial.asset_stocks_unique_id);
                }
            });
            const stockData = await this.stockRepository
                .createQueryBuilder('stock')
                .leftJoinAndSelect('stock.vendor_info', 'vendor_info')
                .where('stock.asset_id = :asset_id', { asset_id })
                .andWhere('stock.is_active = 1')
                .andWhere('stock.is_deleted = 0')
                .getOne();
            const procurementData = await this.AssetProcurement.createQueryBuilder('procurementData')
                .leftJoinAndSelect('procurementData.vendor', 'vendor')
                .leftJoinAndSelect('procurementData.ownership_status', 'ownership')
                .where('procurementData.asset_id = :asset_id', { asset_id })
                .getMany();
            const rawMappings = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .select(['mapping.asset_stocks_unique_id'])
                .where('mapping.asset_stocks_unique_id = :asset_id', { asset_id })
                .andWhere('mapping.mapping_type = 0')
                .andWhere('mapping.is_active = 1')
                .andWhere('mapping.is_deleted = 0')
                .getMany();
            const parseJsonSafely = (data) => {
                try {
                    if (!data)
                        return [];
                    if (typeof data === 'string') {
                        const jsonStr = data.trim();
                        if (jsonStr.startsWith('[') && jsonStr.endsWith(']')) {
                            const parsed = JSON.parse(jsonStr.replace(/'/g, '"'));
                            return Array.isArray(parsed) ? parsed : [parsed];
                        }
                        else {
                            return [{ serial_number: jsonStr }];
                        }
                    }
                    return data;
                }
                catch (e) {
                    console.error('JSON parse error for unique_id:', data, e.message);
                    return [];
                }
            };
            let srCounter = 1;
            const availableUniqueIds = rawMappings.flatMap((m) => {
                const parsed = parseJsonSafely(m.asset_stocks_unique_id);
                return parsed.map((p) => {
                    const systemSerial = typeof p === 'string' ? p : p.serial_number;
                    const normalized = String(systemSerial || '')
                        .trim()
                        .toUpperCase();
                    return {
                        sr_no: srCounter++,
                        serial_number: m.stock_serial.system_code,
                        system_code: m.stock_serial.stock_serials,
                        asset_stocks_unique_id: serialToUniqueIdMap.get(normalized) || null,
                    };
                });
            });
            const filteredAvailable = availableUniqueIds.filter((item) => item.serial_number || item.system_code);
            return {
                status: 200,
                message: 'Available serials fetched successfully',
                available_unique_ids: availableUniqueIds,
                available_serial_numbers: filteredAvailable.map((i) => i.serial_number || i.system_code),
                count: filteredAvailable.length,
            };
        }
        catch (err) {
            console.error('Error in fetchSingleAssetAvailableQty:', err);
            return {
                status: 500,
                message: 'An error occurred while fetching available unique IDs',
                error: err.message,
            };
        }
    }
    async findSingleAssetMapping(mapping_id) {
        try {
            let whereCondition = { mapping_id: mapping_id };
            const result = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.user', 'used_user')
                .leftJoinAndSelect('mapping.managed_user', 'managed_user')
                .leftJoinAndSelect('mapping.map_branch', 'branch')
                .leftJoinAndSelect('mapping.status', 'status')
                .leftJoinAndSelect('mapping.department', 'department')
                .leftJoinAndSelect('mapping.asset', 'asset')
                .where(whereCondition)
                .getOne();
            if (!result) {
                throw new Error('Asset mapping not found.');
            }
            return result;
        }
        catch (error) {
            console.error('Error in findSingleAssetMapping:', error);
            throw new Error('An error occurred while fetching the asset mapping.');
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
    async getTimelineBySerialNo(asset_stocks_unique_id) {
        const history = await this.assetTransferHistoryRepository
            .createQueryBuilder('history')
            .leftJoinAndSelect('history.previous_user', 'prevUser')
            .leftJoinAndSelect('prevUser.user_department', 'prevUserDept')
            .leftJoinAndSelect('history.new_user', 'newUser')
            .leftJoinAndSelect('newUser.user_department', 'newUserDept')
            .leftJoinAndSelect('history.previous_branch', 'prevBranch')
            .leftJoinAndSelect('history.new_branch', 'newBranch')
            .leftJoinAndSelect('history.previous_department', 'prevDept')
            .leftJoinAndSelect('history.new_department', 'newDept')
            .leftJoinAndSelect('history.previous_project', 'prevProject')
            .leftJoinAndSelect('history.new_project', 'newProject')
            .where('history.asset_stocks_unique_id = :asset_stocks_unique_id', {
            asset_stocks_unique_id,
        })
            .orderBy('history.transfered_at', 'DESC')
            .getMany();
        return history.map((entry) => {
            let status = '';
            if (!entry.previous_user && entry.new_user) {
                status = 'Allocated';
            }
            else if (entry.previous_user && entry.new_user) {
                status = 'Transferred';
            }
            else if (entry.previous_user && !entry.new_user) {
                status = 'Returned';
            }
            return {
                id: entry.transfer_id,
                system_code: entry.system_code,
                asset_id: entry.asset_id,
                assign_type: entry.assign_type,
                status,
                from_user: entry.previous_user
                    ? `${entry.previous_user.first_name} ${entry.previous_user.last_name}`
                    : null,
                to_user: entry.new_user
                    ? `${entry.new_user.first_name} ${entry.new_user.last_name}`
                    : null,
                from_department: entry.previous_department ||
                    entry.previous_user?.user_department ||
                    null,
                to_department: entry.new_department || entry.new_user?.user_department || null,
                from_branch: entry.previous_branch?.branch_name || null,
                to_branch: entry.new_branch?.branch_name || null,
                from_project: entry.previous_project?.project_name || null,
                to_project: entry.new_project?.project_name || null,
                transferred_at: entry.transfered_at,
            };
        });
    }
    async getSingleAssetMapping(mapping_id) {
        try {
            const mapping = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.asset', 'asset')
                .leftJoinAndSelect('mapping.managed_user', 'managed_user')
                .leftJoinAndSelect('mapping.user', 'user')
                .leftJoinAndSelect('mapping.map_branch', 'branch')
                .leftJoinAndSelect('mapping.status', 'status')
                .leftJoinAndSelect('mapping.department', 'department')
                .leftJoinAndSelect('mapping.added_by_user', 'added_by_user')
                .select([
                'mapping.mapping_id',
                'mapping.asset_id',
                'mapping.asset_managed_by',
                'mapping.asset_used_by',
                'mapping.branch_id',
                'mapping.status_type_id',
                'mapping.department_id',
                'mapping.description',
                'mapping.reallocation_mapping_id',
                'mapping.quantity',
                'mapping.created_by',
                'mapping.updated_by',
                'mapping.created_at',
                'mapping.updated_at',
                'mapping.is_active',
                'mapping.is_deleted',
                'mapping.mapping_type',
                'mapping.unique_id',
            ])
                .where('mapping.mapping_id = :mapping_id', { mapping_id })
                .getOne();
            if (!mapping) {
                return {
                    status: 404,
                    message: `No mapping found for ID ${mapping_id}`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Mapping data fetched successfully',
                data: mapping,
            };
        }
        catch (error) {
            console.error('Error fetching mapping:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching the mapping',
                error: error.message,
            };
        }
    }
    async assignAssets(dto, userId, organizationId, schema, branchIds = []) {
        if (schema && dto?.assignments?.length) {
            const scoped = await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
                runner: this.dataSource, schema,
                ids: dto.assignments.map((a) => Number(a.serialId)),
                branchIds, label: 'assignAssets',
            });
            const ok = new Set(scoped.ids);
            dto = { ...dto, assignments: dto.assignments.filter((a) => ok.has(Number(a.serialId))) };
            if (!dto.assignments.length) {
                return { success: false, message: 'No assets in your branch access' };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (schema) {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
        }
        try {
            const ASSIGNED_STATUS_ID = 7;
            const ASSIGNED_WORKING_ID = 5;
            const skipped = [];
            let processedCount = 0;
            for (const item of dto.assignments) {
                const serialId = item.serialId;
                const serial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: serialId },
                });
                const allowedStatusIds = [1, 4, 5];
                if (!serial) {
                    skipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset no longer exists',
                    });
                    continue;
                }
                const softwareMetaRows = await queryRunner.manager.query(`
          SELECT 
            serial.asset_stocks_unique_id,
            ai.license_metric,
            ai.item_type,
            m.mapping_id,
            m.asset_stocks_unique_id AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title) AS host_name,
            COALESCE(serial.asset_serial_title, a_sw.asset_title, 'Software') AS software_name,
            u_host.first_name AS host_user_first_name,
            u_host.last_name AS host_user_last_name,
            b_host.branch_name AS host_branch_name
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.asset_items ai ON ai.asset_item_id = serial.asset_item_id
          LEFT JOIN ${schema}.assets a_sw ON a_sw.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_mapping m ON (
            (m.target_id = serial.asset_stocks_unique_id OR (m.asset_stocks_unique_id = serial.asset_stocks_unique_id AND m.target_type = 'SOFTWARE'))
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1
            AND m.is_deleted = 0
          )
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = m.asset_stocks_unique_id
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          LEFT JOIN LATERAL (
            SELECT hm.target_type, hm.target_id
            FROM ${schema}.asset_mapping hm
            WHERE hm.asset_stocks_unique_id = m.asset_stocks_unique_id
              AND hm.is_active = 1 AND hm.is_deleted = 0
              AND hm.target_type IN ('USER', 'BRANCH')
            ORDER BY hm.mapping_id DESC LIMIT 1
          ) host_custody ON true
          LEFT JOIN ${schema}.users u_host ON host_custody.target_type = 'USER' AND host_custody.target_id = u_host.user_id
          LEFT JOIN ${schema}.branches b_host ON host_custody.target_type = 'BRANCH' AND host_custody.target_id = b_host.branch_id
          WHERE serial.asset_stocks_unique_id = $1
          LIMIT 1;
          `, [serialId]);
                if (softwareMetaRows && softwareMetaRows.length > 0) {
                    const swInfo = softwareMetaRows[0];
                    const isVirtual = swInfo.item_type === 'Virtual';
                    if (isVirtual) {
                        const metric = swInfo.license_metric || 'PER_DEVICE';
                        if (metric === 'PER_DEVICE') {
                            if (swInfo.mapping_id) {
                                const hostUserOrBranch = swInfo.host_user_first_name
                                    ? `User: ${swInfo.host_user_first_name} ${swInfo.host_user_last_name || ''}`.trim()
                                    : swInfo.host_branch_name ? `Branch: ${swInfo.host_branch_name}` : null;
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED](swInfo.software_name || 'Software', swInfo.host_system_code, swInfo.host_name, hostUserOrBranch);
                                skipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                            else {
                                const reason = `Cannot assign: '${swInfo.software_name || 'Software'}' uses license metric PER_DEVICE, which is locked to hardware and cannot be directly assigned to ${item.targetType}. Link it to a computer using 'Link Asset' (INSTALLED_ON relationship).`;
                                skipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                        }
                        if (metric === 'FREE') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'FREE', item.targetType);
                            skipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'SITE' && item.targetType !== 'BRANCH') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'SITE', `${item.targetType} (SITE licenses can only be assigned to a BRANCH)`);
                            skipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'PER_USER' && item.targetType !== 'USER') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'PER_USER', `${item.targetType} (PER_USER licenses can only be assigned to a USER)`);
                            skipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'HYBRID') {
                            if (swInfo.mapping_id) {
                                const hostUserOrBranch = swInfo.host_user_first_name
                                    ? `User: ${swInfo.host_user_first_name} ${swInfo.host_user_last_name || ''}`.trim()
                                    : swInfo.host_branch_name ? `Branch: ${swInfo.host_branch_name}` : null;
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED](swInfo.software_name || 'Software', swInfo.host_system_code, swInfo.host_name, hostUserOrBranch);
                                skipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                            else if (item.targetType !== 'USER') {
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'HYBRID', `${item.targetType} (HYBRID licenses can only be assigned to a USER or installed on a device)`);
                                skipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                        }
                    }
                }
                const vmHostRows = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host Server') AS host_name,
            COALESCE(serial.asset_serial_title, a_vm.asset_title, 'Virtual Machine') AS vm_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.asset_stock_serials serial ON serial.asset_stocks_unique_id = $1
          LEFT JOIN ${schema}.assets a_vm ON a_vm.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          WHERE (m.asset_stocks_unique_id = $1 OR m.target_id = $1)
            AND m.relation_type = 'REL-010'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [serialId]);
                const isHostedVm = vmHostRows && vmHostRows.length > 0;
                if (isHostedVm && item.targetType === 'BRANCH') {
                    const vh = vmHostRows[0];
                    const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED](vh.vm_name, vh.host_system_code, vh.host_name, true);
                    skipped.push({
                        asset_stocks_unique_id: serialId,
                        reason,
                    });
                    continue;
                }
                let isAssignableHostedVm = false;
                if (isHostedVm && serial.current_status_id === 7 && item.targetType !== 'BRANCH') {
                    const activeDirectCustody = await queryRunner.manager.query(`
            SELECT 1 FROM ${schema}.asset_mapping
            WHERE asset_stocks_unique_id = $1
              AND is_active = 1
              AND is_deleted = 0
              AND target_type IN ('USER', 'DEPARTMENT', 'PROJECT')
              AND (relation_type IS NULL OR relation_type = 'REL-001')
            LIMIT 1;
            `, [serialId]);
                    if (!activeDirectCustody || activeDirectCustody.length === 0) {
                        isAssignableHostedVm = true;
                    }
                }
                const periHostRows = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host Device') AS host_name,
            COALESCE(serial.asset_serial_title, a_p.asset_title, 'Peripheral') AS peripheral_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.asset_stock_serials serial ON serial.asset_stocks_unique_id = $1
          LEFT JOIN ${schema}.assets a_p ON a_p.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          WHERE (m.asset_stocks_unique_id = $1 OR m.target_id = $1)
            AND m.relation_type = 'REL-007'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [serialId]);
                const isAttachedPeripheral = periHostRows && periHostRows.length > 0;
                if (isAttachedPeripheral) {
                    if (item.detach_and_reassign) {
                        await queryRunner.manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0, is_deleted = 1, updated_at = CURRENT_TIMESTAMP
              WHERE mapping_id = $1;
              `, [periHostRows[0].mapping_id]);
                        await queryRunner.manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0, updated_at = CURRENT_TIMESTAMP
              WHERE asset_stocks_unique_id = $1 AND is_inherited = 1 AND is_active = 1;
              `, [serialId]);
                    }
                    else {
                        const ph = periHostRows[0];
                        const reason = `Cannot assign: Peripheral '${ph.peripheral_name}' is physically attached to Host '${ph.host_name}' (${ph.host_system_code || 'ID: ' + ph.host_serial_id}). Detach first or use Detach & Reassign (ERR_CUSTODY_INHERITED).`;
                        skipped.push({
                            asset_stocks_unique_id: serialId,
                            reason,
                        });
                        continue;
                    }
                }
                const isAssignablePeripheral = isAttachedPeripheral && item.detach_and_reassign;
                if (!allowedStatusIds.includes(serial.current_status_id) && !isAssignableHostedVm && !isAssignablePeripheral) {
                    skipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset is not in an assignable state',
                    });
                    continue;
                }
                let targetName = null;
                if (item.targetType === 'USER') {
                    const user = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                        where: { user_id: item.targetId },
                    });
                    targetName = user ? user.first_name : null;
                }
                if (item.targetType === 'BRANCH') {
                    const user = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                        where: { branch_id: item.targetId },
                    });
                    targetName = user ? user.branch_name : null;
                }
                if (item.targetType === 'DEPARTMENT') {
                    const user = await queryRunner.manager.findOne(department_entity_1.Department, {
                        where: { department_id: item.targetId },
                    });
                    targetName = user ? user.department_name : null;
                }
                let savedMapping;
                const existingMapping = await queryRunner.manager.findOne(asset_mapping_entity_1.AssetMappingRepository, {
                    where: [
                        { asset_stocks_unique_id: serialId, relation_type: OPERATIONAL_RELATION_TYPE },
                        { asset_stocks_unique_id: serialId, target_type: (0, typeorm_2.In)(['USER', 'BRANCH', 'DEPARTMENT', 'PROJECT']) },
                        { asset_stocks_unique_id: serialId, relation_type: (0, typeorm_2.IsNull)() },
                    ],
                });
                if (existingMapping) {
                    await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, { mapping_id: existingMapping.mapping_id }, {
                        target_id: item.targetId,
                        target_type: item.targetType,
                        relation_type: OPERATIONAL_RELATION_TYPE,
                        assigned_by: userId,
                        status_type_id: ASSIGNED_STATUS_ID,
                        asset_working_condition_id: ASSIGNED_WORKING_ID,
                        is_active: 1,
                        is_deleted: 0,
                        updated_at: new Date(),
                    });
                    savedMapping = existingMapping;
                }
                else {
                    const mapping = queryRunner.manager.create(asset_mapping_entity_1.AssetMappingRepository, {
                        asset_id: serial.asset_id,
                        asset_stocks_unique_id: serialId,
                        target_id: item.targetId,
                        target_type: item.targetType,
                        relation_type: OPERATIONAL_RELATION_TYPE,
                        assigned_by: userId,
                        status_type_id: ASSIGNED_STATUS_ID,
                        asset_working_condition_id: ASSIGNED_WORKING_ID,
                        is_active: 1,
                        is_deleted: 0,
                    });
                    savedMapping = await queryRunner.manager.save(mapping);
                }
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: serialId }, {
                    current_status_id: ASSIGNED_STATUS_ID,
                    working_status_type_id: ASSIGNED_WORKING_ID,
                });
                const assignmentEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                    asset_stocks_unique_id: serialId,
                    mapping_id: savedMapping.mapping_id,
                    performed_by: userId,
                    notes: item.notes || 'Asset Assigned',
                    working_condition_id: ASSIGNED_WORKING_ID,
                    target_id: item.targetId,
                    target_type: item.targetType,
                });
                await queryRunner.manager.save(assignmentEvent);
                const assetEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serialId,
                    event_type_id: ASSIGNED_WORKING_ID,
                    title: 'Asset Assigned',
                    description: item?.notes?.trim()
                        ? item.notes
                        : `Assigned to ${item.targetType}`,
                    reference_table: 'asset_mappings',
                    reference_id: savedMapping.mapping_id,
                    performed_by: userId,
                    performed_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    metadata: {
                        target_id: item.targetId,
                        target_type: item.targetType,
                        target_name: targetName,
                        notes: item.notes || null,
                    },
                    created_at: new Date(),
                });
                await queryRunner.manager.save(assetEvent);
                await queryRunner.manager.query(`
        UPDATE stocks
        SET quantity = quantity - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE stock_id = ${serial.stock_id}
      `);
                const installedSoftwares = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id AS rel_mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS sw_serial_id
          FROM ${schema}.asset_mapping m
          WHERE (m.target_id = $1 OR (m.asset_stocks_unique_id = $1 AND m.target_type = 'SOFTWARE'))
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1
            AND m.is_deleted = 0;
          `, [serialId]);
                if (installedSoftwares && installedSoftwares.length > 0) {
                    for (const sw of installedSoftwares) {
                        const existingInherited = await queryRunner.manager.query(`
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE asset_stocks_unique_id = $1
                AND is_inherited = 1
                AND inherited_via_relationship_id = $2
              LIMIT 1;
              `, [sw.sw_serial_id, sw.rel_mapping_id]);
                        if (existingInherited && existingInherited.length > 0) {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET target_type = $1,
                    target_id = $2,
                    is_active = 1,
                    is_deleted = 0,
                    assigned_by = $3,
                    assigned_from_date = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $4;
                `, [item.targetType, item.targetId, userId, existingInherited[0].mapping_id]);
                        }
                        else {
                            await queryRunner.manager.query(`
                INSERT INTO ${schema}.asset_mapping (
                  asset_stocks_unique_id,
                  target_type,
                  target_id,
                  assigned_by,
                  assigned_from_date,
                  is_active,
                  is_deleted,
                  is_inherited,
                  inherited_via_relationship_id,
                  created_at,
                  updated_at
                )
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `, [sw.sw_serial_id, item.targetType, item.targetId, userId, sw.rel_mapping_id]);
                        }
                    }
                }
                const attachedPeripherals = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id AS rel_mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS peripheral_serial_id
          FROM ${schema}.asset_mapping m
          WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
            AND m.relation_type = 'REL-007'
            AND m.is_active = 1
            AND m.is_deleted = 0;
          `, [serialId]);
                if (attachedPeripherals && attachedPeripherals.length > 0) {
                    for (const peri of attachedPeripherals) {
                        const existingInherited = await queryRunner.manager.query(`
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE asset_stocks_unique_id = $1
                AND is_inherited = 1
                AND is_active = 1
              LIMIT 1;
              `, [peri.peripheral_serial_id]);
                        if (existingInherited && existingInherited.length > 0) {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET target_type = $1,
                    target_id = $2,
                    is_active = 1,
                    is_deleted = 0,
                    assigned_by = $3,
                    assigned_from_date = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $4;
                `, [item.targetType, item.targetId, userId, existingInherited[0].mapping_id]);
                        }
                        else {
                            await queryRunner.manager.query(`
                INSERT INTO ${schema}.asset_mapping (
                  asset_stocks_unique_id,
                  target_type,
                  target_id,
                  assigned_by,
                  assigned_from_date,
                  is_active,
                  is_deleted,
                  is_inherited,
                  inherited_via_relationship_id,
                  created_at,
                  updated_at
                )
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `, [peri.peripheral_serial_id, item.targetType, item.targetId, userId, peri.rel_mapping_id]);
                        }
                        const periEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                            asset_stocks_unique_id: peri.peripheral_serial_id,
                            mapping_id: existingInherited?.[0]?.mapping_id || null,
                            performed_by: userId,
                            notes: `Inherited custody updated via host assignment (CASCADE) to ${item.targetType} #${item.targetId}`,
                            target_id: item.targetId,
                            target_type: item.targetType,
                            working_condition_id: 5,
                        });
                        await queryRunner.manager.save(periEvent);
                    }
                }
                processedCount++;
            }
            await queryRunner.commitTransaction();
            this.redisService.delByPattern('software-list:*');
            this.redisService.delByPattern('perpetualSoftwares-list:*');
            this.refreshStockSummaryFromContext();
            await this.stockSummaryRefresh.forceRefreshNow(organizationId);
            let responseMessage = 'Assets assigned successfully';
            if (skipped.length > 0) {
                if (processedCount === 0 && skipped.length === 1) {
                    responseMessage = skipped[0].reason;
                }
                else if (processedCount === 0) {
                    responseMessage = `All assignments skipped: ${skipped[0].reason}`;
                }
                else {
                    responseMessage = `Assigned ${processedCount} asset(s). ${skipped.length} skipped (${skipped[0].reason}).`;
                }
            }
            return {
                success: true,
                message: responseMessage,
                processedCount,
                skippedCount: skipped.length,
                skipped: skipped.slice(0, 200),
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
    async reassignAssets(dto, userId, schema, branchIds = []) {
        if (schema && dto?.reassignments?.length) {
            const items = dto.reassignments;
            const scoped = await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
                runner: this.dataSource, schema,
                ids: items.map((a) => Number(a.serialId)),
                branchIds, label: 'reassignAssets',
            });
            const ok = new Set(scoped.ids);
            dto = { ...dto, reassignments: items.filter((a) => ok.has(Number(a.serialId))) };
            if (!dto.reassignments.length) {
                return { success: false, message: 'No assets in your branch access' };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (schema) {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
        }
        try {
            const REASSIGNED_STATUS_ID = 7;
            const REASSIGNED_WORKING_ID = 19;
            if (!dto?.reassignments || !Array.isArray(dto.reassignments)) {
                throw new common_1.BadRequestException('Reassignments payload is invalid');
            }
            const reassignSkipped = [];
            for (const item of dto.reassignments) {
                console.log('ITEM:1212', item);
                const serialId = item.serialId;
                const mappingId = item.mapping_id;
                const serial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: serialId },
                });
                if (!serial) {
                    reassignSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset no longer exists',
                    });
                    continue;
                }
                if (serial.current_status_id !== 7) {
                    reassignSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset is not currently assigned, so it cannot be reassigned',
                    });
                    continue;
                }
                const softwareMetaRows = await queryRunner.manager.query(`
          SELECT 
            serial.asset_stocks_unique_id,
            ai.license_metric,
            ai.item_type,
            m.mapping_id,
            m.asset_stocks_unique_id AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title) AS host_name,
            COALESCE(serial.asset_serial_title, a_sw.asset_title, 'Software') AS software_name,
            u_host.first_name AS host_user_first_name,
            u_host.last_name AS host_user_last_name,
            b_host.branch_name AS host_branch_name
          FROM ${schema}.asset_stock_serials serial
          JOIN ${schema}.asset_items ai ON ai.asset_item_id = serial.asset_item_id
          LEFT JOIN ${schema}.assets a_sw ON a_sw.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_mapping m ON (
            (m.target_id = serial.asset_stocks_unique_id OR (m.asset_stocks_unique_id = serial.asset_stocks_unique_id AND m.target_type = 'SOFTWARE'))
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1
            AND m.is_deleted = 0
          )
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = m.asset_stocks_unique_id
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          LEFT JOIN LATERAL (
            SELECT hm.target_type, hm.target_id
            FROM ${schema}.asset_mapping hm
            WHERE hm.asset_stocks_unique_id = m.asset_stocks_unique_id
              AND hm.is_active = 1 AND hm.is_deleted = 0
              AND hm.target_type IN ('USER', 'BRANCH')
            ORDER BY hm.mapping_id DESC LIMIT 1
          ) host_custody ON true
          LEFT JOIN ${schema}.users u_host ON host_custody.target_type = 'USER' AND host_custody.target_id = u_host.user_id
          LEFT JOIN ${schema}.branches b_host ON host_custody.target_type = 'BRANCH' AND host_custody.target_id = b_host.branch_id
          WHERE serial.asset_stocks_unique_id = $1
          LIMIT 1;
          `, [serialId]);
                if (softwareMetaRows && softwareMetaRows.length > 0) {
                    const swInfo = softwareMetaRows[0];
                    const isVirtual = swInfo.item_type === 'Virtual';
                    if (isVirtual) {
                        const metric = swInfo.license_metric || 'PER_DEVICE';
                        if (metric === 'PER_DEVICE') {
                            if (swInfo.mapping_id) {
                                const hostUserOrBranch = swInfo.host_user_first_name
                                    ? `User: ${swInfo.host_user_first_name} ${swInfo.host_user_last_name || ''}`.trim()
                                    : swInfo.host_branch_name ? `Branch: ${swInfo.host_branch_name}` : null;
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED](swInfo.software_name || 'Software', swInfo.host_system_code, swInfo.host_name, hostUserOrBranch);
                                reassignSkipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                            else {
                                const reason = `Cannot reassign: '${swInfo.software_name || 'Software'}' uses license metric PER_DEVICE, which is locked to hardware and cannot be directly assigned to ${item.targetType}. Link it to a computer using 'Link Asset' (INSTALLED_ON relationship).`;
                                reassignSkipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                        }
                        if (metric === 'FREE') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'FREE', item.targetType);
                            reassignSkipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'SITE' && item.targetType !== 'BRANCH') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'SITE', `${item.targetType} (SITE licenses can only be assigned to a BRANCH)`);
                            reassignSkipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'PER_USER' && item.targetType !== 'USER') {
                            const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'PER_USER', `${item.targetType} (PER_USER licenses can only be assigned to a USER)`);
                            reassignSkipped.push({
                                asset_stocks_unique_id: serialId,
                                reason,
                            });
                            continue;
                        }
                        if (metric === 'HYBRID') {
                            if (swInfo.mapping_id) {
                                const hostUserOrBranch = swInfo.host_user_first_name
                                    ? `User: ${swInfo.host_user_first_name} ${swInfo.host_user_last_name || ''}`.trim()
                                    : swInfo.host_branch_name ? `Branch: ${swInfo.host_branch_name}` : null;
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED](swInfo.software_name || 'Software', swInfo.host_system_code, swInfo.host_name, hostUserOrBranch);
                                reassignSkipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                            else if (item.targetType !== 'USER') {
                                const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC](swInfo.software_name || 'Software', 'HYBRID', `${item.targetType} (HYBRID licenses can only be assigned to a USER or installed on a device)`);
                                reassignSkipped.push({
                                    asset_stocks_unique_id: serialId,
                                    reason,
                                });
                                continue;
                            }
                        }
                    }
                }
                const vmHostRows = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host Server') AS host_name,
            COALESCE(serial.asset_serial_title, a_vm.asset_title, 'Virtual Machine') AS vm_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.asset_stock_serials serial ON serial.asset_stocks_unique_id = $1
          LEFT JOIN ${schema}.assets a_vm ON a_vm.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          WHERE (m.asset_stocks_unique_id = $1 OR m.target_id = $1)
            AND m.relation_type = 'REL-010'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [serialId]);
                const isHostedVm = vmHostRows && vmHostRows.length > 0;
                const periHostRows = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
            ass_host.system_code AS host_system_code,
            COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host Device') AS host_name,
            COALESCE(serial.asset_serial_title, a_p.asset_title, 'Peripheral') AS peripheral_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.asset_stock_serials serial ON serial.asset_stocks_unique_id = $1
          LEFT JOIN ${schema}.assets a_p ON a_p.asset_id = serial.asset_id
          LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
          WHERE (m.asset_stocks_unique_id = $1 OR m.target_id = $1)
            AND m.relation_type = 'REL-007'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [serialId]);
                const isAttachedPeripheral = periHostRows && periHostRows.length > 0;
                if (isAttachedPeripheral) {
                    if (item.detach_and_reassign) {
                        await queryRunner.manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0, is_deleted = 1, updated_at = CURRENT_TIMESTAMP
              WHERE mapping_id = $1;
              `, [periHostRows[0].mapping_id]);
                        await queryRunner.manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0, updated_at = CURRENT_TIMESTAMP
              WHERE asset_stocks_unique_id = $1 AND is_inherited = 1 AND is_active = 1;
              `, [serialId]);
                    }
                    else {
                        const ph = periHostRows[0];
                        const reason = `Cannot reassign: Peripheral '${ph.peripheral_name}' is physically attached to Host '${ph.host_name}' (${ph.host_system_code || 'ID: ' + ph.host_serial_id}). Detach first or use Detach & Reassign (ERR_CUSTODY_INHERITED).`;
                        reassignSkipped.push({
                            asset_stocks_unique_id: serialId,
                            reason,
                        });
                        continue;
                    }
                }
                if (isHostedVm && item.targetType === 'BRANCH') {
                    const vh = vmHostRows[0];
                    const reason = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED](vh.vm_name, vh.host_system_code, vh.host_name, true);
                    reassignSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason,
                    });
                    continue;
                }
                const existingMapping = await queryRunner.manager.findOne(asset_mapping_entity_1.AssetMappingRepository, {
                    where: {
                        mapping_id: mappingId,
                        is_active: 1,
                        is_deleted: 0,
                    },
                });
                if (!existingMapping) {
                    throw new common_1.BadRequestException(`Active mapping ${mappingId} not found`);
                }
                let targetName = null;
                if (item.targetType === 'USER') {
                    const user = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                        where: { user_id: item.targetId },
                    });
                    targetName = user
                        ? [user.first_name, user.last_name].filter(Boolean).join(' ')
                        : null;
                }
                if (item.targetType === 'BRANCH') {
                    const branch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                        where: { branch_id: item.targetId },
                    });
                    targetName = branch ? branch.branch_name : null;
                }
                if (item.targetType === 'DEPARTMENT') {
                    const department = await queryRunner.manager.findOne(department_entity_1.Department, {
                        where: { department_id: item.targetId },
                    });
                    targetName = department ? department.department_name : null;
                }
                await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, { mapping_id: mappingId }, {
                    target_id: item.targetId,
                    target_type: item.targetType,
                    relation_type: OPERATIONAL_RELATION_TYPE,
                    status_type_id: REASSIGNED_STATUS_ID,
                    asset_working_condition_id: REASSIGNED_WORKING_ID,
                    updated_at: new Date(),
                });
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: serialId }, {
                    current_status_id: REASSIGNED_STATUS_ID,
                    working_status_type_id: REASSIGNED_WORKING_ID,
                });
                const assignmentEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                    asset_stocks_unique_id: serialId,
                    mapping_id: mappingId,
                    performed_by: userId,
                    notes: item.notes || 'Asset Reassigned',
                    working_condition_id: REASSIGNED_WORKING_ID,
                    target_id: item.targetId,
                    target_type: item.targetType,
                });
                await queryRunner.manager.save(assignmentEvent);
                const assetEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serialId,
                    event_type_id: REASSIGNED_STATUS_ID,
                    title: 'Asset Reassigned',
                    description: item.notes || `Reassigned to ${item.targetType}`,
                    reference_table: 'asset_mappings',
                    reference_id: mappingId,
                    performed_by: userId,
                    performed_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    metadata: {
                        target_id: item.targetId,
                        target_type: item.targetType,
                        target_name: targetName,
                        notes: item.notes || null,
                    },
                    created_at: new Date(),
                });
                await queryRunner.manager.save(assetEvent);
                const reassignInstalledSw = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id AS rel_mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS sw_serial_id
          FROM ${schema}.asset_mapping m
          WHERE (m.target_id = $1 OR (m.asset_stocks_unique_id = $1 AND m.target_type = 'SOFTWARE'))
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1
            AND m.is_deleted = 0;
          `, [serialId]);
                if (reassignInstalledSw && reassignInstalledSw.length > 0) {
                    for (const sw of reassignInstalledSw) {
                        const existingInherited = await queryRunner.manager.query(`
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE asset_stocks_unique_id = $1
                AND is_inherited = 1
                AND inherited_via_relationship_id = $2
              LIMIT 1;
              `, [sw.sw_serial_id, sw.rel_mapping_id]);
                        if (existingInherited && existingInherited.length > 0) {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET target_type = $1,
                    target_id = $2,
                    is_active = 1,
                    is_deleted = 0,
                    assigned_by = $3,
                    assigned_from_date = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $4;
                `, [item.targetType, item.targetId, userId, existingInherited[0].mapping_id]);
                        }
                        else {
                            await queryRunner.manager.query(`
                INSERT INTO ${schema}.asset_mapping (
                  asset_stocks_unique_id,
                  target_type,
                  target_id,
                  assigned_by,
                  assigned_from_date,
                  is_active,
                  is_deleted,
                  is_inherited,
                  inherited_via_relationship_id,
                  created_at,
                  updated_at
                )
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `, [sw.sw_serial_id, item.targetType, item.targetId, userId, sw.rel_mapping_id]);
                        }
                    }
                }
                const attachedPeripherals = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id AS rel_mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS peripheral_serial_id
          FROM ${schema}.asset_mapping m
          WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
            AND m.relation_type = 'REL-007'
            AND m.is_active = 1
            AND m.is_deleted = 0;
          `, [serialId]);
                if (attachedPeripherals && attachedPeripherals.length > 0) {
                    for (const peri of attachedPeripherals) {
                        const existingInherited = await queryRunner.manager.query(`
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE asset_stocks_unique_id = $1
                AND is_inherited = 1
                AND is_active = 1
              LIMIT 1;
              `, [peri.peripheral_serial_id]);
                        if (existingInherited && existingInherited.length > 0) {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET target_type = $1,
                    target_id = $2,
                    is_active = 1,
                    is_deleted = 0,
                    assigned_by = $3,
                    assigned_from_date = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $4;
                `, [item.targetType, item.targetId, userId, existingInherited[0].mapping_id]);
                        }
                        else {
                            await queryRunner.manager.query(`
                INSERT INTO ${schema}.asset_mapping (
                  asset_stocks_unique_id,
                  target_type,
                  target_id,
                  assigned_by,
                  assigned_from_date,
                  is_active,
                  is_deleted,
                  is_inherited,
                  inherited_via_relationship_id,
                  created_at,
                  updated_at
                )
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `, [peri.peripheral_serial_id, item.targetType, item.targetId, userId, peri.rel_mapping_id]);
                        }
                        const periEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                            asset_stocks_unique_id: peri.peripheral_serial_id,
                            mapping_id: existingInherited?.[0]?.mapping_id || mappingId,
                            performed_by: userId,
                            notes: `Inherited custody updated via host reassignment (CASCADE) to ${item.targetType} #${item.targetId}`,
                            target_id: item.targetId,
                            target_type: item.targetType,
                            working_condition_id: 5,
                        });
                        await queryRunner.manager.save(periEvent);
                    }
                }
            }
            await queryRunner.commitTransaction();
            this.refreshStockSummaryFromContext();
            this.redisService.delByPattern('software-list:*');
            this.redisService.delByPattern('perpetualSoftwares-list:*');
            let responseMessage = 'Assets reassigned successfully';
            const processed = dto.reassignments.length - reassignSkipped.length;
            if (reassignSkipped.length > 0) {
                if (processed === 0 && reassignSkipped.length === 1) {
                    responseMessage = reassignSkipped[0].reason;
                }
                else if (processed === 0) {
                    responseMessage = `All reassignments skipped: ${reassignSkipped[0].reason}`;
                }
                else {
                    responseMessage = `Reassigned ${processed} asset(s). ${reassignSkipped.length} skipped (${reassignSkipped[0].reason}).`;
                }
            }
            return {
                success: true,
                message: responseMessage,
                processedCount: processed,
                skippedCount: reassignSkipped.length,
                skipped: reassignSkipped.slice(0, 200),
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
    async returnAssets(dto, userId, schema, branchIds = []) {
        if (schema && dto?.returns?.length) {
            const items = dto.returns;
            const scoped = await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
                runner: this.dataSource, schema,
                ids: items.map((a) => Number(a.serialId)),
                branchIds, label: 'returnAssets',
            });
            const ok = new Set(scoped.ids);
            dto = { ...dto, returns: items.filter((a) => ok.has(Number(a.serialId))) };
            if (!dto.returns.length) {
                return { success: false, message: 'No assets in your branch access' };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const returnedAssets = [];
        const returnSkipped = [];
        try {
            const AVAILABLE_STATUS_ID = 1;
            const GOOD_WORKING_ID = 20;
            for (const item of dto.returns) {
                const { serialId, mapping_id } = item;
                const serial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: serialId },
                });
                if (!serial) {
                    returnSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset no longer exists',
                    });
                    continue;
                }
                const previousWorkingStatusId = serial.working_status_type_id;
                const mapping = await queryRunner.manager.findOne(asset_mapping_entity_1.AssetMappingRepository, {
                    where: {
                        mapping_id,
                        asset_stocks_unique_id: serialId,
                        is_active: 1,
                        is_deleted: 0,
                    },
                });
                if (!mapping) {
                    const inheritedMap = await queryRunner.manager.findOne(asset_mapping_entity_1.AssetMappingRepository, {
                        where: [
                            { asset_stocks_unique_id: serialId, is_inherited: 1, is_active: 1, is_deleted: 0 },
                            { target_id: serialId, relation_type: (0, typeorm_2.In)(['REL-006', 'REL-007']), is_active: 1, is_deleted: 0 },
                        ],
                    });
                    if (inheritedMap) {
                        returnSkipped.push({
                            asset_stocks_unique_id: serialId,
                            reason: 'Custody is inherited from host device. Please unlink or detach the asset from its host device instead of returning custody directly.',
                        });
                        continue;
                    }
                    returnSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Asset was not assigned, nothing to return',
                    });
                    continue;
                }
                if (mapping.is_inherited === 1) {
                    returnSkipped.push({
                        asset_stocks_unique_id: serialId,
                        reason: 'Custody is inherited from host device. Please unlink or detach the asset from its host device instead of returning custody directly.',
                    });
                    continue;
                }
                let targetType = mapping.target_type;
                let targetId = mapping.target_id;
                let targetName = null;
                if (targetType === 'USER') {
                    const user = await queryRunner.manager.findOne(organizational_user_entity_1.User, {
                        where: { user_id: targetId },
                    });
                    targetName = user ? user.first_name : null;
                }
                if (targetType === 'BRANCH') {
                    const branch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                        where: { branch_id: targetId },
                    });
                    targetName = branch ? branch.branch_name : null;
                }
                if (targetType === 'DEPARTMENT') {
                    const dept = await queryRunner.manager.findOne(department_entity_1.Department, {
                        where: { department_id: targetId },
                    });
                    targetName = dept ? dept.department_name : null;
                }
                const returnText = `Asset Returned by ${targetType || ''}${targetName ? ' - ' + targetName : ''}`;
                await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, {
                    mapping_id,
                    asset_stocks_unique_id: serialId,
                }, {
                    is_active: 0,
                    target_type: null,
                    target_id: null,
                    relation_type: null,
                    status_type_id: AVAILABLE_STATUS_ID,
                    updated_at: new Date(),
                });
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: serialId }, {
                    current_status_id: AVAILABLE_STATUS_ID,
                    working_status_type_id: GOOD_WORKING_ID,
                });
                const assignmentEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                    asset_stocks_unique_id: serialId,
                    mapping_id,
                    performed_by: userId,
                    notes: returnText,
                    target_id: null,
                    target_type: null,
                    working_condition_id: GOOD_WORKING_ID,
                });
                await queryRunner.manager.save(assignmentEvent);
                const assetEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serialId,
                    event_type_id: AVAILABLE_STATUS_ID,
                    title: 'Asset returned',
                    description: `Asset returned to inventory by ${targetType || ''}${targetName ? ' - ' + targetName : ''}`,
                    reference_table: 'asset_mappings',
                    reference_id: mapping_id,
                    performed_by: userId,
                    performed_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    metadata: { notes: item.notes || null },
                    created_at: new Date(),
                });
                await queryRunner.manager.save(assetEvent);
                await queryRunner.manager.query(`
        UPDATE stocks
        SET quantity = quantity + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE stock_id = ${serial.stock_id}
      `);
                await queryRunner.manager.query(`
          UPDATE ${schema}.asset_mapping
          SET is_active = 0,
              target_type = null,
              target_id = null,
              updated_at = CURRENT_TIMESTAMP
          WHERE is_inherited = 1
            AND inherited_via_relationship_id IN (
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE (target_id = $1 OR (asset_stocks_unique_id = $1 AND target_type = 'SOFTWARE'))
                AND relation_type = 'REL-006'
                AND is_active = 1
                AND is_deleted = 0
            );
          `, [serialId]);
                const attachedPeripherals = await queryRunner.manager.query(`
          SELECT 
            m.mapping_id AS rel_mapping_id,
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS peripheral_serial_id,
            ass.stock_id,
            ass.asset_id AS peripheral_asset_id,
            ass.current_status_id,
            ass.working_status_type_id,
            ass.system_code,
            COALESCE(ass.asset_serial_title, a.asset_title, 'Peripheral #' || (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS peripheral_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
          WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
            AND m.relation_type = 'REL-007'
            AND m.is_active = 1
            AND m.is_deleted = 0;
          `, [serialId]);
                if (attachedPeripherals && attachedPeripherals.length > 0) {
                    const isOffboarding = (dto?.reason || item?.reason || '').toUpperCase() === 'OFFBOARDING';
                    const decisionsList = item.dependents || dto.dependents || [];
                    const hostName = serial.asset_serial_title || serial.system_code || `Asset #${serialId}`;
                    for (const peri of attachedPeripherals) {
                        const periSerialId = Number(peri.peripheral_serial_id);
                        const periAssetId = peri.peripheral_asset_id ? Number(peri.peripheral_asset_id) : null;
                        const decision = decisionsList.find((d) => Number(d.serial_id) === periSerialId);
                        const action = decision?.action || 'RETURN_DETACH';
                        if (action === 'KEEP_WITH_USER') {
                            if (isOffboarding) {
                                throw new common_1.HttpException({
                                    code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ACTION_NOT_ALLOWED_FOR_OFFBOARDING,
                                    message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ACTION_NOT_ALLOWED_FOR_OFFBOARDING](peri.peripheral_name),
                                }, common_1.HttpStatus.BAD_REQUEST);
                            }
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0, is_deleted = 1, updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $1;
                `, [peri.rel_mapping_id]);
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_inherited = 0,
                    parent_mapping_id = NULL,
                    inherited_via_relationship_id = NULL,
                    updated_at = CURRENT_TIMESTAMP
                WHERE asset_stocks_unique_id = $1
                  AND is_inherited = 1
                  AND is_active = 1;
                `, [periSerialId]);
                            const keepEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                                asset_stocks_unique_id: periSerialId,
                                mapping_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                notes: `Peripheral detached from host on return and kept directly with user (KEEP_WITH_USER)`,
                                target_id: targetId,
                                target_type: targetType,
                                working_condition_id: 5,
                            });
                            await queryRunner.manager.save(keepEvent);
                            const hostUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: serial.asset_id,
                                asset_stocks_unique_id: serialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Peripheral '${peri.peripheral_name}' detached from host on return (kept with user)`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached Peripheral',
                                    connected_serial_id: periSerialId,
                                    connected_asset_name: peri.peripheral_name,
                                    direction: 'FORWARD',
                                    reason: 'KEEP_WITH_USER',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            const periUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: periAssetId,
                                asset_stocks_unique_id: periSerialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Disconnected from host device '${hostName}' on return (retained directly by user)`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached To',
                                    connected_serial_id: serialId,
                                    connected_asset_name: hostName,
                                    direction: 'REVERSE',
                                    reason: 'KEEP_WITH_USER',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            await queryRunner.manager.save(asset_events_entity_1.AssetEvent, [hostUnlinkEvent, periUnlinkEvent]);
                        }
                        else if (action === 'RETURN_BUNDLE') {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0,
                    updated_at = CURRENT_TIMESTAMP
                WHERE asset_stocks_unique_id = $1
                  AND is_inherited = 1
                  AND is_active = 1;
                `, [periSerialId]);
                            const bundleEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                                asset_stocks_unique_id: periSerialId,
                                mapping_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                notes: `Peripheral returned bundled with host (RETURN_BUNDLE)`,
                                target_id: null,
                                target_type: null,
                                working_condition_id: GOOD_WORKING_ID,
                            });
                            await queryRunner.manager.save(bundleEvent);
                            const periBundleEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: periAssetId,
                                asset_stocks_unique_id: periSerialId,
                                event_type_id: AVAILABLE_STATUS_ID,
                                title: 'Asset returned',
                                description: `Peripheral returned to inventory bundled with host '${hostName}'`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                performed_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                                metadata: { notes: `Returned bundled with host ${hostName}` },
                                created_at: new Date(),
                            });
                            await queryRunner.manager.save(periBundleEvent);
                        }
                        else if (action === 'REASSIGN') {
                            const targetUserId = decision?.target_user_id;
                            if (!targetUserId) {
                                throw new common_1.BadRequestException(`target_user_id is required when action is REASSIGN for peripheral '${peri.peripheral_name}'`);
                            }
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0, is_deleted = 1, updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $1;
                `, [peri.rel_mapping_id]);
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0, updated_at = CURRENT_TIMESTAMP
                WHERE asset_stocks_unique_id = $1
                  AND is_inherited = 1
                  AND is_active = 1;
                `, [periSerialId]);
                            await queryRunner.manager.query(`
                INSERT INTO ${schema}.asset_mapping (
                  asset_stocks_unique_id, target_type, target_id, user_id, assigned_date,
                  is_active, is_deleted, is_inherited, created_at, updated_at
                )
                VALUES ($1, 'USER', $2, $3, CURRENT_TIMESTAMP, 1, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `, [periSerialId, targetUserId, userId]);
                            await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: periSerialId }, {
                                current_status_id: 7,
                                working_status_type_id: 5,
                            });
                            const reassignEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                                asset_stocks_unique_id: periSerialId,
                                mapping_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                notes: `Peripheral detached from host and reassigned to User #${targetUserId} (REASSIGN)`,
                                target_id: targetUserId,
                                target_type: asset_mapping_entity_1.AssignTargetType.USER,
                                working_condition_id: 5,
                            });
                            await queryRunner.manager.save(reassignEvent);
                            const hostUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: serial.asset_id,
                                asset_stocks_unique_id: serialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Peripheral '${peri.peripheral_name}' detached from host and reassigned`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached Peripheral',
                                    connected_serial_id: periSerialId,
                                    connected_asset_name: peri.peripheral_name,
                                    direction: 'FORWARD',
                                    reason: 'REASSIGN',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            const periUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: periAssetId,
                                asset_stocks_unique_id: periSerialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Disconnected from host device '${hostName}' on return and reassigned`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached To',
                                    connected_serial_id: serialId,
                                    connected_asset_name: hostName,
                                    direction: 'REVERSE',
                                    reason: 'REASSIGN',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            await queryRunner.manager.save(asset_events_entity_1.AssetEvent, [hostUnlinkEvent, periUnlinkEvent]);
                        }
                        else {
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0, is_deleted = 1, updated_at = CURRENT_TIMESTAMP
                WHERE mapping_id = $1;
                `, [peri.rel_mapping_id]);
                            await queryRunner.manager.query(`
                UPDATE ${schema}.asset_mapping
                SET is_active = 0,
                    is_deleted = 1,
                    returned_by = $2,
                    assigned_to_date = CURRENT_DATE,
                    updated_at = CURRENT_TIMESTAMP
                WHERE asset_stocks_unique_id = $1
                  AND is_active = 1;
                `, [periSerialId, userId]);
                            const isDamaged = (decision?.condition || '').toLowerCase() === 'damaged';
                            const targetWorkingCondId = isDamaged ? 6 : GOOD_WORKING_ID;
                            await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: periSerialId }, {
                                current_status_id: AVAILABLE_STATUS_ID,
                                working_status_type_id: targetWorkingCondId,
                            });
                            await queryRunner.manager.query(`
                UPDATE ${schema}.stocks
                SET quantity = quantity + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE stock_id = $1;
                `, [peri.stock_id]);
                            const detachEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                                asset_stocks_unique_id: periSerialId,
                                mapping_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                notes: `Peripheral detached from host and returned to stock (RETURN_DETACH)${isDamaged ? ' [Condition: Damaged]' : ''}`,
                                target_id: null,
                                target_type: null,
                                working_condition_id: targetWorkingCondId,
                            });
                            await queryRunner.manager.save(detachEvent);
                            const hostUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: serial.asset_id,
                                asset_stocks_unique_id: serialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Peripheral '${peri.peripheral_name}' detached from host on return`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached Peripheral',
                                    connected_serial_id: periSerialId,
                                    connected_asset_name: peri.peripheral_name,
                                    direction: 'FORWARD',
                                    reason: 'RETURN_DETACH',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            const periUnlinkEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: periAssetId,
                                asset_stocks_unique_id: periSerialId,
                                title: 'Technical Relationship Unlinked',
                                description: `Disconnected from host device '${hostName}' on return`,
                                reference_table: 'asset_mapping',
                                reference_id: Number(peri.rel_mapping_id),
                                metadata: {
                                    action: 'UNLINK',
                                    is_technical_relationship: true,
                                    relation_type: 'REL-007',
                                    relation_label: 'Attached To',
                                    connected_serial_id: serialId,
                                    connected_asset_name: hostName,
                                    direction: 'REVERSE',
                                    reason: 'RETURN_DETACH',
                                },
                                performed_by: userId,
                                performed_at: new Date(),
                                created_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                            });
                            const periReturnEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                                asset_id: periAssetId,
                                asset_stocks_unique_id: periSerialId,
                                event_type_id: AVAILABLE_STATUS_ID,
                                title: 'Asset returned',
                                description: `Peripheral returned to inventory after detachment from host '${hostName}'`,
                                reference_table: 'asset_mappings',
                                reference_id: Number(peri.rel_mapping_id),
                                performed_by: userId,
                                performed_at: new Date(),
                                event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                                metadata: { notes: `Detached from host ${hostName}` },
                                created_at: new Date(),
                            });
                            await queryRunner.manager.save(asset_events_entity_1.AssetEvent, [hostUnlinkEvent, periUnlinkEvent, periReturnEvent]);
                        }
                    }
                }
                returnedAssets.push({
                    serialId,
                    asset_id: serial.asset_id,
                    previousWorkingStatusId,
                });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
        await this.refreshStockSummaryNowFromContext();
        this.redisService.delByPattern('software-list:*');
        this.redisService.delByPattern('perpetualSoftwares-list:*');
        const ASSET_RETURNED_EVENT_ID = 28;
        const GOOD_WORKING_ID = 20;
        const manager = this.dataSource.manager;
        const updatedUser = await manager.findOne(organizational_user_entity_1.User, {
            where: { user_id: userId },
        });
        for (const item of returnedAssets) {
            const asset = await manager.findOne(asset_datum_entity_1.AssetDatum, {
                where: { asset_id: item.asset_id },
            });
            const fromStatus = await manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: { working_status_type_id: item.previousWorkingStatusId },
            });
            const toStatus = await manager.findOne(asset_working_status_entity_1.AssetWorkingStatus, {
                where: { working_status_type_id: GOOD_WORKING_ID },
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
                eventId: ASSET_RETURNED_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: `RETURN-${item.serialId}`,
                },
            });
        }
        const allSkipped = returnedAssets.length === 0 && returnSkipped.length > 0;
        const firstReason = returnSkipped[0]?.reason;
        return {
            success: !allSkipped,
            message: returnSkipped.length
                ? returnedAssets.length > 0
                    ? `Returned ${returnedAssets.length} asset(s). ${returnSkipped.length} skipped (${firstReason}).`
                    : firstReason || `${returnSkipped.length} asset(s) skipped.`
                : 'Assets returned successfully',
            processedCount: returnedAssets.length,
            skippedCount: returnSkipped.length,
            skipped: returnSkipped.slice(0, 200),
        };
    }
    async getAssignmentLogsBySerial(serialId) {
        console.log('getAssignmentLogsBySerial');
        const query = this.assignmentEventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.performed_by_user', 'performedBy')
            .leftJoinAndSelect('event.working_status', 'workingStatus')
            .leftJoin(organizational_user_entity_1.User, 'targetUser', "event.target_type = 'USER' AND event.target_id = targetUser.user_id")
            .leftJoin(branches_entity_1.Branch, 'targetBranch', "event.target_type = 'BRANCH' AND event.target_id = targetBranch.branch_id")
            .leftJoin(department_entity_1.Department, 'targetDepartment', "event.target_type = 'DEPARTMENT' AND event.target_id = targetDepartment.department_id")
            .addSelect([
            'targetUser.user_id',
            'targetUser.first_name',
            'targetUser.last_name',
            'targetBranch.branch_id',
            'targetBranch.branch_name',
            'targetDepartment.department_id',
            'targetDepartment.department_name',
        ])
            .where('event.asset_stocks_unique_id = :serialId', { serialId })
            .orderBy('event.performed_at', 'DESC');
        const { entities, raw } = await query.getRawAndEntities();
        return entities.map((log, index) => {
            let assignedToName = null;
            if (log.target_type === 'USER') {
                const first = raw[index]['targetUser_first_name'];
                const last = raw[index]['targetUser_last_name'];
                assignedToName = [first, last].filter(Boolean).join(' ') || null;
            }
            if (log.target_type === 'BRANCH') {
                assignedToName = raw[index]['targetBranch_branch_name'] || null;
            }
            if (log.target_type === 'DEPARTMENT') {
                assignedToName = raw[index]['targetDepartment_department_name'] || null;
            }
            return {
                event_id: log.event_id,
                performed_at: log.performed_at,
                notes: log.notes,
                target_type: log.target_type,
                target_id: log.target_id,
                assigned_to_name: assignedToName,
                working_condition: log.working_status?.working_status_type_name || null,
                color: log.working_status?.working_status_color || '#bbbbbb',
                performed_by: log.performed_by_user
                    ? {
                        user_id: log.performed_by_user.user_id,
                        name: log.performed_by_user.first_name,
                    }
                    : null,
            };
        });
    }
    async returnScrappedAssets(dto, userId, schema, branchIds = []) {
        if (schema && dto?.serialIds?.length) {
            const scoped = await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
                runner: this.dataSource, schema,
                ids: dto.serialIds.map(Number), branchIds, label: 'returnScrappedAssets',
            });
            const ok = new Set(scoped.ids);
            dto = { ...dto, serialIds: dto.serialIds.filter((id) => ok.has(Number(id))) };
            if (!dto.serialIds.length) {
                return { success: false, message: 'No assets in your branch access' };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const AVAILABLE_STATUS_ID = 1;
            const GOOD_WORKING_ID = 20;
            for (const serialId of dto.serialIds) {
                const serial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: serialId },
                });
                if (!serial) {
                    throw new common_1.BadRequestException(`Serial ${serialId} not found`);
                }
                const scrap = await queryRunner.manager.findOne(scrap_entity_1.AssetScrap, {
                    where: {
                        asset_stocks_unique_id: serialId,
                        is_active: 1,
                        is_deleted: 0,
                    },
                });
                if (!scrap) {
                    throw new common_1.BadRequestException(`Serial ${serialId} is not in scrapped state`);
                }
                await queryRunner.manager.update(scrap_entity_1.AssetScrap, { scrap_id: scrap.scrap_id }, {
                    is_active: 0,
                    is_deleted: 1,
                    updated_by: userId,
                    updated_at: new Date(),
                });
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: serialId }, {
                    current_status_id: AVAILABLE_STATUS_ID,
                    working_status_type_id: GOOD_WORKING_ID,
                });
                const assetEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serialId,
                    event_type_id: AVAILABLE_STATUS_ID,
                    title: 'Scrap Reversed',
                    description: 'Asset returned to inventory from scrap',
                    reference_table: 'asset_scrap',
                    reference_id: scrap.scrap_id,
                    performed_by: userId,
                    performed_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.LIFECYCLE,
                    metadata: {
                        scrap_ref_id: scrap.scrap_ref_id,
                        scrap_reason: scrap.scrap_reason,
                        notes: dto.notes || null,
                    },
                    created_at: new Date(),
                });
                await queryRunner.manager.save(assetEvent);
                await queryRunner.manager.query(`
        UPDATE stocks
        SET quantity = quantity + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE stock_id = ${serial.stock_id}
      `);
            }
            await queryRunner.commitTransaction();
            await this.refreshStockSummaryNowFromContext();
            return { message: 'Scrapped assets returned to stock successfully' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeAssignedAssets(dto, userId, schema, branchIds = []) {
        if (schema && dto?.serialIds?.length) {
            const scoped = await (0, serial_branch_scope_1.scopeSerialIdsToBranch)({
                runner: this.dataSource,
                schema,
                ids: dto.serialIds.map((x) => Number(x.asset_stocks_unique_id)),
                branchIds,
                label: 'remove-mapping-of-serial',
            });
            const ok = new Set(scoped.ids);
            dto = {
                ...dto,
                serialIds: dto.serialIds.filter((x) => ok.has(Number(x.asset_stocks_unique_id))),
            };
            if (!dto.serialIds.length) {
                return { success: false, message: 'No assets in your branch access' };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const AVAILABLE_STATUS_ID = 1;
            const GOOD_WORKING_ID = 20;
            for (const item of dto.serialIds) {
                const serialId = item.asset_stocks_unique_id;
                const mappingId = item.mapping_id;
                const serial = await queryRunner.manager.findOne(asset_stock_serials_entity_1.AssetStockSerials, {
                    where: { asset_stocks_unique_id: serialId },
                });
                if (!serial) {
                    throw new common_1.BadRequestException(`Serial ${serialId} not found`);
                }
                const mapping = await queryRunner.manager.findOne(asset_mapping_entity_1.AssetMappingRepository, {
                    where: {
                        mapping_id: mappingId,
                        is_active: 1,
                        is_deleted: 0,
                    },
                });
                if (!mapping) {
                    throw new common_1.BadRequestException(`Mapping ${mappingId} is not active`);
                }
                if (mapping.is_inherited === 1) {
                    throw new common_1.BadRequestException(`Cannot unassign software directly: this license inherits operational custody from its host device. Please unlink the software from the host device instead.`);
                }
                await queryRunner.manager.update(asset_mapping_entity_1.AssetMappingRepository, { mapping_id: mappingId }, {
                    is_active: 0,
                    target_type: null,
                    target_id: null,
                    returned_by: userId,
                    status_type_id: AVAILABLE_STATUS_ID,
                    updated_at: new Date(),
                });
                await queryRunner.manager.update(asset_stock_serials_entity_1.AssetStockSerials, { asset_stocks_unique_id: serialId }, {
                    current_status_id: AVAILABLE_STATUS_ID,
                    working_status_type_id: GOOD_WORKING_ID,
                });
                const assignmentEvent = queryRunner.manager.create(asset_assignment_log_entity_1.AssetAssignmentEvent, {
                    asset_stocks_unique_id: serialId,
                    mapping_id: mappingId,
                    performed_by: userId,
                    notes: dto.notes || 'Asset Unassigned',
                    target_id: null,
                    target_type: null,
                    working_condition_id: GOOD_WORKING_ID,
                });
                await queryRunner.manager.save(assignmentEvent);
                const assetEvent = queryRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: serial.asset_id,
                    asset_stocks_unique_id: serialId,
                    event_type_id: AVAILABLE_STATUS_ID,
                    title: 'Asset Unassigned',
                    description: 'Asset returned to inventory',
                    reference_table: 'asset_mapping',
                    reference_id: mappingId,
                    performed_by: userId,
                    performed_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    metadata: {
                        previous_target_type: mapping.target_type,
                        previous_target_id: mapping.target_id,
                        notes: dto.notes || null,
                    },
                    created_at: new Date(),
                });
                await queryRunner.manager.save(assetEvent);
                queryRunner.manager.increment(stocks_entity_1.Stock, { stock_id: serial.stock_id }, 'quantity', 1);
                await queryRunner.manager.update(stocks_entity_1.Stock, { stock_id: serial.stock_id }, { updated_by: userId });
                await queryRunner.manager.query(`
          UPDATE ${schema}.asset_mapping
          SET is_active = 0,
              target_type = null,
              target_id = null,
              updated_at = CURRENT_TIMESTAMP
          WHERE is_inherited = 1
            AND inherited_via_relationship_id IN (
              SELECT mapping_id FROM ${schema}.asset_mapping
              WHERE (target_id = $1 OR (asset_stocks_unique_id = $1 AND target_type = 'SOFTWARE'))
                AND relation_type = 'REL-006'
                AND is_active = 1
                AND is_deleted = 0
            );
          `, [serialId]);
            }
            await queryRunner.commitTransaction();
            this.refreshStockSummaryFromContext();
            return { message: 'Assets unassigned successfully' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAssetHierarchyBySerialId(serialId, schema) {
        const rows = await this.dataSource.query(`
      SELECT 
        ass.asset_stocks_unique_id,
        ass.asset_id,
        COALESCE(ass.asset_item_id, a.asset_item_id) AS item_id,
        a.asset_main_category_id AS main_category_id,
        COALESCE(mc.main_category_name, '') AS main_category_name,
        a.asset_sub_category_id AS sub_category_id,
        COALESCE(sc.sub_category_name, '') AS sub_category_name,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Asset #' || ass.asset_stocks_unique_id::text) AS asset_name,
        ass.current_status_id,
        ass.working_status_type_id,
        ass.system_code
      FROM ${schema}.asset_stock_serials ass
      JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
      WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0
      LIMIT 1;
      `, [serialId]);
        if (!rows || rows.length === 0) {
            throw new common_1.BadRequestException(`Asset with serial ID ${serialId} not found or is deleted.`);
        }
        return {
            asset_stocks_unique_id: Number(rows[0].asset_stocks_unique_id),
            asset_id: Number(rows[0].asset_id),
            item_id: rows[0].item_id ? Number(rows[0].item_id) : null,
            main_category_id: Number(rows[0].main_category_id),
            main_category_name: rows[0].main_category_name || '',
            sub_category_id: Number(rows[0].sub_category_id),
            sub_category_name: rows[0].sub_category_name || '',
            asset_name: rows[0].asset_name,
            current_status_id: rows[0].current_status_id ? Number(rows[0].current_status_id) : null,
            working_status_type_id: rows[0].working_status_type_id ? Number(rows[0].working_status_type_id) : null,
            system_code: rows[0].system_code || '',
        };
    }
    async checkGovernanceByCategory(relationType, source, target, schema) {
        if (!relationType) {
            throw new common_1.BadRequestException('relation_type is required');
        }
        const rules = await this.dataSource.query(`
      SELECT
        governance_id,
        rule_name,
        is_allowed,
        validation_message,
        (
          (CASE WHEN (source_item_id IS NOT NULL OR target_item_id IS NOT NULL) THEN 8 ELSE 0 END) +
          (CASE WHEN (source_sub_category_id IS NOT NULL OR target_sub_category_id IS NOT NULL) THEN 4 ELSE 0 END) +
          (CASE WHEN (source_main_category_id IS NOT NULL OR target_main_category_id IS NOT NULL) THEN 2 ELSE 0 END)
        ) AS specificity_score
      FROM ${schema}.asset_relationship_governance
      WHERE is_active = true
        AND relation_type = $1
        AND (
          (
            (source_main_category_id IS NULL OR source_main_category_id = $2)
            AND (source_sub_category_id IS NULL OR source_sub_category_id = $3)
            AND (source_item_id IS NULL OR source_item_id = $4)
            AND (target_main_category_id IS NULL OR target_main_category_id = $5)
            AND (target_sub_category_id IS NULL OR target_sub_category_id = $6)
            AND (target_item_id IS NULL OR target_item_id = $7)
          )
          OR
          (
            (source_main_category_id IS NULL OR source_main_category_id = $5)
            AND (source_sub_category_id IS NULL OR source_sub_category_id = $6)
            AND (source_item_id IS NULL OR source_item_id = $7)
            AND (target_main_category_id IS NULL OR target_main_category_id = $2)
            AND (target_sub_category_id IS NULL OR target_sub_category_id = $3)
            AND (target_item_id IS NULL OR target_item_id = $4)
          )
        )
      ORDER BY specificity_score DESC, is_allowed ASC
      LIMIT 1;
      `, [
            relationType,
            source?.main_category_id ?? null,
            source?.sub_category_id ?? null,
            source?.item_id ?? null,
            target?.main_category_id ?? null,
            target?.sub_category_id ?? null,
            target?.item_id ?? null,
        ]);
        if (!rules || rules.length === 0) {
            return {
                allowed: false,
                governance_id: null,
                rule_name: null,
                message: `Incompatible relationship: No governance policy allows relation '${relationType}' for the selected category.`,
            };
        }
        const rule = rules[0];
        return {
            allowed: rule.is_allowed === true,
            governance_id: Number(rule.governance_id),
            rule_name: rule.rule_name,
            message: rule.is_allowed
                ? null
                : rule.validation_message ||
                    `Governance Policy Disallow: relation '${relationType}' is not permitted for the selected category.`,
        };
    }
    async getSoftwareMainCategoryId(schema) {
        const rows = await this.dataSource.query(`SELECT main_category_id FROM ${schema}.asset_main_category
       WHERE is_deleted = 0 AND lower(trim(main_category_name)) = 'software'
       ORDER BY main_category_id ASC LIMIT 1;`);
        return rows?.[0]?.main_category_id ? Number(rows[0].main_category_id) : null;
    }
    async validateRelationshipGovernance(sourceSerialId, targetSerialId, relationType, schema) {
        const sourceMeta = await this.getAssetHierarchyBySerialId(sourceSerialId, schema);
        const targetMeta = await this.getAssetHierarchyBySerialId(targetSerialId, schema);
        const rules = await this.dataSource.query(`
      SELECT 
        governance_id,
        rule_name,
        relation_type,
        is_allowed,
        validation_message,
        (
          (CASE WHEN (source_item_id IS NOT NULL OR target_item_id IS NOT NULL) THEN 8 ELSE 0 END) +
          (CASE WHEN (source_sub_category_id IS NOT NULL OR target_sub_category_id IS NOT NULL) THEN 4 ELSE 0 END) +
          (CASE WHEN (source_main_category_id IS NOT NULL OR target_main_category_id IS NOT NULL) THEN 2 ELSE 0 END)
        ) AS specificity_score
      FROM ${schema}.asset_relationship_governance
      WHERE is_active = true
        AND relation_type = $1
        AND (
          -- Direct match: current source is rule source, current target is rule target
          (
            (source_main_category_id IS NULL OR source_main_category_id = $2)
            AND (source_sub_category_id IS NULL OR source_sub_category_id = $3)
            AND (source_item_id IS NULL OR source_item_id = $4)
            AND (target_main_category_id IS NULL OR target_main_category_id = $5)
            AND (target_sub_category_id IS NULL OR target_sub_category_id = $6)
            AND (target_item_id IS NULL OR target_item_id = $7)
          )
          OR
          -- Role-aware reverse match: link initiated from target asset's page (e.g. Hardware host linking Software)
          (
            (source_main_category_id IS NULL OR source_main_category_id = $5)
            AND (source_sub_category_id IS NULL OR source_sub_category_id = $6)
            AND (source_item_id IS NULL OR source_item_id = $7)
            AND (target_main_category_id IS NULL OR target_main_category_id = $2)
            AND (target_sub_category_id IS NULL OR target_sub_category_id = $3)
            AND (target_item_id IS NULL OR target_item_id = $4)
          )
        )
      ORDER BY 
        specificity_score DESC,
        is_allowed ASC
      LIMIT 1;
      `, [
            relationType,
            sourceMeta.main_category_id,
            sourceMeta.sub_category_id,
            sourceMeta.item_id,
            targetMeta.main_category_id,
            targetMeta.sub_category_id,
            targetMeta.item_id,
        ]);
        if (!rules || rules.length === 0) {
            throw new common_1.BadRequestException(`Incompatible relationship: No governance policy allows relation '${relationType}' between '${sourceMeta.asset_name}' and '${targetMeta.asset_name}'.`);
        }
        const matchedRule = rules[0];
        if (!matchedRule.is_allowed) {
            throw new common_1.BadRequestException(matchedRule.validation_message ||
                `Governance Policy Disallow: '${sourceMeta.asset_name}' cannot be linked to '${targetMeta.asset_name}' via '${relationType}'.`);
        }
        return {
            governance_id: Number(matchedRule.governance_id),
            rule_name: matchedRule.rule_name,
            is_allowed: true,
            sourceMeta,
            targetMeta,
        };
    }
    async validateRelationshipGuards(sourceSerialId, targetSerialId, relationType, schema, confirmReassign) {
        const sourceMeta = await this.getAssetHierarchyBySerialId(sourceSerialId, schema);
        const targetMeta = await this.getAssetHierarchyBySerialId(targetSerialId, schema);
        const isSourceScrapped = sourceMeta.current_status_id === 3 ||
            [12, 13, 14].includes(Number(sourceMeta.working_status_type_id));
        if (isSourceScrapped) {
            if (relationType === 'REL-006') {
                throw new common_1.HttpException({
                    code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE,
                    message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE](sourceMeta.system_code, sourceMeta.asset_name),
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.BadRequestException(`Lifecycle Guard: Cannot create technical relationship on scrapped or decommissioned asset '${sourceMeta.asset_name}' (${sourceMeta.system_code || 'ID ' + sourceSerialId}).`);
        }
        const isTargetScrapped = targetMeta.current_status_id === 3 ||
            [12, 13, 14].includes(Number(targetMeta.working_status_type_id));
        if (isTargetScrapped) {
            if (relationType === 'REL-006') {
                throw new common_1.HttpException({
                    code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE,
                    message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE](targetMeta.system_code, targetMeta.asset_name),
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.BadRequestException(`Lifecycle Guard: Target asset '${targetMeta.asset_name}' (${targetMeta.system_code || 'ID ' + targetSerialId}) is scrapped or decommissioned and cannot be linked.`);
        }
        if (Number(sourceSerialId) === Number(targetSerialId)) {
            throw new common_1.BadRequestException('Self-relationship forbidden: An asset cannot be linked to itself.');
        }
        const existingDuplicates = await this.dataSource.query(`
      SELECT mapping_id 
      FROM ${schema}.asset_mapping
      WHERE asset_stocks_unique_id = $1
        AND target_type IN ('ASSET', 'SOFTWARE')
        AND target_id = $2
        AND relation_type = $3
        AND is_active = 1
        AND is_deleted = 0
      LIMIT 1;
      `, [sourceSerialId, targetSerialId, relationType]);
        if (existingDuplicates && existingDuplicates.length > 0) {
            throw new common_1.BadRequestException(`Duplicate relationship: This active relationship (${relationType}) is already established between these two assets.`);
        }
        const relMeta = await this.dataSource.query(`
      SELECT code, forward_label, cardinality, is_cycle_allowed, target_type, category 
      FROM ${schema}.asset_relation_type_table 
      WHERE code = $1 AND is_active = true
      LIMIT 1;
      `, [relationType]);
        if (!relMeta || relMeta.length === 0) {
            throw new common_1.BadRequestException(`Relation type '${relationType}' is not active or not registered in asset_relation_type_table.`);
        }
        const relationDef = relMeta[0];
        if (relationType === 'REL-010') {
            const isSourceCloud = sourceMeta.sub_category_id === 7 ||
                (sourceMeta.sub_category_name || '').toLowerCase().includes('cloud');
            const isTargetCloud = targetMeta.sub_category_id === 7 ||
                (targetMeta.sub_category_name || '').toLowerCase().includes('cloud');
            const guestSerial = isSourceCloud ? sourceMeta : isTargetCloud ? targetMeta : sourceMeta;
            const hostSerial = guestSerial.asset_stocks_unique_id === sourceMeta.asset_stocks_unique_id ? targetMeta : sourceMeta;
            const existingHost = await this.dataSource.query(`
        SELECT 
          m.mapping_id, 
          (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
          COALESCE(ass.asset_serial_title, a.asset_title, 'Host Asset #' || (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS host_name,
          ass.system_code AS host_code
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
        LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
        WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
          AND (m.target_id <> $2 AND m.asset_stocks_unique_id <> $2)
          AND m.relation_type = 'REL-010'
          AND m.is_active = 1
          AND m.is_deleted = 0
        LIMIT 1;
        `, [guestSerial.asset_stocks_unique_id, hostSerial.asset_stocks_unique_id]);
            if (existingHost && existingHost.length > 0) {
                throw new common_1.HttpException({
                    code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED,
                    message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED](guestSerial.asset_name, existingHost[0].host_name, existingHost[0].host_code || 'ID: ' + existingHost[0].host_serial_id),
                }, common_1.HttpStatus.CONFLICT);
            }
        }
        else if (relationType === 'REL-006') {
            const isSourceSoftware = sourceMeta.main_category_name?.toLowerCase()?.trim() === 'software';
            const hostSerial = isSourceSoftware ? targetMeta : sourceMeta;
            const swSerial = isSourceSoftware ? sourceMeta : targetMeta;
            const swItemRows = await this.dataSource.query(`
        SELECT ai.license_metric, ai.item_type
        FROM ${schema}.asset_stock_serials ass
        JOIN ${schema}.asset_items ai ON ai.asset_item_id = ass.asset_item_id
        WHERE ass.asset_stocks_unique_id = $1
        LIMIT 1;
        `, [swSerial.asset_stocks_unique_id]);
            const swMetric = swItemRows?.[0]?.license_metric || 'PER_DEVICE';
            if (swMetric === 'PER_DEVICE' || swMetric === 'HYBRID') {
                const existingHost = await this.dataSource.query(`
          SELECT 
            m.mapping_id, 
            (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
            COALESCE(ass.asset_serial_title, a.asset_title, 'Host Asset #' || (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS host_name,
            ass.system_code AS host_code
          FROM ${schema}.asset_mapping m
          LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
          LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
          WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
            AND (m.target_id <> $2 AND m.asset_stocks_unique_id <> $2)
            AND m.relation_type = 'REL-006'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [swSerial.asset_stocks_unique_id, hostSerial.asset_stocks_unique_id]);
                if (existingHost && existingHost.length > 0) {
                    throw new common_1.BadRequestException(`Single-Host Violation: Software license '${swSerial.asset_name}' (${swSerial.system_code}) is already installed on '${existingHost[0].host_name}' (${existingHost[0].host_code || 'ID: ' + existingHost[0].host_serial_id}). A license serial can only be installed on one host device at a time. Please unlink it from '${existingHost[0].host_name}' first or choose an available license seat.`);
                }
                const activeCustodyRows = await this.dataSource.query(`
          SELECT 
            m.mapping_id, 
            m.target_type, 
            m.target_id,
            COALESCE(u.first_name || ' ' || COALESCE(u.last_name, ''), b.branch_name, d.department_name, 'ID: ' || m.target_id::text) AS target_name
          FROM ${schema}.asset_mapping m
          LEFT JOIN ${schema}.users u ON m.target_type = 'USER' AND m.target_id = u.user_id
          LEFT JOIN ${schema}.branches b ON m.target_type = 'BRANCH' AND m.target_id = b.branch_id
          LEFT JOIN ${schema}.departments d ON m.target_type = 'DEPARTMENT' AND m.target_id = d.department_id
          WHERE m.asset_stocks_unique_id = $1
            AND m.is_active = 1
            AND m.is_deleted = 0
            AND (m.relation_type IS NULL OR m.relation_type = 'REL-001')
            AND (m.is_inherited = 0 OR m.is_inherited IS NULL)
          LIMIT 1;
          `, [swSerial.asset_stocks_unique_id]);
                if (activeCustodyRows && activeCustodyRows.length > 0) {
                    const cust = activeCustodyRows[0];
                    const errorMsg = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LICENSE_ALREADY_ASSIGNED](swSerial.asset_name, swSerial.system_code, cust.target_type, cust.target_name);
                    throw new common_1.BadRequestException(errorMsg);
                }
            }
            if (swMetric === 'SITE') {
                const siteScopeRows = await this.dataSource.query(`
          SELECT m.target_id AS branch_id, b.branch_name
          FROM ${schema}.asset_mapping m
          JOIN ${schema}.branches b ON b.branch_id = m.target_id
          WHERE m.asset_stocks_unique_id = $1
            AND m.target_type = 'BRANCH'
            AND m.is_active = 1
            AND m.is_deleted = 0
          LIMIT 1;
          `, [swSerial.asset_stocks_unique_id]);
                if (siteScopeRows && siteScopeRows.length > 0) {
                    const siteBranchId = Number(siteScopeRows[0].branch_id);
                    const siteBranchName = siteScopeRows[0].branch_name;
                    const hostBranchRows = await this.dataSource.query(`
            SELECT 
              COALESCE(loc.branch_id, custody_b.target_id) AS branch_id,
              COALESCE(b.branch_name, cust_b.branch_name) AS branch_name
            FROM ${schema}.asset_stock_serials ass
            LEFT JOIN ${schema}.asset_locations loc ON loc.location_id = ass.location_id
            LEFT JOIN ${schema}.branches b ON b.branch_id = loc.branch_id
            LEFT JOIN LATERAL (
              SELECT m.target_id
              FROM ${schema}.asset_mapping m
              WHERE m.asset_stocks_unique_id = ass.asset_stocks_unique_id
                AND m.target_type = 'BRANCH'
                AND m.is_active = 1 AND m.is_deleted = 0
              ORDER BY m.mapping_id DESC LIMIT 1
            ) custody_b ON true
            LEFT JOIN ${schema}.branches cust_b ON cust_b.branch_id = custody_b.target_id
            WHERE ass.asset_stocks_unique_id = $1
            LIMIT 1;
            `, [hostSerial.asset_stocks_unique_id]);
                    const hostBranchId = hostBranchRows?.[0]?.branch_id ? Number(hostBranchRows[0].branch_id) : null;
                    const hostBranchName = hostBranchRows?.[0]?.branch_name || 'Unassigned Branch';
                    if (hostBranchId && hostBranchId !== siteBranchId) {
                        const errorMsg = relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LICENSE_SCOPE_MISMATCH](swSerial.asset_name, siteBranchName, hostSerial.asset_name, hostBranchName);
                        throw new common_1.BadRequestException(errorMsg);
                    }
                }
            }
            if (swMetric !== 'FREE') {
                const swStatusRow = await this.dataSource.query(`SELECT current_status_id FROM ${schema}.asset_stock_serials WHERE asset_stocks_unique_id = $1 LIMIT 1;`, [swSerial.asset_stocks_unique_id]);
                if (swStatusRow?.[0]?.current_status_id && Number(swStatusRow[0].current_status_id) !== 1) {
                    throw new common_1.BadRequestException(`Software License Unavailable: Software serial '${swSerial.asset_name}' (${swSerial.system_code}) is currently not in Available status (status ID: ${swStatusRow[0].current_status_id}). Only available software licenses can be installed on an asset.`);
                }
            }
        }
        else if (relationType === 'REL-007') {
            const isSourcePeripheral = sourceMeta.sub_category_id === 13 ||
                sourceMeta.sub_category_id === 14 ||
                (sourceMeta.sub_category_name || '').toLowerCase().includes('peripheral') ||
                [8, 9, 11, 12].includes(sourceMeta.item_id) ||
                (sourceMeta.asset_name || '').toLowerCase().includes('monitor') ||
                (sourceMeta.asset_name || '').toLowerCase().includes('dock');
            const isTargetPeripheral = targetMeta.sub_category_id === 13 ||
                targetMeta.sub_category_id === 14 ||
                (targetMeta.sub_category_name || '').toLowerCase().includes('peripheral') ||
                [8, 9, 11, 12].includes(targetMeta.item_id) ||
                (targetMeta.asset_name || '').toLowerCase().includes('monitor') ||
                (targetMeta.asset_name || '').toLowerCase().includes('dock');
            const peripheralSerial = isTargetPeripheral && !isSourcePeripheral ? targetMeta : sourceMeta;
            const hostSerial = peripheralSerial.asset_stocks_unique_id === sourceMeta.asset_stocks_unique_id ? targetMeta : sourceMeta;
            const existingHost = await this.dataSource.query(`
        SELECT 
          m.mapping_id, 
          (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS host_serial_id,
          COALESCE(ass.asset_serial_title, a.asset_title, 'Host Asset #' || (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)::text) AS host_name,
          ass.system_code AS host_code
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = (CASE WHEN m.target_id = $1 THEN m.asset_stocks_unique_id ELSE m.target_id END)
        LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
        WHERE (m.target_id = $1 OR m.asset_stocks_unique_id = $1)
          AND (m.target_id <> $2 AND m.asset_stocks_unique_id <> $2)
          AND m.relation_type = 'REL-007'
          AND m.is_active = 1
          AND m.is_deleted = 0
        LIMIT 1;
        `, [peripheralSerial.asset_stocks_unique_id, hostSerial.asset_stocks_unique_id]);
            if (existingHost && existingHost.length > 0) {
                throw new common_1.HttpException({
                    code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED,
                    message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED](peripheralSerial.asset_name, existingHost[0].host_name, existingHost[0].host_code || 'ID: ' + existingHost[0].host_serial_id, true),
                }, common_1.HttpStatus.CONFLICT);
            }
            const directCustody = await this.dataSource.query(`
        SELECT m.mapping_id, m.target_id, u.first_name, u.last_name, u.users_business_email
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.users u ON u.user_id = m.target_id
        WHERE m.asset_stocks_unique_id = $1
          AND m.target_type = 'USER'
          AND m.is_inherited = 0
          AND m.is_active = 1
          AND m.is_deleted = 0
        LIMIT 1;
        `, [peripheralSerial.asset_stocks_unique_id]);
            const hostCustody = await this.dataSource.query(`
        SELECT m.mapping_id, m.target_id, u.first_name, u.last_name, u.users_business_email
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.users u ON u.user_id = m.target_id
        WHERE m.asset_stocks_unique_id = $1
          AND m.target_type = 'USER'
          AND m.is_active = 1
          AND m.is_deleted = 0
        LIMIT 1;
        `, [hostSerial.asset_stocks_unique_id]);
            const peripheralUserId = directCustody?.[0]?.target_id;
            const hostUserId = hostCustody?.[0]?.target_id;
            if (peripheralUserId && hostUserId && Number(peripheralUserId) !== Number(hostUserId)) {
                if (!confirmReassign) {
                    const pUserName = [directCustody[0].first_name, directCustody[0].last_name].filter(Boolean).join(' ') || directCustody[0].users_business_email || `User #${peripheralUserId}`;
                    const hUserName = [hostCustody[0].first_name, hostCustody[0].last_name].filter(Boolean).join(' ') || hostCustody[0].users_business_email || `User #${hostUserId}`;
                    throw new common_1.HttpException({
                        code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_CONFLICT,
                        message: relationship_error_codes_1.RELATIONSHIP_ERROR_MESSAGES[relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_CONFLICT](peripheralSerial.asset_name, pUserName, hUserName),
                    }, common_1.HttpStatus.CONFLICT);
                }
            }
        }
        else if (relationDef.cardinality === '1:N') {
            const existingParents = await this.dataSource.query(`
        SELECT 
          m.mapping_id, 
          m.asset_stocks_unique_id AS parent_serial_id,
          COALESCE(ass.asset_serial_title, 'Host Asset #' || m.asset_stocks_unique_id::text) AS parent_name
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
        WHERE m.target_id = $1
          AND m.relation_type = $2
          AND m.is_active = 1
          AND m.is_deleted = 0
        LIMIT 1;
        `, [targetSerialId, relationType]);
            if (existingParents && existingParents.length > 0) {
                throw new common_1.BadRequestException(`Single-Parent Containment Violation: Target asset #${targetSerialId} is already linked as 1:N child under '${existingParents[0].parent_name}' (Serial #${existingParents[0].parent_serial_id}). Please unlink it first.`);
            }
        }
        if (!relationDef.is_cycle_allowed) {
            const inverseLinks = await this.dataSource.query(`
        SELECT mapping_id, relation_type 
        FROM ${schema}.asset_mapping
        WHERE asset_stocks_unique_id = $1
          AND target_id = $2
          AND is_active = 1
          AND is_deleted = 0
        LIMIT 1;
        `, [targetSerialId, sourceSerialId]);
            if (inverseLinks && inverseLinks.length > 0) {
                throw new common_1.BadRequestException(`Circular Dependency Detected: An active inverse relationship (${inverseLinks[0].relation_type}) already exists between target #${targetSerialId} and source #${sourceSerialId}.`);
            }
        }
    }
    async createTechnicalRelationship(dto, userId, schema) {
        const rawTargetIds = Array.isArray(dto.target_serial_ids) && dto.target_serial_ids.length > 0
            ? dto.target_serial_ids
            : dto.target_serial_id
                ? [dto.target_serial_id]
                : [];
        const targetSerialIds = Array.from(new Set(rawTargetIds.map(Number))).filter((id) => !isNaN(id) && id > 0);
        if (targetSerialIds.length === 0) {
            throw new common_1.BadRequestException('At least one target asset must be specified.');
        }
        const relMeta = await this.dataSource.query(`SELECT target_type, forward_label, reverse_label, category FROM ${schema}.asset_relation_type_table WHERE code = $1 LIMIT 1;`, [dto.relation_type]);
        const targetType = relMeta[0]?.target_type || 'ASSET';
        const forwardLabel = relMeta[0]?.forward_label || dto.relation_type;
        const reverseLabel = relMeta[0]?.reverse_label || dto.relation_type;
        const relCategory = relMeta[0]?.category || 'SOFTWARE';
        const createdResults = [];
        const relationshipSource = dto.source || 'manual';
        const agentFlagOnly = dto.agent_flag_only === true && relationshipSource === 'agent';
        for (const targetSerialId of targetSerialIds) {
            const guardFlags = [];
            try {
                await this.validateRelationshipGuards(dto.source_serial_id, targetSerialId, dto.relation_type, schema, dto.confirm_reassign);
            }
            catch (guardErr) {
                const msg = guardErr?.message || String(guardErr);
                const isLicenceGuard = msg.includes(relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LICENSE_SEATS_EXHAUSTED) ||
                    msg.includes(relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LICENSE_ALREADY_ASSIGNED) ||
                    msg.includes(relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.LICENSE_SCOPE_MISMATCH) ||
                    msg.includes(relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_CONFLICT);
                if (agentFlagOnly && isLicenceGuard) {
                    guardFlags.push(msg);
                }
                else {
                    throw guardErr;
                }
            }
            const govResult = await this.validateRelationshipGovernance(dto.source_serial_id, targetSerialId, dto.relation_type, schema);
            const insertResult = await this.dataSource.query(`
        INSERT INTO ${schema}.asset_mapping
        (
          asset_id,
          asset_stocks_unique_id,
          target_type,
          target_id,
          relation_type,
          governance_id,
          source,
          assigned_by,
          assigned_from_date,
          description,
          metadata,
          is_active,
          is_deleted,
          created_at,
          updated_at,
          last_seen_at
        )
        VALUES
        (
          $1, $2, $3, $4, $5, $6, $11::${schema}.asset_relationship_source_enum, $7, $8, $9, $10, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING mapping_id;
        `, [
                govResult.sourceMeta.asset_id,
                dto.source_serial_id,
                targetType,
                targetSerialId,
                dto.relation_type,
                govResult.governance_id,
                userId,
                dto.assigned_from_date || null,
                dto.description || null,
                dto.metadata
                    ? JSON.stringify(guardFlags.length ? { ...dto.metadata, guard_flags: guardFlags } : dto.metadata)
                    : guardFlags.length
                        ? JSON.stringify({ guard_flags: guardFlags })
                        : null,
                relationshipSource,
            ]);
            const mappingId = Number(insertResult[0]?.mapping_id);
            if (dto.relation_type === 'REL-006') {
                const srcCat = (govResult.sourceMeta.main_category_name || '').toLowerCase().trim();
                const srcSubCat = (govResult.sourceMeta.sub_category_name || '').toLowerCase().trim();
                const tgtCat = (govResult.targetMeta.main_category_name || '').toLowerCase().trim();
                const tgtSubCat = (govResult.targetMeta.sub_category_name || '').toLowerCase().trim();
                const isSourceSoftware = srcCat.includes('software') || srcSubCat.includes('software');
                const isTargetSoftware = tgtCat.includes('software') || tgtSubCat.includes('software');
                const swSerialId = isSourceSoftware
                    ? dto.source_serial_id
                    : isTargetSoftware
                        ? targetSerialId
                        : targetSerialId;
                const hostSerialId = swSerialId === targetSerialId ? dto.source_serial_id : targetSerialId;
                const hostRow = await this.dataSource.query(`SELECT location_id FROM ${schema}.asset_stock_serials WHERE asset_stocks_unique_id = $1 LIMIT 1;`, [hostSerialId]);
                const hostLocationId = hostRow?.[0]?.location_id || null;
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET current_status_id = 7,
              working_status_type_id = 5,
              location_id = COALESCE($1, location_id),
              updated_by = $3
          WHERE asset_stocks_unique_id = $2;
          `, [hostLocationId, swSerialId, userId]);
                const hostCustodyRows = await this.dataSource.query(`
          SELECT target_type, target_id, mapping_id
          FROM ${schema}.asset_mapping
          WHERE asset_stocks_unique_id = $1
            AND is_active = 1 AND is_deleted = 0
            AND target_type IN ('USER', 'BRANCH', 'DEPARTMENT', 'PROJECT')
            AND (relation_type IS NULL OR relation_type = 'REL-001')
          ORDER BY mapping_id DESC LIMIT 1;
          `, [hostSerialId]);
                if (hostCustodyRows && hostCustodyRows.length > 0) {
                    const hc = hostCustodyRows[0];
                    await this.dataSource.query(`
            INSERT INTO ${schema}.asset_mapping (
              asset_stocks_unique_id,
              target_type,
              target_id,
              assigned_by,
              assigned_from_date,
              is_active,
              is_deleted,
              is_inherited,
              inherited_via_relationship_id,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `, [swSerialId, hc.target_type, hc.target_id, userId, mappingId]);
                }
            }
            if (dto.relation_type === 'REL-010') {
                const isSourceCloud = govResult.sourceMeta.sub_category_id === 7 ||
                    (govResult.sourceMeta.sub_category_name || '').toLowerCase().includes('cloud');
                const isTargetCloud = govResult.targetMeta.sub_category_id === 7 ||
                    (govResult.targetMeta.sub_category_name || '').toLowerCase().includes('cloud');
                const vmSerialId = isSourceCloud
                    ? dto.source_serial_id
                    : isTargetCloud
                        ? targetSerialId
                        : dto.source_serial_id;
                const hostServerSerialId = vmSerialId === targetSerialId ? dto.source_serial_id : targetSerialId;
                const hostRow = await this.dataSource.query(`
          SELECT location_id, current_status_id, working_status_type_id 
          FROM ${schema}.asset_stock_serials 
          WHERE asset_stocks_unique_id = $1 
          LIMIT 1;
          `, [hostServerSerialId]);
                const hostLocationId = hostRow?.[0]?.location_id || null;
                const hostStatusId = Number(hostRow?.[0]?.current_status_id);
                const hostWorkingStatusId = Number(hostRow?.[0]?.working_status_type_id);
                const isHostDown = [2, 6].includes(hostStatusId) ||
                    [3, 6].includes(hostWorkingStatusId);
                const impactStatus = isHostDown ? 'IMPACTED' : 'NONE';
                const impactedBy = isHostDown ? hostServerSerialId : null;
                const impactReason = isHostDown ? 'PARENT_UNDER_MAINTENANCE' : null;
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET current_status_id = 7,
              working_status_type_id = 5,
              location_id = COALESCE($1, location_id),
              impact_status = $2,
              impacted_by_serial_id = $3,
              impact_reason = $4,
              updated_by = $5
          WHERE asset_stocks_unique_id = $6;
          `, [hostLocationId, impactStatus, impactedBy, impactReason, userId, vmSerialId]);
            }
            if (dto.relation_type === 'REL-007') {
                const isSourcePeripheral = govResult.sourceMeta.sub_category_id === 13 ||
                    govResult.sourceMeta.sub_category_id === 14 ||
                    (govResult.sourceMeta.sub_category_name || '').toLowerCase().includes('peripheral') ||
                    [8, 9, 11, 12].includes(govResult.sourceMeta.item_id) ||
                    (govResult.sourceMeta.asset_name || '').toLowerCase().includes('monitor') ||
                    (govResult.sourceMeta.asset_name || '').toLowerCase().includes('dock');
                const isTargetPeripheral = govResult.targetMeta.sub_category_id === 13 ||
                    govResult.targetMeta.sub_category_id === 14 ||
                    (govResult.targetMeta.sub_category_name || '').toLowerCase().includes('peripheral') ||
                    [8, 9, 11, 12].includes(govResult.targetMeta.item_id) ||
                    (govResult.targetMeta.asset_name || '').toLowerCase().includes('monitor') ||
                    (govResult.targetMeta.asset_name || '').toLowerCase().includes('dock');
                const peripheralSerialId = isTargetPeripheral && !isSourcePeripheral ? targetSerialId : dto.source_serial_id;
                const hostDeviceSerialId = peripheralSerialId === targetSerialId ? dto.source_serial_id : targetSerialId;
                const hostRow = await this.dataSource.query(`
          SELECT location_id, current_status_id, working_status_type_id 
          FROM ${schema}.asset_stock_serials 
          WHERE asset_stocks_unique_id = $1 
          LIMIT 1;
          `, [hostDeviceSerialId]);
                const hostLocationId = hostRow?.[0]?.location_id || null;
                const hostStatusId = Number(hostRow?.[0]?.current_status_id);
                const hostWorkingStatusId = Number(hostRow?.[0]?.working_status_type_id);
                const isHostDown = [2, 6].includes(hostStatusId) ||
                    [3, 6].includes(hostWorkingStatusId);
                const impactStatus = isHostDown ? 'IMPACTED' : 'NONE';
                const impactedBy = isHostDown ? hostDeviceSerialId : null;
                const impactReason = isHostDown ? 'PARENT_UNDER_MAINTENANCE' : null;
                if (dto.confirm_reassign) {
                    await this.dataSource.query(`
            UPDATE ${schema}.asset_mapping
            SET is_active = 0,
                is_deleted = 1,
                returned_by = $2,
                assigned_to_date = CURRENT_DATE,
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_stocks_unique_id = $1
              AND target_type = 'USER'
              AND is_inherited = 0
              AND is_active = 1
              AND is_deleted = 0;
            `, [peripheralSerialId, userId]);
                }
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET current_status_id = 7,
              working_status_type_id = 5,
              location_id = COALESCE($1, location_id),
              impact_status = $2,
              impacted_by_serial_id = $3,
              impact_reason = $4,
              updated_by = $5
          WHERE asset_stocks_unique_id = $6;
          `, [hostLocationId, impactStatus, impactedBy, impactReason, userId, peripheralSerialId]);
                const hostCustodyRows = await this.dataSource.query(`
          SELECT mapping_id, target_type, target_id
          FROM ${schema}.asset_mapping
          WHERE asset_stocks_unique_id = $1
            AND is_active = 1
            AND is_deleted = 0
            AND is_inherited = 0
            AND target_type IN ('USER', 'DEPARTMENT');
          `, [hostDeviceSerialId]);
                for (const hc of hostCustodyRows) {
                    await this.dataSource.query(`
            UPDATE ${schema}.asset_mapping
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP
            WHERE asset_stocks_unique_id = $1 AND is_inherited = 1 AND is_active = 1;
            `, [peripheralSerialId]);
                    await this.dataSource.query(`
            INSERT INTO ${schema}.asset_mapping (
              asset_stocks_unique_id,
              target_type,
              target_id,
              assigned_by,
              assigned_from_date,
              is_active,
              is_deleted,
              is_inherited,
              inherited_via_relationship_id,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 1, 0, 1, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `, [peripheralSerialId, hc.target_type, hc.target_id, userId, mappingId]);
                }
            }
            try {
                const sourceMetaEvent = {
                    action: 'LINK',
                    is_technical_relationship: true,
                    relation_type: dto.relation_type,
                    relation_category: relCategory,
                    relation_label: forwardLabel,
                    connected_serial_id: targetSerialId,
                    connected_asset_name: govResult.targetMeta.asset_name,
                    direction: 'FORWARD',
                };
                const targetMetaEvent = {
                    action: 'LINK',
                    is_technical_relationship: true,
                    relation_type: dto.relation_type,
                    relation_category: relCategory,
                    relation_label: reverseLabel,
                    connected_serial_id: dto.source_serial_id,
                    connected_asset_name: govResult.sourceMeta.asset_name,
                    direction: 'REVERSE',
                };
                const eventRunner = this.dataSource.createQueryRunner();
                await eventRunner.connect();
                try {
                    await eventRunner.query(`SET search_path TO "${schema}", public;`);
                    const sourceEvent = eventRunner.manager.create(asset_events_entity_1.AssetEvent, {
                        asset_id: govResult.sourceMeta.asset_id,
                        asset_stocks_unique_id: dto.source_serial_id,
                        title: 'Technical Relationship Established',
                        description: dto.description || `Established relationship: ${forwardLabel} -> ${govResult.targetMeta.asset_name}`,
                        reference_table: 'asset_mapping',
                        reference_id: mappingId,
                        metadata: sourceMetaEvent,
                        performed_by: userId,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    });
                    const targetEvent = eventRunner.manager.create(asset_events_entity_1.AssetEvent, {
                        asset_id: govResult.targetMeta.asset_id,
                        asset_stocks_unique_id: targetSerialId,
                        title: 'Technical Relationship Established',
                        description: `Established relationship: ${reverseLabel} -> ${govResult.sourceMeta.asset_name}`,
                        reference_table: 'asset_mapping',
                        reference_id: mappingId,
                        metadata: targetMetaEvent,
                        performed_by: userId,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    });
                    await eventRunner.manager.save(asset_events_entity_1.AssetEvent, [sourceEvent, targetEvent]);
                }
                finally {
                    await eventRunner.release();
                }
            }
            catch (evtErr) {
                console.error('Failed to log technical relationship creation event:', evtErr);
            }
            createdResults.push({
                mapping_id: mappingId,
                relation_type: dto.relation_type,
                source_serial_id: dto.source_serial_id,
                target_serial_id: targetSerialId,
                source_name: govResult.sourceMeta.asset_name,
                target_name: govResult.targetMeta.asset_name,
                governance_rule: govResult.rule_name,
                source: relationshipSource,
                guard_flags: guardFlags,
            });
        }
        const firstResult = createdResults[0];
        this.redisService.delByPattern('software-list:*');
        this.redisService.delByPattern('perpetualSoftwares-list:*');
        await this.refreshStockSummaryNowFromContext(schema);
        return {
            message: createdResults.length === 1
                ? 'Technical relationship created successfully.'
                : `Successfully created ${createdResults.length} technical relationships.`,
            created_count: createdResults.length,
            results: createdResults,
            mapping_id: firstResult.mapping_id,
            relation_type: firstResult.relation_type,
            source_serial_id: firstResult.source_serial_id,
            target_serial_id: firstResult.target_serial_id,
            source_name: firstResult.source_name,
            target_name: firstResult.target_name,
            governance_rule: firstResult.governance_rule,
        };
    }
    async getAssetRelationships(serialId, schema) {
        if (!serialId || isNaN(Number(serialId))) {
            throw new common_1.BadRequestException('Invalid serial ID provided.');
        }
        const query = `
      SELECT 
        m.mapping_id,
        m.asset_stocks_unique_id AS source_serial_id,
        m.target_id AS connected_serial_id,
        m.relation_type,
        CASE 
          WHEN m.relation_type = 'REL-010' THEN
            CASE WHEN LOWER(TRIM(sc.sub_category_name)) LIKE '%cloud%' OR LOWER(TRIM(sc.sub_category_name)) LIKE '%virtual%' OR LOWER(TRIM(sc.sub_category_name)) LIKE '%vm%' THEN 'HOSTS' ELSE 'HOSTED_ON' END
          WHEN m.relation_type = 'REL-006' THEN
            CASE WHEN LOWER(TRIM(mc.main_category_name)) = 'software' THEN 'HAS_INSTALLED_SOFTWARE' ELSE 'INSTALLED_ON' END
          ELSE t.forward_label
        END AS relationship_label,
        t.category AS category_pill,
        'OUTGOING' AS direction,
        m.source,
        m.last_seen_at,
        m.assigned_from_date,
        m.description,
        m.metadata,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Asset #' || m.target_id::text) AS connected_asset_name,
        COALESCE(NULLIF(ass.stock_serials, ''), ass.system_code, '') AS connected_serial_number,
        ass.system_code AS connected_system_code,
        COALESCE(sc.sub_category_name, '') AS connected_sub_category,
        COALESCE(mc.main_category_name, '') AS connected_main_category,
        ass.asset_id AS connected_asset_id,
        ass.stock_id AS connected_stock_id,
        m.created_at
      FROM ${schema}.asset_mapping m
      JOIN ${schema}.asset_relation_type_table t ON m.relation_type = t.code
      LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.target_id
      LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      WHERE m.asset_stocks_unique_id = $1
        AND m.target_type IN ('ASSET', 'SOFTWARE')
        AND m.is_active = 1
        AND m.is_deleted = 0

      UNION ALL

      SELECT 
        m.mapping_id,
        m.target_id AS source_serial_id,
        m.asset_stocks_unique_id AS connected_serial_id,
        m.relation_type,
        CASE 
          WHEN m.relation_type = 'REL-010' THEN
            CASE WHEN LOWER(TRIM(sc.sub_category_name)) LIKE '%cloud%' OR LOWER(TRIM(sc.sub_category_name)) LIKE '%virtual%' OR LOWER(TRIM(sc.sub_category_name)) LIKE '%vm%' THEN 'HOSTS' ELSE 'HOSTED_ON' END
          WHEN m.relation_type = 'REL-006' THEN
            CASE WHEN LOWER(TRIM(mc.main_category_name)) = 'software' THEN 'HAS_INSTALLED_SOFTWARE' ELSE 'INSTALLED_ON' END
          ELSE t.reverse_label
        END AS relationship_label,
        t.category AS category_pill,
        'INCOMING' AS direction,
        m.source,
        m.last_seen_at,
        m.assigned_from_date,
        m.description,
        m.metadata,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Asset #' || m.asset_stocks_unique_id::text) AS connected_asset_name,
        COALESCE(NULLIF(ass.stock_serials, ''), ass.system_code, '') AS connected_serial_number,
        ass.system_code AS connected_system_code,
        COALESCE(sc.sub_category_name, '') AS connected_sub_category,
        COALESCE(mc.main_category_name, '') AS connected_main_category,
        ass.asset_id AS connected_asset_id,
        ass.stock_id AS connected_stock_id,
        m.created_at
      FROM ${schema}.asset_mapping m
      JOIN ${schema}.asset_relation_type_table t ON m.relation_type = t.code
      LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
      LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      WHERE m.target_id = $1
        AND m.target_type IN ('ASSET', 'SOFTWARE')
        AND m.is_active = 1
        AND m.is_deleted = 0

      ORDER BY created_at DESC;
    `;
        const rows = await this.dataSource.query(query, [serialId]);
        return rows.map((r) => ({
            mapping_id: Number(r.mapping_id),
            source_serial_id: Number(r.source_serial_id),
            connected_serial_id: Number(r.connected_serial_id),
            connected_asset_id: r.connected_asset_id ? Number(r.connected_asset_id) : null,
            connected_stock_id: r.connected_stock_id ? Number(r.connected_stock_id) : null,
            relation_type: r.relation_type,
            relationship_label: r.relationship_label,
            category_pill: r.category_pill,
            direction: r.direction,
            source: r.source || 'manual',
            last_seen_at: r.last_seen_at,
            assigned_from_date: r.assigned_from_date,
            description: r.description,
            metadata: r.metadata,
            connected_asset_name: r.connected_asset_name,
            connected_serial_number: r.connected_serial_number || r.connected_system_code || '',
            connected_system_code: r.connected_system_code,
            connected_sub_category: r.connected_sub_category,
            connected_main_category: r.connected_main_category,
            created_at: r.created_at,
        }));
    }
    async getRelationshipTabSummary(serialId, schema) {
        if (!serialId || isNaN(Number(serialId))) {
            throw new common_1.BadRequestException('Invalid serial ID provided.');
        }
        const assetRows = await this.dataSource.query(`
      SELECT 
        ass.asset_stocks_unique_id,
        ass.asset_id,
        COALESCE(ass.asset_item_id, a.asset_item_id) AS item_id,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Asset #' || ass.asset_stocks_unique_id::text) AS asset_name,
        a.asset_main_category_id AS main_category_id,
        COALESCE(mc.main_category_name, '') AS main_category_name,
        a.asset_sub_category_id AS sub_category_id,
        COALESCE(sc.sub_category_name, '') AS sub_category_name,
        ass.current_status_id,
        ass.working_status_type_id
      FROM ${schema}.asset_stock_serials ass
      JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
      WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0
      LIMIT 1;
      `, [serialId]);
        if (!assetRows || assetRows.length === 0) {
            throw new common_1.BadRequestException(`Asset #${serialId} not found or is deleted.`);
        }
        const asset = assetRows[0];
        const assetItemId = asset.item_id ? Number(asset.item_id) : null;
        const isAssetScrapped = Number(asset.current_status_id) === 3 ||
            [12, 13, 14].includes(Number(asset.working_status_type_id));
        const activeCounts = await this.dataSource.query(`
      SELECT 
        t.category,
        COUNT(m.mapping_id)::int AS count,
        ARRAY_AGG(DISTINCT t.code) AS relation_types
      FROM ${schema}.asset_mapping m
      JOIN ${schema}.asset_relation_type_table t ON m.relation_type = t.code
      WHERE (m.asset_stocks_unique_id = $1 OR (m.target_id = $1 AND m.target_type IN ('ASSET', 'SOFTWARE')))
        AND m.target_type IN ('ASSET', 'SOFTWARE')
        AND t.category != 'OPERATIONAL'
        AND m.is_active = 1
        AND m.is_deleted = 0
      GROUP BY t.category;
      `, [serialId]);
        const activeCountsMap = new Map();
        let totalCount = 0;
        for (const row of activeCounts) {
            const c = Number(row.count);
            totalCount += c;
            activeCountsMap.set(row.category, {
                count: c,
                relation_types: row.relation_types || [],
            });
        }
        const governanceRules = await this.dataSource.query(`
      SELECT 
        g.governance_id,
        g.rule_name,
        g.relation_type,
        g.is_allowed,
        g.source_main_category_id,
        g.source_sub_category_id,
        g.source_item_id,
        g.target_main_category_id,
        g.target_sub_category_id,
        g.target_item_id,
        t.category,
        t.forward_label,
        t.reverse_label,
        (
          (CASE WHEN (g.target_item_id = $3 OR g.source_item_id = $3) THEN 8 ELSE 0 END) +
          (CASE WHEN (g.target_sub_category_id = $2 OR g.source_sub_category_id = $2) THEN 4 ELSE 0 END) +
          (CASE WHEN (g.target_main_category_id = $1 OR g.source_main_category_id = $1) THEN 2 ELSE 0 END)
        ) AS specificity_score
      FROM ${schema}.asset_relationship_governance g
      JOIN ${schema}.asset_relation_type_table t ON g.relation_type = t.code
      WHERE g.is_active = true
        AND (
          (
            g.target_entity_type IN ('ASSET', 'SOFTWARE')
            AND (g.target_main_category_id IS NULL OR g.target_main_category_id = $1)
            AND (g.target_sub_category_id IS NULL OR g.target_sub_category_id = $2)
            AND (g.target_item_id IS NULL OR g.target_item_id = $3)
          )
          OR
          (
            (g.source_main_category_id IS NULL OR g.source_main_category_id = $1)
            AND (g.source_sub_category_id IS NULL OR g.source_sub_category_id = $2)
            AND (g.source_item_id IS NULL OR g.source_item_id = $3)
          )
        )
      ORDER BY specificity_score DESC, g.is_allowed ASC;
      `, [asset.main_category_id, asset.sub_category_id, assetItemId]);
        const relGroupMap = new Map();
        for (const r of governanceRules) {
            if (!relGroupMap.has(r.relation_type)) {
                relGroupMap.set(r.relation_type, []);
            }
            relGroupMap.get(r.relation_type).push(r);
        }
        const resolvedRelationRules = new Map();
        for (const [relType, relRules] of relGroupMap.entries()) {
            const allowRules = relRules.filter((r) => r.is_allowed === true);
            if (allowRules.length === 0)
                continue;
            let isBlanketBlocked = false;
            for (const dr of relRules.filter((r) => r.is_allowed === false)) {
                const isCurrentSource = (dr.source_item_id != null && Number(dr.source_item_id) === Number(assetItemId)) ||
                    (dr.source_sub_category_id != null && Number(dr.source_sub_category_id) === Number(asset.sub_category_id)) ||
                    (dr.source_main_category_id != null && Number(dr.source_main_category_id) === Number(asset.main_category_id));
                const candidateItemId = isCurrentSource ? dr.target_item_id : dr.source_item_id;
                const isTargetSpecific = candidateItemId != null;
                if (!isTargetSpecific) {
                    const highestAllowScore = Math.max(...allowRules.map((ar) => Number(ar.specificity_score || 0)));
                    if (Number(dr.specificity_score || 0) >= highestAllowScore) {
                        isBlanketBlocked = true;
                        break;
                    }
                }
            }
            if (!isBlanketBlocked) {
                const bestAllow = allowRules.sort((a, b) => Number(b.specificity_score || 0) - Number(a.specificity_score || 0))[0];
                resolvedRelationRules.set(relType, bestAllow);
            }
        }
        const eligibleCategoryMap = new Map();
        for (const [, rule] of resolvedRelationRules.entries()) {
            if (rule.is_allowed === true && rule.category !== 'OPERATIONAL') {
                if (!eligibleCategoryMap.has(rule.category)) {
                    eligibleCategoryMap.set(rule.category, new Set());
                }
                eligibleCategoryMap.get(rule.category).add(rule.relation_type);
            }
        }
        const isSoftwareAsset = asset.main_category_name?.toLowerCase()?.trim() === 'software' ||
            asset.sub_category_name?.toLowerCase()?.includes('subscription') ||
            asset.sub_category_name?.toLowerCase()?.includes('perpetual');
        const subCatLower = (asset.sub_category_name || '').toLowerCase();
        const isVirtualAsset = subCatLower.includes('virtual') ||
            subCatLower.includes('vm') ||
            subCatLower.includes('cloud') ||
            subCatLower.includes('instance') ||
            subCatLower.includes('container');
        const isComponentAsset = subCatLower.includes('component') ||
            subCatLower.includes('part') ||
            subCatLower.includes('ram') ||
            subCatLower.includes('memory') ||
            subCatLower.includes('storage') ||
            subCatLower.includes('drive') ||
            subCatLower.includes('gpu') ||
            subCatLower.includes('cpu') ||
            subCatLower.includes('motherboard');
        const isPeripheralAsset = subCatLower.includes('peripheral') ||
            subCatLower.includes('accessory') ||
            subCatLower.includes('mouse') ||
            subCatLower.includes('keyboard') ||
            subCatLower.includes('monitor') ||
            subCatLower.includes('printer') ||
            subCatLower.includes('scanner');
        const CATEGORY_DISPLAY = {
            SOFTWARE: isSoftwareAsset ? 'Host Device' : 'Installed Software',
            STRUCTURAL: isComponentAsset ? 'Parent Device' : 'Components & Parts',
            INFRASTRUCTURE: isVirtualAsset ? 'Host Server' : 'Hosted VMs',
            PHYSICAL: isPeripheralAsset ? 'Connected Host' : 'Peripherals',
            OPERATIONAL: 'Operational',
        };
        const allCategories = new Set([
            ...Array.from(eligibleCategoryMap.keys()),
            ...Array.from(activeCountsMap.keys()),
        ]);
        allCategories.delete('OPERATIONAL');
        const available_tabs = Array.from(allCategories).map((cat) => {
            const activeData = activeCountsMap.get(cat);
            const eligibleCodes = eligibleCategoryMap.get(cat);
            const relCodes = Array.from(new Set([
                ...(activeData?.relation_types || []),
                ...(eligibleCodes ? Array.from(eligibleCodes) : []),
            ]));
            return {
                tab_key: cat,
                tab_label: CATEGORY_DISPLAY[cat] || cat,
                relation_types: relCodes,
                count: activeData ? activeData.count : 0,
                can_link: !isAssetScrapped && Boolean(eligibleCodes && eligibleCodes.size > 0),
            };
        });
        const available_relations = [];
        if (!isAssetScrapped) {
            for (const [relCode, rule] of resolvedRelationRules.entries()) {
                if (rule.is_allowed === true && rule.category !== 'OPERATIONAL') {
                    let label = rule.forward_label || relCode;
                    let targetType = 'Compatible Asset';
                    let description = `Link asset under ${relCode}`;
                    if (relCode === 'REL-006') {
                        if (isSoftwareAsset) {
                            label = 'INSTALLED_ON (Host Device)';
                            targetType = 'Host Computer / Server';
                            description = 'Link this software asset to a host computer or physical machine';
                        }
                        else {
                            label = 'HAS_INSTALLED_SOFTWARE (Software)';
                            targetType = 'Software License / Package';
                            description = 'Install or link software applications and licenses to this host';
                        }
                    }
                    else if (relCode === 'REL-010') {
                        if (isVirtualAsset) {
                            label = 'HOSTED_ON (Host Server)';
                            targetType = 'Host Server / Hypervisor';
                            description = 'Link this virtual machine to its host server';
                        }
                        else {
                            label = 'HOSTS (Virtual Machine)';
                            targetType = 'Virtual Machine / Container';
                            description = 'Link hosted virtual machines or container instances';
                        }
                    }
                    else if (relCode === 'REL-001' || relCode === 'REL-002') {
                        if (isComponentAsset) {
                            label = 'COMPONENT_OF (Parent Device)';
                            targetType = 'Parent Computer / Chassis';
                            description = 'Link this component into its parent machine';
                        }
                        else {
                            label = 'CONTAINS_COMPONENT (Part)';
                            targetType = 'Component / Hardware Part';
                            description = 'Attach component parts to this asset';
                        }
                    }
                    available_relations.push({
                        code: relCode,
                        label,
                        category: rule.category,
                        targetType,
                        description,
                    });
                }
            }
        }
        const mainCatLower = (asset.main_category_name || '').toLowerCase().trim();
        const isNonITCategory = mainCatLower === 'non it' ||
            mainCatLower === 'non-it' ||
            mainCatLower.startsWith('non it') ||
            mainCatLower.startsWith('non-it') ||
            mainCatLower.includes('furniture') ||
            mainCatLower.includes('facility') ||
            mainCatLower.includes('facilities') ||
            mainCatLower.includes('vehicle');
        const hasExplicitItemAllowRule = Array.from(resolvedRelationRules.values()).some((r) => r.is_allowed === true &&
            (r.source_item_id ||
                r.target_item_id ||
                r.source_sub_category_id ||
                r.target_sub_category_id));
        const effectiveTabs = isNonITCategory && !hasExplicitItemAllowRule && totalCount === 0 ? [] : available_tabs;
        const effectiveRelations = isNonITCategory && !hasExplicitItemAllowRule && totalCount === 0 ? [] : available_relations;
        const supports_relationships = !isAssetScrapped &&
            (!isNonITCategory || hasExplicitItemAllowRule || totalCount > 0) &&
            (effectiveTabs.length > 0 || totalCount > 0 || effectiveRelations.length > 0);
        return {
            asset_id: Number(asset.asset_id),
            asset_stocks_unique_id: Number(asset.asset_stocks_unique_id),
            asset_name: asset.asset_name,
            main_category_id: Number(asset.main_category_id),
            main_category_name: asset.main_category_name,
            sub_category_id: Number(asset.sub_category_id),
            sub_category_name: asset.sub_category_name,
            total_relationships: totalCount,
            is_scrapped: isAssetScrapped,
            supports_relationships,
            available_tabs: effectiveTabs,
            available_relations: effectiveRelations,
        };
    }
    async getEligibleTargetAssets(queryDto, schema) {
        const { source_serial_id, relation_type, search, limit = 20, page = 1 } = queryDto;
        const offset = (Math.max(1, page) - 1) * limit;
        const sourceMeta = await this.getAssetHierarchyBySerialId(source_serial_id, schema);
        const govRules = await this.dataSource.query(`
      SELECT 
        governance_id,
        source_main_category_id,
        source_sub_category_id,
        source_item_id,
        target_main_category_id,
        target_sub_category_id,
        target_item_id,
        target_entity_type,
        is_allowed
      FROM ${schema}.asset_relationship_governance
      WHERE is_active = true
        AND relation_type = $1
        AND (
          -- Current asset matches SOURCE (e.g. Software looking for Hardware target)
          (
            (source_main_category_id IS NULL OR source_main_category_id = $2)
            AND (source_sub_category_id IS NULL OR source_sub_category_id = $3)
            AND (source_item_id IS NULL OR source_item_id = $4)
          )
          OR
          -- Current asset matches TARGET (e.g. Hardware looking for Software candidates to install)
          (
            target_entity_type IN ('ASSET', 'SOFTWARE')
            AND (target_main_category_id IS NULL OR target_main_category_id = $2)
            AND (target_sub_category_id IS NULL OR target_sub_category_id = $3)
            AND (target_item_id IS NULL OR target_item_id = $4)
          )
        );
      `, [
            relation_type,
            sourceMeta.main_category_id,
            sourceMeta.sub_category_id,
            sourceMeta.item_id,
        ]);
        const allowRules = govRules.filter((r) => r.is_allowed === true);
        const denyRules = govRules.filter((r) => r.is_allowed === false);
        if (allowRules.length === 0) {
            return { items: [], total: 0, limit, page };
        }
        const allowClauses = [];
        const queryParams = [source_serial_id, relation_type];
        for (const ar of allowRules) {
            const isCurrentSource = (ar.source_main_category_id == null || Number(ar.source_main_category_id) === Number(sourceMeta.main_category_id)) &&
                (ar.source_sub_category_id == null || Number(ar.source_sub_category_id) === Number(sourceMeta.sub_category_id)) &&
                (ar.source_item_id == null || Number(ar.source_item_id) === Number(sourceMeta.item_id));
            const candidateMainCat = isCurrentSource ? ar.target_main_category_id : ar.source_main_category_id;
            const candidateSubCat = isCurrentSource ? ar.target_sub_category_id : ar.source_sub_category_id;
            const candidateItemId = isCurrentSource ? ar.target_item_id : ar.source_item_id;
            const parts = [];
            if (candidateMainCat != null) {
                queryParams.push(candidateMainCat);
                parts.push(`a.asset_main_category_id = $${queryParams.length}`);
            }
            if (candidateSubCat != null) {
                queryParams.push(candidateSubCat);
                parts.push(`a.asset_sub_category_id = $${queryParams.length}`);
            }
            if (candidateItemId != null) {
                queryParams.push(candidateItemId);
                parts.push(`COALESCE(ass.asset_item_id, a.asset_item_id) = $${queryParams.length}`);
            }
            if (parts.length > 0) {
                allowClauses.push(`(${parts.join(' AND ')})`);
            }
            else {
                allowClauses.push(`(TRUE)`);
            }
        }
        const denyClauses = [];
        for (const dr of denyRules) {
            const isCurrentSource = (dr.source_main_category_id == null || Number(dr.source_main_category_id) === Number(sourceMeta.main_category_id)) &&
                (dr.source_sub_category_id == null || Number(dr.source_sub_category_id) === Number(sourceMeta.sub_category_id)) &&
                (dr.source_item_id == null || Number(dr.source_item_id) === Number(sourceMeta.item_id));
            const candidateMainCat = isCurrentSource ? dr.target_main_category_id : dr.source_main_category_id;
            const candidateSubCat = isCurrentSource ? dr.target_sub_category_id : dr.source_sub_category_id;
            const candidateItemId = isCurrentSource ? dr.target_item_id : dr.source_item_id;
            const parts = [];
            if (candidateMainCat != null) {
                queryParams.push(candidateMainCat);
                parts.push(`a.asset_main_category_id = $${queryParams.length}`);
            }
            if (candidateSubCat != null) {
                queryParams.push(candidateSubCat);
                parts.push(`a.asset_sub_category_id = $${queryParams.length}`);
            }
            if (candidateItemId != null) {
                queryParams.push(candidateItemId);
                parts.push(`COALESCE(ass.asset_item_id, a.asset_item_id) = $${queryParams.length}`);
            }
            if (parts.length > 0) {
                denyClauses.push(`(${parts.join(' AND ')})`);
            }
        }
        let searchClause = '';
        if (search && search.trim()) {
            queryParams.push(`%${search.trim()}%`);
            const sIdx = queryParams.length;
            searchClause = `
        AND (
          ass.stock_serials ILIKE $${sIdx}
          OR ass.system_code ILIKE $${sIdx}
          OR ass.asset_serial_title ILIKE $${sIdx}
          OR a.asset_title ILIKE $${sIdx}
        )
      `;
        }
        const whereAllowed = allowClauses.length > 0 ? `AND (${allowClauses.join(' OR ')})` : '';
        const whereNotDenied = denyClauses.length > 0 ? `AND NOT (${denyClauses.join(' OR ')})` : '';
        let singleHostClause = '';
        if (relation_type === 'REL-010') {
            singleHostClause = `
        AND ass.asset_stocks_unique_id NOT IN (
          SELECT m.target_id 
          FROM ${schema}.asset_mapping m
          WHERE m.relation_type = 'REL-010'
            AND m.target_type = 'ASSET'
            AND m.is_active = 1 
            AND m.is_deleted = 0
            AND m.target_id IS NOT NULL
        )
      `;
        }
        let singleHostSoftwareClause = '';
        if (relation_type === 'REL-006') {
            singleHostSoftwareClause = `
        AND NOT (
          LOWER(TRIM(mc.main_category_name)) = 'software'
          AND (
            ass.current_status_id <> 1
            OR ass.asset_stocks_unique_id IN (
              SELECT m.target_id 
              FROM ${schema}.asset_mapping m
              WHERE m.relation_type = 'REL-006'
                AND m.is_active = 1
                AND m.is_deleted = 0
                AND m.target_id IS NOT NULL
              UNION
              SELECT m.asset_stocks_unique_id 
              FROM ${schema}.asset_mapping m
              JOIN ${schema}.asset_stock_serials ass_map ON ass_map.asset_stocks_unique_id = m.asset_stocks_unique_id
              JOIN ${schema}.assets a_map ON a_map.asset_id = ass_map.asset_id
              JOIN ${schema}.asset_main_category mc_map ON mc_map.main_category_id = a_map.asset_main_category_id
              WHERE m.relation_type = 'REL-006'
                AND m.is_active = 1
                AND m.is_deleted = 0
                AND LOWER(TRIM(mc_map.main_category_name)) = 'software'
            )
          )
        )
      `;
        }
        const baseWhere = `
      WHERE ass.is_deleted = 0
        AND ass.current_status_id <> 3
        AND (ass.working_status_type_id IS NULL OR ass.working_status_type_id NOT IN (12, 13, 14))
        AND ass.asset_stocks_unique_id <> $1
        AND ass.asset_stocks_unique_id NOT IN (
          SELECT target_id 
          FROM ${schema}.asset_mapping 
          WHERE asset_stocks_unique_id = $1 
            AND relation_type = $2 
            AND is_active = 1 
            AND is_deleted = 0
            AND target_id IS NOT NULL
        )
        ${singleHostClause}
        ${singleHostSoftwareClause}
        ${whereAllowed}
        ${whereNotDenied}
        ${searchClause}
    `;
        const countResult = await this.dataSource.query(`
      SELECT COUNT(ass.asset_stocks_unique_id)::int AS total
      FROM ${schema}.asset_stock_serials ass
      JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      ${baseWhere};
      `, queryParams);
        const total = Number(countResult[0]?.total || 0);
        queryParams.push(limit);
        const limitIdx = queryParams.length;
        queryParams.push(offset);
        const offsetIdx = queryParams.length;
        const rows = await this.dataSource.query(`
      SELECT 
        ass.asset_stocks_unique_id,
        ass.asset_id,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Asset #' || ass.asset_stocks_unique_id::text) AS asset_name,
        COALESCE(ass.stock_serials, ass.system_code, '') AS serial_number,
        ass.system_code,
        a.asset_main_category_id AS main_category_id,
        COALESCE(mc.main_category_name, '') AS main_category_name,
        a.asset_sub_category_id AS sub_category_id,
        COALESCE(sc.sub_category_name, '') AS sub_category_name,
        ass.current_status_id AS status_id
      FROM ${schema}.asset_stock_serials ass
      JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
      ${baseWhere}
      ORDER BY ass.asset_stocks_unique_id DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx};
      `, queryParams);
        return {
            items: rows.map((r) => ({
                asset_stocks_unique_id: Number(r.asset_stocks_unique_id),
                asset_id: Number(r.asset_id),
                asset_name: r.asset_name,
                serial_number: r.serial_number,
                system_code: r.system_code,
                main_category_id: Number(r.main_category_id),
                main_category_name: r.main_category_name,
                sub_category_id: Number(r.sub_category_id),
                sub_category_name: r.sub_category_name,
                status_id: r.status_id,
            })),
            total,
            limit,
            page,
        };
    }
    async unlinkTechnicalRelationship(mappingId, userId, schema) {
        if (!mappingId || isNaN(Number(mappingId))) {
            throw new common_1.BadRequestException('Invalid mapping ID provided.');
        }
        const existing = await this.dataSource.query(`
      SELECT mapping_id, asset_stocks_unique_id, target_id, relation_type, target_type
      FROM ${schema}.asset_mapping
      WHERE mapping_id = $1
        AND target_type IN ('ASSET', 'SOFTWARE')
        AND is_active = 1
        AND is_deleted = 0
      LIMIT 1;
      `, [mappingId]);
        if (!existing || existing.length === 0) {
            throw new common_1.BadRequestException(`Technical relationship #${mappingId} not found or is already inactive.`);
        }
        const row = existing[0];
        await this.dataSource.query(`
      UPDATE ${schema}.asset_mapping
      SET is_active = 0,
          is_deleted = 1,
          returned_by = $1,
          assigned_to_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP
      WHERE mapping_id = $2;
      `, [userId, mappingId]);
        if (row.relation_type === 'REL-006') {
            const sourceSerialId = Number(row.asset_stocks_unique_id);
            const targetSerialId = Number(row.target_id);
            const swSerialCheck = await this.dataSource.query(`
        SELECT ass.asset_stocks_unique_id
        FROM ${schema}.asset_stock_serials ass
        JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
        LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
        WHERE ass.asset_stocks_unique_id IN ($1, $2)
          AND (
            LOWER(TRIM(mc.main_category_name)) LIKE '%software%'
            OR LOWER(TRIM(sc.sub_category_name)) LIKE '%software%'
          )
        LIMIT 1;
        `, [sourceSerialId, targetSerialId]);
            const swSerialId = swSerialCheck?.[0]?.asset_stocks_unique_id
                ? Number(swSerialCheck[0].asset_stocks_unique_id)
                : (row.target_type === 'SOFTWARE' ? targetSerialId : null);
            if (swSerialId) {
                await this.dataSource.query(`
          UPDATE ${schema}.asset_mapping
          SET is_active = 0,
              is_deleted = 1,
              returned_by = $1,
              assigned_to_date = CURRENT_DATE,
              updated_at = CURRENT_TIMESTAMP
          WHERE asset_stocks_unique_id = $2
            AND is_inherited = 1
            AND (inherited_via_relationship_id = $3 OR inherited_via_relationship_id IS NULL);
          `, [userId, swSerialId, mappingId]);
                const remainingActive = await this.dataSource.query(`
          SELECT 1 FROM ${schema}.asset_mapping
          WHERE (asset_stocks_unique_id = $1 OR target_id = $1)
            AND is_active = 1
            AND is_deleted = 0
          LIMIT 1;
          `, [swSerialId]);
                if (!remainingActive || remainingActive.length === 0) {
                    await this.dataSource.query(`
            UPDATE ${schema}.asset_stock_serials
            SET current_status_id = 1,
                working_status_type_id = 20,
                updated_by = $2
            WHERE asset_stocks_unique_id = $1;
            `, [swSerialId, userId]);
                }
            }
        }
        if (row.relation_type === 'REL-010') {
            const sourceSerialId = Number(row.asset_stocks_unique_id);
            const targetSerialId = Number(row.target_id);
            const vmSerialCheck = await this.dataSource.query(`
        SELECT ass.asset_stocks_unique_id
        FROM ${schema}.asset_stock_serials ass
        JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
        LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
        LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
        WHERE ass.asset_stocks_unique_id IN ($1, $2)
          AND (
            a.asset_sub_category_id = 7
            OR LOWER(TRIM(sc.sub_category_name)) LIKE '%cloud%'
            OR LOWER(TRIM(COALESCE(ai.item_type, ''))) = 'virtual'
          )
        LIMIT 1;
        `, [sourceSerialId, targetSerialId]);
            const vmSerialId = vmSerialCheck?.[0]?.asset_stocks_unique_id
                ? Number(vmSerialCheck[0].asset_stocks_unique_id)
                : sourceSerialId;
            const hostServerSerialId = vmSerialId === targetSerialId ? sourceSerialId : targetSerialId;
            const remainingHost = await this.dataSource.query(`
        SELECT 1 FROM ${schema}.asset_mapping
        WHERE (asset_stocks_unique_id = $1 OR target_id = $1)
          AND relation_type = 'REL-010'
          AND is_active = 1
          AND is_deleted = 0
          AND mapping_id <> $2
        LIMIT 1;
        `, [vmSerialId, mappingId]);
            if (!remainingHost || remainingHost.length === 0) {
                const activeCustody = await this.dataSource.query(`
          SELECT 1 FROM ${schema}.asset_mapping
          WHERE asset_stocks_unique_id = $1
            AND is_active = 1
            AND is_deleted = 0
            AND target_type IN ('USER', 'DEPARTMENT', 'PROJECT')
          LIMIT 1;
          `, [vmSerialId]);
                const hasDirectCustody = activeCustody && activeCustody.length > 0;
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET current_status_id = $1,
              working_status_type_id = $2,
              location_id = NULL,
              impact_status = 'NONE',
              impacted_by_serial_id = NULL,
              impact_reason = NULL,
              updated_by = $3
          WHERE asset_stocks_unique_id = $4;
          `, [
                    hasDirectCustody ? 7 : 1,
                    hasDirectCustody ? 5 : 20,
                    userId,
                    vmSerialId,
                ]);
            }
            else {
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET impact_status = 'NONE',
              impacted_by_serial_id = NULL,
              impact_reason = NULL,
              updated_by = $1
          WHERE asset_stocks_unique_id = $2
            AND impacted_by_serial_id = $3;
          `, [userId, vmSerialId, hostServerSerialId]);
            }
        }
        if (row.relation_type === 'REL-007') {
            const sourceSerialId = Number(row.asset_stocks_unique_id);
            const targetSerialId = Number(row.target_id);
            const pSerialCheck = await this.dataSource.query(`
        SELECT ass.asset_stocks_unique_id
        FROM ${schema}.asset_stock_serials ass
        JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
        LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = a.asset_sub_category_id
        LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
        WHERE ass.asset_stocks_unique_id IN ($1, $2)
          AND (
            a.asset_sub_category_id IN (13, 14)
            OR LOWER(TRIM(sc.sub_category_name)) LIKE '%peripheral%'
            OR ai.asset_item_id IN (8, 9, 11, 12)
            OR LOWER(TRIM(COALESCE(ass.asset_serial_title, a.asset_title, ''))) LIKE '%monitor%'
            OR LOWER(TRIM(COALESCE(ass.asset_serial_title, a.asset_title, ''))) LIKE '%dock%'
          )
        LIMIT 1;
        `, [sourceSerialId, targetSerialId]);
            const peripheralSerialId = pSerialCheck?.[0]?.asset_stocks_unique_id
                ? Number(pSerialCheck[0].asset_stocks_unique_id)
                : sourceSerialId;
            await this.dataSource.query(`
        UPDATE ${schema}.asset_mapping
        SET is_active = 0,
            is_deleted = 1,
            returned_by = $1,
            assigned_to_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
        WHERE asset_stocks_unique_id = $2
          AND is_inherited = 1
          AND is_active = 1;
        `, [userId, peripheralSerialId]);
            const remainingHost = await this.dataSource.query(`
        SELECT 1 FROM ${schema}.asset_mapping
        WHERE (asset_stocks_unique_id = $1 OR target_id = $1)
          AND relation_type = 'REL-007'
          AND is_active = 1
          AND is_deleted = 0
          AND mapping_id <> $2
        LIMIT 1;
        `, [peripheralSerialId, mappingId]);
            if (!remainingHost || remainingHost.length === 0) {
                const directCustody = await this.dataSource.query(`
          SELECT 1 FROM ${schema}.asset_mapping
          WHERE asset_stocks_unique_id = $1
            AND is_active = 1
            AND is_deleted = 0
            AND is_inherited = 0
            AND target_type IN ('USER', 'DEPARTMENT', 'PROJECT')
          LIMIT 1;
          `, [peripheralSerialId]);
                const hasDirectCustody = directCustody && directCustody.length > 0;
                await this.dataSource.query(`
          UPDATE ${schema}.asset_stock_serials
          SET current_status_id = $1,
              working_status_type_id = $2,
              impact_status = 'NONE',
              impacted_by_serial_id = NULL,
              impact_reason = NULL,
              updated_by = $3
          WHERE asset_stocks_unique_id = $4;
          `, [
                    hasDirectCustody ? 7 : 1,
                    hasDirectCustody ? 5 : 20,
                    userId,
                    peripheralSerialId,
                ]);
            }
        }
        try {
            const sourceSerialId = Number(row.asset_stocks_unique_id);
            const targetSerialId = Number(row.target_id);
            const [sourceMeta, targetMeta, relMeta] = await Promise.all([
                this.getAssetHierarchyBySerialId(sourceSerialId, schema).catch(() => null),
                this.getAssetHierarchyBySerialId(targetSerialId, schema).catch(() => null),
                this.dataSource.query(`SELECT forward_label, reverse_label, category FROM ${schema}.asset_relation_type_table WHERE code = $1 LIMIT 1;`, [row.relation_type]).catch(() => []),
            ]);
            const forwardLabel = relMeta?.[0]?.forward_label || row.relation_type;
            const reverseLabel = relMeta?.[0]?.reverse_label || row.relation_type;
            const relCategory = relMeta?.[0]?.category || 'SOFTWARE';
            const sourceUnlinkEvent = {
                action: 'UNLINK',
                is_technical_relationship: true,
                relation_type: row.relation_type,
                relation_category: relCategory,
                relation_label: forwardLabel,
                connected_serial_id: targetSerialId,
                connected_asset_name: targetMeta?.asset_name || `Asset #${targetSerialId}`,
                direction: 'FORWARD',
            };
            const targetUnlinkEvent = {
                action: 'UNLINK',
                is_technical_relationship: true,
                relation_type: row.relation_type,
                relation_category: relCategory,
                relation_label: reverseLabel,
                connected_serial_id: sourceSerialId,
                connected_asset_name: sourceMeta?.asset_name || `Asset #${sourceSerialId}`,
                direction: 'REVERSE',
            };
            const eventRunner = this.dataSource.createQueryRunner();
            await eventRunner.connect();
            try {
                await eventRunner.query(`SET search_path TO "${schema}", public;`);
                const sourceEvent = eventRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: sourceMeta?.asset_id || null,
                    asset_stocks_unique_id: sourceSerialId,
                    title: 'Technical Relationship Unlinked',
                    description: `Unlinked relationship: ${forwardLabel} -> ${targetMeta?.asset_name || `Asset #${targetSerialId}`}`,
                    reference_table: 'asset_mapping',
                    reference_id: Number(row.mapping_id),
                    metadata: sourceUnlinkEvent,
                    performed_by: userId,
                    performed_at: new Date(),
                    created_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                });
                const targetEvent = eventRunner.manager.create(asset_events_entity_1.AssetEvent, {
                    asset_id: targetMeta?.asset_id || null,
                    asset_stocks_unique_id: targetSerialId,
                    title: 'Technical Relationship Unlinked',
                    description: `Disconnected from: ${reverseLabel} -> ${sourceMeta?.asset_name || `Asset #${sourceSerialId}`}`,
                    reference_table: 'asset_mapping',
                    reference_id: Number(row.mapping_id),
                    metadata: targetUnlinkEvent,
                    performed_by: userId,
                    performed_at: new Date(),
                    created_at: new Date(),
                    event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                });
                await eventRunner.manager.save(asset_events_entity_1.AssetEvent, [sourceEvent, targetEvent]);
            }
            finally {
                await eventRunner.release();
            }
        }
        catch (evtErr) {
            console.error('Failed to log technical relationship unlinking event:', evtErr);
        }
        this.redisService.delByPattern('software-list:*');
        this.redisService.delByPattern('perpetualSoftwares-list:*');
        await this.refreshStockSummaryNowFromContext(schema);
        return {
            message: 'Technical relationship unlinked successfully.',
            mapping_id: Number(row.mapping_id),
            source_serial_id: Number(row.asset_stocks_unique_id),
            target_serial_id: Number(row.target_id),
            relation_type: row.relation_type,
        };
    }
    async getItemGovernanceRules(itemId, schema) {
        if (!itemId || isNaN(Number(itemId))) {
            throw new common_1.BadRequestException('Invalid item ID provided.');
        }
        const itemRows = await this.dataSource.query(`
      SELECT 
        ai.asset_item_id,
        ai.asset_item_name,
        ai.main_category_id,
        mc.main_category_name,
        ai.sub_category_id,
        sc.sub_category_name,
        ai.item_type,
        ai.asset_type,
        ai.is_active,
        (
          SELECT COUNT(ass.asset_stocks_unique_id)::int 
          FROM ${schema}.asset_stock_serials ass
          WHERE ass.asset_item_id = ai.asset_item_id AND ass.is_deleted = 0 AND ass.is_active = 1
        ) AS asset_count
      FROM ${schema}.asset_items ai
      LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = ai.main_category_id
      LEFT JOIN ${schema}.asset_sub_category sc ON sc.sub_category_id = ai.sub_category_id
      WHERE ai.asset_item_id = $1 AND ai.is_deleted = 0
      LIMIT 1;
      `, [itemId]);
        if (!itemRows || itemRows.length === 0) {
            throw new common_1.BadRequestException(`Item #${itemId} not found.`);
        }
        const item = itemRows[0];
        const rules = await this.dataSource.query(`
      SELECT 
        g.governance_id,
        g.rule_name,
        g.relation_type,
        t.forward_label,
        t.reverse_label,
        t.category AS relation_category,
        t.cardinality,
        -- Source scope
        g.source_main_category_id,
        smc.main_category_name AS source_main_category_name,
        g.source_sub_category_id,
        ssc.sub_category_name AS source_sub_category_name,
        g.source_item_id,
        sai.asset_item_name AS source_item_name,
        -- Target scope
        g.target_entity_type,
        g.target_main_category_id,
        tmc.main_category_name AS target_main_category_name,
        g.target_sub_category_id,
        tsc.sub_category_name AS target_sub_category_name,
        g.target_item_id,
        tai.asset_item_name AS target_item_name,
        -- Policy & audit
        g.is_allowed,
        g.validation_message,
        g.is_active,
        g.created_at,
        CASE 
          WHEN g.source_item_id = $1 THEN 'SOURCE'
          WHEN g.target_item_id = $1 THEN 'TARGET'
          ELSE 'INHERITED'
        END AS rule_role
      FROM ${schema}.asset_relationship_governance g
      LEFT JOIN ${schema}.asset_relation_type_table t ON g.relation_type = t.code
      LEFT JOIN ${schema}.asset_main_category smc ON smc.main_category_id = g.source_main_category_id
      LEFT JOIN ${schema}.asset_sub_category ssc ON ssc.sub_category_id = g.source_sub_category_id
      LEFT JOIN ${schema}.asset_items sai ON sai.asset_item_id = g.source_item_id
      LEFT JOIN ${schema}.asset_main_category tmc ON tmc.main_category_id = g.target_main_category_id
      LEFT JOIN ${schema}.asset_sub_category tsc ON tsc.sub_category_id = g.target_sub_category_id
      LEFT JOIN ${schema}.asset_items tai ON tai.asset_item_id = g.target_item_id
      WHERE g.source_item_id = $1 OR g.target_item_id = $1
      ORDER BY g.governance_id DESC;
      `, [itemId]);
        return {
            item,
            rules,
        };
    }
    async getGovernanceMetadata(schema) {
        const [relationTypes, categories, subCategories, items] = await Promise.all([
            this.dataSource.query(`SELECT code, forward_label, reverse_label, cardinality, is_active, target_type, category 
         FROM ${schema}.asset_relation_type_table 
         WHERE is_active = true 
         ORDER BY code;`),
            this.dataSource.query(`SELECT main_category_id, main_category_name 
         FROM ${schema}.asset_main_category 
         WHERE is_deleted = 0 AND is_active = 1 
         ORDER BY main_category_name;`),
            this.dataSource.query(`SELECT sub_category_id, sub_category_name, main_category_id 
         FROM ${schema}.asset_sub_category 
         WHERE is_deleted = 0 AND is_active = 1 
         ORDER BY sub_category_name;`),
            this.dataSource.query(`SELECT asset_item_id, asset_item_name, main_category_id, sub_category_id 
         FROM ${schema}.asset_items 
         WHERE is_deleted = 0 AND is_active = 1 
         ORDER BY asset_item_name;`),
        ]);
        return {
            relationTypes,
            categories,
            subCategories,
            items,
            targetEntityTypes: ['ASSET', 'SOFTWARE', 'USER', 'DEPARTMENT', 'BRANCH', 'PROJECT'],
        };
    }
    async createGovernanceRule(dto, schema) {
        const relCheck = await this.dataSource.query(`SELECT code FROM ${schema}.asset_relation_type_table WHERE code = $1 AND is_active = true LIMIT 1;`, [dto.relation_type]);
        if (!relCheck || relCheck.length === 0) {
            throw new common_1.BadRequestException(`Relation type '${dto.relation_type}' is not active or not registered in asset_relation_type_table.`);
        }
        const insertSql = `
      INSERT INTO ${schema}.asset_relationship_governance (
        rule_name,
        relation_type,
        source_main_category_id,
        source_sub_category_id,
        source_item_id,
        target_entity_type,
        target_main_category_id,
        target_sub_category_id,
        target_item_id,
        is_allowed,
        validation_message,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
        const res = await this.dataSource.query(insertSql, [
            dto.rule_name,
            dto.relation_type,
            dto.source_main_category_id ?? null,
            dto.source_sub_category_id ?? null,
            dto.source_item_id ?? null,
            dto.target_entity_type,
            dto.target_main_category_id ?? null,
            dto.target_sub_category_id ?? null,
            dto.target_item_id ?? null,
            dto.is_allowed ?? true,
            dto.validation_message ?? null,
            dto.is_active ?? true,
        ]);
        return {
            message: 'Governance rule created successfully.',
            data: res[0],
        };
    }
    async updateGovernanceRule(governanceId, dto, schema) {
        const updateSql = `
      UPDATE ${schema}.asset_relationship_governance SET
        rule_name = COALESCE($2, rule_name),
        relation_type = COALESCE($3, relation_type),
        source_main_category_id = $4,
        source_sub_category_id = $5,
        source_item_id = $6,
        target_entity_type = COALESCE($7, target_entity_type),
        target_main_category_id = $8,
        target_sub_category_id = $9,
        target_item_id = $10,
        is_allowed = COALESCE($11, is_allowed),
        validation_message = COALESCE($12, validation_message),
        is_active = COALESCE($13, is_active)
      WHERE governance_id = $1
      RETURNING *;
    `;
        const res = await this.dataSource.query(updateSql, [
            governanceId,
            dto.rule_name,
            dto.relation_type,
            dto.source_main_category_id ?? null,
            dto.source_sub_category_id ?? null,
            dto.source_item_id ?? null,
            dto.target_entity_type,
            dto.target_main_category_id ?? null,
            dto.target_sub_category_id ?? null,
            dto.target_item_id ?? null,
            dto.is_allowed,
            dto.validation_message,
            dto.is_active,
        ]);
        if (!res || res.length === 0) {
            throw new common_1.BadRequestException(`Governance rule #${governanceId} not found.`);
        }
        return {
            message: 'Governance rule updated successfully.',
            data: res[0],
        };
    }
    async deleteGovernanceRule(governanceId, schema) {
        const res = await this.dataSource.query(`DELETE FROM ${schema}.asset_relationship_governance WHERE governance_id = $1 RETURNING governance_id;`, [governanceId]);
        if (!res || res.length === 0) {
            throw new common_1.BadRequestException(`Governance rule #${governanceId} not found.`);
        }
        return {
            message: 'Governance rule deleted successfully.',
            governance_id: governanceId,
        };
    }
    async toggleGovernanceRuleStatus(governanceId, schema) {
        const res = await this.dataSource.query(`UPDATE ${schema}.asset_relationship_governance 
       SET is_active = NOT is_active 
       WHERE governance_id = $1 
       RETURNING governance_id, is_active;`, [governanceId]);
        if (!res || res.length === 0) {
            throw new common_1.BadRequestException(`Governance rule #${governanceId} not found.`);
        }
        return {
            message: `Governance rule #${governanceId} status toggled to ${res[0].is_active ? 'active' : 'inactive'}.`,
            data: res[0],
        };
    }
};
exports.AssetMappingService = AssetMappingService;
exports.AssetMappingService = AssetMappingService = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(7, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(8, (0, typeorm_1.InjectRepository)(stocks_entity_1.Stock)),
    __param(9, (0, typeorm_1.InjectRepository)(asset_item_entity_1.AssetItem)),
    __param(10, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(11, (0, typeorm_1.InjectRepository)(asset_transfer_history_entity_1.AssetTransferHistory)),
    __param(12, (0, typeorm_1.InjectRepository)(asset_assignment_log_entity_1.AssetAssignmentEvent)),
    __param(13, (0, typeorm_1.InjectRepository)(asset_procurements_entity_1.AssetProcurement)),
    __param(14, (0, typeorm_1.InjectRepository)(asset_procurement_items_entity_1.AssetProcurementItem)),
    __param(15, (0, typeorm_1.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        entity_lookup_service_1.EntityLookupService,
        notifications_helper_1.NotificationHelper,
        redis_service_1.RedisService,
        request_context_service_1.RequestContextService,
        stock_summary_refresh_service_1.StockSummaryRefreshService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetMappingService);
