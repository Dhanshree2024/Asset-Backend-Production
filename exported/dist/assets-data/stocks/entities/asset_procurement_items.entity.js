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
exports.AssetProcurementItem = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const asset_procurements_entity_1 = require("./asset_procurements.entity");
const location_branch_mapping_entity_1 = require("../../../organizational-profile/entity/location-branch-mapping.entity");
let AssetProcurementItem = class AssetProcurementItem {
};
exports.AssetProcurementItem = AssetProcurementItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Primary key of procurement item',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'procurement_item_id',
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AssetProcurementItem.prototype, "procurement_item_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1001,
        description: 'Procurement master ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurementItem.prototype, "procurement_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        description: 'Asset ID linked to procurement item',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AssetProcurementItem.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetProcurementItem.prototype, "asset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10.5,
        description: 'Quantity procured',
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
], AssetProcurementItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Asset location ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurementItem.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_branch_mapping_entity_1.LocationBranchMapping),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", location_branch_mapping_entity_1.LocationBranchMapping)
], AssetProcurementItem.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T11:30:00',
        description: 'Record creation timestamp',
    }),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetProcurementItem.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_procurements_entity_1.AssetProcurement, (ap) => ap.items, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'procurement_id' }),
    __metadata("design:type", asset_procurements_entity_1.AssetProcurement)
], AssetProcurementItem.prototype, "procurement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetProcurementItem.prototype, "previous_procurement_item_id", void 0);
exports.AssetProcurementItem = AssetProcurementItem = __decorate([
    (0, typeorm_1.Entity)("asset_procurement_items")
], AssetProcurementItem);
