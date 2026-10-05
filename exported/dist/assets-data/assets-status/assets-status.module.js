"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsStatusModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../../auth/auth.module");
const redis_module_1 = require("../../common/redis/redis.module");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const database_module_1 = require("../../dynamic-schema/database.module");
const user_repository_1 = require("../../user/user.repository");
const assets_status_controller_1 = require("./assets-status.controller");
const assets_status_service_1 = require("./assets-status.service");
const assets_status_entity_1 = require("./entities/assets-status.entity");
let AssetsStatusModule = class AssetsStatusModule {
};
exports.AssetsStatusModule = AssetsStatusModule;
exports.AssetsStatusModule = AssetsStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([assets_status_entity_1.AssetsStatus, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin]), database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            redis_module_1.RedisModule
        ],
        controllers: [assets_status_controller_1.AssetStatusController],
        providers: [assets_status_service_1.AssetsStatusService, user_repository_1.UserRepository],
        exports: [assets_status_service_1.AssetsStatusService]
    })
], AssetsStatusModule);
