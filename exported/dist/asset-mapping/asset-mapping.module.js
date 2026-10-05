"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetMappingModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const asset_events_entity_1 = require("../asset-events/entities/asset-events.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_procurement_items_entity_1 = require("../assets-data/stocks/entities/asset_procurement_items.entity");
const asset_procurements_entity_1 = require("../assets-data/stocks/entities/asset_procurements.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stocks_entity_1 = require("../assets-data/stocks/entities/stocks.entity");
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const redis_module_1 = require("../common/redis/redis.module");
const depreciation_view_module_1 = require("../asset-depreciation/depreciation-view.module");
const database_module_1 = require("../dynamic-schema/database.module");
const scrap_entity_1 = require("../manage-asset/entities/scrap.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const organizational_profile_module_1 = require("../organizational-profile/organizational-profile.module");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const asset_mapping_controller_1 = require("./asset-mapping.controller");
const asset_mapping_service_1 = require("./asset-mapping.service");
const asset_relationship_hook_service_1 = require("./services/asset-relationship-hook.service");
const asset_assignment_log_entity_1 = require("./entities/asset-assignment-log.entity");
const asset_mapping_entity_1 = require("./entities/asset-mapping.entity");
const asset_transfer_history_entity_1 = require("./entities/asset_transfer_history.entity");
const asset_relationship_type_entity_1 = require("./entities/asset_relationship_type.entity");
const asset_relationship_governance_entity_1 = require("./entities/asset_relationship_governance.entity");
let AssetMappingModule = class AssetMappingModule {
};
exports.AssetMappingModule = AssetMappingModule;
exports.AssetMappingModule = AssetMappingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                organizational_user_entity_1.User,
                asset_mapping_entity_1.AssetMappingRepository,
                asset_stock_serials_entity_1.AssetStockSerials,
                asset_item_entity_1.AssetItem,
                stocks_entity_1.Stock,
                asset_assignment_log_entity_1.AssetAssignmentEvent,
                asset_events_entity_1.AssetEvent,
                scrap_entity_1.AssetScrap,
                asset_transfer_history_entity_1.AssetTransferHistory,
                asset_datum_entity_1.AssetDatum,
                sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin,
                asset_procurement_items_entity_1.AssetProcurementItem,
                asset_procurements_entity_1.AssetProcurement,
                asset_working_status_entity_1.AssetWorkingStatus,
                asset_relationship_type_entity_1.AssetRelationType,
                asset_relationship_governance_entity_1.AssetRelationshipGovernance,
            ]),
            database_module_1.DatabaseModule,
            organizational_profile_module_1.OrganizationalProfileModule, request_context_module_1.RequestContextModule, redis_module_1.RedisModule,
            depreciation_view_module_1.DepreciationViewModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [asset_mapping_controller_1.AssetMappingController],
        providers: [asset_mapping_service_1.AssetMappingService, user_repository_1.UserRepository, notifications_helper_1.NotificationHelper, asset_relationship_hook_service_1.AssetRelationshipHookService],
        exports: [asset_mapping_service_1.AssetMappingService, asset_relationship_hook_service_1.AssetRelationshipHookService, typeorm_1.TypeOrmModule.forFeature([asset_mapping_entity_1.AssetMappingRepository])]
    })
], AssetMappingModule);
