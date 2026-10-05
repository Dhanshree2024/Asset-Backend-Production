import { DataSource } from 'typeorm';
export declare class assetAssetEventsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetEventsScriptTable(schemaName: string): Promise<void>;
}
