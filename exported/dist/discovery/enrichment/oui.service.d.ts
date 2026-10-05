export declare class OuiService {
    private readonly logger;
    private map;
    lookup(mac: string): string | null;
    isVirtualMac(mac: string | null | undefined): boolean;
    hypervisorName(mac: string | null | undefined): string | null;
    private ensureLoaded;
    private addEntry;
    private loadFromOuiDataPackage;
    private loadFromCsv;
    private loadFromFallback;
}
