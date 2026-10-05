"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const database_module_1 = require("../dynamic-schema/database.module");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const organizational_profile_module_1 = require("../organizational-profile/organizational-profile.module");
const user_repository_1 = require("../user/user.repository");
const redis_module_1 = require("../common/redis/redis.module");
const special_permission_master_1 = require("../organizational-profile/entity/policy-builder/special-permission-master");
const policy_attribute_entity_1 = require("../organizational-profile/entity/policy-builder/policy-attribute.entity");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin, user_repository_1.UserRepository, special_permission_master_1.SpecialPermissionsMaster, policy_attribute_entity_1.PolicyAttribute]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            request_context_module_1.RequestContextModule,
            organizational_profile_module_1.OrganizationalProfileModule,
            redis_module_1.RedisModule
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
