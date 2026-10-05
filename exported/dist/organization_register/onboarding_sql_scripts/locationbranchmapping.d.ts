import { DataSource } from 'typeorm';
export declare class locationBranchMappingScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createLocationBranchMappingScriptTable(schemaName: string): Promise<void>;
}
