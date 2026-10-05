import { DataSource } from 'typeorm';
export declare class AssetMappingRelations {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetMappingRelationsTable(schemaName: string): Promise<void>;
}
