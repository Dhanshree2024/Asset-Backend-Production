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
exports.AssetDepreciationMethods = void 0;
const typeorm_1 = require("typeorm");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
let AssetDepreciationMethods = class AssetDepreciationMethods {
};
exports.AssetDepreciationMethods = AssetDepreciationMethods;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetDepreciationMethods.prototype, "depreciation_method_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetDepreciationMethods.prototype, "dep_method_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AssetDepreciationMethods.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AssetDepreciationMethods.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetDepreciationMethods.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetDepreciationMethods.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetDepreciationMethods.prototype, "created_by_user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetDepreciationMethods.prototype, "updated_by_user", void 0);
exports.AssetDepreciationMethods = AssetDepreciationMethods = __decorate([
    (0, typeorm_1.Entity)('asset_depreciation_methods')
], AssetDepreciationMethods);
