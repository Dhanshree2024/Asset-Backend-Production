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
exports.MailConfig = void 0;
const typeorm_1 = require("typeorm");
let MailConfig = class MailConfig {
};
exports.MailConfig = MailConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'mail_config_id' }),
    __metadata("design:type", Number)
], MailConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_host' }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpHost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_port', type: 'int' }),
    __metadata("design:type", Number)
], MailConfig.prototype, "smtpPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_username' }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpUsername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_password' }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_from_email' }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpFromEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_from_name', nullable: true }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpFromName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_reply_email', nullable: true }),
    __metadata("design:type", String)
], MailConfig.prototype, "smtpReplyMail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'use_tls', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MailConfig.prototype, "useTLS", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'use_ssl', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MailConfig.prototype, "useSSL", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MailConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MailConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], MailConfig.prototype, "isActive", void 0);
exports.MailConfig = MailConfig = __decorate([
    (0, typeorm_1.Entity)('mail_config', { schema: 'public' })
], MailConfig);
