import { AssetEventsService } from 'src/asset-events/asset-events.service';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetRelationshipHookService } from 'src/asset-mapping/services/asset-relationship-hook.service';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetProcurementItem } from 'src/assets-data/stocks/entities/asset_procurement_items.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { Stock } from 'src/assets-data/stocks/entities/stocks.entity';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { RedisService } from 'src/common/redis/redis.service';
import { Locations } from 'src/organizational-profile/entity/locations.entity';
import { DataSource, Repository } from 'typeorm';
import { LocationTransfer } from './entities/location-transfers.entity';
import { StocksService } from 'src/assets-data/stocks/stocks.service';
export declare class LocationTransferService {
    private readonly dataSource;
    private readonly notificationHelper;
    private readonly assetEventsService;
    private readonly redisService;
    private readonly assetDatumRepo;
    private readonly assetProcurementItem;
    private readonly assetMappingRepo;
    private readonly locationTransferRepo;
    private readonly assetStockSerialsRepository;
    private readonly locationsRepository;
    private readonly stockRepository;
    private readonly assetWorkingStatus;
    private readonly requestContext;
    private readonly stockSummaryRefresh;
    private readonly stocksService;
    private readonly depViewService;
    private readonly relationshipHookService;
    constructor(dataSource: DataSource, notificationHelper: NotificationHelper, assetEventsService: AssetEventsService, redisService: RedisService, assetDatumRepo: Repository<AssetDatum>, assetProcurementItem: Repository<AssetProcurementItem>, assetMappingRepo: Repository<AssetMappingRepository>, locationTransferRepo: Repository<LocationTransfer>, assetStockSerialsRepository: Repository<AssetStockSerials>, locationsRepository: Repository<Locations>, stockRepository: Repository<Stock>, assetWorkingStatus: Repository<AssetWorkingStatus>, requestContext: RequestContextService, stockSummaryRefresh: StockSummaryRefreshService, stocksService: StocksService, depViewService: DepreciationViewService, relationshipHookService: AssetRelationshipHookService);
    invalidateSerials(schema: string): Promise<void>;
    private refreshStockSummaryFromContext;
    getUserByPublicID(public_user_id: number): Promise<number>;
    private generateLocationTransferTicket;
    addSourceLocationForBlockedAssets(sourceLocationId: any, asset_stocks_unique_ids: any[], schema?: string): Promise<{
        success: boolean;
        message: string;
        updated?: undefined;
    } | {
        success: boolean;
        updated: number;
        message: string;
    }>;
    addToLocationTransferListService(userId: any, transferIds: any[], mode: 'check' | 'transfer', schema: any, isSelectAll?: boolean, filters?: any, branchIds?: number[], excludeIds?: number[], expectedCount?: number): Promise<{
        success: boolean;
        message: string;
        mode?: undefined;
        transferableCount?: undefined;
        eligibleCount?: undefined;
        blockedCount?: undefined;
        blockedAssets?: undefined;
        addedCount?: undefined;
        processedCount?: undefined;
        skippedCount?: undefined;
    } | {
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
    }>;
    getAllLocationTransferAssetsList(dto: ListViewDto): Promise<any>;
    completeAllAssetsLocationTransfers(userId: any, schema: any, dtos: any[]): Promise<{
        success: boolean;
        message: string;
        count: number;
    } | {
        success: boolean;
        message: string;
    }>;
    getMultipleLocationTransfers(transferIds: number[]): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
    }>;
    getLocationTransferDetail(transferId: number): Promise<{
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
    exportLocationTransfersToExcel(dto: any): Promise<Buffer>;
    getTransferImpactPreview(schema: string, hostSerialId: number, toLocationId: number): Promise<any>;
}
