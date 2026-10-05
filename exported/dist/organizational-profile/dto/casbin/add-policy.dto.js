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
exports.RoleAddPolicyDto = exports.AddPolicyDto = exports.PolicyAttributeDto = exports.PolicyApplicableType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var PolicyApplicableType;
(function (PolicyApplicableType) {
    PolicyApplicableType["ROLE"] = "ROLE";
    PolicyApplicableType["USER"] = "USER";
})(PolicyApplicableType || (exports.PolicyApplicableType = PolicyApplicableType = {}));
class PolicyAttributeDto {
}
exports.PolicyAttributeDto = PolicyAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute key', example: 'branchId' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyAttributeDto.prototype, "attr_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute value. Can be array/object/primitive. Will be stored as JSON string.',
        example: [1, 2],
        type: Object,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], PolicyAttributeDto.prototype, "attr_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute type - controls matching logic',
        example: 'array',
        enum: ['array', 'range', 'dateRange', 'exact'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['array', 'range', 'dateRange', 'exact']),
    __metadata("design:type", String)
], PolicyAttributeDto.prototype, "attr_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PolicyAttributeDto.prototype, "is_required", void 0);
class AddPolicyDto {
}
exports.AddPolicyDto = AddPolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subject identifier (user or role). Use numeric ID',
        example: 1
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPolicyDto.prototype, "sub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Module ID (matches modules.id)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPolicyDto.prototype, "moduleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SubModule ID (matches submodules.id)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPolicyDto.prototype, "subModuleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action ID (matches actions.id)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPolicyDto.prototype, "actionCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional Domain ID (matches domains.id)',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddPolicyDto.prototype, "domainCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of ABAC attributes (each has key, value, type)',
        type: [PolicyAttributeDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PolicyAttributeDto),
    __metadata("design:type", Array)
], AddPolicyDto.prototype, "attrs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PolicyApplicableType }),
    (0, class_validator_1.IsEnum)(PolicyApplicableType),
    __metadata("design:type", String)
], AddPolicyDto.prototype, "v4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether action is allowed', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddPolicyDto.prototype, "isAllowed", void 0);
class RoleAddPolicyDto {
}
exports.RoleAddPolicyDto = RoleAddPolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Module ID (matches modules.id)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RoleAddPolicyDto.prototype, "moduleCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action ID (matches actions.id)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RoleAddPolicyDto.prototype, "actionCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional Domain ID (matches domains.id)',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RoleAddPolicyDto.prototype, "domainCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of ABAC attributes (each has key, value, type)',
        type: [PolicyAttributeDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PolicyAttributeDto),
    __metadata("design:type", Array)
], RoleAddPolicyDto.prototype, "attrs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether action is allowed', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RoleAddPolicyDto.prototype, "isAllowed", void 0);
