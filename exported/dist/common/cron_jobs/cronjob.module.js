"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceCronModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const manage_asset_module_1 = require("../../manage-asset/manage-asset.module");
const cronjob_controller_1 = require("./cronjob.controller");
const cronjob_service_1 = require("./cronjob.service");
const asset_limitation_entity_1 = require("../../organizational-profile/public_schema_entity/asset-limitation.entity");
let MaintenanceCronModule = class MaintenanceCronModule {
};
exports.MaintenanceCronModule = MaintenanceCronModule;
exports.MaintenanceCronModule = MaintenanceCronModule = __decorate([
    (0, common_1.Module)({
        imports: [manage_asset_module_1.ManageAssetModule,
            typeorm_1.TypeOrmModule.forFeature([register_user_login_entity_1.RegisterUserLogin, asset_limitation_entity_1.AssetLimitation]),
        ],
        providers: [cronjob_service_1.MaintenanceCronService],
        controllers: [cronjob_controller_1.MaintenanceCronController],
        exports: [cronjob_service_1.MaintenanceCronService],
    })
], MaintenanceCronModule);
