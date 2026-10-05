"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDepreciationModule = void 0;
const common_1 = require("@nestjs/common");
const asset_depreciation_service_1 = require("./asset-depreciation.service");
const asset_depreciation_controller_1 = require("./asset-depreciation.controller");
const asset_item_entity_1 = require("../assets-data/asset-items/entities/asset-item.entity");
const stocks_module_1 = require("../assets-data/stocks/stocks.module");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const database_module_1 = require("../dynamic-schema/database.module");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const asset_depreciation_view_entity_1 = require("./entities/asset-depreciation-view.entity");
const auth_module_1 = require("../auth/auth.module");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
let AssetDepreciationModule = class AssetDepreciationModule {
};
exports.AssetDepreciationModule = AssetDepreciationModule;
exports.AssetDepreciationModule = AssetDepreciationModule = __decorate([
    (0, common_1.Module)({
        controllers: [asset_depreciation_controller_1.AssetDepreciationController],
        providers: [asset_depreciation_service_1.AssetDepreciationService],
        exports: [asset_depreciation_service_1.AssetDepreciationService],
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                asset_item_entity_1.AssetItem,
                asset_stock_serials_entity_1.AssetStockSerials, asset_depreciation_view_entity_1.AssetDepreciationViewEntity, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin
            ]),
            database_module_1.DatabaseModule,
            stocks_module_1.StocksModule,
            auth_module_1.AuthModule,
        ],
    })
], AssetDepreciationModule);
