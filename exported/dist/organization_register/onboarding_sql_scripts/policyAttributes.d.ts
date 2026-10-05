import { DataSource } from 'typeorm';
export declare class PolicyAttributesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createPolicyAttributesTable(schemaName: string): Promise<void>;
    insertDefaultPolicyAttributes(schemaName: string): Promise<void>;
}
