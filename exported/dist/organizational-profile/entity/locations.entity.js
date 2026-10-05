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
exports.Locations = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const branches_entity_1 = require("./branches.entity");
const stocks_entity_1 = require("../../assets-data/stocks/entities/stocks.entity");
const location_branch_mapping_entity_1 = require("./location-branch-mapping.entity");
let Locations = class Locations {
};
exports.Locations = Locations;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary key of asset location',
        example: 101,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Locations.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location name (Office, Warehouse, Cabin, etc.)',
        example: 'Head Office – Floor 2',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Branch ID this location belongs to',
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "branch_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Floor name or number',
        example: '2nd Floor',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_floor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Room or cabin number',
        example: 'Room 203',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_room", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique location code',
        example: 'HO-F2-R203',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'City where the location is situated',
        example: 'Pune',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State where the location is situated',
        example: 'Maharashtra',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country where the location is situated',
        example: 'India',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal / ZIP code',
        example: '411045',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nearby landmark',
        example: 'Near Metro Station',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_landmark", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Street address of the location',
        example: 'Baner Road, Pune',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_street_address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional description about location',
        example: 'IT department block',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Google Map pin / coordinates / URL',
        example: '18.5590,73.7868',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_google_map_pin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent location ID for hierarchy (Building → Floor → Room)',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "parent_location_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hierarchy level of location',
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Locations.prototype, "location_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the location is locked for changes',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Locations.prototype, "is_locked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status (1 = active, 0 = inactive)',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], Locations.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "location_type_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location type ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "location_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "location_type_entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Soft delete flag (0 = not deleted, 1 = deleted)',
        example: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Locations.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record creation timestamp',
        example: '2024-01-10T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], Locations.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record last update timestamp',
        example: '2024-01-12T12:00:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'now()',
    }),
    __metadata("design:type", Date)
], Locations.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who created the record',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who last updated the record',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branches_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branches_entity_1.Branch)
], Locations.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stocks_entity_1.Stock, (stocks) => stocks.location),
    __metadata("design:type", Array)
], Locations.prototype, "stocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => location_branch_mapping_entity_1.LocationBranchMapping, (mapping) => mapping.location),
    __metadata("design:type", Array)
], Locations.prototype, "branch_mappings", void 0);
exports.Locations = Locations = __decorate([
    (0, typeorm_1.Entity)('asset_locations')
], Locations);
