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
exports.SerialReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const category_tracing_dto_1 = require("./category-tracing.dto");
class SerialReportDto {
}
exports.SerialReportDto = SerialReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Which serial-aggregate report to run.',
        enum: [
            'status',
            'working_condition',
            'ownership',
            'purchase_month',
            'asset_register',
            'item_ownership_matrix',
        ],
        example: 'status',
    }),
    (0, class_validator_1.IsIn)([
        'status',
        'working_condition',
        'ownership',
        'purchase_month',
        'asset_register',
        'item_ownership_matrix',
    ]),
    __metadata("design:type", String)
], SerialReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: category_tracing_dto_1.CategoryTracingFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", category_tracing_dto_1.CategoryTracingFiltersDto)
], SerialReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search (names + numeric totals)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SerialReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SerialReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], SerialReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SerialReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SerialReportDto.prototype, "limit", void 0);
