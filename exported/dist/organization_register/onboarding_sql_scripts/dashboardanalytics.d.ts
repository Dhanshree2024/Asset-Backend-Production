import { DataSource } from 'typeorm';
export declare class DashboardAnalyticsViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDashboardAnalyticsView(schemaName: string): Promise<void>;
}
