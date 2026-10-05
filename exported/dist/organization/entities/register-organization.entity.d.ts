import { RegisterUserLogin } from './register-user-login.entity';
export declare class RegisterOrganization {
    organization_id: number;
    organization_name: string;
    organization_schema_name: string;
    users: RegisterUserLogin[];
}
