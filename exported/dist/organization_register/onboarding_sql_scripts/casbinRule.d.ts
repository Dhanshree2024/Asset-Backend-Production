import { DataSource } from 'typeorm';
export declare class CasbinRuleScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createCasbinRuleTable(schemaName: string): Promise<void>;
    insertCasbinRuleTable(schemaName: string, roles: {
        role_id: number;
        permission: any[];
    }[]): Promise<void>;
}
