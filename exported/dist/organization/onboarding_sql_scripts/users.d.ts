import { DataSource } from 'typeorm';
export declare class UserScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createUserTable(schemaName: string): Promise<void>;
    private hashPassword;
    insertUserTable(schemaName: string, user: any): Promise<string>;
}
