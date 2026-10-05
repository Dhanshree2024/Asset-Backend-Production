"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = void 0;
exports.renderEmail = renderEmail;
const React = __importStar(require("react"));
const render_1 = require("@react-email/render");
const login_verification_email_1 = require("./mail_templates/login-verification-email");
const onboarding_confirmation_email_1 = require("./mail_templates/onboarding-confirmation-email");
const new_user_invitation_email_1 = require("./mail_templates/new-user-invitation-email");
const auth_otp_email_1 = require("./mail_templates/auth-otp-email");
const password_reset_mail_1 = require("./mail_templates/password-reset-mail");
const password_updated_mail_1 = require("./mail_templates/password-updated-mail");
const generate_password_1 = require("./mail_templates/generate-password");
const user_password_reset_by_admin_1 = require("./mail_templates/user-password-reset-by-admin");
const support_ticket_email_1 = require("./mail_templates/support-ticket-email");
const support_message_1 = require("./mail_templates/support-message");
const user_password_reset_1 = require("./mail_templates/user-password-reset");
const new_user_invite_admin_login_1 = require("./mail_templates/new-user-invite-admin-login");
const new_user_reset_admin_pass_1 = require("./mail_templates/new-user-reset-admin-pass");
const maintenance_rescheduled_email_1 = require("./mail_templates/maintenance-rescheduled-email");
const maintenance_completed_but_scrapped_mail_1 = require("./mail_templates/maintenance-completed-but-scrapped-mail");
var EmailTemplate;
(function (EmailTemplate) {
    EmailTemplate["LOGIN_VERIFICATION"] = "login_verification";
    EmailTemplate["ONBOARDING_CONFIRMATION"] = "onboarding_confirmation";
    EmailTemplate["NEW_USER_INVITATION"] = "new_user_invitation";
    EmailTemplate["NEW_USER_INVITATION_WITH_ADMIN_LOGIN"] = "new_user_invitation_admin_login";
    EmailTemplate["NEW_USER_INVITATION_RESET_ADMIN_PASS"] = "new_user_invitation_reset_admin_pass";
    EmailTemplate["AUTH_LOGIN_VERIFICATION"] = "auth_login_verification";
    EmailTemplate["PASSWORD_RESET"] = "password_reset";
    EmailTemplate["PASSWORD_RESET_BY_ADMIN"] = "password_reset_by_admin";
    EmailTemplate["RESET_USER_PASSWORD"] = "user_reset_password";
    EmailTemplate["PASSWORD_UPDATED_SUCCESS"] = "password-update";
    EmailTemplate["PASSWORD_GENERATED_SUCCESS"] = "password-generate";
    EmailTemplate["SUPPORT_TICKET"] = "support_ticket";
    EmailTemplate["SUPPORT_MESSAGE"] = "support_message";
    EmailTemplate["MAINTENANCE_RESCHEDULED"] = "maintenance_rescheduled";
    EmailTemplate["MAINTENANCE_SCRAPPED"] = "maintenance_scrapped";
})(EmailTemplate || (exports.EmailTemplate = EmailTemplate = {}));
async function renderEmail(template, props, mailConfigService) {
    const mailConfig = await mailConfigService.getMailConfig();
    const defaultMailReply = mailConfig?.smtpReplyMail || "support@yourcompany.com";
    let EmailComponent;
    switch (template) {
        case EmailTemplate.LOGIN_VERIFICATION:
            EmailComponent = login_verification_email_1.LoginVerificationEmail;
            break;
        case EmailTemplate.ONBOARDING_CONFIRMATION:
            EmailComponent = onboarding_confirmation_email_1.OnboardingConfirmationEmail;
            break;
        case EmailTemplate.NEW_USER_INVITATION:
            EmailComponent = new_user_invitation_email_1.NewUserInvitationEmail;
            console.log('NewUserInvitationEmail');
            break;
        case EmailTemplate.NEW_USER_INVITATION_WITH_ADMIN_LOGIN:
            EmailComponent = new_user_invite_admin_login_1.NewUserInvitationWithAdminLoginEmail;
            console.log('NewUserInvitationWithAdminLoginEmail');
            break;
        case EmailTemplate.NEW_USER_INVITATION_RESET_ADMIN_PASS:
            EmailComponent = new_user_reset_admin_pass_1.NewUserInvitationResetAdminPassEmail;
            console.log('NewUserInvitationResetAdminPassEmail');
            break;
        case EmailTemplate.AUTH_LOGIN_VERIFICATION:
            EmailComponent = auth_otp_email_1.AuthLoginVerificationEmail;
            break;
        case EmailTemplate.PASSWORD_RESET:
            EmailComponent = password_reset_mail_1.PasswordResetEmail;
            break;
        case EmailTemplate.PASSWORD_RESET_BY_ADMIN:
            EmailComponent = user_password_reset_by_admin_1.UserPasswordResetAdminEmail;
            break;
        case EmailTemplate.PASSWORD_UPDATED_SUCCESS:
            EmailComponent = password_updated_mail_1.PasswordUpdatedEmail;
            break;
        case EmailTemplate.PASSWORD_GENERATED_SUCCESS:
            EmailComponent = generate_password_1.PasswordSetNotificationEmail;
            break;
        case EmailTemplate.SUPPORT_TICKET:
            EmailComponent = support_ticket_email_1.SupportTicketEmail;
            break;
        case EmailTemplate.SUPPORT_MESSAGE:
            EmailComponent = support_message_1.SupportMessageEmail;
            break;
        case EmailTemplate.RESET_USER_PASSWORD:
            EmailComponent = user_password_reset_1.UserPasswordResetEmail;
            break;
        case EmailTemplate.MAINTENANCE_RESCHEDULED:
            EmailComponent = maintenance_rescheduled_email_1.MaintenanceRescheduledEmail;
            break;
        case EmailTemplate.MAINTENANCE_SCRAPPED:
            EmailComponent = maintenance_completed_but_scrapped_mail_1.MaintenanceScrappedEmail;
            break;
        default:
            throw new Error("Invalid email template");
    }
    const emailProps = {
        ...props,
        mailReply: props.mailReply || defaultMailReply,
        companyName: mailConfig.smtpFromName,
    };
    return (0, render_1.render)(React.createElement(EmailComponent, emailProps));
}
