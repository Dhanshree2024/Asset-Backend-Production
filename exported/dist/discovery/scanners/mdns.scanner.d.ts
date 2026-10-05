import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class MdnsScanner implements Scanner {
    readonly source: ScanSource;
    private readonly logger;
    isAvailable(): Promise<boolean>;
    scan(_cidrs: string[]): Promise<ScanResult[]>;
    private handleService;
    private pickIPv4;
}
