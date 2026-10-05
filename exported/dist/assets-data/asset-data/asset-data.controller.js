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
exports.AssetDataController = void 0;
const common_1 = require("@nestjs/common");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const asset_data_service_1 = require("./asset-data.service");
const create_asset_datum_dto_1 = require("./dto/create-asset-datum.dto");
const update_asset_datum_dto_1 = require("./dto/update-asset-datum.dto");
let AssetDataController = class AssetDataController {
    constructor(assetDataService) {
        this.assetDataService = assetDataService;
    }
    async insertAsset(createAssetDatumDto, req) {
        const system_user_id = req.cookies.system_user_id;
        const organizationID = (0, crypto_utils_1.decrypt)(req.cookies.organization_id);
        if (!organizationID) {
            throw new common_1.BadRequestException('Organization ID not found in cookies');
        }
        const orgId = Number(organizationID);
        if (isNaN(orgId)) {
            throw new common_1.BadRequestException('Invalid decrypted organization ID');
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetDataService.getUserByPublicID(Number(decrypted_system_user_id));
        createAssetDatumDto.asset_added_by = userId;
        return await this.assetDataService.addAsset(createAssetDatumDto, orgId, userId);
    }
    async filterAssets(body, req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        console.log('POINT:C:1', branchIds);
        const data = await this.assetDataService.filterAssets(body, branchIds);
        return {
            success: true,
            message: 'Filter applied',
            data,
        };
    }
    async getFilters(req) {
        const branchIds = req.user?.branchIds || [];
        return this.assetDataService.getFilters(branchIds);
    }
    async getDropdown(req, res) {
        try {
            const itemType = req.query.item_type;
            const assetItemId = Number(req.query.asset_item_id);
            const result = await this.assetDataService.getManufacturerDropdown(itemType, assetItemId);
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
    async getSubCategoriesByCategory(manufacturer_id, res) {
        try {
            const result = await this.assetDataService.getModelByManufacturer(manufacturer_id);
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
    async printBarcodes(req, res) {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename=barcodes.pdf',
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        });
    }
    async generateAssetId(payload, req) {
        console.log('Incoming Payload:', payload);
        const result = await this.assetDataService.assetIDGenerateFormula({
            assetId: payload.assetId,
            branchId: payload.branchId,
            departmentId: payload.departmentId,
            categoryId: payload.categoryId,
            subCategoryId: payload.subCategoryId,
            itemId: payload.itemId,
        }, payload.templateId, undefined, undefined, req);
        return {
            success: true,
            generatedId: result,
        };
    }
    async generateBarcodes(dto) {
        const assetIdsArray = Array.isArray(dto.assetIds?.assetIds)
            ? dto.assetIds.assetIds
            : dto.assetIds;
        const printOptions = dto.printOptions || {};
        console.log('printOptions', printOptions);
        try {
            const results = await this.assetDataService.generateBarcodePdf(assetIdsArray, printOptions);
            return { success: true, pdf: results };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async generateQRcodes(dto, req) {
        console.log('dto', dto);
        const assetIdsArray = Array.isArray(dto.assetIds?.assetIds)
            ? dto.assetIds.assetIds
            : dto.assetIds;
        const printOptions = dto.printOptions || {};
        console.log('printOptions', printOptions);
        try {
            const results = await this.assetDataService.generateQRCodePdf(assetIdsArray, printOptions, req);
            return { success: true, pdf: results };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async printPdf(body, res) {
        return this.assetDataService.streamBarcodeOrQrPdf(body, res);
    }
    async bulkCreateAssets(dtos, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized: Missing user ID in cookies' });
            }
            const user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            this.assetDataService
                .getUserByPublicID(Number(user_id))
                .then((userId) => {
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Server error during bulk asset creation',
                error: error.message,
            });
        }
    }
    async exportAssetList(asset_main_category_id, asset_sub_category_id, asset_item_id, searchQuery = '') {
        try {
            const responseData = this.assetDataService.exportCSVData(asset_main_category_id, asset_sub_category_id, asset_item_id, searchQuery);
            return responseData;
        }
        catch (error) {
            return false;
        }
    }
    countAll() {
        return this.assetDataService.countAll();
    }
    async findSingleAsset(asset_id, asset_stocks_unique_id, stock_id, req) {
        const data = await this.assetDataService.findSingleAsset(asset_id, asset_stocks_unique_id, stock_id, req);
        return {
            status: true,
            message: 'Single asset fetched successfully',
            data,
        };
    }
    async findSingleAssetTopCard(asset_id, asset_stocks_unique_id, stock_id) {
        const data = await this.assetDataService.findSingleAssetTopCard(asset_id, asset_stocks_unique_id, stock_id);
        return {
            status: true,
            message: 'Single asset fetched successfully',
            data,
        };
    }
    async findBillingDetails(asset_id, asset_stocks_unique_id, stock_id) {
        const data = await this.assetDataService.findBillingDetails(asset_id, asset_stocks_unique_id, stock_id);
        return {
            status: true,
            message: 'Single asset fetched successfully',
            data,
        };
    }
    async updateAssetInformationFields(body) {
        const { payload, asset_stocks_unique_id } = body;
        const data = await this.assetDataService.updateAssetInformationFields(payload, asset_stocks_unique_id);
        return {
            status: true,
            message: 'Single asset fields Updated successfully',
            data,
        };
    }
    updateAssetInfo(updateAssetsDatumDto, req, res) {
        const updatedAsset = this.assetDataService.updateAssetInfo(updateAssetsDatumDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Asset Updated successfully',
        });
    }
    async getAllFieldsForQRCode() {
        const fields = await this.assetDataService.fieldForQRCode();
        return { success: true, data: fields };
    }
};
exports.AssetDataController = AssetDataController;
__decorate([
    (0, common_1.Post)('insertAsset'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_datum_dto_1.CreateAssetDatumDto, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "insertAsset", null);
__decorate([
    (0, common_1.Post)('filter'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "filterAssets", null);
__decorate([
    (0, common_1.Get)('filters1'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "getFilters", null);
__decorate([
    (0, common_1.Get)('getManufacturerDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "getDropdown", null);
__decorate([
    (0, common_1.Get)('getModelByManufacturer'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('manufacturer_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "getSubCategoriesByCategory", null);
__decorate([
    (0, common_1.Post)('print-barcodes-and-qr-codes'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "printBarcodes", null);
__decorate([
    (0, common_1.Post)('generate-asset-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "generateAssetId", null);
__decorate([
    (0, common_1.Post)('generate-barcodes'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "generateBarcodes", null);
__decorate([
    (0, common_1.Post)('generate-qr-codes'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "generateQRcodes", null);
__decorate([
    (0, common_1.Post)('print-pdf'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "printPdf", null);
__decorate([
    (0, common_1.Post)('download-template-for-bulk-assets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "bulkCreateAssets", null);
__decorate([
    (0, common_1.Get)('exportAssetList'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_main_category_id')),
    __param(1, (0, common_1.Query)('asset_sub_category_id')),
    __param(2, (0, common_1.Query)('asset_item_id')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "exportAssetList", null);
__decorate([
    (0, common_1.Get)('countAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetDataController.prototype, "countAll", null);
__decorate([
    (0, common_1.Get)('getSingleAsset'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_id')),
    __param(1, (0, common_1.Query)('asset_stocks_unique_id')),
    __param(2, (0, common_1.Query)('stock_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "findSingleAsset", null);
__decorate([
    (0, common_1.Get)('findSingleAssetTopCard'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_id')),
    __param(1, (0, common_1.Query)('asset_stocks_unique_id')),
    __param(2, (0, common_1.Query)('stock_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "findSingleAssetTopCard", null);
__decorate([
    (0, common_1.Post)('getSingleAssetBilling'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('asset_id')),
    __param(1, (0, common_1.Body)('asset_stocks_unique_id')),
    __param(2, (0, common_1.Body)('stock_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "findBillingDetails", null);
__decorate([
    (0, common_1.Post)('updateAssetFields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "updateAssetInformationFields", null);
__decorate([
    (0, common_1.Post)('getSingleAssetDetails'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('updateAssetInfo'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_datum_dto_1.UpdateAssetDatumDto, Object, Object]),
    __metadata("design:returntype", void 0)
], AssetDataController.prototype, "updateAssetInfo", null);
__decorate([
    (0, common_1.Get)('get-all-fields-for-OR-code'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetDataController.prototype, "getAllFieldsForQRCode", null);
exports.AssetDataController = AssetDataController = __decorate([
    (0, common_1.Controller)('asset-data'),
    __metadata("design:paramtypes", [asset_data_service_1.AssetDataService])
], AssetDataController);
