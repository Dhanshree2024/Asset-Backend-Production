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
exports.AssetCostCenterController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const asset_cost_center_service_1 = require("./asset-cost-center.service");
const create_cost_center_dto_1 = require("./dto/create-cost-center.dto");
const update_cost_center_dto_1 = require("./dto/update-cost-center.dto");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const tendant_and_schema_helper_1 = require("../../common/utils/tendant_and_schema.helper");
let AssetCostCenterController = class AssetCostCenterController {
    constructor(assetCostCenterService) {
        this.assetCostCenterService = assetCostCenterService;
    }
    async getAllCostCenter2(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.assetCostCenterService.getAllCostCenter2(dto, branchIds);
            return result;
        }
        catch (error) {
            console.error('Error in getAllCostCenter2:', error);
            return {
                success: false,
                message: 'An error occurred while fetching cost centers',
                error: error.message,
            };
        }
    }
    async getCostCenterDropdown(search) {
        try {
            const response = await this.assetCostCenterService.getCostCentersForDropdown();
            return {
                success: true,
                message: response.message,
                data: response.data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'An error occurred while fetching cost center dropdown',
                error: error.message,
            };
        }
    }
    async generateCostCenterCode() {
        const code = await this.assetCostCenterService.generateNextCode();
        return {
            success: true,
            code,
        };
    }
    async createNewCostCenter(body, req, res) {
        try {
            const system_user_id = req.cookies?.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id);
            const localUserId = await this.assetCostCenterService.getUserIdByRegisterLoginId(+decrypted_system_user_id);
            const response = await this.assetCostCenterService.createNewCostCenter(body, localUserId);
            return res.status(response.status).json({
                success: response.success,
                message: response.message,
                data: response.data,
            });
        }
        catch (error) {
            return res.status(error.status || 400).json({
                success: false,
                message: error.message || 'Failed to create cost center',
                data: null,
            });
        }
    }
    async updateCostCenterById(body, req, res) {
        try {
            const system_user_id = req.cookies?.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const response = await this.assetCostCenterService.updateCostCenterById(body, +decrypted_system_user_id);
            return res.status(response.status).json({
                success: response.success,
                message: response.message,
                data: response.data || null,
            });
        }
        catch (error) {
            return res.status(error.status || 400).json({
                success: false,
                message: error.message || 'Failed to update cost center',
                data: null,
            });
        }
    }
    async getCostCenterById(body, res) {
        try {
            const response = await this.assetCostCenterService.getCostCenterById(body.cost_center_id);
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: `Cost Center with ID ${body.cost_center_id} not found`,
                    data: null,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Cost Center retrieved successfully',
                data: response,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Failed to fetch cost center',
                data: null,
            });
        }
    }
    async activateCostCenters(body, res, req) {
        const { ids = [], isSelectAll = false, excludeIds = [], filters, ...rest } = body;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized: No user ID found',
            });
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!isSelectAll && ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'ids must be a non-empty array when not in Select All mode',
                });
            }
            const dto = { ...rest, ids, isSelectAll, excludeIds, filters };
            const result = await this.assetCostCenterService.activateCostCenters(dto, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error activating cost centers:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to activate cost centers',
                error: error.message || error,
            });
        }
    }
    async deactivateCostCenters(body, res, req) {
        const { ids = [], isSelectAll = false, excludeIds = [], filters, ...rest } = body;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized: No user ID found',
            });
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!isSelectAll && ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'ids must be a non-empty array when not in Select All mode',
                });
            }
            const dto = { ...rest, ids, isSelectAll, excludeIds, filters };
            const result = await this.assetCostCenterService.deactivateCostCenters(dto, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating cost centers:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivate cost centers',
                error: error.message || error,
            });
        }
    }
    async deleteCostCenters(body, res, req) {
        const { ids = [], isSelectAll = false, excludeIds = [], filters, ...rest } = body;
        try {
            if (!isSelectAll && ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'ids must be a non-empty array when not in Select All mode',
                });
            }
            const dto = { ...rest, ids, isSelectAll, excludeIds, filters };
            const result = await this.assetCostCenterService.deleteCostCenters(dto);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deleting cost centers:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to delete cost centers',
                error: error.message || error,
            });
        }
    }
    async exportCostCentersToExcel(res, dto) {
        const buffer = await this.assetCostCenterService.exportCostCentersToExcel(dto);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=cost-centers-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async generateCostCenterTemplate(req, res) {
        try {
            const buffer = await this.assetCostCenterService.generateCostCenterTemplate();
            res.setHeader('Content-Disposition', 'attachment; filename=cost_center_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating Cost Center template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async bulkCreateCostCenters(dtos, req) {
        const encryptedSystemUserId = req.cookies.system_user_id;
        const encryptedOrganizationId = req.cookies.organization_id;
        const decryptedSystemUserId = (0, crypto_utils_1.decrypt)(encryptedSystemUserId?.toString());
        const decryptedOrganizationId = (0, crypto_utils_1.decrypt)(encryptedOrganizationId?.toString());
        if (!decryptedOrganizationId) {
            console.error('Organization ID not found in cookies');
            throw new common_1.BadRequestException('Organization ID not found in cookies');
        }
        const organizationId = Number(decryptedOrganizationId);
        if (isNaN(organizationId)) {
            console.error('Invalid decrypted organization ID:', decryptedOrganizationId);
            throw new common_1.BadRequestException('Invalid decrypted organization ID');
        }
        if (!decryptedSystemUserId) {
            console.error('Invalid or missing decrypted system user ID');
            throw new common_1.UnauthorizedException('Unauthorized: Invalid or missing user ID.');
        }
        const localUserId = await this.assetCostCenterService.getUserIdByRegisterLoginId(+decryptedSystemUserId);
        try {
            const result = await this.assetCostCenterService.bulkCreateCostCenters(dtos, organizationId, +localUserId);
            return {
                statusCode: result.status,
                message: result.message,
                data: result.data,
            };
        }
        catch (error) {
            console.error('Error in bulk create cost centers:', error);
            throw new common_1.InternalServerErrorException('Failed to create cost centers in bulk.');
        }
    }
};
exports.AssetCostCenterController = AssetCostCenterController;
__decorate([
    (0, common_1.Post)("get-all-cost-centers"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "getAllCostCenter2", null);
__decorate([
    (0, common_1.Get)('get-cost-center-dropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "getCostCenterDropdown", null);
__decorate([
    (0, common_1.Get)('generate-code'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "generateCostCenterCode", null);
__decorate([
    (0, common_1.Post)('create-new-cost-center'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cost_center_dto_1.CreateCostCenterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "createNewCostCenter", null);
__decorate([
    (0, common_1.Post)('update-cost-center-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cost_center_dto_1.UpdateCostCenterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "updateCostCenterById", null);
__decorate([
    (0, common_1.Post)('get-cost-center-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "getCostCenterById", null);
__decorate([
    (0, common_1.Post)('activate-cost-centers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "activateCostCenters", null);
__decorate([
    (0, common_1.Post)('deactivate-cost-centers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "deactivateCostCenters", null);
__decorate([
    (0, common_1.Post)('delete-cost-centers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "deleteCostCenters", null);
__decorate([
    (0, common_1.Post)('export-cost-centers-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "exportCostCentersToExcel", null);
__decorate([
    (0, common_1.Get)('download-cost-center-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "generateCostCenterTemplate", null);
__decorate([
    (0, common_1.Post)('create-bulk-cost-centers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AssetCostCenterController.prototype, "bulkCreateCostCenters", null);
exports.AssetCostCenterController = AssetCostCenterController = __decorate([
    (0, common_1.Controller)('asset-cost-center'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [asset_cost_center_service_1.AssetCostCenterService])
], AssetCostCenterController);
