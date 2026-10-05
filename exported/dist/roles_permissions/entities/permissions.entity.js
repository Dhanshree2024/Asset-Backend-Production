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
exports.PermissionsRoles = void 0;
const typeorm_1 = require("typeorm");
const roles_permission_entity_1 = require("./roles_permission.entity");
let PermissionsRoles = class PermissionsRoles {
};
exports.PermissionsRoles = PermissionsRoles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'permission_id' }),
    __metadata("design:type", Number)
], PermissionsRoles.prototype, "permission_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id' }),
    __metadata("design:type", Number)
], PermissionsRoles.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], PermissionsRoles.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PermissionsRoles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PermissionsRoles.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PermissionsRoles.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PermissionsRoles.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_permission_entity_1.RolesPermission, (role) => role.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", roles_permission_entity_1.RolesPermission)
], PermissionsRoles.prototype, "role", void 0);
exports.PermissionsRoles = PermissionsRoles = __decorate([
    (0, typeorm_1.Entity)('organization_permissions')
], PermissionsRoles);
