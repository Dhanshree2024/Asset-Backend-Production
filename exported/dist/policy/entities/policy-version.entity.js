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
exports.PolicyVersion = exports.PolicyStatus = void 0;
const typeorm_1 = require("typeorm");
const policy_master_entity_1 = require("./policy-master.entity");
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "DRAFT";
    PolicyStatus["PUBLISHED"] = "PUBLISHED";
    PolicyStatus["ARCHIVED"] = "ARCHIVED";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
let PolicyVersion = class PolicyVersion {
};
exports.PolicyVersion = PolicyVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'policy_version_id' }),
    __metadata("design:type", Number)
], PolicyVersion.prototype, "policy_version_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_id', type: 'bigint' }),
    __metadata("design:type", Number)
], PolicyVersion.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_master_entity_1.PolicyMaster, (policy) => policy.versions),
    (0, typeorm_1.JoinColumn)({ name: 'policy_id' }),
    __metadata("design:type", policy_master_entity_1.PolicyMaster)
], PolicyVersion.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PolicyVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_current', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PolicyVersion.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_archived', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PolicyVersion.prototype, "is_archived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 50, default: PolicyStatus.DRAFT }),
    __metadata("design:type", String)
], PolicyVersion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'released_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PolicyVersion.prototype, "released_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_content', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PolicyVersion.prototype, "policy_content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'policy_document', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PolicyVersion.prototype, "policy_document", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyVersion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], PolicyVersion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PolicyVersion.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PolicyVersion.prototype, "updated_by", void 0);
exports.PolicyVersion = PolicyVersion = __decorate([
    (0, typeorm_1.Entity)({ name: 'policy_version' }),
    (0, typeorm_1.Unique)('policy_version_policy_id_version_key', ['policy_id', 'version'])
], PolicyVersion);
