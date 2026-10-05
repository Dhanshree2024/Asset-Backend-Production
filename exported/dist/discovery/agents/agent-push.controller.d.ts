import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { AgentPushService, PushRequestInput } from './agent-push.service';
export declare class AgentPushController {
    private readonly push;
    private readonly audit;
    private readonly requestContext;
    constructor(push: AgentPushService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    list(status?: string, limit?: string): Promise<{
        status: boolean;
        pushes: import("./agent-push.repository").AgentPushRow[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        pushes: any[];
    }>;
    candidates(search?: string): Promise<{
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
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        devices: any[];
        adComputers: any[];
    }>;
    packages(): Promise<{
        status: boolean;
        packages: import("../software/software.types").SoftwarePackage[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        packages: any[];
    }>;
    request(body: PushRequestInput, req: Request): Promise<{
        status: boolean;
        pushes: import("./agent-push.repository").AgentPushRow[];
        message: string;
    }>;
    cancel(id: string, req: Request): Promise<{
        status: boolean;
        push: import("./agent-push.repository").AgentPushRow;
    }>;
}
