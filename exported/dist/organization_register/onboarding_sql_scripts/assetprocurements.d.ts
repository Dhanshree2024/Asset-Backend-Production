import { DataSource } from 'typeorm';
export declare class assetAssetProcurementsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetProcurementsScriptTable(schemaName: string): Promise<void>;
}
