import { DataSource } from 'typeorm';
export declare class AssetsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetsTable(schemaName: string): Promise<void>;
}
