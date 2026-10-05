import { Repository } from 'typeorm';
import { AssetDepreciationViewEntity } from './entities/asset-depreciation-view.entity';
import { BlockReportDto, DepreciationExportDto, SerialDepreciationDto } from './dto/depreciation-serial.dto';
import { DataSource } from 'typeorm';
import { RedisService } from 'src/common/redis/redis.service';
export declare class DepreciationViewService {
    private readonly dataSource;
    private readonly redis;
    private pendingRefresh;
    private refreshInFlight;
    private readonly DEBOUNCE_MS;
    constructor(dataSource: DataSource, redis: RedisService);
    private resolveSchema;
    scheduleRefresh(organizationId: number): Promise<void>;
    forceRefreshNow(organizationId: number): Promise<void>;
    private runRefresh;
}
export declare class AssetDepreciationService {
    private readonly depView;
    constructor(depView: Repository<AssetDepreciationViewEntity>);
    getAllSerials(payload: {
        limit?: number;
        pagination?: {
            limit?: number;
        };
        search?: string;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
        filters?: Record<string, any[]>;
        cursor?: any;
        direction?: 'next' | 'prev';
        page?: number;
        jumpToLast?: boolean;
        isLastPageMode?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: SerialDepreciationDto[];
        meta: any;
    }>;
    getSerialById(serialId: number): Promise<SerialDepreciationDto>;
    private currentFyLabel;
    getBlockWiseReport(fy?: string): Promise<BlockReportDto[]>;
    getBlockAssets(fy: string, blockIds: number[], expandBlockIds: number[], actType?: 'it' | 'company', search?: string): Promise<any[]>;
    exportDepreciationExcel(dto: DepreciationExportDto): Promise<Buffer>;
    exportBlockReportExcel(fy: string, blockIds: number[], actType: 'it' | 'company', search: string): Promise<Buffer>;
}
