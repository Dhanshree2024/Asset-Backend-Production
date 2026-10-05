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
exports.AssetSubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const asset_subcategories_service_1 = require("./asset-subcategories.service");
const create_asset_subcategory_dto_1 = require("./dto/create-asset-subcategory.dto");
const update_asset_subcategory_dto_1 = require("./dto/update-asset-subcategory.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const delete_asset_subcategory_dto_1 = require("./dto/delete-asset-subcategory.dto");
let AssetSubcategoriesController = class AssetSubcategoriesController {
    constructor(assetSubcategoriesService) {
        this.assetSubcategoriesService = assetSubcategoriesService;
    }
    async moveItems(main_category_id, sub_category_id) {
        try {
            const result = await this.assetSubcategoriesService.moveSubcategory(main_category_id, sub_category_id);
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, message: error.message || 'Failed to move subcategory' };
        }
    }
    async exportToExcel(search = '', customFiltersStr = '{}', res) {
        let parsedFilters = {};
        console.log('1');
        try {
            parsedFilters = JSON.parse(customFiltersStr);
        }
        catch (err) {
            throw new common_1.BadRequestException('Invalid JSON in customFilters');
        }
        const buffer = await this.assetSubcategoriesService.exportFilteredExcelForSubCategories({
            search,
            filters: parsedFilters,
        });
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="asset-sub-categories_${dateStamp}.xlsx"`);
        res.send(buffer);
    }
    async getAllSubCategories(page = 1, limit = 10, searchQuery = '', customFiltersStr) {
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
            return this.assetSubcategoriesService.getAllSubCategories(page, limit, searchQuery, customFilters);
        }
        catch (error) {
            throw error;
        }
    }
    async getSubCategoriesByCategory(mainCategoryId, res) {
        try {
            const result = await this.assetSubcategoriesService.getSubCategoriesByCategory(mainCategoryId);
            return res.status(200).json({ result });
        }
        catch (error) {
            console.error('Error in getSubCategoriesByCategory:', error);
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async findAll(req, res) {
        try {
            const result = await this.assetSubcategoriesService.findAll();
            return res.status(200).json({
                result,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async createNewAssetItem(dto, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetSubcategoriesService.getUserByPublicID(Number(decrypted_system_user_id));
            dto.added_by = userId;
            const result = await this.assetSubcategoriesService.createNewAssetSubCategory(dto);
            return res.status(result.status).json(result);
        }
        catch (error) {
            console.error('Error in createNewAssetItem:', error);
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                return res.status(error.getStatus()).json(response);
            }
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
            });
        }
    }
    async activateSubCategories(sub_category_ids) {
        if (!Array.isArray(sub_category_ids) || sub_category_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetSubcategoriesService.activatesubCategories(sub_category_ids);
    }
    async deactivateSubCategories(sub_category_ids) {
        if (!Array.isArray(sub_category_ids) || sub_category_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetSubcategoriesService.deactivateSubCategories(sub_category_ids);
    }
    async generateSubcategoryTemplateController(req, res) {
        try {
            const buffer = await this.assetSubcategoriesService.generateSubCategoryExcleTemplate();
            res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async bulkCreateSubcategories(dtos, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        if (decrypted_system_user_id) {
            const result = await this.assetSubcategoriesService.bulkCreateSubcategories(dtos, +decrypted_system_user_id);
            return {
                statusCode: result.status,
                message: result.message,
                data: result.data,
            };
        }
        else {
            return {
                statusCode: 401,
                message: 'Unauthorized: Invalid or missing user ID.',
                data: null,
            };
        }
    }
    async fetchSingleAssetSubCategoryData(deleteAssetItemDto, res) {
        const response = await this.assetSubcategoriesService.fetchSingleAssetSubCategoryData(deleteAssetItemDto);
        return res.status(response.status).json(response);
    }
    async updateSubCategoryData(updateItemDto, req, res) {
        try {
            const updatedItem = await this.assetSubcategoriesService.updateSubCategoryData(updateItemDto);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'SubCategory updated successfully',
                data: updatedItem,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
    async bulkDeleteSubCategories(subCategoryIds, res) {
        try {
            if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
                throw new common_1.BadRequestException('No subcategory IDs provided for deletion.');
            }
            const result = await this.assetSubcategoriesService.bulkDeleteSubCategories(subCategoryIds);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Subcategories deleted successfully',
                data: result,
            });
        }
        catch (error) {
            console.error('Bulk Delete Error:', error);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: error.message || 'Error occurred while deleting subcategories',
                details: error.response?.details || null,
            });
        }
    }
    async getSubCategoryDropdown() {
        const data = await this.assetSubcategoriesService.getSubCategoryDropdown();
        return {
            success: true,
            data,
        };
    }
    async getSubCategoriesByCategoryDropdown(categoryIds) {
        return {
            success: true,
            data: await this.assetSubcategoriesService
                .getSubCategoriesByCategoryDropdown(categoryIds),
        };
    }
};
exports.AssetSubcategoriesController = AssetSubcategoriesController;
__decorate([
    (0, common_1.Post)('move-subcategory'),
    __param(0, (0, common_1.Body)('main_category_id')),
    __param(1, (0, common_1.Body)('sub_category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "moveItems", null);
__decorate([
    (0, common_1.Get)('export-subcategory-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('customFilters')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Get)('getAllSubCategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('customFilters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "getAllSubCategories", null);
__decorate([
    (0, common_1.Get)('getSubCategoriesByCategory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('main_category_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "getSubCategoriesByCategory", null);
__decorate([
    (0, common_1.Get)('getAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('insert-new-asset-subcategory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_subcategory_dto_1.CreateAssetSubcategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "createNewAssetItem", null);
__decorate([
    (0, common_1.Post)('activate-subcategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('sub_category_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "activateSubCategories", null);
__decorate([
    (0, common_1.Post)('deactivate-subcategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('sub_category_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "deactivateSubCategories", null);
__decorate([
    (0, common_1.Get)('download-subcategory-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "generateSubcategoryTemplateController", null);
__decorate([
    (0, common_1.Post)('bulkSubcategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "bulkCreateSubcategories", null);
__decorate([
    (0, common_1.Post)('fetch-single-asset-subcategory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_subcategory_dto_1.DeleteAssetSubCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "fetchSingleAssetSubCategoryData", null);
__decorate([
    (0, common_1.Post)('update-asset-subcategory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_subcategory_dto_1.UpdateAssetSubcategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "updateSubCategoryData", null);
__decorate([
    (0, common_1.Post)('bulkDeleteSubCategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('sub_category_ids')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "bulkDeleteSubCategories", null);
__decorate([
    (0, common_1.Get)('subcategories-for-dropdown-of-filter'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "getSubCategoryDropdown", null);
__decorate([
    (0, common_1.Get)('subcategories-by-category'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetSubcategoriesController.prototype, "getSubCategoriesByCategoryDropdown", null);
exports.AssetSubcategoriesController = AssetSubcategoriesController = __decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assetSubCategories'),
    __metadata("design:paramtypes", [asset_subcategories_service_1.AssetSubcategoriesService])
], AssetSubcategoriesController);
