import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { VerifyOtpDto } from '../organization_register/verify-otp.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RedisService } from 'src/common/redis/redis.service';
export declare class AuthController {
    private authService;
    private readonly dataSource;
    private redisService;
    constructor(authService: AuthService, dataSource: DataSource, redisService: RedisService);
    login(loginDto: LoginDto, response: Response, req: Request): Promise<{
        success: boolean;
        message: string;
        data?: any;
        status: number;
    }>;
    getMe(req: Request, response: Response): Promise<any>;
    fetchUserLoginProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchUserLoginProfile2(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getApiKey(res: any): Promise<any>;
    updatePassword(req: Request, res: Response, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    checkSession(req: Request): {
        status: string;
        user_id: any;
        session_id: any;
    } | {
        status: string;
        user_id?: undefined;
        session_id?: undefined;
    };
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutAllById(userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    validateToken(): Promise<{
        message: string;
    }>;
    validateResetLink(userId: number): Promise<{
        valid: boolean;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto, res: Response): Promise<void>;
    clearCookies(response: Response, req: Request): void;
}
