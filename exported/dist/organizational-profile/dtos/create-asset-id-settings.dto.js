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
exports.CreateAssetIdSettingsDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAssetIdSettingsDto {
}
exports.CreateAssetIdSettingsDto = CreateAssetIdSettingsDto;
__decorate([
    (0, class_validator_1.IsEnum)(['ONLY_NUMERIC', 'PREFIX_ALLOWED', 'SUFFIX_ALLOWED', 'PREFIX_SUFFIX_ALLOWED']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Global', 'Branch', 'Department']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "scope", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "prefix", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "suffix", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['DDMMYY', 'YYYYMMDD', 'YYMM', 'YYYY', 'YY', 'None']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "date_format", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['-', '_', '.', '']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "separator", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "min_length", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "max_length", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "start_from", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "next_number", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "sequence_length", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['never', 'yearly', 'monthly']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "reset_sequence", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['upper', 'lower', 'mixed']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "word_case", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_date", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_branch", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_department", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_category", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_sub_category", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "include_item", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAssetIdSettingsDto.prototype, "enable_user_input", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CODE', 'NAME']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "branch_source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "branch_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CODE', 'NAME']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "department_source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "department_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CODE', 'NAME']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "category_source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "category_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CODE', 'NAME']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "sub_category_source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "sub_category_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CODE', 'NAME']),
    __metadata("design:type", String)
], CreateAssetIdSettingsDto.prototype, "item_source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "item_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssetIdSettingsDto.prototype, "applied_template_id", void 0);
