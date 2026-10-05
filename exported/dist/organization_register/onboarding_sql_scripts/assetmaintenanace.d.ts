import { DataSource } from 'typeorm';
export declare class AssetMaintenanceTablesService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetMaintenanceTable(schemaName: string): Promise<void>;
}
