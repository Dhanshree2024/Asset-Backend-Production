import { Repository } from 'typeorm';
import { AssetLimitation } from 'src/organizational-profile/public_schema_entity/asset-limitation.entity';
export declare class RestrictionUtil {
    private readonly limitationRepo;
    constructor(limitationRepo: Repository<AssetLimitation>);
    static checkRestrictionAndLimitation(orgId: number, featureId: number): Promise<{
        assetRestriction: any;
        billingRestriction: any;
    }>;
}
