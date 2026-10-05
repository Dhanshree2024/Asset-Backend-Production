import { Repository } from 'typeorm';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { OrganizationalProfile } from 'src/organizational-profile/entity/organizational-profile.entity';
export declare class ProfileImageService {
    private userRepository;
    private orgRepo;
    getUserImagePath(arg0: number): void;
    getOrgLogoPath(orgId: any): void;
    constructor(userRepository: Repository<User>, orgRepo: Repository<OrganizationalProfile>);
    saveUserImage(userId: number, imagePath: string): Promise<User>;
    resetUserImage(userId: number): Promise<User>;
    saveCompanyImage(orgId: number, imagePath: string): Promise<OrganizationalProfile>;
    resetCompanyImage(orgId: number): Promise<OrganizationalProfile>;
}
