"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const assets_projects_controller_1 = require("./assets-projects.controller");
const assets_projects_service_1 = require("./assets-projects.service");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const auth_module_1 = require("../../auth/auth.module");
const request_context_module_1 = require("../../common/context/request-context.module");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const redis_module_1 = require("../../common/redis/redis.module");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const organizational_profile_module_1 = require("../../organizational-profile/organizational-profile.module");
const user_repository_1 = require("../../user/user.repository");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const v_asset_stock_serials_view_entity_1 = require("../stocks/entities/v-asset-stock-serials-view.entity");
const assets_project_entity_1 = require("./entities/assets-project.entity");
const project_asset_counts_view_1 = require("./project-asset-counts.view");
let AssetsProjectsModule = class AssetsProjectsModule {
};
exports.AssetsProjectsModule = AssetsProjectsModule;
exports.AssetsProjectsModule = AssetsProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([assets_project_entity_1.AssetsProject, v_asset_stock_serials_view_entity_1.AssetStockSerialsView, project_asset_counts_view_1.ProjectAssetCountsView,
                department_entity_1.Department, register_user_login_entity_1.RegisterUserLogin, asset_stock_serials_entity_1.AssetStockSerials, organizational_user_entity_1.User, user_repository_1.UserRepository, sessions_entity_1.Session, asset_mapping_entity_1.AssetMappingRepository]), organizational_profile_module_1.OrganizationalProfileModule, request_context_module_1.RequestContextModule, redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [assets_projects_controller_1.AssetsProjectsController],
        providers: [assets_projects_service_1.AssetsProjectsService, notifications_helper_1.NotificationHelper],
        exports: [assets_projects_service_1.AssetsProjectsService]
    })
], AssetsProjectsModule);
