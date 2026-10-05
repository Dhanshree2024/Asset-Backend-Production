"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageUtil = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
class UsageUtil {
    static async updateUsageCountInBothPortals(orgId, featureId, currentValue) {
        try {
            let operation = 'set';
            let delta = 0;
            if (currentValue.startsWith('increment')) {
                operation = 'increment';
                const parts = currentValue.split(':');
                delta = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
            }
            else if (currentValue.startsWith('decrement')) {
                operation = 'decrement';
                const parts = currentValue.split(':');
                delta = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
            }
            const assetApiUrl = `${process.env.ASSET_API_URL}/organization/update-usage-count`;
            console.log(`🚀 Updating Asset usage count at: ${assetApiUrl} (orgId=${orgId}, featureId=${featureId}, currentValue=${currentValue})`);
            const assetResponse = await axios_1.default.post(assetApiUrl, {
                orgId,
                featureId,
                currentValue,
            });
            if (!assetResponse.data.success) {
                throw new common_1.HttpException(assetResponse.data.message || 'Failed to update usage count in Asset DB', common_1.HttpStatus.BAD_REQUEST);
            }
            const assetData = assetResponse.data.result || assetResponse.data.data;
            console.log('✅ Asset usage updated:', assetData);
            const billingOrgId = assetData.billing_org_id ?? assetData.billingOrgId ?? assetResponse.data.billingOrgId;
            if (!billingOrgId) {
                throw new common_1.HttpException('Missing billing_org_id in Asset API response', common_1.HttpStatus.BAD_REQUEST);
            }
            const billingApiUrl = `${process.env.BILLING_API_URL}/organizational-profile/update-usage-count`;
            console.log(`🚀 Updating Billing usage count at: ${billingApiUrl} (billingOrgId=${billingOrgId}, featureId=${featureId}, currentValue=${currentValue})`);
            const billingResponse = await axios_1.default.post(billingApiUrl, {
                orgId: billingOrgId,
                featureId,
                currentValue,
            });
            if (!billingResponse.data.success) {
                throw new common_1.HttpException(billingResponse.data.message || 'Failed to update usage count in Billing DB', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('✅ Billing usage updated:', billingResponse.data.result);
            return {
                success: true,
                message: 'Usage count updated successfully in both portals',
                assetResult: assetResponse.data.result,
                billingResult: billingResponse.data.result,
            };
        }
        catch (error) {
            console.error('❌ Usage count update failed:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.message || 'Failed to update usage count in both portals', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.UsageUtil = UsageUtil;
