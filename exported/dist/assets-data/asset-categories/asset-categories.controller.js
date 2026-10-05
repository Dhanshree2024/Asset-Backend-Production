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
exports.AssetCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const asset_categories_service_1 = require("./asset-categories.service");
const create_asset_category_dto_1 = require("./dto/create-asset-category.dto");
const update_asset_category_dto_1 = require("./dto/update-asset-category.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
let AssetCategoriesController = class AssetCategoriesController {
    constructor(assetCategoriesService) {
        this.assetCategoriesService = assetCategoriesService;
    }
    async create(createAssetCategoryDto, req, res) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetCategoriesService.getUserByPublicID(Number(decrypted_system_user_id));
        createAssetCategoryDto.added_by = userId;
        console.log('createAssetCategoryDto :-', createAssetCategoryDto);
        const result = await this.assetCategoriesService.create(createAssetCategoryDto);
        return res.status(result.status).json(result);
    }
    async findAll(req, res) {
        try {
            const result = await this.assetCategoriesService.findAll();
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
    async getDropdown(req, res) {
        try {
            const result = await this.assetCategoriesService.getDropdown();
            return res.status(200).json({ result });
        }
        catch (error) {
            console.error('Error in getDropdown:', error);
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async updateAssetCategory(updateAssetCategoryDto) {
        try {
            const updatedCategory = await this.assetCategoriesService.update(updateAssetCategoryDto.main_category_id, updateAssetCategoryDto);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Category updated successfully.',
                data: updatedCategory,
            };
        }
        catch (error) {
            console.error('Error updating category:', error);
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update category.',
                data: null,
            };
        }
    }
    deleteCategory(createAssetCategoryDto) {
        return this.assetCategoriesService.deleteCategory(createAssetCategoryDto);
    }
    async bulkDelete(categoryIds) {
        return this.assetCategoriesService.bulkDeleteCategories(categoryIds);
    }
    async deactivateCategories(categoryIds) {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetCategoriesService.deactivateCategories(categoryIds);
    }
    async activateCategories(categoryIds) {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetCategoriesService.activateCategories(categoryIds);
    }
    async fetchSingleAssetCategoryData(dto, res) {
        try {
            const categoryData = await this.assetCategoriesService.fetchSingleAssetCategoryData(dto);
            if (!categoryData) {
                return res.status(404).json({
                    status: 404,
                    message: `Category not found or inactive`,
                    data: null,
                });
            }
            return res.status(200).json({
                status: 200,
                message: 'Category fetched successfully',
                data: categoryData,
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'An error occurred while processing the request',
                error: error.message,
            });
        }
    }
    countAll() {
        return this.assetCategoriesService.countAll();
    }
    async downloadMainCategoryTemplate(req, res) {
        try {
            const buffer = await this.assetCategoriesService.generateCategoryTemplate();
            res.setHeader('Content-Disposition', 'attachment; filename=main_category_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating main category template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async bulkCreateCategories(dtos, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        if (decrypted_system_user_id) {
            const result = await this.assetCategoriesService.bulkCreateCategories(dtos, +decrypted_system_user_id);
            return {
                statusCode: result.status,
                message: result.message,
                data: result.data,
            };
        }
    }
    async exportCatCSV() {
        return this.assetCategoriesService.exportCategoryCSV();
    }
    async exportToExcel(res, searchQuery = '', filtersStr) {
        let parsedFilters = {};
        if (filtersStr) {
            try {
                parsedFilters = JSON.parse(filtersStr);
            }
            catch (err) {
                throw new common_1.BadRequestException('Invalid JSON in customFilters');
            }
        }
        const buffer = await this.assetCategoriesService.exportFilteredExcelFromFilters(searchQuery, parsedFilters);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=asset-categories.xlsx',
        });
        res.end(buffer);
    }
    async getCategoryDropdown() {
        const data = await this.assetCategoriesService.getMainCategoryDropdown();
        return {
            success: true,
            data,
        };
    }
    update(id, updateAssetCategoryDto) {
        return this.assetCategoriesService.update(+id, updateAssetCategoryDto);
    }
};
exports.AssetCategoriesController = AssetCategoriesController;
__decorate([
    (0, common_1.Post)('insert-new-asset-category'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_category_dto_1.CreateAssetCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('getAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('getDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "getDropdown", null);
__decorate([
    (0, common_1.Post)('update-asset-category'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_category_dto_1.UpdateAssetCategoryDto]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "updateAssetCategory", null);
__decorate([
    (0, common_1.Post)('deleteCategory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_category_dto_1.CreateAssetCategoryDto]),
    __metadata("design:returntype", void 0)
], AssetCategoriesController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('bulkDelete'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('main_category_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Post)('deactivate-categories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('main_category_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "deactivateCategories", null);
__decorate([
    (0, common_1.Post)('activate-categories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('main_category_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "activateCategories", null);
__decorate([
    (0, common_1.Post)('fetch-single-asset-category'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_category_dto_1.CreateAssetCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "fetchSingleAssetCategoryData", null);
__decorate([
    (0, common_1.Get)('countAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetCategoriesController.prototype, "countAll", null);
__decorate([
    (0, common_1.Get)('download-main-category-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "downloadMainCategoryTemplate", null);
__decorate([
    (0, common_1.Post)('bulkCategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "bulkCreateCategories", null);
__decorate([
    (0, common_1.Get)('exportCatCSV'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "exportCatCSV", null);
__decorate([
    (0, common_1.Get)('export-category-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('customFilters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Get)('categories-for-dropdown-of-filter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetCategoriesController.prototype, "getCategoryDropdown", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asset_category_dto_1.UpdateAssetCategoryDto]),
    __metadata("design:returntype", void 0)
], AssetCategoriesController.prototype, "update", null);
exports.AssetCategoriesController = AssetCategoriesController = __decorate([
    (0, common_1.Controller)('assetCategories'),
    __metadata("design:paramtypes", [asset_categories_service_1.AssetCategoriesService])
], AssetCategoriesController);
