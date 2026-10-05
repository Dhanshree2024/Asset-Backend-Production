import { DataSource } from 'typeorm';
export declare class SpecialPermissionsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSpecialPermissionsMaster(schemaName: string): Promise<void>;
    insertDefaultSpecialPermissions(schemaName: string): Promise<void>;
}
