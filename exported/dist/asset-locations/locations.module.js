"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const mail_module_1 = require("../common/mail/mail.module");
const notification_module_1 = require("../common/notifications/notification.module");
const redis_module_1 = require("../common/redis/redis.module");
const database_module_1 = require("../dynamic-schema/database.module");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const organization_roles_permission_module_1 = require("../organization_roles_permission/organization_roles_permission.module");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const location_branch_mapping_entity_1 = require("../organizational-profile/entity/location-branch-mapping.entity");
const location_types_entity_1 = require("../organizational-profile/entity/location-types.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const orgnization_stats_entity_1 = require("../organizational-profile/entity/orgnization-stats.entity");
const asset_limitation_entity_1 = require("../organizational-profile/public_schema_entity/asset-limitation.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const location_asset_counts_view_1 = require("../organizational-profile/viewentity/location-asset-counts.view");
const location_child_count_view_entity_1 = require("../organizational-profile/viewentity/location-child-count.view.entity");
const location_hierarchy_precomputed_view_entity_1 = require("../organizational-profile/viewentity/location-hierarchy-precomputed.view.entity");
const user_repository_1 = require("../user/user.repository");
const locations_controller_1 = require("./locations.controller");
const locations_service_1 = require("./locations.service");
const user_location_fav_1 = require("./entities/user-location-fav");
let LocationsModule = class LocationsModule {
};
exports.LocationsModule = LocationsModule;
exports.LocationsModule = LocationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([register_user_login_entity_1.RegisterUserLogin, register_organization_entity_1.RegisterOrganization, asset_limitation_entity_1.AssetLimitation, locations_entity_1.Locations, location_asset_counts_view_1.LocationAssetCountsView, location_types_entity_1.LocationType, stocks_entity_1.Stock, orgnization_stats_entity_1.OrgStat, sessions_entity_1.Session, branches_entity_1.Branch, organizational_user_entity_1.User, redis_module_1.RedisModule, location_child_count_view_entity_1.LocationChildCountView, location_hierarchy_precomputed_view_entity_1.LocationHierarchyPrecomputedView, location_branch_mapping_entity_1.LocationBranchMapping, user_location_fav_1.UserLocationFavorite]),
            mail_module_1.MailModule, notification_module_1.NotificationModule, request_context_module_1.RequestContextModule, database_module_1.DatabaseModule, (0, common_1.forwardRef)(() => auth_module_1.AuthModule), organization_roles_permission_module_1.OrganizationRolesPermissionModule
        ],
        controllers: [locations_controller_1.LocationsController],
        providers: [locations_service_1.LocationsService, user_repository_1.UserRepository],
        exports: [locations_service_1.LocationsService],
    })
], LocationsModule);
