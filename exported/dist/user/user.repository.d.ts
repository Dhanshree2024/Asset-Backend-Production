import { DataSource, Repository } from 'typeorm';
import { RegisterUserLogin } from '../organization_register/entities/register-user-login.entity';
export declare class UserRepository extends Repository<RegisterUserLogin> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByEmail(business_email: string): Promise<RegisterUserLogin>;
    validatePassword(password: string, hash: string): Promise<boolean>;
    findUserWithOrganizationSchema(email: string): Promise<RegisterUserLogin>;
    findUserWithEmail(email: string): Promise<RegisterUserLogin>;
    findUserWithMobileNumber(identifier: string): Promise<RegisterUserLogin>;
    findById(userId: number): Promise<RegisterUserLogin>;
}
