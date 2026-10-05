import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { DataSource, Repository } from 'typeorm';
import { AssetEventsService } from 'src/asset-events/asset-events.service';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { Stock } from 'src/assets-data/stocks/entities/stocks.entity';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { LocationTransfer } from 'src/location-transfer/entities/location-transfers.entity';
import { AssetMaintenance } from './entities/maintenance.entity';
import { AssetScrap } from './entities/scrap.entity';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { AssetRelationshipHookService } from 'src/asset-mapping/services/asset-relationship-hook.service';
import { AssetProcurementItem } from 'src/assets-data/stocks/entities/asset_procurement_items.entity';
import { AssetProcurement } from 'src/assets-data/stocks/entities/asset_procurements.entity';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { StocksService } from 'src/assets-data/stocks/stocks.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { RedisService } from 'src/common/redis/redis.service';
export declare class ManageAssetService {
    private readonly mailConfigService;
    private readonly mailService;
    private readonly dataSource;
    private readonly redisService;
    private readonly assetEventsService;
    private readonly notificationHelper;
    private readonly userRepository;
    private readonly assetDatumRepo;
    private readonly stockRepo;
    private readonly assetStockSerials;
    private readonly assetMappingRepo;
    private readonly assetMaintenanceRepo;
    private readonly assetScrapRepo;
    private readonly locationTransfer;
    private readonly assetWorkingStatusRepo;
    private readonly assetProcurementItemRepo;
    private readonly assetProcurementRepo;
    private readonly requestContext;
    private readonly stockSummaryRefresh;
    private readonly depViewService;
    private readonly stocksService;
    private readonly assetRelationshipHookService;
    constructor(mailConfigService: MailConfigService, mailService: MailService, dataSource: DataSource, redisService: RedisService, assetEventsService: AssetEventsService, notificationHelper: NotificationHelper, userRepository: Repository<User>, assetDatumRepo: Repository<AssetDatum>, stockRepo: Repository<Stock>, assetStockSerials: Repository<AssetStockSerials>, assetMappingRepo: Repository<AssetMappingRepository>, assetMaintenanceRepo: Repository<AssetMaintenance>, assetScrapRepo: Repository<AssetScrap>, locationTransfer: Repository<LocationTransfer>, assetWorkingStatusRepo: Repository<AssetWorkingStatus>, assetProcurementItemRepo: Repository<AssetProcurementItem>, assetProcurementRepo: Repository<AssetProcurement>, requestContext: RequestContextService, stockSummaryRefresh: StockSummaryRefreshService, depViewService: DepreciationViewService, stocksService: StocksService, assetRelationshipHookService: AssetRelationshipHookService);
    private refreshStockSummaryFromContext;
    getUserByPublicID(public_user_id: number): Promise<number>;
    private generateMaintenanceRefId;
    scheduleMaintenanceByAssetId(assetStockIds: number[], schema: any, userId: number, isSelectAll?: boolean, filters?: any, branchIds?: number[], excludeIds?: number[], expectedCount?: number): Promise<{
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
    invalidateSerials(schema: string): Promise<void>;
    private sendMaintenanceNotificationsAsync;
    getAllMaintenance(dto: ListViewDto): Promise<any>;
    getSingleMaintenance(maintenance_id: number): Promise<any>;
    updateMaintenance(payload: any, schema: any): Promise<any>;
    updateMaintenanceStatus(payload: {
        maintenance_id: number;
        status_id: number;
    }, schema: any): Promise<any>;
    private generateScrapRefId;
    markAssetsForScrapByMappingId(stockIds: number[], userId: number, schema: any, isSelectAll?: boolean, filters?: any, branchIds?: number[], excludeIds?: number[], expectedCount?: number): Promise<{
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
    getAllScrap(dto: ListViewDto): Promise<any>;
    getSingleScrap(scrap_id: number): Promise<any>;
    updateScrap(payload: any & {
        scrap_ids: number[];
    }, schema: any): Promise<any>;
    private sendScrapNotificationsAsync;
    updateScrapStatus(payload: {
        scrap_id: number;
        status_id: number;
        schema?: any;
        login_user_id?: any;
    }): Promise<any>;
    markOverdueMaintenance(schema: any): Promise<any>;
    manageAssetsSidebarCount(branchIds?: number[]): Promise<any>;
    exportMaintenanceToExcel(dto: any): Promise<Buffer>;
    exportScrapToExcel(dto: any): Promise<Buffer>;
}
