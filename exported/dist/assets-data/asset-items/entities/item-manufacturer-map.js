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
exports.ItemManufacturer = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const asset_item_entity_1 = require("./asset-item.entity");
const manufacturer_entity_1 = require("../../asset-data/entities/manufacturer.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
let ItemManufacturer = class ItemManufacturer {
};
exports.ItemManufacturer = ItemManufacturer;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: "item_manufacturer_id",
        type: "integer",
    }),
    __metadata("design:type", Number)
], ItemManufacturer.prototype, "item_manufacturer_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => asset_item_entity_1.AssetItem }),
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem, (item) => item.itemManufacturers, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "asset_item_id" }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], ItemManufacturer.prototype, "asset_item", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "asset_item_id", type: "integer" }),
    __metadata("design:type", Number)
], ItemManufacturer.prototype, "asset_item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => manufacturer_entity_1.Manufacturer }),
    (0, typeorm_1.ManyToOne)(() => manufacturer_entity_1.Manufacturer, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "manufacturer_id" }),
    __metadata("design:type", manufacturer_entity_1.Manufacturer)
], ItemManufacturer.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "manufacturer_id", type: "integer" }),
    __metadata("design:type", Number)
], ItemManufacturer.prototype, "manufacturer_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-14T10:00:00Z" }),
    (0, typeorm_1.Column)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], ItemManufacturer.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, {
        nullable: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", organizational_user_entity_1.User)
], ItemManufacturer.prototype, "created_by_user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "created_by",
        type: "integer",
        nullable: true,
    }),
    __metadata("design:type", Number)
], ItemManufacturer.prototype, "created_by", void 0);
exports.ItemManufacturer = ItemManufacturer = __decorate([
    (0, typeorm_1.Entity)({ name: "item_manufacturers" })
], ItemManufacturer);
