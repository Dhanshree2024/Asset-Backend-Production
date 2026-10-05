"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingUtil = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
class BillingUtil {
    static async post(endpoint, payload, options) {
        try {
            const url = `${process.env.BILLING_API_URL}${endpoint}`;
            const defaultHeaders = {
                'Content-Type': 'application/json',
            };
            const config = {
                headers: { ...defaultHeaders, ...(options?.headers || {}) },
                timeout: options?.timeout || 10000,
            };
            console.log(`🚀 Calling Billing API: ${url}`);
            console.log('Payload:', JSON.stringify(payload, null, 2));
            const response = await axios_1.default.post(url, payload, config);
            if (!response.data?.success) {
                throw new common_1.HttpException(response.data?.message || 'Billing API returned failure', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('✅ Billing API Success');
            return response.data.data;
        }
        catch (error) {
            console.error('❌ Billing API Error:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.message || 'Billing service unavailable', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.BillingUtil = BillingUtil;
