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
exports.OrganizationRolesPermissionController = void 0;
const common_1 = require("@nestjs/common");
const organization_roles_permission_service_1 = require("./organization_roles_permission.service");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_permission_dto_1 = require("./dto/role_permission.dto");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const update_role_permission_dto_1 = require("./dto/update_role_permission.dto");
const delete_role_permission_dto_1 = require("./dto/delete_role_permission.dto");
const fetch_pagination_dto_1 = require("../common/paginationDTO/fetch-pagination.dto");
const get_role_dto_1 = require("./dto/get_role.dto");
let OrganizationRolesPermissionController = class OrganizationRolesPermissionController {
    constructor(organizationRolesPermissionService) {
        this.organizationRolesPermissionService = organizationRolesPermissionService;
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
        return this.organizationRolesPermissionService.createOrganizationRolesPermission(dto, userId);
    }
    async getAllRolesNames(query, req, res) {
        try {
            const { page, limit, search, sortBy, sortOrder } = query;
            const result = await this.organizationRolesPermissionService.getAllRolesNames(page, limit, search, sortBy, sortOrder);
            return res.status(result.status).json(result);
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getAllInternalRolesNames(page = 1, limit = 10, searchQuery = '') {
        return await this.organizationRolesPermissionService.getAllInternalRolesNames(page, limit, searchQuery);
    }
    async getAllExternalRolesNames(page = 1, limit = 10, searchQuery = '') {
        return await this.organizationRolesPermissionService.getAllExternalRolesNames(page, limit, searchQuery);
    }
    async getAllRolesWithPermissions() {
        const rolesWithPermissions = await this.organizationRolesPermissionService.getAllRolesWithPermissions();
        return {
            status: 200,
            message: 'Roles and permissions fetched successfully',
            data: rolesWithPermissions,
        };
    }
    async updateRoleWithPermissions(updateRoleDto, req, res) {
        const updatedRole = await this.organizationRolesPermissionService.updateRoleWithPermissions(updateRoleDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Role and permissions updated successfully',
            data: updatedRole,
        });
    }
    async bulkUpdateRolePermissions(bulkUpdateDto, res) {
        const updated = await this.organizationRolesPermissionService.bulkUpdateRolePermissions(bulkUpdateDto.roles);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Permissions updated successfully',
            data: updated,
        });
    }
    async fetchSingleRoleWithPermissions(GetRoleDto, res) {
        const response = await this.organizationRolesPermissionService.fetchSingleRoleWithPermissions(GetRoleDto);
        return res.status(response.status).json(response);
    }
    async deleteRoleWithPermissions(deleteRoleDto, req, res) {
        const deletedRole = await this.organizationRolesPermissionService.deleteRoleWithPermissions(deleteRoleDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Roles deleted successfully',
            data: deletedRole,
        });
    }
};
exports.OrganizationRolesPermissionController = OrganizationRolesPermissionController;
__decorate([
    (0, common_1.Post)('insert_organization_role_permission'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permission_dto_1.CreateRoleWithPermissionsDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "createRoleWithPermissions", null);
__decorate([
    (0, common_1.Get)('all-roles-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fetch_pagination_dto_1.FetchPaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "getAllRolesNames", null);
__decorate([
    (0, common_1.Get)('all-internal-roles-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "getAllInternalRolesNames", null);
__decorate([
    (0, common_1.Get)('all-external-roles-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "getAllExternalRolesNames", null);
__decorate([
    (0, common_1.Get)('all-roles-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "getAllRolesWithPermissions", null);
__decorate([
    (0, common_1.Post)('update-role-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_role_permission_dto_1.UpdateRoleWithPermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "updateRoleWithPermissions", null);
__decorate([
    (0, common_1.Post)('bulk-update-role-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "bulkUpdateRolePermissions", null);
__decorate([
    (0, common_1.Post)('fetch-single-role-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_role_dto_1.GetRoleDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "fetchSingleRoleWithPermissions", null);
__decorate([
    (0, common_1.Post)('delete-role-permissions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_role_permission_dto_1.DeleteRoleDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRolesPermissionController.prototype, "deleteRoleWithPermissions", null);
exports.OrganizationRolesPermissionController = OrganizationRolesPermissionController = __decorate([
    (0, common_1.Controller)('organization-roles-permission'),
    __metadata("design:paramtypes", [organization_roles_permission_service_1.OrganizationRolesPermissionService])
], OrganizationRolesPermissionController);
