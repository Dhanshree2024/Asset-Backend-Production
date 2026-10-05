import { DataSource } from 'typeorm';
export declare class SoftwareViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSoftwareView(schemaName: string): Promise<void>;
}
