import { DataSource } from 'typeorm';
export declare class DiscoveryTablesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDiscoveryTables(schemaName: string): Promise<void>;
}
