import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class PingScanner implements Scanner {
    readonly source: ScanSource;
    fingerprintPorts: number[];
    setPorts(ports: number[]): void;
    isAvailable(): Promise<boolean>;
    scan(cidrs: string[]): Promise<ScanResult[]>;
    private scanHost;
    private knock;
    private withTimeout;
}
