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
exports.AssetOwnershipStatus = exports.OwnershipType = void 0;
const organizational_user_entity_1 = require("../../../organizational-profile/entity/organizational-user.entity");
const typeorm_1 = require("typeorm");
var OwnershipType;
(function (OwnershipType) {
    OwnershipType["CAPEX"] = "capex";
    OwnershipType["OPEX"] = "opex";
    OwnershipType["NA"] = "NA";
})(OwnershipType || (exports.OwnershipType = OwnershipType = {}));
let AssetOwnershipStatus = class AssetOwnershipStatus {
};
exports.AssetOwnershipStatus = AssetOwnershipStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetOwnershipStatus.prototype, "ownership_status_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetOwnershipStatus.prototype, "ownership_status_type_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetOwnershipStatus.prototype, "asset_ownership_status_color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetOwnershipStatus.prototype, "ownership_status_description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetOwnershipStatus.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetOwnershipStatus.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OwnershipType,
        enumName: 'ownership_type_enum',
    }),
    __metadata("design:type", String)
], AssetOwnershipStatus.prototype, "ownership_status_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetOwnershipStatus.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AssetOwnershipStatus.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetOwnershipStatus.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssetOwnershipStatus.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetOwnershipStatus.prototype, "created_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", organizational_user_entity_1.User)
], AssetOwnershipStatus.prototype, "updated_user", void 0);
exports.AssetOwnershipStatus = AssetOwnershipStatus = __decorate([
    (0, typeorm_1.Entity)('asset_ownership_status_types')
], AssetOwnershipStatus);
