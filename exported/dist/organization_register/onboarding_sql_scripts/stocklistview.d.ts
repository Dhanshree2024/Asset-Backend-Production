import { DataSource } from 'typeorm';
export declare class AssetStockDetailsViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetStockDetailsView(schemaName: string): Promise<void>;
}
