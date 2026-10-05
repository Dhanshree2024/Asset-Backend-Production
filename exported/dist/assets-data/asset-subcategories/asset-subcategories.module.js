"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetSubcategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const asset_subcategories_service_1 = require("./asset-subcategories.service");
const asset_subcategories_controller_1 = require("./asset-subcategories.controller");
const user_repository_1 = require("../../user/user.repository");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../../dynamic-schema/database.module");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const asset_subcategory_entity_1 = require("./entities/asset-subcategory.entity");
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_field_entity_1 = require("../asset-fields/entities/asset-field.entity");
const asset_data_module_1 = require("../asset-data/asset-data.module");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const asset_categories_module_1 = require("../asset-categories/asset-categories.module");
const asset_categories_service_1 = require("../asset-categories/asset-categories.service");
const sessions_entity_1 = require("../../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const auth_module_1 = require("../../auth/auth.module");
let AssetSubcategoriesModule = class AssetSubcategoriesModule {
};
exports.AssetSubcategoriesModule = AssetSubcategoriesModule;
exports.AssetSubcategoriesModule = AssetSubcategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([asset_category_entity_1.AssetCategory, asset_subcategory_entity_1.AssetSubcategory, asset_item_entity_1.AssetItem, asset_field_entity_1.AssetField, asset_data_module_1.AssetDataModule, organizational_user_entity_1.User, sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin]),
            database_module_1.DatabaseModule, asset_categories_module_1.AssetCategoriesModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [asset_subcategories_controller_1.AssetSubcategoriesController],
        providers: [asset_subcategories_service_1.AssetSubcategoriesService, user_repository_1.UserRepository, asset_categories_service_1.AssetCategoriesService],
    })
], AssetSubcategoriesModule);
