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
exports.StocksController = void 0;
const common_1 = require("@nestjs/common");
const create_stock_dto_1 = require("./dto/create-stock.dto");
const stocks_service_1 = require("./stocks.service");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const asset_mapping_service_1 = require("../../asset-mapping/asset-mapping.service");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const redis_service_1 = require("../../common/redis/redis.service");
const tendant_and_schema_helper_1 = require("../../common/utils/tendant_and_schema.helper");
const ListViewDtoForExcleExport_1 = require("./dto/ListViewDtoForExcleExport");
const update_bill_dto_1 = require("./dto/update-bill.dto");
const stock_summary_refresh_service_1 = require("./stock-summary-refresh.service");
let StocksController = class StocksController {
    constructor(stockService, assetMappingService, redisService, stockSummaryRefresh) {
        this.stockService = stockService;
        this.assetMappingService = assetMappingService;
        this.redisService = redisService;
        this.stockSummaryRefresh = stockSummaryRefresh;
    }
    async createStocks(files, createStockDto, req) {
        try {
            const organizationID = req.cookies.organization_id;
            const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
            const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
            const schema = `org_${organizationSchema}`;
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
            createStockDto.created_by = userId;
            if (files?.length) {
                createStockDto.documents = JSON.stringify(files.map((file) => ({
                    name: file.originalname,
                    path: `/uploads/billing_documents/${file.filename}`,
                    size: file.size,
                    type: file.mimetype,
                    uploadedDate: new Date(),
                })));
            }
            const result = await this.stockService.createStocks(createStockDto, +decrypted_organizationID, schema, req);
            try {
                await this.redisService.incr(`serials_version:${schema}`);
            }
            catch (err) {
                console.error('Failed to update serials cache version:', err);
            }
            return result;
        }
        catch (error) {
            console.error('Error creating stock:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to create stock.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateAssetTitleProjectCostCenter(body, req) {
        const system_user_id = req.cookies.system_user_id;
        const user_id = (0, crypto_utils_1.decrypt)(system_user_id);
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const { asset_stocks_unique_id, title, stockSerial, project_id, cost_center_id, } = body;
        if (!title && !project_id && !cost_center_id && !stockSerial) {
            throw new common_1.HttpException('At least one field (title, project_id, cost_center_id,stockSerial) must be provided', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!asset_stocks_unique_id) {
            throw new common_1.HttpException('asset_stocks_unique_id is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const updatedAsset = await this.stockService.updateAssetDetails({
                asset_stocks_unique_id,
                title,
                stockSerial,
                project_id,
                cost_center_id,
                user_id,
            });
            try {
                const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'])}`;
                await this.redisService.incr(`serials_version:${schema}`);
                await this.redisService.delByPattern('organization-cost-centers:*');
                await this.redisService.delByPattern('organization-projects:*');
            }
            catch (err) {
                console.error('Failed to update cache version / invalidate caches:', err);
            }
            try {
                const orgCookie = req.cookies.organization_id;
                if (orgCookie) {
                    const orgId = Number((0, crypto_utils_1.decrypt)(orgCookie));
                    if (orgId && !isNaN(orgId)) {
                        await this.stockSummaryRefresh.refreshNow(orgId);
                    }
                }
            }
            catch (err) {
                console.error('Failed to refresh stock summary matviews:', err);
            }
            return {
                success: true,
                message: 'Asset updated successfully',
                data: updatedAsset,
            };
        }
        catch (error) {
            console.error('Update failed:', error);
            throw new common_1.HttpException(error.message || 'Update failed', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateSerialOrLicense(serial, license) {
        return this.stockService.validateSerialOrLicense(serial, license);
    }
    async selectionPreflight(body, req) {
        try {
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(req.cookies.system_user_id.toString());
            const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'].toString())}`;
            const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.stockService.selectionPreflight(body, userId, branchIds, schema);
        }
        catch (error) {
            console.error('selection-preflight error:', error);
            return {
                success: false,
                message: error?.message || 'Preflight failed',
            };
        }
    }
    async selectionResolveIds(body, req) {
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(req.cookies.system_user_id.toString());
        const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'].toString())}`;
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        return await this.stockService.resolveSelectionIds(body, userId, branchIds, schema);
    }
    async findAllSerials2(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            console.log('DTO RECEIVED:', JSON.stringify(dto, null, 2));
            const encryptedSchema = req.cookies['x-organization-schema'];
            console.log('schemaName RECEIVED:', encryptedSchema);
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.findAllSerials2(dto, userId, branchIds, schema);
            return result;
        }
        catch (error) {
            console.error('Error in getAllSerials2 controller:', error);
            return {
                success: false,
                message: 'An error occurred while fetching stock serials',
                error: error.message,
            };
        }
    }
    async exportAssetsToExcel(res, dto, req) {
        const system_user_id = req.cookies?.system_user_id;
        if (!system_user_id) {
            return { success: false, message: 'User not authenticated' };
        }
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        const buffer = await this.stockService.exportAssetsToExcel(dto, userId, branchIds, schema);
        const now = new Date();
        const dateStamp = now.toISOString().slice(0, 10);
        const timeStamp = now
            .toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
            .replace(/\s/g, '')
            .replace(':', '-');
        const dateTimeStamp = `${dateStamp}_${timeStamp}`;
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=assets-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async getAllStocks(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.getAllStocksFromDto(dto, branchIds, userId, schema);
            return result;
        }
        catch (error) {
            console.error('Error in getAllStocks controller:', error);
            return {
                success: false,
                message: 'An error occurred while fetching stocks',
                error: error.message,
            };
        }
    }
    async exportStocks(res, dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const buffer = await this.stockService.exportStocks(dto, branchIds, userId, schema);
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=stocks-export-file-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportStocksToExcel controller:', error);
            return {
                success: false,
                message: 'An error occurred while exporting stocks',
                error: error.message,
            };
        }
    }
    async exportSoftwares(res, dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            const buffer = await this.stockService.exportSoftwares(dto, branchIds);
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=softwares-export-file-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportSoftwares controller:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An error occurred while exporting softwares',
                error: error.message,
            });
        }
    }
    async exportSoftwareProcurementExcel(res, dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const buffer = await this.stockService.exportSoftwareProcurementExcel(dto, branchIds);
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=software-procurement-export-file-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportSoftwareProcurementExcel controller:', error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An error occurred while exporting software procurement details',
                error: error.message,
            });
        }
    }
    async getAllSoftwares(dto, req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        dto.schema = schema;
        dto.login_user_id = register_login_user_id;
        return this.stockService.getAllSoftwares(dto, branchIds);
    }
    async getAllPerpetualSoftwares(dto, req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        dto.schema = schema;
        dto.login_user_id = register_login_user_id;
        return this.stockService.getAllPerpetualSoftwares(dto, branchIds);
    }
    async exportPerpetualSoftwares(res, dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const buffer = await this.stockService.exportPerpetualSoftwares(dto, branchIds);
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=perpetual-software-export-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportPerpetualSoftwares controller:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An error occurred while exporting perpetual softwares',
                error: error.message,
            });
        }
    }
    async getSingleStockDetails(asset_id, asset_stocks_unique_id) {
        const data = await this.stockService.findSingleAsset(asset_id, asset_stocks_unique_id);
        return {
            status: true,
            message: 'Single asset fetched successfully',
            data,
        };
    }
    async assetsForMapping(req) {
        console.log('👉 Controller hit: dropdown-list');
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        return await this.stockService.assetsForMapping(branchIds);
    }
    async getAssetItemFullDetails(dto, req) {
        try {
            const { asset_item_id, type = 'ALL', page = 1, limit = 10, sortField, sortDirection, locationFilter, cursor = null, direction, jumpToLast, isLastPageMode, } = dto;
            if (!asset_item_id) {
                return {
                    success: false,
                    message: 'asset_item_id is required',
                };
            }
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.getAssetItemFullDetails(Number(asset_item_id), type, Number(page), Number(limit), sortField, sortDirection, locationFilter, branchIds, typeof cursor === 'string' ? cursor : null, direction, jumpToLast === true || isLastPageMode === true, dto.knownTotal ?? dto.known_total);
            return {
                success: true,
                message: 'Asset item details fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('❌ Controller Error:', error);
            return {
                success: false,
                message: 'Failed to fetch asset item details',
                error: error.message,
            };
        }
    }
    async exportAssetItemDetailsExcel(res, dto, req) {
        try {
            const { asset_item_id, type = 'ALL', sortField, sortDirection, locationFilter, selectedIds, isSelectAll, excludeIds, } = dto;
            if (!asset_item_id) {
                throw new common_1.HttpException('asset_item_id is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const buffer = await this.stockService.exportAssetItemFullDetails(Number(asset_item_id), type, sortField, sortDirection, locationFilter, branchIds, selectedIds?.map(Number), isSelectAll, excludeIds?.map(Number));
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=stock-details-export-${type}-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('❌ Error exporting stock details:', error);
            throw new common_1.HttpException(error.message || 'Failed to export stock details', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSoftwareDetails(dto, req) {
        try {
            const { limit = 10, pageLimit, cursor, isLastPageMode, jumpToLast, direction, sortField, sortDirection, locationFilter, purchase_date, asset_item_id, type = 'ALL', } = dto;
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.getSoftwareDetails(type, Number(pageLimit ?? limit), cursor, jumpToLast === true || isLastPageMode === true, sortField, sortDirection, locationFilter, branchIds, purchase_date, Number(asset_item_id), direction, dto.knownTotal ?? dto.known_total, dto.page);
            return {
                success: true,
                message: 'Asset item details fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('❌ Controller Error:', error);
            return {
                success: false,
                message: 'Failed to fetch asset item details',
                error: error.message,
            };
        }
    }
    async getSoftwareDetailsByProcurement(dto, req) {
        try {
            const { procurement_id, type = 'ALL', pageLimit = 10, limit, cursor = null, direction, jumpToLast, page, currentPage, isLastPageMode = false, sortField, sortDirection, locationFilter, purchase_date, } = dto;
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const jumpPage = Number(page ?? currentPage ?? 1);
            const result = await this.stockService.getSoftwareDetailsByProcurement(type, Number(limit ?? pageLimit), cursor, jumpToLast === true || isLastPageMode === true, sortField, sortDirection, locationFilter, branchIds, purchase_date, Number(procurement_id), direction, dto.knownTotal ?? dto.known_total, jumpPage);
            return {
                success: true,
                message: 'Asset item details fetched successfully',
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch asset item details',
                error: error.message,
            };
        }
    }
    async exportSoftwareProcurement(res, dto) {
        try {
            const { asset_item_id, procurement_id, type = 'ALL', sortField, sortDirection, purchase_date, selectedIds, } = dto;
            const fileName = 'software-procurement-export-' +
                type + '-' +
                new Date()
                    .toISOString()
                    .replace(/T/, '_')
                    .replace(/:/g, '-')
                    .replace(/\..\..\..Z/, '') +
                '.xlsx';
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=${fileName}`,
            });
        }
        catch (error) {
            console.error('❌ Error exporting software procurement:', error);
            res.status(500).send({
                success: false,
                message: 'Failed to export software procurement',
                error: error.message,
            });
        }
    }
    async getSoftwareListView(dto, req) {
        try {
            const { asset_item_id, procurement_id, page = 1, limit = 10, sortField = 'purchase_date', sortDirection = 'ASC', locationFilter, filterType = 'CURRENT', cursor = null, isLastPageMode = false, jumpToLast, direction, } = dto;
            if (!asset_item_id) {
                return {
                    success: false,
                    message: 'asset_item_id is required',
                };
            }
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.getSoftwareListViewByPurchaseDate(Number(asset_item_id), Number(page), Number(limit), sortField, sortDirection, locationFilter, branchIds, procurement_id, filterType, cursor, jumpToLast === true || isLastPageMode === true, direction, dto.knownTotal ?? dto.known_total);
            return {
                success: true,
                message: 'List view fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('❌ Controller Error:', error);
            return {
                success: false,
                message: 'Failed to fetch list view',
                error: error.message,
            };
        }
    }
    async uploadAssetImage(file, serial_id, res, req) {
        const system_user_id = req.cookies.system_user_id;
        const user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const result = await this.stockService.updateAssetImage(Number(serial_id), file, user_id, req);
        return res.status(result.status).json(result);
    }
    async markProcurementRenewal(body, res, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const login_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            const { procurement_id } = body;
            if (!procurement_id) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'procurement_id is required',
                });
            }
            const result = await this.stockService.markProcurementForRenewal(procurement_id, Number(login_user_id), schema);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Procurement marked for renewal',
                data: result,
            });
        }
        catch (error) {
            console.error('Error:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed',
            });
        }
    }
    async getRenewalSoftwares(dto, req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        dto.schema = schema;
        dto.login_user_id = register_login_user_id;
        return this.stockService.getRenewalSoftwares(dto, branchIds);
    }
    async exportRenewalSoftwares(res, dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const buffer = await this.stockService.exportRenewalSoftwares(dto, branchIds);
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=renewals-export-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportRenewalSoftwares controller:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while exporting renewals',
                error: error.message,
            });
        }
    }
    async approveRenewal(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const { procurement_id } = body;
            if (!procurement_id) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'procurement_id is required',
                });
            }
            const userId = Number(user_id);
            const result = await this.stockService.approveRenewal(procurement_id, userId);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Renewal approved successfully',
                data: result,
            });
        }
        catch (error) {
            console.error('Error:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to approve renewal',
            });
        }
    }
    async cancelRenewal(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const { procurement_id } = body;
            if (!procurement_id) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'procurement_id is required',
                });
            }
            const userId = Number(user_id);
            const result = await this.stockService.cancelRenewal(procurement_id, userId);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Renewal cancelled successfully',
                data: result,
            });
        }
        catch (error) {
            console.error('Error:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to cancel renewal',
            });
        }
    }
    async getDetailsByProcurement(procurement_id, asset_item_id) {
        const data = await this.stockService.findByProcurement(procurement_id, asset_item_id);
        return {
            status: true,
            message: 'Details fetched successfully',
            data,
        };
    }
    async createRenewal(body, req) {
        try {
            const LoginuserId = req.cookies.system_user_id;
            const userId = Number((0, crypto_utils_1.decrypt)(LoginuserId));
            const organizationID = req.cookies.organization_id;
            const decrypted_organizationID = Number((0, crypto_utils_1.decrypt)(organizationID));
            const result = await this.stockService.createRenewal(body.procurement_id, body.asset_item_id, body.formData, userId, body.isProrata, decrypted_organizationID, req);
            return {
                status: true,
                message: result.message,
                data: result,
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Failed to create renewal',
            };
        }
    }
    async getProcurementHistory(asset_item_id, procurement_id) {
        const data = await this.stockService.getRenewalHistory(Number(asset_item_id), procurement_id ? Number(procurement_id) : undefined);
        return {
            status: true,
            message: 'Procurement history fetched successfully',
            data,
        };
    }
    async getBillEditDetails(dto, req) {
        try {
            const { procurement_item_id } = dto;
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const result = await this.stockService.getBillEditDetails(Number(procurement_item_id), branchIds);
            return {
                success: true,
                message: 'Bill edit details fetched successfully',
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch bill edit details',
                error: error.message,
            };
        }
    }
    async updateStockBill(files, body, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        const parseJsonField = (val, fallback) => {
            if (val === undefined || val === null)
                return fallback;
            if (Array.isArray(val))
                return val;
            try {
                return JSON.parse(val);
            }
            catch {
                return fallback;
            }
        };
        const rawExisting = body.existing_documents;
        let existingDocs = [];
        if (rawExisting) {
            const items = Array.isArray(rawExisting) ? rawExisting : [rawExisting];
            existingDocs = items
                .map((item) => {
                if (typeof item === 'string') {
                    try {
                        return JSON.parse(item);
                    }
                    catch {
                        return null;
                    }
                }
                return item;
            })
                .filter(Boolean);
        }
        const newDocMeta = (files ?? []).map((file) => ({
            name: file.originalname,
            path: `/uploads/billing_documents/${file.filename}`,
            size: file.size,
            type: file.mimetype,
            uploadedDate: new Date(),
        }));
        const mergedDocuments = [...existingDocs, ...newDocMeta];
        const dto = {
            procurement_item_id: Number(body.procurement_item_id),
            procurement_id: Number(body.procurement_id),
            asset_id: Number(body.asset_id),
            vendor_id: body.vendor_id !== undefined ? Number(body.vendor_id) : undefined,
            bill_no: body.bill_no !== undefined ? String(body.bill_no) : undefined,
            invoice_no: body.invoice_no !== undefined ? String(body.invoice_no) : undefined,
            purchase_date: body.purchase_date !== undefined ? body.purchase_date : undefined,
            buy_price: body.buy_price !== undefined ? Number(body.buy_price) : undefined,
            gst_percent: body.gst_percent !== undefined ? Number(body.gst_percent) : undefined,
            gst_amount: body.gst_amount !== undefined ? Number(body.gst_amount) : undefined,
            total_without_gst: body.total_without_gst !== undefined
                ? Number(body.total_without_gst)
                : undefined,
            total_amount: body.total_amount !== undefined ? Number(body.total_amount) : undefined,
            ownership_status_id: body.ownership_status_id !== undefined
                ? Number(body.ownership_status_id)
                : undefined,
            subscription_type: body.subscription_type !== undefined
                ? body.subscription_type
                : undefined,
            billing_frequency: body.billing_frequency !== undefined
                ? body.billing_frequency
                : undefined,
            sub_start_date: body.sub_start_date !== undefined ? body.sub_start_date : undefined,
            next_renewal_date: body.next_renewal_date !== undefined
                ? body.next_renewal_date
                : undefined,
            quantity: body.quantity !== undefined ? Number(body.quantity) : undefined,
            location_id: body.location_id !== undefined ? Number(body.location_id) : undefined,
            documents: mergedDocuments.length > 0
                ? JSON.stringify(mergedDocuments)
                : undefined,
            retained_serial_ids: parseJsonField(body.retained_serial_ids, []).map(Number),
            new_serials: parseJsonField(body.new_serials, []).filter((s) => s?.length),
            updated_by: userId,
        };
        return this.stockService.updateStockBill(dto, +decrypted_organizationID);
    }
    async uploadBillDocument(files, body, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        const dto = {
            procurement_item_id: Number(body.procurement_item_id),
            procurement_id: Number(body.procurement_id),
            asset_id: Number(body.asset_id),
        };
        return this.stockService.uploadBillDocument(dto, files ?? [], userId, +decrypted_organizationID);
    }
    async updateWarranty(body, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id)
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        return this.stockService.updateWarranty({ ...body, updated_by: userId }, +decrypted_organizationID);
    }
    async updateSubscription(body, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id)
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.stockService.getUserByPublicID(Number(decrypted_system_user_id));
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        return this.stockService.updateSubscription({ ...body, updated_by: userId }, +decrypted_organizationID);
    }
    async deleteAssetImage(serial_id, res, req) {
        const system_user_id = req.cookies.system_user_id;
        const user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const result = await this.stockService.deleteAssetImage(Number(serial_id), user_id, req);
        return res.status(result.status).json(result);
    }
};
exports.StocksController = StocksController;
__decorate([
    (0, common_1.Post)('create-stock'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/billing_documents',
            filename: (req, file, cb) => {
                const uniqueName = 'stock-' + Date.now() + (0, path_1.extname)(file.originalname);
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, create_stock_dto_1.CreateStockDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "createStocks", null);
__decorate([
    (0, common_1.Post)('update-assettitle-project-costcenter-serial'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateAssetTitleProjectCostCenter", null);
__decorate([
    (0, common_1.Get)('validate-serial-license'),
    __param(0, (0, common_1.Query)('serial')),
    __param(1, (0, common_1.Query)('license')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "validateSerialOrLicense", null);
__decorate([
    (0, common_1.Post)('selection-preflight'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "selectionPreflight", null);
__decorate([
    (0, common_1.Post)('selection-resolve-ids'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "selectionResolveIds", null);
__decorate([
    (0, common_1.Post)('getAllSerials2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "findAllSerials2", null);
__decorate([
    (0, common_1.Post)('export-assets-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListViewDtoForExcleExport_1.ListViewDtoForExcleExport, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportAssetsToExcel", null);
__decorate([
    (0, common_1.Post)('getAllStocks'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllStocks", null);
__decorate([
    (0, common_1.Post)('export-stock-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListViewDtoForExcleExport_1.ListViewDtoForExcleExport, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportStocks", null);
__decorate([
    (0, common_1.Post)('export-software-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListViewDtoForExcleExport_1.ListViewDtoForExcleExport, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportSoftwares", null);
__decorate([
    (0, common_1.Post)('export-software-procurement-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportSoftwareProcurementExcel", null);
__decorate([
    (0, common_1.Post)('getAllSoftwares'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllSoftwares", null);
__decorate([
    (0, common_1.Post)('getAllPerpetualSoftwares'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllPerpetualSoftwares", null);
__decorate([
    (0, common_1.Post)('export-perpetual-software-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportPerpetualSoftwares", null);
__decorate([
    (0, common_1.Get)('getSingleStockDetails'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_id')),
    __param(1, (0, common_1.Query)('asset_stocks_unique_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getSingleStockDetails", null);
__decorate([
    (0, common_1.Get)('assetsForAssignDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "assetsForMapping", null);
__decorate([
    (0, common_1.Post)('getAssetItemFullDetails'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAssetItemFullDetails", null);
__decorate([
    (0, common_1.Post)('export-asset-item-details-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportAssetItemDetailsExcel", null);
__decorate([
    (0, common_1.Post)('getSoftwareDetails'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getSoftwareDetails", null);
__decorate([
    (0, common_1.Post)('getSoftwareDetailsByProcurement'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getSoftwareDetailsByProcurement", null);
__decorate([
    (0, common_1.Post)('export-software-procurement'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportSoftwareProcurement", null);
__decorate([
    (0, common_1.Post)('getSoftwareListView'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getSoftwareListView", null);
__decorate([
    (0, common_1.Post)('upload-asset-image'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('asset_image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('serial_id')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "uploadAssetImage", null);
__decorate([
    (0, common_1.Post)('mark-procurement-renewal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "markProcurementRenewal", null);
__decorate([
    (0, common_1.Post)('getRenewalSoftwares'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getRenewalSoftwares", null);
__decorate([
    (0, common_1.Post)('export-renewal-softwares'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "exportRenewalSoftwares", null);
__decorate([
    (0, common_1.Post)('approve-renewal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "approveRenewal", null);
__decorate([
    (0, common_1.Post)('cancel-renewal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "cancelRenewal", null);
__decorate([
    (0, common_1.Get)('getDetailsByProcurement'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('procurement_id')),
    __param(1, (0, common_1.Query)('asset_item_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getDetailsByProcurement", null);
__decorate([
    (0, common_1.Post)('create-renewal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "createRenewal", null);
__decorate([
    (0, common_1.Get)('getProcurementHistory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_item_id')),
    __param(1, (0, common_1.Query)('procurement_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getProcurementHistory", null);
__decorate([
    (0, common_1.Post)('getBillEditDetails'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getBillEditDetails", null);
__decorate([
    (0, common_1.Post)('update-bill'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 20, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/billing_documents',
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const ext = (0, path_1.extname)(file.originalname);
                const base = file.originalname
                    .replace(/\.[^/.]+$/, '')
                    .replace(/\s+/g, '_');
                cb(null, `bill-doc-${base}-${timestamp}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
                'image/svg+xml',
            ];
            if (!allowed.includes(file.mimetype)) {
                return cb(new Error('Only PNG, JPG, JPEG, SVG, PDF files allowed'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateStockBill", null);
__decorate([
    (0, common_1.Post)('upload-bill-document'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 20, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/billing_documents',
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const ext = (0, path_1.extname)(file.originalname);
                const base = file.originalname
                    .replace(/\.[^/.]+$/, '')
                    .replace(/\s+/g, '_');
                cb(null, `bill-doc-${base}-${timestamp}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/pdf',
                'image/svg+xml',
            ];
            if (!allowed.includes(file.mimetype)) {
                return cb(new Error('Only PNG, JPG, JPEG, SVG and PDF allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "uploadBillDocument", null);
__decorate([
    (0, common_1.Post)('update-warranty'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_bill_dto_1.UpdateWarrantyDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateWarranty", null);
__decorate([
    (0, common_1.Post)('update-subscription'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_bill_dto_1.UpdateSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Post)('delete-asset-image'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('serial_id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "deleteAssetImage", null);
exports.StocksController = StocksController = __decorate([
    (0, common_1.Controller)('stocks'),
    __metadata("design:paramtypes", [stocks_service_1.StocksService,
        asset_mapping_service_1.AssetMappingService,
        redis_service_1.RedisService,
        stock_summary_refresh_service_1.StockSummaryRefreshService])
], StocksController);
