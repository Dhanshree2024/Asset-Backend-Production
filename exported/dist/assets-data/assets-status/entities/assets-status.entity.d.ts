import { User } from "src/organizational-profile/entity/organizational-user.entity";
export declare class AssetsStatus {
    status_type_id: number;
    status_type_name: string;
    status_color_code: string;
    is_active: number;
    is_deleted: number;
    asset_status_description: string;
    created_at: Date;
    is_default: boolean;
    created_by: number;
    updated_by: number;
    created_user: User;
    updated_user: User;
}
