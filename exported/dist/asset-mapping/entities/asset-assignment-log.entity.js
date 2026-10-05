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
exports.AssetAssignmentEvent = void 0;
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
const typeorm_1 = require("typeorm");
const asset_mapping_entity_1 = require("./asset-mapping.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let AssetAssignmentEvent = class AssetAssignmentEvent {
};
exports.AssetAssignmentEvent = AssetAssignmentEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "event_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetAssignmentEvent.prototype, "stock_serial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "mapping_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_mapping_entity_1.AssetMappingRepository, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mapping_id' }),
    __metadata("design:type", asset_mapping_entity_1.AssetMappingRepository)
], AssetAssignmentEvent.prototype, "mapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "performed_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'performed_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetAssignmentEvent.prototype, "performed_by_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetAssignmentEvent.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetAssignmentEvent.prototype, "performed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "working_condition_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus, { nullable: true }),
    (0, typeorm_1.JoinColumn)({
        name: 'working_condition_id',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetAssignmentEvent.prototype, "working_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 101,
        description: 'Target entity ID (user / location / project)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetAssignmentEvent.prototype, "target_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: asset_mapping_entity_1.AssignTargetType,
        example: asset_mapping_entity_1.AssignTargetType.USER,
        description: 'Target type for assignment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: asset_mapping_entity_1.AssignTargetType,
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetAssignmentEvent.prototype, "target_type", void 0);
exports.AssetAssignmentEvent = AssetAssignmentEvent = __decorate([
    (0, typeorm_1.Entity)('asset_assignment_events')
], AssetAssignmentEvent);
