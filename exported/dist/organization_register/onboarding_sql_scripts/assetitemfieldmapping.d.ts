import { DataSource } from 'typeorm';
export declare class ItemFieldsMappingScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createItemFieldsMappingTable(schemaName: string): Promise<void>;
    insertItemFieldMappings(schemaName: string, mappings: {
        itemName: string;
        fieldName: string;
        isIndividual?: number;
    }[]): Promise<void>;
}
