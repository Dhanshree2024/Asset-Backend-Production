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
exports.ScrapReportDto = exports.ScrapReportFiltersDto = exports.MaintenanceReportDto = exports.MaintenanceReportFiltersDto = exports.TransferReportDto = exports.TransferReportFiltersDto = exports.WarrantyReportDto = exports.WarrantyReportFiltersDto = exports.DepreciationReportDto = exports.DepreciationReportFiltersDto = exports.VendorReportDto = exports.VendorReportFiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VendorReportFiltersDto {
}
exports.VendorReportFiltersDto = VendorReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vendor ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], VendorReportFiltersDto.prototype, "vendor_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Main category ids — matches vendors that procured at least one asset in these categories',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], VendorReportFiltersDto.prototype, "main_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purchase date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VendorReportFiltersDto.prototype, "purchase_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purchase date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VendorReportFiltersDto.prototype, "purchase_date_to", void 0);
class VendorReportDto {
}
exports.VendorReportDto = VendorReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VendorReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", VendorReportFiltersDto)
], VendorReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search (vendor name / code)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VendorReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VendorReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], VendorReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], VendorReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], VendorReportDto.prototype, "limit", void 0);
class DepreciationReportFiltersDto {
}
exports.DepreciationReportFiltersDto = DepreciationReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Main category NAMES — asset_depreciation_serial_view only carries the category ' +
            'name (no id column), so this filters by name rather than id.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DepreciationReportFiltersDto.prototype, "main_category_names", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset item ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DepreciationReportFiltersDto.prototype, "asset_item_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Financial year label, e.g. "2026-27". Defaults to the current FY (Apr–Mar).',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepreciationReportFiltersDto.prototype, "fy_label", void 0);
class DepreciationReportDto {
}
exports.DepreciationReportDto = DepreciationReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: DepreciationReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", DepreciationReportFiltersDto)
], DepreciationReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search (asset / item / category)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepreciationReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepreciationReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], DepreciationReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DepreciationReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DepreciationReportDto.prototype, "limit", void 0);
class WarrantyReportFiltersDto {
}
exports.WarrantyReportFiltersDto = WarrantyReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Main category ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WarrantyReportFiltersDto.prototype, "main_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset item ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WarrantyReportFiltersDto.prototype, "asset_item_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Warranty end date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WarrantyReportFiltersDto.prototype, "expiry_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Warranty end date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WarrantyReportFiltersDto.prototype, "expiry_date_to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiry status bucket(s): Expired | Expiring Soon | Active',
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WarrantyReportFiltersDto.prototype, "expiry_status", void 0);
class WarrantyReportDto {
}
exports.WarrantyReportDto = WarrantyReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: WarrantyReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", WarrantyReportFiltersDto)
], WarrantyReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search (asset / item)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WarrantyReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WarrantyReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], WarrantyReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], WarrantyReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], WarrantyReportDto.prototype, "limit", void 0);
class TransferReportFiltersDto {
}
exports.TransferReportFiltersDto = TransferReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Source (from) branch ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TransferReportFiltersDto.prototype, "from_branch_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Destination (to) branch ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TransferReportFiltersDto.prototype, "to_branch_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Transfer working-status ids (asset_working_status_types): 15=Completed, 16=Pending, 17=In Transit',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TransferReportFiltersDto.prototype, "status_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requested date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferReportFiltersDto.prototype, "requested_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requested date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferReportFiltersDto.prototype, "requested_date_to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Single serial (asset_stocks_unique_id)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TransferReportFiltersDto.prototype, "asset_stocks_unique_id", void 0);
class TransferReportDto {
}
exports.TransferReportDto = TransferReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TransferReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TransferReportFiltersDto)
], TransferReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Free-text search (asset / item / from / to location)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], TransferReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TransferReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TransferReportDto.prototype, "limit", void 0);
class MaintenanceReportFiltersDto {
}
exports.MaintenanceReportFiltersDto = MaintenanceReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance type(s), free text: preventive | repair | upgrade' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MaintenanceReportFiltersDto.prototype, "maintenance_types", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority level(s): high | medium | low' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MaintenanceReportFiltersDto.prototype, "priorities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Working-condition ids (asset_working_status_types): 8=Scheduled, 9=In Progress, 10=Completed, 11=Overdue',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MaintenanceReportFiltersDto.prototype, "working_status_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaintenanceReportFiltersDto.prototype, "scheduled_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaintenanceReportFiltersDto.prototype, "scheduled_date_to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Main category ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MaintenanceReportFiltersDto.prototype, "main_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset item ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MaintenanceReportFiltersDto.prototype, "asset_item_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Single serial (asset_stocks_unique_id)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MaintenanceReportFiltersDto.prototype, "asset_stocks_unique_id", void 0);
class MaintenanceReportDto {
}
exports.MaintenanceReportDto = MaintenanceReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MaintenanceReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", MaintenanceReportFiltersDto)
], MaintenanceReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search (asset / item / description)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaintenanceReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaintenanceReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], MaintenanceReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MaintenanceReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MaintenanceReportDto.prototype, "limit", void 0);
class ScrapReportFiltersDto {
}
exports.ScrapReportFiltersDto = ScrapReportFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Disposal method(s), free text (e.g. E-Waste Vendor, Donation, Auction)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScrapReportFiltersDto.prototype, "disposal_methods", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scrap date from (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScrapReportFiltersDto.prototype, "scrap_date_from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scrap date to (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScrapReportFiltersDto.prototype, "scrap_date_to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Main category ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScrapReportFiltersDto.prototype, "main_category_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset item ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScrapReportFiltersDto.prototype, "asset_item_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Single serial (asset_stocks_unique_id)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ScrapReportFiltersDto.prototype, "asset_stocks_unique_id", void 0);
class ScrapReportDto {
}
exports.ScrapReportDto = ScrapReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ScrapReportFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ScrapReportFiltersDto)
], ScrapReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Free-text search (asset / item / disposal method / reason)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScrapReportDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Column to sort by (whitelisted in service)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScrapReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], ScrapReportDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page (1-based). Omit/0 = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ScrapReportDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows per page. Omit = all rows (export).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ScrapReportDto.prototype, "limit", void 0);
