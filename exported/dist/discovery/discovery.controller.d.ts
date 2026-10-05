import { Response } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { DiscoveryConfigService } from './config/discovery-config.service';
import { DiscoveryService } from './discovery.service';
import { DiscoveryConfig } from './interfaces/device.interface';
import { AgentRepository } from './store/agent.repository';
import { DeviceListFilters, DeviceRepository } from './store/device.repository';
export declare class DiscoveryController {
    private readonly discoveryService;
    private readonly deviceRepository;
    private readonly agentRepository;
    private readonly configService;
    private readonly requestContext;
    constructor(discoveryService: DiscoveryService, deviceRepository: DeviceRepository, agentRepository: AgentRepository, configService: DiscoveryConfigService, requestContext: RequestContextService);
    private resolveSchema;
    listDevices(category?: string, segment?: string, search?: string): Promise<{
        status: boolean;
        devices: import("./interfaces/device.interface").Device[];
        count: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        devices: any[];
        count?: undefined;
    }>;
    getDevice(id: string): Promise<{
        status: boolean;
        message: string;
        device?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        device: import("./interfaces/device.interface").Device & {
            software: import("./store/device.repository").InstalledSoftwareRow[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        device?: undefined;
    }>;
    summary(): Promise<{
        total: number;
        byCategory: Record<string, number>;
        bySegment: Record<string, number>;
        lastRun: import("./store/device.repository").ScanRunRecord | null;
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
    }>;
    status(): Promise<{
        running: boolean;
        lastRunAt: string | null;
        lastRunMs: number | null;
        deviceCount: number | null;
        scanners: import("./discovery.service").ScannerAvailability[];
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
    }>;
    scan(): Promise<import("./discovery.service").RunScanResult | {
        status: boolean;
        message: string;
        error: any;
    }>;
    reclassify(): Promise<{
        status: boolean;
        updated: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        updated?: undefined;
    }>;
    setDeviceType(body: {
        ids?: (number | string)[];
        category?: string;
    }): Promise<{
        status: boolean;
        updated: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        updated?: undefined;
    }>;
    exportDevicesCsv(res: Response, filters: DeviceListFilters): Promise<void>;
    exportSoftwareCsv(res: Response, filters: DeviceListFilters): Promise<void>;
    listAgents(): Promise<{
        status: boolean;
        agents: import("./interfaces/device.interface").AgentRecord[];
        count: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        agents: any[];
        count?: undefined;
    }>;
    createAgentJob(agentId: string, body: {
        type?: string;
        payload?: Record<string, unknown>;
    }): Promise<{
        status: boolean;
        job: import("./interfaces/device.interface").RemoteJob;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        job?: undefined;
    }>;
    listAgentJobs(agentId: string): Promise<{
        status: boolean;
        jobs: import("./interfaces/device.interface").RemoteJob[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        jobs: any[];
    }>;
    revokeAgent(agentId: string): Promise<{
        status: boolean;
        message: string;
        error?: undefined;
    } | {
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
    }>;
    getConfig(): Promise<{
        status: boolean;
        config: DiscoveryConfig;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        config?: undefined;
    }>;
    updateConfig(patch: Partial<DiscoveryConfig>): Promise<{
        status: boolean;
        config: DiscoveryConfig;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        config?: undefined;
    }>;
}
