import { User } from "src/organizational-profile/entity/organizational-user.entity";
export declare class AssetDepreciationMethods {
    depreciation_method_id: number;
    dep_method_name: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    created_by_user: User;
    updated_by_user: User;
}
