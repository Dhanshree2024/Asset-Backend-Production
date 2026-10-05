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
exports.LocationTransferController = void 0;
const common_1 = require("@nestjs/common");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const tendant_and_schema_helper_1 = require("../common/utils/tendant_and_schema.helper");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const source_location_dto_1 = require("./dto/source-location.dto");
const location_transfer_service_1 = require("./location-transfer.service");
let LocationTransferController = class LocationTransferController {
    constructor(locationTransferService) {
        this.locationTransferService = locationTransferService;
    }
    async addToLocationTransferListController(body, req) {
        const { transferIds, mode, isSelectAll, filters, excludeIds, expectedCount } = body;
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        const system_user_id = req.cookies?.system_user_id;
        if (!system_user_id) {
            return { success: false, message: 'User not authenticated' };
        }
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.locationTransferService.getUserByPublicID(Number(decrypted_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        return this.locationTransferService.addToLocationTransferListService(userId, transferIds, mode, schema, isSelectAll, filters, branchIds, excludeIds, expectedCount);
    }
    async getAllProjects2(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.locationTransferService.getAllLocationTransferAssetsList(dto);
            return result;
        }
        catch (error) {
            console.error('Error in getAllProjects2:', error);
            return {
                success: false,
                message: 'An error occurred while fetching location transfers',
                error: error.message,
            };
        }
    }
    async completeAllAssetsLocationTransfersController(body, req) {
        const { dtos } = body;
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        const system_user_id = req.cookies?.system_user_id;
        if (!system_user_id) {
            return { success: false, message: 'User not authenticated' };
        }
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.locationTransferService.getUserByPublicID(Number(decrypted_user_id));
        return this.locationTransferService.completeAllAssetsLocationTransfers(userId, schema, dtos);
    }
    async getMultipleTransferRecords(body, req) {
        const { location_transfer_ids } = body;
        return this.locationTransferService.getMultipleLocationTransfers(location_transfer_ids);
    }
    async getLocationTransferDetail(body, req) {
        const { location_transfer_id } = body;
        return this.locationTransferService.getLocationTransferDetail(location_transfer_id);
    }
    async addSourceLocationForBlockedAssets(body, req) {
        const { sourceLocationId, asset_stocks_unique_ids } = body;
        if (!sourceLocationId) {
            return {
                success: false,
                message: 'Source location ID is required',
            };
        }
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        return await this.locationTransferService.addSourceLocationForBlockedAssets(sourceLocationId, asset_stocks_unique_ids, schema);
    }
    async exportLocationTransfers(res, dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const buffer = await this.locationTransferService.exportLocationTransfersToExcel(dto);
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
                'Content-Disposition': `attachment; filename=location-transfers-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportLocationTransfers:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while exporting location transfers',
                error: error.message,
            });
        }
    }
    async getTransferImpactPreview(body, req) {
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        return this.locationTransferService.getTransferImpactPreview(schema, Number(body.asset_stocks_unique_id), Number(body.to_location_id));
    }
};
exports.LocationTransferController = LocationTransferController;
__decorate([
    (0, common_1.Post)('add-assests-in-location-transfer-list'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "addToLocationTransferListController", null);
__decorate([
    (0, common_1.Post)('get-all-location-transfers-assets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "getAllProjects2", null);
__decorate([
    (0, common_1.Post)('make-all-location-transfers-complete'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "completeAllAssetsLocationTransfersController", null);
__decorate([
    (0, common_1.Post)('get-multiple-location-transfers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "getMultipleTransferRecords", null);
__decorate([
    (0, common_1.Post)('get-single-location-transfers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "getLocationTransferDetail", null);
__decorate([
    (0, common_1.Post)('add-source-location-for-blocked-assets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [source_location_dto_1.AddSourceLocationDto, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "addSourceLocationForBlockedAssets", null);
__decorate([
    (0, common_1.Post)('export-location-transfers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "exportLocationTransfers", null);
__decorate([
    (0, common_1.Post)('impact-preview'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationTransferController.prototype, "getTransferImpactPreview", null);
exports.LocationTransferController = LocationTransferController = __decorate([
    (0, common_1.Controller)('location-transfer'),
    __metadata("design:paramtypes", [location_transfer_service_1.LocationTransferService])
], LocationTransferController);
