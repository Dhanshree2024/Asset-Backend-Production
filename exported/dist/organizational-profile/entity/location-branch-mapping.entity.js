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
exports.LocationBranchMapping = void 0;
const typeorm_1 = require("typeorm");
const branches_entity_1 = require("./branches.entity");
const locations_entity_1 = require("./locations.entity");
const location_types_entity_1 = require("./location-types.entity");
let LocationBranchMapping = class LocationBranchMapping {
};
exports.LocationBranchMapping = LocationBranchMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "location_mapping_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], LocationBranchMapping.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], LocationBranchMapping.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], LocationBranchMapping.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], LocationBranchMapping.prototype, "is_favourite", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => locations_entity_1.Locations),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", locations_entity_1.Locations)
], LocationBranchMapping.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branches_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branches_entity_1.Branch)
], LocationBranchMapping.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_types_entity_1.LocationType),
    (0, typeorm_1.JoinColumn)({ name: 'type_id' }),
    __metadata("design:type", location_types_entity_1.LocationType)
], LocationBranchMapping.prototype, "type", void 0);
exports.LocationBranchMapping = LocationBranchMapping = __decorate([
    (0, typeorm_1.Entity)('location_branch_mapping')
], LocationBranchMapping);
