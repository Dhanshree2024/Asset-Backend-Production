"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocksModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const asset_events_entity_1 = require("../../asset-events/entities/asset-events.entity");
const asset_mapping_module_1 = require("../../asset-mapping/asset-mapping.module");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const notification_module_1 = require("../../common/notifications/notification.module");
const database_module_1 = require("../../dynamic-schema/database.module");
const scrap_entity_1 = require("../../manage-asset/entities/scrap.entity");
const asset_id_settings_entity_1 = require("../../organizational-profile/entity/asset-id-settings.entity");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_vendors_entity_1 = require("../../organizational-profile/entity/organizational-vendors.entity");
const user_repository_1 = require("../../user/user.repository");
const asset_data_module_1 = require("../asset-data/asset-data.module");
const asset_datum_entity_1 = require("../asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_stock_core_service_1 = require("./asset-stock-core.service");
const asset_procurement_items_entity_1 = require("./entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("./entities/asset_procurements.entity");
const asset_stock_serials_entity_1 = require("./entities/asset_stock_serials.entity");
const asset_warranty_details_entity_1 = require("./entities/asset_warranty_details.entity");
const item_licence_type_entity_1 = require("./entities/item_licence_type.entity");
const stocks_entity_1 = require("./entities/stocks.entity");
const v_asset_stock_serials_view_entity_1 = require("./entities/v-asset-stock-serials-view.entity");
const view_asset_stock_details_1 = require("./entities/view_asset_stock_details");
const stocks_controller_1 = require("./stocks.controller");
const stocks_service_1 = require("./stocks.service");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const policy_attribute_entity_1 = require("../../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../../organizational-profile/entity/policy-builder/special-permission-master");
const asset_events_module_1 = require("../../asset-events/asset-events.module");
const asset_software_subscription_entity_1 = require("./entities/asset_software_subscription.entity");
const asset_softwares_1 = require("./entities/asset_softwares");
const perpetual_softwares_1 = require("./entities/perpetual_softwares");
const asset_items_module_1 = require("../asset-items/asset-items.module");
const asset_working_status_entity_1 = require("../asset-working-status/entities/asset-working-status.entity");
const auth_module_1 = require("../../auth/auth.module");
const depreciation_view_module_1 = require("../../asset-depreciation/depreciation-view.module");
const request_context_module_1 = require("../../common/context/request-context.module");
let StocksModule = class StocksModule {
};
exports.StocksModule = StocksModule;
exports.StocksModule = StocksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([stocks_entity_1.Stock, user_repository_1.UserRepository, asset_mapping_entity_1.AssetMappingRepository, asset_warranty_details_entity_1.AssetWarrantyDetailsRepository, locations_entity_1.Locations, asset_stock_serials_entity_1.AssetStockSerials,
                asset_datum_entity_1.AssetDatum, asset_mapping_entity_1.AssetMappingRepository, organizational_vendors_entity_1.OrganizationVendors, asset_id_settings_entity_1.AssetIDSettings,
                item_licence_type_entity_1.ItemLicenceType, v_asset_stock_serials_view_entity_1.AssetStockSerialsView, asset_item_entity_1.AssetItem, view_asset_stock_details_1.AssetAllStockDetailsView,
                asset_events_entity_1.AssetEvent, scrap_entity_1.AssetScrap, asset_software_subscription_entity_1.AssetSoftwareSubscription, asset_softwares_1.AssetSoftwaresView, perpetual_softwares_1.PerpetualSoftwaresView,
                asset_procurements_entity_1.AssetProcurement, asset_procurement_items_entity_1.AssetProcurementItem, policy_attribute_entity_1.PolicyAttribute, special_permission_master_1.SpecialPermissionsMaster, asset_working_status_entity_1.AssetWorkingStatus,
            ]),
            database_module_1.DatabaseModule, (0, common_1.forwardRef)(() => asset_items_module_1.AssetItemsModule), asset_mapping_module_1.AssetMappingModule, notification_module_1.NotificationModule, asset_events_module_1.AssetEventsModule, (0, common_1.forwardRef)(() => asset_data_module_1.AssetDataModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule), depreciation_view_module_1.DepreciationViewModule, request_context_module_1.RequestContextModule
        ],
        controllers: [stocks_controller_1.StocksController],
        providers: [stocks_service_1.StocksService, asset_stock_core_service_1.AssetStockCoreService, notifications_helper_1.NotificationHelper],
        exports: [stocks_service_1.StocksService, asset_stock_core_service_1.AssetStockCoreService, typeorm_1.TypeOrmModule]
    })
], StocksModule);
