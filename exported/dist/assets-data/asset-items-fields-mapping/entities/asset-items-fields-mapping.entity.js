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
exports.AssetItemsFieldsMapping = void 0;
const typeorm_1 = require("typeorm");
const asset_field_entity_1 = require("../../asset-fields/entities/asset-field.entity");
const asset_field_category_entity_1 = require("../../asset-fields/entities/asset-field-category.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
let AssetItemsFieldsMapping = class AssetItemsFieldsMapping {
};
exports.AssetItemsFieldsMapping = AssetItemsFieldsMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_mapping_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "asset_field_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "asset_item_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "asset_field_category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_is_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_is_mandatory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "is_individual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_sequence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetItemsFieldsMapping.prototype, "aif_added_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AssetItemsFieldsMapping.prototype, "aif_created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AssetItemsFieldsMapping.prototype, "aif_updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetItemsFieldsMapping.prototype, "aif_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetItemsFieldsMapping.prototype, "default_value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_field_entity_1.AssetField),
    (0, typeorm_1.JoinColumn)({ name: 'asset_field_id' }),
    __metadata("design:type", asset_field_entity_1.AssetField)
], AssetItemsFieldsMapping.prototype, "asset_field", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_item_entity_1.AssetItem),
    (0, typeorm_1.JoinColumn)({ name: 'asset_item_id' }),
    __metadata("design:type", asset_item_entity_1.AssetItem)
], AssetItemsFieldsMapping.prototype, "asset_item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_field_category_entity_1.AssetFieldCategory),
    (0, typeorm_1.JoinColumn)({ name: 'asset_field_category_id' }),
    __metadata("design:type", asset_field_category_entity_1.AssetFieldCategory)
], AssetItemsFieldsMapping.prototype, "asset_field_category", void 0);
exports.AssetItemsFieldsMapping = AssetItemsFieldsMapping = __decorate([
    (0, typeorm_1.Entity)("asset_items_fields_mapping")
], AssetItemsFieldsMapping);
