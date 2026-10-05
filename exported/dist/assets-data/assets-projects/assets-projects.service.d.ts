import { HttpStatus } from '@nestjs/common';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { EntityLookupService } from 'src/organizational-profile/entity-lookup.service';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { DataSource, Repository } from 'typeorm';
import { AssetStockSerials } from '../stocks/entities/asset_stock_serials.entity';
import { CreateProjectDto } from './dto/create-new-project.dto';
import { AssetsProject } from './entities/assets-project.entity';
export declare class AssetsProjectsService {
    private readonly dataSource;
    private readonly EntityLookupService;
    private readonly notificationHelper;
    private readonly redisService;
    private assetsProjectRepo;
    private userRepository;
    private assetStockSerialsRepo;
    private readonly assetMappingRepository;
    private readonly dropdownCache;
    constructor(dataSource: DataSource, EntityLookupService: EntityLookupService, notificationHelper: NotificationHelper, redisService: RedisService, assetsProjectRepo: Repository<AssetsProject>, userRepository: Repository<User>, assetStockSerialsRepo: Repository<AssetStockSerials>, assetMappingRepository: Repository<AssetMappingRepository>, dropdownCache: DropdownCacheService);
    getAllProjects(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    getProjectsDropdown(search?: string): Promise<any[]>;
    generateNextProjectCode(): Promise<string>;
    createNewProject(payload: CreateProjectDto, createdBy: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: {
            project_code: string;
            project_name: string;
            contact_person: string;
            project_email: string;
            department_id: number;
            created_by: number;
            is_active: number;
            is_deleted: number;
        } & AssetsProject;
    }>;
    getProjectById(project_id: number): Promise<{
        project_code: string;
        project_id: number;
        project_name: string;
        contact_person: string;
        project_email: string;
        department_id: number;
        department_name: string;
        is_active: number;
        created_at: Date;
    }>;
    updateProjectById(payload: any, user_id: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        status: number;
        success: boolean;
        message: string;
        data: AssetsProject;
    }>;
    deleteProjects(projectIds: number[], orgId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            deleted: any[];
            failed: any[];
        };
    }>;
    activateProjects(projectIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateProjects(projectIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    generateProjectImportTemplate(): Promise<any>;
    bulkCreateProjects(dtos: any[], organization_Id: number, decrypted_system_user_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    exportProjectsToExcle(dto: ListViewDtoForExcleExport): Promise<Buffer>;
    getUserIdByRegisterLoginId(registerUserLoginId: number): Promise<number>;
    resolveBulkSelectionIds(dto: any): Promise<number[]>;
}
