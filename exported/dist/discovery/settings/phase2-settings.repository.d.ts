import { DataSource } from 'typeorm';
import { MaintenanceWindow } from '../config/maintenance-window';
export interface Phase2Settings {
    perfRawDays: number;
    perfRollupDays: number;
    eventLogDays: number;
    jobHistoryDays: number;
    eventLogCron: string | null;
    serviceListCron: string | null;
    perfSampleCron: string | null;
    eventLogDefaults: {
        logNames: string[];
        levels: string[];
        maxEntries: number;
        sinceHours: number;
    };
    maintenanceWindow: MaintenanceWindow;
}
export declare const DEFAULT_PHASE2_SETTINGS: Phase2Settings;
export declare class Phase2SettingsRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    get(schema: string): Promise<Phase2Settings>;
    update(schema: string, patch: Partial<Phase2Settings>): Promise<Phase2Settings>;
    private normalize;
}
