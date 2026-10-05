import { ExecutionContext } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { VerifyOtpDto } from './verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    verifyOtp(verifyOtpDto: VerifyOtpDto, context: ExecutionContext): Promise<any>;
    resendOtp(resendOtpDto: ResendOtpDto, context: ExecutionContext): Promise<any>;
}
