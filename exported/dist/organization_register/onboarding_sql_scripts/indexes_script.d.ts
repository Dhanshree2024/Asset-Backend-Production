import { DataSource } from 'typeorm';
export declare class GlobalIndexesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAllIndexes(schemaName: string): Promise<void>;
    private createIndexes;
}
