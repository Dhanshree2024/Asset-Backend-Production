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
exports.AssetCategory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_subcategory_entity_1 = require("../../asset-subcategories/entities/asset-subcategory.entity");
let AssetCategory = class AssetCategory {
};
exports.AssetCategory = AssetCategory;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique identifier for asset main category",
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetCategory.prototype, "main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the asset main category",
        example: "Electronics",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Main category name is required" }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetCategory.prototype, "main_category_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Description of the asset main category",
        example: "All electronic assets like laptops, mobiles, etc.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AssetCategory.prototype, "main_category_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Whether the category is active (1 = Active, 0 = Inactive)",
        example: 1,
        enum: [0, 1],
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([0, 1], { message: "is_active must be 0 or 1" }),
    (0, typeorm_1.Column)({ type: "smallint", default: 1 }),
    __metadata("design:type", Number)
], AssetCategory.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Soft delete flag (0 = Not deleted, 1 = Deleted)",
        example: 0,
        enum: [0, 1],
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([0, 1], { message: "is_deleted must be 0 or 1" }),
    (0, typeorm_1.Column)({ type: "smallint", default: 0 }),
    __metadata("design:type", Number)
], AssetCategory.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "User ID who added the category",
        example: 12,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: "integer", nullable: true }),
    __metadata("design:type", Number)
], AssetCategory.prototype, "added_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Timestamp when category was created",
        example: "2025-02-10T10:30:00",
    }),
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp",
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetCategory.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Timestamp when category was last updated",
        example: "2025-02-12T18:45:00",
    }),
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp",
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetCategory.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Icon name for UI representation",
        example: "box",
        default: "box",
    }),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: "text", default: "box" }),
    __metadata("design:type", String)
], AssetCategory.prototype, "main_category_icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "User entity who added this category",
        type: () => organizational_user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "added_by" }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetCategory.prototype, "added_by_user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "List of subcategories under this main category",
        type: () => [asset_subcategory_entity_1.AssetSubcategory],
    }),
    (0, typeorm_1.OneToMany)(() => asset_subcategory_entity_1.AssetSubcategory, (sub) => sub.main_category),
    __metadata("design:type", Array)
], AssetCategory.prototype, "subcategories", void 0);
exports.AssetCategory = AssetCategory = __decorate([
    (0, typeorm_1.Entity)("asset_main_category")
], AssetCategory);
