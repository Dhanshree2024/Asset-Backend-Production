import { ExecutionContext } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './create-organization.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { Response } from 'express';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    createOrganization(createOrganizationDto: CreateOrganizationDto, context: ExecutionContext): Promise<any>;
    verifyUserWithoutOtp(userId: number): Promise<any>;
    resendOtp(resendOtpDto: ResendOtpDto, context: ExecutionContext): Promise<any>;
    createCustomerOrganization(createOrganizationDto: CreateOrganizationDto, context: ExecutionContext): Promise<any>;
    storeAssetLimitations(body: {
        orgId: number;
        billingOrgId: number;
        limitations: any[];
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    getByBillingOrg(billingOrgId: number): Promise<{
        success: boolean;
        message: string;
        result: {
            billingOrgId: number;
            orgId: number;
            limitations: import("../organizational-profile/public_schema_entity/asset-limitation.entity").AssetLimitation[];
        };
    }>;
    updateAssetLimitations(body: {
        billingOrgId: number;
        limitations: {
            feature_id: number;
            plan_id: number;
            mapping_id?: number;
            override_value: string;
            default_value?: string;
            is_active?: boolean;
            is_deleted?: boolean;
        }[];
    }): Promise<{
        success: boolean;
        message: string;
        result: import("../organizational-profile/public_schema_entity/asset-limitation.entity").AssetLimitation[];
    }>;
    checkAssetRestriction(body: {
        orgId: number;
        featureId: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUsageCount(body: {
        orgId: number;
        featureId: number;
        currentValue: string;
    }): Promise<{
        success: boolean;
        message: string;
        result: {
            orgId: number;
            featureId: number;
            currentUsage: string;
            updatedAt: Date;
            billingOrgId: number;
        };
    }>;
}
