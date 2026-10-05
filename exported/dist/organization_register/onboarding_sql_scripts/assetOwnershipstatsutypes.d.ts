import { DataSource } from 'typeorm';
export declare class AssetOwnershipStatusTypesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetOwnershipStatusTypesTable(schemaName: string): Promise<void>;
    insertAssetOwnershipStatusTable(schemaName: string, statuses: {
        ownership_status_type_name: string;
        ownership_status_description: string;
        ownership_status_type: string;
        asset_ownership_status_color: string;
        is_default: boolean;
    }[]): Promise<void>;
}
