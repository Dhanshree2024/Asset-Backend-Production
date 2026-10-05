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
exports.AssetRelationType = exports.AssetRelationCardinalityEnum = exports.AssetRelationCategoryEnum = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const asset_mapping_entity_1 = require("./asset-mapping.entity");
var AssetRelationCategoryEnum;
(function (AssetRelationCategoryEnum) {
    AssetRelationCategoryEnum["OPERATIONAL"] = "OPERATIONAL";
    AssetRelationCategoryEnum["STRUCTURAL"] = "STRUCTURAL";
    AssetRelationCategoryEnum["SOFTWARE"] = "SOFTWARE";
    AssetRelationCategoryEnum["PHYSICAL"] = "PHYSICAL";
    AssetRelationCategoryEnum["INFRASTRUCTURE"] = "INFRASTRUCTURE";
    AssetRelationCategoryEnum["LIFECYCLE"] = "LIFECYCLE";
    AssetRelationCategoryEnum["DEPENDENCY"] = "DEPENDENCY";
    AssetRelationCategoryEnum["NETWORK"] = "NETWORK";
    AssetRelationCategoryEnum["MONITORING"] = "MONITORING";
    AssetRelationCategoryEnum["INTEGRATION"] = "INTEGRATION";
    AssetRelationCategoryEnum["SERVICE"] = "SERVICE";
    AssetRelationCategoryEnum["OTHER"] = "OTHER";
})(AssetRelationCategoryEnum || (exports.AssetRelationCategoryEnum = AssetRelationCategoryEnum = {}));
var AssetRelationCardinalityEnum;
(function (AssetRelationCardinalityEnum) {
    AssetRelationCardinalityEnum["ONE_TO_ONE"] = "1:1";
    AssetRelationCardinalityEnum["ONE_TO_MANY"] = "1:N";
    AssetRelationCardinalityEnum["MANY_TO_ONE"] = "N:1";
    AssetRelationCardinalityEnum["MANY_TO_MANY"] = "N:M";
})(AssetRelationCardinalityEnum || (exports.AssetRelationCardinalityEnum = AssetRelationCardinalityEnum = {}));
let AssetRelationType = class AssetRelationType {
};
exports.AssetRelationType = AssetRelationType;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'REL-006', description: 'Unique relation code' }),
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INSTALLED_ON', description: 'Forward direction label (Source -> Target)' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "forward_label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HAS_INSTALLED_SOFTWARE', description: 'Reverse direction label (Target -> Source)' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "reverse_label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AssetRelationCardinalityEnum,
        example: AssetRelationCardinalityEnum.MANY_TO_ONE,
        description: 'Relationship cardinality (1:1, 1:N, N:1, N:M)',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetRelationCardinalityEnum,
        default: AssetRelationCardinalityEnum.MANY_TO_ONE,
    }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "cardinality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: asset_mapping_entity_1.AssignTargetType,
        example: asset_mapping_entity_1.AssignTargetType.ASSET,
        description: 'Expected target entity type',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_mapping_entity_1.AssignTargetType,
    }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "target_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AssetRelationCategoryEnum,
        example: AssetRelationCategoryEnum.SOFTWARE,
        description: 'High-level relationship grouping category',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetRelationCategoryEnum,
    }),
    __metadata("design:type", String)
], AssetRelationType.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Whether directed cycles are permitted' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetRelationType.prototype, "is_cycle_allowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Active status' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AssetRelationType.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-09-10T12:00:00Z', description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetRelationType.prototype, "created_at", void 0);
exports.AssetRelationType = AssetRelationType = __decorate([
    (0, typeorm_1.Entity)('asset_relation_type_table')
], AssetRelationType);
