import { DataSource } from 'typeorm';
export declare class ManufacturerScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createManufacturerTable(schemaName: string): Promise<void>;
}
