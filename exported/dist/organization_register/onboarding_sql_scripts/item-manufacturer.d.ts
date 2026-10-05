import { DataSource } from 'typeorm';
export declare class ItemManufacturerScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createItemManufacturerTable(schemaName: string): Promise<void>;
    insertItemManufacturerMapping(schemaName: string): Promise<void>;
}
