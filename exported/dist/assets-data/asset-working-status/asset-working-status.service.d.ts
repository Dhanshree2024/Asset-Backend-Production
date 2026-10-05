import { HttpStatus } from '@nestjs/common';
import { CreateAssetWorkingStatusDto } from './dto/create-asset-working-status.dto';
import { UpdateAssetWorkingStatusDto } from './dto/update-asset-working-status.dto';
import { DeleteAssetWorkingStatusDto } from './dto/delete-asset-working-status.dto';
import { AssetWorkingStatus } from './entities/asset-working-status.entity';
import { DataSource, Repository } from 'typeorm';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { RedisService } from 'src/common/redis/redis.service';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
export declare class AssetWorkingStatusService {
    private readonly dataSource;
    private assetWorkingStatusRepository;
    private readonly redisService;
    private readonly dropdownCache;
    constructor(dataSource: DataSource, assetWorkingStatusRepository: Repository<AssetWorkingStatus>, redisService: RedisService, dropdownCache: DropdownCacheService);
    createNewAssetWorkingStatus(dto: CreateAssetWorkingStatusDto): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            status: AssetWorkingStatus;
        };
    }>;
    bulkCreateAssetWorkingStatuses(dtos: CreateAssetWorkingStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                working_status_type_name: string;
                working_status_color: string;
                is_active: number;
                is_deleted: number;
            } & AssetWorkingStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllWorkingStatuses2(dto: ListViewDto): Promise<unknown>;
    getWorkingStatusesDropdown(search: string): Promise<{
        working_status_type_id: number;
        working_status_type_name: string;
    }[]>;
    fetchSingleAssetWorkingStatusData(deleteAssetWorkingStatusDto: DeleteAssetWorkingStatusDto): Promise<{
        status: number;
        message: string;
        data: {
            statusData: AssetWorkingStatus;
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateWorkingStatusData(updateAssetWorkingStatusDto: UpdateAssetWorkingStatusDto): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            status: AssetWorkingStatus;
        };
    }>;
    deleteWorkingStatusData(dto: DeleteAssetWorkingStatusDto): Promise<string>;
    disableWorkingStatusData(dto: DeleteAssetWorkingStatusDto): Promise<string>;
    enableWorkingStatusData(dto: DeleteAssetWorkingStatusDto): Promise<string>;
    getMaintenanceWorkingStatusesDropdown(search: string): Promise<{
        working_status_type_id: number;
        working_status_type_name: string;
        color_code: string;
    }[]>;
    getAssetTranferLocationWorkingStatusesDropdown(search: string): Promise<{
        working_status_type_id: number;
        working_status_type_name: string;
        color_code: string;
    }[]>;
    fetchScrapWorkingStatusDropdown(search: string): Promise<{
        working_status_type_id: number;
        working_status_type_name: string;
        color_code: string;
    }[]>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    exportWorkingStatusesExcel(dto: ListViewDtoForExcleExport): Promise<Buffer>;
}
