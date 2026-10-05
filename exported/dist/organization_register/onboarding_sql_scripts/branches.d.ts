import { DataSource } from 'typeorm';
export declare class BranchesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createBranchesTable(schemaName: string): Promise<void>;
}
