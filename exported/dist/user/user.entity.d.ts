import { RegisterOrganization } from '../organization_register/entities/register-organization.entity';
export declare class User {
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
    PasswordReset: string;
    profile_image: string;
    is_active: boolean;
    organization: RegisterOrganization;
}
