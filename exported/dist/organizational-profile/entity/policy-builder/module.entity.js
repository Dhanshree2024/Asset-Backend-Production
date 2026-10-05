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
exports.Module = void 0;
const typeorm_1 = require("typeorm");
const submodule_entity_1 = require("./submodule.entity");
const casbin_rule_entity_1 = require("./casbin-rule.entity");
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Module.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_name', length: 100 }),
    __metadata("design:type", String)
], Module.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Module.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Module.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Module.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Module.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submodule_entity_1.SubModule, (submodule) => submodule.module, { cascade: true }),
    __metadata("design:type", Array)
], Module.prototype, "submodules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => casbin_rule_entity_1.CasbinRule, (rule) => rule.module),
    __metadata("design:type", Array)
], Module.prototype, "casbinRules", void 0);
exports.Module = Module = __decorate([
    (0, typeorm_1.Entity)({ name: 'modules' })
], Module);
