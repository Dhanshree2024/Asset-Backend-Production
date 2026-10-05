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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_controller_1 = require("./organization.controller");
const organization_service_1 = require("./organization.service");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const dotenv = __importStar(require("dotenv"));
const register_user_login_entity_1 = require("./entities/register-user-login.entity");
const register_organization_entity_1 = require("./entities/register-organization.entity");
const public_subscription_entity_1 = require("./entities/public_subscription.entity");
const public_plan_entity_1 = require("./entities/public_plan.entity");
const mail_module_1 = require("../common/mail/mail.module");
const asset_limitation_entity_1 = require("../organizational-profile/public_schema_entity/asset-limitation.entity");
const notification_module_1 = require("../common/notifications/notification.module");
const request_context_module_1 = require("../common/context/request-context.module");
dotenv.config();
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = __decorate([
    (0, common_1.Module)({
        controllers: [organization_controller_1.OrganizationController],
        providers: [organization_service_1.OrganizationService, api_key_guard_1.ApiKeyGuard],
        imports: [
            axios_1.HttpModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([register_user_login_entity_1.RegisterUserLogin, register_organization_entity_1.RegisterOrganization, public_subscription_entity_1.Subscription, public_plan_entity_1.Plan, asset_limitation_entity_1.AssetLimitation]),
            mail_module_1.MailModule, notification_module_1.NotificationModule, request_context_module_1.RequestContextModule
        ],
        exports: [organization_service_1.OrganizationService],
    })
], OrganizationModule);
