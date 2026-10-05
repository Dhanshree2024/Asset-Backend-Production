import { DataSource } from 'typeorm';
export declare class AssetListViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetStockSerialsView(schemaName: string): Promise<void>;
}
