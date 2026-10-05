import { DataSource } from 'typeorm';
export declare class UserScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createUserTable(schemaName: string): Promise<void>;
    insertUserTable(schemaName: string, user: any): Promise<boolean>;
    private hashPassword;
}
