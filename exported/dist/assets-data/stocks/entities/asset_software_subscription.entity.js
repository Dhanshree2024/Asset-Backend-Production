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
exports.AssetSoftwareSubscription = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_stock_serials_entity_1 = require("./asset_stock_serials.entity");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
const stocks_entity_1 = require("./stocks.entity");
const asset_procurements_entity_1 = require("./asset_procurements.entity");
const asset_item_enums_1 = require("../../asset-items/entities/asset-item.enums");
let AssetSoftwareSubscription = class AssetSoftwareSubscription {
};
exports.AssetSoftwareSubscription = AssetSoftwareSubscription;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1001,
        description: 'Unique asset stock serial reference (PK & FK)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.PrimaryColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", Number)
], AssetSoftwareSubscription.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_id', nullable: true }),
    __metadata("design:type", Number)
], AssetSoftwareSubscription.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'stock_id', nullable: true }),
    __metadata("design:type", Number)
], AssetSoftwareSubscription.prototype, "stock_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_item_id', nullable: true }),
    __metadata("design:type", Number)
], AssetSoftwareSubscription.prototype, "asset_item_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'procurement_id', nullable: true }),
    __metadata("design:type", Number)
], AssetSoftwareSubscription.prototype, "procurement_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['AMC'],
        enum: asset_item_enums_1.WarrantyType,
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(asset_item_enums_1.WarrantyType, { each: true }),
    (0, typeorm_1.Column)({
        name: 'warranty_category',
        type: 'enum',
        enum: asset_item_enums_1.WarrantyType,
        enumName: 'warranty_type_enum',
        array: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], AssetSoftwareSubscription.prototype, "warranty_category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({
        name: 'sub_start_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetSoftwareSubscription.prototype, "sub_start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({
        name: 'next_renewal_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetSoftwareSubscription.prototype, "next_renewal_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'subscription' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'subscription_type',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetSoftwareSubscription.prototype, "subscription_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Monthly' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'billing_frequency',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetSoftwareSubscription.prototype, "billing_frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.OneToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetSoftwareSubscription.prototype, "asset_stock_serial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetSoftwareSubscription.prototype, "asset_data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => stocks_entity_1.Stock, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stocks_entity_1.Stock)
], AssetSoftwareSubscription.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_item_id' }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], AssetSoftwareSubscription.prototype, "asset_item", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_procurements_entity_1.AssetProcurement, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'procurement_id' }),
    __metadata("design:type", asset_procurements_entity_1.AssetProcurement)
], AssetSoftwareSubscription.prototype, "procurement", void 0);
exports.AssetSoftwareSubscription = AssetSoftwareSubscription = __decorate([
    (0, typeorm_1.Entity)('asset_software_subscription')
], AssetSoftwareSubscription);
