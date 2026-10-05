import { Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { RedisService } from "src/common/redis/redis.service";
import { ManageAssetService } from "./manage-asset.service";
export declare class ManageAssetController {
    private readonly manageAssetService;
    private readonly redisService;
    constructor(manageAssetService: ManageAssetService, redisService: RedisService);
    scheduleMaintenance(body: {
        assetStockIds: number[];
        isSelectAll?: boolean;
        filters?: any;
        excludeIds?: number[];
        expectedCount?: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        blockedAssets: {
            system_code: string;
            reason: string;
            asset_stocks_unique_id: any;
        }[];
        maintenance_ids?: undefined;
    } | {
        success: boolean;
        message: string;
        maintenance_ids: any[];
        blockedAssets: {
            system_code: string;
            reason: string;
            asset_stocks_unique_id: any;
        }[];
    } | {
        success: boolean;
        message: string;
    }>;
    markForScrap(body: {
        stockIds: number[];
        isSelectAll?: boolean;
        filters?: any;
        excludeIds?: number[];
        expectedCount?: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        blockedAssets: {
            asset_stocks_unique_id: number;
            system_code?: string;
            reason: string;
        }[];
        scrap_ids?: undefined;
        processedCount?: undefined;
        skippedCount?: undefined;
        autoReturnedCount?: undefined;
    } | {
        success: boolean;
        message: string;
        scrap_ids: number[];
        processedCount: number;
        skippedCount: number;
        autoReturnedCount: number;
        blockedAssets: {
            asset_stocks_unique_id: number;
            system_code?: string;
            reason: string;
        }[];
    } | {
        success: boolean;
        message: string;
    }>;
    getAllMaintenance(dto: ListViewDto, req: any): Promise<any>;
    getSingleMaintenance(maintenance_id: number): Promise<any>;
    updateMaintenance(body: any, req: any): Promise<any>;
    updateMaintenanceStatus(body: {
        maintenance_id: number;
        status_id: number;
    }, req: any): Promise<any>;
    getAllScrap(dto: ListViewDto, req: any): Promise<any>;
    getSingleScrap(scrap_id: number): Promise<any>;
    updateScrap(body: any & {
        scrap_id: number;
    }, req: any, files: {
        certificate_of_disposal?: Express.Multer.File[];
        donation_letter_no?: Express.Multer.File[];
        authorization_approval?: Express.Multer.File[];
        approval_document?: Express.Multer.File[];
    }): Promise<any>;
    updateScrapStatus(body: {
        scrap_id: number;
        status_id: number;
        schema?: any;
        login_user_id?: any;
    }, req: any): Promise<any>;
    sidebarCount(req: any): Promise<any>;
    exportMaintenance(res: Response, dto: ListViewDto, req: any): Promise<void>;
    exportScrap(res: Response, dto: ListViewDto, req: any): Promise<void>;
}
