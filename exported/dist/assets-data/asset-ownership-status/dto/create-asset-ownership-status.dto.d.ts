import { OwnershipType } from "../entities/asset-ownership-status.entity";
export declare class CreateAssetOwnershipStatusDto {
    ownership_status_type_id: number;
    ownership_status_type_name: string | null;
    asset_ownership_status_color: string | null;
    is_active: number;
    is_deleted: number;
    ownership_status_description: string | null;
    ownership_status_type: OwnershipType;
    created_at: Date | null;
    ownership_status_type_ids?: number[];
    created_by: number | null;
    updated_by: number | null;
}
