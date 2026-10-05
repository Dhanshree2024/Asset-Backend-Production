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
exports.AssetItemsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const list_view_export_excle_dto_copy_1 = require("../../common/listviewDTO/list-view-export-excle.dto copy");
const redis_service_1 = require("../../common/redis/redis.service");
const typeorm_1 = require("typeorm");
const asset_items_service_1 = require("./asset-items.service");
const create_asset_item_dto_1 = require("./dto/create-asset-item.dto");
const delete_asset_item_dto_1 = require("./dto/delete-asset-item.dto");
const get_asset_item_with_relations_dto_1 = require("./dto/get-asset-item-with-relations.dto");
const update_asset_item_dto_1 = require("./dto/update-asset-item.dto");
let AssetItemsController = class AssetItemsController {
    constructor(assetItemsService, dataSource, redisService) {
        this.assetItemsService = assetItemsService;
        this.dataSource = dataSource;
        this.redisService = redisService;
    }
    async downloadAssetTemplate(asset_item_id, includeSampleRow, res) {
        try {
            const { buffer, itemName } = await this.assetItemsService.generateAssetTemplate(asset_item_id, includeSampleRow);
            const safeItemName = itemName
                .trim()
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
                .replace(/\s+/g, "_");
            console.log("SAFE NAME", safeItemName);
            const now = new Date();
            const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
            res.setHeader('Content-Disposition', `attachment; filename="${safeItemName}_Asset_Import_Template.xlsx"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return res.send(buffer);
        }
        catch (error) {
            console.error('Error generating asset template:', error);
            return res.status(500).send('Failed to generate asset template');
        }
    }
    async getAssetHeaders(asset_item_id) {
        try {
            const headers = await this.assetItemsService.getTemplateHeaders(asset_item_id);
            return { headers };
        }
        catch (error) {
            console.error('Error fetching asset headers:', error);
            throw new common_1.InternalServerErrorException('Failed to get asset headers');
        }
    }
    async createAssetWithStock(dtos, req) {
        const { asset_item_id, payload } = dtos;
        const system_user_id = req.cookies?.system_user_id;
        const organizationID = req.cookies?.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        if (!system_user_id || !organizationID) {
            throw new common_1.BadRequestException('Missing authentication cookies');
        }
        const orgId = Number((0, crypto_utils_1.decrypt)(organizationID.toString()));
        if (isNaN(orgId)) {
            throw new common_1.BadRequestException('Invalid organization ID');
        }
        if (!organizationID)
            throw new common_1.BadRequestException('Organization ID not found');
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
        const result = await this.assetItemsService.createAssetAndStock(payload, asset_item_id, orgId, userId, schema, req);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async getAllItemData(search, customFiltersStr, res) {
        try {
            let customFilters = {};
            if (customFiltersStr) {
                try {
                    customFilters = JSON.parse(customFiltersStr);
                }
                catch (err) {
                    throw new common_1.BadRequestException('Invalid JSON in customFilters parameter');
                }
            }
            const itemData = await this.assetItemsService.getItemData({
                search,
                customFilters,
            });
            return res.status(200).json({
                status: 200,
                message: "Item data fetched successfully",
                data: itemData,
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Failed to fetch item data",
                error: error.message,
            });
        }
    }
    async activateItem(asset_item_ids) {
        if (!Array.isArray(asset_item_ids) || asset_item_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetItemsService.activateItems(asset_item_ids);
    }
    async deactivateItem(asset_item_ids) {
        if (!Array.isArray(asset_item_ids) || asset_item_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetItemsService.deactivateItems(asset_item_ids);
    }
    async moveItems(asset_item_id, main_category_id, sub_category_id) {
        try {
            const result = await this.assetItemsService.moveItems(asset_item_id, main_category_id, sub_category_id);
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, message: error.message || 'Failed to move items' };
        }
    }
    async fetchOrganizationAllAssetItems2(dto, req) {
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
            const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.assetItemsService.fetchOrganizationAllAssetItems2(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Error in getAllItems2:', error);
            return {
                success: false,
                message: 'An error occurred while fetching items',
                error: error.message,
            };
        }
    }
    async fetchAllActiveItems(searchQuery = '', category = [], subCategory = []) {
        try {
            const data = await this.assetItemsService.fetchAllActiveItems(searchQuery, category, subCategory);
            if (!data.length) {
                return {
                    success: true,
                    message: 'No active items found',
                    data: [],
                };
            }
            return {
                success: true,
                message: 'Active items retrieved successfully',
                data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'An error occurred while fetching active items',
                error: error.message,
            };
        }
    }
    async fetchAllActiveItems2(searchQuery = '', category = [], subCategory = [], req) {
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
            const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const data = await this.assetItemsService.fetchAllActiveItems2(searchQuery, category, subCategory, branchIds, userId, schema);
            return {
                success: true,
                message: data.length
                    ? 'Active items retrieved successfully'
                    : 'No active items found',
                data,
            };
        }
        catch (error) {
            console.error('Error in getAllActiveItems2 controller:', error);
            return {
                success: false,
                message: 'An error occurred while fetching active items',
                error: error.message,
            };
        }
    }
    async getDepreciationList() {
        return this.assetItemsService.getAllDepreciationItems();
    }
    async exportAssetItemsToExcel(res, searchQuery = '', filtersStr) {
        let parsedFilters = {};
        if (filtersStr) {
            try {
                parsedFilters = JSON.parse(filtersStr);
            }
            catch (e) {
                throw new common_1.BadRequestException('Invalid customFilters JSON');
            }
        }
        const buffer = await this.assetItemsService.exportFilteredExcelForAssetItems({
            search: searchQuery,
            filters: parsedFilters,
        });
        const now = new Date();
        const dateStamp = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
            .getHours()
            .toString()
            .padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now
            .getSeconds()
            .toString()
            .padStart(2, '0')}`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="asset-items-` + dateStamp + `.xlsx"`);
        res.end(buffer);
    }
    async exportAssetItemsPost(res, req, dto) {
        return this.exportAssetItemsExcel2(dto, req, res);
    }
    async exportAssetItemsExcel2(dto, req, res) {
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
            const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const buffer = await this.assetItemsService.exportOrganizationAllAssetItemsExcel(dto, branchIds, userId, schema);
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
                'Content-Disposition': `attachment; filename=asset-items-export-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportAssetItemsExcel2:', error);
            throw new common_1.InternalServerErrorException(error.message || 'Failed to export asset items excel');
        }
    }
    async itemTemplate(req, res) {
        const buffer = await this.assetItemsService.generateItemTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    async bulkCreateAssetItems(dtos, req) {
        console.log('dtos', dtos);
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        return await this.assetItemsService.bulkCreateItem(dtos, Number(decrypted_system_user_id));
    }
    async createNewAssetItem(file, dto, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
            dto.added_by = userId;
            const organizationID = req.cookies.organization_id;
            const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
            const result = await this.assetItemsService.createNewAssetItem(dto, file, decrypted_organizationID);
            return res.status(result.status).json(result);
        }
        catch (error) {
            console.error('Error in createNewAssetItem controller:', error);
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
            });
        }
    }
    async fetchSingleAssetItemData(deleteAssetItemDto, res) {
        const response = await this.assetItemsService.fetchSingleAssetItemData(deleteAssetItemDto);
        return res.status(response.status).json(response);
    }
    async fetchSingleItemDataForForm(deleteAssetItemDto, res) {
        const response = await this.assetItemsService.fetchSingleItemDataForForm(deleteAssetItemDto);
        return res.status(response.status).json(response);
    }
    async updateItemData(file, updateItemDto, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetItemsService.getUserByPublicID(Number(decrypted_system_user_id));
            const rawSchema = req.cookies?.['x-organization-schema'];
            const schema = rawSchema ? `org_${(0, crypto_utils_1.decrypt)(rawSchema)}` : undefined;
            console.log("schema", schema);
            const organizationID = req.cookies.organization_id;
            const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
            const updatedItem = await this.assetItemsService.updateItemData(updateItemDto, file, +decrypted_organizationID, schema);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Item updated successfully',
                data: updatedItem.data,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
    async bulkDeleteItems(itemIds, req, res) {
        const result = await this.assetItemsService.bulkDeleteItems(itemIds);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: result.message,
            data: result,
        });
    }
    async getAssetItemWithRelations(getAssetItemWithRelationsDto, res) {
        try {
            const { asset_item_id } = getAssetItemWithRelationsDto;
            const result = await this.assetItemsService.getAssetItemWithRelations(asset_item_id);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Asset item and relations fetched successfully.',
                data: result,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message ||
                    'An error occurred while fetching asset item details.',
            });
        }
    }
    async getSidebarMenuOptions() {
        return {
            success: true,
            data: await this.assetItemsService.getSidebarMenuOption()
        };
    }
    async getDepartmentConfigValues(req, res, searchQuery = '') {
        try {
            const result = await this.assetItemsService.fetchAssetBlocks(searchQuery);
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
};
exports.AssetItemsController = AssetItemsController;
__decorate([
    (0, common_1.Post)('download-asset-excle-import-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_item_id')),
    __param(1, (0, common_1.Body)('includeSampleRow')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "downloadAssetTemplate", null);
__decorate([
    (0, common_1.Post)('get-asset-headers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_item_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getAssetHeaders", null);
__decorate([
    (0, common_1.Post)('create-asset-stock'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "createAssetWithStock", null);
__decorate([
    (0, common_1.Get)("item-data"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('customFilters')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getAllItemData", null);
__decorate([
    (0, common_1.Post)('activate-items'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_item_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "activateItem", null);
__decorate([
    (0, common_1.Post)('deactivate-items'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_item_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "deactivateItem", null);
__decorate([
    (0, common_1.Post)('move-item'),
    __param(0, (0, common_1.Body)('asset_item_id')),
    __param(1, (0, common_1.Body)('main_category_id')),
    __param(2, (0, common_1.Body)('sub_category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "moveItems", null);
__decorate([
    (0, common_1.Post)('getAllItems2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "fetchOrganizationAllAssetItems2", null);
__decorate([
    (0, common_1.Get)('getAllActiveItems'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('subCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "fetchAllActiveItems", null);
__decorate([
    (0, common_1.Get)('getAllActiveItems2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('subCategory')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "fetchAllActiveItems2", null);
__decorate([
    (0, common_1.Get)('dep-items'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getDepreciationList", null);
__decorate([
    (0, common_1.Get)('export-asset-items-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('customFilters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "exportAssetItemsToExcel", null);
__decorate([
    (0, common_1.Post)('export-asset-items-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, list_view_export_excle_dto_copy_1.ListViewDtoForExcleExport]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "exportAssetItemsPost", null);
__decorate([
    (0, common_1.Post)('export-asset-items-excel2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_export_excle_dto_copy_1.ListViewDtoForExcleExport, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "exportAssetItemsExcel2", null);
__decorate([
    (0, common_1.Get)('download-item-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "itemTemplate", null);
__decorate([
    (0, common_1.Post)('bulk-create-item'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "bulkCreateAssetItems", null);
__decorate([
    (0, common_1.Post)('insert-new-asset-item'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('asset_item_icon', {
        limits: { fileSize: 400 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!['image/svg+xml', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Only SVG, PNG, JPG allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_asset_item_dto_1.CreateAssetItemNewDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "createNewAssetItem", null);
__decorate([
    (0, common_1.Post)('fetch-single-asset-item'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_item_dto_1.DeleteAssetItemDto, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "fetchSingleAssetItemData", null);
__decorate([
    (0, common_1.Post)('fetch-single-asset-item-addform'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_item_dto_1.DeleteAssetItemDto, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "fetchSingleItemDataForForm", null);
__decorate([
    (0, common_1.Post)('update-asset-item'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('asset_item_icon', {
        limits: { fileSize: 400 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!['image/svg+xml', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Only SVG, PNG, JPG allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_asset_item_dto_1.UpdateAssetItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "updateItemData", null);
__decorate([
    (0, common_1.Post)('bulk-delete-items'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_item_ids')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "bulkDeleteItems", null);
__decorate([
    (0, common_1.Post)('get-asset-item-with-relations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_asset_item_with_relations_dto_1.GetAssetItemWithRelationsDto, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getAssetItemWithRelations", null);
__decorate([
    (0, common_1.Get)('get-sidebar-menu-options'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getSidebarMenuOptions", null);
__decorate([
    (0, common_1.Get)('fetchAssetBlocks'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AssetItemsController.prototype, "getDepartmentConfigValues", null);
exports.AssetItemsController = AssetItemsController = __decorate([
    (0, common_1.Controller)('assetItems'),
    __metadata("design:paramtypes", [asset_items_service_1.AssetItemsService,
        typeorm_1.DataSource,
        redis_service_1.RedisService])
], AssetItemsController);
