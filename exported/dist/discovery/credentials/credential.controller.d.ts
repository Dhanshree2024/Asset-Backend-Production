import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { JobsService } from '../jobs/jobs.service';
import { CredentialUpsertInput } from '../phase2.types';
import { CredentialService } from './credential.service';
export declare class CredentialController {
    private readonly credentials;
    private readonly jobs;
    private readonly audit;
    private readonly requestContext;
    constructor(credentials: CredentialService, jobs: JobsService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    list(): Promise<{
        status: boolean;
        credentials: import("../phase2.types").CredentialSummary[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        credentials: any[];
    }>;
    create(body: CredentialUpsertInput, req: Request): Promise<{
        status: boolean;
        credential: import("../phase2.types").CredentialSummary;
    }>;
    update(id: string, body: Partial<CredentialUpsertInput>, req: Request): Promise<{
        status: boolean;
        credential: import("../phase2.types").CredentialSummary;
    }>;
    remove(id: string, req: Request): Promise<{
        status: boolean;
    }>;
    test(id: string, body: {
        deviceId?: string;
        agentId?: string;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
}
