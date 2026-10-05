import { Locations } from './locations.entity';
import { User } from './organizational-user.entity';
export declare class Branch {
    branch_id: number;
    branch_name: string;
    gst_no?: string;
    branch_code?: string;
    branch_street?: string;
    branch_landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: number;
    city_id?: number;
    country_id?: number;
    contact_number?: string;
    alternative_contact_number?: string;
    branch_email?: string;
    established_date?: Date;
    is_active: number;
    is_deleted: number;
    primary_user?: User;
    created_by_user?: User;
    location_id?: Locations[];
    created_at: Date;
    updated_at: Date;
    occupancy_type_code: string;
    created_by?: number;
}
