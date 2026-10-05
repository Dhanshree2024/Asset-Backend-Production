import { UserRepository } from 'src/user/user.repository';
export declare class TokenService {
    private userRepository;
    constructor(userRepository: UserRepository);
    generateTokens(user: any, accessExpiry?: string, refreshExpiry?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
