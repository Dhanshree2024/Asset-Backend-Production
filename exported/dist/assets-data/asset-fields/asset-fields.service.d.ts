import { HttpStatus } from '@nestjs/common';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { RedisService } from 'src/common/redis/redis.service';
import { DataSource, Repository } from 'typeorm';
import { AssetDatum } from '../asset-data/entities/asset-datum.entity';
import { AssetStockSerials } from '../stocks/entities/asset_stock_serials.entity';
import { CreateAssetFieldDto } from './dto/create-asset-field.dto';
import { DeleteAssetFieldDto } from './dto/delete-asset-field.dto';
import { UpdateAssetFieldDto } from './dto/update-asset-field.dto';
import { AssetFieldCategory } from './entities/asset-field-category.entity';
import { AssetField } from './entities/asset-field.entity';
import { AssetOwnershipStatusTypes } from './entities/asset-ownership-status-types.entity';
import { AssetStatusTypes } from './entities/asset-status-types.entity';
import { AssetWorkingStatusTypes } from './entities/asset-working-status-types.entity';
import { AssetItemsFieldsMapping } from '../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity';
export declare class AssetFieldsService {
    private assetFieldRepository;
    private readonly dataSource;
    private readonly redisService;
    private assetStatusTypeRepository;
    private assetWorkingStatusTypeRepository;
    private assetOwnershipStatusTypeRepository;
    private assetFieldCategoryRepository;
    private assetRepository;
    private readonly assetItemsFieldsMappingRepository;
    private AssetStockSerialsRepository;
    constructor(assetFieldRepository: Repository<AssetField>, dataSource: DataSource, redisService: RedisService, assetStatusTypeRepository: Repository<AssetStatusTypes>, assetWorkingStatusTypeRepository: Repository<AssetWorkingStatusTypes>, assetOwnershipStatusTypeRepository: Repository<AssetOwnershipStatusTypes>, assetFieldCategoryRepository: Repository<AssetFieldCategory>, assetRepository: Repository<AssetDatum>, assetItemsFieldsMappingRepository: Repository<AssetItemsFieldsMapping>, AssetStockSerialsRepository: Repository<AssetStockSerials>);
    create(createAssetFieldDto: CreateAssetFieldDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: CreateAssetFieldDto & AssetField;
    }>;
    findAllFieldCategories(): Promise<AssetFieldCategory[]>;
    getAssetStatusTypes(): Promise<AssetStatusTypes[]>;
    getAssetWorkingStatusType(): Promise<AssetWorkingStatusTypes[]>;
    getAssetOwnershipStatusType(): Promise<AssetOwnershipStatusTypes[]>;
    findAll(): Promise<AssetField[]>;
    countAll(): Promise<number>;
    fetchSingleFieldData(deleteAssetFieldDto: DeleteAssetFieldDto): Promise<{
        status: number;
        message: string;
        data: {
            fieldData: AssetField;
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getDefaultAssetFields(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    }>;
    getDefaultAssetFieldsDropdown(): Promise<AssetField[]>;
    getCustomAssetFieldsDropdown(): Promise<AssetField[]>;
    getCustomAssetFields(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    }>;
    getAssetFieldsDropdown(search?: string): Promise<{
        customFields: AssetField[];
        defaultFields: AssetField[];
    }>;
    exportFilteredExcelForAssetFields({ search, filters, }: {
        search?: string;
        filters?: Record<string, any>;
    }): Promise<Buffer>;
    getAssetFieldCategoryDropdown(): Promise<{
        label: string;
    }[]>;
    deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto: DeleteAssetFieldDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    activateFields(asset_field_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateFields(asset_field_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    getFieldById(id: number): Promise<{
        success: boolean;
        message: string;
        data: AssetField;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    updateField(id: number, updateDto: UpdateAssetFieldDto): Promise<{
        success: boolean;
        message: string;
        data: AssetField;
    }>;
    exportAssetFieldsExcel(dto: ListViewDtoForExcleExport, isCustomField?: boolean): Promise<Buffer>;
}
