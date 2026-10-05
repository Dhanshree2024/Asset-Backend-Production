import { DataSource } from 'typeorm';
export interface AdConfig {
    id: string | null;
    enabled: boolean;
    domainName: string | null;
    ldapUrl: string | null;
    useLdaps: boolean;
    baseDn: string | null;
    bindCredentialId: string | null;
    computerOuFilter: string | null;
    lastBindTestAt: string | null;
    lastBindResult: 'ok' | 'failed' | null;
    lastBindError: string | null;
    updatedAt: string | null;
}
export interface AdComputerRow {
    id: string;
    samAccountName: string;
    dnsHostName: string | null;
    distinguishedName: string | null;
    operatingSystem: string | null;
    osVersion: string | null;
    enabled: boolean | null;
    lastLogonAt: string | null;
    whenCreated: string | null;
    deviceId: string | null;
    deviceIp: string | null;
    firstSyncedAt: string;
    lastSyncedAt: string;
}
export interface AdComputerInput {
    samAccountName: string;
    dnsHostName?: string | null;
    distinguishedName?: string | null;
    operatingSystem?: string | null;
    osVersion?: string | null;
    enabled?: boolean | null;
    lastLogonAt?: string | null;
    whenCreated?: string | null;
}
export declare class AdRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    getConfig(schema: string): Promise<AdConfig>;
    upsertConfig(schema: string, patch: Partial<AdConfig>, userId: number | null): Promise<AdConfig>;
    recordBindTest(schema: string, ok: boolean, error: string | null): Promise<void>;
    upsertComputers(schema: string, computers: AdComputerInput[]): Promise<number>;
    linkComputersToDevices(schema: string, domainName: string | null): Promise<number>;
    listComputers(schema: string, search?: string, limit?: number): Promise<AdComputerRow[]>;
    private mapConfig;
}
