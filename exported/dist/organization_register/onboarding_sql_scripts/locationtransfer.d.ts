import { DataSource } from 'typeorm';
export declare class LocationTransfersTableService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createLocationTransfersTable(schemaName: string): Promise<void>;
}
