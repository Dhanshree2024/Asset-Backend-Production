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
exports.AssetSoftwaresView = void 0;
const typeorm_1 = require("typeorm");
let AssetSoftwaresView = class AssetSoftwaresView {
};
exports.AssetSoftwaresView = AssetSoftwaresView;
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetSoftwaresView.prototype, "asset_item_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetSoftwaresView.prototype, "main_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetSoftwaresView.prototype, "sub_category_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "total_asset_quantity", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "total_assigned_quantity", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "total_in_stock_quantity", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "total_scrap_quantity", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], AssetSoftwaresView.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Array)
], AssetSoftwaresView.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetSoftwaresView.prototype, "manufacturer_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], AssetSoftwaresView.prototype, "model_name", void 0);
exports.AssetSoftwaresView = AssetSoftwaresView = __decorate([
    (0, typeorm_1.ViewEntity)('view_softwares')
], AssetSoftwaresView);
