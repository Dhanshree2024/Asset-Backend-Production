import { HttpStatus } from '@nestjs/common';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { RedisService } from 'src/common/redis/redis.service';
import { DataSource, Repository } from 'typeorm';
import { Stock } from '../stocks/entities/stocks.entity';
import { CreateAssetOwnershipStatusDto } from './dto/create-asset-ownership-status.dto';
import { DeleteAssetOwnershipStatusDto } from './dto/delete-asset-ownership-status.dto';
import { UpdateAssetOwnershipStatusDto } from './dto/update-asset-ownership-status.dto';
import { AssetOwnershipStatus } from './entities/asset-ownership-status.entity';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
export declare class AssetOwnershipStatusService {
    private readonly dataSource;
    private readonly redisService;
    private assetOwnershipStatusRepository;
    private stocksRepository;
    private readonly dropdownCache;
    constructor(dataSource: DataSource, redisService: RedisService, assetOwnershipStatusRepository: Repository<AssetOwnershipStatus>, stocksRepository: Repository<Stock>, dropdownCache: DropdownCacheService);
    createAssetOwnershipStatus(dto: CreateAssetOwnershipStatusDto): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            ownership_status: AssetOwnershipStatus;
        };
    }>;
    bulkCreateAssetOwnershipStatuses(dtos: CreateAssetOwnershipStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                ownership_status_type_name: string;
                asset_ownership_status_color: string;
                is_active: number;
                is_deleted: number;
            } & AssetOwnershipStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllAssetOwnershipStatuses2(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    }>;
    getAssetOwnershipStatusDropdown(payload: {
        search?: string;
    }): Promise<{
        label: string;
        value: number;
    }[]>;
    getAssetOwnershipStatusById(deleteAssetOwnershipStatusDto: DeleteAssetOwnershipStatusDto): Promise<{
        status: number;
        message: string;
        data: {
            ownershipStatusData: AssetOwnershipStatus;
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateAssetOwnershipStatus(updateAssetOwnershipStatusDto: UpdateAssetOwnershipStatusDto): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            ownership_status: AssetOwnershipStatus;
        };
    }>;
    deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto: DeleteAssetOwnershipStatusDto): Promise<string>;
    disableAssetOwnershipStatus(deleteAssetOwnershipStatusDto: DeleteAssetOwnershipStatusDto): Promise<string>;
    enableAssetOwnershipStatus(dto: DeleteAssetOwnershipStatusDto): Promise<string>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    exportOwnershipStatusesExcel(dto: ListViewDtoForExcleExport): Promise<Buffer>;
}
