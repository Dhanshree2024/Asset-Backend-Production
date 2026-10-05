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
exports.ManageAssetController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const redis_service_1 = require("../common/redis/redis.service");
const tendant_and_schema_helper_1 = require("../common/utils/tendant_and_schema.helper");
const manage_asset_service_1 = require("./manage-asset.service");
let ManageAssetController = class ManageAssetController {
    constructor(manageAssetService, redisService) {
        this.manageAssetService = manageAssetService;
        this.redisService = redisService;
    }
    async scheduleMaintenance(body, req) {
        const { assetStockIds, isSelectAll, filters, excludeIds, expectedCount } = body;
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        if (!register_login_user_id) {
            return { success: false, message: 'User not authenticated' };
        }
        const userId = await this.manageAssetService.getUserByPublicID(Number(register_login_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const result = await this.manageAssetService.scheduleMaintenanceByAssetId(assetStockIds, schema, userId, isSelectAll, filters, branchIds, excludeIds, expectedCount);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async markForScrap(body, req) {
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        if (!register_login_user_id) {
            return { success: false, message: 'User not authenticated' };
        }
        const userId = await this.manageAssetService.getUserByPublicID(Number(register_login_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const result = await this.manageAssetService.markAssetsForScrapByMappingId(body.stockIds, userId, schema, body.isSelectAll, body.filters, branchIds, body.excludeIds, body.expectedCount);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async getAllMaintenance(dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema,
                dto.login_user_id = register_login_user_id;
            const result = await this.manageAssetService.getAllMaintenance(dto);
            return result;
        }
        catch (error) {
            console.error('Error in getAllMaintenance controller:', error);
            return {
                success: false,
                message: 'Failed to fetch maintenance records',
                error: error.message,
            };
        }
    }
    async getSingleMaintenance(maintenance_id) {
        if (!maintenance_id) {
            return {
                status: 400,
                message: 'maintenance_id is required',
                data: null,
            };
        }
        return this.manageAssetService.getSingleMaintenance(maintenance_id);
    }
    async updateMaintenance(body, req) {
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        return this.manageAssetService.updateMaintenance(body, schema);
    }
    async updateMaintenanceStatus(body, req) {
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        return this.manageAssetService.updateMaintenanceStatus(body, schema);
    }
    async getAllScrap(dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.manageAssetService.getAllScrap(dto);
            return result;
        }
        catch (error) {
            console.error('Error in getAllScrap controller:', error);
            return {
                success: false,
                message: 'Failed to fetch scrap records',
                error: error.message,
            };
        }
    }
    async getSingleScrap(scrap_id) {
        if (!scrap_id) {
            return {
                status: 400,
                message: 'scrap_id is required',
                data: null,
            };
        }
        return this.manageAssetService.getSingleScrap(scrap_id);
    }
    async updateScrap(body, req, files) {
        console.log('BODY:', body);
        let scrapIds = [];
        if (body.scrap_id) {
            if (typeof body.scrap_id === 'string') {
                scrapIds = body.scrap_id.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
            }
            else if (Array.isArray(body.scrap_id)) {
                scrapIds = body.scrap_id.map(id => Number(id)).filter(id => !isNaN(id));
            }
            else {
                const singleId = Number(body.scrap_id);
                if (!isNaN(singleId)) {
                    scrapIds.push(singleId);
                }
            }
        }
        const dto = {
            scrap_ids: scrapIds,
            scrapDate: body.scrap_date,
            scrapValue: body.scrap_value,
            finalAuctionValue: body.final_auction_value,
            reason: body.scrap_reason,
            condition: body.asset_working_condition_id,
            disposalMethod: body.disposal_method,
            vendorId: body.vendorId,
            referenceInvoiceNo: body.reference_invoice_no,
            donatedTo: body.donated_to,
            auctionReferenceNo: body.auction_reference_no,
            buyerDetails: body.buyer_details,
            approvedBy: body.approved_by,
            scrappedBy: body.scrapped_by,
            notes: body.notes,
            assetCondition: body.asset_condition,
            certificateOfDisposal: files.certificate_of_disposal?.[0]?.path ?? null,
            donationLetterNo: files.donation_letter_no?.[0]?.path ?? null,
            authorizationApproval: files.authorization_approval?.[0]?.path ?? null,
            approvalDocument: files.approval_document?.[0]?.path ?? null,
        };
        const { schema } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        return this.manageAssetService.updateScrap(dto, schema);
    }
    async updateScrapStatus(body, req) {
        console.log('BODY:', body);
        const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
        body.schema = schema;
        body.login_user_id = register_login_user_id;
        return this.manageAssetService.updateScrapStatus(body);
    }
    async sidebarCount(req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        return this.manageAssetService.manageAssetsSidebarCount(branchIds);
    }
    async exportMaintenance(res, dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const buffer = await this.manageAssetService.exportMaintenanceToExcel(dto);
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
                'Content-Disposition': `attachment; filename=maintenance-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportMaintenance:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while exporting maintenance records',
                error: error.message,
            });
        }
    }
    async exportScrap(res, dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const buffer = await this.manageAssetService.exportScrapToExcel(dto);
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
                'Content-Disposition': `attachment; filename=scrap-${dateTimeStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportScrap:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while exporting scrap records',
                error: error.message,
            });
        }
    }
};
exports.ManageAssetController = ManageAssetController;
__decorate([
    (0, common_1.Post)('schedule-maintenance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "scheduleMaintenance", null);
__decorate([
    (0, common_1.Post)('mark-for-scrap'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "markForScrap", null);
__decorate([
    (0, common_1.Post)('get-all-maintenance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "getAllMaintenance", null);
__decorate([
    (0, common_1.Get)('get-single-maintenance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('maintenance_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "getSingleMaintenance", null);
__decorate([
    (0, common_1.Post)('update-maintenance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "updateMaintenance", null);
__decorate([
    (0, common_1.Post)('update-maintenance-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "updateMaintenanceStatus", null);
__decorate([
    (0, common_1.Post)('get-all-scrap'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "getAllScrap", null);
__decorate([
    (0, common_1.Get)('get-single-scrap'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('scrap_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "getSingleScrap", null);
__decorate([
    (0, common_1.Post)('update-scrap'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'certificate_of_disposal', maxCount: 1 },
        { name: 'donation_letter_no', maxCount: 1 },
        { name: 'authorization_approval', maxCount: 1 },
        { name: 'approval_document', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/scrap_documents',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const fileExt = (0, path_1.extname)(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "updateScrap", null);
__decorate([
    (0, common_1.Post)('update-scrap-status'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "updateScrapStatus", null);
__decorate([
    (0, common_1.Get)('get-manage-assets-counts-for-sidebar'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "sidebarCount", null);
__decorate([
    (0, common_1.Post)('export-maintenance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "exportMaintenance", null);
__decorate([
    (0, common_1.Post)('export-scrap'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], ManageAssetController.prototype, "exportScrap", null);
exports.ManageAssetController = ManageAssetController = __decorate([
    (0, common_1.Controller)("manage-asset"),
    __metadata("design:paramtypes", [manage_asset_service_1.ManageAssetService,
        redis_service_1.RedisService])
], ManageAssetController);
