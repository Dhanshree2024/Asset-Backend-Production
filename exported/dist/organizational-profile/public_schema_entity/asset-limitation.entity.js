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
exports.AssetLimitation = void 0;
const typeorm_1 = require("typeorm");
let AssetLimitation = class AssetLimitation {
};
exports.AssetLimitation = AssetLimitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'limitation_id' }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "limitationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feature_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "featureId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mapping_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "mappingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'override_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetLimitation.prototype, "overrideValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetLimitation.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AssetLimitation.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetLimitation.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetLimitation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetLimitation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_org_id', type: 'int' }),
    __metadata("design:type", Number)
], AssetLimitation.prototype, "billingOrgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_usage', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AssetLimitation.prototype, "currentUsage", void 0);
exports.AssetLimitation = AssetLimitation = __decorate([
    (0, typeorm_1.Entity)('asset_limitations', { schema: 'public' })
], AssetLimitation);
