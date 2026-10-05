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
exports.RolesPermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = __importStar(require("dotenv"));
const auth_module_1 = require("../auth/auth.module");
const redis_module_1 = require("../common/redis/redis.module");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const database_module_1 = require("../dynamic-schema/database.module");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const permissions_entity_1 = require("./entities/permissions.entity");
const roles_permission_entity_1 = require("./entities/roles_permission.entity");
const roles_permissions_controller_1 = require("./roles_permissions.controller");
const roles_permissions_service_1 = require("./roles_permissions.service");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
const notification_module_1 = require("../common/notifications/notification.module");
dotenv.config();
let RolesPermissionsModule = class RolesPermissionsModule {
};
exports.RolesPermissionsModule = RolesPermissionsModule;
exports.RolesPermissionsModule = RolesPermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([roles_permission_entity_1.RolesPermission, organizational_user_entity_1.User,
                user_repository_1.UserRepository, permissions_entity_1.PermissionsRoles, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin, role_entity_1.Roles]), database_module_1.DatabaseModule, redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule), notification_module_1.NotificationModule
        ],
        controllers: [roles_permissions_controller_1.RolesPermissionsController],
        providers: [roles_permissions_service_1.RolesPermissionsService],
        exports: [roles_permissions_service_1.RolesPermissionsService]
    })
], RolesPermissionsModule);
