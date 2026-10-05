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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const cookie_1 = require("cookie");
const typeorm_1 = require("typeorm");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const verify_otp_dto_1 = require("../organization_register/verify-otp.dto");
const api_key_guard_1 = require("./api-key.guard");
const auth_service_1 = require("./auth.service");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const login_dto_1 = require("./dto/login.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const redis_service_1 = require("../common/redis/redis.service");
let AuthController = class AuthController {
    constructor(authService, dataSource, redisService) {
        this.authService = authService;
        this.dataSource = dataSource;
        this.redisService = redisService;
    }
    async login(loginDto, response, req) {
        const result = await this.authService.validateUser(loginDto, response, req);
        return result;
    }
    async getMe(req, response) {
        return this.authService.getSessionContext(req, response);
    }
    async fetchUserLoginProfile(req, res) {
        const createdBy = req.cookies.system_user_id;
        if (!createdBy) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.BAD_REQUEST, message: 'user id and status id is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.authService.fetchUserLoginProfile(Number((0, crypto_utils_1.decrypt)(createdBy)));
            return res.status(200).json({
                result
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async fetchUserLoginProfile2(req, res) {
        const createdBy = req.cookies.system_user_id;
        if (!createdBy) {
            throw new common_1.HttpException({ statusCode: common_1.HttpStatus.BAD_REQUEST, message: 'user id and status id is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.authService.fetchUserLoginProfile2(Number((0, crypto_utils_1.decrypt)(createdBy)));
            return res.status(200).json({
                result
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getApiKey(res) {
        try {
            const apiKey = await this.authService.getApiKey();
            console.log(apiKey);
            if (!apiKey) {
                throw new Error('API key not found.');
            }
            return res.status(200).json({ apiKey });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async updatePassword(req, res, updatePasswordDto) {
        const { userId, currentPassword, newPassword } = updatePasswordDto;
        try {
            const result = await this.authService.updatePassword(userId, newPassword, res, currentPassword);
            console.log(result);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                res.status(401).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    }
    checkSession(req) {
        const userId = req.session?.user_id;
        const sessionId = req.session?.session_id;
        if (userId && sessionId) {
            return { status: 'active', user_id: userId, session_id: sessionId };
        }
        return { status: 'inactive' };
    }
    async logout(req, res) {
        const result = await this.authService.logout(req, res);
        return res.status(200).json(result);
    }
    async logoutAll(req, res) {
        const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
        const userIdEncrypted = cookies.system_user_id;
        if (!userIdEncrypted) {
            throw new common_1.UnauthorizedException('User ID missing in cookies');
        }
        const userId = Number((0, crypto_utils_1.decrypt)(userIdEncrypted));
        const result = await this.authService.logoutAllSessions(userId, res);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async logoutAllById(userId, res) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        console.log("userId received from frontend:", userId);
        const result = await this.authService.forceLogoutByUserId(userId);
        return res.status(200).json({
            status: "success",
            message: "All sessions forcibly logged out for this user",
            data: result
        });
    }
    async validateToken() {
        return { message: 'Token is valid' };
    }
    async validateResetLink(userId) {
        const isValid = await this.authService.validatePasswordResetLink(userId);
        if (!isValid) {
            throw new common_1.GoneException('This password reset link has expired or is invalid');
        }
        return { valid: true };
    }
    async forgotPassword(forgotPasswordDto, res, req) {
        try {
            const result = await this.authService.sendOtpForPasswordReset(forgotPasswordDto.email);
            return res.status(result.status).json(result);
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async verifyForgotPasswordOtp(verifyOtpDto, res) {
        try {
            const result = await this.authService.verifyForgotPasswordOtp(verifyOtpDto, res);
            res.status(common_1.HttpStatus.OK).json({ status: 200, message: 'OTP has been verified.' });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Failed to verify OTP.' });
        }
    }
    clearCookies(response, req) {
        this.authService.clearAuthCookies(response);
        response.json({ success: true });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('fetch-profile'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fetchUserLoginProfile", null);
__decorate([
    (0, common_1.Get)('fetch-profile2'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fetchUserLoginProfile2", null);
__decorate([
    (0, common_1.Get)('apikey'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getApiKey", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('check-session'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkSession", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Post)('logout-all-by-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAllById", null);
__decorate([
    (0, common_1.Post)('validate-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Get)('validate-reset-link'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateResetLink", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-forgotpassword-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyForgotPasswordOtp", null);
__decorate([
    (0, common_1.Post)('clear-cookies'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "clearCookies", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_1.DataSource,
        redis_service_1.RedisService])
], AuthController);
