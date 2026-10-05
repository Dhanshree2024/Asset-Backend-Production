import { RegisterOrganization } from './register-organization.entity';
export declare class RegisterUserLogin {
    user_id: number;
    first_name: string;
    last_name: string;
    business_email: string;
    phone_number: string;
    password: string;
    otp: string;
    otp_expiry: Date;
    verified: boolean;
    refreshToken: string;
    passwordSet: boolean;
    is_primary_user: string;
    organization: RegisterOrganization;
    org_billing_id: number;
}
