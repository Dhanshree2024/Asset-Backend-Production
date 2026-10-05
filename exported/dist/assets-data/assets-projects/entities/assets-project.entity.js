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
exports.AssetsProject = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const department_entity_1 = require("../../../organizational-profile/entity/department.entity");
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
let AssetsProject = class AssetsProject {
};
exports.AssetsProject = AssetsProject;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Primary key of the project',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'project_id',
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AssetsProject.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'PRJ-IT-001',
        description: 'Unique project code',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'project_code',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetsProject.prototype, "project_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ERP Implementation',
        description: 'Project name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({
        name: 'project_name',
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], AssetsProject.prototype, "project_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Ravi Kumar',
        description: 'Project contact person',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({
        name: 'contact_person',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetsProject.prototype, "contact_person", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'erp.project@company.com',
        description: 'Project contact email',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, typeorm_1.Column)({
        name: 'project_email',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetsProject.prototype, "project_email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Department ID linked to project',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({
        name: 'department_id',
        type: 'integer',
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetsProject.prototype, "department_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, { nullable: true }),
    (0, typeorm_1.JoinColumn)({
        name: 'department_id',
        referencedColumnName: 'department_id',
    }),
    __metadata("design:type", department_entity_1.Department)
], AssetsProject.prototype, "department_info", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'User who created the project',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'integer',
        nullable: true,
    }),
    __metadata("design:type", Number)
], AssetsProject.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetsProject.prototype, "created_by_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T10:30:00',
        description: 'Project creation timestamp',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetsProject.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-12T15:45:00',
        description: 'Last updated timestamp',
    }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetsProject.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Active status (1 = active, 0 = inactive)',
    }),
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'smallint',
        default: 1,
    }),
    __metadata("design:type", Number)
], AssetsProject.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Delete flag (0 = not deleted, 1 = deleted)',
    }),
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], AssetsProject.prototype, "is_deleted", void 0);
exports.AssetsProject = AssetsProject = __decorate([
    (0, typeorm_1.Entity)("asset_project")
], AssetsProject);
