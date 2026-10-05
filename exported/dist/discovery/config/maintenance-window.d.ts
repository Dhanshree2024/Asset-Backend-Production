export interface MaintenanceWindow {
    enabled: boolean;
    days: number[];
    start: string;
    end: string;
}
export declare const DEFAULT_MAINTENANCE_WINDOW: MaintenanceWindow;
export declare function parseHHMM(v: string): number | null;
export declare function normalizeWindow(raw: any): MaintenanceWindow;
export declare function isInWindow(now: Date, w: MaintenanceWindow): boolean;
export declare function nextDispatchTime(now: Date, w: MaintenanceWindow): Date | null;
