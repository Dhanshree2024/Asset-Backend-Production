import { DataSource } from 'typeorm';
export declare class ModelsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createModelTable(schemaName: string): Promise<void>;
}
