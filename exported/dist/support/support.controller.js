"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs = __importStar(require("fs"));
const path_1 = require("path");
const support_service_1 = require("./support.service");
const create_support_ticket_dto_1 = require("./dto/create-support-ticket.dto");
const create_support_message_dto_1 = require("./dto/create-support-message.dto");
;
const common_2 = require("@nestjs/common");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const mark_setup_complete_dto_1 = require("./dto/mark-setup-complete.dto");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
let SupportController = class SupportController {
    constructor(supportService) {
        this.supportService = supportService;
    }
    async createTicket(req, dto, attachment) {
        const attachmentPath = attachment?.path || null;
        return this.supportService.createTicket(dto, req.cookies.system_user_id, attachmentPath);
    }
    async sendMessage(dto) {
        return this.supportService.sendMessage(dto);
    }
    getTickets(req, status, period, page = 1, limit = 5) {
        const systemUserId = req.cookies.system_user_id;
        return this.supportService.getTickets({
            status,
            period,
            page: Number(page),
            limit: Number(limit),
            systemUserId,
        });
    }
    async getSingleTicket(ticketId) {
        if (!ticketId) {
            return {
                status: 400,
                message: 'ticket_id is required',
                data: null,
            };
        }
        const id = Number(ticketId);
        if (isNaN(id)) {
            return {
                status: 400,
                message: 'ticket_id must be a number',
                data: null,
            };
        }
        return this.supportService.getSingleTicket(id);
    }
    async syncTicketStatus(body) {
        console.log("🔵 [ASSET] Sync request received");
        console.log("Payload:", body);
        try {
            await this.supportService.updateTicketStatusInOrgSchema(body.ticketId, body.status, body.orgId);
            console.log("🟢 [ASSET] Status updated successfully");
            return { success: true, message: "Status updated in org schema" };
        }
        catch (err) {
            console.error("🔴 [ASSET] Sync failed:", err.message);
            return { success: false, message: err.message };
        }
    }
    async markComplete(dto, req) {
        const main_user_id = req.cookies.main_user_id;
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
        const userId = Number(decrypted_user_id);
        const organization_id = req.cookies.organization_id;
        const decrypted_org_id = (0, crypto_utils_1.decrypt)(organization_id);
        const organizationId = Number(decrypted_org_id);
        return this.supportService.markTaskComplete(dto, userId, organizationId);
    }
    async getOrganizationProgress(body) {
        return this.supportService.getOrganizationProgress(body.organization_id, body.plan_id);
    }
    async getUserProgress(body) {
        return this.supportService.getUserProgress(body.organization_id, body.user_id);
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Post)("support-tickets"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('attachment', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadFolder = './uploads/support-tickets';
                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }
                cb(null, uploadFolder);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const fileExt = (0, path_1.extname)(file.originalname);
                cb(null, `attachment-${uniqueSuffix}${fileExt}`);
            },
        }),
    })),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_support_ticket_dto_1.CreateSupportTicketDto, Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Post)('send-messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_support_message_dto_1.CreateSupportMessageDto]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)("tickets"),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("period")),
    __param(3, (0, common_1.Query)("page")),
    __param(4, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getTickets", null);
__decorate([
    (0, common_1.Get)('get-single-ticket'),
    __param(0, (0, common_1.Query)('ticket_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getSingleTicket", null);
__decorate([
    (0, common_1.Post)("sync-ticket-status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "syncTicketStatus", null);
__decorate([
    (0, common_1.Post)('markComplete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_setup_complete_dto_1.MarkTaskCompleteDto, Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "markComplete", null);
__decorate([
    (0, common_1.Post)('getOrganizationProgress'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getOrganizationProgress", null);
__decorate([
    (0, common_1.Post)('getUserProgress'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getUserProgress", null);
exports.SupportController = SupportController = __decorate([
    (0, common_1.Controller)("support"),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
