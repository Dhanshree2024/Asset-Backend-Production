import { DataSource } from 'typeorm';
export declare class PolicyAckScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPolicyAckTable(schemaName: string): Promise<void>;
}
