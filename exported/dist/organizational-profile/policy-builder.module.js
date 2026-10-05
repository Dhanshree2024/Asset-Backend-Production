"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyBuilderModule = void 0;
const common_1 = require("@nestjs/common");
const policy_builder_service_1 = require("./policy-builder.service");
const policy_builder_controller_1 = require("./policy-builder.controller");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const casbin_rule_entity_1 = require("./entity/policy-builder/casbin-rule.entity");
const policy_attribute_entity_1 = require("./entity/policy-builder/policy-attribute.entity");
const domain_entity_1 = require("./entity/policy-builder/domain.entity");
const action_entity_1 = require("./entity/policy-builder/action.entity");
const submodule_entity_1 = require("./entity/policy-builder/submodule.entity");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const casbin_enforcer_service_1 = require("./casbin/casbin-enforcer.service");
const module_entity_1 = require("./entity/policy-builder/module.entity");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
const module_submodule_action_entity_1 = require("./entity/policy-builder/module-submodule-action.entity");
const special_permission_master_1 = require("./entity/policy-builder/special-permission-master");
let PolicyBuilderModule = class PolicyBuilderModule {
};
exports.PolicyBuilderModule = PolicyBuilderModule;
exports.PolicyBuilderModule = PolicyBuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forFeature([submodule_entity_1.SubModule, action_entity_1.Action,
                domain_entity_1.Domain, policy_attribute_entity_1.PolicyAttribute,
                casbin_rule_entity_1.CasbinRule, module_entity_1.Module,
                role_entity_1.Roles,
                module_submodule_action_entity_1.ModuleSubmoduleAction,
                special_permission_master_1.SpecialPermissionsMaster]),
            typeorm_1.TypeOrmModule,
            jwt_1.JwtModule,
            axios_1.HttpModule,
        ],
        controllers: [policy_builder_controller_1.PolicyBuilderController],
        providers: [policy_builder_service_1.PolicyBuilderService, casbin_enforcer_service_1.CasbinEnforcerService, jwt_1.JwtService],
        exports: [
            casbin_enforcer_service_1.CasbinEnforcerService,
            policy_builder_service_1.PolicyBuilderService,
        ],
    })
], PolicyBuilderModule);
