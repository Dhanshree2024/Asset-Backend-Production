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
exports.CustomViewController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const custom_view_service_1 = require("./custom-view.service");
const create_custom_view_dto_1 = require("./dto/create-custom-view.dto");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
let CustomViewController = class CustomViewController {
    constructor(customViewService) {
        this.customViewService = customViewService;
    }
    async createCustomView(dto, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
            }
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.customViewService.getUserByPublicID(Number(decrypted_user_id));
            const organizationID = req.cookies.organization_id;
            if (!organizationID) {
                return res.status(401).json({
                    status: 401,
                    message: 'Organization not found in cookies',
                });
            }
            const decryptedOrganizationID = (0, crypto_utils_1.decrypt)(organizationID.toString());
            const organization_id = Number(decryptedOrganizationID);
            if (isNaN(organization_id)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid organization ID',
                });
            }
            const result = await this.customViewService.createCustomView(dto, userId, organization_id);
            return res.status(result.status).json(result);
        }
        catch (error) {
            console.error('Create custom view error:', error);
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong',
            });
        }
    }
    async deleteCustomView(id) {
        return await this.customViewService.deleteCustomView(id);
    }
    async listCustomViews(req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({ status: 401, message: 'Unauthorized' });
            }
            const decrypted_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.customViewService.getUserByPublicID(Number(decrypted_id));
            const organization_id = req.user?.organization_id || 0;
            const views = await this.customViewService.getCustomViews(userId, organization_id);
            return res.status(200).json(views);
        }
        catch (err) {
            console.error('Load custom views error:', err);
            return res.status(500).json({ status: 500, message: 'Failed to load custom views' });
        }
    }
    async getUserCustomViews(req, res) {
        console.log("🔵 Hit /user-custom-views API");
        try {
            const encOrgId = req.cookies.organization_id;
            if (!encOrgId) {
                return res.status(400).json({
                    status: 400,
                    message: 'Organization ID not found in cookies',
                });
            }
            const organizationID = Number((0, crypto_utils_1.decrypt)(encOrgId.toString()));
            console.log("🏢 organizationID:", organizationID);
            if (isNaN(organizationID)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid decrypted organization ID',
                });
            }
            const encUserId = req.cookies.system_user_id;
            if (!encUserId) {
                return res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
            }
            console.log("🔐 system_user_id from cookie:", encUserId);
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(encUserId.toString());
            console.log("🔓 decrypted_user_id:", decrypted_user_id);
            const userId = await this.customViewService.getUserByPublicID(Number(decrypted_user_id));
            const result = await this.customViewService.getCustomViewsByUser(userId, organizationID);
            return res.status(200).json({
                status: 200,
                message: 'Custom views fetched successfully',
                data: result,
            });
        }
        catch (error) {
            console.error('Get user custom views error:', error);
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong',
            });
        }
    }
};
exports.CustomViewController = CustomViewController;
__decorate([
    (0, common_1.Post)('insert-custom-view'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_custom_view_dto_1.CreateCustomViewDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomViewController.prototype, "createCustomView", null);
__decorate([
    (0, common_1.Delete)('delete-custom-view'),
    __param(0, (0, common_1.Body)('custom_view_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomViewController.prototype, "deleteCustomView", null);
__decorate([
    (0, common_1.Get)('list-custom-views'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomViewController.prototype, "listCustomViews", null);
__decorate([
    (0, common_1.Get)('user-custom-views'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomViewController.prototype, "getUserCustomViews", null);
exports.CustomViewController = CustomViewController = __decorate([
    (0, common_1.Controller)('custom-view'),
    __metadata("design:paramtypes", [custom_view_service_1.CustomViewService])
], CustomViewController);
