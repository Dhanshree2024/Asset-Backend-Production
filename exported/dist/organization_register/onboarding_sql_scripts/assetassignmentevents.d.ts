import { DataSource } from 'typeorm';
export declare class assetAssetAssignmentEventsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetAssignmentEventsScriptTable(schemaName: string): Promise<void>;
}
