import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class SnmpScanner implements Scanner {
    readonly source: ScanSource;
    private readonly logger;
    community: string | null;
    enabled: boolean;
    setCommunity(community: string | null): void;
    setEnabled(enabled: boolean): void;
    isAvailable(): Promise<boolean>;
    scan(cidrs: string[]): Promise<ScanResult[]>;
    private probeHost;
    private snmpGet;
    private walkEntityMib;
    private varbindString;
    private deriveOsFromDescr;
    private withTimeout;
}
