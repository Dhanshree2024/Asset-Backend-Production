"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRolesPermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const jwt_1 = require("@nestjs/jwt");
const role_entity_1 = require("./entity/role.entity");
const database_module_1 = require("../dynamic-schema/database.module");
const user_repository_1 = require("../user/user.repository");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const notification_module_1 = require("../common/notifications/notification.module");
const request_context_module_1 = require("../common/context/request-context.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const auth_module_1 = require("../auth/auth.module");
const redis_module_1 = require("../common/redis/redis.module");
let OrganizationRolesPermissionModule = class OrganizationRolesPermissionModule {
};
exports.OrganizationRolesPermissionModule = OrganizationRolesPermissionModule;
exports.OrganizationRolesPermissionModule = OrganizationRolesPermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([organizational_user_entity_1.User, role_entity_1.Roles, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin]), database_module_1.DatabaseModule,
            notification_module_1.NotificationModule,
            request_context_module_1.RequestContextModule,
            redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [user_repository_1.UserRepository, notifications_helper_1.NotificationHelper]
    })
], OrganizationRolesPermissionModule);
