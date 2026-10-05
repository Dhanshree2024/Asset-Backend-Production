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
exports.AssetWorkingStatusController = void 0;
const common_1 = require("@nestjs/common");
const asset_working_status_service_1 = require("./asset-working-status.service");
const create_asset_working_status_dto_1 = require("./dto/create-asset-working-status.dto");
const update_asset_working_status_dto_1 = require("./dto/update-asset-working-status.dto");
const delete_asset_working_status_dto_1 = require("./dto/delete-asset-working-status.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
let AssetWorkingStatusController = class AssetWorkingStatusController {
    constructor(assetWorkingStatusService) {
        this.assetWorkingStatusService = assetWorkingStatusService;
    }
    async createNewAssetWorkingStatus(createAssetWorkingStatusDto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.assetWorkingStatusService.getUserByPublicID(Number(decrypted));
            createAssetWorkingStatusDto.created_by = userId;
            return this.assetWorkingStatusService.createNewAssetWorkingStatus(createAssetWorkingStatusDto);
        }
        catch (error) {
            console.log(error);
        }
    }
    async addAssetStatusBulk(bulkData) {
        try {
            return await this.assetWorkingStatusService.bulkCreateAssetWorkingStatuses(bulkData);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllWorkingStatuses2(dto) {
        return this.assetWorkingStatusService.getAllWorkingStatuses2(dto);
    }
    async getWorkingStatusesDropdown(search = '') {
        const data = await this.assetWorkingStatusService.getWorkingStatusesDropdown(search);
        return {
            success: true,
            message: 'Working statuses dropdown fetched successfully',
            data,
        };
    }
    async fetchSingleAssetWorkingStatusData(deleteAssetWorkingStatusDto, res) {
        const response = await this.assetWorkingStatusService.fetchSingleAssetWorkingStatusData(deleteAssetWorkingStatusDto);
        return res.status(response.status).json(response);
    }
    async updateWorkingStatusData(updateWorkingStatusDto, req, res) {
        try {
            const updatedStatus = await this.assetWorkingStatusService.updateWorkingStatusData(updateWorkingStatusDto);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Working status updated successfully',
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
    async disableWorkingStatusData(dto, res) {
        const message = await this.assetWorkingStatusService.disableWorkingStatusData(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async deleteWorkingStatusData(dto, res) {
        const message = await this.assetWorkingStatusService.deleteWorkingStatusData(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async enableWorkingStatusData(dto, res) {
        const message = await this.assetWorkingStatusService.enableWorkingStatusData(dto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message,
        });
    }
    async getMaintenanceWorkingStatusesDropdown(search = '') {
        try {
            const data = await this.assetWorkingStatusService.getMaintenanceWorkingStatusesDropdown(search);
            return {
                success: true,
                message: 'Maintenance working statuses fetched successfully',
                data,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAssetTranferLocationWorkingStatusesDropdown(search = '') {
        try {
            const data = await this.assetWorkingStatusService.getAssetTranferLocationWorkingStatusesDropdown(search);
            return {
                success: true,
                message: 'Asset Location Tranfer Working statuses fetched successfully',
                data,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async fetchScrapWorkingStatusDropdown(search = '') {
        try {
            const data = await this.assetWorkingStatusService.fetchScrapWorkingStatusDropdown(search);
            return {
                success: true,
                message: 'Maintenance working statuses fetched successfully',
                data,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async exportWorkingStatusesExcel(res, dto) {
        const buffer = await this.assetWorkingStatusService.exportWorkingStatusesExcel(dto);
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
            'Content-Disposition': `attachment; filename=working-conditions-export-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
};
exports.AssetWorkingStatusController = AssetWorkingStatusController;
__decorate([
    (0, common_1.Post)('addWorkingStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_working_status_dto_1.CreateAssetWorkingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "createNewAssetWorkingStatus", null);
__decorate([
    (0, common_1.Post)('addAssetWorkingStatusesBulk'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "addAssetStatusBulk", null);
__decorate([
    (0, common_1.Post)('getAllWorkingStatuses2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "getAllWorkingStatuses2", null);
__decorate([
    (0, common_1.Get)('getWorkingStatusesDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "getWorkingStatusesDropdown", null);
__decorate([
    (0, common_1.Post)('fetch-single-working-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_working_status_dto_1.DeleteAssetWorkingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "fetchSingleAssetWorkingStatusData", null);
__decorate([
    (0, common_1.Post)('update-working-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_working_status_dto_1.UpdateAssetWorkingStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "updateWorkingStatusData", null);
__decorate([
    (0, common_1.Post)('disableWorkingStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_working_status_dto_1.DeleteAssetWorkingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "disableWorkingStatusData", null);
__decorate([
    (0, common_1.Post)('deleteWorkingStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_working_status_dto_1.DeleteAssetWorkingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "deleteWorkingStatusData", null);
__decorate([
    (0, common_1.Post)('enableWorkingStatus'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_asset_working_status_dto_1.DeleteAssetWorkingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "enableWorkingStatusData", null);
__decorate([
    (0, common_1.Get)('getMaintenanceWorkingStatusesDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "getMaintenanceWorkingStatusesDropdown", null);
__decorate([
    (0, common_1.Get)('getAssetTranferLocationStausDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "getAssetTranferLocationWorkingStatusesDropdown", null);
__decorate([
    (0, common_1.Get)('getScrapWorkingStatusDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "fetchScrapWorkingStatusDropdown", null);
__decorate([
    (0, common_1.Post)('export-working-statuses-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetWorkingStatusController.prototype, "exportWorkingStatusesExcel", null);
exports.AssetWorkingStatusController = AssetWorkingStatusController = __decorate([
    (0, common_1.Controller)('assetWorkingStatus'),
    __metadata("design:paramtypes", [asset_working_status_service_1.AssetWorkingStatusService])
], AssetWorkingStatusController);
