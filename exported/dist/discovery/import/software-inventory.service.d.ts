import { Request } from 'express';
import { DataSource } from 'typeorm';
import { AssetMappingService } from 'src/asset-mapping/asset-mapping.service';
import { AssetDataService } from 'src/assets-data/asset-data/asset-data.service';
import { AssetItemsService } from 'src/assets-data/asset-items/asset-items.service';
import { LicenseMetric } from 'src/assets-data/asset-items/entities/asset-item.enums';
import { StocksService } from 'src/assets-data/stocks/stocks.service';
import { InstalledSoftwareRow } from '../store/device.repository';
import { ImportSoftwareDto } from './dto/import.dto';
export type DiscoveredSoftwareStatus = 'NOT_TRACKED' | 'TRACKED' | 'FAILED' | 'REMOVED';
export interface SoftwareMatch {
    softwareKey: string;
    installedSoftwareId: number;
    name: string;
    version: string | null;
    publisher: string | null;
    productCode: string | null;
    installLocation: string | null;
    installDate: string | null;
    isOsComponent: boolean;
    matchedItem: {
        asset_item_id: number;
        asset_item_name: string;
        license_metric: string | null;
        confidence: number;
    } | null;
    matchedAsset: {
        asset_id: number;
        asset_title: string;
    } | null;
    availableSeat: {
        asset_stocks_unique_id: number;
        system_code: string | null;
    } | null;
    seatCounts: {
        total: number;
        free: number;
    } | null;
    existingDecision: DecisionRow | null;
}
export interface DecisionRow {
    id: number;
    host_serial_id: number;
    software_key: string;
    name: string;
    version: string | null;
    publisher: string | null;
    product_code: string | null;
    install_location: string | null;
    install_date: string | null;
    installed_software_id: number | null;
    source_device_id: number | null;
    maintain_inventory: boolean;
    relation_type: string | null;
    software_item_id: number | null;
    software_asset_id: number | null;
    software_serial_id: number | null;
    mapping_id: number | null;
    status: DiscoveredSoftwareStatus;
    unlicensed_install: boolean;
    last_error: string | null;
    first_seen_at: string;
    last_seen_at: string;
    decided_by: number | null;
    decided_at: string | null;
}
export interface SoftwareProcessResult {
    softwareKey: string;
    name: string;
    status: DiscoveredSoftwareStatus;
    maintainInventory: boolean;
    message?: string;
    softwareSerialId?: number | null;
    softwareAssetId?: number | null;
    mappingId?: number | null;
    unlicensedInstall?: boolean;
    guardFlags?: string[];
}
export interface SoftwareProcessSummary {
    discovered: number;
    tracked: number;
    notTracked: number;
    failed: number;
    details: SoftwareProcessResult[];
}
export interface HostContext {
    schema: string;
    hostSerialId: number;
    hostDeviceId: number | null;
    hostLocationMappingId: number | null;
    hostName: string;
    organizationId: number;
    userId: number;
    req: Request;
}
export declare function normalizeSoftwareName(s?: string | null): string;
export declare function softwareKeyOf(name?: string | null, publisher?: string | null, productCode?: string | null): string;
export declare function isOsComponent(name?: string | null, publisher?: string | null): boolean;
export declare class SoftwareInventoryService {
    private readonly dataSource;
    private readonly assetMappingService;
    private readonly assetDataService;
    private readonly stocksService;
    private readonly assetItemsService;
    private readonly logger;
    constructor(dataSource: DataSource, assetMappingService: AssetMappingService, assetDataService: AssetDataService, stocksService: StocksService, assetItemsService: AssetItemsService);
    private assertSchema;
    private tableExists;
    getSoftwareLookups(schema: string): Promise<{
        softwareMainCategoryId: number;
        softwareRelationTypes: any;
        softwareSubCategories: any;
        licenseMetrics: LicenseMetric[];
    }>;
    suggestForDevice(schema: string, software: InstalledSoftwareRow[], hostSerialId: number | null): Promise<SoftwareMatch[]>;
    private findAvailableSeat;
    private seatCounts;
    processForHost(ctx: HostContext, software: ImportSoftwareDto[]): Promise<SoftwareProcessSummary>;
    processOne(ctx: HostContext, sw: ImportSoftwareDto): Promise<SoftwareProcessResult>;
    private resolveSeat;
    private resolveSerialNumber;
    private findOrCreateSoftwareItem;
    private softwareInformationFields;
    private shortHash;
    private upsertDecision;
    listForSerial(schema: string, serialId: number): Promise<{
        host: {
            serialId: number;
            systemCode: any;
            name: any;
            sourceDeviceId: number;
            discovered: boolean;
        };
        counts: {
            installed: number;
            tracked: number;
            notMapped: number;
            failed: number;
            removed: number;
        };
        software: any[];
    }>;
    private toSoftwareTabRow;
    trackFromSerial(schema: string, serialId: number, input: {
        softwareKey?: string;
        installedSoftwareId?: number;
        relationType?: string;
        useExistingSerialId?: number;
        existingItemId?: number;
        newItemName?: string;
        subCategoryId?: number;
        licenseMetric?: any;
        licenseKey?: string | null;
        maintainInventory?: boolean;
    }, organizationId: number, userId: number, req: Request): Promise<SoftwareProcessResult>;
    suggestOneForSerial(schema: string, serialId: number, softwareKey: string): Promise<{
        host: {
            serialId: number;
            name: any;
            sourceDeviceId: number;
        };
        match: SoftwareMatch;
        governance: {
            allowed: boolean;
            governance_id: number | null;
            rule_name: string | null;
            message: string | null;
        };
        lookups: {
            softwareMainCategoryId: number;
            softwareRelationTypes: any;
            softwareSubCategories: any;
            licenseMetrics: LicenseMetric[];
        };
    }>;
    untrack(schema: string, decisionId: number, userId: number): Promise<{
        id: number;
        status: DiscoveredSoftwareStatus;
    }>;
    reconcileDevice(schema: string, deviceId: number): Promise<void>;
}
