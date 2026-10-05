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
exports.AssetsProjectsController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const list_view_dto_1 = require("../../common/listviewDTO/list-view.dto");
const tendant_and_schema_helper_1 = require("../../common/utils/tendant_and_schema.helper");
const assets_projects_service_1 = require("./assets-projects.service");
const create_new_project_dto_1 = require("./dto/create-new-project.dto");
const update_assets_project_dto_1 = require("./dto/update-assets-project.dto");
let AssetsProjectsController = class AssetsProjectsController {
    constructor(assetsProjectsService) {
        this.assetsProjectsService = assetsProjectsService;
    }
    async getAllProjects(dto, req) {
        try {
            const { schema, register_login_user_id, branchIds } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.assetsProjectsService.getAllProjects(dto, branchIds);
            return result;
        }
        catch (error) {
            console.error('Error in getAllProjects:', error);
            return {
                success: false,
                message: 'An error occurred while fetching projects',
                error: error.message,
            };
        }
    }
    async getProjectsDropdown(search) {
        try {
            const data = await this.assetsProjectsService.getProjectsDropdown(search);
            return {
                success: true,
                message: data.length > 0 ? 'Projects retrieved successfully.' : 'No projects found.',
                data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'An error occurred while fetching project dropdown data.',
                error: error.message,
            };
        }
    }
    async generateNextProjectCode() {
        const code = await this.assetsProjectsService.generateNextProjectCode();
        return {
            success: true,
            code,
        };
    }
    async createNewProject(body, req, res) {
        try {
            const system_user_id = req.cookies?.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id);
            const localUserId = await this.assetsProjectsService.getUserIdByRegisterLoginId(+decrypted_system_user_id);
            console.log("localUserId", localUserId);
            const response = await this.assetsProjectsService.createNewProject(body, +localUserId);
            return res.status(response.status).json({
                success: response.success,
                message: response.message,
                data: response.data,
            });
        }
        catch (error) {
            return res.status(error.status || 400).json({
                success: false,
                message: error.message || 'Failed to create project',
                data: null,
            });
        }
    }
    async getProjectById(body, res) {
        try {
            const response = await this.assetsProjectsService.getProjectById(body.project_id);
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: `Project with ID ${body.project_id} not found`,
                    data: null,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Project retrieved successfully',
                data: response,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Failed to fetch project',
                data: null,
            });
        }
    }
    async updateProjectById(body, req, res) {
        try {
            const system_user_id = req.cookies?.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const response = await this.assetsProjectsService.updateProjectById(body, +decrypted_system_user_id);
            return res.status(response.status).json({
                success: response.success,
                message: response.message,
                data: response.data || null,
            });
        }
        catch (error) {
            return res.status(error.status || 400).json({
                success: false,
                message: error.message || 'Failed to update project',
                data: null,
            });
        }
    }
    async deleteProjects(dto, res, req) {
        const organizationID = req.cookies.organization_id;
        const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
        if (!encryptedorganizationID) {
            throw new Error('Orgnaization ID not found in cookies');
        }
        const organization_Id = Number(encryptedorganizationID);
        const projectIds = await this.assetsProjectsService.resolveBulkSelectionIds(dto);
        const result = await this.assetsProjectsService.deleteProjects(projectIds, +organization_Id);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async activateProjects(dto, res, req) {
        const project_ids = await this.assetsProjectsService.resolveBulkSelectionIds(dto);
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No user ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!project_ids || project_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'project_ids must be a non-empty array',
                });
            }
            const result = await this.assetsProjectsService.activateProjects(project_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating projects:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivating projects',
                error: error.message || error,
            });
        }
    }
    async deactivateProjects(dto, res, req) {
        const project_ids = await this.assetsProjectsService.resolveBulkSelectionIds(dto);
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No user ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!project_ids || project_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'project_ids must be a non-empty array',
                });
            }
            const result = await this.assetsProjectsService.deactivateProjects(project_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating projects:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivate projects',
                error: error.message || error,
            });
        }
    }
    async generateProjectImportTemplate(req, res) {
        try {
            const buffer = await this.assetsProjectsService.generateProjectImportTemplate();
            const now = new Date();
            const dateStamp = now.toISOString().slice(0, 10);
            const timeStamp = now
                .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
                .replace(/\s/g, '')
                .replace(':', '-');
            const dateTimeStamp = `${dateStamp}_${timeStamp}`;
            res.setHeader('Content-Disposition', 'attachment; filename=project_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating Project template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async bulkCreateProjects(dtos, req) {
        const encryptedSystemUserId = req.cookies.system_user_id;
        const encryptedOrganizationId = req.cookies.organization_id;
        const decryptedSystemUserId = (0, crypto_utils_1.decrypt)(encryptedSystemUserId?.toString());
        const decryptedOrganizationId = (0, crypto_utils_1.decrypt)(encryptedOrganizationId?.toString());
        if (!decryptedOrganizationId) {
            throw new common_1.BadRequestException('Organization ID not found in cookies');
        }
        const organizationId = Number(decryptedOrganizationId);
        if (isNaN(organizationId)) {
            throw new common_1.BadRequestException('Invalid decrypted organization ID');
        }
        if (!decryptedSystemUserId) {
            throw new common_1.UnauthorizedException('Unauthorized: Invalid or missing user ID.');
        }
        const localUserId = await this.assetsProjectsService.getUserIdByRegisterLoginId(+decryptedSystemUserId);
        try {
            return await this.assetsProjectsService.bulkCreateProjects(dtos, organizationId, +localUserId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create projects in bulk.');
        }
    }
    async exportProjectsToExcel(res, dto) {
        const buffer = await this.assetsProjectsService.exportProjectsToExcle(dto);
        const now = new Date();
        const dateStamp = now.toISOString().slice(0, 10);
        const timeStamp = now
            .toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
            .replace(/\s/g, '')
            .replace(':', '-');
        const dateTimeStamp = `${dateStamp}_${timeStamp}`;
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=project-export-file-${dateTimeStamp}.xlsx`,
        });
        res.end(buffer);
    }
};
exports.AssetsProjectsController = AssetsProjectsController;
__decorate([
    (0, common_1.Post)('get-all-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "getAllProjects", null);
__decorate([
    (0, common_1.Get)('projects-dropdown-options'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "getProjectsDropdown", null);
__decorate([
    (0, common_1.Get)('generate-project-code'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "generateNextProjectCode", null);
__decorate([
    (0, common_1.Post)('create-new-project'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_new_project_dto_1.CreateProjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "createNewProject", null);
__decorate([
    (0, common_1.Post)('get-project-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "getProjectById", null);
__decorate([
    (0, common_1.Post)('update-project-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_assets_project_dto_1.UpdateProjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "updateProjectById", null);
__decorate([
    (0, common_1.Post)('delete-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "deleteProjects", null);
__decorate([
    (0, common_1.Post)('activate-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "activateProjects", null);
__decorate([
    (0, common_1.Post)('deactivate-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "deactivateProjects", null);
__decorate([
    (0, common_1.Get)('download-project-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "generateProjectImportTemplate", null);
__decorate([
    (0, common_1.Post)('create-bulk-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "bulkCreateProjects", null);
__decorate([
    (0, common_1.Post)('export-projects-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetsProjectsController.prototype, "exportProjectsToExcel", null);
exports.AssetsProjectsController = AssetsProjectsController = __decorate([
    (0, common_1.Controller)('assets-projects'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assets_projects_service_1.AssetsProjectsService])
], AssetsProjectsController);
