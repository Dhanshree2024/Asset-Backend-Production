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
exports.OrganizationalProfileModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const department_entity_1 = require("./entity/department.entity");
const organizational_profile_entity_1 = require("./entity/organizational-profile.entity");
const organizational_user_entity_1 = require("./entity/organizational-user.entity");
const organizational_profile_controller_1 = require("./organizational-profile.controller");
const organizational_profile_service_1 = require("./organizational-profile.service");
const department_config_entity_1 = require("./public_schema_entity/department-config.entity");
const designations_config_entity_1 = require("./public_schema_entity/designations-config.entity");
const industry_types_entity_1 = require("./public_schema_entity/industry-types.entity");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../dynamic-schema/database.module");
const user_repository_1 = require("../user/user.repository");
const dotenv = __importStar(require("dotenv"));
const branches_entity_1 = require("./entity/branches.entity");
const designations_entity_1 = require("./entity/designations.entity");
const organizational_vendors_entity_1 = require("./entity/organizational-vendors.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const auth_module_1 = require("../auth/auth.module");
const mail_module_1 = require("../common/mail/mail.module");
const roles_permissions_module_1 = require("../roles_permissions/roles_permissions.module");
const locations_entity_1 = require("./entity/locations.entity");
const orgnization_stats_entity_1 = require("./entity/orgnization-stats.entity");
const pincode_entity_1 = require("./public_schema_entity/pincode.entity");
const sessions_entity_1 = require("./public_schema_entity/sessions.entity");
const redis_service_1 = require("../common/redis/redis.service");
const axios_1 = require("@nestjs/axios");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const assets_project_entity_1 = require("../assets-data/assets-projects/entities/assets-project.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const request_context_module_1 = require("../common/context/request-context.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const location_transfers_entity_1 = require("../location-transfer/entities/location-transfers.entity");
const maintenance_entity_1 = require("../manage-asset/entities/maintenance.entity");
const scrap_entity_1 = require("../manage-asset/entities/scrap.entity");
const organization_roles_permission_module_1 = require("../organization_roles_permission/organization_roles_permission.module");
const roles_permission_entity_1 = require("../roles_permissions/entities/roles_permission.entity");
const entity_lookup_service_1 = require("./entity-lookup.service");
const asset_id_settings_entity_1 = require("./entity/asset-id-settings.entity");
const other_settings_entity_1 = require("./entity/other-settings.entity");
const module_entity_1 = require("./entity/policy-builder/module.entity");
const qr_code_settings_entity_1 = require("./entity/qr-code-settings.entity");
const policy_builder_module_1 = require("./policy-builder.module");
const asset_limitation_entity_1 = require("./public_schema_entity/asset-limitation.entity");
const in_app_notifications_entity_1 = require("./public_schema_entity/in_app_notifications.entity");
const location_types_entity_1 = require("./entity/location-types.entity");
const v_asset_stock_serials_view_entity_1 = require("../assets-data/stocks/entities/v-asset-stock-serials-view.entity");
const locations_module_1 = require("../asset-locations/locations.module");
const location_branch_mapping_entity_1 = require("./entity/location-branch-mapping.entity");
const branch_asset_counts_view_1 = require("./viewentity/branch-asset-counts.view");
const location_asset_counts_view_1 = require("./viewentity/location-asset-counts.view");
const vendor_asset_count_view_1 = require("./viewentity/vendor-asset-count.view");
const depreciation_view_module_1 = require("../asset-depreciation/depreciation-view.module");
const roles_permissions_service_1 = require("../roles_permissions/roles_permissions.service");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
const permissions_entity_1 = require("../roles_permissions/entities/permissions.entity");
dotenv.config();
let OrganizationalProfileModule = class OrganizationalProfileModule {
};
exports.OrganizationalProfileModule = OrganizationalProfileModule;
exports.OrganizationalProfileModule = OrganizationalProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([organizational_profile_entity_1.OrganizationalProfile, branches_entity_1.Branch, organizational_vendors_entity_1.OrganizationVendors,
                location_transfers_entity_1.LocationTransfer, maintenance_entity_1.AssetMaintenance, scrap_entity_1.AssetScrap, module_entity_1.Module, vendor_asset_count_view_1.VendorAssetCountView,
                department_entity_1.Department, designations_entity_1.Designations, organizational_user_entity_1.User, industry_types_entity_1.IndustryTypes,
                department_config_entity_1.DepartmentConifg, designations_config_entity_1.DesignationsConfig, asset_datum_entity_1.AssetDatum, register_user_login_entity_1.RegisterUserLogin, register_organization_entity_1.RegisterOrganization,
                locations_entity_1.Locations, pincode_entity_1.Pincodes, sessions_entity_1.Session, orgnization_stats_entity_1.OrgStat, roles_permission_entity_1.RolesPermission, asset_mapping_entity_1.AssetMappingRepository, asset_stock_serials_entity_1.AssetStockSerials, maintenance_entity_1.AssetMaintenance, location_asset_counts_view_1.LocationAssetCountsView,
                location_types_entity_1.LocationType, location_branch_mapping_entity_1.LocationBranchMapping, role_entity_1.Roles, permissions_entity_1.PermissionsRoles,
                asset_id_settings_entity_1.AssetIDSettings, qr_code_settings_entity_1.QrCodeSetting, other_settings_entity_1.OtherSettingsEntity, asset_limitation_entity_1.AssetLimitation, stocks_entity_1.Stock, assets_project_entity_1.AssetsProject, in_app_notifications_entity_1.InAppNotifications, v_asset_stock_serials_view_entity_1.AssetStockSerialsView, branch_asset_counts_view_1.BranchAssetCountsView
            ]),
            database_module_1.DatabaseModule,
            policy_builder_module_1.PolicyBuilderModule,
            mail_module_1.MailModule,
            axios_1.HttpModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            roles_permissions_module_1.RolesPermissionsModule, organization_roles_permission_module_1.OrganizationRolesPermissionModule, request_context_module_1.RequestContextModule, locations_module_1.LocationsModule, depreciation_view_module_1.DepreciationViewModule, request_context_module_1.RequestContextModule,
        ],
        controllers: [organizational_profile_controller_1.OrganizationalProfileController],
        providers: [user_repository_1.UserRepository, entity_lookup_service_1.EntityLookupService, redis_service_1.RedisService, notifications_helper_1.NotificationHelper, organizational_profile_service_1.OrganizationService, roles_permissions_service_1.RolesPermissionsService],
        exports: [entity_lookup_service_1.EntityLookupService, organizational_profile_service_1.OrganizationService]
    })
], OrganizationalProfileModule);
