import { HttpStatus } from '@nestjs/common';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { Repository } from 'typeorm';
import { AssetStockSerials } from '../stocks/entities/asset_stock_serials.entity';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { AssetCostCenter } from './entities/asset-cost-center.entity';
export declare class AssetCostCenterService {
    private assetCostCenterRepo;
    private departmentRepo;
    private assetStockSerialsRepository;
    private readonly assetMappingRepository;
    private userRepository;
    private readonly notificationHelper;
    private readonly redisService;
    private readonly dropdownCache;
    constructor(assetCostCenterRepo: Repository<AssetCostCenter>, departmentRepo: Repository<Department>, assetStockSerialsRepository: Repository<AssetStockSerials>, assetMappingRepository: Repository<AssetMappingRepository>, userRepository: Repository<User>, notificationHelper: NotificationHelper, redisService: RedisService, dropdownCache: DropdownCacheService);
    resolveBulkSelectionIds(dto: any): Promise<number[]>;
    private getAllCostCenterIdsForFilters;
    getAllCostCenter2(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    getCostCentersForDropdown(): Promise<{
        status: string;
        message: string;
        data: AssetCostCenter[];
    }>;
    generateNextCode(): Promise<string>;
    getUserIdByRegisterLoginId(registerUserLoginId: number): Promise<number>;
    createNewCostCenter(payload: CreateCostCenterDto, createdBy: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: AssetCostCenter;
    }>;
    updateCostCenterById(payload: UpdateCostCenterDto, user_id: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        status: number;
        success: boolean;
        message: string;
        data: AssetCostCenter;
    }>;
    getCostCenterById(cost_center_id: number): Promise<{
        cost_center_id: number;
        cost_center_name: string;
        cost_center_code: string;
        cost_center_contact_person: string;
        cost_center_email: string;
        department_id: number;
        department_name: string;
        cost_center_manger_name_id: number;
        cost_center_budget: number;
        cost_center_spent: number;
        cost_center_utilization: number;
        is_active: number;
        created_at: Date;
    }>;
    activateCostCenters(dto: any, systemUserId: number): Promise<any>;
    deactivateCostCenters(dto: any, systemUserId: number): Promise<any>;
    deleteCostCenters(dto: any): Promise<any>;
    exportCostCentersToExcel(dto: any): Promise<Buffer>;
    generateCostCenterTemplate(): Promise<Buffer>;
    bulkCreateCostCenters(dtos: any[], organization_Id: number, userId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
}
