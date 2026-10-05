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
exports.AssignAssetsDto = exports.SingleAssignItemDto = void 0;
const class_validator_1 = require("class-validator");
const asset_mapping_entity_1 = require("../entities/asset-mapping.entity");
class SingleAssignItemDto {
}
exports.SingleAssignItemDto = SingleAssignItemDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SingleAssignItemDto.prototype, "serialId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(asset_mapping_entity_1.AssignTargetType),
    __metadata("design:type", String)
], SingleAssignItemDto.prototype, "targetType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SingleAssignItemDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleAssignItemDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SingleAssignItemDto.prototype, "detach_and_reassign", void 0);
class AssignAssetsDto {
}
exports.AssignAssetsDto = AssignAssetsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    __metadata("design:type", Array)
], AssignAssetsDto.prototype, "assignments", void 0);
