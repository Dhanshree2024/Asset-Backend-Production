import { User } from "src/organizational-profile/entity/organizational-user.entity";
export declare enum OwnershipType {
    CAPEX = "capex",
    OPEX = "opex",
    NA = "NA"
}
export declare class AssetOwnershipStatus {
    ownership_status_type_id: number;
    ownership_status_type_name: string;
    asset_ownership_status_color: string;
    ownership_status_description: string;
    is_active: number;
    is_deleted: number;
    ownership_status_type: OwnershipType;
    created_at: Date;
    is_default: boolean;
    created_by: number;
    updated_by: number;
    created_user: User;
    updated_user: User;
}
