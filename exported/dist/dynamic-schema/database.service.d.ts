import { DataSource } from 'typeorm';
export declare class DatabaseService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    setSchema(schemaName: string): Promise<void>;
}
