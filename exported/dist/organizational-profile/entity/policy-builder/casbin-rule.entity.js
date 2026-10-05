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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinRule = void 0;
const typeorm_1 = require("typeorm");
const submodule_entity_1 = require("./submodule.entity");
const action_entity_1 = require("./action.entity");
const module_entity_1 = require("./module.entity");
let CasbinRule = class CasbinRule {
};
exports.CasbinRule = CasbinRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CasbinRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CasbinRule.prototype, "ptype", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CasbinRule.prototype, "v0", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CasbinRule.prototype, "v1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CasbinRule.prototype, "v2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CasbinRule.prototype, "v3", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CasbinRule.prototype, "v4", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CasbinRule.prototype, "v5", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.Module, module => module.casbinRules),
    (0, typeorm_1.JoinColumn)({ name: 'v1', referencedColumnName: 'id' }),
    __metadata("design:type", module_entity_1.Module)
], CasbinRule.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => submodule_entity_1.SubModule, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'v5', referencedColumnName: 'code' }),
    __metadata("design:type", submodule_entity_1.SubModule)
], CasbinRule.prototype, "submodule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => action_entity_1.Action, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'v2', referencedColumnName: 'code' }),
    __metadata("design:type", action_entity_1.Action)
], CasbinRule.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CasbinRule.prototype, "isAllowed", void 0);
exports.CasbinRule = CasbinRule = __decorate([
    (0, typeorm_1.Entity)({ name: 'casbin_rule' })
], CasbinRule);
