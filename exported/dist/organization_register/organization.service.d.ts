import { HttpService } from '@nestjs/axios';
import { DataSource, Repository } from 'typeorm';
import { CreateOrganizationDto } from './create-organization.dto';
import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { AssetLimitation } from 'src/organizational-profile/public_schema_entity/asset-limitation.entity';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { RegisterUserLogin } from './entities/register-user-login.entity';
export declare class OrganizationService {
    private readonly dataSource;
    private readonly mailService;
    private readonly mailConfigService;
    private readonly httpService;
    private readonly notificationHelper;
    private readonly assetLimitRepo;
    private readonly registerUserLoginRepo;
    constructor(dataSource: DataSource, mailService: MailService, mailConfigService: MailConfigService, httpService: HttpService, notificationHelper: NotificationHelper, assetLimitRepo: Repository<AssetLimitation>, registerUserLoginRepo: Repository<RegisterUserLogin>);
    createOrganization(createOrganizationDto: CreateOrganizationDto, context: any): Promise<any>;
    resendOtp(resendOtpDto: ResendOtpDto, context: any): Promise<any>;
    verifyOtp(userId: number): Promise<any>;
    createCustomerOrganization(createOrganizationDto: CreateOrganizationDto, context: any): Promise<any>;
    storeOrgLimitationsInAssetDB(orgId: number, billingOrgId: number, limitations: any[]): Promise<void>;
    getByBillingOrgId(billingOrgId: number): Promise<{
        billingOrgId: number;
        orgId: number;
        limitations: AssetLimitation[];
    }>;
    updateAssetLimitations(billingOrgId: number, limitations: {
        feature_id: number;
        plan_id: number;
        mapping_id?: number;
        override_value: string;
        default_value?: string;
        is_active?: boolean;
        is_deleted?: boolean;
    }[]): Promise<AssetLimitation[]>;
    getRestrictionByFeatureId(orgId: number, featureId: number): Promise<AssetLimitation>;
    updateUsageCount(orgId: number, featureId: number, currentValue: string): Promise<{
        orgId: number;
        featureId: number;
        currentUsage: string;
        updatedAt: Date;
        billingOrgId: number;
    }>;
}
