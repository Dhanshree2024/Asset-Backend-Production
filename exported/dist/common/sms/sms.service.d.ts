import { Repository } from 'typeorm';
import { SmsConfig } from 'src/organizational-profile/public_schema_entity/sms-config.entity';
export declare class SmsService {
    private smsConfigRepo;
    constructor(smsConfigRepo: Repository<SmsConfig>);
    getActiveConfig(): Promise<SmsConfig>;
    sendOtp(mobile: string, otp: string, name?: string): Promise<{
        success: boolean;
        data: any;
    }>;
}
