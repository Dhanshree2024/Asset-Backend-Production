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
exports.AssetMaintenance = void 0;
const typeorm_1 = require("typeorm");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../../assets-data/asset-data/entities/asset-datum.entity");
const assets_status_entity_1 = require("../../assets-data/assets-status/entities/assets-status.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
let AssetMaintenance = class AssetMaintenance {
};
exports.AssetMaintenance = AssetMaintenance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'maintenance_id' }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "maintenance_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'maintenance_ref_id', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "maintenance_ref_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mapping_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_stocks_unique_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials),
    (0, typeorm_1.JoinColumn)({
        name: 'asset_stocks_unique_id',
        referencedColumnName: 'asset_stocks_unique_id',
    }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetMaintenance.prototype, "asset_serial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_mapping_entity_1.AssetMappingRepository),
    (0, typeorm_1.JoinColumn)({ name: 'mapping_id', referencedColumnName: 'mapping_id' }),
    __metadata("design:type", asset_mapping_entity_1.AssetMappingRepository)
], AssetMaintenance.prototype, "asset_mapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id', referencedColumnName: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetMaintenance.prototype, "asset_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_display_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "asset_display_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'maintenance_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "maintenance_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status_type_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "status_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assets_status_entity_1.AssetsStatus),
    (0, typeorm_1.JoinColumn)({ name: 'status_type_id', referencedColumnName: 'status_type_id' }),
    __metadata("design:type", assets_status_entity_1.AssetsStatus)
], AssetMaintenance.prototype, "status_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_working_condition_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "asset_working_condition_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus),
    (0, typeorm_1.JoinColumn)({
        name: 'asset_working_condition_id',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetMaintenance.prototype, "working_status_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_date', type: 'date' }),
    __metadata("design:type", Date)
], AssetMaintenance.prototype, "scheduled_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AssetMaintenance.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AssetMaintenance.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'managed_by', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "managed_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_cost', type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "estimated_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_cost', type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "actual_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AssetMaintenance.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetMaintenance.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetMaintenance.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetMaintenance.prototype, "is_deleted", void 0);
exports.AssetMaintenance = AssetMaintenance = __decorate([
    (0, typeorm_1.Entity)('asset_maintenance')
], AssetMaintenance);
