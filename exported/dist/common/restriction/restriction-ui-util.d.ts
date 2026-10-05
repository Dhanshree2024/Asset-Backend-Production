export declare class RestrictionUIUtil {
    static checkRestrictionForUI(orgId: number, featureId: number): Promise<{
        allowed: boolean;
        assetRestriction: any;
        billingRestriction: any;
    }>;
}
