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
exports.LocationTransfer = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
const location_branch_mapping_entity_1 = require("../../organizational-profile/entity/location-branch-mapping.entity");
let LocationTransfer = class LocationTransfer {
};
exports.LocationTransfer = LocationTransfer;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "location_transfer_id" }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "location_transfer_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, required: false }),
    (0, typeorm_1.Column)({ name: "from_location_id", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "from_location_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_branch_mapping_entity_1.LocationBranchMapping),
    (0, typeorm_1.JoinColumn)({ name: "from_location_id", referencedColumnName: "location_mapping_id" }),
    __metadata("design:type", location_branch_mapping_entity_1.LocationBranchMapping)
], LocationTransfer.prototype, "fromLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, required: false }),
    (0, typeorm_1.Column)({ name: "to_location_id", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "to_location_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_branch_mapping_entity_1.LocationBranchMapping),
    (0, typeorm_1.JoinColumn)({ name: "to_location_id", referencedColumnName: "location_mapping_id" }),
    __metadata("design:type", location_branch_mapping_entity_1.LocationBranchMapping)
], LocationTransfer.prototype, "toLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, required: false }),
    (0, typeorm_1.Column)({ name: "transfer_status", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "transfer_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus),
    (0, typeorm_1.JoinColumn)({ name: "transfer_status", referencedColumnName: "working_status_type_id" }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], LocationTransfer.prototype, "status_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, required: false }),
    (0, typeorm_1.Column)({ name: "requested_by", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "requested_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({
        name: "requested_at",
        type: "timestamp",
        default: () => "now()",
    }),
    __metadata("design:type", Date)
], LocationTransfer.prototype, "requested_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "requested_by", referencedColumnName: "user_id" }),
    __metadata("design:type", organizational_user_entity_1.User)
], LocationTransfer.prototype, "requestedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, required: false }),
    (0, typeorm_1.Column)({ name: "completed_by", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "completed_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "completed_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], LocationTransfer.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "completed_by", referencedColumnName: "user_id" }),
    __metadata("design:type", organizational_user_entity_1.User)
], LocationTransfer.prototype, "completedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8, required: false }),
    (0, typeorm_1.Column)({ name: "approved_by", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "approved_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ name: "approved_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], LocationTransfer.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "approved_by", referencedColumnName: "user_id" }),
    __metadata("design:type", organizational_user_entity_1.User)
], LocationTransfer.prototype, "approvedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 137, required: false }),
    (0, typeorm_1.Column)({ name: "asset_stocks_unique_id", type: "int", nullable: true }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials),
    (0, typeorm_1.JoinColumn)({ name: "asset_stocks_unique_id", referencedColumnName: "asset_stocks_unique_id" }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], LocationTransfer.prototype, "assetStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hardware upgrade", required: false }),
    (0, typeorm_1.Column)({ name: "reason_for_transfer", type: "text", nullable: true }),
    __metadata("design:type", String)
], LocationTransfer.prototype, "reason_for_transfer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Approved by IT head", required: false }),
    (0, typeorm_1.Column)({ name: "comment_for_location_transfer", type: "text", nullable: true }),
    __metadata("design:type", String)
], LocationTransfer.prototype, "comment_for_location_transfer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "LT-2026-001", required: false }),
    (0, typeorm_1.Column)({ name: "location_transfer_ticket", type: "text", nullable: true }),
    __metadata("design:type", String)
], LocationTransfer.prototype, "location_transfer_ticket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ name: "is_active", type: "smallint", default: 1 }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ name: "is_deleted", type: "smallint", default: 0 }),
    __metadata("design:type", Number)
], LocationTransfer.prototype, "is_deleted", void 0);
exports.LocationTransfer = LocationTransfer = __decorate([
    (0, typeorm_1.Entity)("location_transfers")
], LocationTransfer);
