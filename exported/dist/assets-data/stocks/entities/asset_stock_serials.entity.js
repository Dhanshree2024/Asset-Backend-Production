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
exports.AssetStockSerials = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const asset_mapping_entity_1 = require("../../../asset-mapping/entities/asset-mapping.entity");
const asset_cost_center_entity_1 = require("../../asset-cost-center/entities/asset-cost-center.entity");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const asset_status_types_entity_1 = require("../../asset-fields/entities/asset-status-types.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
const asset_working_status_entity_1 = require("../../asset-working-status/entities/asset-working-status.entity");
const assets_project_entity_1 = require("../../assets-projects/entities/assets-project.entity");
const location_branch_mapping_entity_1 = require("../../../organizational-profile/entity/location-branch-mapping.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_procurement_items_entity_1 = require("./asset_procurement_items.entity");
const stocks_entity_1 = require("./stocks.entity");
let AssetStockSerials = class AssetStockSerials {
};
exports.AssetStockSerials = AssetStockSerials;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for asset stock serial',
        example: 101,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset master ID',
        example: 10,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetStockSerials.prototype, "asset_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock ID',
        example: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'stock_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "stock_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stocks_entity_1.Stock, (stock) => stock.stock_serials),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stocks_entity_1.Stock)
], AssetStockSerials.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current location (location_branch_mapping.location_mapping_id)',
        example: 12,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'location_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_branch_mapping_entity_1.LocationBranchMapping),
    (0, typeorm_1.JoinColumn)({
        name: 'location_id',
        referencedColumnName: 'location_mapping_id',
    }),
    __metadata("design:type", location_branch_mapping_entity_1.LocationBranchMapping)
], AssetStockSerials.prototype, "location_mapping", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Asset item ID (for itemized assets)',
        example: 22,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_item_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem),
    (0, typeorm_1.JoinColumn)({ name: 'asset_item_id' }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], AssetStockSerials.prototype, "asset_item", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Stock serial number',
        example: 'SN-AX92-8890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'stock_serials', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "stock_serials", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'asset_image',
        example: 'uploads/cfgvg/b',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'asset_image', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "asset_image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal system generated code',
        example: 'SYS-000123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'system_code', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "system_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'asset_serial_title', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "asset_serial_title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional asset information in text format',
        example: 'RAM 16GB, SSD 512GB',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'information_fields', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "information_fields", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'source_device_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "source_device_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'discovered_mac', type: 'macaddr', nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "discovered_mac", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Impact overlay status (NONE | IMPACTED)',
        example: 'NONE',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'impact_status', type: 'varchar', length: 12, default: 'NONE' }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "impact_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent asset serial ID that caused this asset to be impacted',
        example: 101,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'impacted_by_serial_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "impacted_by_serial_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for impact (e.g. PARENT_UNDER_MAINTENANCE, PARENT_DAMAGED)',
        example: 'PARENT_UNDER_MAINTENANCE',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'impact_reason', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetStockSerials.prototype, "impact_reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project ID reference',
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'project_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assets_project_entity_1.AssetsProject),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", assets_project_entity_1.AssetsProject)
], AssetStockSerials.prototype, "asset_project", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cost center reference',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'cost_center_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "cost_center_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_cost_center_entity_1.AssetCostCenter),
    (0, typeorm_1.JoinColumn)({ name: 'cost_center_id' }),
    __metadata("design:type", asset_cost_center_entity_1.AssetCostCenter)
], AssetStockSerials.prototype, "asset_cost_center", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Procurement item reference',
        example: 77,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'procurement_item_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "procurement_item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_procurement_items_entity_1.AssetProcurementItem),
    (0, typeorm_1.JoinColumn)({ name: 'procurement_item_id' }),
    __metadata("design:type", asset_procurement_items_entity_1.AssetProcurementItem)
], AssetStockSerials.prototype, "procurement_item", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current asset status ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'current_status_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "current_status_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_status_types_entity_1.AssetStatusTypes),
    (0, typeorm_1.JoinColumn)({ name: 'current_status_id' }),
    __metadata("design:type", asset_status_types_entity_1.AssetStatusTypes)
], AssetStockSerials.prototype, "current_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created timestamp',
        example: '2024-01-20T10:30:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetStockSerials.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who created the record',
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetStockSerials.prototype, "created_by_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active flag (1 = active, 0 = inactive)',
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Soft delete flag (1 = deleted, 0 = not deleted)',
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Asset working condition ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetStockSerials.prototype, "working_status_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus, { nullable: true }),
    (0, typeorm_1.JoinColumn)({
        name: 'working_status_type_id',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetStockSerials.prototype, "asset_working_status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_mapping_entity_1.AssetMappingRepository, (mapping) => mapping.stock_serial),
    __metadata("design:type", Array)
], AssetStockSerials.prototype, "asset_mappings", void 0);
exports.AssetStockSerials = AssetStockSerials = __decorate([
    (0, typeorm_1.Entity)('asset_stock_serials')
], AssetStockSerials);
