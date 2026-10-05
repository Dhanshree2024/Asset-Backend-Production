"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
const cors_middleware_1 = require("./common/middleware/cors.middleware");
const organization_module_1 = require("./organization_register/organization.module");
const database_module_1 = require("./dynamic-schema/database.module");
const set_schema_middleware_1 = require("./dynamic-schema/set-schema.middleware");
const organizational_profile_module_1 = require("./organizational-profile/organizational-profile.module");
const schedule_1 = require("@nestjs/schedule");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const asset_id_settings_entity_1 = require("./organizational-profile/entity/asset-id-settings.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_service_1 = require("./app.service");
const asset_depreciation_module_1 = require("./asset-depreciation/asset-depreciation.module");
const asset_events_module_1 = require("./asset-events/asset-events.module");
const locations_module_1 = require("./asset-locations/locations.module");
const asset_mapping_module_1 = require("./asset-mapping/asset-mapping.module");
const asset_categories_module_1 = require("./assets-data/asset-categories/asset-categories.module");
const asset_cost_center_module_1 = require("./assets-data/asset-cost-center/asset-cost-center.module");
const asset_data_module_1 = require("./assets-data/asset-data/asset-data.module");
const asset_fields_module_1 = require("./assets-data/asset-fields/asset-fields.module");
const asset_items_fields_mapping_module_1 = require("./assets-data/asset-items-fields-mapping/asset-items-fields-mapping.module");
const asset_items_module_1 = require("./assets-data/asset-items/asset-items.module");
const asset_ownership_status_module_1 = require("./assets-data/asset-ownership-status/asset-ownership-status.module");
const asset_subcategories_module_1 = require("./assets-data/asset-subcategories/asset-subcategories.module");
const asset_working_status_module_1 = require("./assets-data/asset-working-status/asset-working-status.module");
const assets_projects_module_1 = require("./assets-data/assets-projects/assets-projects.module");
const assets_status_module_1 = require("./assets-data/assets-status/assets-status.module");
const asset_stock_serials_entity_1 = require("./assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_module_1 = require("./assets-data/stocks/stocks.module");
const org_context_middleware_1 = require("./common/context/org-context.middleware");
const request_context_module_1 = require("./common/context/request-context.module");
const cronjob_module_1 = require("./common/cron_jobs/cronjob.module");
const mail_module_1 = require("./common/mail/mail.module");
const notification_module_1 = require("./common/notifications/notification.module");
const dropdown_cache_module_1 = require("./common/redis/dropdown-cache.module");
const redis_module_1 = require("./common/redis/redis.module");
const sms_module_1 = require("./common/sms/sms.module");
const custom_view_module_1 = require("./custom-view/custom-view.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const discovery_module_1 = require("./discovery/discovery.module");
const location_transfer_module_1 = require("./location-transfer/location-transfer.module");
const manage_asset_module_1 = require("./manage-asset/manage-asset.module");
const organization_roles_permission_module_1 = require("./organization_roles_permission/organization_roles_permission.module");
const locations_entity_1 = require("./organizational-profile/entity/locations.entity");
const orgnization_stats_entity_1 = require("./organizational-profile/entity/orgnization-stats.entity");
const policy_builder_module_1 = require("./organizational-profile/policy-builder.module");
const asset_limitation_entity_1 = require("./organizational-profile/public_schema_entity/asset-limitation.entity");
const pincode_entity_1 = require("./organizational-profile/public_schema_entity/pincode.entity");
const sessions_entity_1 = require("./organizational-profile/public_schema_entity/sessions.entity");
const reports_module_1 = require("./reports/reports.module");
const roles_permissions_module_1 = require("./roles_permissions/roles_permissions.module");
const support_module_1 = require("./support/support.module");
const policy_module_1 = require("./policy/policy.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply((0, cookie_parser_1.default)())
            .forRoutes('*');
        consumer
            .apply(cors_middleware_1.CorsMiddleware)
            .forRoutes('*');
        consumer.apply(org_context_middleware_1.OrgContextMiddleware).forRoutes('*');
        consumer.apply(set_schema_middleware_1.SetSchemaMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            dropdown_cache_module_1.DropdownCacheModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [
                    schedule_1.ScheduleModule.forRoot(),
                    config_1.ConfigModule,
                    organization_module_1.OrganizationModule,
                    auth_module_1.AuthModule,
                    sms_module_1.SmsModule,
                    redis_module_1.RedisModule,
                    serve_static_1.ServeStaticModule.forRoot({
                        rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                        serveRoot: '/uploads',
                        serveStaticOptions: { index: false },
                    }),
                ],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            organization_module_1.OrganizationModule,
            auth_module_1.AuthModule,
            organizational_profile_module_1.OrganizationalProfileModule,
            database_module_1.DatabaseModule,
            asset_categories_module_1.AssetCategoriesModule,
            asset_subcategories_module_1.AssetSubcategoriesModule,
            asset_items_module_1.AssetItemsModule,
            asset_fields_module_1.AssetFieldsModule,
            asset_data_module_1.AssetDataModule,
            asset_items_fields_mapping_module_1.AssetItemsFieldsMappingModule,
            roles_permissions_module_1.RolesPermissionsModule,
            assets_status_module_1.AssetsStatusModule,
            asset_working_status_module_1.AssetWorkingStatusModule,
            asset_ownership_status_module_1.AssetOwnershipStatusModule,
            asset_mapping_module_1.AssetMappingModule,
            stocks_module_1.StocksModule,
            mail_module_1.MailModule,
            organization_roles_permission_module_1.OrganizationRolesPermissionModule,
            asset_depreciation_module_1.AssetDepreciationModule,
            reports_module_1.ReportsModule,
            discovery_module_1.DiscoveryModule,
            asset_stock_serials_entity_1.AssetStockSerials,
            locations_entity_1.Locations,
            pincode_entity_1.Pincodes,
            sessions_entity_1.Session,
            orgnization_stats_entity_1.OrgStat,
            assets_projects_module_1.AssetsProjectsModule,
            asset_cost_center_module_1.AssetCostCenterModule,
            asset_limitation_entity_1.AssetLimitation,
            custom_view_module_1.CustomViewModule,
            manage_asset_module_1.ManageAssetModule,
            location_transfer_module_1.LocationTransferModule,
            cronjob_module_1.MaintenanceCronModule,
            support_module_1.SupportModule,
            asset_events_module_1.AssetEventsModule,
            asset_id_settings_entity_1.AssetIDSettings,
            notification_module_1.NotificationModule,
            policy_builder_module_1.PolicyBuilderModule,
            request_context_module_1.RequestContextModule,
            dashboard_module_1.DashboardModule,
            locations_module_1.LocationsModule,
            policy_module_1.PolicyModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
