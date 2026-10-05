import { DataSource } from 'typeorm';
import { RemoteJob } from '../interfaces/device.interface';
import { AuditService } from '../audit/audit.service';
import { AuditActor, CreateJobInput, JobListFilters, JobProgress } from '../phase2.types';
import { AgentRepository } from '../store/agent.repository';
import { CredentialRepository } from '../credentials/credential.repository';
import { EndpointRepository } from '../endpoint/endpoint.repository';
import { Phase2SettingsRepository } from '../settings/phase2-settings.repository';
export declare class JobsService {
    private readonly dataSource;
    private readonly agents;
    private readonly audit;
    private readonly credentials;
    private readonly endpoint;
    private readonly settings;
    private readonly logger;
    constructor(dataSource: DataSource, agents: AgentRepository, audit: AuditService, credentials: CredentialRepository, endpoint: EndpointRepository, settings: Phase2SettingsRepository);
    createJob(schema: string, actor: AuditActor, input: CreateJobInput): Promise<RemoteJob>;
    approve(schema: string, actor: AuditActor, jobId: string, opts?: {
        breakGlass?: boolean;
        reason?: string | null;
    }): Promise<RemoteJob>;
    reject(schema: string, actor: AuditActor, jobId: string, reason: string | null): Promise<RemoteJob>;
    cancel(schema: string, actor: AuditActor, jobId: string, reason: string | null): Promise<RemoteJob>;
    list(schema: string, filters: JobListFilters): Promise<{
        rows: RemoteJob[];
        total: number;
    }>;
    get(schema: string, jobId: string): Promise<RemoteJob>;
    private readonly terminalHooks;
    private readonly progressHooks;
    registerTerminalHook(fn: (schema: string, job: RemoteJob) => Promise<void>): void;
    registerProgressHook(fn: (schema: string, jobId: string, progress: JobProgress) => Promise<void>): void;
    progress(schema: string, agentId: string, jobId: string, progress: JobProgress): Promise<RemoteJob>;
    onResult(schema: string, job: RemoteJob): Promise<void>;
    expireStale(): Promise<void>;
}
