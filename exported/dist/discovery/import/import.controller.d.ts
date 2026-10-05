import { Request } from 'express';
import { AssetItemsService } from 'src/assets-data/asset-items/asset-items.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { ExecuteImportDto, SuggestImportDto } from './dto/import.dto';
import { DiscoveryImportService } from './import.service';
export declare class DiscoveryImportController {
    private readonly discoveryImportService;
    private readonly requestContext;
    private readonly assetItemsService;
    constructor(discoveryImportService: DiscoveryImportService, requestContext: RequestContextService, assetItemsService: AssetItemsService);
    private resolveSchema;
    private resolveOrganizationId;
    private resolveUserId;
    suggest(dto: SuggestImportDto): Promise<{
        status: boolean;
        devices: any[];
        lookups: {
            softwareMainCategoryId: number;
            softwareRelationTypes: any;
            softwareSubCategories: any;
            licenseMetrics: import("../../assets-data/asset-items/entities/asset-item.enums").LicenseMetric[];
            categoryTree: any;
            locations: any;
            ownershipTypes: any;
        };
    } | {
        status: boolean;
        message: any;
        error: any;
    }>;
    execute(dto: ExecuteImportDto, req: Request): Promise<{
        status: boolean;
        results: import("./import.service").ImportResult[];
        summary: {
            total: number;
            created: number;
            updated: number;
            skipped: number;
            failed: number;
        };
    } | {
        status: boolean;
        message: any;
        error: any;
    }>;
}
