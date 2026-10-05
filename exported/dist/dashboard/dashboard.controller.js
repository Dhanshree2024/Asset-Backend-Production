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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
;
const common_2 = require("@nestjs/common");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardCounts1(req, branchIds) {
        const organization_id = req.cookies.organization_id;
        if (!organization_id) {
            throw new common_1.HttpException('organization_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
        }
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
        }
        const userId = Number((0, crypto_utils_1.decrypt)(system_user_id));
        const organizationId = Number((0, crypto_utils_1.decrypt)(organization_id));
        let parsedBranchIds = [];
        if (branchIds) {
            const raw = Array.isArray(branchIds) ? branchIds.join(',') : branchIds;
            parsedBranchIds = raw
                .split(',')
                .map(id => Number(id.trim()))
                .filter(id => !Number.isNaN(id) && id > 0);
        }
        const globalBranchIds = JSON.parse(req.cookies?.branch_access || '[]')
            .map(Number)
            .filter((id) => !Number.isNaN(id));
        return this.dashboardService.getDashboardCountsFromView(organizationId, parsedBranchIds, globalBranchIds, userId);
    }
    async getDashboard(req, branchIds) {
        const organization_id = req.cookies.organization_id;
        if (!organization_id) {
            throw new common_1.HttpException('organization_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
        }
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('system_user_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
        }
        const userId = Number((0, crypto_utils_1.decrypt)(system_user_id));
        const organizationId = Number((0, crypto_utils_1.decrypt)(organization_id));
        let parsedBranchIds = [];
        if (branchIds) {
            const raw = Array.isArray(branchIds) ? branchIds.join(',') : branchIds;
            parsedBranchIds = raw
                .split(',')
                .map(id => Number(id.trim()))
                .filter(id => !Number.isNaN(id) && id > 0);
        }
        const globalBranchIds = JSON.parse(req.cookies?.branch_access || '[]')
            .map(Number)
            .filter((id) => !Number.isNaN(id));
        return this.dashboardService.getDashboardFromView(organizationId, parsedBranchIds, globalBranchIds, userId);
    }
    async refreshDashboard(req) {
        const organization_id = req.cookies.organization_id;
        if (!organization_id) {
            throw new common_1.HttpException('organization_id cookie not found', common_1.HttpStatus.BAD_REQUEST);
        }
        const organizationId = Number((0, crypto_utils_1.decrypt)(organization_id));
        return this.dashboardService.refreshDashboard(organizationId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('dashboard-counts'),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_1.Query)('branchIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardCounts1", null);
__decorate([
    (0, common_1.Get)('dashboard-analytics'),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_1.Query)('branchIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('refresh-dashboard'),
    __param(0, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "refreshDashboard", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
