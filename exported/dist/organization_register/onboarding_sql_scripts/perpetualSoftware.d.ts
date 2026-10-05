import { DataSource } from 'typeorm';
export declare class PerpetualSoftwareViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSoftwareView(schemaName: string): Promise<void>;
}
