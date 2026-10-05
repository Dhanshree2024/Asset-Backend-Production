import { DataSource } from 'typeorm';
export declare class CustomViewsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createCustomViewsTable(schemaName: string): Promise<void>;
}
