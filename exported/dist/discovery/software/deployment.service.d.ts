import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { RemoteJob } from '../interfaces/device.interface';
import { JobsService } from '../jobs/jobs.service';
import { AuditActor } from '../phase2.types';
import { AgentRepository } from '../store/agent.repository';
import { DeploymentRepository } from './deployment.repository';
import { PackageService } from './package.service';
import { Deployment, DeploymentDevice, DeploymentInput, SoftwarePackage } from './software.types';
import { TargetResolver } from './target.resolver';
export declare class DeploymentService implements OnModuleInit {
    private readonly dataSource;
    private readonly repo;
    private readonly packages;
    private readonly targets;
    private readonly jobs;
    private readonly agents;
    private readonly audit;
    private readonly logger;
    constructor(dataSource: DataSource, repo: DeploymentRepository, packages: PackageService, targets: TargetResolver, jobs: JobsService, agents: AgentRepository, audit: AuditService);
    onModuleInit(): void;
    create(schema: string, actor: AuditActor, input: DeploymentInput): Promise<Deployment>;
    approve(schema: string, actor: AuditActor, id: string): Promise<Deployment>;
    reject(schema: string, id: string, reason: string | null): Promise<Deployment>;
    cancel(schema: string, actor: AuditActor, id: string, reason: string | null): Promise<Deployment>;
    retryFailed(schema: string, actor: AuditActor, id: string): Promise<{
        requeued: number;
    }>;
    resume(schema: string, actor: AuditActor, id: string): Promise<Deployment>;
    private dispatchRing;
    private dispatchDevice;
    static installPayload(pkg: SoftwarePackage, extra?: Record<string, unknown>): Record<string, unknown>;
    onJobTerminal(schema: string, job: RemoteJob): Promise<void>;
    onJobProgress(schema: string, jobId: string, step: string | undefined): Promise<void>;
    tick(): Promise<void>;
    advance(schema: string, dep: Deployment): Promise<void>;
    list(schema: string, opts: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        deployments: Deployment[];
        total: number;
    }>;
    get(schema: string, id: string): Promise<Deployment>;
    devices(schema: string, id: string): Promise<DeploymentDevice[]>;
}
