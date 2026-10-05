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
exports.CategoryTracingReportDto = exports.CategoryTracingFiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CategoryTracingFiltersDto {
}
exports.CategoryTracingFiltersDto = CategoryTracingFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset item ids', example: [12, 15] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "asset_item_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Main category ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "main_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sub category ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "sub_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Branch ids (direct branch assignment if present, else the physical location\'s branch)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "branch_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "department_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location mapping ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "location_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vendor ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "vendor_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ownership status type ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "ownership_status_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current status type ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "status_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Working status type ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoryTracingFiltersDto.prototype, "working_status_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purchase date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryTracingFiltersDto.prototype, "purchase_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purchase date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryTracingFiltersDto.prototype, "purchase_date_to", void 0);
class CategoryTracingReportDto {
}
exports.CategoryTracingReportDto = CategoryTracingReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grouping mode. department -> department (+ optional branch) x asset item; ' +
            'branch -> branch x asset item; item -> asset item only.',
        enum: ['department', 'branch', 'item'],
        example: 'department',
    }),
    (0, class_validator_1.IsIn)(['department', 'branch', 'item']),
    __metadata("design:type", String)
], CategoryTracingReportDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Only for groupBy=department. When true, rows are grouped by department AND branch.',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CategoryTracingReportDto.prototype, "includeBranch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CategoryTracingFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", CategoryTracingFiltersDto)
], CategoryTracingReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search on names' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryTracingReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryTracingReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], CategoryTracingReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CategoryTracingReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CategoryTracingReportDto.prototype, "limit", void 0);
