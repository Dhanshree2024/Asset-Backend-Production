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
exports.AssetFieldsController = void 0;
const common_1 = require("@nestjs/common");
const process_1 = require("process");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const asset_fields_service_1 = require("./asset-fields.service");
const create_asset_field_dto_1 = require("./dto/create-asset-field.dto");
const delete_asset_field_dto_1 = require("./dto/delete-asset-field.dto");
const update_asset_field_dto_1 = require("./dto/update-asset-field.dto");
let AssetFieldsController = class AssetFieldsController {
    constructor(assetFieldsService) {
        this.assetFieldsService = assetFieldsService;
    }
    async fetchOrganizationAllAssetFields(dto) {
        try {
            return await this.assetFieldsService.getCustomAssetFields(dto);
        }
        catch (error) {
            console.error('Error in fetchOrganizationAllAssetFields:', error);
            return {
                success: false,
                message: 'An error occurred while fetching asset fields',
                error: error.message,
            };
        }
    }
    async getDefaultAssetFields(dto) {
        return this.assetFieldsService.getDefaultAssetFields(dto);
    }
    async getAssetFieldsDropdown(search = '') {
        return this.assetFieldsService.getAssetFieldsDropdown(search);
    }
    async getAssetFieldCategoryDropdown() {
        const data = await this.assetFieldsService.getAssetFieldCategoryDropdown();
        return {
            success: true,
            data,
        };
    }
    async exportAssetFieldsToExcel(res, search, filtersStr) {
        try {
            const filters = filtersStr ? JSON.parse(filtersStr) : {};
            const buffer = await this.assetFieldsService.exportFilteredExcelForAssetFields({
                search,
                filters,
            });
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=asset-fields.xlsx',
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Excel Export Error:', error);
            throw new common_1.BadRequestException('Failed to export asset fields');
        }
    }
    async exportCustomFieldsExcel(res, dto) {
        const buffer = await this.assetFieldsService.exportAssetFieldsExcel(dto, true);
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
            'Content-Disposition': `attachment; filename=custom-fields-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async exportDefaultFieldsExcel(res, dto) {
        const buffer = await this.assetFieldsService.exportAssetFieldsExcel(dto, false);
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
            'Content-Disposition': `attachment; filename=default-fields-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
    getAssetStatusTypes() {
        return this.assetFieldsService.getAssetStatusTypes();
    }
    getAssetWorkingStatusType() {
        return this.assetFieldsService.getAssetWorkingStatusType();
    }
    getAssetOwnershipStatusType() {
        return this.assetFieldsService.getAssetOwnershipStatusType();
    }
    async fetchSingleFieldData(asset_field_id, deleteAssetFieldDto, res) {
        deleteAssetFieldDto.asset_field_id = asset_field_id;
        const response = await this.assetFieldsService.fetchSingleFieldData(deleteAssetFieldDto);
        return res.status(response.status).json(response);
    }
    async createNewVendor(dto, req) {
        return this.assetFieldsService.create(dto);
    }
    findAll() {
        return this.assetFieldsService.findAll();
    }
    async findAllFieldCategories(req, res) {
        try {
            const result = await this.assetFieldsService.findAllFieldCategories();
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
    async deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto, req, res) {
        console.log('deleteAssetOwnershipStatusDto :- ' +
            JSON.stringify(deleteAssetOwnershipStatusDto));
        process_1.exit;
        const deletedStatus = await this.assetFieldsService.deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Ownership status deleted successfully',
            data: deletedStatus,
        });
    }
    async activateItem(asset_field_ids) {
        if (!Array.isArray(asset_field_ids) || asset_field_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetFieldsService.activateFields(asset_field_ids);
    }
    async deactivateItem(asset_field_ids) {
        if (!Array.isArray(asset_field_ids) || asset_field_ids.length === 0) {
            throw new common_1.BadRequestException('No category IDs provided.');
        }
        return this.assetFieldsService.deactivateFields(asset_field_ids);
    }
    getDefaultAssetFieldsDropdown() {
        return this.assetFieldsService.getDefaultAssetFieldsDropdown();
    }
    getCustomAssetFieldsDropdown() {
        return this.assetFieldsService.getCustomAssetFieldsDropdown();
    }
    countAll() {
        return this.assetFieldsService.countAll();
    }
    async getField(id) {
        return this.assetFieldsService.getFieldById(Number(id));
    }
    async updateField(id, updateAssetFieldDto) {
        return this.assetFieldsService.updateField(id, updateAssetFieldDto);
    }
};
exports.AssetFieldsController = AssetFieldsController;
__decorate([
    (0, common_1.Post)('getOrganizationAssetFields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "fetchOrganizationAllAssetFields", null);
__decorate([
    (0, common_1.Post)('getDefaultAssetFields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "getDefaultAssetFields", null);
__decorate([
    (0, common_1.Get)('getAssetFieldsDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "getAssetFieldsDropdown", null);
__decorate([
    (0, common_1.Get)('field-categories-for-dropdown-of-filter'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "getAssetFieldCategoryDropdown", null);
__decorate([
    (0, common_1.Get)('export-asset-fields-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('filters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "exportAssetFieldsToExcel", null);
__decorate([
    (0, common_1.Post)('export-custom-fields-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "exportCustomFieldsExcel", null);
__decorate([
    (0, common_1.Post)('export-default-fields-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "exportDefaultFieldsExcel", null);
__decorate([
    (0, common_1.Get)('getAssetStatusTypes'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "getAssetStatusTypes", null);
__decorate([
    (0, common_1.Get)('getAssetWorkingStatusType'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "getAssetWorkingStatusType", null);
__decorate([
    (0, common_1.Get)('getAssetOwnershipStatusType'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "getAssetOwnershipStatusType", null);
__decorate([
    (0, common_1.Post)('fetch-single-field-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_field_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, delete_asset_field_dto_1.DeleteAssetFieldDto, Object]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "fetchSingleFieldData", null);
__decorate([
    (0, common_1.Post)('insert-new-asset-field'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_field_dto_1.CreateAssetFieldDto, Object]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "createNewVendor", null);
__decorate([
    (0, common_1.Get)('getAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('getAllFieldCategories'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "findAllFieldCategories", null);
__decorate([
    (0, common_1.Post)('deleteAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_field_dto_1.DeleteAssetFieldDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "deleteAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('activate-fields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_field_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "activateItem", null);
__decorate([
    (0, common_1.Post)('deactivate-fields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_field_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "deactivateItem", null);
__decorate([
    (0, common_1.Get)('getDefaultAssetFieldsDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "getDefaultAssetFieldsDropdown", null);
__decorate([
    (0, common_1.Get)('getCustomAssetFieldsDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "getCustomAssetFieldsDropdown", null);
__decorate([
    (0, common_1.Get)('countAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetFieldsController.prototype, "countAll", null);
__decorate([
    (0, common_1.Post)("get-single-field-details"),
    __param(0, (0, common_1.Body)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "getField", null);
__decorate([
    (0, common_1.Put)("update-field"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_asset_field_dto_1.UpdateAssetFieldDto]),
    __metadata("design:returntype", Promise)
], AssetFieldsController.prototype, "updateField", null);
exports.AssetFieldsController = AssetFieldsController = __decorate([
    (0, common_1.Controller)('assetFields'),
    __metadata("design:paramtypes", [asset_fields_service_1.AssetFieldsService])
], AssetFieldsController);
