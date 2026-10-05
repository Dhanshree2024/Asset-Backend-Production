import { DataSource } from 'typeorm';
export declare class assetIdSettingsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetIdSettingsV2Table(schemaName: string): Promise<void>;
    insertAssetIdSettings(schemaName: string, settings: any[]): Promise<void>;
}
