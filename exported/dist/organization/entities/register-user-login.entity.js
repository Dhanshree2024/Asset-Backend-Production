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
exports.RegisterUserLogin = void 0;
const typeorm_1 = require("typeorm");
const register_organization_entity_1 = require("./register-organization.entity");
let RegisterUserLogin = class RegisterUserLogin {
};
exports.RegisterUserLogin = RegisterUserLogin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegisterUserLogin.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "business_email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], RegisterUserLogin.prototype, "otp_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RegisterUserLogin.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RegisterUserLogin.prototype, "passwordSet", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'N' }),
    __metadata("design:type", String)
], RegisterUserLogin.prototype, "is_primary_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => register_organization_entity_1.RegisterOrganization, (organization) => organization.users),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", register_organization_entity_1.RegisterOrganization)
], RegisterUserLogin.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RegisterUserLogin.prototype, "org_billing_id", void 0);
exports.RegisterUserLogin = RegisterUserLogin = __decorate([
    (0, typeorm_1.Entity)('register_user_login')
], RegisterUserLogin);
