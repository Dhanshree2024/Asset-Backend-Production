"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictionUIUtil = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
class RestrictionUIUtil {
    static async checkRestrictionForUI(orgId, featureId) {
        try {
            const assetApiUrl = `${process.env.ASSET_API_URL}/organization/check-asset-restriction-by-feature`;
            const assetResponse = await axios_1.default.post(assetApiUrl, {
                orgId,
                featureId,
            });
            if (!assetResponse.data.success) {
                throw new common_1.HttpException(assetResponse.data.message || 'Asset restriction check failed', common_1.HttpStatus.BAD_REQUEST);
            }
            const assetRestriction = assetResponse.data.data;
            const billingOrgId = assetRestriction.billing_org_id ?? assetRestriction.billingOrgId;
            if (!billingOrgId) {
                throw new common_1.HttpException('Billing organization id not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const limitValue = assetRestriction.overrideValue ?? assetRestriction.defaultValue;
            const currentUsage = Number(assetRestriction.currentUsage ?? 0);
            let assetLimitReached = false;
            if (limitValue !== null &&
                limitValue !== undefined &&
                String(limitValue).toLowerCase() !== 'unlimited') {
                assetLimitReached = currentUsage >= Number(limitValue);
            }
            const billingApiUrl = `${process.env.BILLING_API_URL}/organizational-profile/check-restriction-by-feature`;
            const billingResponse = await axios_1.default.post(billingApiUrl, {
                orgId: billingOrgId,
                featureId,
            });
            if (!billingResponse.data.success) {
                throw new common_1.HttpException(billingResponse.data.message || 'Billing restriction check failed', common_1.HttpStatus.BAD_REQUEST);
            }
            const billingRestriction = billingResponse.data.data;
            const allowed = !assetLimitReached && billingRestriction.limit_reached === false;
            return {
                allowed,
                assetRestriction: {
                    ...assetRestriction,
                    limitReached: assetLimitReached,
                },
                billingRestriction,
            };
        }
        catch (error) {
            console.error('Restriction UI Error:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.message || 'Restriction check failed', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.RestrictionUIUtil = RestrictionUIUtil;
