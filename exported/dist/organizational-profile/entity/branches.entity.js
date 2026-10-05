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
exports.Branch = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const locations_entity_1 = require("./locations.entity");
const organizational_user_entity_1 = require("./organizational-user.entity");
let Branch = class Branch {
};
exports.Branch = Branch;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'branch_id' }),
    __metadata("design:type", Number)
], Branch.prototype, "branch_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai Head Office' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    (0, typeorm_1.Column)({ name: 'branch_name', length: 255 }),
    __metadata("design:type", String)
], Branch.prototype, "branch_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '27ABCDE1234F1Z5' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    (0, typeorm_1.Column)({ name: 'gst_no', length: 20, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "gst_no", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BR-MUM-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'branch_code', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "branch_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MG Road, Andheri East' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    (0, typeorm_1.Column)({ name: 'branch_street', length: 500, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "branch_street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Near Metro Station' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.Column)({ name: 'branch_landmark', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "branch_landmark", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mumbai' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    (0, typeorm_1.Column)({ name: 'city', length: 100, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maharashtra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    (0, typeorm_1.Column)({ name: 'state', length: 100, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'India' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    (0, typeorm_1.Column)({ name: 'country', length: 100, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 400001 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'pincode', nullable: true }),
    __metadata("design:type", Number)
], Branch.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 101 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'city_id', nullable: true }),
    __metadata("design:type", Number)
], Branch.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 91 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'country_id', nullable: true }),
    __metadata("design:type", Number)
], Branch.prototype, "country_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9876543210' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 10),
    (0, typeorm_1.Column)({ name: 'contact_number', length: 10, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "contact_number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9123456789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 10),
    (0, typeorm_1.Column)({
        name: 'alternative_contact_number',
        length: 10,
        nullable: true,
    }),
    __metadata("design:type", String)
], Branch.prototype, "alternative_contact_number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'branch@email.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, typeorm_1.Column)({ name: 'branch_email', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "branch_email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2022-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'established_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Branch.prototype, "established_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: '1 = Active, 0 = Inactive' }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_active', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], Branch.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: '0 = Not deleted, 1 = Deleted' }),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Branch.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary user of the branch' }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'primary_user_id' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Branch.prototype, "primary_user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who created the branch' }),
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], Branch.prototype, "created_by_user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [locations_entity_1.Locations] }),
    (0, typeorm_1.OneToMany)(() => locations_entity_1.Locations, (location) => location.branch),
    __metadata("design:type", Array)
], Branch.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Branch.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Branch.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'campus_owned' }),
    (0, typeorm_1.Column)({ name: 'occupancy_type_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "occupancy_type_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], Branch.prototype, "created_by", void 0);
exports.Branch = Branch = __decorate([
    (0, typeorm_1.Entity)('branches')
], Branch);
