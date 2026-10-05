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
exports.AssetDatum = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_category_entity_1 = require("../../asset-categories/entities/asset-category.entity");
const asset_subcategory_entity_1 = require("../../asset-subcategories/entities/asset-subcategory.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
const manufacturer_entity_1 = require("./manufacturer.entity");
const models_entity_1 = require("./models.entity");
const stocks_entity_1 = require("../../stocks/entities/stocks.entity");
let AssetDatum = class AssetDatum {
};
exports.AssetDatum = AssetDatum;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'asset_id', type: 'integer' }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'asset_main_category_id', type: 'integer' }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_main_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_category_entity_1.AssetCategory, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_main_category_id' }),
    __metadata("design:type", asset_category_entity_1.AssetCategory)
], AssetDatum.prototype, "main_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'asset_sub_category_id', type: 'integer' }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_sub_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_subcategory_entity_1.AssetSubcategory, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_sub_category_id' }),
    __metadata("design:type", asset_subcategory_entity_1.AssetSubcategory)
], AssetDatum.prototype, "sub_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'asset_item_id', type: 'integer' }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_item_id' }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], AssetDatum.prototype, "asset_item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: 'asset_title', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetDatum.prototype, "asset_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: 'asset_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetDatum.prototype, "asset_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: 'manufacturer_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "manufacturer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => manufacturer_entity_1.Manufacturer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'manufacturer_id' }),
    __metadata("design:type", manufacturer_entity_1.Manufacturer)
], AssetDatum.prototype, "manufacturer_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: 'model_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "model_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => models_entity_1.Models, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'model_id' }),
    __metadata("design:type", models_entity_1.Models)
], AssetDatum.prototype, "model_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'asset_added_by', type: 'integer' }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_added_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_added_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetDatum.prototype, "added_by_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ name: 'asset_is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ name: 'asset_is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetDatum.prototype, "asset_is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({
        name: 'asset_created_at',
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetDatum.prototype, "asset_created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'asset_updated_at',
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetDatum.prototype, "asset_updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stocks_entity_1.Stock, stock => stock.asset_info),
    __metadata("design:type", Array)
], AssetDatum.prototype, "stocks", void 0);
exports.AssetDatum = AssetDatum = __decorate([
    (0, typeorm_1.Entity)('assets')
], AssetDatum);
