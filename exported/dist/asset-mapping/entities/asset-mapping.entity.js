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
exports.AssetMappingRepository = exports.AssetRelationshipSourceEnum = exports.AssignTargetType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const asset_datum_entity_1 = require("../../assets-data/asset-data/entities/asset-datum.entity");
const asset_status_types_entity_1 = require("../../assets-data/asset-fields/entities/asset-status-types.entity");
const asset_working_status_entity_1 = require("../../assets-data/asset-working-status/entities/asset-working-status.entity");
const asset_stock_serials_entity_1 = require("../../assets-data/stocks/entities/asset_stock_serials.entity");
const branches_entity_1 = require("../../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../../organizational-profile/entity/department.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
var AssignTargetType;
(function (AssignTargetType) {
    AssignTargetType["USER"] = "USER";
    AssignTargetType["PROJECT"] = "PROJECT";
    AssignTargetType["DEPARTMENT"] = "DEPARTMENT";
    AssignTargetType["BRANCH"] = "BRANCH";
    AssignTargetType["SYSTEM"] = "SYSTEM";
    AssignTargetType["VENDOR"] = "VENDOR";
    AssignTargetType["LOCATION"] = "LOCATION";
    AssignTargetType["ASSET"] = "ASSET";
    AssignTargetType["OTHER"] = "OTHER";
    AssignTargetType["SOFTWARE"] = "SOFTWARE";
})(AssignTargetType || (exports.AssignTargetType = AssignTargetType = {}));
var AssetRelationshipSourceEnum;
(function (AssetRelationshipSourceEnum) {
    AssetRelationshipSourceEnum["MANUAL"] = "manual";
    AssetRelationshipSourceEnum["AGENT"] = "agent";
    AssetRelationshipSourceEnum["SCANNER"] = "scanner";
    AssetRelationshipSourceEnum["SYNC"] = "sync";
})(AssetRelationshipSourceEnum || (exports.AssetRelationshipSourceEnum = AssetRelationshipSourceEnum = {}));
let AssetMappingRepository = class AssetMappingRepository {
};
exports.AssetMappingRepository = AssetMappingRepository;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101, description: 'Primary key of asset mapping' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "mapping_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 55, description: 'Asset ID' }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_datum_entity_1.AssetDatum, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_datum_entity_1.AssetDatum)
], AssetMappingRepository.prototype, "asset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Asset status type ID' }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "status_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_status_types_entity_1.AssetStatusTypes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'status_type_id' }),
    __metadata("design:type", asset_status_types_entity_1.AssetStatusTypes)
], AssetMappingRepository.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Assigned to employee for project usage',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetMappingRepository.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12, description: 'User who assigned the asset' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "assigned_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetMappingRepository.prototype, "assigned_by_user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 18,
        description: 'User who returned the asset',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "returned_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'returned_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetMappingRepository.prototype, "returned_by_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T12:30:00Z',
        description: 'Mapping creation timestamp',
    }),
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetMappingRepository.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-11T09:15:00Z',
        description: 'Mapping last update timestamp',
    }),
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetMappingRepository.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        enum: [0, 1],
        description: 'Active status (1 = active)',
    }),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        enum: [0, 1],
        description: 'Soft delete flag',
    }),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Asset working condition ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "asset_working_condition_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_working_status_entity_1.AssetWorkingStatus, { nullable: true }),
    (0, typeorm_1.JoinColumn)({
        name: 'asset_working_condition_id',
        referencedColumnName: 'working_status_type_id',
    }),
    __metadata("design:type", asset_working_status_entity_1.AssetWorkingStatus)
], AssetMappingRepository.prototype, "asset_working_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 890,
        description: 'Asset stock unique ID (serial)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "asset_stocks_unique_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetMappingRepository.prototype, "stock_serial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 101,
        description: 'Target entity ID (user / location / project)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "target_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-02-10',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetMappingRepository.prototype, "assigned_from_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-03-10',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AssetMappingRepository.prototype, "assigned_to_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: AssignTargetType,
        example: AssignTargetType.USER,
        description: 'Target type for assignment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssignTargetType,
        nullable: true,
    }),
    __metadata("design:type", String)
], AssetMappingRepository.prototype, "target_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'target_id', referencedColumnName: 'user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetMappingRepository.prototype, "targetUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branches_entity_1.Branch, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'target_id', referencedColumnName: 'branch_id' }),
    __metadata("design:type", branches_entity_1.Branch)
], AssetMappingRepository.prototype, "targetBranch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'target_id', referencedColumnName: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], AssetMappingRepository.prototype, "targetDepartment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_stock_serials_entity_1.AssetStockSerials, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'target_id', referencedColumnName: 'asset_stocks_unique_id' }),
    __metadata("design:type", asset_stock_serials_entity_1.AssetStockSerials)
], AssetMappingRepository.prototype, "targetAsset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'REL-006',
        description: 'Relation type code from asset_relation_type_table',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AssetMappingRepository.prototype, "relation_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'Matched governance rule ID from asset_relationship_governance',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "governance_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: AssetRelationshipSourceEnum,
        example: AssetRelationshipSourceEnum.MANUAL,
        description: 'Source of relationship creation (manual, agent, scanner, sync)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetRelationshipSourceEnum,
        default: AssetRelationshipSourceEnum.MANUAL,
    }),
    __metadata("design:type", String)
], AssetMappingRepository.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-09-10T12:00:00Z',
        description: 'Heartbeat timestamp when last verified by agent or sync',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetMappingRepository.prototype, "last_seen_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { port: 'eth0', install_path: '/opt/oracle' },
        description: 'CMDB or technical metadata attributes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AssetMappingRepository.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: 'Whether this assignment is inherited from a host device relationship (1 = yes, 0 = no)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "is_inherited", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        description: 'The parent relationship mapping ID that this custody row was inherited from',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], AssetMappingRepository.prototype, "inherited_via_relationship_id", void 0);
exports.AssetMappingRepository = AssetMappingRepository = __decorate([
    (0, typeorm_1.Entity)("asset_mapping")
], AssetMappingRepository);
