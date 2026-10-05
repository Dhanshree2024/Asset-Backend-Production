import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class NetbiosScanner implements Scanner {
    readonly source: ScanSource;
    private readonly logger;
    isAvailable(): Promise<boolean>;
    scan(cidrs: string[]): Promise<ScanResult[]>;
    private buildNodeStatusQuery;
    private parseNodeStatus;
}
