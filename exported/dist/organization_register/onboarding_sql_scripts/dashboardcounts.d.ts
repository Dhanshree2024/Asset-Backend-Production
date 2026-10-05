import { DataSource } from 'typeorm';
export declare class DashboardCountsViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDashboardCountsView(schemaName: string): Promise<void>;
}
