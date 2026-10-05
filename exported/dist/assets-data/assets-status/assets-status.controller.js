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
exports.AssetStatusController = void 0;
const common_1 = require("@nestjs/common");
const assets_status_service_1 = require("./assets-status.service");
const create_assets_status_dto_1 = require("./dto/create-assets-status.dto");
const update_assets_status_dto_1 = require("./dto/update-assets-status.dto");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const delete_assets_status_dto_1 = require("./dto/delete-assets-status.dto");
let AssetStatusController = class AssetStatusController {
    constructor(assetStatusService) {
        this.assetStatusService = assetStatusService;
    }
    async createNewAssetStatus(createAssetsStatusDto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetStatusService.getUserByPublicID(Number(decrypted));
            createAssetsStatusDto.created_by = userId;
            return this.assetStatusService.createNewAssetStatus(createAssetsStatusDto);
        }
        catch (error) {
            console.log(`CREATE STATUS:${error}`);
        }
    }
    async addAssetStatusBulk(bulkData) {
        try {
            return await this.assetStatusService.bulkCreateAssetStatuses(bulkData);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllStatuses2(dto) {
        try {
            return await this.assetStatusService.getAllStatuses2(dto);
        }
        catch (error) {
            console.error('Error in getAllStatuses2:', error);
            return {
                success: false,
                message: 'An error occurred while fetching statuses',
                error: error.message,
            };
        }
    }
    async getStatusTypes() {
        try {
            return await this.assetStatusService.getStatusTypesFilter();
        }
        catch (error) {
            console.error("getStatusTypes error:", error);
            throw new common_1.BadRequestException("Unable to fetch status types");
        }
    }
    async fetchSingleAssetStatusData(deleteAssetStatusDto, res) {
        const response = await this.assetStatusService.fetchSingleAssetStatusData(deleteAssetStatusDto);
        return res.status(response.status).json(response);
    }
    async updateStatusData(updateStatusDto, req, res) {
        try {
            const updatedStatus = await this.assetStatusService.updateStatusData(updateStatusDto);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Status updated successfully',
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
    async deleteStatusData(deleteStatusDto, res) {
        const message = await this.assetStatusService.deleteStatusData(deleteStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async disableStatusData(deleteStatusDto, res) {
        const message = await this.assetStatusService.disableStatusData(deleteStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async enableStatusData(deleteStatusDto, res) {
        const message = await this.assetStatusService.enableStatusData(deleteStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async exportAssetStatusesExcel(res, dto) {
        const buffer = await this.assetStatusService.exportAssetStatusesExcel(dto);
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
            'Content-Disposition': `attachment; filename=asset-status-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
};
exports.AssetStatusController = AssetStatusController;
__decorate([
    (0, common_1.Post)('addAssetStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assets_status_dto_1.CreateAssetsStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "createNewAssetStatus", null);
__decorate([
    (0, common_1.Post)('addAssetStatusBulk'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "addAssetStatusBulk", null);
__decorate([
    (0, common_1.Post)('getAllStatuses2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "getAllStatuses2", null);
__decorate([
    (0, common_1.Get)("getStatusTypesFilter"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "getStatusTypes", null);
__decorate([
    (0, common_1.Post)('fetch-single-asset-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_assets_status_dto_1.DeleteAssetsStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "fetchSingleAssetStatusData", null);
__decorate([
    (0, common_1.Post)('update-asset-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_assets_status_dto_1.UpdateAssetsStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "updateStatusData", null);
__decorate([
    (0, common_1.Post)('deleteStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_assets_status_dto_1.DeleteAssetsStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "deleteStatusData", null);
__decorate([
    (0, common_1.Post)('disableStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_assets_status_dto_1.DeleteAssetsStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "disableStatusData", null);
__decorate([
    (0, common_1.Post)('enableStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_assets_status_dto_1.DeleteAssetsStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "enableStatusData", null);
__decorate([
    (0, common_1.Post)('export-asset-statuses-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetStatusController.prototype, "exportAssetStatusesExcel", null);
exports.AssetStatusController = AssetStatusController = __decorate([
    (0, common_1.Controller)('assetStatus'),
    __metadata("design:paramtypes", [assets_status_service_1.AssetsStatusService])
], AssetStatusController);
