import { DataSource } from 'typeorm';
export declare class ActionsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createActionTable(schemaName: string): Promise<void>;
    insertDefaultActions(schemaName: string): Promise<void>;
}
