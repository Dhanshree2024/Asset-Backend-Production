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
exports.AssetEvent = exports.AssetEventCategory = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const asset_datum_entity_1 = require("../../assets-data/asset-data/entities/asset-datum.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
var AssetEventCategory;
(function (AssetEventCategory) {
    AssetEventCategory["LIFECYCLE"] = "LIFECYCLE";
    AssetEventCategory["ASSIGNMENT"] = "ASSIGNMENT";
    AssetEventCategory["LOCATION"] = "LOCATION";
    AssetEventCategory["MAINTENANCE"] = "MAINTENANCE";
    AssetEventCategory["FINANCIAL"] = "FINANCIAL";
    AssetEventCategory["STATUS"] = "STATUS";
    AssetEventCategory["DOCUMENT"] = "DOCUMENT";
    AssetEventCategory["SYSTEM"] = "SYSTEM";
    AssetEventCategory["SCRAPE"] = "SCRAPE";
    AssetEventCategory["TITLE"] = "TITLE";
    AssetEventCategory["COSTCENTER"] = "COSTCENTER";
    AssetEventCategory["PROJECT"] = "PROJECT";
    AssetEventCategory["UPDATE"] = "UPDATE";
    AssetEventCategory["RENEWALS"] = "RENEWALS";
})(AssetEventCategory || (exports.AssetEventCategory = AssetEventCategory = {}));
let AssetEvent = class AssetEvent {
};
exports.AssetEvent = AssetEvent;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1001 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'event_id' }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "event_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_id', nullable: true }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'asset_stocks_unique_id', nullable: true }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'LOCATION_TRANSFER_COMPLETED',
        description: 'Business-level event identifier',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, typeorm_1.Column)({ name: 'event_type_id', nullable: true }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "event_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Asset transferred to new location',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'title', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetEvent.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Laptop moved from Pune to Mumbai branch',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetEvent.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'asset_location_transfers',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, typeorm_1.Column)({ name: 'reference_table', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetEvent.prototype, "reference_table", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'reference_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "reference_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { from_location: 1, to_location: 3 },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, typeorm_1.Column)({ name: 'metadata', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AssetEvent.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'performed_by', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetEvent.prototype, "performed_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-12T10:45:00.000Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'performed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AssetEvent.prototype, "performed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-12T10:46:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetEvent.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AssetEventCategory,
        example: AssetEventCategory.LOCATION,
    }),
    (0, class_validator_1.IsEnum)(AssetEventCategory),
    (0, typeorm_1.Column)({
        name: 'event_category',
        type: 'enum',
        enum: AssetEventCategory,
    }),
    __metadata("design:type", String)
], AssetEvent.prototype, "event_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetEvent.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetEvent.prototype, "stock_serial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'performed_by', referencedColumnName: 'user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetEvent.prototype, "performed_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'event_type_id', referencedColumnName: 'working_status_type_id' }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetEvent.prototype, "event", void 0);
exports.AssetEvent = AssetEvent = __decorate([
    (0, typeorm_1.Entity)("asset_events")
], AssetEvent);
