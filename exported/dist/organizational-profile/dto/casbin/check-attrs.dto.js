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
exports.CheckAttrsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CheckAttrsDto {
}
exports.CheckAttrsDto = CheckAttrsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subject identifier (user or role). Format: user:<id> or role:<id>',
        example: '1',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "sub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique module code (matches modules.module_code)',
        example: 'LOANS',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "moduleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sub module code (matches modules.module_code)',
        example: 'LOANS',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "subModuleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action code (matches actions.action_code)',
        example: 'APPROVE',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "actionCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional domain code (matches domains.domain_code)',
        example: 'BRANCH',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "domainCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Extra V4 field', example: 'POLICY_A' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "v4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Policy ID', example: 42 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CheckAttrsDto.prototype, "policyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Attributes as JSON string',
        example: '{"branchId":"001","amountRange":"200"}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAttrsDto.prototype, "attrs", void 0);
