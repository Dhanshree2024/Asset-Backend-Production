import { DataSource } from 'typeorm';
import { DeviceServiceRow, EventLogRow, NetDiagRunRow, PerfSampleRow } from '../phase2.types';
export declare class EndpointRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    listServices(schema: string, deviceId: string): Promise<DeviceServiceRow[]>;
    replaceServices(schema: string, deviceId: string, services: any[], jobId: string | null): Promise<number>;
    upsertService(schema: string, deviceId: string, s: any, jobId: string | null): Promise<void>;
    insertEvents(schema: string, deviceId: string, events: any[], jobId: string | null): Promise<number>;
    listEvents(schema: string, deviceId: string, f?: {
        logName?: string;
        level?: string;
        limit?: number;
    }): Promise<EventLogRow[]>;
    insertPerfSamples(schema: string, deviceId: string, samples: any[], jobId: string | null): Promise<number>;
    listPerfSamples(schema: string, deviceId: string, hours?: number): Promise<PerfSampleRow[]>;
    rollupAndPrune(schema: string, keepRawDays?: number): Promise<{
        rolled: number;
        pruned: number;
    }>;
    pruneRollups(schema: string, days: number): Promise<number>;
    pruneEvents(schema: string, days: number): Promise<number>;
    insertNetDiagRun(schema: string, run: Omit<NetDiagRunRow, 'id' | 'createdAt'>): Promise<void>;
    listNetDiagRuns(schema: string, deviceId?: string, limit?: number): Promise<NetDiagRunRow[]>;
    private mapService;
}
