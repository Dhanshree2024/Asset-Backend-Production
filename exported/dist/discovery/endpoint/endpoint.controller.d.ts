import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { JobsService } from '../jobs/jobs.service';
import { NetDiagTool, ServiceControlAction, ServiceStartType } from '../phase2.types';
import { DeviceRepository } from '../store/device.repository';
import { EndpointRepository } from './endpoint.repository';
export declare class EndpointController {
    private readonly endpoint;
    private readonly devices;
    private readonly jobs;
    private readonly audit;
    private readonly requestContext;
    constructor(endpoint: EndpointRepository, devices: DeviceRepository, jobs: JobsService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    private deviceLabel;
    listServices(id: string): Promise<{
        status: boolean;
        services: import("../phase2.types").DeviceServiceRow[];
        collectedAt: string;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        services: any[];
        collectedAt?: undefined;
    }>;
    refreshServices(id: string, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
    controlService(id: string, name: string, body: {
        action: ServiceControlAction;
        startType?: ServiceStartType;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
    listEvents(id: string, logName?: string, level?: string, limit?: string): Promise<{
        status: boolean;
        events: import("../phase2.types").EventLogRow[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        events: any[];
    }>;
    collectEvents(id: string, body: {
        logNames?: string[];
        levels?: string[];
        maxEntries?: number;
        sinceHours?: number;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
    listPerf(id: string, hours?: string): Promise<{
        status: boolean;
        samples: import("../phase2.types").PerfSampleRow[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        samples: any[];
    }>;
    samplePerf(id: string, body: {
        samples?: number;
        intervalSeconds?: number;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
    listNetDiag(deviceId?: string, limit?: string): Promise<{
        status: boolean;
        runs: import("../phase2.types").NetDiagRunRow[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        runs: any[];
    }>;
    runNetDiag(id: string, body: {
        tool: NetDiagTool;
        target: string;
        port?: number;
        count?: number;
        timeoutSeconds?: number;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
}
