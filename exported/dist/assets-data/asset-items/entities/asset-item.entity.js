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
exports.AssetItem = void 0;
const asset_subcategory_entity_1 = require("../../asset-subcategories/entities/asset-subcategory.entity");
const asset_stock_serials_entity_1 = require("../../stocks/entities/asset_stock_serials.entity");
const typeorm_1 = require("typeorm");
const asset_category_entity_1 = require("../../asset-categories/entities/asset-category.entity");
const asset_item_enums_1 = require("./asset-item.enums");
const item_manufacturer_map_1 = require("./item-manufacturer-map");
let AssetItem = class AssetItem {
};
exports.AssetItem = AssetItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetItem.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "main_category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => asset_category_entity_1.AssetCategory),
    (0, typeorm_1.JoinColumn)({ name: 'main_category_id' }),
    __metadata("design:type", asset_category_entity_1.AssetCategory)
], AssetItem.prototype, "main_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_subcategory_entity_1.AssetSubcategory, (sub) => sub.items),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", asset_subcategory_entity_1.AssetSubcategory)
], AssetItem.prototype, "sub_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetItem.prototype, "asset_item_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetItem.prototype, "asset_item_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetItem.prototype, "asset_item_icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "added_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetItem.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetItem.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "is_licensable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], AssetItem.prototype, "license_metric", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "upload_documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "import_barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "has_serials", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "has_warranty", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_item_enums_1.ItemType,
        enumName: 'item_type_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetItem.prototype, "item_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_item_enums_1.AssetType,
        enumName: 'asset_type',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetItem.prototype, "asset_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_item_enums_1.WarrantyType,
        enumName: 'warranty_type_enum',
        array: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], AssetItem.prototype, "warranty_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "has_depreciation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "company_act_asset_life", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "it_act_asset_life", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "company_depreciation_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "it_act_depreciation_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "company_act_residual_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "it_act_residual_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "preffered_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetItem.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetItem.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetItem.prototype, "is_overallocated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "excess", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "asset_block", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], AssetItem.prototype, "asset_block_it", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_stock_serials_entity_1.AssetStockSerials, (serial) => serial.asset_item),
    __metadata("design:type", Array)
], AssetItem.prototype, "serials", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => item_manufacturer_map_1.ItemManufacturer, (itemManufacturer) => itemManufacturer.asset_item),
    __metadata("design:type", Array)
], AssetItem.prototype, "itemManufacturers", void 0);
exports.AssetItem = AssetItem = __decorate([
    (0, typeorm_1.Entity)("asset_items")
], AssetItem);
