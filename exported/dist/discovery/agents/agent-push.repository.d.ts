import { DataSource } from 'typeorm';
export type AgentPushStatus = 'pending_approval' | 'queued' | 'running' | 'installed' | 'registered' | 'already_installed' | 'failed' | 'cancelled';
export interface AgentPushRow {
    id: string;
    target: string;
    targetHostname: string | null;
    deviceId: string | null;
    adComputerId: string | null;
    relayAgentId: string;
    relayHostname: string | null;
    credentialId: string | null;
    credentialName: string | null;
    packageId: string | null;
    packageVersion: string | null;
    jobId: string | null;
    status: AgentPushStatus;
    method: string | null;
    exitCode: number | null;
    log: string | null;
    error: string | null;
    newAgentId: string | null;
    requestedBy: number | null;
    requestedByName: string | null;
    createdAt: string;
    updatedAt: string;
    finishedAt: string | null;
}
export interface AgentPushInsert {
    target: string;
    targetHostname: string | null;
    deviceId: string | null;
    adComputerId: string | null;
    relayAgentId: string;
    relayHostname: string | null;
    credentialId: string;
    credentialName: string;
    packageId: string;
    packageVersion: string;
    requestedBy: number | null;
    requestedByName: string | null;
}
export declare class AgentPushRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    private map;
    insert(schema: string, input: AgentPushInsert): Promise<AgentPushRow>;
    list(schema: string, opts?: {
        status?: string;
        limit?: number;
    }): Promise<AgentPushRow[]>;
    get(schema: string, id: string): Promise<AgentPushRow | null>;
    byJob(schema: string, jobId: string): Promise<AgentPushRow | null>;
    setJob(schema: string, id: string, jobId: string, status: AgentPushStatus): Promise<void>;
    update(schema: string, id: string, patch: {
        status?: AgentPushStatus;
        method?: string | null;
        exitCode?: number | null;
        log?: string | null;
        error?: string | null;
        targetHostname?: string | null;
        newAgentId?: string | null;
        finished?: boolean;
    }): Promise<void>;
    markRegistered(schema: string, hostname: string, newAgentId: string): Promise<number>;
    candidateDevices(schema: string, search?: string): Promise<{
        id: string;
        hostname: string | null;
        ip: string;
        os: string | null;
        category: string;
        lastSeen: string | null;
        source: 'device';
    }[]>;
    candidateAdComputers(schema: string, search?: string): Promise<{
        id: string;
        name: string;
        dnsHostName: string | null;
        os: string | null;
        deviceId: string | null;
        deviceIp: string | null;
        lastLogonAt: string | null;
        source: 'ad';
    }[]>;
    cancelOpen(schema: string, id: string): Promise<AgentPushRow | null>;
}
