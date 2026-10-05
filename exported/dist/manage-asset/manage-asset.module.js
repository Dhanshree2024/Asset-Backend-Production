"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAssetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const manage_asset_controller_1 = require("./manage-asset.controller");
const manage_asset_service_1 = require("./manage-asset.service");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_procurements_entity_1 = require("../assets-data/stocks/entities/asset_procurements.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const location_transfers_entity_1 = require("../location-transfer/entities/location-transfers.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const maintenance_entity_1 = require("./entities/maintenance.entity");
const scrap_entity_1 = require("./entities/scrap.entity");
const jwt_1 = require("@nestjs/jwt");
const asset_events_module_1 = require("../asset-events/asset-events.module");
const depreciation_view_module_1 = require("../asset-depreciation/depreciation-view.module");
const request_context_module_1 = require("../common/context/request-context.module");
const notification_module_1 = require("../common/notifications/notification.module");
const database_module_1 = require("../dynamic-schema/database.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const email_config_entity_1 = require("../common/mail/entities/email-config.entity");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_service_1 = require("../common/mail/mail.service");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const auth_module_1 = require("../auth/auth.module");
const redis_service_1 = require("../common/redis/redis.service");
const stocks_module_1 = require("../assets-data/stocks/stocks.module");
const asset_mapping_module_1 = require("../asset-mapping/asset-mapping.module");
let ManageAssetModule = class ManageAssetModule {
};
exports.ManageAssetModule = ManageAssetModule;
exports.ManageAssetModule = ManageAssetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                asset_mapping_entity_1.AssetMappingRepository,
                asset_datum_entity_1.AssetDatum,
                asset_stock_serials_entity_1.AssetStockSerials,
                stocks_entity_1.Stock,
                asset_item_entity_1.AssetItem,
                organizational_user_entity_1.User,
                maintenance_entity_1.AssetMaintenance,
                scrap_entity_1.AssetScrap,
                location_transfers_entity_1.LocationTransfer,
                asset_working_status_entity_1.AssetWorkingStatus,
                asset_procurements_entity_1.AssetProcurement,
                asset_procurement_items_entity_1.AssetProcurementItem,
                email_config_entity_1.MailConfig,
                user_repository_1.UserRepository,
                sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin,
            ]),
            database_module_1.DatabaseModule,
            asset_events_module_1.AssetEventsModule,
            notification_module_1.NotificationModule,
            depreciation_view_module_1.DepreciationViewModule,
            request_context_module_1.RequestContextModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            stocks_module_1.StocksModule,
            asset_mapping_module_1.AssetMappingModule,
        ],
        controllers: [manage_asset_controller_1.ManageAssetController],
        providers: [
            manage_asset_service_1.ManageAssetService,
            mail_service_1.MailService,
            mail_config_service_1.MailConfigService,
            notifications_helper_1.NotificationHelper,
            redis_service_1.RedisService
        ],
        exports: [manage_asset_service_1.ManageAssetService],
    })
], ManageAssetModule);
