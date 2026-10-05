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
exports.AssetItemsFieldsMappingController = void 0;
const common_1 = require("@nestjs/common");
const asset_items_fields_mapping_service_1 = require("./asset-items-fields-mapping.service");
const create_asset_items_fields_mapping_dto_1 = require("./dto/create-asset-items-fields-mapping.dto");
const update_asset_items_fields_mapping_dto_1 = require("./dto/update-asset-items-fields-mapping.dto");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
let AssetItemsFieldsMappingController = class AssetItemsFieldsMappingController {
    constructor(assetItemsFieldsMappingService) {
        this.assetItemsFieldsMappingService = assetItemsFieldsMappingService;
    }
    create(createAssetItemsFieldsMappingDto) {
        return this.assetItemsFieldsMappingService.create(createAssetItemsFieldsMappingDto);
    }
    async insertItemFields(createAssetItemFieldsMappingDto, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res
                    .status(400)
                    .json({ message: 'User ID not found in cookies' });
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            console.log('userId Check Item ', decrypted_system_user_id);
            const userId = await this.assetItemsFieldsMappingService.getUserByPublicID(Number(decrypted_system_user_id));
            console.log('userId', userId);
            createAssetItemFieldsMappingDto.forEach((item) => {
                if (item && typeof item === 'object') {
                    item.aif_added_by = userId;
                }
            });
            const result = await this.assetItemsFieldsMappingService.addItemFields(createAssetItemFieldsMappingDto);
            return res.status(200).json({ result });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    findAll() {
        return this.assetItemsFieldsMappingService.findAll();
    }
    countAll() {
        return this.assetItemsFieldsMappingService.countAll();
    }
    findItemFields(asset_item_id, searchQuery, customFiltersStr, sortOrder) {
        let parsedFilters = {};
        if (customFiltersStr) {
            try {
                parsedFilters = JSON.parse(customFiltersStr);
            }
            catch (err) {
                throw new common_1.BadRequestException('Invalid customFilters JSON');
            }
        }
        return this.assetItemsFieldsMappingService.findItemFields(asset_item_id, searchQuery, parsedFilters, sortOrder);
    }
    findOne(id) {
        return this.assetItemsFieldsMappingService.findOne(+id);
    }
    update(id, updateAssetItemsFieldsMappingDto) {
        return this.assetItemsFieldsMappingService.update(+id, updateAssetItemsFieldsMappingDto);
    }
    remove(id) {
        return this.assetItemsFieldsMappingService.remove(+id);
    }
};
exports.AssetItemsFieldsMappingController = AssetItemsFieldsMappingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_items_fields_mapping_dto_1.CreateAssetItemsFieldsMappingDto]),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('insertItemFields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetItemsFieldsMappingController.prototype, "insertItemFields", null);
__decorate([
    (0, common_1.Get)('getAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('countAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "countAll", null);
__decorate([
    (0, common_1.Get)('findItemFields'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_item_id')),
    __param(1, (0, common_1.Query)('searchQuery')),
    __param(2, (0, common_1.Query)('customFilters')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "findItemFields", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asset_items_fields_mapping_dto_1.UpdateAssetItemsFieldsMappingDto]),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetItemsFieldsMappingController.prototype, "remove", null);
exports.AssetItemsFieldsMappingController = AssetItemsFieldsMappingController = __decorate([
    (0, common_1.Controller)('assetItemsFieldsMapping'),
    __metadata("design:paramtypes", [asset_items_fields_mapping_service_1.AssetItemsFieldsMappingService])
], AssetItemsFieldsMappingController);
