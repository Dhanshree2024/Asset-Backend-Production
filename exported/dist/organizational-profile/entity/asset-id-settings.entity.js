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
exports.AssetIDSettings = void 0;
const typeorm_1 = require("typeorm");
let AssetIDSettings = class AssetIDSettings {
};
exports.AssetIDSettings = AssetIDSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 25, default: 'ASSET' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 25, default: '' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "suffix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "starting_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "next_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 6 }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "sequence_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '-' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "separator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'never' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "reset_sequence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'DDMMYY' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "date_format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'CODE' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "branch_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "branch_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'CODE' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "department_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "department_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'CODE' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "category_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "category_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_sub_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'CODE' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "sub_category_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "sub_category_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "include_item", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'CODE' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "item_source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "item_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'Global' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'upper' }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "word_case", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 25 }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "max_length", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "user_input", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "applied_template_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AssetIDSettings.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp without time zone',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AssetIDSettings.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AssetIDSettings.prototype, "qr_code_settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, nullable: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AssetIDSettings.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], AssetIDSettings.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "is_barcode_enable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssetIDSettings.prototype, "is_qrcode_enable", void 0);
exports.AssetIDSettings = AssetIDSettings = __decorate([
    (0, typeorm_1.Entity)('asset_id_settings_v2')
], AssetIDSettings);
