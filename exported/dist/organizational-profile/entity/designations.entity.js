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
exports.Designations = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organizational_user_entity_1 = require("./organizational-user.entity");
const department_entity_1 = require("./department.entity");
let Designations = class Designations {
};
exports.Designations = Designations;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'designation_id' }),
    __metadata("design:type", Number)
], Designations.prototype, "designation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senior Developer' }),
    (0, typeorm_1.Column)({ name: 'designation_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Designations.prototype, "designation_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Handles backend architecture', required: false }),
    (0, typeorm_1.Column)({ name: 'desg_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Designations.prototype, "desg_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, required: false }),
    (0, typeorm_1.Column)({ name: 'created_by_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Designations.prototype, "created_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id', referencedColumnName: 'user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Designations.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, required: false }),
    (0, typeorm_1.Column)({ name: 'parent_department', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Designations.prototype, "parent_department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department),
    (0, typeorm_1.JoinColumn)({ name: 'parent_department', referencedColumnName: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], Designations.prototype, "parentDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Designations.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Designations.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], Designations.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Designations.prototype, "is_deleted", void 0);
exports.Designations = Designations = __decorate([
    (0, typeorm_1.Entity)('designations'),
    (0, typeorm_1.Unique)(['designation_name'])
], Designations);
