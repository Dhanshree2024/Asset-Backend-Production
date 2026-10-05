import { DataSource } from 'typeorm';
export declare class OrganizationSetupProgressScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrganizationSetupProgressTable(schemaName: string): Promise<void>;
}
