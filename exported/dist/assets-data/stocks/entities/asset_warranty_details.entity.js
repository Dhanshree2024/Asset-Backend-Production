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
exports.AssetWarrantyDetailsRepository = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_stock_serials_entity_1 = require("./asset_stock_serials.entity");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
const stocks_entity_1 = require("./stocks.entity");
const organizational_vendors_entity_1 = require("../../../organizational-profile/entity/organizational-vendors.entity");
const asset_procurements_entity_1 = require("./asset_procurements.entity");
const asset_item_enums_1 = require("../../asset-items/entities/asset-item.enums");
let AssetWarrantyDetailsRepository = class AssetWarrantyDetailsRepository {
};
exports.AssetWarrantyDetailsRepository = AssetWarrantyDetailsRepository;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1001,
        description: 'Unique asset stock serial reference (PK & FK)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.PrimaryColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_id', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'stock_id', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "stock_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_item_id', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "asset_item_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'procurement_id', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "procurement_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['AMC', 'SUPPORT'],
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
], AssetWarrantyDetailsRepository.prototype, "warranty_category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'warranty_in_year', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "warranty_in_year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'years' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'warranty_duration_type',
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetWarrantyDetailsRepository.prototype, "warranty_duration_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'warranty_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetWarrantyDetailsRepository.prototype, "warranty_start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2027-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'warranty_end_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetWarrantyDetailsRepository.prototype, "warranty_end_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'EMAIL',
        description: 'Support type enum value',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'support_type',
        type: 'enum',
        enumName: 'support_type_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetWarrantyDetailsRepository.prototype, "support_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Annual support contract' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'support_contract', nullable: true }),
    __metadata("design:type", String)
], AssetWarrantyDetailsRepository.prototype, "support_contract", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '456789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'contract_number', nullable: true }),
    __metadata("design:type", String)
], AssetWarrantyDetailsRepository.prototype, "contract_number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'amc_vendor', nullable: true }),
    __metadata("design:type", Number)
], AssetWarrantyDetailsRepository.prototype, "amc_vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'YEARLY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    (0, typeorm_1.Column)({ name: 'amc_frequency', length: 20, nullable: true }),
    __metadata("design:type", String)
], AssetWarrantyDetailsRepository.prototype, "amc_frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-06-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'last_service_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetWarrantyDetailsRepository.prototype, "last_service_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-06-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'next_service_due_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetWarrantyDetailsRepository.prototype, "next_service_due_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Linked asset stock serial' }),
    (0, typeorm_1.OneToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetWarrantyDetailsRepository.prototype, "asset_stock_serial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetWarrantyDetailsRepository.prototype, "asset_data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => stocks_entity_1.Stock, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stocks_entity_1.Stock)
], AssetWarrantyDetailsRepository.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_item_id' }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], AssetWarrantyDetailsRepository.prototype, "asset_item", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => organizational_vendors_entity_1.OrganizationVendors, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'amc_vendor' }),
    __metadata("design:type", organizational_vendors_entity_1.OrganizationVendors)
], AssetWarrantyDetailsRepository.prototype, "amcVendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToOne)(() => asset_procurements_entity_1.AssetProcurement, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'procurement_id' }),
    __metadata("design:type", asset_procurements_entity_1.AssetProcurement)
], AssetWarrantyDetailsRepository.prototype, "procurement", void 0);
exports.AssetWarrantyDetailsRepository = AssetWarrantyDetailsRepository = __decorate([
    (0, typeorm_1.Entity)('asset_warranty_details')
], AssetWarrantyDetailsRepository);
