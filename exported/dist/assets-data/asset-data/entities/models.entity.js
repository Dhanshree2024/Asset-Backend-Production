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
exports.Models = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const manufacturer_entity_1 = require("./manufacturer.entity");
let Models = class Models {
};
exports.Models = Models;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "model_id", type: "integer" }),
    __metadata("design:type", Number)
], Models.prototype, "model_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Latitude 5440" }),
    (0, typeorm_1.Column)({
        name: "model_name",
        type: "varchar",
        length: 255,
    }),
    __metadata("design:type", String)
], Models.prototype, "model_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({
        name: "manufacturer_id",
        type: "integer",
    }),
    __metadata("design:type", Number)
], Models.prototype, "manufacturer_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => manufacturer_entity_1.Manufacturer }),
    (0, typeorm_1.ManyToOne)(() => manufacturer_entity_1.Manufacturer, (manufacturer) => manufacturer.models, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "manufacturer_id" }),
    __metadata("design:type", manufacturer_entity_1.Manufacturer)
], Models.prototype, "manufacturer", void 0);
exports.Models = Models = __decorate([
    (0, typeorm_1.Entity)({ name: "models" })
], Models);
