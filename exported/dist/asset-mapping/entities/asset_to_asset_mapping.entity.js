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
exports.AssetToAssetMapping = void 0;
const typeorm_1 = require("typeorm");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
let AssetToAssetMapping = class AssetToAssetMapping {
};
exports.AssetToAssetMapping = AssetToAssetMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'mapping_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetToAssetMapping.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetToAssetMapping.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_serials', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetToAssetMapping.prototype, "stock_serials", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetToAssetMapping.prototype, "asset_stock", void 0);
exports.AssetToAssetMapping = AssetToAssetMapping = __decorate([
    (0, typeorm_1.Entity)('asset_to_asset_mapping')
], AssetToAssetMapping);
