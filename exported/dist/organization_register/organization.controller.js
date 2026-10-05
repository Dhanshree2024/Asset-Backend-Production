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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const create_organization_dto_1 = require("./create-organization.dto");
const resend_otp_dto_1 = require("./dto/resend-otp.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    async createOrganization(createOrganizationDto, context) {
        return await this.organizationService.createOrganization(createOrganizationDto, context);
    }
    async verifyUserWithoutOtp(userId) {
        return await this.organizationService.verifyOtp(userId);
    }
    async resendOtp(resendOtpDto, context) {
        return await this.organizationService.resendOtp(resendOtpDto, context);
    }
    async createCustomerOrganization(createOrganizationDto, context) {
        return await this.organizationService.createCustomerOrganization(createOrganizationDto, context);
    }
    async storeAssetLimitations(body, res) {
        console.log("🔥 HIT store-asset-limitations API");
        console.log("👉 Incoming Body:", JSON.stringify(body, null, 2));
        try {
            const { orgId, billingOrgId, limitations } = body;
            if (!orgId || !billingOrgId || !Array.isArray(limitations)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input: orgId, billingOrgId, or limitations are missing/invalid',
                });
            }
            console.log(`✅ Valid request for orgId=${orgId}, billingOrgId=${billingOrgId}`);
            console.log(`📦 Limitations count: ${limitations.length}`);
            await this.organizationService.storeOrgLimitationsInAssetDB(orgId, billingOrgId, limitations);
            console.log("✅ Successfully stored in DB");
            return res.status(200).json({
                success: true,
                message: `✅ Limitations stored successfully for org ${orgId}`,
            });
        }
        catch (error) {
            console.error('❌ Error storing asset limitations:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to store asset limitations',
                error: error.message,
            });
        }
    }
    async getByBillingOrg(billingOrgId) {
        try {
            const result = await this.organizationService.getByBillingOrgId(billingOrgId);
            return {
                success: true,
                message: 'Data fetched successfully',
                result,
            };
        }
        catch (error) {
            console.error('❌ Error fetching by billing org:', error);
            throw new common_1.HttpException(error.message || 'Failed to fetch data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateAssetLimitations(body) {
        try {
            const result = await this.organizationService.updateAssetLimitations(body.billingOrgId, body.limitations);
            return {
                success: true,
                message: 'Asset limitations updated successfully',
                result,
            };
        }
        catch (error) {
            console.error('❌ Error updating asset limitations:', error);
            throw new common_1.HttpException('Failed to update asset limitations', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkAssetRestriction(body, res) {
        try {
            const { orgId, featureId } = body;
            if (!orgId || !featureId) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'orgId or featureId is missing in request',
                });
            }
            const restriction = await this.organizationService.getRestrictionByFeatureId(orgId, featureId);
            if (!restriction) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'No restriction found for this feature in organization',
                });
            }
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Fetched feature restriction successfully',
                data: restriction,
            });
        }
        catch (error) {
            console.error('❌ Error fetching feature restriction:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to fetch feature restriction',
            });
        }
    }
    async updateUsageCount(body) {
        try {
            const result = await this.organizationService.updateUsageCount(body.orgId, body.featureId, body.currentValue);
            return {
                success: true,
                message: 'Usage value updated successfully',
                result,
            };
        }
        catch (error) {
            console.error('❌ Error updating usage value:', error);
            throw new common_1.HttpException('Failed to update usage value', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Post)('verify-user'),
    __param(0, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "verifyUserWithoutOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('create-customer-organisation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createCustomerOrganization", null);
__decorate([
    (0, common_1.Post)('store-asset-limitations'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "storeAssetLimitations", null);
__decorate([
    (0, common_1.Get)('get-by-billing-org/:billingOrgId'),
    __param(0, (0, common_1.Param)('billingOrgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getByBillingOrg", null);
__decorate([
    (0, common_1.Post)('update-asset-limitations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateAssetLimitations", null);
__decorate([
    (0, common_1.Post)('check-asset-restriction-by-feature'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "checkAssetRestriction", null);
__decorate([
    (0, common_1.Post)('update-usage-count'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateUsageCount", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, common_1.Controller)('organization'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
