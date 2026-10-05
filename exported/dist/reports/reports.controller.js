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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const category_tracing_dto_1 = require("./dto/category-tracing.dto");
const serial_report_dto_1 = require("./dto/serial-report.dto");
const detail_report_dto_1 = require("./dto/detail-report.dto");
const reports_service_1 = require("./reports.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getCategoryTracingReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getCategoryTracingReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Category tracing report error:', error);
            return {
                status: false,
                message: 'Failed to generate category tracing report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {
                    total_assets: 0,
                    total_unit_value: 0,
                    total_tax_value: 0,
                    total_value: 0,
                    distinct_items: 0,
                },
            };
        }
    }
    async getSerialReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getSerialReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Serial report error:', error);
            return {
                status: false,
                message: 'Failed to generate serial report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
    async getVendorReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getVendorReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Vendor report error:', error);
            return {
                status: false,
                message: 'Failed to generate vendor report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
    async getDepreciationReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getDepreciationReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Depreciation report error:', error);
            return {
                status: false,
                message: 'Failed to generate depreciation report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
    async getWarrantyReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getWarrantyReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Warranty report error:', error);
            return {
                status: false,
                message: 'Failed to generate warranty report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
    async getTransferReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getTransferReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Transfer report error:', error);
            return {
                status: false,
                message: 'Failed to generate transfer report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {
                    total_transfers: 0,
                    total_completed: 0,
                    total_pending: 0,
                    total_in_transit: 0,
                },
            };
        }
    }
    async getMaintenanceReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getMaintenanceReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Maintenance report error:', error);
            return {
                status: false,
                message: 'Failed to generate maintenance report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
    async getScrapReport(dto, req) {
        try {
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const encryptedSchema = req.cookies['x-organization-schema'];
            if (!encryptedSchema) {
                throw new common_1.HttpException('x-organization-schema cookie not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
            const schema = `org_${schemaName}`;
            const userId = await this.reportsService.getUserByPublicID(Number(decrypted_system_user_id));
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            return await this.reportsService.getScrapReport(dto, branchIds, userId, schema);
        }
        catch (error) {
            console.error('Scrap report error:', error);
            return {
                status: false,
                message: 'Failed to generate scrap report',
                error: error?.message ?? String(error),
                rows: [],
                totals: {},
            };
        }
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)('category-tracing'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Category tracing report (department / branch / item wise)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_tracing_dto_1.CategoryTracingReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCategoryTracingReport", null);
__decorate([
    (0, common_1.Post)('serial-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Serial-aggregate reports (status / working condition / ownership / purchase month / asset register)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [serial_report_dto_1.SerialReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSerialReport", null);
__decorate([
    (0, common_1.Post)('vendor-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Vendor wise report (assets + procurement value per vendor)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.VendorReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getVendorReport", null);
__decorate([
    (0, common_1.Post)('depreciation-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Depreciation report (current FY, per serial)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.DepreciationReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDepreciationReport", null);
__decorate([
    (0, common_1.Post)('warranty-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Warranty expiry report (per serial)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.WarrantyReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWarrantyReport", null);
__decorate([
    (0, common_1.Post)('transfer-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.TransferReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTransferReport", null);
__decorate([
    (0, common_1.Post)('maintenance-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Maintenance full history report (per maintenance record)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.MaintenanceReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMaintenanceReport", null);
__decorate([
    (0, common_1.Post)('scrap-report'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Scrap / discarded / lost report (per scrap record, by disposal method)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_report_dto_1.ScrapReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getScrapReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
