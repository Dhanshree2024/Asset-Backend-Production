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
exports.AssetItemsRelation = exports.RelationType = void 0;
const typeorm_1 = require("typeorm");
const asset_stock_serials_entity_1 = require("../../stocks/entities/asset_stock_serials.entity");
var RelationType;
(function (RelationType) {
    RelationType["Other"] = "Other";
    RelationType["Accessory"] = "Accessory";
    RelationType["Contract"] = "Contract";
    RelationType["Application"] = "Application";
})(RelationType || (exports.RelationType = RelationType = {}));
let AssetItemsRelation = class AssetItemsRelation {
};
exports.AssetItemsRelation = AssetItemsRelation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "relation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "parent_serial_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "child_serial_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_serial_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetItemsRelation.prototype, "parent_serial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'child_serial_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetItemsRelation.prototype, "child_serial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetItemsRelation.prototype, "relation_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'manual' }),
    __metadata("design:type", String)
], AssetItemsRelation.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetItemsRelation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetItemsRelation.prototype, "last_seen_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetItemsRelation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], AssetItemsRelation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsRelation.prototype, "updated_by", void 0);
exports.AssetItemsRelation = AssetItemsRelation = __decorate([
    (0, typeorm_1.Entity)("asset_items_relations")
], AssetItemsRelation);
