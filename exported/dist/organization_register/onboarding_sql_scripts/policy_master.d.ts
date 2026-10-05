import { DataSource } from 'typeorm';
export declare class PolicyMaterScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPolicyTable(schemaName: string): Promise<void>;
}
