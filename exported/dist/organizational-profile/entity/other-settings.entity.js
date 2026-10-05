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
exports.OtherSettingsEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let OtherSettingsEntity = class OtherSettingsEntity {
};
exports.OtherSettingsEntity = OtherSettingsEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'org_settings_id', type: 'integer' }),
    __metadata("design:type", Number)
], OtherSettingsEntity.prototype, "org_settings_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            theme: 'dark',
            allowAssetTransfer: true,
            autoAssignSerial: false,
        },
        description: 'Organization level configuration settings stored in JSON format',
    }),
    (0, class_validator_1.IsObject)({ message: 'Settings must be a valid JSON object' }),
    (0, typeorm_1.Column)({
        type: 'jsonb',
        name: 'settings',
        nullable: true,
    }),
    __metadata("design:type", Object)
], OtherSettingsEntity.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsBoolean)({ message: 'is_current must be true or false' }),
    (0, typeorm_1.Column)({
        type: 'boolean',
        name: 'is_current',
        default: true,
    }),
    __metadata("design:type", Boolean)
], OtherSettingsEntity.prototype, "isCurrent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'created_by must be a valid user id' }),
    (0, typeorm_1.Column)({
        type: 'integer',
        name: 'created_by',
        nullable: true,
    }),
    __metadata("design:type", Number)
], OtherSettingsEntity.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'updated_by must be a valid user id' }),
    (0, typeorm_1.Column)({
        type: 'integer',
        name: 'updated_by',
        nullable: true,
    }),
    __metadata("design:type", Number)
], OtherSettingsEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsInt)({ message: 'org_id must be a valid organization id' }),
    (0, typeorm_1.Column)({
        type: 'integer',
        name: 'org_id',
    }),
    __metadata("design:type", Number)
], OtherSettingsEntity.prototype, "orgId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], OtherSettingsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], OtherSettingsEntity.prototype, "updatedAt", void 0);
exports.OtherSettingsEntity = OtherSettingsEntity = __decorate([
    (0, typeorm_1.Entity)('other_settings_org')
], OtherSettingsEntity);
