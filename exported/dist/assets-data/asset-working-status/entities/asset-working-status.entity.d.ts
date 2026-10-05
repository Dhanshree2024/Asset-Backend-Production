import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { AssetProcurement } from 'src/assets-data/stocks/entities/asset_procurements.entity';
export declare class AssetWorkingStatus {
    working_status_type_id: number;
    working_status_type_name?: string;
    working_status_color?: string;
    working_status_description?: string;
    status_category?: number;
    status_for_category?: number;
    is_active: number;
    is_deleted: number;
    is_default: boolean;
    created_at?: Date;
    created_by: number;
    updated_by: number;
    created_user: User;
    updated_user: User;
    procurements: AssetProcurement[];
}
