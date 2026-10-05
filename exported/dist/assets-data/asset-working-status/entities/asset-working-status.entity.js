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
exports.AssetWorkingStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const asset_procurements_entity_1 = require("../../stocks/entities/asset_procurements.entity");
let AssetWorkingStatus = class AssetWorkingStatus {
};
exports.AssetWorkingStatus = AssetWorkingStatus;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Unique working status type ID',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'working_status_type_id' }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "working_status_type_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'In Use',
        description: 'Name of the working status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'working_status_type_name', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetWorkingStatus.prototype, "working_status_type_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '#28a745',
        description: 'UI color code for the working status',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    (0, typeorm_1.Column)({ name: 'working_status_color', length: 20, nullable: true }),
    __metadata("design:type", String)
], AssetWorkingStatus.prototype, "working_status_color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Asset is currently being used',
        description: 'Description of the working status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'working_status_description',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetWorkingStatus.prototype, "working_status_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'High-level status category identifier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'status_category', nullable: true }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "status_category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 2,
        description: 'Specific category identifier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'status_for_category', nullable: true }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "status_for_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '1 = Active, 0 = Inactive',
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: '0 = Not deleted, 1 = Deleted',
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether this is the default working status',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, typeorm_1.Column)({ name: 'is_default', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetWorkingStatus.prototype, "is_default", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2024-01-01T10:00:00Z',
        description: 'Record creation timestamp',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetWorkingStatus.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetWorkingStatus.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetWorkingStatus.prototype, "created_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetWorkingStatus.prototype, "updated_user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_procurements_entity_1.AssetProcurement, (proc) => proc.renewal_status_details),
    __metadata("design:type", Array)
], AssetWorkingStatus.prototype, "procurements", void 0);
exports.AssetWorkingStatus = AssetWorkingStatus = __decorate([
    (0, typeorm_1.Entity)('asset_working_status_types')
], AssetWorkingStatus);
