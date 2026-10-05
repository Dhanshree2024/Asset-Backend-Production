import { MaintenanceCronService } from './cronjob.service';
export declare class MaintenanceCronController {
    private readonly maintenanceCronService;
    constructor(maintenanceCronService: MaintenanceCronService);
    runOverdueMaintenance(): Promise<{
        success: boolean;
        message: string;
    }>;
    handleExpiredInvitations(): Promise<{
        success: boolean;
        message: string;
    }>;
}
