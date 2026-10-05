import { Scanner, ScanResult, ScanSource } from '../interfaces/device.interface';
export declare class ArpScanner implements Scanner {
    readonly source: ScanSource;
    isAvailable(): Promise<boolean>;
    scan(cidrs: string[]): Promise<ScanResult[]>;
    private tryArpScanBinary;
    private readNeighbourTable;
    private isUsableIp;
}
