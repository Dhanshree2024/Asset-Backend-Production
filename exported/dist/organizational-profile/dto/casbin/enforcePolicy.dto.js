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
exports.EnforcePolicyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const add_policy_dto_1 = require("./add-policy.dto");
class EnforcePolicyDto {
}
exports.EnforcePolicyDto = EnforcePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject identifier (userId or roleId)', example: 'role:1' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnforcePolicyDto.prototype, "sub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module code', example: 'LOANS' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnforcePolicyDto.prototype, "moduleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action code', example: 'APPROVE' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnforcePolicyDto.prototype, "actionCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional domain code', example: 'BRANCH' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnforcePolicyDto.prototype, "domainCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: add_policy_dto_1.PolicyApplicableType }),
    (0, class_validator_1.IsEnum)(add_policy_dto_1.PolicyApplicableType),
    __metadata("design:type", String)
], EnforcePolicyDto.prototype, "v4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional ABAC attributes as JSON object',
        example: { branchId: [1, 2, 3], maxAmount: 1000000 },
        type: Object,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], EnforcePolicyDto.prototype, "attrs", void 0);
