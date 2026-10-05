import { DataSource } from 'typeorm';
export declare class AssetStockSerialsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetStockSerialsTable(schemaName: string): Promise<void>;
}
