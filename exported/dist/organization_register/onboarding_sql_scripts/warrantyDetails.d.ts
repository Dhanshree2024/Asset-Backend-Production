import { DataSource } from 'typeorm';
export declare class WarrantyDetailsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createWarrantyDetailsTable(schemaName: string): Promise<void>;
}
