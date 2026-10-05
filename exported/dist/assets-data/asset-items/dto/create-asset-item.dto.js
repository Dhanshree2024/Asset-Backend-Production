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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssetItemNewDto = void 0;
const class_validator_1 = require("class-validator");
const asset_category_entity_1 = require("../../asset-categories/entities/asset-category.entity");
const asset_subcategory_entity_1 = require("../../asset-subcategories/entities/asset-subcategory.entity");
const typeorm_1 = require("typeorm");
const asset_item_enums_1 = require("../entities/asset-item.enums");
class CreateAssetItemNewDto {
}
exports.CreateAssetItemNewDto = CreateAssetItemNewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "asset_item_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "asset_item_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "asset_item_icon", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "main_category_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(asset_item_enums_1.ItemType),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "item_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(asset_item_enums_1.AssetType),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "asset_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "asset_block", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "asset_block_it", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(asset_item_enums_1.WarrantyType, { each: true }),
    __metadata("design:type", Array)
], CreateAssetItemNewDto.prototype, "warranty_type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "is_licensable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(asset_item_enums_1.LicenseMetric),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "license_metric", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "has_depreciation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "upload_documents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "import_barcode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "has_serials", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetItemNewDto.prototype, "has_warranty", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "company_act_asset_life", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "it_act_asset_life", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "company_depreciation_rate", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "it_act_depreciation_rate", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "company_act_residual_value", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.has_depreciation),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "it_act_residual_value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "preffered_method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetItemNewDto.prototype, "parent_organization_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetItemNewDto.prototype, "added_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateAssetItemNewDto.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_category_entity_1.AssetCategory, category => category.main_category_id),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", asset_category_entity_1.AssetCategory)
], CreateAssetItemNewDto.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_subcategory_entity_1.AssetSubcategory, subCategory => subCategory.sub_category_id),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", asset_subcategory_entity_1.AssetSubcategory)
], CreateAssetItemNewDto.prototype, "subCategory", void 0);
