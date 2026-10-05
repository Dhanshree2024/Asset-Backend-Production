import { DataSource } from 'typeorm';
export declare class DiscoveredSoftwareTablesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDiscoveredSoftwareTables(schemaName: string): Promise<void>;
}
