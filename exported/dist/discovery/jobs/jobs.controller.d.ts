import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { CreateJobInput } from '../phase2.types';
import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobs;
    private readonly audit;
    private readonly requestContext;
    constructor(jobs: JobsService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    types(): {
        status: boolean;
        types: {
            type: string;
            label: string;
            tier: import("../phase2.types").JobRiskTier;
            needsApproval: boolean;
            spec: string;
        }[];
    };
    create(body: CreateJobInput, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        job?: undefined;
    }>;
    list(status?: string, type?: string, deviceId?: string, agentId?: string, limit?: string, offset?: string): Promise<{
        status: boolean;
        jobs: import("../interfaces/device.interface").RemoteJob[];
        total: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        jobs: any[];
        total: number;
    }>;
    get(id: string): Promise<{
        status: boolean;
        message: string;
        job?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        job?: undefined;
    }>;
    approve(id: string, body: {
        breakGlass?: boolean;
        reason?: string;
    } | undefined, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
    reject(id: string, body: {
        reason?: string;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
    cancel(id: string, body: {
        reason?: string;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
    }>;
}
