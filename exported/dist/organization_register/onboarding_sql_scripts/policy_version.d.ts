import { DataSource } from 'typeorm';
export declare class PolicyVersionScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPolicyVersionTable(schemaName: string): Promise<void>;
}
