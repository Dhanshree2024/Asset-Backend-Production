import { DataSource } from 'typeorm';
export declare class UpdateOrganizationProgressFunctionScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createUpdateOrganizationProgressFunction(schemaName: string): Promise<void>;
}
