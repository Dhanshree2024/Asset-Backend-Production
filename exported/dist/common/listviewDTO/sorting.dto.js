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
exports.SortDto = exports.SortConditionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SortConditionDto {
}
exports.SortConditionDto = SortConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'created_at', description: 'Column to sort by' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SortConditionDto.prototype, "column", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DESC', description: 'Sorting order (ASC or DESC)' }),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], SortConditionDto.prototype, "order", void 0);
class SortDto {
}
exports.SortDto = SortDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SortConditionDto], description: 'Sorting conditions' }),
    __metadata("design:type", Array)
], SortDto.prototype, "sort", void 0);
