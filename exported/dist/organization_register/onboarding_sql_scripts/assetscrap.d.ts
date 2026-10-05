import { DataSource } from 'typeorm';
export declare class AssetScrapMaintenanceTablesService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetScrapTable(schemaName: string): Promise<void>;
}
