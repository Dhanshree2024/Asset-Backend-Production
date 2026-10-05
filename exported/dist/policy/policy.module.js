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
exports.PolicyModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = __importStar(require("dotenv"));
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const database_module_1 = require("../dynamic-schema/database.module");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const policy_controller_1 = require("./policy.controller");
const policy_service_1 = require("./policy.service");
const policy_master_entity_1 = require("./entities/policy-master.entity");
const policy_version_entity_1 = require("./entities/policy-version.entity");
const user_repository_1 = require("../user/user.repository");
const redis_module_1 = require("../common/redis/redis.module");
const acknowledgement_entity_1 = require("./entities/acknowledgement.entity");
const asset_category_entity_1 = require("../assets-data/asset-categories/entities/asset-category.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const assets_project_entity_1 = require("../assets-data/assets-projects/entities/assets-project.entity");
const department_entity_1 = require("../organizational-profile/entity/department.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
dotenv.config();
let PolicyModule = class PolicyModule {
};
exports.PolicyModule = PolicyModule;
exports.PolicyModule = PolicyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                policy_master_entity_1.PolicyMaster,
                policy_version_entity_1.PolicyVersion,
                user_repository_1.UserRepository,
                sessions_entity_1.Session,
                organizational_user_entity_1.User,
                register_user_login_entity_1.RegisterUserLogin,
                acknowledgement_entity_1.PolicyAcknowledgement,
                asset_category_entity_1.AssetCategory,
                branches_entity_1.Branch,
                assets_project_entity_1.AssetsProject,
                department_entity_1.Department,
                locations_entity_1.Locations
            ]),
            database_module_1.DatabaseModule,
            request_context_module_1.RequestContextModule,
            redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [policy_controller_1.PolicyController],
        providers: [policy_service_1.PolicyService, notifications_helper_1.NotificationHelper],
        exports: [policy_service_1.PolicyService],
    })
], PolicyModule);
