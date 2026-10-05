import { DataSource } from 'typeorm';
export declare class DomainsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDomainTable(schemaName: string): Promise<void>;
    insertDomainDefaults(schemaName: string): Promise<void>;
}
