import { DataSource } from 'typeorm';
export declare class OrganizationProfileScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrganizationProfileTable(schemaName: string): Promise<void>;
    insertOrganizationProfileTable(schemaName: string, user: any): Promise<void>;
}
