import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { RegisterOrganization } from './register-organization.entity';
export declare enum InviteStatus {
    INVITED = "INVITED",
    ACCEPTED = "ACCEPTED",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED"
}
export declare class RegisterUserLogin {
    user_id: number;
    first_name: string;
    last_name: string;
    business_email: string;
    phone_number?: string;
    password: string;
    otp: string;
    otp_expiry: Date;
    verified: boolean;
    refreshToken: string;
    passwordSet: boolean;
    username: string;
    is_primary_user: string;
    passwordReset: string;
    organization_id: number;
    org_billing_id: number;
    organization: RegisterOrganization;
    users: User[];
    is_active: number;
    is_deleted: number;
    last_login_at: Date;
    force_password_change: boolean;
    invite_status: InviteStatus;
    invite_expires_at: Date;
}
