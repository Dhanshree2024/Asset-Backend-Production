import { DataSource } from 'typeorm';
export declare class SubModuleScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSubModuleTable(schemaName: string): Promise<void>;
    insertDefaultSubmodules(schemaName: string): Promise<void>;
}
