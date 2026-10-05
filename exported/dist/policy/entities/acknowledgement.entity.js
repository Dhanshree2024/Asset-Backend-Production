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
exports.PolicyAcknowledgement = void 0;
const typeorm_1 = require("typeorm");
const policy_master_entity_1 = require("./policy-master.entity");
const policy_version_entity_1 = require("./policy-version.entity");
let PolicyAcknowledgement = class PolicyAcknowledgement {
};
exports.PolicyAcknowledgement = PolicyAcknowledgement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'ak_id' }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "ak_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_master_entity_1.PolicyMaster),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_master_entity_1.PolicyMaster)
], PolicyAcknowledgement.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_version_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "policy_version_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_version_entity_1.PolicyVersion),
    (0, typeorm_1.JoinColumn)({ name: 'policy_version_id' }),
    __metadata("design:type", policy_version_entity_1.PolicyVersion)
], PolicyAcknowledgement.prototype, "policy_version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'applicable_type',
        type: 'enum',
        enum: policy_master_entity_1.AssignTypeEnum,
        enumName: 'assign_type_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], PolicyAcknowledgement.prototype, "applicable_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applicable_to_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "applicable_to_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "target_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_acknowledged', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PolicyAcknowledgement.prototype, "is_acknowledged", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_forced_ack', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PolicyAcknowledgement.prototype, "is_forced_ack", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_seen', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PolicyAcknowledgement.prototype, "is_seen", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyAcknowledgement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyAcknowledgement.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PolicyAcknowledgement.prototype, "updated_by", void 0);
exports.PolicyAcknowledgement = PolicyAcknowledgement = __decorate([
    (0, typeorm_1.Entity)({ name: 'policy_acknowledgement' })
], PolicyAcknowledgement);
