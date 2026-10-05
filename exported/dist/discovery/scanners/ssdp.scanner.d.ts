import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class SsdpScanner implements Scanner {
    readonly source: ScanSource;
    private readonly logger;
    isAvailable(): Promise<boolean>;
    scan(_cidrs: string[]): Promise<ScanResult[]>;
    private fetchDescription;
    private parseDescription;
    private decodeXmlEntities;
}
