export type DeviceCategory = 'router' | 'switch' | 'server' | 'virtual-machine' | 'laptop' | 'desktop' | 'windows-host' | 'linux-host' | 'printer' | 'nas' | 'ip-camera' | 'dvr-nvr' | 'attendance' | 'tv' | 'projector' | 'monitor' | 'phone' | 'access-point' | 'ups' | 'hvac' | 'iot' | 'unknown';
export declare const DEVICE_CATEGORIES: DeviceCategory[];
export type ScanSource = 'arp' | 'ping' | 'mdns' | 'ssdp' | 'snmp' | 'netbios' | 'http' | 'agent' | 'manual';
export declare const DEVICE_SPECS_CONTRACT_VERSION = 2;
export interface SoftwareEntry {
    name: string;
    version?: string;
    publisher?: string;
    installDate?: string;
    installLocation?: string;
    architecture?: string;
    productCode?: string;
    uninstallString?: string;
}
export interface MemoryModule {
    slot?: string;
    capacityGB?: number;
    speedMHz?: number;
    manufacturer?: string;
    partNumber?: string;
    serial?: string;
}
export interface DiskPartition {
    name?: string;
    sizeGB?: number;
    freeGB?: number;
    fileSystem?: string;
}
export interface DiskInfo {
    model?: string;
    serial?: string;
    sizeGB?: number;
    freeGB?: number;
    mediaType?: string;
    partitions?: DiskPartition[];
}
export interface NetworkAdapterInfo {
    name?: string;
    ip?: string;
    mac?: string;
    subnetMask?: string;
    gateway?: string;
    dns?: string[];
    connectionType?: string;
}
export interface DeviceSpecs {
    reportedAt: string;
    contractVersion?: number;
    hostname?: string;
    domain?: string;
    currentUser?: string;
    os?: {
        caption?: string;
        version?: string;
        build?: string;
        arch?: string;
        installDate?: string;
        lastBoot?: string;
    };
    cpu?: {
        model?: string;
        manufacturer?: string;
        cores?: number;
        logical?: number;
        speedGHz?: number;
    };
    ramGB?: number;
    ramAvailableGB?: number;
    memoryModules?: MemoryModule[];
    disks?: DiskInfo[];
    bios?: {
        vendor?: string;
        version?: string;
        releaseDate?: string;
    };
    system?: {
        manufacturer?: string;
        model?: string;
        serial?: string;
        asset?: string;
        uuid?: string;
    };
    network?: {
        ip?: string;
        mac?: string;
        subnetMask?: string;
        gateway?: string;
        dns?: string[];
        connectionType?: string;
        adapters?: NetworkAdapterInfo[];
    };
    software?: SoftwareEntry[];
    softwareCount?: number;
    agent?: {
        platform?: string;
        script?: string;
        version?: string;
        agentId?: string;
    };
}
export interface ScanResult {
    ip: string;
    mac?: string | null;
    hostname?: string;
    domain?: string;
    user?: string;
    os?: string;
    vendor?: string;
    model?: string;
    openPorts?: number[];
    services?: string[];
    specs?: Partial<DeviceSpecs>;
    source: ScanSource;
}
export interface Device {
    id?: string;
    ip: string;
    mac?: string | null;
    hostname?: string | null;
    domain?: string | null;
    currentUser?: string | null;
    os?: string | null;
    vendor?: string | null;
    category: DeviceCategory;
    categoryConfidence: number;
    model?: string | null;
    segment?: string | null;
    openPorts: number[];
    services: string[];
    sources: ScanSource[];
    firstSeen?: string;
    lastSeen?: string;
    specs?: DeviceSpecs | null;
}
export interface Scanner {
    readonly source: ScanSource;
    isAvailable(): Promise<boolean>;
    scan(cidrs: string[]): Promise<ScanResult[]>;
}
export interface Segment {
    label: string;
    cidr: string;
    local: boolean;
    enabled?: boolean;
    lastScanAt?: string | null;
    lastResult?: {
        deviceCount: number;
        durationMs: number;
    } | null;
}
export interface DiscoveryConfig {
    segments: Segment[];
    scanCron: string;
    fingerprintPorts: number[];
    snmpEnabled: boolean;
    snmpCommunity: string | null;
    snmpSweepAll: boolean;
    snmpDevices: string[];
    autoDetectSubnets: boolean;
}
export type AgentStatus = 'online' | 'offline';
export declare const AGENT_OFFLINE_AFTER_MS: number;
export interface AgentRecord {
    id: string;
    agentUuid: string;
    hostname: string | null;
    ip: string | null;
    os: string | null;
    version: string | null;
    deviceId: string | null;
    status: AgentStatus;
    lastHeartbeat: string | null;
    registeredAt: string;
}
export type RemoteJobStatus = 'pending_approval' | 'queued' | 'claimed' | 'running' | 'succeeded' | 'failed' | 'timed_out' | 'cancelled' | 'expired' | 'rejected';
export type RemoteJobType = 'INVENTORY_NOW' | 'PING' | 'CRED_TEST' | 'SERVICE_LIST' | 'SERVICE_CONTROL' | 'EVENTLOG_QUERY' | 'PERF_SAMPLE' | 'NET_DIAG' | 'AGENT_UPDATE';
export interface RemoteJob {
    id: string;
    agentId: string;
    type: string;
    payload: Record<string, unknown> | null;
    status: RemoteJobStatus;
    attempt: number;
    maxAttempts: number;
    result: Record<string, unknown> | null;
    error: string | null;
    createdAt: string;
    claimedAt: string | null;
    finishedAt: string | null;
    deviceId: string | null;
    targetLabel: string | null;
    priority: number;
    requestedBy: number | null;
    requestedByName: string | null;
    needsApproval: boolean;
    approvedBy: number | null;
    approvedByName: string | null;
    approvedAt: string | null;
    rejectedReason: string | null;
    scheduledFor: string | null;
    startedAt: string | null;
    progress: Record<string, unknown> | null;
    progressAt: string | null;
    exitCode: number | null;
    logRef: string | null;
    expiresAt: string | null;
    cancelledAt: string | null;
    cancelledBy: number | null;
    cancelReason: string | null;
}
export declare const DEFAULT_FINGERPRINT_PORTS: number[];
export declare const DEFAULT_DISCOVERY_CONFIG: DiscoveryConfig;
