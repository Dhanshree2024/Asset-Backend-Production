import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { CredentialService } from '../credentials/credential.service';
import { JobsService } from '../jobs/jobs.service';
import { AgentRepository } from '../store/agent.repository';
export declare class AgentOpsController {
    private readonly jobs;
    private readonly agents;
    private readonly credentials;
    private readonly audit;
    private readonly requestContext;
    constructor(jobs: JobsService, agents: AgentRepository, credentials: CredentialService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    private agentLabel;
    update(agentId: string, body: {
        url: string;
        sha256: string;
        version: string;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
    authCollect(agentId: string, body: {
        credentialId: string;
        targets?: string[];
        cidr?: string;
        timeoutSeconds?: number;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
}
