import { RedisService } from 'src/common/redis/redis.service';
import { DataSource } from 'typeorm';
export declare class StockSummaryRefreshService {
    private readonly dataSource;
    private readonly redis;
    private pendingRefresh;
    private refreshInFlight;
    private readonly DEBOUNCE_MS;
    private readonly DASHBOARD_MATVIEWS;
    private dashboardPending;
    private dashboardInFlight;
    private readonly DASHBOARD_DEBOUNCE_MS;
    private readonly MATVIEWS;
    constructor(dataSource: DataSource, redis: RedisService);
    private resolveSchema;
    scheduleRefresh(organizationId: number): Promise<void>;
    refreshNow(organizationId: number): Promise<void>;
    private scheduleDashboardRefresh;
    forceDashboardRefreshNow(organizationId: number): Promise<void>;
    private runDashboardRefresh;
    forceRefreshNow(organizationId: number): Promise<void>;
    private runRefresh;
}
