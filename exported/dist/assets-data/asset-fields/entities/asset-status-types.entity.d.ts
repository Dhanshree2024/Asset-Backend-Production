import { AssetMappingRepository } from "src/asset-mapping/entities/asset-mapping.entity";
export declare class AssetStatusTypes {
    status_type_id: number;
    status_type_name?: string;
    asset_status_description?: string;
    status_color_code?: string;
    is_active: number;
    is_deleted: number;
    is_default: boolean;
    created_at: Date;
    asset_mapping: AssetMappingRepository[];
}
