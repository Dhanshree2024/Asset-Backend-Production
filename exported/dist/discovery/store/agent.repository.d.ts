import { DataSource } from 'typeorm';
import { AgentRecord, RemoteJob } from '../interfaces/device.interface';
export interface RegisterAgentInput {
    hostname?: string | null;
    ip?: string | null;
    os?: string | null;
    version?: string | null;
}
export interface RegisteredAgent {
    agentId: string;
    agentUuid: string;
    agentKey: string;
}
export declare class AgentRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    private hashKey;
    registerAgent(schema: string, input: RegisterAgentInput): Promise<RegisteredAgent>;
    authenticateAgent(schema: string, agentUuid: string, agentKey: string): Promise<AgentRecord>;
    heartbeat(schema: string, agentId: string, patch?: {
        ip?: string | null;
        version?: string | null;
    }): Promise<void>;
    linkDevice(schema: string, agentId: string, deviceId: string): Promise<void>;
    listAgents(schema: string): Promise<AgentRecord[]>;
    revokeAgent(schema: string, agentId: string): Promise<boolean>;
    createJob(schema: string, agentId: string, type: string, payload?: Record<string, unknown> | null, maxAttempts?: number, extra?: {
        deviceId?: string | null;
        targetLabel?: string | null;
        priority?: number;
        requestedBy?: number | null;
        requestedByName?: string | null;
        needsApproval?: boolean;
        scheduledFor?: string | null;
        ttlMinutes?: number;
        approvedBy?: number | null;
        approvedByName?: string | null;
    }): Promise<RemoteJob>;
    getJob(schema: string, jobId: string): Promise<RemoteJob | null>;
    resolveAgentForDevice(schema: string, deviceId: string): Promise<string | null>;
    claimJobs(schema: string, agentId: string, max?: number): Promise<RemoteJob[]>;
    updateProgress(schema: string, agentId: string, jobId: string, progress: Record<string, unknown> | null): Promise<RemoteJob | null>;
    completeJob(schema: string, agentId: string, jobId: string, outcome: {
        status: 'succeeded' | 'failed';
        result?: Record<string, unknown> | null;
        error?: string | null;
        exitCode?: number | null;
        logRef?: string | null;
    }): Promise<RemoteJob | null>;
    approveJob(schema: string, jobId: string, approver: {
        userId: number;
        name: string | null;
    }, opts?: {
        dispatchNow?: boolean;
    }): Promise<RemoteJob | null>;
    rejectJob(schema: string, jobId: string, decider: {
        userId: number | null;
        name: string | null;
    }, reason: string | null): Promise<RemoteJob | null>;
    cancelJob(schema: string, jobId: string, userId: number | null, reason: string | null): Promise<RemoteJob | null>;
    expireStaleJobs(schema: string): Promise<{
        expired: number;
        timedOut: number;
    }>;
    annotateJob(schema: string, jobId: string, note: string): Promise<void>;
    pruneTerminalJobs(schema: string, days: number): Promise<number>;
    listJobs(schema: string, agentId?: string, limit?: number): Promise<RemoteJob[]>;
    listJobsFiltered(schema: string, f?: {
        status?: string;
        type?: string;
        deviceId?: string;
        agentId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        rows: RemoteJob[];
        total: number;
    }>;
    private mapRow;
    private mapJobRow;
}
