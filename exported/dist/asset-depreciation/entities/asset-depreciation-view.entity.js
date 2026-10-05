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
exports.AssetDepreciationViewEntity = void 0;
const typeorm_1 = require("typeorm");
let AssetDepreciationViewEntity = class AssetDepreciationViewEntity {
};
exports.AssetDepreciationViewEntity = AssetDepreciationViewEntity;
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "system_code", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "asset_title", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "asset_item_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "main_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "sub_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "block_id_company", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "block_id_it", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "block_name_company", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "block_name_it", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "buy_price", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: "depreciation_start_date" }),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "depreciation_start_date", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_depreciation_rate", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_act_depreciation_rate", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_act_residual_value", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_act_residual_value", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_act_asset_life", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_act_asset_life", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "asset_type", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Boolean)
], AssetDepreciationViewEntity.prototype, "is_half_year_it", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_y1_fraction", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetDepreciationViewEntity.prototype, "fy_label", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "year_number", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_opening_wdv", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_depreciation", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "it_closing_wdv", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_opening_wdv", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_depreciation", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "company_closing_wdv", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "location_mapping_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationViewEntity.prototype, "location_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'it_active' }),
    __metadata("design:type", Boolean)
], AssetDepreciationViewEntity.prototype, "it_active", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'company_active' }),
    __metadata("design:type", Boolean)
], AssetDepreciationViewEntity.prototype, "company_active", void 0);
exports.AssetDepreciationViewEntity = AssetDepreciationViewEntity = __decorate([
    (0, typeorm_1.ViewEntity)({
        name: 'asset_depreciation_serial_view',
    })
], AssetDepreciationViewEntity);
