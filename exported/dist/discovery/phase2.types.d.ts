export type JobLifecycleStatus = 'pending_approval' | 'queued' | 'claimed' | 'running' | 'succeeded' | 'failed' | 'timed_out' | 'cancelled' | 'expired' | 'rejected';
export declare const TERMINAL_JOB_STATUSES: JobLifecycleStatus[];
export type JobRiskTier = 'read' | 'operate' | 'destructive';
export interface JobTypeMeta {
    type: string;
    label: string;
    tier: JobRiskTier;
    ttlMinutes: number;
    spec: string;
    auditAction: string;
}
export interface JobProgress {
    percent?: number;
    message?: string;
    step?: string;
    at?: string;
}
export interface CreateJobInput {
    type: string;
    deviceId?: string | null;
    agentId?: string | null;
    payload?: Record<string, unknown> | null;
    priority?: number;
    scheduledFor?: string | null;
    targetLabel?: string | null;
    maxAttempts?: number;
    preApprovedBy?: {
        userId: number | null;
        name: string | null;
    } | null;
}
export interface JobListFilters {
    status?: string;
    type?: string;
    deviceId?: string;
    agentId?: string;
    limit?: number;
    offset?: number;
}
export interface AuditActor {
    userId: number | null;
    name: string | null;
    ip: string | null;
    requestId: string | null;
}
export interface AuditEntryInput {
    action: string;
    targetType?: string | null;
    targetId?: string | number | null;
    targetLabel?: string | null;
    params?: Record<string, unknown> | null;
    result?: 'ok' | 'denied' | 'error' | 'pending';
    error?: string | null;
    jobId?: string | number | null;
}
export interface AuditEntry {
    id: string;
    actorUserId: number | null;
    actorName: string | null;
    actorIp: string | null;
    action: string;
    targetType: string | null;
    targetId: string | null;
    targetLabel: string | null;
    paramsRedacted: Record<string, unknown> | null;
    result: string;
    error: string | null;
    requestId: string | null;
    jobId: string | null;
    createdAt: string;
}
export interface AuditListFilters {
    action?: string;
    actorUserId?: number;
    targetType?: string;
    targetId?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
}
export type CredentialKind = 'windows-local' | 'windows-domain' | 'snmp-v2c' | 'ssh' | 'ldap-bind';
export declare const CREDENTIAL_KINDS: CredentialKind[];
export interface CredentialSummary {
    id: string;
    name: string;
    kind: CredentialKind;
    username: string | null;
    domain: string | null;
    description: string | null;
    isDefault: boolean;
    hasSecret: boolean;
    lastTestedAt: string | null;
    lastTestResult: 'ok' | 'failed' | null;
    lastTestError: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface CredentialUpsertInput {
    name: string;
    kind: CredentialKind;
    username?: string | null;
    domain?: string | null;
    secret?: string | null;
    description?: string | null;
    isDefault?: boolean;
}
export interface DeviceServiceRow {
    id: string;
    deviceId: string;
    name: string;
    displayName: string | null;
    status: string | null;
    startType: string | null;
    account: string | null;
    binaryPath: string | null;
    description: string | null;
    collectedAt: string;
}
export type ServiceControlAction = 'start' | 'stop' | 'restart' | 'set-startup';
export type ServiceStartType = 'Automatic' | 'Manual' | 'Disabled';
export interface EventLogRow {
    id: string;
    deviceId: string;
    logName: string;
    eventId: number | null;
    level: string | null;
    source: string | null;
    message: string | null;
    timeCreated: string | null;
    recordId: string | null;
    collectedAt: string;
}
export interface PerfSampleRow {
    deviceId: string;
    sampledAt: string;
    cpuPct: number | null;
    memUsedPct: number | null;
    memUsedMb: number | null;
    diskReadKbps: number | null;
    diskWriteKbps: number | null;
    netInKbps: number | null;
    netOutKbps: number | null;
}
export type NetDiagTool = 'ping' | 'tracert' | 'pathping' | 'nbtstat' | 'http' | 'https' | 'tcp-port';
export declare const NET_DIAG_TOOLS: NetDiagTool[];
export interface NetDiagRunRow {
    id: string;
    deviceId: string | null;
    tool: NetDiagTool;
    target: string;
    params: Record<string, unknown> | null;
    output: string | null;
    exitCode: number | null;
    durationMs: number | null;
    ranBy: number | null;
    jobId: string | null;
    createdAt: string;
}
