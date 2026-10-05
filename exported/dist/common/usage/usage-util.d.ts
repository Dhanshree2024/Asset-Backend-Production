export declare class UsageUtil {
    static updateUsageCountInBothPortals(orgId: number, featureId: number, currentValue: string): Promise<{
        success: boolean;
        message: string;
        assetResult: any;
        billingResult: any;
    }>;
}
