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
exports.AssetOwnershipStatusTypes = exports.OwnershipTypeEnum = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var OwnershipTypeEnum;
(function (OwnershipTypeEnum) {
    OwnershipTypeEnum["CAPEX"] = "capex";
    OwnershipTypeEnum["OPEX"] = "opex";
    OwnershipTypeEnum["NA"] = "NA";
})(OwnershipTypeEnum || (exports.OwnershipTypeEnum = OwnershipTypeEnum = {}));
let AssetOwnershipStatusTypes = class AssetOwnershipStatusTypes {
};
exports.AssetOwnershipStatusTypes = AssetOwnershipStatusTypes;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Primary key of ownership status type',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetOwnershipStatusTypes.prototype, "ownership_status_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CAPEX Asset',
        description: 'Ownership status display name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetOwnershipStatusTypes.prototype, "ownership_status_type_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Capital expenditure owned assets',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetOwnershipStatusTypes.prototype, "ownership_status_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: OwnershipTypeEnum,
        example: OwnershipTypeEnum.CAPEX,
        description: 'Ownership type classification (CAPEX / OPEX / NA)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OwnershipTypeEnum,
        enumName: 'ownership_type_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetOwnershipStatusTypes.prototype, "ownership_status_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '#16a34a',
        description: 'UI color code for ownership status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], AssetOwnershipStatusTypes.prototype, "asset_ownership_status_color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        enum: [0, 1],
        description: 'Active status flag',
    }),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetOwnershipStatusTypes.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        enum: [0, 1],
        description: 'Soft delete flag',
    }),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetOwnershipStatusTypes.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T11:20:00',
        description: 'Creation timestamp',
    }),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetOwnershipStatusTypes.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates default ownership status',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetOwnershipStatusTypes.prototype, "is_default", void 0);
exports.AssetOwnershipStatusTypes = AssetOwnershipStatusTypes = __decorate([
    (0, typeorm_1.Entity)("asset_ownership_status_types")
], AssetOwnershipStatusTypes);
