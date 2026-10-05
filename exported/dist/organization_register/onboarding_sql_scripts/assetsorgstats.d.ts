import { DataSource } from 'typeorm';
export declare class orgStatsScriptScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrgStatsScriptTable(schemaName: string): Promise<void>;
    insertOrgStats(schemaName: string, stats: {
        metric: string;
        value: number;
        recorded_at?: Date;
    }[]): Promise<void>;
}
