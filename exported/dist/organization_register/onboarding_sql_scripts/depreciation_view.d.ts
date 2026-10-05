import { DataSource } from 'typeorm';
export declare class AssetDepreciationScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDepreciationView(schemaName: string): Promise<void>;
}
