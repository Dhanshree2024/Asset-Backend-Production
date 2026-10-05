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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const api_key_guard_1 = require("./api-key.guard");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const user_repository_1 = require("../user/user.repository");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mail_module_1 = require("../common/mail/mail.module");
const public_subscription_entity_1 = require("../organization_register/entities/public_subscription.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const config_module_1 = require("../config/config.module");
const config_repository_1 = require("../config/config.repository");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const asset_items_module_1 = require("../assets-data/asset-items/asset-items.module");
const sms_module_1 = require("../common/sms/sms.module");
const organizational_profile_entity_1 = require("../organizational-profile/entity/organizational-profile.entity");
const casbin_rule_entity_1 = require("../organizational-profile/entity/policy-builder/casbin-rule.entity");
const submodule_entity_1 = require("../organizational-profile/entity/policy-builder/submodule.entity");
const organizational_profile_module_1 = require("../organizational-profile/organizational-profile.module");
const request_context_module_1 = require("../common/context/request-context.module");
const request_context_service_1 = require("../common/context/request-context.service");
const notification_module_1 = require("../common/notifications/notification.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const redis_service_1 = require("../common/redis/redis.service");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
const casbin_enforcer_service_1 = require("../organizational-profile/casbin/casbin-enforcer.service");
const action_entity_1 = require("../organizational-profile/entity/policy-builder/action.entity");
const domain_entity_1 = require("../organizational-profile/entity/policy-builder/domain.entity");
const module_submodule_action_entity_1 = require("../organizational-profile/entity/policy-builder/module-submodule-action.entity");
const module_entity_1 = require("../organizational-profile/entity/policy-builder/module.entity");
const policy_attribute_entity_1 = require("../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../organizational-profile/entity/policy-builder/special-permission-master");
const policy_builder_service_1 = require("../organizational-profile/policy-builder.service");
const token_service_1 = require("./token.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_auth_guard_1.JwtAuthGuard,
            token_service_1.TokenService,
            user_repository_1.UserRepository,
            api_key_guard_1.ApiKeyGuard,
            register_user_login_entity_1.RegisterUserLogin,
            sessions_entity_1.Session,
            redis_service_1.RedisService,
            casbin_enforcer_service_1.CasbinEnforcerService,
            policy_builder_service_1.PolicyBuilderService,
            notifications_helper_1.NotificationHelper,
            request_context_service_1.RequestContextService
        ],
        imports: [
            config_module_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_module_1.ConfigModule, organizational_profile_module_1.OrganizationalProfileModule, casbin_rule_entity_1.CasbinRule,
                    submodule_entity_1.SubModule, module_entity_1.Module, notification_module_1.NotificationModule,
                    request_context_module_1.RequestContextModule
                ],
                inject: [config_repository_1.ConfigRepository],
                useFactory: async (configRepository) => {
                    const secret = await configRepository.getJwtSecret();
                    const envPath = path.resolve(__dirname, '../../.env');
                    let envContent = '';
                    try {
                        envContent = fs.readFileSync(envPath, 'utf-8');
                        if (/^JWT_SECRET=/m.test(envContent)) {
                            envContent = envContent.replace(/^JWT_SECRET=.*/m, `JWT_SECRET=${secret}`);
                        }
                        else {
                            envContent += `\nJWT_SECRET=${secret}`;
                        }
                        fs.writeFileSync(envPath, envContent, 'utf-8');
                        console.log('JWT_SECRET updated in .env file');
                    }
                    catch (error) {
                        console.error('Error updating .env file', error);
                    }
                    return {
                        secret: process.env.JWT_ACCESS_SECRET_KEY,
                        signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_repository_1.UserRepository,
                register_user_login_entity_1.RegisterUserLogin,
                public_subscription_entity_1.Subscription,
                sessions_entity_1.Session,
                organizational_user_entity_1.User,
                organizational_profile_entity_1.OrganizationalProfile,
                casbin_rule_entity_1.CasbinRule,
                module_entity_1.Module,
                submodule_entity_1.SubModule,
                action_entity_1.Action,
                domain_entity_1.Domain,
                policy_attribute_entity_1.PolicyAttribute,
                policy_builder_service_1.PolicyBuilderService,
                role_entity_1.Roles,
                module_submodule_action_entity_1.ModuleSubmoduleAction,
                special_permission_master_1.SpecialPermissionsMaster
            ]),
            asset_items_module_1.AssetItemsModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
            organizational_profile_module_1.OrganizationalProfileModule
        ],
        exports: [auth_service_1.AuthService, sessions_entity_1.Session, jwt_auth_guard_1.JwtAuthGuard, token_service_1.TokenService],
    })
], AuthModule);
