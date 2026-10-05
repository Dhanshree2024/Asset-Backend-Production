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
exports.PolicyAttribute = void 0;
const typeorm_1 = require("typeorm");
const special_permission_master_1 = require("./special-permission-master");
let PolicyAttribute = class PolicyAttribute {
};
exports.PolicyAttribute = PolicyAttribute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], PolicyAttribute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PolicyAttribute.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PolicyAttribute.prototype, "special_permission_master_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => special_permission_master_1.SpecialPermissionsMaster, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'special_permission_master_id' }),
    __metadata("design:type", special_permission_master_1.SpecialPermissionsMaster)
], PolicyAttribute.prototype, "special_permission", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PolicyAttribute.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PolicyAttribute.prototype, "updated_at", void 0);
exports.PolicyAttribute = PolicyAttribute = __decorate([
    (0, typeorm_1.Entity)('policy_attributes')
], PolicyAttribute);
