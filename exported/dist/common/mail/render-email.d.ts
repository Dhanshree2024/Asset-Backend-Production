import { MailConfigService } from './mail-config.service';
export interface EmailProps {
    name?: string;
    otp?: string;
    email?: string;
    companyName?: string;
    subject?: string;
    [key: string]: any;
}
export declare enum EmailTemplate {
    LOGIN_VERIFICATION = "login_verification",
    ONBOARDING_CONFIRMATION = "onboarding_confirmation",
    NEW_USER_INVITATION = "new_user_invitation",
    NEW_USER_INVITATION_WITH_ADMIN_LOGIN = "new_user_invitation_admin_login",
    NEW_USER_INVITATION_RESET_ADMIN_PASS = "new_user_invitation_reset_admin_pass",
    AUTH_LOGIN_VERIFICATION = "auth_login_verification",
    PASSWORD_RESET = "password_reset",
    PASSWORD_RESET_BY_ADMIN = "password_reset_by_admin",
    RESET_USER_PASSWORD = "user_reset_password",
    PASSWORD_UPDATED_SUCCESS = "password-update",
    PASSWORD_GENERATED_SUCCESS = "password-generate",
    SUPPORT_TICKET = "support_ticket",
    SUPPORT_MESSAGE = "support_message",
    MAINTENANCE_RESCHEDULED = "maintenance_rescheduled",
    MAINTENANCE_SCRAPPED = "maintenance_scrapped"
}
export declare function renderEmail(template: EmailTemplate, props: EmailProps, mailConfigService: MailConfigService): Promise<string>;
