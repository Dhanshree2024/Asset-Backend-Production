import { Request, Response } from 'express';
import { DeviceSpecs } from './interfaces/device.interface';
import { AgentRepository } from './store/agent.repository';
import { DeviceRepository } from './store/device.repository';
import { JobsService } from './jobs/jobs.service';
import { CredentialService } from './credentials/credential.service';
import { AgentPushService } from './agents/agent-push.service';
import { JobProgress } from './phase2.types';
import { ComplianceService } from './software/compliance.service';
import { PackageService } from './software/package.service';
import { SoftwareInventoryService } from './import/software-inventory.service';
import { EndpointAutoCollectService } from './endpoint/auto-collect.service';
export declare class AgentController {
    private readonly deviceRepository;
    private readonly agentRepository;
    private readonly jobs;
    private readonly credentials;
    private readonly push;
    private readonly compliance;
    private readonly packages;
    private readonly softwareInventory;
    private readonly autoCollect;
    private readonly logger;
    constructor(deviceRepository: DeviceRepository, agentRepository: AgentRepository, jobs: JobsService, credentials: CredentialService, push: AgentPushService, compliance: ComplianceService, packages: PackageService, softwareInventory: SoftwareInventoryService, autoCollect: EndpointAutoCollectService);
    report(body: DeviceSpecs, agentToken: string | undefined, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined, onBehalfHeader: string | undefined, req: Request): Promise<{
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
    register(body: {
        hostname?: string;
        os?: string;
        version?: string;
        ip?: string;
    }, enrolmentToken: string | undefined, orgSchemaHeader: string | undefined, req: Request): Promise<{
        status: boolean;
        agentId: string;
        agentKey: string;
    }>;
    heartbeat(body: {
        version?: string;
        ip?: string;
    }, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined, req: Request): Promise<{
        status: boolean;
    }>;
    pollJobs(max: string | undefined, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined): Promise<{
        status: boolean;
        jobs: any[];
    }>;
    downloadPackage(packageId: string, token: string | undefined, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined, res: Response): Promise<void>;
    jobProgress(jobId: string, body: JobProgress, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined): Promise<{
        status: boolean;
        job: import("./interfaces/device.interface").RemoteJob;
    }>;
    jobResult(jobId: string, body: {
        status?: 'succeeded' | 'failed';
        result?: Record<string, unknown>;
        error?: string;
        exitCode?: number;
        logRef?: string;
    }, agentUuid: string | undefined, agentKey: string | undefined, orgSchemaHeader: string | undefined): Promise<{
        status: boolean;
        job: import("./interfaces/device.interface").RemoteJob;
    }>;
    private checkEnrolmentToken;
    private resolveSchema;
}
