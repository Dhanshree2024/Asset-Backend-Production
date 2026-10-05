import { Request } from 'express';
import { DataSource } from 'typeorm';
import { AssetDataService } from 'src/assets-data/asset-data/asset-data.service';
import { AssetCategoriesService } from 'src/assets-data/asset-categories/asset-categories.service';
import { AssetSubcategoriesService } from 'src/assets-data/asset-subcategories/asset-subcategories.service';
import { AssetItemsService } from 'src/assets-data/asset-items/asset-items.service';
import { AssetFieldsService } from 'src/assets-data/asset-fields/asset-fields.service';
import { AssetItemsFieldsMappingService } from 'src/assets-data/asset-items-fields-mapping/asset-items-fields-mapping.service';
import { StocksService } from 'src/assets-data/stocks/stocks.service';
import { DatabaseService } from 'src/dynamic-schema/database.service';
import { DeviceRepository } from '../store/device.repository';
import { AssetMappingService } from 'src/asset-mapping/asset-mapping.service';
import { SoftwareInventoryService, SoftwareProcessSummary } from './software-inventory.service';
import { EndpointAutoCollectService } from '../endpoint/auto-collect.service';
import { ExecuteImportDto } from './dto/import.dto';
export interface DedupeResult {
    status: 'imported' | 'update-candidate' | 'new';
    existingSerial?: Record<string, any>;
}
export interface ItemFieldRow {
    aif_mapping_id: number;
    asset_field_id: number;
    asset_field_category_id: number | null;
    asset_field_category_name: string | null;
    asset_field_name: string | null;
    asset_field_label_name: string | null;
    asset_field_type: string | null;
}
export interface ImportResult {
    deviceId: number;
    status: 'created' | 'updated' | 'skipped' | 'failed';
    message?: string;
    assetId?: number;
    stockId?: number;
    serialUniqueId?: number;
    software?: SoftwareProcessSummary;
}
export declare class DiscoveryImportService {
    private readonly deviceRepository;
    private readonly databaseService;
    private readonly dataSource;
    private readonly assetDataService;
    private readonly stocksService;
    private readonly assetItemsService;
    private readonly assetCategoriesService;
    private readonly assetSubcategoriesService;
    private readonly assetFieldsService;
    private readonly itemFieldsMappingService;
    private readonly softwareInventoryService;
    private readonly assetMappingService;
    private readonly autoCollect;
    constructor(deviceRepository: DeviceRepository, databaseService: DatabaseService, dataSource: DataSource, assetDataService: AssetDataService, stocksService: StocksService, assetItemsService: AssetItemsService, assetCategoriesService: AssetCategoriesService, assetSubcategoriesService: AssetSubcategoriesService, assetFieldsService: AssetFieldsService, itemFieldsMappingService: AssetItemsFieldsMappingService, softwareInventoryService: SoftwareInventoryService, assetMappingService: AssetMappingService, autoCollect: EndpointAutoCollectService);
    private assertSchema;
    suggest(schema: string, deviceIds: number[]): Promise<{
        status: boolean;
        devices: any[];
        lookups: {
            softwareMainCategoryId: number;
            softwareRelationTypes: any;
            softwareSubCategories: any;
            licenseMetrics: import("src/assets-data/asset-items/entities/asset-item.enums").LicenseMetric[];
            categoryTree: any;
            locations: any;
            ownershipTypes: any;
        };
    }>;
    execute(schema: string, dto: ExecuteImportDto, organizationId: number, userId: number, req: Request): Promise<{
        status: boolean;
        results: ImportResult[];
        summary: {
            total: number;
            created: number;
            updated: number;
            skipped: number;
            failed: number;
        };
    }>;
    private getCurrentAssetIdSettings;
    private importOne;
    private processSoftwareForHost;
    private checkDedupe;
    private resolveItem;
    private findOrCreateCategory;
    private findOrCreateSubCategory;
    private findOrCreateItem;
    private resolveLocation;
    private firstActiveBranchId;
    private createLocation;
    private ensureDiscoveryLocation;
    private fetchItemFields;
    private buildInformationFields;
    private defaultFieldCategoryId;
    private createFieldForItem;
    private suggestCategorySubItem;
    private flattenSpecs;
    private matchSpecsToItemFields;
    private getCategoryTree;
    private getLocationOptions;
    private getOwnershipTypes;
}
