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
exports.CreateTechnicalRelationshipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTechnicalRelationshipDto {
}
exports.CreateTechnicalRelationshipDto = CreateTechnicalRelationshipDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1010,
        description: 'Source Asset Stock Unique ID (Serial PK)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTechnicalRelationshipDto.prototype, "source_serial_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1040,
        description: 'Target Asset Stock Unique ID (Single item)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTechnicalRelationshipDto.prototype, "target_serial_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [1040, 1041, 1042],
        description: 'Array of Target Asset Stock Unique IDs for batch linking',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreateTechnicalRelationshipDto.prototype, "target_serial_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'REL-006',
        description: 'Relation type code from asset_relation_type_table (e.g. REL-005, REL-006, REL-010)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTechnicalRelationshipDto.prototype, "relation_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-09-10',
        description: 'Date relationship was established',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTechnicalRelationshipDto.prototype, "assigned_from_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Oracle Database 19c Enterprise installed on Dell Server R750',
        description: 'Optional operational notes or relationship description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTechnicalRelationshipDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { port: 'eth0', install_path: '/opt/oracle', license_key: 'LIC-ORA19-7711' },
        description: 'Arbitrary CMDB, technical, or network metadata attributes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTechnicalRelationshipDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'If true, overrides custody conflict when attaching a peripheral already assigned to another user',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTechnicalRelationshipDto.prototype, "confirm_reassign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['manual', 'agent', 'scanner', 'sync'],
        example: 'agent',
        description: 'Origin of the relationship (asset_relationship_source_enum). The public modal route always forces "manual"; only server-side callers (discovery import) may pass "agent".',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['manual', 'agent', 'scanner', 'sync']),
    __metadata("design:type", String)
], CreateTechnicalRelationshipDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        description: 'Server-side only (discovery import): when true, licence-seat / custody guards that would BLOCK a manual link are downgraded to flags — agent-discovered installs are never blocked, only flagged.',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTechnicalRelationshipDto.prototype, "agent_flag_only", void 0);
