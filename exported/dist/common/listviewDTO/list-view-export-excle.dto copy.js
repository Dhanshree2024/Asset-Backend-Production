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
exports.ListViewDtoForExcleExport = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const search_dto_1 = require("./search.dto");
const filters_dto_1 = require("./filters.dto");
const sorting_dto_1 = require("./sorting.dto");
const pagination_dto_1 = require("./pagination.dto");
const date_between_dto_1 = require("./date-between.dto");
const range_filter_dto_1 = require("./range-filter.dto");
class ListViewDtoForExcleExport {
}
exports.ListViewDtoForExcleExport = ListViewDtoForExcleExport;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [search_dto_1.SearchDto], description: 'Search criteria', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => search_dto_1.SearchDto),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [filters_dto_1.FilterConditionDto], description: 'Filter conditions', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => filters_dto_1.FilterConditionDto),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [sorting_dto_1.SortConditionDto], description: 'Sorting conditions', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => sorting_dto_1.SortConditionDto),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_dto_1.PaginationDto, description: 'Pagination data', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => pagination_dto_1.PaginationDto),
    __metadata("design:type", pagination_dto_1.PaginationDto)
], ListViewDtoForExcleExport.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Columns to be retrieved', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "visible_columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date-range check. Adds `:date BETWEEN start_date AND end_date` filter',
        type: date_between_dto_1.DateBetweenDto,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => date_between_dto_1.DateBetweenDto),
    __metadata("design:type", date_between_dto_1.DateBetweenDto)
], ListViewDtoForExcleExport.prototype, "date_between", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [range_filter_dto_1.RangeFilterDto],
        description: 'Numeric range filters (e.g. amount, age, balance)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => range_filter_dto_1.RangeFilterDto),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "range_filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], description: 'IDs of selected rows to fetch/export', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], description: 'IDs of selected rows to fetch/export', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "selectedIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Select all matching rows across all pages', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ListViewDtoForExcleExport.prototype, "isSelectAll", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], description: 'IDs of rows excluded when select all is active', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], ListViewDtoForExcleExport.prototype, "excludeIds", void 0);
