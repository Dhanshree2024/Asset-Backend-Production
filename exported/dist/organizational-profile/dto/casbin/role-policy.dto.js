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
exports.CreateRolePolicyDto = exports.PolicyModuleDto = exports.PolicyActionDto = exports.PolicyAttributeDto = exports.PolicyAttributeType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PolicyAttributeType;
(function (PolicyAttributeType) {
    PolicyAttributeType["ARRAY"] = "array";
    PolicyAttributeType["RANGE"] = "range";
    PolicyAttributeType["DATE_RANGE"] = "dateRange";
    PolicyAttributeType["EXACT"] = "exact";
})(PolicyAttributeType || (exports.PolicyAttributeType = PolicyAttributeType = {}));
class PolicyAttributeDto {
}
exports.PolicyAttributeDto = PolicyAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'branchId', description: 'Key for the policy attribute' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyAttributeDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '[1,2]', description: 'Value for the policy attribute' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyAttributeDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PolicyAttributeType, example: PolicyAttributeType.ARRAY }),
    (0, class_validator_1.IsEnum)(PolicyAttributeType),
    __metadata("design:type", String)
], PolicyAttributeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether this attribute is required or not' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PolicyAttributeDto.prototype, "isRequired", void 0);
class PolicyActionDto {
}
exports.PolicyActionDto = PolicyActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Action ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PolicyActionDto.prototype, "actionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PolicyAttributeDto], description: 'Optional attributes for this action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyActionDto.prototype, "attrs", void 0);
class PolicyModuleDto {
}
exports.PolicyModuleDto = PolicyModuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Module ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PolicyModuleDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20, description: 'Submodule ID if applicable' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PolicyModuleDto.prototype, "submoduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PolicyActionDto], description: 'Actions allowed for this module/submodule' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PolicyModuleDto.prototype, "actions", void 0);
class CreateRolePolicyDto {
}
exports.CreateRolePolicyDto = CreateRolePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Role ID to which these policies belong' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRolePolicyDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PolicyModuleDto], description: 'List of module policies' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateRolePolicyDto.prototype, "policies", void 0);
