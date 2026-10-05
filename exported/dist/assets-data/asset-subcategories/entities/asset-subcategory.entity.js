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
exports.AssetSubcategory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_category_entity_1 = require("../../asset-categories/entities/asset-category.entity");
const asset_item_entity_1 = require("../../asset-items/entities/asset-item.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
let AssetSubcategory = class AssetSubcategory {
};
exports.AssetSubcategory = AssetSubcategory;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetSubcategory.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Main category ID',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetSubcategory.prototype, "main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'User who added this sub category',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetSubcategory.prototype, "added_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Laptops',
        description: 'Sub category name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetSubcategory.prototype, "sub_category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'All laptop related assets',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetSubcategory.prototype, "sub_category_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '1 = Active, 0 = Inactive',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetSubcategory.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: '0 = Not deleted, 1 = Deleted',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetSubcategory.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'box',
        description: 'Icon name for UI',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', default: 'box' }),
    __metadata("design:type", String)
], AssetSubcategory.prototype, "sub_category_icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:30:00Z' }),
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetSubcategory.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:30:00Z' }),
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], AssetSubcategory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_category_entity_1.AssetCategory, (cat) => cat.subcategories, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'main_category_id' }),
    __metadata("design:type", asset_category_entity_1.AssetCategory)
], AssetSubcategory.prototype, "main_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetSubcategory.prototype, "added_by_user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_item_entity_1.AssetItem, (item) => item.sub_category),
    __metadata("design:type", Array)
], AssetSubcategory.prototype, "items", void 0);
exports.AssetSubcategory = AssetSubcategory = __decorate([
    (0, typeorm_1.Entity)('asset_sub_category')
], AssetSubcategory);
