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
exports.AssetFieldCategory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_field_entity_1 = require("./asset-field.entity");
let AssetFieldCategory = class AssetFieldCategory {
};
exports.AssetFieldCategory = AssetFieldCategory;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'asset_field_category_id' }),
    __metadata("design:type", Number)
], AssetFieldCategory.prototype, "asset_field_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Hardware Specifications',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'asset_field_category_name',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetFieldCategory.prototype, "asset_field_category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fields related to hardware configuration',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'asset_field_category_description',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetFieldCategory.prototype, "asset_field_category_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who added the category',
        example: 12,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'added_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetFieldCategory.prototype, "added_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetFieldCategory.prototype, "added_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetFieldCategory.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetFieldCategory.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-13T09:15:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetFieldCategory.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-13T09:15:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetFieldCategory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_field_entity_1.AssetField, (category) => category.category),
    (0, typeorm_1.JoinColumn)({ name: "asset_field_category_id" }),
    __metadata("design:type", asset_field_entity_1.AssetField)
], AssetFieldCategory.prototype, "assetFields", void 0);
exports.AssetFieldCategory = AssetFieldCategory = __decorate([
    (0, typeorm_1.Entity)("asset_field_category")
], AssetFieldCategory);
