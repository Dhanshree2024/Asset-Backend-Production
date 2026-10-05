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
exports.SupportTicket = exports.SupportTicketStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SupportTicketStatus;
(function (SupportTicketStatus) {
    SupportTicketStatus["OPEN"] = "open";
    SupportTicketStatus["IN_PROGRESS"] = "in_progress";
    SupportTicketStatus["RESOLVED"] = "resolved";
    SupportTicketStatus["CLOSED"] = "closed";
})(SupportTicketStatus || (exports.SupportTicketStatus = SupportTicketStatus = {}));
let SupportTicket = class SupportTicket {
};
exports.SupportTicket = SupportTicket;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "ticket_id" }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "ticketId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "TCKT-2026-001",
        maxLength: 30,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Support ticket ID is required" }),
    (0, class_validator_1.Length)(3, 30, { message: "Support ticket ID must be between 3 and 30 characters" }),
    (0, typeorm_1.Column)({
        name: "support_ticket_id",
        type: "varchar",
        length: 30,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "supportTicketId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Vaishnavi Kulkarni" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Name is required" }),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "vaishnavi@email.com" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email format" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Unable to assign asset" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Asset Management" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "High" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "System throws error while assigning asset to department" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], SupportTicket.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SupportTicketStatus,
        example: SupportTicketStatus.OPEN,
    }),
    (0, class_validator_1.IsEnum)(SupportTicketStatus, {
        message: "Status must be open, in_progress, resolved or closed",
    }),
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        default: SupportTicketStatus.OPEN,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "error_screenshot.png",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: "user_id must be numeric" }),
    (0, typeorm_1.Column)({ type: "int", nullable: true, name: "user_id" }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, typeorm_1.Column)({ type: "smallint", default: 1 }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    (0, typeorm_1.Column)({ type: "smallint", default: 0 }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], SupportTicket.prototype, "attachments", void 0);
exports.SupportTicket = SupportTicket = __decorate([
    (0, typeorm_1.Entity)("support_tickets")
], SupportTicket);
