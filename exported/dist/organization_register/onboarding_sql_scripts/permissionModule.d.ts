import { DataSource } from 'typeorm';
export declare class PermissionModuleScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPermissionModuleTable(schemaName: string): Promise<void>;
    insertDefaultModules(schemaName: string): Promise<void>;
}
