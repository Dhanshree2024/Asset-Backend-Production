import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { AgentRepository } from '../store/agent.repository';
import { DeploymentService } from './deployment.service';
import { DeploymentInput, TargetSelector } from './software.types';
import { TargetResolver } from './target.resolver';
export declare class DeploymentController {
    private readonly deployments;
    private readonly targets;
    private readonly agents;
    private readonly audit;
    private readonly requestContext;
    constructor(deployments: DeploymentService, targets: TargetResolver, agents: AgentRepository, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    list(status?: string, limit?: string, offset?: string): Promise<{
        deployments: import("./software.types").Deployment[];
        total: number;
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        deployments: any[];
        total: number;
    }>;
    preview(body: {
        targets: TargetSelector;
    }): Promise<{
        status: boolean;
        devices: {
            id: string;
            hostname: string;
            ip: string;
            os: string;
            category: import("../interfaces/device.interface").DeviceCategory;
            hasAgent: boolean;
        }[];
        total: number;
        withAgent: number;
    }>;
    get(id: string): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
        devices: import("./software.types").DeploymentDevice[];
    }>;
    create(body: DeploymentInput, req: Request): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
        message: string;
    }>;
    approve(id: string, req: Request): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
        message: string;
    }>;
    reject(id: string, body: {
        reason?: string;
    }, req: Request): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
    }>;
    cancel(id: string, body: {
        reason?: string;
    }, req: Request): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
    }>;
    retry(id: string, req: Request): Promise<{
        message: string;
        requeued: number;
        status: boolean;
    }>;
    resume(id: string, req: Request): Promise<{
        status: boolean;
        deployment: import("./software.types").Deployment;
    }>;
}
