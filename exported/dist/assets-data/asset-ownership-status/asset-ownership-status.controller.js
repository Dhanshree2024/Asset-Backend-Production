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
exports.AssetOwnershipStatusController = void 0;
const common_1 = require("@nestjs/common");
const asset_ownership_status_service_1 = require("./asset-ownership-status.service");
const create_asset_ownership_status_dto_1 = require("./dto/create-asset-ownership-status.dto");
const update_asset_ownership_status_dto_1 = require("./dto/update-asset-ownership-status.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const delete_asset_ownership_status_dto_1 = require("./dto/delete-asset-ownership-status.dto");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
let AssetOwnershipStatusController = class AssetOwnershipStatusController {
    constructor(assetOwnershipStatusService) {
        this.assetOwnershipStatusService = assetOwnershipStatusService;
    }
    async createAssetOwnershipStatus(createAssetOwnershipStatusDto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetOwnershipStatusService.getUserByPublicID(Number(decrypted));
            createAssetOwnershipStatusDto.created_by = userId;
            return this.assetOwnershipStatusService.createAssetOwnershipStatus(createAssetOwnershipStatusDto);
        }
        catch (error) {
            console.log(error);
        }
    }
    async bulkCreateAssetOwnershipStatuses(bulkData) {
        try {
            return await this.assetOwnershipStatusService.bulkCreateAssetOwnershipStatuses(bulkData);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllAssetOwnershipStatuses2(dto) {
        try {
            return await this.assetOwnershipStatusService.getAllAssetOwnershipStatuses2(dto);
        }
        catch (error) {
            console.error('Error in getAllAssetOwnershipStatuses2:', error);
            return {
                success: false,
                message: 'Failed to fetch ownership statuses',
                error: error.message,
            };
        }
    }
    async getAssetOwnershipStatusDropdown(body, req, res) {
        try {
            const result = await this.assetOwnershipStatusService.getAssetOwnershipStatusDropdown(body);
            return res.status(200).json({ status: 'success', data: result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async fetchSingleAssetOwnershipStatus(deleteAssetOwnershipStatusDto, res) {
        const response = await this.assetOwnershipStatusService.getAssetOwnershipStatusById(deleteAssetOwnershipStatusDto);
        return res.status(response.status).json(response);
    }
    async updateAssetOwnershipStatus(updateAssetOwnershipStatusDto, req, res) {
        try {
            const updatedStatus = await this.assetOwnershipStatusService.updateAssetOwnershipStatus(updateAssetOwnershipStatusDto);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Ownership status updated successfully',
                data: updatedStatus.data,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
    async disableAssetOwnershipStatus(dto, res) {
        const message = await this.assetOwnershipStatusService.disableAssetOwnershipStatus(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async deleteAssetOwnershipStatus(dto, res) {
        const message = await this.assetOwnershipStatusService.deleteAssetOwnershipStatus(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async enableAssetOwnershipStatus(dto, res) {
        const message = await this.assetOwnershipStatusService.enableAssetOwnershipStatus(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async exportOwnershipStatusesExcel(res, dto) {
        const buffer = await this.assetOwnershipStatusService.exportOwnershipStatusesExcel(dto);
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
            'Content-Disposition': `attachment; filename=ownership-types-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
};
exports.AssetOwnershipStatusController = AssetOwnershipStatusController;
__decorate([
    (0, common_1.Post)('addAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_ownership_status_dto_1.CreateAssetOwnershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "createAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('assetOwnershipStatusBulk'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "bulkCreateAssetOwnershipStatuses", null);
__decorate([
    (0, common_1.Post)('getAllAssetOwnershipStatuses2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "getAllAssetOwnershipStatuses2", null);
__decorate([
    (0, common_1.Post)('getAssetOwnershipStatusDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "getAssetOwnershipStatusDropdown", null);
__decorate([
    (0, common_1.Post)('fetchSingleAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_ownership_status_dto_1.DeleteAssetOwnershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "fetchSingleAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('updateAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_ownership_status_dto_1.UpdateAssetOwnershipStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "updateAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('disableAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_ownership_status_dto_1.DeleteAssetOwnershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "disableAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('deleteAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_ownership_status_dto_1.DeleteAssetOwnershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "deleteAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('enableAssetOwnershipStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_ownership_status_dto_1.DeleteAssetOwnershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "enableAssetOwnershipStatus", null);
__decorate([
    (0, common_1.Post)('export-ownership-statuses-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetOwnershipStatusController.prototype, "exportOwnershipStatusesExcel", null);
exports.AssetOwnershipStatusController = AssetOwnershipStatusController = __decorate([
    (0, common_1.Controller)('assetOwnershipStatus'),
    __metadata("design:paramtypes", [asset_ownership_status_service_1.AssetOwnershipStatusService])
], AssetOwnershipStatusController);
