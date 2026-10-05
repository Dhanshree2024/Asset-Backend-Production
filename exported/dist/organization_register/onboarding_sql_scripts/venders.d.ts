import { DataSource } from 'typeorm';
export declare class VendersScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createVendersTable(schemaName: string): Promise<void>;
}
