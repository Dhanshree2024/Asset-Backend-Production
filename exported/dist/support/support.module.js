"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const support_service_1 = require("./support.service");
const support_controller_1 = require("./support.controller");
const mail_service_1 = require("../common/mail/mail.service");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_module_1 = require("../common/mail/mail.module");
const organization_service_1 = require("../organization_register/organization.service");
const user_repository_1 = require("../user/user.repository");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const permissions_entity_1 = require("../roles_permissions/entities/permissions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const email_config_entity_1 = require("../common/mail/entities/email-config.entity");
const asset_limitation_entity_1 = require("../organizational-profile/public_schema_entity/asset-limitation.entity");
const support_ticket_entity_1 = require("./entities/support-ticket.entity");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const jwt_1 = require("@nestjs/jwt");
const organization_setup_progress_entity_1 = require("./entities/organization-setup-progress.entity");
const user_setup_progress_entity_1 = require("./entities/user-setup-progress.entity");
const notification_module_1 = require("../common/notifications/notification.module");
const auth_module_1 = require("../auth/auth.module");
let SupportModule = class SupportModule {
};
exports.SupportModule = SupportModule;
exports.SupportModule = SupportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            axios_1.HttpModule,
            mail_module_1.MailModule,
            typeorm_1.TypeOrmModule.forFeature([
                organizational_user_entity_1.User,
                user_repository_1.UserRepository,
                permissions_entity_1.PermissionsRoles,
                register_user_login_entity_1.RegisterUserLogin,
                sessions_entity_1.Session,
                email_config_entity_1.MailConfig,
                register_organization_entity_1.RegisterOrganization,
                asset_limitation_entity_1.AssetLimitation,
                support_ticket_entity_1.SupportTicket,
                organization_setup_progress_entity_1.OrganizationSetupProgress,
                user_setup_progress_entity_1.UserSetupProgress
            ]), notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [support_controller_1.SupportController],
        providers: [
            support_service_1.SupportService,
            mail_service_1.MailService,
            mail_config_service_1.MailConfigService,
            organization_service_1.OrganizationService,
        ],
        exports: [support_service_1.SupportService],
    })
], SupportModule);
