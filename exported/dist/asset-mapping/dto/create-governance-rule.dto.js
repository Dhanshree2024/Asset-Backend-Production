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
exports.UpdateGovernanceRuleDto = exports.CreateGovernanceRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const asset_mapping_entity_1 = require("../entities/asset-mapping.entity");
class CreateGovernanceRuleDto {
}
exports.CreateGovernanceRuleDto = CreateGovernanceRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Allow Dell Monitor to attach to Laptop',
        description: 'Human-readable rule name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateGovernanceRuleDto.prototype, "rule_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'REL-007',
        description: 'Relationship type code from asset_relation_type_table (e.g. REL-006, REL-007, REL-010)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGovernanceRuleDto.prototype, "relation_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Source main category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "source_main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, description: 'Source subcategory ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "source_sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1010, description: 'Source item ID from asset_items' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "source_item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: asset_mapping_entity_1.AssignTargetType,
        example: asset_mapping_entity_1.AssignTargetType.ASSET,
        description: 'Target entity type (ASSET, SOFTWARE, USER, DEPARTMENT, BRANCH, PROJECT)',
    }),
    (0, class_validator_1.IsEnum)(asset_mapping_entity_1.AssignTargetType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGovernanceRuleDto.prototype, "target_entity_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Target main category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "target_main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: 'Target subcategory ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "target_sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1040, description: 'Target item ID from asset_items' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGovernanceRuleDto.prototype, "target_item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the relation is permitted (true) or blocked (false)',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGovernanceRuleDto.prototype, "is_allowed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'This item cannot be attached to the selected asset category.',
        description: 'Custom message returned when rule restricts link',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateGovernanceRuleDto.prototype, "validation_message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Whether the rule is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGovernanceRuleDto.prototype, "is_active", void 0);
class UpdateGovernanceRuleDto {
}
exports.UpdateGovernanceRuleDto = UpdateGovernanceRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Allow Dell Monitor to attach to Laptop' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateGovernanceRuleDto.prototype, "rule_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'REL-007' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGovernanceRuleDto.prototype, "relation_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "source_main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "source_sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1010 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "source_item_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: asset_mapping_entity_1.AssignTargetType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(asset_mapping_entity_1.AssignTargetType),
    __metadata("design:type", String)
], UpdateGovernanceRuleDto.prototype, "target_entity_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "target_main_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "target_sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1040 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGovernanceRuleDto.prototype, "target_item_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGovernanceRuleDto.prototype, "is_allowed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Custom message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateGovernanceRuleDto.prototype, "validation_message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGovernanceRuleDto.prototype, "is_active", void 0);
