import { DataSource } from 'typeorm';
export declare class ModuleSubmoduleActionsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createModuleSubmoduleActionsTable(schemaName: string): Promise<void>;
    insertModuleSubmoduleActions(schemaName: string): Promise<void>;
}
