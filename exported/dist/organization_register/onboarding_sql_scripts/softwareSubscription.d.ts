import { DataSource } from 'typeorm';
export declare class SoftwareSubscriptionScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSoftwareSubscriptionTable(schemaName: string): Promise<void>;
}
