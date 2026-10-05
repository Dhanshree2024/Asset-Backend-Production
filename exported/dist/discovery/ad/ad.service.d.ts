import { CredentialService } from '../credentials/credential.service';
import { AdConfig, AdRepository } from './ad.repository';
export declare class AdService {
    private readonly repo;
    private readonly credentials;
    private readonly logger;
    constructor(repo: AdRepository, credentials: CredentialService);
    getConfig(schema: string): Promise<AdConfig>;
    saveConfig(schema: string, patch: Partial<AdConfig>, userId: number | null): Promise<AdConfig>;
    private connect;
    bindTest(schema: string): Promise<{
        ok: boolean;
        message: string;
        bindDn?: string;
        baseEntries?: number;
    }>;
    syncComputers(schema: string): Promise<{
        synced: number;
        linked: number;
    }>;
    listComputers(schema: string, search?: string): Promise<import("./ad.repository").AdComputerRow[]>;
    private fileTimeToIso;
    private generalizedTimeToIso;
}
