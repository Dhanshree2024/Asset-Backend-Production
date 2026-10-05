import { DataSource } from 'typeorm';
export declare class AssetRelationTypesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetRelationTypesTable(schemaName: string): Promise<void>;
    insertAssetRelationTypes(schemaName: string, relationTypes: {
        code: string;
        forward_label: string;
        reverse_label: string;
        cardinality: string;
        is_cycle_allowed: boolean;
        is_active: boolean;
        target_type: string;
        category: string;
    }[]): Promise<void>;
}
