"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetEventsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const assets_status_entity_1 = require("../assets-data/assets-status/entities/assets-status.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const database_module_1 = require("../dynamic-schema/database.module");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const asset_events_controller_1 = require("./asset-events.controller");
const asset_events_service_1 = require("./asset-events.service");
const asset_events_entity_1 = require("./entities/asset-events.entity");
const auth_module_1 = require("../auth/auth.module");
let AssetEventsModule = class AssetEventsModule {
};
exports.AssetEventsModule = AssetEventsModule;
exports.AssetEventsModule = AssetEventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_events_entity_1.AssetEvent, organizational_user_entity_1.User, asset_mapping_entity_1.AssetMappingRepository,
                asset_stock_serials_entity_1.AssetStockSerials, asset_datum_entity_1.AssetDatum, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin, asset_working_status_entity_1.AssetWorkingStatus, assets_status_entity_1.AssetsStatus, organizational_user_entity_1.User, user_repository_1.UserRepository, sessions_entity_1.Session,]), database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [asset_events_controller_1.AssetEventsController],
        providers: [asset_events_service_1.AssetEventsService],
        exports: [asset_events_service_1.AssetEventsService]
    })
], AssetEventsModule);
