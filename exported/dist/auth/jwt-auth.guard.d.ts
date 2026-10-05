import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserLogin } from 'src/organization_register/entities/register-user-login.entity';
import { Session } from 'src/organizational-profile/public_schema_entity/sessions.entity';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private tokenService;
    private authService;
    private userRepository;
    private readonly sessionRepository;
    private readonly registerUserLogin;
    constructor(jwtService: JwtService, tokenService: TokenService, authService: AuthService, userRepository: UserRepository, sessionRepository: Repository<Session>, registerUserLogin: Repository<RegisterUserLogin>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private parseDurationToMs;
}
