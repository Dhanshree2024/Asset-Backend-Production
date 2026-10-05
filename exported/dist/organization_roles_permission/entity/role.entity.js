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
exports.Roles = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const roles_permission_entity_1 = require("../../roles_permissions/entities/roles_permission.entity");
let Roles = class Roles {
};
exports.Roles = Roles;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'role_id', type: 'integer' }),
    __metadata("design:type", Number)
], Roles.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin' }),
    (0, typeorm_1.Column)({
        name: 'role_name',
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Roles.prototype, "role_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Full access to system',
        required: false,
    }),
    (0, typeorm_1.Column)({
        name: 'role_description',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Roles.prototype, "role_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: roles_permission_entity_1.RoleType,
        example: roles_permission_entity_1.RoleType.SYSTEM,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: roles_permission_entity_1.RoleType,
        enumName: 'role_type_enum',
        default: roles_permission_entity_1.RoleType.SYSTEM,
    }),
    __metadata("design:type", String)
], Roles.prototype, "role_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Roles.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Roles.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({
        name: 'is_compulsary',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Roles.prototype, "is_compulsary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({
        name: 'is_outside_organization',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Roles.prototype, "is_outside_organization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, required: false }),
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'integer',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Roles.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => organizational_user_entity_1.User, required: false }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, (user) => user.createdRoles, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Roles.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:00:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Roles.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Roles.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [organizational_user_entity_1.User], required: false }),
    (0, typeorm_1.OneToMany)(() => organizational_user_entity_1.User, (user) => user.role),
    __metadata("design:type", Array)
], Roles.prototype, "users", void 0);
exports.Roles = Roles = __decorate([
    (0, typeorm_1.Entity)('organization_roles')
], Roles);
