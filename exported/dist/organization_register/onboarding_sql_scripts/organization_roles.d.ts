import { DataSource } from 'typeorm';
export declare class OrganizationRolesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrganizationRolesTable(schemaName: string): Promise<void>;
    insertOrganizationRolesTable(schemaName: string, roles: {
        role_name: string;
        role_description?: string;
    }[]): Promise<void>;
}
