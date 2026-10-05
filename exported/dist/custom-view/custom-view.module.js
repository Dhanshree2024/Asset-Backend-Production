"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomViewModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../dynamic-schema/database.module");
const custom_view_controller_1 = require("./custom-view.controller");
const custom_view_service_1 = require("./custom-view.service");
const custom_view_entity_1 = require("./entity/custom-view.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const user_repository_1 = require("../user/user.repository");
const auth_module_1 = require("../auth/auth.module");
let CustomViewModule = class CustomViewModule {
};
exports.CustomViewModule = CustomViewModule;
exports.CustomViewModule = CustomViewModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                custom_view_entity_1.CustomView,
                organizational_user_entity_1.User,
                sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin,
            ]),
            database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [custom_view_controller_1.CustomViewController],
        providers: [custom_view_service_1.CustomViewService, user_repository_1.UserRepository],
        exports: [custom_view_service_1.CustomViewService],
    })
], CustomViewModule);
