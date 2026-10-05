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
exports.Stock = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_datum_entity_1 = require("../../asset-data/entities/asset-datum.entity");
const location_branch_mapping_entity_1 = require("../../../organizational-profile/entity/location-branch-mapping.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_stock_serials_entity_1 = require("./asset_stock_serials.entity");
let Stock = class Stock {
};
exports.Stock = Stock;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Primary key of stock' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stock.prototype, "stock_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Stock.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum, (asset) => asset.stocks, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], Stock.prototype, "asset_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Location ID where stock is stored' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.ManyToOne)(() => location_branch_mapping_entity_1.LocationBranchMapping),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", location_branch_mapping_entity_1.LocationBranchMapping)
], Stock.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Stock.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Available quantity in stock' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 0, default: 1 }),
    __metadata("design:type", Number)
], Stock.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Active flag (1=active, 0=inactive)',
    }),
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], Stock.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Soft delete flag (1=deleted)' }),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Stock.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Stock.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Stock.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Stock.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Stock.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Stock.prototype, "created_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Stock.prototype, "updated_user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_stock_serials_entity_1.AssetStockSerials, (stock_serials) => stock_serials.stock),
    __metadata("design:type", Array)
], Stock.prototype, "stock_serials", void 0);
exports.Stock = Stock = __decorate([
    (0, typeorm_1.Entity)('stocks')
], Stock);
