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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationHelper = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const crypto_utils_1 = require("../encryption_decryption/crypto-utils");
const request_context_service_1 = require("../context/request-context.service");
const notification_enums_1 = require("./notification.enums");
let NotificationHelper = NotificationHelper_1 = class NotificationHelper {
    constructor(requestContext) {
        this.requestContext = requestContext;
        this.logger = new common_1.Logger(NotificationHelper_1.name);
        this.accountTypeContextMap = {
            [notification_enums_1.AccountTypesEnum.User]: 'updatedUser',
            [notification_enums_1.AccountTypesEnum.AssetMaintenance]: 'asset',
            [notification_enums_1.AccountTypesEnum.AssetAssignment]: 'assignment',
            [notification_enums_1.AccountTypesEnum.AssetScrap]: 'scrap',
            [notification_enums_1.AccountTypesEnum.RoleCreation]: 'role',
            [notification_enums_1.AccountTypesEnum.StockTransfer]: 'stockTransfer',
            [notification_enums_1.AccountTypesEnum.SubscriptionExpiry]: 'subscription',
            [notification_enums_1.AccountTypesEnum.BranchCreation]: 'branch',
            [notification_enums_1.AccountTypesEnum.LocationCreation]: 'location',
            [notification_enums_1.AccountTypesEnum.CostCenterCreation]: 'costCenter',
            [notification_enums_1.AccountTypesEnum.ProjectCreation]: 'project',
            [notification_enums_1.AccountTypesEnum.DepartmentCreation]: 'department',
            [notification_enums_1.AccountTypesEnum.AssetStockSerialCreation]: 'assetStockSerial',
            [notification_enums_1.AccountTypesEnum.VendorCreation]: 'vendor',
            [notification_enums_1.AccountTypesEnum.SupportTicketsCreation]: 'support',
            [notification_enums_1.AccountTypesEnum.Policy]: 'policy',
        };
        const baseURL = process.env.BILLING_API_URL;
        if (!baseURL) {
            throw new Error('BILLING_API_URL is not defined in environment variables');
        }
        this.billingApi = axios_1.default.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async sendNotificationByEvent(eventId, recipients, payloadData, meta) {
        try {
            this.logger.log(`🔍 Fetching notification config for event_id: ${eventId}`);
            const encryptedOrg = this.requestContext.get('organization_id');
            let orgId;
            if (encryptedOrg) {
                orgId = (0, crypto_utils_1.decrypt)(encryptedOrg);
            }
            this.logger.log(`Decrypted Organization ID: ${orgId}`);
            const configResponse = await this.billingApi.get(`/notification-events/get-notifications-by-event`, {
                params: { event_id: eventId },
            });
            this.logger.log(`Notification Config: ${configResponse}`);
            if (!configResponse.data?.success) {
                throw new common_1.HttpException(configResponse.data?.message ||
                    'Failed to fetch notification configuration', common_1.HttpStatus.BAD_REQUEST);
            }
            const notifications = configResponse.data?.data?.notifications || {};
            if (!notifications || Object.keys(notifications).length === 0) {
                this.logger.warn(`⚠️ No active notifications configured for event_id: ${eventId}`);
                return {
                    success: false,
                    message: 'No active notifications configured for this event',
                };
            }
            this.logger.log(`✅ Notification config found. Triggering event_id: ${eventId}`);
            const triggerPayload = {
                event_id: eventId,
                recipients,
                payload: payloadData,
                meta: {
                    source: 'asset-backend',
                    organization_id: orgId,
                    ...meta,
                },
            };
            const triggerResponse = await this.billingApi.post(`/notification-events/trigger-notification`, triggerPayload);
            this.logger.log(`📥 Billing Response Status: ${triggerResponse.status}`);
            this.logger.log(`📥 Billing Response Data: ${JSON.stringify(triggerResponse.data)}`);
            if (!triggerResponse.data?.success) {
                throw new common_1.HttpException(triggerResponse.data?.message || 'Failed to trigger notification', common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`🚀 Notification triggered successfully for event_id: ${eventId}`);
            return triggerResponse.data;
        }
        catch (err) {
            this.logger.error('❌ sendNotificationByEvent failed', err.response?.data || err.message);
            this.logger.error('❌ sendNotificationByEvent failed');
            if (err.response) {
                this.logger.error(`Status: ${err.response.status}`);
                this.logger.error(`Data: ${JSON.stringify(err.response.data)}`);
            }
            else if (err.request) {
                this.logger.error('No response received from billing service');
            }
            else {
                this.logger.error(`Error: ${err.message}`);
            }
            throw new common_1.HttpException(err.response?.data?.message || 'Notification process failed', err.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTemplateVariables(eventId) {
        const configResponse = await this.billingApi.get(`/notification-events/get-notifications-by-event-for-asset`, {
            params: { event_id: eventId },
        });
        if (!configResponse.data?.success) {
            throw new common_1.HttpException(configResponse.data?.message || 'Failed to fetch notification config', common_1.HttpStatus.BAD_REQUEST);
        }
        const notifications = configResponse.data?.data?.notifications || {};
        const variables = [];
        for (const channel in notifications) {
            const templates = notifications[channel];
            for (const templateVersion of templates) {
                if (templateVersion.template_variables) {
                    variables.push(templateVersion.template_variables);
                }
            }
        }
        return variables;
    }
    getValueByPath(obj, path) {
        return path.split('.').reduce((o, key) => o?.[key], obj);
    }
    buildDynamicPayload(templateVariablesArray, sourceData) {
        const payload = {};
        for (const templateVariables of templateVariablesArray) {
            if (!templateVariables)
                continue;
            for (const key of Object.keys(templateVariables)) {
                const mapping = templateVariables[key];
                if (!mapping?.account_type || !mapping?.label)
                    continue;
                const accountType = mapping.account_type;
                const label = mapping.label;
                const contextRoot = this.accountTypeContextMap[accountType];
                if (!contextRoot) {
                    this.logger.warn(`No context mapping found for account_type: ${accountType}`);
                    continue;
                }
                let value;
                if (mapping.path) {
                    value = this.getValueByPath(sourceData, mapping.path);
                }
                else {
                    value = sourceData?.[contextRoot]?.[label];
                }
                if (!payload[accountType]) {
                    payload[accountType] = {};
                }
                payload[accountType][label] = value ?? '';
            }
        }
        return payload;
    }
    async triggerEventNotification(options) {
        const { eventId, contextData, recipients, meta } = options;
        console.log('triggerEventNotification:== eventId:', eventId);
        console.log('triggerEventNotification:== contextData:', contextData);
        console.log('triggerEventNotification:== recipients:', recipients);
        console.log('triggerEventNotification:== meta:', meta);
        console.log('============templateVariables  options==============:', options);
        const templateVariables = await this.getTemplateVariables(eventId);
        console.log('============templateVariables==============:', templateVariables);
        const payloadData = this.buildDynamicPayload(templateVariables, contextData);
        if (contextData?.policy) {
            if (!payloadData.Policy) {
                payloadData.Policy = {};
            }
            payloadData.Policy.policy_id = contextData.policy.policy_id;
            payloadData.Policy.policy_version_id =
                contextData.policy.policy_version_id;
        }
        console.log('============templateVariables==============:', templateVariables);
        console.log('============templateVariables payloadData==============:', payloadData);
        return this.sendNotificationByEvent(eventId, recipients, payloadData, meta);
    }
};
exports.NotificationHelper = NotificationHelper;
exports.NotificationHelper = NotificationHelper = NotificationHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], NotificationHelper);
