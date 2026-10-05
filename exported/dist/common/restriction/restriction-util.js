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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictionUtil = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const asset_limitation_entity_1 = require("../../organizational-profile/public_schema_entity/asset-limitation.entity");
let RestrictionUtil = class RestrictionUtil {
    constructor(limitationRepo) {
        this.limitationRepo = limitationRepo;
    }
    static async checkRestrictionAndLimitation(orgId, featureId) {
        try {
            const assetApiUrl = `${process.env.ASSET_API_URL}/organization/check-asset-restriction-by-feature`;
            console.log(`🚀 Calling Asset API: ${assetApiUrl} with orgId=${orgId}, featureId=${featureId}`);
            const assetResponse = await axios_1.default.post(assetApiUrl, { orgId, featureId });
            if (!assetResponse.data.success) {
                throw new common_1.HttpException(assetResponse.data.message || 'Asset restriction check failed', common_1.HttpStatus.BAD_REQUEST);
            }
            const assetData = assetResponse.data.data;
            const billingOrgId = assetData.billing_org_id ?? assetData.billingOrgId;
            if (!billingOrgId) {
                throw new common_1.HttpException('billing_org_id or(billingOrgId) missing in asset response', common_1.HttpStatus.BAD_REQUEST);
            }
            const billingApiUrl = `${process.env.BILLING_API_URL}/organizational-profile/check-restriction-by-feature`;
            const billingResponse = await axios_1.default.post(billingApiUrl, {
                orgId: billingOrgId,
                featureId,
            });
            if (!billingResponse.data.success) {
                throw new common_1.HttpException(billingResponse.data.message || 'Billing restriction check failed', common_1.HttpStatus.BAD_REQUEST);
            }
            const finalResponse = {
                assetRestriction: assetData,
                billingRestriction: billingResponse.data.data,
            };
            console.log("✅ Final Restriction Check Result:", JSON.stringify(finalResponse, null, 2));
            return {
                assetRestriction: assetData,
                billingRestriction: billingResponse.data.data,
            };
        }
        catch (error) {
            console.error('❌ Restriction check failed:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.message || 'Failed to check restriction and limitation', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.RestrictionUtil = RestrictionUtil;
exports.RestrictionUtil = RestrictionUtil = __decorate([
    __param(0, (0, typeorm_2.InjectRepository)(asset_limitation_entity_1.AssetLimitation)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], RestrictionUtil);
