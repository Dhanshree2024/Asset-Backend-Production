import { DataSource } from 'typeorm';
export declare class locationTypesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createLocationTypesTable(schemaName: string): Promise<void>;
    insertLocationTypes(schemaName: string, types: any[]): Promise<void>;
}
