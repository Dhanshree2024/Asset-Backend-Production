"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileImageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profile_image_service_1 = require("./profile-image.service");
const profile_image_controller_1 = require("./profile-image.controller");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const organizational_profile_entity_1 = require("../organizational-profile/entity/organizational-profile.entity");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../user/user.repository");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const auth_module_1 = require("../auth/auth.module");
let ProfileImageModule = class ProfileImageModule {
};
exports.ProfileImageModule = ProfileImageModule;
exports.ProfileImageModule = ProfileImageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                organizational_user_entity_1.User,
                organizational_profile_entity_1.OrganizationalProfile,
                user_repository_1.UserRepository,
                sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin,
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [profile_image_controller_1.ProfileImageController],
        providers: [profile_image_service_1.ProfileImageService],
    })
], ProfileImageModule);
