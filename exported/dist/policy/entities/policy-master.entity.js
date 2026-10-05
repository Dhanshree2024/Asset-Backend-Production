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
exports.PolicyMaster = exports.AssignTypeEnum = void 0;
const typeorm_1 = require("typeorm");
const policy_version_entity_1 = require("./policy-version.entity");
var AssignTypeEnum;
(function (AssignTypeEnum) {
    AssignTypeEnum["USER"] = "USER";
    AssignTypeEnum["PROJECT"] = "PROJECT";
    AssignTypeEnum["DEPARTMENT"] = "DEPARTMENT";
    AssignTypeEnum["BRANCH"] = "BRANCH";
    AssignTypeEnum["SYSTEM"] = "SYSTEM";
    AssignTypeEnum["VENDOR"] = "VENDOR";
    AssignTypeEnum["LOCATION"] = "LOCATION";
})(AssignTypeEnum || (exports.AssignTypeEnum = AssignTypeEnum = {}));
let PolicyMaster = class PolicyMaster {
};
exports.PolicyMaster = PolicyMaster;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
        name: 'policy_id',
    }),
    __metadata("design:type", Number)
], PolicyMaster.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'policy_name',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], PolicyMaster.prototype, "policy_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'category',
        type: 'jsonb',
        nullable: true,
    }),
    __metadata("design:type", Array)
], PolicyMaster.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'applicable_type',
        type: 'enum',
        enum: AssignTypeEnum,
        enumName: 'assign_type_enum',
        nullable: true,
    }),
    __metadata("design:type", String)
], PolicyMaster.prototype, "applicable_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PolicyMaster.prototype, "applicable_to", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], PolicyMaster.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], PolicyMaster.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], PolicyMaster.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], PolicyMaster.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'integer',
        nullable: true,
    }),
    __metadata("design:type", Number)
], PolicyMaster.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'updated_by',
        type: 'integer',
        nullable: true,
    }),
    __metadata("design:type", Number)
], PolicyMaster.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => policy_version_entity_1.PolicyVersion, (version) => version.policy),
    __metadata("design:type", Array)
], PolicyMaster.prototype, "versions", void 0);
exports.PolicyMaster = PolicyMaster = __decorate([
    (0, typeorm_1.Entity)({ name: 'policy_master' })
], PolicyMaster);
