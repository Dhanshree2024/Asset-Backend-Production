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
exports.ModuleSubmoduleAction = void 0;
const typeorm_1 = require("typeorm");
const module_entity_1 = require("./module.entity");
const submodule_entity_1 = require("./submodule.entity");
const action_entity_1 = require("./action.entity");
let ModuleSubmoduleAction = class ModuleSubmoduleAction {
};
exports.ModuleSubmoduleAction = ModuleSubmoduleAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ModuleSubmoduleAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModuleSubmoduleAction.prototype, "module_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ModuleSubmoduleAction.prototype, "submodule_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModuleSubmoduleAction.prototype, "action_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.Module, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'module_id' }),
    __metadata("design:type", module_entity_1.Module)
], ModuleSubmoduleAction.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => submodule_entity_1.SubModule, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'submodule_id' }),
    __metadata("design:type", submodule_entity_1.SubModule)
], ModuleSubmoduleAction.prototype, "submodule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => action_entity_1.Action, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'action_id' }),
    __metadata("design:type", action_entity_1.Action)
], ModuleSubmoduleAction.prototype, "action", void 0);
exports.ModuleSubmoduleAction = ModuleSubmoduleAction = __decorate([
    (0, typeorm_1.Entity)('module_submodule_actions')
], ModuleSubmoduleAction);
