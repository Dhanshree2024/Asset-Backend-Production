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
exports.SpecialPermissionsMaster = exports.SpecialPermissionAttributeEnum = void 0;
const typeorm_1 = require("typeorm");
var SpecialPermissionAttributeEnum;
(function (SpecialPermissionAttributeEnum) {
    SpecialPermissionAttributeEnum["ARRAY"] = "array";
    SpecialPermissionAttributeEnum["RANGE"] = "range";
    SpecialPermissionAttributeEnum["DATE_RANGE"] = "dateRange";
    SpecialPermissionAttributeEnum["EXACT"] = "exact";
})(SpecialPermissionAttributeEnum || (exports.SpecialPermissionAttributeEnum = SpecialPermissionAttributeEnum = {}));
const module_entity_1 = require("./module.entity");
const submodule_entity_1 = require("./submodule.entity");
let SpecialPermissionsMaster = class SpecialPermissionsMaster {
};
exports.SpecialPermissionsMaster = SpecialPermissionsMaster;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], SpecialPermissionsMaster.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], SpecialPermissionsMaster.prototype, "module_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], SpecialPermissionsMaster.prototype, "submodule_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SpecialPermissionsMaster.prototype, "attr_key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SpecialPermissionsMaster.prototype, "attr_value", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SpecialPermissionAttributeEnum,
        enumName: 'special_permission_attribute_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], SpecialPermissionsMaster.prototype, "attr_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SpecialPermissionsMaster.prototype, "is_required", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SpecialPermissionsMaster.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SpecialPermissionsMaster.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpecialPermissionsMaster.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.Module, (module) => module.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'module_id' }),
    __metadata("design:type", module_entity_1.Module)
], SpecialPermissionsMaster.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => submodule_entity_1.SubModule, (submodule) => submodule.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'submodule_id' }),
    __metadata("design:type", submodule_entity_1.SubModule)
], SpecialPermissionsMaster.prototype, "submodule", void 0);
exports.SpecialPermissionsMaster = SpecialPermissionsMaster = __decorate([
    (0, typeorm_1.Entity)({ name: 'special_permissions_master' })
], SpecialPermissionsMaster);
