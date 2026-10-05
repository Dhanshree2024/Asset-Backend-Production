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
exports.Permission = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const role_entity_1 = require("./role.entity");
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'permission_id', type: 'integer' }),
    __metadata("design:type", Number)
], Permission.prototype, "permission_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, typeorm_1.Column)({ name: 'role_id', type: 'integer' }),
    __metadata("design:type", Number)
], Permission.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => role_entity_1.Roles }),
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Roles, (role) => role.permissions, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id', referencedColumnName: 'role_id' }),
    __metadata("design:type", role_entity_1.Roles)
], Permission.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            users: { create: true, edit: false, delete: false },
            assets: { view: true, assign: true },
        },
        required: false,
        type: Object,
    }),
    (0, typeorm_1.Column)({
        name: 'permissions',
        type: 'jsonb',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Permission.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:00:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "updated_at", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)('organization_permissions')
], Permission);
