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
exports.AssetProcurement = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_ownership_status_types_entity_1 = require("../../asset-fields/entities/asset-ownership-status-types.entity");
const stocks_entity_1 = require("./stocks.entity");
const organizational_vendors_entity_1 = require("../../../organizational-profile/entity/organizational-vendors.entity");
const asset_working_status_entity_1 = require("../../asset-working-status/entities/asset-working-status.entity");
const asset_item_enums_1 = require("../../asset-items/entities/asset-item.enums");
const asset_procurement_items_entity_1 = require("./asset_procurement_items.entity");
let AssetProcurement = class AssetProcurement {
};
exports.AssetProcurement = AssetProcurement;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Primary key of asset procurement',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'procurement_id',
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "procurement_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 101,
        description: 'Asset ID for which procurement is done',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetProcurement.prototype, "asset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 12,
        description: 'Vendor ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "vendor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_vendors_entity_1.OrganizationVendors),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", organizational_vendors_entity_1.OrganizationVendors)
], AssetProcurement.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'INV-2025-001',
        description: 'Invoice number',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetProcurement.prototype, "invoice_no", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'BILL-9981',
        description: 'Bill number',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetProcurement.prototype, "bill_no", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-02-01',
        description: 'Purchase date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetProcurement.prototype, "purchase_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 25000.5,
        description: 'Unit price',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "unit_price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 18,
        description: 'GST percentage',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "gst_percent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 4500,
        description: 'GST amount',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "gst_amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 29500.5,
        description: 'Total procurement amount',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "total_amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 29500.5,
        description: 'Total procurement amount',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "total_without_gst", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'invoice_2025.pdf',
        description: 'Uploaded document reference',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetProcurement.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 2,
        description: 'Ownership status type ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "ownership_status_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes),
    (0, typeorm_1.JoinColumn)({
        name: 'ownership_status_id',
        referencedColumnName: 'ownership_status_type_id',
    }),
    __metadata("design:type", asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes)
], AssetProcurement.prototype, "ownership_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { expiryDate: '2026-02-01', type: 'Annual' },
        description: 'License details JSON',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AssetProcurement.prototype, "license_details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5,
        description: 'Stock ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "stock_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stocks_entity_1.Stock),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stocks_entity_1.Stock)
], AssetProcurement.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T10:30:00',
        description: 'Created timestamp',
    }),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetProcurement.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'User who created the procurement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'User who created the procurement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetProcurement.prototype, "is_prorated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetProcurement.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "previous_procurement_id", void 0);
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
], AssetProcurement.prototype, "warranty_category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01T00:00:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)({
        name: 'sub_start_date',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetProcurement.prototype, "sub_start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-01-01T00:00:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)({
        name: 'next_renewal_date',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetProcurement.prototype, "next_renewal_date", void 0);
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
], AssetProcurement.prototype, "subscription_type", void 0);
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
], AssetProcurement.prototype, "billing_frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 23,
        description: 'Renewal status of procurement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurement.prototype, "renewal_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus),
    (0, typeorm_1.JoinColumn)({
        name: 'renewal_status',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetProcurement.prototype, "renewal_status_details", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetProcurement.prototype, "created_by_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AssetProcurement, (procurement) => procurement.procurement_id),
    (0, typeorm_1.JoinColumn)({ name: 'procurement_id' }),
    __metadata("design:type", AssetProcurement)
], AssetProcurement.prototype, "procurement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_procurement_items_entity_1.AssetProcurementItem, (item) => item.procurement),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "items", void 0);
exports.AssetProcurement = AssetProcurement = __decorate([
    (0, typeorm_1.Entity)("asset_procurements")
], AssetProcurement);
