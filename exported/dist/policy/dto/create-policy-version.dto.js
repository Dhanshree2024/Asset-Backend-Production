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
exports.CreatePolicyVersionDto = void 0;
const class_validator_1 = require("class-validator");
const create_policy_dto_1 = require("./create-policy.dto");
const policy_master_entity_1 = require("../entities/policy-master.entity");
const class_transformer_1 = require("class-transformer");
class CreatePolicyVersionDto {
}
exports.CreatePolicyVersionDto = CreatePolicyVersionDto;
__decorate([
    (0, class_validator_1.IsIn)([create_policy_dto_1.PolicyPublishAction.DRAFT, create_policy_dto_1.PolicyPublishAction.PUBLISH]),
    __metadata("design:type", String)
], CreatePolicyVersionDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyVersionDto.prototype, "policy_content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return [];
        if (Array.isArray(value)) {
            return value.map(Number).filter((id) => !Number.isNaN(id));
        }
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed)
                ? parsed.map(Number).filter((id) => !Number.isNaN(id))
                : [];
        }
        catch {
            return String(value)
                .split(',')
                .map(Number)
                .filter((id) => !Number.isNaN(id));
        }
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePolicyVersionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyVersionDto.prototype, "policy_document", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(policy_master_entity_1.AssignTypeEnum),
    __metadata("design:type", String)
], CreatePolicyVersionDto.prototype, "applicable_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value)) {
            return value.map(Number);
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.map(Number) : [];
            }
            catch {
                return value
                    .split(',')
                    .map((v) => Number(v.trim()))
                    .filter((v) => !Number.isNaN(v));
            }
        }
        return [];
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreatePolicyVersionDto.prototype, "applicable_to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyVersionDto.prototype, "version", void 0);
