"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationTransferModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const location_transfer_controller_1 = require("./location-transfer.controller");
const asset_mapping_module_1 = require("../asset-mapping/asset-mapping.module");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const location_transfers_entity_1 = require("./entities/location-transfers.entity");
const location_transfer_service_1 = require("./location-transfer.service");
const jwt_1 = require("@nestjs/jwt");
const asset_events_module_1 = require("../asset-events/asset-events.module");
const depreciation_view_module_1 = require("../asset-depreciation/depreciation-view.module");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const redis_module_1 = require("../common/redis/redis.module");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const stocks_module_1 = require("../assets-data/stocks/stocks.module");
let LocationTransferModule = class LocationTransferModule {
};
exports.LocationTransferModule = LocationTransferModule;
exports.LocationTransferModule = LocationTransferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                asset_mapping_entity_1.AssetMappingRepository,
                location_transfers_entity_1.LocationTransfer,
                asset_datum_entity_1.AssetDatum,
                asset_stock_serials_entity_1.AssetStockSerials,
                stocks_entity_1.Stock,
                asset_item_entity_1.AssetItem,
                locations_entity_1.Locations,
                asset_working_status_entity_1.AssetWorkingStatus,
                organizational_user_entity_1.User,
                redis_module_1.RedisModule,
                register_user_login_entity_1.RegisterUserLogin,
                organizational_user_entity_1.User,
                user_repository_1.UserRepository,
                sessions_entity_1.Session,
                asset_procurement_items_entity_1.AssetProcurementItem
            ]),
            asset_events_module_1.AssetEventsModule,
            depreciation_view_module_1.DepreciationViewModule,
            request_context_module_1.RequestContextModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => asset_mapping_module_1.AssetMappingModule),
            stocks_module_1.StocksModule,
        ],
        controllers: [location_transfer_controller_1.LocationTransferController],
        providers: [location_transfer_service_1.LocationTransferService, notifications_helper_1.NotificationHelper],
        exports: [location_transfer_service_1.LocationTransferService],
    })
], LocationTransferModule);
