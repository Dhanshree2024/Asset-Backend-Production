"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetItemsFieldsMappingModule = void 0;
const common_1 = require("@nestjs/common");
const asset_items_fields_mapping_service_1 = require("./asset-items-fields-mapping.service");
const asset_items_fields_mapping_controller_1 = require("./asset-items-fields-mapping.controller");
const asset_items_fields_mapping_entity_1 = require("./entities/asset-items-fields-mapping.entity");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../../dynamic-schema/database.module");
const user_repository_1 = require("../../user/user.repository");
const typeorm_1 = require("@nestjs/typeorm");
const asset_field_entity_1 = require("../asset-fields/entities/asset-field.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const asset_field_category_entity_1 = require("../asset-fields/entities/asset-field-category.entity");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const auth_module_1 = require("../../auth/auth.module");
let AssetItemsFieldsMappingModule = class AssetItemsFieldsMappingModule {
};
exports.AssetItemsFieldsMappingModule = AssetItemsFieldsMappingModule;
exports.AssetItemsFieldsMappingModule = AssetItemsFieldsMappingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping, asset_field_entity_1.AssetField, organizational_user_entity_1.User, asset_field_category_entity_1.AssetFieldCategory, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin]),
            database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [asset_items_fields_mapping_controller_1.AssetItemsFieldsMappingController],
        providers: [asset_items_fields_mapping_service_1.AssetItemsFieldsMappingService, user_repository_1.UserRepository],
        exports: [asset_items_fields_mapping_service_1.AssetItemsFieldsMappingService]
    })
], AssetItemsFieldsMappingModule);
