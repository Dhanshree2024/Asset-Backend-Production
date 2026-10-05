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
exports.AssetStockSerialsView = void 0;
const typeorm_1 = require("typeorm");
let AssetStockSerialsView = class AssetStockSerialsView {
};
exports.AssetStockSerialsView = AssetStockSerialsView;
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "stock_serials", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "system_code", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "stock_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_title", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_added_by", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_is_active", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "main_category_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_main_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_sub_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_item_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "manufacturer_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_location", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_code", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_floor", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_room", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "location_branch_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_branch_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_branch_code", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_hierarchy_text", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_hierarchy_types", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "location_hierarchy_level", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "location_full_path", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "asset_status_type_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_status_type_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "asset_status_color_code", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "working_status_type_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "working_status_type_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "procurement_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "invoice_no", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "bill_no", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Date)
], AssetStockSerialsView.prototype, "purchase_date", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "unit_price", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "ownership_status_type_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "ownership_status_type_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "target_type", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "target_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Date)
], AssetStockSerialsView.prototype, "assigned_from_date", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Date)
], AssetStockSerialsView.prototype, "assigned_to_date", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetStockSerialsView.prototype, "mapping_status_type_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetStockSerialsView.prototype, "assigned_to_name", void 0);
exports.AssetStockSerialsView = AssetStockSerialsView = __decorate([
    (0, typeorm_1.ViewEntity)('v_asset_stock_serials')
], AssetStockSerialsView);
