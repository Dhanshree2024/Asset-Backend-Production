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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesPermissionsController = void 0;
const common_1 = require("@nestjs/common");
const roles_permissions_service_1 = require("./roles_permissions.service");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const delete_roles_permission_dto_1 = require("./dto/delete-roles_permission.dto");
const role_permission_dto_1 = require("../organization_roles_permission/dto/role_permission.dto");
let RolesPermissionsController = class RolesPermissionsController {
    constructor(rolesPermissionsService) {
        this.rolesPermissionsService = rolesPermissionsService;
    }
    async findAll(searchQuery = '') {
        try {
            return this.rolesPermissionsService.findAll(searchQuery);
        }
        catch (error) {
            return false;
        }
    }
    async getAllRolesForDropdown() {
        try {
            const dropdownRoles = await this.rolesPermissionsService.getAllRolesForDropdown();
            return {
                status: true,
                message: 'Roles fetched successfully',
                data: dropdownRoles,
            };
        }
        catch (error) {
            return {
                status: false,
                message: 'Failed to fetch roles',
                error: error.message || error,
            };
        }
    }
    async createRoleWithPermissions(dto, req) {
        const createdBy = req.cookies.system_user_id;
        const encryptedUserId = (0, crypto_utils_1.decrypt)(createdBy.toString());
        if (!encryptedUserId) {
            throw new Error('User ID not found in cookies');
        }
        const userId = Number(encryptedUserId);
        if (isNaN(userId)) {
            throw new Error('Invalid decrypted user ID');
        }
        return this.rolesPermissionsService.createOrganizationRolesPermission(dto, userId);
    }
    async deleteRoleWithPermissions(deleteRoleDto, req, res) {
        const deletedRole = await this.rolesPermissionsService.deleteRoleWithPermissions(deleteRoleDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Role deleted successfully',
        });
    }
};
exports.RolesPermissionsController = RolesPermissionsController;
__decorate([
    (0, common_1.Get)('getAll'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesPermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('getAllRolesForDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesPermissionsController.prototype, "getAllRolesForDropdown", null);
__decorate([
    (0, common_1.Post)('insert_organization_role_permission'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permission_dto_1.CreateRoleWithPermissionsDto, Object]),
    __metadata("design:returntype", Promise)
], RolesPermissionsController.prototype, "createRoleWithPermissions", null);
__decorate([
    (0, common_1.Post)('delete-role-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_roles_permission_dto_1.DeleteRoleDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RolesPermissionsController.prototype, "deleteRoleWithPermissions", null);
exports.RolesPermissionsController = RolesPermissionsController = __decorate([
    (0, common_1.Controller)('roles-permissions'),
    __metadata("design:paramtypes", [roles_permissions_service_1.RolesPermissionsService])
], RolesPermissionsController);
