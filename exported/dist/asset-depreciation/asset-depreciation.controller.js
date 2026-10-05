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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDepreciationController = void 0;
const common_1 = require("@nestjs/common");
const asset_depreciation_service_1 = require("./asset-depreciation.service");
const depreciation_serial_dto_1 = require("./dto/depreciation-serial.dto");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AssetDepreciationController = class AssetDepreciationController {
    constructor(service) {
        this.service = service;
    }
    async getAllSerials(dto) {
        const payload = {
            pagination: dto.pagination,
            limit: dto.pagination?.limit ?? 10,
            cursor: dto.cursor ?? null,
            direction: dto.direction,
            page: dto.page,
            jumpToLast: dto.jumpToLast,
            isLastPageMode: dto.isLastPageMode,
            search: dto.search?.map((s) => s.values?.join(' ')).join(' ') || '',
            sortField: dto.sort?.[0]?.column,
            sortOrder: dto.sort?.[0]?.order?.toUpperCase() ||
                'ASC',
            filters: dto.filters?.reduce((acc, f) => {
                acc[f.column] = f.values || [];
                return acc;
            }, {}) || {},
        };
        return this.service.getAllSerials(payload);
    }
    async getSerialById(body) {
        return this.service.getSerialById(body.asset_stocks_unique_id);
    }
    getBlockReport(fy) {
        return this.service.getBlockWiseReport(fy);
    }
    getBlockAssets(dto) {
        const filtersMap = dto.filters?.reduce((acc, f) => {
            acc[f.column] = f.values || [];
            return acc;
        }, {}) || {};
        const today = new Date();
        const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        const defaultFy = `${year}-${String(year + 1).slice(-2)}`;
        const fy = filtersMap['fy_label']?.[0] ?? defaultFy;
        const actType = (filtersMap['actType']?.[0] ?? dto.actType ?? 'it');
        const blockIds = filtersMap['block_id_it']?.map(Number) ?? [];
        const expandBlockIds = Array.isArray(dto.expandBlockIds) ? dto.expandBlockIds : [];
        const search = dto.search?.map(s => s.values?.join(' ')).join(' ') || '';
        return this.service.getBlockAssets(fy, blockIds, expandBlockIds, actType, search);
    }
    async exportDepreciationExcel(res, dto) {
        const buffer = await this.service.exportDepreciationExcel(dto);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=depreciation-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async exportBlockReport(res, dto) {
        const filtersMap = dto.filters?.reduce((acc, f) => {
            acc[f.column] = f.values || [];
            return acc;
        }, {}) || {};
        const today = new Date();
        const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        const defaultFy = `${year}-${String(year + 1).slice(-2)}`;
        const fy = filtersMap['fy_label']?.[0] ?? defaultFy;
        const actType = (filtersMap['actType']?.[0] ?? dto.actType ?? 'it');
        const blockIds = filtersMap['block_id_it']?.map(Number) ?? [];
        const search = dto.search?.map(s => s.values?.join(' ')).join(' ') || '';
        const buffer = await this.service.exportBlockReportExcel(fy, blockIds, actType, search);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=wdv-block-report-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
};
exports.AssetDepreciationController = AssetDepreciationController;
__decorate([
    (0, common_1.Post)('serials'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], AssetDepreciationController.prototype, "getAllSerials", null);
__decorate([
    (0, common_1.Post)('single-depreciation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [depreciation_serial_dto_1.GetSerialDto]),
    __metadata("design:returntype", Promise)
], AssetDepreciationController.prototype, "getSerialById", null);
__decorate([
    (0, common_1.Get)('block-report'),
    __param(0, (0, common_1.Query)('fy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetDepreciationController.prototype, "getBlockReport", null);
__decorate([
    (0, common_1.Post)('block-report2'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [depreciation_serial_dto_1.BlockExpandRequestDto]),
    __metadata("design:returntype", void 0)
], AssetDepreciationController.prototype, "getBlockAssets", null);
__decorate([
    (0, common_1.Post)('export-depreciation-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, depreciation_serial_dto_1.DepreciationExportDto]),
    __metadata("design:returntype", Promise)
], AssetDepreciationController.prototype, "exportDepreciationExcel", null);
__decorate([
    (0, common_1.Post)('export-block-report-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, depreciation_serial_dto_1.BlockExpandRequestDto]),
    __metadata("design:returntype", Promise)
], AssetDepreciationController.prototype, "exportBlockReport", null);
exports.AssetDepreciationController = AssetDepreciationController = __decorate([
    (0, common_1.Controller)('asset-depreciation'),
    __metadata("design:paramtypes", [asset_depreciation_service_1.AssetDepreciationService])
], AssetDepreciationController);
