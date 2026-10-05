import { HttpStatus } from '@nestjs/common';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { RedisService } from 'src/common/redis/redis.service';
import { DataSource, Repository } from 'typeorm';
import { CreateAssetsStatusDto } from './dto/create-assets-status.dto';
import { DeleteAssetsStatusDto } from "./dto/delete-assets-status.dto";
import { UpdateAssetsStatusDto } from './dto/update-assets-status.dto';
import { AssetsStatus } from './entities/assets-status.entity';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
export declare class AssetsStatusService {
    private assetsStatusRepository;
    private readonly dataSource;
    private readonly redisService;
    private readonly dropdownCache;
    constructor(assetsStatusRepository: Repository<AssetsStatus>, dataSource: DataSource, redisService: RedisService, dropdownCache: DropdownCacheService);
    createNewAssetStatus(dto: CreateAssetsStatusDto): Promise<{
        status: number;
        message: string;
        data: AssetsStatus;
    }>;
    bulkCreateAssetStatuses(dtos: CreateAssetsStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                status_type_name: string;
                status_color_code: string;
                is_active: number;
                is_deleted: number;
            } & AssetsStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllStatuses2(dto: ListViewDto): Promise<unknown>;
    getStatusTypesFilter(): Promise<AssetsStatus[]>;
    fetchSingleAssetStatusData(deleteAssetStatusDto: DeleteAssetsStatusDto): Promise<{
        status: number;
        message: string;
        data: {
            statusData: AssetsStatus;
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateStatusData(updateAssetStatusDto: UpdateAssetsStatusDto): Promise<{
        status: number;
        message: string;
        data: {
            status: AssetsStatus;
        };
    }>;
    deleteStatusData(deleteAssetStatusDto: any): Promise<string>;
    disableStatusData(dto: DeleteAssetsStatusDto): Promise<string>;
    enableStatusData(dto: DeleteAssetsStatusDto): Promise<string>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    exportAssetStatusesExcel(dto: ListViewDtoForExcleExport): Promise<Buffer>;
}
