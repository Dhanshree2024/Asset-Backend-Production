import { Request } from 'express';
import { AssetItemsService } from 'src/assets-data/asset-items/asset-items.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { RedisService } from 'src/common/redis/redis.service';
import { SoftwareInventoryService } from './software-inventory.service';
export declare class SoftwareInventoryController {
    private readonly softwareInventory;
    private readonly requestContext;
    private readonly assetItemsService;
    private readonly redisService;
    constructor(softwareInventory: SoftwareInventoryService, requestContext: RequestContextService, assetItemsService: AssetItemsService, redisService: RedisService);
    private resolveSchema;
    private resolveOrganizationId;
    private resolveUserId;
    private bustCaches;
    listForSerial(serialId: string): Promise<{
        status: boolean;
        data: {
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
        };
        message?: undefined;
    } | {
        status: boolean;
        message: any;
        data: any;
    }>;
    suggestOne(serialId: string, softwareKey: string): Promise<{
        status: boolean;
        data: {
            host: {
                serialId: number;
                name: any;
                sourceDeviceId: number;
            };
            match: import("./software-inventory.service").SoftwareMatch;
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
                licenseMetrics: import("../../assets-data/asset-items/entities/asset-item.enums").LicenseMetric[];
            };
        };
        message?: undefined;
    } | {
        status: boolean;
        message: any;
        data: any;
    }>;
    track(serialId: string, body: {
        softwareKey?: string;
        installedSoftwareId?: number;
        relationType?: string;
        useExistingSerialId?: number;
        existingItemId?: number;
        newItemName?: string;
        subCategoryId?: number;
        licenseMetric?: string;
        licenseKey?: string | null;
        maintainInventory?: boolean;
    }, req: Request): Promise<{
        status: boolean;
        data: import("./software-inventory.service").SoftwareProcessResult;
        message: string;
    } | {
        status: boolean;
        message: any;
        data?: undefined;
    }>;
    untrack(decisionId: string, req: Request): Promise<{
        status: boolean;
        data: {
            id: number;
            status: import("./software-inventory.service").DiscoveredSoftwareStatus;
        };
        message?: undefined;
    } | {
        status: boolean;
        message: any;
        data?: undefined;
    }>;
}
