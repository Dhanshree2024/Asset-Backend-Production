"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyBuilderController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const get_roles_by_permission_dto_1 = require("./dto/casbin/get-roles-by-permission.dto");
const update_role_policy_dto_1 = require("./dto/casbin/update-role-policy.dto");
const casbin_rule_entity_1 = require("./entity/policy-builder/casbin-rule.entity");
const policy_builder_service_1 = require("./policy-builder.service");
let PolicyBuilderController = class PolicyBuilderController {
    constructor(service, casbinRuleRepo) {
        this.service = service;
        this.casbinRuleRepo = casbinRuleRepo;
    }
    async getPoliciesByRole(role) {
        return this.service.getPoliciesByRole(role);
    }
    async upsertMultiple(dto) {
        return this.service.upsertMultiplePoliciesNested(dto);
    }
    async getRolesByPermission(query) {
        console.log("query :-", query);
        return this.service.getRolesByPermission(query);
    }
};
exports.PolicyBuilderController = PolicyBuilderController;
__decorate([
    (0, common_1.Get)('role-policies'),
    __param(0, (0, common_1.Query)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyBuilderController.prototype, "getPoliciesByRole", null);
__decorate([
    (0, common_1.Post)('upsert-multiple'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_role_policy_dto_1.UpsertMultiplePoliciesNestedDto]),
    __metadata("design:returntype", Promise)
], PolicyBuilderController.prototype, "upsertMultiple", null);
__decorate([
    (0, common_1.Get)('roles-by-permission'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_roles_by_permission_dto_1.GetRolesByPermissionDto]),
    __metadata("design:returntype", Promise)
], PolicyBuilderController.prototype, "getRolesByPermission", null);
exports.PolicyBuilderController = PolicyBuilderController = __decorate([
    (0, common_1.Controller)('policy-builder'),
    __param(1, (0, typeorm_1.InjectRepository)(casbin_rule_entity_1.CasbinRule)),
    __metadata("design:paramtypes", [policy_builder_service_1.PolicyBuilderService,
        typeorm_2.Repository])
], PolicyBuilderController);
