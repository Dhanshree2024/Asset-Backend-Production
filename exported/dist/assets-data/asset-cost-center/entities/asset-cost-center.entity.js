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
exports.AssetCostCenter = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const department_entity_1 = require("../../../organizational-profile/entity/department.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
let AssetCostCenter = class AssetCostCenter {
};
exports.AssetCostCenter = AssetCostCenter;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary key of the asset cost center',
        example: 10,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'cost_center_id' }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "cost_center_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique cost center code',
        example: 'CC-IT-001',
    }),
    (0, class_validator_1.IsString)({ message: 'cost_center_code must be a string' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'cost_center_code cannot exceed 100 characters',
    }),
    (0, typeorm_1.Column)({ name: 'cost_center_code', type: 'text' }),
    __metadata("design:type", String)
], AssetCostCenter.prototype, "cost_center_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost center name',
        example: 'IT Infrastructure',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'cost_center_name must be a string' }),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({ name: 'cost_center_name', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetCostCenter.prototype, "cost_center_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact person for the cost center',
        example: 'Amit Sharma',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({
        name: 'cost_center_contact_person',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetCostCenter.prototype, "cost_center_contact_person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the cost center contact',
        example: 'it.costcenter@company.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({
        name: 'cost_center_email',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetCostCenter.prototype, "cost_center_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Associated department ID',
        example: 3,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'department_id must be an integer' }),
    (0, typeorm_1.Column)({ name: 'department_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "department_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, { eager: false }),
    (0, typeorm_1.JoinColumn)({
        name: 'department_id',
        referencedColumnName: 'department_id',
    }),
    __metadata("design:type", department_entity_1.Department)
], AssetCostCenter.prototype, "department_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who created the cost center',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'created_by must be an integer' }),
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by', referencedColumnName: 'user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetCostCenter.prototype, "created_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allocated budget for the cost center',
        example: 500000,
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'cost_center_budget cannot be negative' }),
    (0, typeorm_1.Column)({ name: 'cost_center_budget', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "cost_center_budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount spent from the cost center budget',
        example: 275000,
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'cost_center_spent cannot be negative' }),
    (0, typeorm_1.Column)({ name: 'cost_center_spent', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "cost_center_spent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utilization percentage of the budget',
        example: 55,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'cost_center_utilization must be an integer' }),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({
        name: 'cost_center_utilization',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "cost_center_utilization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the cost center manager',
        example: 18,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({
        name: 'cost_center_manger_name_id',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "cost_center_manger_name_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates whether the cost center is active',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates whether the cost center is deleted',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetCostCenter.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost center creation timestamp',
        example: '2025-02-10T09:30:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetCostCenter.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost center last update timestamp',
        example: '2025-02-11T15:10:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetCostCenter.prototype, "updated_at", void 0);
exports.AssetCostCenter = AssetCostCenter = __decorate([
    (0, typeorm_1.Entity)("asset_cost_centers")
], AssetCostCenter);
