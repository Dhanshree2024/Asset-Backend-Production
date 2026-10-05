export declare class MaintenanceItemDto {
    mappingId: number;
    scheduledDate: string;
    priority: string;
    maintenanceType: string;
    technician: string;
    estimatedCost?: number;
    description?: string;
}
export declare class ScheduleMaintenanceDto {
    assets: MaintenanceItemDto[];
}
