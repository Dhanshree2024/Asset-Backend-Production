"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetFieldsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../../auth/auth.module");
const redis_module_1 = require("../../common/redis/redis.module");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../../user/user.repository");
const database_module_1 = require("../../dynamic-schema/database.module");
const asset_datum_entity_1 = require("../asset-data/entities/asset-datum.entity");
const asset_stock_serials_entity_1 = require("../stocks/entities/asset_stock_serials.entity");
const asset_fields_controller_1 = require("./asset-fields.controller");
const asset_fields_service_1 = require("./asset-fields.service");
const asset_field_category_entity_1 = require("./entities/asset-field-category.entity");
const asset_field_entity_1 = require("./entities/asset-field.entity");
const asset_ownership_status_types_entity_1 = require("./entities/asset-ownership-status-types.entity");
const asset_status_types_entity_1 = require("./entities/asset-status-types.entity");
const asset_working_status_types_entity_1 = require("./entities/asset-working-status-types.entity");
const asset_items_fields_mapping_entity_1 = require("../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity");
let AssetFieldsModule = class AssetFieldsModule {
};
exports.AssetFieldsModule = AssetFieldsModule;
exports.AssetFieldsModule = AssetFieldsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_field_entity_1.AssetField, asset_stock_serials_entity_1.AssetStockSerials, asset_status_types_entity_1.AssetStatusTypes, asset_working_status_types_entity_1.AssetWorkingStatusTypes, asset_ownership_status_types_entity_1.AssetOwnershipStatusTypes, asset_field_category_entity_1.AssetFieldCategory, sessions_entity_1.Session,
                register_user_login_entity_1.RegisterUserLogin, asset_datum_entity_1.AssetDatum, asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping]), database_module_1.DatabaseModule, redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [asset_fields_controller_1.AssetFieldsController],
        providers: [asset_fields_service_1.AssetFieldsService, user_repository_1.UserRepository],
    })
], AssetFieldsModule);
