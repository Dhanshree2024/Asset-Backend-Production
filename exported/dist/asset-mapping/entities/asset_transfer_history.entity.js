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
exports.AssetTransferHistory = exports.AssignTypeEnum = void 0;
const typeorm_1 = require("typeorm");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const branches_entity_1 = require("../../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const asset_mapping_entity_1 = require("./asset-mapping.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
const asset_datum_entity_1 = require("../../assets-data/asset-data/entities/asset-datum.entity");
const assets_project_entity_1 = require("../../assets-data/assets-projects/entities/assets-project.entity");
var AssignTypeEnum;
(function (AssignTypeEnum) {
    AssignTypeEnum["USER"] = "USER";
    AssignTypeEnum["BRANCH"] = "BRANCH";
    AssignTypeEnum["DEPARTMENT"] = "DEPARTMENT";
    AssignTypeEnum["PROJECT"] = "PROJECT";
})(AssignTypeEnum || (exports.AssignTypeEnum = AssignTypeEnum = {}));
let AssetTransferHistory = class AssetTransferHistory {
};
exports.AssetTransferHistory = AssetTransferHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'transfer_id' }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "transfer_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetTransferHistory.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_mapping_entity_1.AssetMappingRepository),
    (0, typeorm_1.JoinColumn)({ name: 'mapping_id' }),
    __metadata("design:type", asset_mapping_entity_1.AssetMappingRepository)
], AssetTransferHistory.prototype, "mapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetTransferHistory.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssignTypeEnum,
    }),
    __metadata("design:type", String)
], AssetTransferHistory.prototype, "assign_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "previous_user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'previous_user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetTransferHistory.prototype, "previous_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "previous_branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branches_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'previous_branch_id' }),
    __metadata("design:type", branches_entity_1.Branch)
], AssetTransferHistory.prototype, "previous_branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "previous_department_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department),
    (0, typeorm_1.JoinColumn)({ name: 'previous_department_id' }),
    __metadata("design:type", department_entity_1.Department)
], AssetTransferHistory.prototype, "previous_department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "previous_project_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assets_project_entity_1.AssetsProject),
    (0, typeorm_1.JoinColumn)({ name: 'previous_project_id' }),
    __metadata("design:type", assets_project_entity_1.AssetsProject)
], AssetTransferHistory.prototype, "previous_project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "new_user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'new_user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetTransferHistory.prototype, "new_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "new_branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branches_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'new_branch_id' }),
    __metadata("design:type", branches_entity_1.Branch)
], AssetTransferHistory.prototype, "new_branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "new_department_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department),
    (0, typeorm_1.JoinColumn)({ name: 'new_department_id' }),
    __metadata("design:type", department_entity_1.Department)
], AssetTransferHistory.prototype, "new_department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "new_project_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assets_project_entity_1.AssetsProject),
    (0, typeorm_1.JoinColumn)({ name: 'new_project_id' }),
    __metadata("design:type", assets_project_entity_1.AssetsProject)
], AssetTransferHistory.prototype, "new_project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "previous_used_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetTransferHistory.prototype, "used_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetTransferHistory.prototype, "transfered_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetTransferHistory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetTransferHistory.prototype, "system_code", void 0);
exports.AssetTransferHistory = AssetTransferHistory = __decorate([
    (0, typeorm_1.Entity)('asset_transfer_history')
], AssetTransferHistory);
