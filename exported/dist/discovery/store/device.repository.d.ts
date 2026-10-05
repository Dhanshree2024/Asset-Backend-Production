import { DataSource } from 'typeorm';
import { ClassifierService } from '../enrichment/classifier.service';
import { Device, DeviceCategory, DiscoveryConfig, SoftwareEntry } from '../interfaces/device.interface';
export interface DeviceListFilters {
    category?: string;
    segment?: string;
    search?: string;
    isSelectAll?: boolean;
    excludeIds?: (string | number)[];
    selectedIds?: (string | number)[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc' | null;
}
export interface ScanRunInput {
    startedAt: Date;
    finishedAt: Date;
    durationMs: number;
    deviceCount: number;
    scanners: string[];
}
export interface ScanRunRecord {
    id: string;
    startedAt: string;
    finishedAt: string | null;
    durationMs: number | null;
    deviceCount: number | null;
    scanners: string[];
}
export interface DeviceSummary {
    total: number;
    byCategory: Record<string, number>;
    bySegment: Record<string, number>;
    lastRun: ScanRunRecord | null;
}
export interface InstalledSoftwareRow {
    id: number;
    name: string;
    version: string | null;
    publisher: string | null;
    installDate: string | null;
    installLocation: string | null;
    architecture: string | null;
    productCode: string | null;
    reportedAt: string;
}
export interface SoftwareInventoryRow {
    ip: string;
    hostname: string | null;
    name: string;
    version: string | null;
    publisher: string | null;
    installDate: string | null;
    architecture: string | null;
    productCode: string | null;
    reportedAt: string;
}
export declare class DeviceRepository {
    private readonly dataSource;
    private readonly classifierService;
    constructor(dataSource: DataSource, classifierService: ClassifierService);
    private assertSchema;
    upsertDevices(schema: string, devices: Device[]): Promise<Device[]>;
    listDevices(schema: string, filters?: DeviceListFilters): Promise<Device[]>;
    getDevice(schema: string, id: string): Promise<(Device & {
        software: InstalledSoftwareRow[];
    }) | null>;
    summary(schema: string): Promise<DeviceSummary>;
    reclassifyAll(schema: string): Promise<number>;
    setDeviceCategory(schema: string, ids: (number | string)[], category: DeviceCategory): Promise<number>;
    replaceSoftware(schema: string, deviceId: string, software: SoftwareEntry[]): Promise<void>;
    listSoftwareInventory(schema: string, filters?: DeviceListFilters): Promise<SoftwareInventoryRow[]>;
    recordScanRun(schema: string, run: ScanRunInput): Promise<void>;
    getLastScanRun(schema: string): Promise<ScanRunRecord | null>;
    getConfig(schema: string): Promise<DiscoveryConfig>;
    updateConfig(schema: string, patch: Partial<DiscoveryConfig>): Promise<DiscoveryConfig>;
    private insertDefaultConfig;
    private mapRowToDevice;
    private mapRowToConfig;
}
