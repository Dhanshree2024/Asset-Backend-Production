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
exports.ProfileImageController = void 0;
const common_1 = require("@nestjs/common");
const profile_image_service_1 = require("./profile-image.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_config_1 = require("./upload.config");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProfileImageController = class ProfileImageController {
    constructor(profileImageService) {
        this.profileImageService = profileImageService;
    }
    async uploadUserProfile(file, body, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const userId = +body.userId;
        if (!userId)
            throw new common_1.BadRequestException('Missing userId');
        const user = await this.profileImageService.saveUserImage(userId, file.path);
        return {
            message: 'User profile uploaded successfully',
            path: file.path,
            user,
        };
    }
    async resetUserProfile(body) {
        const userId = +body.userId;
        if (!userId)
            throw new common_1.BadRequestException('Missing userId');
        const user = await this.profileImageService.resetUserImage(userId);
        return {
            message: 'User profile image reset to default',
            user,
        };
    }
    async uploadCompanyLogo(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        let organizationID;
        organizationID = 1;
        const org = await this.profileImageService.saveCompanyImage(+organizationID, file.path);
        return {
            message: 'Company logo uploaded successfully',
            path: file.path,
            org,
        };
    }
    async resetCompanyLogo(body) {
        const orgId = +body.orgId;
        if (!orgId)
            throw new common_1.BadRequestException('Missing orgId');
        const org = await this.profileImageService.resetCompanyImage(orgId);
        return {
            message: 'Company logo reset to default',
            org,
        };
    }
};
exports.ProfileImageController = ProfileImageController;
__decorate([
    (0, common_1.Post)('user-profile-upload'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, upload_config_1.generateSimpleStorage)('user'),
        fileFilter: upload_config_1.imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileImageController.prototype, "uploadUserProfile", null);
__decorate([
    (0, common_1.Patch)('user-profile-reset'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileImageController.prototype, "resetUserProfile", null);
__decorate([
    (0, common_1.Post)('company-logo-upload'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, upload_config_1.generateSimpleStorage)('company'),
        fileFilter: upload_config_1.imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileImageController.prototype, "uploadCompanyLogo", null);
__decorate([
    (0, common_1.Patch)('company-logo-reset'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileImageController.prototype, "resetCompanyLogo", null);
exports.ProfileImageController = ProfileImageController = __decorate([
    (0, common_1.Controller)('profile-image'),
    __metadata("design:paramtypes", [profile_image_service_1.ProfileImageService])
], ProfileImageController);
