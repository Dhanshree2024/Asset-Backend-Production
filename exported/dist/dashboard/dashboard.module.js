"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const database_module_1 = require("../dynamic-schema/database.module");
const depreciation_view_module_1 = require("../asset-depreciation/depreciation-view.module");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_categories_service_1 = require("../assets-data/asset-categories/asset-categories.service");
const asset_cost_center_entity_1 = require("../assets-data/asset-cost-center/entities/asset-cost-center.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const asset_ownership_status_entity_1 = require("../assets-data/asset-ownership-status/entities/asset-ownership-status.entity");
const asset_subcategories_service_1 = require("../assets-data/asset-subcategories/asset-subcategories.service");
const asset_procurements_entity_1 = require("../assets-data/stocks/entities/asset_procurements.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const asset_warranty_details_entity_1 = require("../assets-data/stocks/entities/asset_warranty_details.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const auth_module_1 = require("../auth/auth.module");
const redis_module_1 = require("../common/redis/redis.module");
const location_transfers_entity_1 = require("../location-transfer/entities/location-transfers.entity");
const maintenance_entity_1 = require("../manage-asset/entities/maintenance.entity");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../organizational-profile/entity/department.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const policy_attribute_entity_1 = require("../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../organizational-profile/entity/policy-builder/special-permission-master");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            depreciation_view_module_1.DepreciationViewModule,
            typeorm_1.TypeOrmModule.forFeature([
                organizational_user_entity_1.User,
                sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin, asset_mapping_entity_1.AssetMappingRepository, asset_stock_serials_entity_1.AssetStockSerials, branches_entity_1.Branch,
                department_entity_1.Department, locations_entity_1.Locations, location_transfers_entity_1.LocationTransfer, maintenance_entity_1.AssetMaintenance, asset_cost_center_entity_1.AssetCostCenter,
                asset_ownership_status_entity_1.AssetOwnershipStatus, asset_item_entity_1.AssetItem, asset_categories_service_1.AssetCategoriesService, asset_subcategories_service_1.AssetSubcategoriesService,
                asset_datum_entity_1.AssetDatum, asset_procurements_entity_1.AssetProcurement, asset_warranty_details_entity_1.AssetWarrantyDetailsRepository, register_organization_entity_1.RegisterOrganization,
                stocks_entity_1.Stock, special_permission_master_1.SpecialPermissionsMaster, policy_attribute_entity_1.PolicyAttribute
            ]),
            database_module_1.DatabaseModule, redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService, user_repository_1.UserRepository],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
