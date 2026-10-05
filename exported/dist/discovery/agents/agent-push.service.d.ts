import { OnModuleInit } from '@nestjs/common';
import { AuditActor } from '../phase2.types';
import { AuditService } from '../audit/audit.service';
import { CredentialService } from '../credentials/credential.service';
import { RemoteJob } from '../interfaces/device.interface';
import { JobsService } from '../jobs/jobs.service';
import { PackageService } from '../software/package.service';
import { AgentRepository } from '../store/agent.repository';
import { AgentPushRepository, AgentPushRow } from './agent-push.repository';
export interface PushTargetInput {
    target: string;
    deviceId?: string | null;
    adComputerId?: string | null;
}
export interface PushRequestInput {
    relayAgentId: string;
    credentialId: string;
    packageId: string;
    targets: PushTargetInput[];
}
export declare class AgentPushService implements OnModuleInit {
    private readonly repo;
    private readonly agents;
    private readonly credentials;
    private readonly packages;
    private readonly jobs;
    private readonly audit;
    private readonly logger;
    constructor(repo: AgentPushRepository, agents: AgentRepository, credentials: CredentialService, packages: PackageService, jobs: JobsService, audit: AuditService);
    onModuleInit(): void;
    list(schema: string, opts?: {
        status?: string;
        limit?: number;
    }): Promise<AgentPushRow[]>;
    candidates(schema: string, search?: string): Promise<{
        devices: {
            id: string;
            hostname: string | null;
            ip: string;
            os: string | null;
            category: string;
            lastSeen: string | null;
            source: "device";
        }[];
        adComputers: {
            id: string;
            name: string;
            dnsHostName: string | null;
            os: string | null;
            deviceId: string | null;
            deviceIp: string | null;
            lastLogonAt: string | null;
            source: "ad";
        }[];
    }>;
    agentPackages(schema: string): Promise<import("../software/software.types").SoftwarePackage[]>;
    request(schema: string, actor: AuditActor, input: PushRequestInput): Promise<{
        rows: AgentPushRow[];
        pendingApproval: boolean;
    }>;
    cancel(schema: string, actor: AuditActor, id: string): Promise<AgentPushRow>;
    onJobTerminal(schema: string, job: RemoteJob): Promise<void>;
    onAgentRegistered(schema: string, agentId: string, hostname: string | null): Promise<void>;
}
