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
exports.PolicyController = void 0;
const common_1 = require("@nestjs/common");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const policy_service_1 = require("./policy.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const create_policy_version_dto_1 = require("./dto/create-policy-version.dto");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
let PolicyController = class PolicyController {
    constructor(policyService) {
        this.policyService = policyService;
    }
    async resolveUserId(req) {
        const systemUserId = req.cookies.system_user_id;
        if (!systemUserId) {
            throw new common_1.BadRequestException('System user ID not found in cookies');
        }
        const decryptedSystemUserId = (0, crypto_utils_1.decrypt)(systemUserId.toString());
        if (!decryptedSystemUserId) {
            throw new common_1.BadRequestException('Invalid system user ID');
        }
        return this.policyService.getUserByPublicID(Number(decryptedSystemUserId));
    }
    async create(file, dto, req) {
        const userId = await this.resolveUserId(req);
        return this.policyService.createPolicy(dto, userId, file);
    }
    async findAll(dto, req) {
        const encryptedSchema = req.cookies['x-organization-schema'];
        if (!encryptedSchema) {
            throw new common_1.BadRequestException('x-organization-schema cookie not found');
        }
        const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
        const schema = `org_${schemaName}`;
        return this.policyService.findAll(schema, dto);
    }
    async findOne(policy_id) {
        if (!policy_id) {
            throw new common_1.BadRequestException('policy_id is required');
        }
        return this.policyService.findOne(Number(policy_id));
    }
    async update(dto, req) {
        if (!dto.policy_id) {
            throw new common_1.BadRequestException('policy_id is required');
        }
        const userId = await this.resolveUserId(req);
        const { policy_id, ...updateFields } = dto;
        return this.policyService.updatePolicy(Number(policy_id), updateFields, userId);
    }
    async createVersion(file, dto, req) {
        const userId = await this.resolveUserId(req);
        return this.policyService.createVersion(dto, userId, file);
    }
    async publishVersion(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.publishVersion(Number(policy_id), Number(versionId), userId);
    }
    async unpublishVersion(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.unpublishVersion(Number(policy_id), Number(versionId), userId);
    }
    async markAllAcknowledged(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.markAllAcknowledged(Number(policy_id), Number(versionId), userId);
    }
    async findMyPolicies(dto, req) {
        const userId = await this.resolveUserId(req);
        const encryptedSchema = req.cookies['x-organization-schema'];
        if (!encryptedSchema) {
            throw new common_1.BadRequestException('x-organization-schema cookie not found');
        }
        const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
        const schema = `org_${schemaName}`;
        return this.policyService.findMyPolicies(schema, userId, dto);
    }
    async acknowledgePolicy(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.acknowledgePolicy(Number(policy_id), Number(versionId), userId);
    }
    async updateDraftVersion(file, policy_id, versionId, dto, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        const { policy_id: _pid, versionId: _vid, ...rest } = dto;
        return this.policyService.updateDraftVersion(Number(policy_id), Number(versionId), rest, userId, file);
    }
    async getAcknowledgements(dto) {
        if (!dto.policy_id || !dto.policy_version_id || !dto.type) {
            throw new common_1.BadRequestException('policy_id, policy_version_id, and type are required');
        }
        return this.policyService.getAcknowledgements(Number(dto.policy_id), Number(dto.policy_version_id), dto.type, dto);
    }
    async sendReminder(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.sendPolicyReminder(Number(policy_id), Number(versionId), userId);
    }
    async findMyPolicyDetail(policy_id, versionId, req) {
        if (!policy_id || !versionId) {
            throw new common_1.BadRequestException('policy_id and versionId are required');
        }
        const userId = await this.resolveUserId(req);
        return this.policyService.findMyPolicyDetail(userId, Number(policy_id), Number(versionId));
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Post)('create-policy'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('documents', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/policy_documents',
            filename: (req, file, cb) => {
                const uniqueName = 'policy-' + Date.now() + (0, path_1.extname)(file.originalname);
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_policy_dto_1.CreatePolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('get-policies'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('get-policy'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('update-policy'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('versions'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('documents', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/policy_documents',
            filename: (req, file, cb) => {
                const uniqueName = 'policy-' + Date.now() + (0, path_1.extname)(file.originalname);
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_policy_version_dto_1.CreatePolicyVersionDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Post)('versions/publish'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "publishVersion", null);
__decorate([
    (0, common_1.Post)('versions/unpublish'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "unpublishVersion", null);
__decorate([
    (0, common_1.Post)('versions/mark-all-acknowledged'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "markAllAcknowledged", null);
__decorate([
    (0, common_1.Post)('my-policies'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findMyPolicies", null);
__decorate([
    (0, common_1.Post)('versions/acknowledge'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "acknowledgePolicy", null);
__decorate([
    (0, common_1.Post)('update-draft'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('documents', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/policy_documents',
            filename: (req, file, cb) => {
                const uniqueName = 'policy-' + Date.now() + (0, path_1.extname)(file.originalname);
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('policy_id')),
    __param(2, (0, common_1.Body)('versionId')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "updateDraftVersion", null);
__decorate([
    (0, common_1.Post)('acknowledgements'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getAcknowledgements", null);
__decorate([
    (0, common_1.Post)('versions/send-reminder'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.Post)('my-policy-detail'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('policy_id')),
    __param(1, (0, common_1.Body)('versionId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findMyPolicyDetail", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], PolicyController);
