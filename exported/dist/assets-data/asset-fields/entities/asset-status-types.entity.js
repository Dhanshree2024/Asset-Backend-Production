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
exports.AssetStatusTypes = void 0;
const asset_mapping_entity_1 = require("../../../asset-mapping/entities/asset-mapping.entity");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
let AssetStatusTypes = class AssetStatusTypes {
};
exports.AssetStatusTypes = AssetStatusTypes;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Primary key of asset status type",
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "status_type_id" }),
    __metadata("design:type", Number)
], AssetStatusTypes.prototype, "status_type_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Name of the asset status (e.g., Available, Assigned, Damaged)",
        example: "Available",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    (0, typeorm_1.Column)({
        name: "status_type_name",
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetStatusTypes.prototype, "status_type_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Detailed description of the asset status",
        example: "Asset is currently available for assignment",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: "asset_status_description",
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetStatusTypes.prototype, "asset_status_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Hex or short color code used in UI",
        example: "#28A745",
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    (0, typeorm_1.Column)({
        name: "status_color_code",
        type: "varchar",
        length: 10,
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetStatusTypes.prototype, "status_color_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Indicates whether the status type is active (1 = active, 0 = inactive)",
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    (0, typeorm_1.Column)({
        name: "is_active",
        type: "smallint",
        default: 1,
    }),
    __metadata("design:type", Number)
], AssetStatusTypes.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Soft delete flag (1 = deleted, 0 = not deleted)",
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    (0, typeorm_1.Column)({
        name: "is_deleted",
        type: "smallint",
        default: 0,
    }),
    __metadata("design:type", Number)
], AssetStatusTypes.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Marks this status as the default status",
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, typeorm_1.Column)({
        name: "is_default",
        type: "boolean",
        default: false,
    }),
    __metadata("design:type", Boolean)
], AssetStatusTypes.prototype, "is_default", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Timestamp when the status was created",
        example: "2024-01-15T10:30:00.000Z",
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], AssetStatusTypes.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Asset mappings associated with this status",
        type: () => [asset_mapping_entity_1.AssetMappingRepository],
    }),
    (0, typeorm_1.OneToMany)(() => asset_mapping_entity_1.AssetMappingRepository, (mapping) => mapping.status),
    __metadata("design:type", Array)
], AssetStatusTypes.prototype, "asset_mapping", void 0);
exports.AssetStatusTypes = AssetStatusTypes = __decorate([
    (0, typeorm_1.Entity)("asset_status_types")
], AssetStatusTypes);
