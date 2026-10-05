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
exports.GetPolicyAcknowledgementsDto = exports.UpdatePolicyAcknowledgementDto = exports.CreatePolicyAcknowledgementDto = void 0;
const class_validator_1 = require("class-validator");
const policy_master_entity_1 = require("../entities/policy-master.entity");
class CreatePolicyAcknowledgementDto {
}
exports.CreatePolicyAcknowledgementDto = CreatePolicyAcknowledgementDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePolicyAcknowledgementDto.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePolicyAcknowledgementDto.prototype, "policy_version_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(policy_master_entity_1.AssignTypeEnum),
    __metadata("design:type", String)
], CreatePolicyAcknowledgementDto.prototype, "applicable_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePolicyAcknowledgementDto.prototype, "applicable_to_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePolicyAcknowledgementDto.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyAcknowledgementDto.prototype, "is_seen", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyAcknowledgementDto.prototype, "is_acknowledged", void 0);
class UpdatePolicyAcknowledgementDto {
}
exports.UpdatePolicyAcknowledgementDto = UpdatePolicyAcknowledgementDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePolicyAcknowledgementDto.prototype, "is_seen", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePolicyAcknowledgementDto.prototype, "is_acknowledged", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePolicyAcknowledgementDto.prototype, "is_forced_ack", void 0);
class GetPolicyAcknowledgementsDto {
}
exports.GetPolicyAcknowledgementsDto = GetPolicyAcknowledgementsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GetPolicyAcknowledgementsDto.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GetPolicyAcknowledgementsDto.prototype, "policy_version_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['ACCEPTED', 'NOT_ACCEPTED', 'TOTAL']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetPolicyAcknowledgementsDto.prototype, "type", void 0);
