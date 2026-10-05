import { DataSource } from 'typeorm';
export declare class AssetTransferHistoryScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetTransferHistoryTable(schemaName: string): Promise<void>;
}
