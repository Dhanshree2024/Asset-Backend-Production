import { DiscoveryConfig, Segment } from '../interfaces/device.interface';
import { DeviceRepository } from '../store/device.repository';
export declare class DiscoveryConfigService {
    private readonly deviceRepository;
    private readonly logger;
    constructor(deviceRepository: DeviceRepository);
    getConfig(schema: string): Promise<DiscoveryConfig>;
    updateConfig(schema: string, patch: Partial<DiscoveryConfig>): Promise<DiscoveryConfig>;
    resolveSegments(schema: string): Promise<Segment[]>;
    recordSegmentScan(schema: string, scannedCidrs: string[], finishedAt: Date, durationMs: number, deviceCountByCidr: Record<string, number>): Promise<void>;
    private normalizeAndValidateSegments;
    private parseCidr;
    private detectLocalSegments;
    private netmaskToPrefixLength;
    private intToIp;
    private warnedFallbackKey;
    private getKey;
    private encrypt;
    private decrypt;
}
