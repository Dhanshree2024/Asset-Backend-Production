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
exports.AssetScrap = void 0;
const typeorm_1 = require("typeorm");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../../assets-data/asset-data/entities/asset-datum.entity");
const assets_status_entity_1 = require("../../assets-data/assets-status/entities/assets-status.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const organizational_vendors_entity_1 = require("../../organizational-profile/entity/organizational-vendors.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
let AssetScrap = class AssetScrap {
};
exports.AssetScrap = AssetScrap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetScrap.prototype, "scrap_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "scrap_ref_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_stocks_unique_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials),
    (0, typeorm_1.JoinColumn)({
        name: 'asset_stocks_unique_id',
        referencedColumnName: 'asset_stocks_unique_id',
    }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetScrap.prototype, "asset_serial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_mapping_entity_1.AssetMappingRepository),
    (0, typeorm_1.JoinColumn)({ name: 'mapping_id', referencedColumnName: 'mapping_id' }),
    __metadata("design:type", asset_mapping_entity_1.AssetMappingRepository)
], AssetScrap.prototype, "asset_mapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id', referencedColumnName: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetScrap.prototype, "asset_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "scrap_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssetScrap.prototype, "scrap_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AssetScrap.prototype, "asset_condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "asset_working_condition_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus),
    (0, typeorm_1.JoinColumn)({
        name: 'asset_working_condition_id',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetScrap.prototype, "working_status_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AssetScrap.prototype, "disposal_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "vendor_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "pickup_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scrap_value', type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "scrap_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "reference_invoice_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "certificate_of_disposal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "donated_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "handover_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "donation_asset_condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "donation_letter_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "authorization_approval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "auction_reference_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "auction_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'final_auction_value', type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "final_auction_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "buyer_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "approval_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "scrapped_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetScrap.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "status_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assets_status_entity_1.AssetsStatus),
    (0, typeorm_1.JoinColumn)({ name: 'status_type_id', referencedColumnName: 'status_type_id' }),
    __metadata("design:type", assets_status_entity_1.AssetsStatus)
], AssetScrap.prototype, "status_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], AssetScrap.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetScrap.prototype, "vendor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_vendors_entity_1.OrganizationVendors),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id', referencedColumnName: 'vendor_id' }),
    __metadata("design:type", organizational_vendors_entity_1.OrganizationVendors)
], AssetScrap.prototype, "vendor_info", void 0);
exports.AssetScrap = AssetScrap = __decorate([
    (0, typeorm_1.Entity)('asset_scrap')
], AssetScrap);
