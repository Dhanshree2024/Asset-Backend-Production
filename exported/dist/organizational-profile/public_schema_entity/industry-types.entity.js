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
exports.IndustryTypes = void 0;
const typeorm_1 = require("typeorm");
let IndustryTypes = class IndustryTypes {
};
exports.IndustryTypes = IndustryTypes;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'industry_id' }),
    __metadata("design:type", Number)
], IndustryTypes.prototype, "industryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'industry_name', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], IndustryTypes.prototype, "industryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], IndustryTypes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], IndustryTypes.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], IndustryTypes.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], IndustryTypes.prototype, "isDeleted", void 0);
exports.IndustryTypes = IndustryTypes = __decorate([
    (0, typeorm_1.Entity)('industry_type_config', { schema: 'public' })
], IndustryTypes);
