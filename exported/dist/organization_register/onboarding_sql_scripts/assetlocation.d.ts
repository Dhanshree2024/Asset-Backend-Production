import { DataSource } from 'typeorm';
export declare class assetLocationScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetLocationScriptTable(schemaName: string): Promise<void>;
    insertAssetLocations(schemaName: string, locations: {
        branch_id?: number;
        department_id?: number;
        location_name: string;
        location_floor_room?: string;
        location_code?: string;
        location_city?: string;
        location_state?: string;
        location_street_address?: string;
        location_description?: string;
        location_google_map_pin?: string;
        location_total_asset?: number;
        created_by?: number;
    }[]): Promise<void>;
}
