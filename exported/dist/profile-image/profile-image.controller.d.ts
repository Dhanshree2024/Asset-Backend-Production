import { ProfileImageService } from './profile-image.service';
export declare class ProfileImageController {
    private readonly profileImageService;
    constructor(profileImageService: ProfileImageService);
    uploadUserProfile(file: Express.Multer.File, body: any, req: any): Promise<{
        message: string;
        path: string;
        user: import("../organizational-profile/entity/organizational-user.entity").User;
    }>;
    resetUserProfile(body: any): Promise<{
        message: string;
        user: import("../organizational-profile/entity/organizational-user.entity").User;
    }>;
    uploadCompanyLogo(file: Express.Multer.File, req: any): Promise<{
        message: string;
        path: string;
        org: import("../organizational-profile/entity/organizational-profile.entity").OrganizationalProfile;
    }>;
    resetCompanyLogo(body: any): Promise<{
        message: string;
        org: import("../organizational-profile/entity/organizational-profile.entity").OrganizationalProfile;
    }>;
}
