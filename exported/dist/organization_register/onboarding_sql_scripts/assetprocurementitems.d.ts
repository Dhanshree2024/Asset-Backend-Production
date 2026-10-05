import { DataSource } from 'typeorm';
export declare class assetAssetProcurementItemsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetProcurementItemsScriptTable(schemaName: string): Promise<void>;
}
