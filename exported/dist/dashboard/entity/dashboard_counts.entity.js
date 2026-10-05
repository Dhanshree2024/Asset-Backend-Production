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
exports.DashboardCountsView = void 0;
const typeorm_1 = require("typeorm");
let DashboardCountsView = class DashboardCountsView {
};
exports.DashboardCountsView = DashboardCountsView;
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "departments", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "branches", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "in_use_assets", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "available_assets", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "maintenance_assets", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "total_asset_price", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "it_warranty_expiring", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "it_warranty_action_required", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "location_transfers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "pending_location_transfers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "completed_location_transfers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "costcenter_counts", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "active_cost_centers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "inactive_cost_centers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "deleted_cost_centers", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "in_use_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "available_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "maintenance_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "pending_transfer_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "completed_transfer_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "warranty_expiring_percentage", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], DashboardCountsView.prototype, "active_cost_center_percentage", void 0);
exports.DashboardCountsView = DashboardCountsView = __decorate([
    (0, typeorm_1.ViewEntity)({
        name: 'dashboard_counts',
    })
], DashboardCountsView);
