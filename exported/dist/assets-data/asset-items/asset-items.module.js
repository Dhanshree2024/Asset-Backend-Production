"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetItemsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const asset_events_module_1 = require("../../asset-events/asset-events.module");
const asset_events_entity_1 = require("../../asset-events/entities/asset-events.entity");
const asset_transfer_history_entity_1 = require("../../asset-mapping/entities/asset_transfer_history.entity");
const auth_module_1 = require("../../auth/auth.module");
const notification_module_1 = require("../../common/notifications/notification.module");
const redis_module_1 = require("../../common/redis/redis.module");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const organizational_vendors_entity_1 = require("../../organizational-profile/entity/organizational-vendors.entity");
const organizational_profile_module_1 = require("../../organizational-profile/organizational-profile.module");
const block_of_assets_entity_1 = require("../../organizational-profile/public_schema_entity/block_of_assets.entity");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const database_module_1 = require("../../dynamic-schema/database.module");
const user_repository_1 = require("../../user/user.repository");
const asset_categories_module_1 = require("../asset-categories/asset-categories.module");
const asset_categories_service_1 = require("../asset-categories/asset-categories.service");
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_data_module_1 = require("../asset-data/asset-data.module");
const asset_datum_entity_1 = require("../asset-data/entities/asset-datum.entity");
const manufacturer_entity_1 = require("../asset-data/entities/manufacturer.entity");
const models_entity_1 = require("../asset-data/entities/models.entity");
const asset_field_entity_1 = require("../asset-fields/entities/asset-field.entity");
const asset_items_fields_mapping_service_1 = require("../asset-items-fields-mapping/asset-items-fields-mapping.service");
const asset_items_fields_mapping_entity_1 = require("../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_ownership_status_entity_1 = require("../asset-ownership-status/entities/asset-ownership-status.entity");
const asset_subcategories_service_1 = require("../asset-subcategories/asset-subcategories.service");
const asset_subcategory_entity_1 = require("../asset-subcategories/entities/asset-subcategory.entity");
const asset_procurement_items_entity_1 = require("../stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../stocks/entities/asset_procurements.entity");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const item_licence_type_entity_1 = require("../stocks/entities/item_licence_type.entity");
const v_asset_stock_serials_view_entity_1 = require("../stocks/entities/v-asset-stock-serials-view.entity");
const view_asset_stock_details_1 = require("../stocks/entities/view_asset_stock_details");
const stocks_module_1 = require("../stocks/stocks.module");
const stocks_service_1 = require("../stocks/stocks.service");
const asset_items_controller_1 = require("./asset-items.controller");
const asset_items_service_1 = require("./asset-items.service");
const item_manufacturer_map_1 = require("./entities/item-manufacturer-map");
const depreciation_view_module_1 = require("../../asset-depreciation/depreciation-view.module");
let AssetItemsModule = class AssetItemsModule {
};
exports.AssetItemsModule = AssetItemsModule;
exports.AssetItemsModule = AssetItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_category_entity_1.AssetCategory, asset_subcategory_entity_1.AssetSubcategory,
                asset_stock_serials_entity_1.AssetStockSerials, asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping, asset_datum_entity_1.AssetDatum, asset_transfer_history_entity_1.AssetTransferHistory, item_licence_type_entity_1.ItemLicenceType, v_asset_stock_serials_view_entity_1.AssetStockSerialsView, view_asset_stock_details_1.AssetAllStockDetailsView, asset_procurements_entity_1.AssetProcurement, asset_procurement_items_entity_1.AssetProcurementItem, asset_events_entity_1.AssetEvent,
                asset_item_entity_1.AssetItem, item_manufacturer_map_1.ItemManufacturer, block_of_assets_entity_1.AssetBlock,
                asset_field_entity_1.AssetField, asset_data_module_1.AssetDataModule, organizational_user_entity_1.User, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin, models_entity_1.Models, manufacturer_entity_1.Manufacturer, organizational_vendors_entity_1.OrganizationVendors, locations_entity_1.Locations, asset_ownership_status_entity_1.AssetOwnershipStatus]),
            database_module_1.DatabaseModule, notification_module_1.NotificationModule, asset_categories_module_1.AssetCategoriesModule, organizational_profile_module_1.OrganizationalProfileModule, redis_module_1.RedisModule, asset_data_module_1.AssetDataModule, asset_events_module_1.AssetEventsModule, (0, common_1.forwardRef)(() => stocks_module_1.StocksModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule), depreciation_view_module_1.DepreciationViewModule
        ],
        controllers: [asset_items_controller_1.AssetItemsController],
        providers: [asset_items_service_1.AssetItemsService, user_repository_1.UserRepository, asset_categories_service_1.AssetCategoriesService,
            asset_subcategories_service_1.AssetSubcategoriesService, asset_items_fields_mapping_service_1.AssetItemsFieldsMappingService, stocks_service_1.StocksService],
        exports: [asset_items_service_1.AssetItemsService],
    })
], AssetItemsModule);
