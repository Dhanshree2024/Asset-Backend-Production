"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDataModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_data_controller_1 = require("./asset-data.controller");
const asset_data_service_1 = require("./asset-data.service");
const jwt_1 = require("@nestjs/jwt");
const asset_mapping_module_1 = require("../../asset-mapping/asset-mapping.module");
const asset_mapping_entity_1 = require("../../asset-mapping/entities/asset-mapping.entity");
const notification_module_1 = require("../../common/notifications/notification.module");
const notifications_helper_1 = require("../../common/notifications/notifications.helper");
const register_organization_entity_1 = require("../../organization_register/entities/register-organization.entity");
const asset_id_settings_entity_1 = require("../../organizational-profile/entity/asset-id-settings.entity");
const branches_entity_1 = require("../../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const locations_entity_1 = require("../../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const orgnization_stats_entity_1 = require("../../organizational-profile/entity/orgnization-stats.entity");
const qr_code_settings_entity_1 = require("../../organizational-profile/entity/qr-code-settings.entity");
const organizational_profile_module_1 = require("../../organizational-profile/organizational-profile.module");
const database_module_1 = require("../../dynamic-schema/database.module");
const user_repository_1 = require("../../user/user.repository");
const asset_categories_service_1 = require("../asset-categories/asset-categories.service");
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_cost_center_entity_1 = require("../asset-cost-center/entities/asset-cost-center.entity");
const asset_field_category_entity_1 = require("../asset-fields/entities/asset-field-category.entity");
const asset_field_entity_1 = require("../asset-fields/entities/asset-field.entity");
const asset_ownership_status_types_entity_1 = require("../asset-fields/entities/asset-ownership-status-types.entity");
const asset_status_types_entity_1 = require("../asset-fields/entities/asset-status-types.entity");
const asset_working_status_types_entity_1 = require("../asset-fields/entities/asset-working-status-types.entity");
const asset_items_fields_mapping_module_1 = require("../asset-items-fields-mapping/asset-items-fields-mapping.module");
const asset_items_fields_mapping_entity_1 = require("../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity");
const asset_items_service_1 = require("../asset-items/asset-items.service");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_ownership_status_module_1 = require("../asset-ownership-status/asset-ownership-status.module");
const asset_ownership_status_entity_1 = require("../asset-ownership-status/entities/asset-ownership-status.entity");
const asset_subcategories_service_1 = require("../asset-subcategories/asset-subcategories.service");
const asset_subcategory_entity_1 = require("../asset-subcategories/entities/asset-subcategory.entity");
const asset_working_status_module_1 = require("../asset-working-status/asset-working-status.module");
const asset_working_status_entity_1 = require("../asset-working-status/entities/asset-working-status.entity");
const assets_status_module_1 = require("../assets-status/assets-status.module");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const asset_warranty_details_entity_1 = require("../stocks/entities/asset_warranty_details.entity");
const stocks_entity_1 = require("../stocks/entities/stocks.entity");
const stocks_module_1 = require("../stocks/stocks.module");
const asset_datum_entity_1 = require("./entities/asset-datum.entity");
const manufacturer_entity_1 = require("./entities/manufacturer.entity");
const models_entity_1 = require("./entities/models.entity");
const asset_software_subscription_entity_1 = require("../stocks/entities/asset_software_subscription.entity");
const item_manufacturer_map_1 = require("../asset-items/entities/item-manufacturer-map");
const v_asset_stock_serials_view_entity_1 = require("../stocks/entities/v-asset-stock-serials-view.entity");
const assets_project_entity_1 = require("../assets-projects/entities/assets-project.entity");
const asset_procurement_items_entity_1 = require("../stocks/entities/asset_procurement_items.entity");
const auth_module_1 = require("../../auth/auth.module");
const location_branch_mapping_entity_1 = require("../../organizational-profile/entity/location-branch-mapping.entity");
const block_of_assets_entity_1 = require("../../organizational-profile/public_schema_entity/block_of_assets.entity");
const depreciation_view_module_1 = require("../../asset-depreciation/depreciation-view.module");
let AssetDataModule = class AssetDataModule {
};
exports.AssetDataModule = AssetDataModule;
exports.AssetDataModule = AssetDataModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_category_entity_1.AssetCategory, asset_subcategory_entity_1.AssetSubcategory, asset_item_entity_1.AssetItem, models_entity_1.Models, manufacturer_entity_1.Manufacturer, asset_field_category_entity_1.AssetFieldCategory,
                asset_field_entity_1.AssetField, organizational_user_entity_1.User, asset_datum_entity_1.AssetDatum, asset_status_types_entity_1.AssetStatusTypes, asset_stock_serials_entity_1.AssetStockSerials, asset_field_category_entity_1.AssetFieldCategory,
                asset_working_status_types_entity_1.AssetWorkingStatusTypes, asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes, stocks_entity_1.Stock, asset_id_settings_entity_1.AssetIDSettings, register_organization_entity_1.RegisterOrganization,
                asset_mapping_entity_1.AssetMappingRepository, asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping, item_manufacturer_map_1.ItemManufacturer, asset_procurement_items_entity_1.AssetProcurementItem,
                qr_code_settings_entity_1.QrCodeSetting, branches_entity_1.Branch, department_entity_1.Department, orgnization_stats_entity_1.OrgStat, asset_cost_center_entity_1.AssetCostCenter, v_asset_stock_serials_view_entity_1.AssetStockSerialsView, asset_cost_center_entity_1.AssetCostCenter, assets_project_entity_1.AssetsProject, asset_warranty_details_entity_1.AssetWarrantyDetailsRepository,
                locations_entity_1.Locations, asset_software_subscription_entity_1.AssetSoftwareSubscription, location_branch_mapping_entity_1.LocationBranchMapping,
                asset_working_status_entity_1.AssetWorkingStatus,
                asset_ownership_status_entity_1.AssetOwnershipStatus,
                location_branch_mapping_entity_1.LocationBranchMapping, block_of_assets_entity_1.AssetBlock
            ]),
            database_module_1.DatabaseModule, organizational_profile_module_1.OrganizationalProfileModule, notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => stocks_module_1.StocksModule), asset_ownership_status_module_1.AssetOwnershipStatusModule, assets_status_module_1.AssetsStatusModule, asset_working_status_module_1.AssetWorkingStatusModule, asset_mapping_module_1.AssetMappingModule, asset_items_fields_mapping_module_1.AssetItemsFieldsMappingModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule), depreciation_view_module_1.DepreciationViewModule
        ],
        controllers: [asset_data_controller_1.AssetDataController],
        providers: [asset_data_service_1.AssetDataService, user_repository_1.UserRepository, asset_categories_service_1.AssetCategoriesService, asset_subcategories_service_1.AssetSubcategoriesService, asset_items_service_1.AssetItemsService, notifications_helper_1.NotificationHelper],
        exports: [asset_data_service_1.AssetDataService, typeorm_1.TypeOrmModule]
    })
], AssetDataModule);
