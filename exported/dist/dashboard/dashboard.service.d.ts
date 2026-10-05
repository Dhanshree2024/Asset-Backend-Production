import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { RedisService } from 'src/common/redis/redis.service';
import { AssetMaintenance } from 'src/manage-asset/entities/maintenance.entity';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { DataSource, Repository } from 'typeorm';
export declare class DashboardService {
    private readonly assetMappingRepository;
    private readonly departmentRepository;
    private readonly assetmaintenanceRepository;
    private readonly AssetDatumRepository;
    private readonly AssetStockSerialsRepository;
    private readonly dataSource;
    private readonly redisService;
    private readonly stockSummaryRefreshService;
    constructor(assetMappingRepository: Repository<AssetMappingRepository>, departmentRepository: Repository<Department>, assetmaintenanceRepository: Repository<AssetMaintenance>, AssetDatumRepository: Repository<AssetDatum>, AssetStockSerialsRepository: Repository<AssetStockSerials>, dataSource: DataSource, redisService: RedisService, stockSummaryRefreshService: StockSummaryRefreshService);
    refreshDashboard(organizationId: number): Promise<{
        success: boolean;
        message: string;
        refreshedAt: string;
    }>;
    getDashboardCountsFromView(organizationId: number, branchIds?: number[], globalBranchIds?: number[], userId?: number): Promise<any>;
    getDashboardFromView(organizationId: number, branchIds?: number[], globalBranchIds?: number[], userId?: number): Promise<any>;
}
