import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardCounts1(req: any, branchIds?: string | string[]): Promise<any>;
    getDashboard(req: any, branchIds?: string | string[]): Promise<any>;
    refreshDashboard(req: any): Promise<{
        success: boolean;
        message: string;
        refreshedAt: string;
    }>;
}
