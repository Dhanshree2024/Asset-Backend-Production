export declare enum OwnershipTypeEnum {
    CAPEX = "capex",
    OPEX = "opex",
    NA = "NA"
}
export declare class AssetOwnershipStatusTypes {
    ownership_status_type_id: number;
    ownership_status_type_name: string;
    ownership_status_description: string;
    ownership_status_type: OwnershipTypeEnum;
    asset_ownership_status_color: string;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    is_default: boolean;
}
