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
exports.AssetField = void 0;
const typeorm_1 = require("typeorm");
const asset_field_category_entity_1 = require("./asset-field-category.entity");
let AssetField = class AssetField {
};
exports.AssetField = AssetField;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetField.prototype, "asset_field_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetField.prototype, "asset_field_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: true }),
    __metadata("design:type", Number)
], AssetField.prototype, "asset_field_category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetField.prototype, "asset_field_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetField.prototype, "asset_field_label_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetField.prototype, "asset_field_type_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetField.prototype, "asset_field_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: true }),
    __metadata("design:type", Number)
], AssetField.prototype, "added_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "smallint", default: 1 }),
    __metadata("design:type", Number)
], AssetField.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "smallint", default: 0 }),
    __metadata("design:type", Number)
], AssetField.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], AssetField.prototype, "is_custom_field", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: true }),
    __metadata("design:type", Boolean)
], AssetField.prototype, "is_multiple", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp without time zone",
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetField.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp without time zone",
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetField.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_field_category_entity_1.AssetFieldCategory, (category) => category.assetFields),
    (0, typeorm_1.JoinColumn)({ name: "asset_field_category_id" }),
    __metadata("design:type", asset_field_category_entity_1.AssetFieldCategory)
], AssetField.prototype, "category", void 0);
exports.AssetField = AssetField = __decorate([
    (0, typeorm_1.Entity)("asset_fields")
], AssetField);
