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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const render_email_1 = require("./render-email");
const mail_service_1 = require("./mail.service");
const mail_config_service_1 = require("./mail-config.service");
let MailController = class MailController {
    constructor(mailerService, mailConfigService) {
        this.mailerService = mailerService;
        this.mailConfigService = mailConfigService;
    }
    async sendVerificationEmail(body) {
        try {
            console.log('s');
            if (!body.name || !body.email) {
                throw new Error("Missing required email fields");
            }
            const mailConfig = await this.mailConfigService.getMailConfig();
            const emailHtml = await (0, render_email_1.renderEmail)(render_email_1.EmailTemplate.PASSWORD_RESET, {
                name: 'Ram',
                otp: "123453",
                companyName: 'SP IT Solutions LLP',
                mailReply: mailConfig.smtpReplyMail
            }, this.mailConfigService);
            await this.mailerService.sendEmail(body.email, body.subject, emailHtml);
            return { message: "Verification email sent successfully" };
        }
        catch (error) {
            console.error("Error sending email:", error);
            return { message: "Failed to send email", error: error.message };
        }
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Post)('send-verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendVerificationEmail", null);
exports.MailController = MailController = __decorate([
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        mail_config_service_1.MailConfigService])
], MailController);
