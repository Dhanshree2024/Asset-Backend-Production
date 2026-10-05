import { DataSource } from 'typeorm';
export declare class UserSetupProgressScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createUserSetupProgressTable(schemaName: string): Promise<void>;
}
