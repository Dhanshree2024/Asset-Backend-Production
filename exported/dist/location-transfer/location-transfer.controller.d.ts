import { Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { AddSourceLocationDto } from './dto/source-location.dto';
import { LocationTransferService } from './location-transfer.service';
export declare class LocationTransferController {
    private readonly locationTransferService;
    constructor(locationTransferService: LocationTransferService);
    addToLocationTransferListController(body: {
        transferIds: number[];
        mode?: "check" | "transfer";
        isSelectAll?: boolean;
        filters?: any;
        excludeIds?: number[];
        expectedCount?: number;
    }, req: any): Promise<{
        success: boolean;
        mode: string;
        transferableCount: number;
        eligibleCount: number;
        blockedCount: number;
        blockedAssets: {
            system_code: string;
            reason: string;
            asset_stocks_unique_id?: any;
        }[];
        message?: undefined;
        addedCount?: undefined;
        processedCount?: undefined;
        skippedCount?: undefined;
    } | {
        success: boolean;
        mode: string;
        addedCount: number;
        processedCount: number;
        skippedCount: number;
        message: string;
        blockedAssets: {
            system_code: string;
            reason: string;
            asset_stocks_unique_id?: any;
        }[];
        transferableCount?: undefined;
        eligibleCount?: undefined;
        blockedCount?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    getAllProjects2(dto: ListViewDto, req: any): Promise<any>;
    completeAllAssetsLocationTransfersController(body: {
        dtos: any[];
    }, req: any): Promise<{
        success: boolean;
        message: string;
        count: number;
    } | {
        success: boolean;
        message: string;
    }>;
    getMultipleTransferRecords(body: {
        location_transfer_ids: number[];
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
    }>;
    getLocationTransferDetail(body: {
        location_transfer_id: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            location_transfer_id: number;
            location_transfer_ticket: string;
            asset_title: string;
            system_code: string;
            transfer_status_name: string;
            working_status_color: string;
            from_location_name: string;
            from_location_type_code: string;
            from_location_branch_name: string;
            to_location_name: string;
            to_location_type_code: string;
            to_location_branch_name: string;
            requested_at: Date;
            requested_by: number;
            completed_at: Date;
            completed_by: number;
            reason_for_transfer: string;
            comment_for_location_transfer: string;
        };
        message?: undefined;
    }>;
    addSourceLocationForBlockedAssets(body: AddSourceLocationDto, req: any): Promise<{
        success: boolean;
        updated: number;
        message: string;
    } | {
        success: boolean;
        message: string;
    }>;
    exportLocationTransfers(res: Response, dto: ListViewDto, req: any): Promise<void>;
    getTransferImpactPreview(body: {
        asset_stocks_unique_id: number;
        to_location_id: number;
    }, req: any): Promise<any>;
}
