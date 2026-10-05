import { DataSource } from 'typeorm';
export declare class OrganizationPermissionScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrganizationPermissionTable(schemaName: string): Promise<void>;
    insertOrganizationRolesPermissionTable(schemaName: string, roles: {
        role_id: number;
        permission: any[];
    }[]): Promise<void>;
}
