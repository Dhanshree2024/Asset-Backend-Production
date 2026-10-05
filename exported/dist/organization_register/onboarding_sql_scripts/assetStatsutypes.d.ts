import { DataSource } from 'typeorm';
export declare class AssetStatusTypesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetStatusTable(schemaName: string): Promise<void>;
    insertAssetStatusTable(schemaName: string, statuses: {
        status_type_id: number;
        status_type_name: string;
        asset_status_description: string;
        status_color_code: string;
        is_default: boolean;
    }[]): Promise<void>;
}
