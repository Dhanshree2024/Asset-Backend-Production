import { DataSource } from 'typeorm';
export declare class PolicyManagementScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPolicyTables(schemaName: string): Promise<void>;
}
