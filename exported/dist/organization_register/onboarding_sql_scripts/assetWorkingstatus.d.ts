import { DataSource } from 'typeorm';
export declare class AssetWorkingStatusScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetWorkingStatusTable(schemaName: string): Promise<void>;
    insertAssetWorkingStatusTable(schemaName: string, statuses: {
        working_status_type_id: number;
        working_status_type_name: string;
        status_category: number;
        status_for_category: number | null;
        working_status_description: string | null;
        working_status_color: string | null;
        is_default: boolean;
    }[]): Promise<void>;
}
