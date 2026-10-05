import { Branch } from './branches.entity';
import { Locations } from './locations.entity';
import { LocationType } from './location-types.entity';
export declare class LocationBranchMapping {
    location_mapping_id: number;
    location_id: number;
    branch_id: number;
    type_id?: number;
    is_active: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    is_favourite: boolean;
    location: Locations;
    branch: Branch;
    type?: LocationType;
}
