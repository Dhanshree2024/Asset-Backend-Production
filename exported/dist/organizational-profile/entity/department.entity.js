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
exports.Department = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organizational_user_entity_1 = require("./organizational-user.entity");
let Department = class Department {
};
exports.Department = Department;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'department_id', type: 'integer' }),
    __metadata("design:type", Number)
], Department.prototype, "department_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IT Department' }),
    (0, typeorm_1.Column)({ name: 'department_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Department.prototype, "department_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Handles all technical infrastructure', required: false }),
    (0, typeorm_1.Column)({ name: 'dept_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Department.prototype, "dept_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, required: false }),
    (0, typeorm_1.Column)({ name: 'created_by_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Department.prototype, "created_by_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => organizational_user_entity_1.User, required: false }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, (user) => user.user_id, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Department.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, required: false }),
    (0, typeorm_1.Column)({ name: 'department_head_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Department.prototype, "department_head_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => organizational_user_entity_1.User, required: false }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, (user) => user.user_id, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'department_head_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Department.prototype, "departmentHead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, required: false }),
    (0, typeorm_1.Column)({ name: 'linked_designations', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Department.prototype, "linked_designations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], Department.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Department.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:00:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Department.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Department.prototype, "updated_at", void 0);
exports.Department = Department = __decorate([
    (0, typeorm_1.Entity)('departments')
], Department);
