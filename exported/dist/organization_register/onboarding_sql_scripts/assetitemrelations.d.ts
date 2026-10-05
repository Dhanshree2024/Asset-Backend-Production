import { DataSource } from 'typeorm';
export declare class AssetItemRelationScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetItemRelationTable(schemaName: string): Promise<void>;
    insertItemRelations(schemaName: string, relations: {
        parentItemName: string;
        childItemName: string;
        relationType: 'Other' | 'Accessory' | 'Contract' | 'Application';
    }[]): Promise<void>;
}
