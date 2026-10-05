import { HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/dynamic-schema/database.service';
import { DataSource, Repository } from 'typeorm';
import { CreateAssetItemNewDto } from './dto/create-asset-item.dto';
import { DeleteAssetItemDto } from './dto/delete-asset-item.dto';
import { UpdateAssetItemDto } from './dto/update-asset-item.dto';
import { AssetItem } from './entities/asset-item.entity';
import { AssetCategoriesService } from '../asset-categories/asset-categories.service';
import { AssetSubcategoriesService } from '../asset-subcategories/asset-subcategories.service';
import { Request } from 'express';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { EntityLookupService } from 'src/organizational-profile/entity-lookup.service';
import { Locations } from 'src/organizational-profile/entity/locations.entity';
import { OrganizationVendors } from 'src/organizational-profile/entity/organizational-vendors.entity';
import { AssetBlock } from 'src/organizational-profile/public_schema_entity/block_of_assets.entity';
import { AssetCategory } from '../asset-categories/entities/asset-category.entity';
import { AssetDataService } from '../asset-data/asset-data.service';
import { Manufacturer } from '../asset-data/entities/manufacturer.entity';
import { Models } from '../asset-data/entities/models.entity';
import { AssetItemsFieldsMapping } from '../asset-items-fields-mapping/entities/asset-items-fields-mapping.entity';
import { AssetOwnershipStatus } from '../asset-ownership-status/entities/asset-ownership-status.entity';
import { AssetSubcategory } from '../asset-subcategories/entities/asset-subcategory.entity';
import { AssetStockSerials } from '../stocks/entities/asset_stock_serials.entity';
import { StocksService } from '../stocks/stocks.service';
import { WarrantyType } from './entities/asset-item.enums';
import { PolicyAttribute } from 'src/organizational-profile/entity/policy-builder/policy-attribute.entity';
import { SpecialPermissionsMaster } from 'src/organizational-profile/entity/policy-builder/special-permission-master';
export declare class AssetItemsService {
    private readonly dataSource;
    private readonly databaseService;
    private readonly redisService;
    private readonly entityLookupService;
    private readonly assetCategoriesService;
    private readonly assetSubCategoriesService;
    private readonly stocksService;
    private readonly assetDataService;
    private assetItemRepository;
    private categoryepository;
    private subCategoryRepository;
    private readonly serialRepo;
    private readonly AssetItemsFieldsMapping;
    private readonly modelsRepo;
    private readonly manufacturerRepo;
    private readonly vendorsRepo;
    private readonly locationsRepo;
    private readonly ownershipRepo;
    private readonly AssetBlock;
    private readonly depViewService;
    private readonly stockSummaryRefresh;
    private readonly dropdownCache;
    private readonly specialPermissionRepo;
    private readonly policyAttrRepo;
    constructor(dataSource: DataSource, databaseService: DatabaseService, redisService: RedisService, entityLookupService: EntityLookupService, assetCategoriesService: AssetCategoriesService, assetSubCategoriesService: AssetSubcategoriesService, stocksService: StocksService, assetDataService: AssetDataService, assetItemRepository: Repository<AssetItem>, categoryepository: Repository<AssetCategory>, subCategoryRepository: Repository<AssetSubcategory>, serialRepo: Repository<AssetStockSerials>, AssetItemsFieldsMapping: Repository<AssetItemsFieldsMapping>, modelsRepo: Repository<Models>, manufacturerRepo: Repository<Manufacturer>, vendorsRepo: Repository<OrganizationVendors>, locationsRepo: Repository<Locations>, ownershipRepo: Repository<AssetOwnershipStatus>, AssetBlock: Repository<AssetBlock>, depViewService: DepreciationViewService, stockSummaryRefresh: StockSummaryRefreshService, dropdownCache: DropdownCacheService, specialPermissionRepo: Repository<SpecialPermissionsMaster>, policyAttrRepo: Repository<PolicyAttribute>);
    private readonly STATIC_HEADERS;
    private readonly SAMPLE_ROW_TEMPLATE;
    private buildSampleRow;
    generateAssetTemplate(asset_item_id: any, includeSampleRow?: boolean): Promise<{
        buffer: Buffer;
        itemName: string;
    }>;
    getTemplateHeaders(asset_item_id: number): Promise<any>;
    getOrCreateEntityId(entityName: string, repository: any, nameColumn?: string, extraData?: Record<string, any>): Promise<number | null>;
    excelDateToJSDate(value: any): Date | null;
    getSchemaNameFromRequest(req: Request, decryptFn: (value: string) => string, prefix?: string): Promise<string>;
    createAssetAndStock(payload: any[], asset_item_id: number, organizationID: number, userId: number, schema: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            stock_result: {
                message: string;
                data: any[];
                skipped: any[];
                remaining_capacity: number;
            };
            error_records: any[];
        };
    }>;
    invalidateSerials(schema: string): Promise<void>;
    getItemData(payload: {
        search?: string;
        customFilters?: Record<string, string[]>;
    }): Promise<any>;
    activateItems(asset_item_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateItems(asset_item_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    moveItems(asset_item_id: number, main_category_id: number, sub_category_id?: number): Promise<AssetItem>;
    testService(): Promise<string[]>;
    getAllDepreciationItems(): Promise<AssetStockSerials[]>;
    fetchOrganizationAllAssetItems2(dto: ListViewDto, branchIds: number[], userId: number, schema: string): Promise<unknown>;
    exportOrganizationAllAssetItemsExcel(dto: ListViewDtoForExcleExport, branchIds: number[], userId: number, schema: string): Promise<Buffer>;
    fetchAllActiveItems(searchQuery: string, category?: string | string[], subCategory?: string | string[]): Promise<any[]>;
    fetchAllActiveItems2(searchQuery: string, category: string | string[], subCategory: string | string[], branchIds: number[], userId: number, schema: string): Promise<any>;
    exportFilteredExcelForAssetItems({ search, filters, }: {
        search?: string;
        filters?: Record<string, any>;
    }): Promise<Buffer>;
    exportItemsCSV(): Promise<{
        decodedResults: {
            'Item Name': string;
            'Main Category': string;
            'Sub Category': string;
            Description: string;
            'Added By': string | number;
            'Created At': string;
            'Updated At': string;
        }[];
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    createNewAssetItem(dto: CreateAssetItemNewDto, file?: Express.Multer.File, organizationID?: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            user: AssetItem;
        };
    }>;
    private saveItemIcon;
    generateItemTemplate(): Promise<Buffer>;
    bulkCreateItem(dtos: any[], user_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_items: any[];
            error_items: any[];
        };
    }>;
    fetchSingleAssetItemData(deleteAssetItemDto: DeleteAssetItemDto, req?: Request): Promise<{
        status: number;
        message: string;
        data: {
            customFields: {
                asset_field_id: number;
                is_multiple: boolean;
                asset_field_name: string;
                asset_field_description: string;
                asset_field_label_name: string;
                asset_field_type: string;
                asset_field_type_details: string;
                aif_is_mandatory: number;
                is_individual: number;
                is_custom_field: boolean;
                asset_field_category_id: number;
                category: {
                    asset_field_category_id: number;
                    asset_field_category_name: string;
                };
            }[];
            main_category_name: string;
            sub_category_name: string;
            asset_item_id: number;
            main_category_id?: number;
            sub_category_id?: number;
            main_category: AssetCategory;
            sub_category: AssetSubcategory;
            asset_item_name?: string;
            asset_item_description?: string;
            asset_item_icon?: string;
            added_by?: number;
            is_active: number;
            is_deleted: number;
            is_licensable: boolean;
            license_metric?: string;
            upload_documents?: boolean;
            import_barcode?: boolean;
            has_serials?: boolean;
            has_warranty?: boolean;
            item_type?: import("./entities/asset-item.enums").ItemType;
            asset_type?: import("./entities/asset-item.enums").AssetType;
            warranty_type?: WarrantyType[];
            has_depreciation?: boolean;
            company_act_asset_life?: number;
            it_act_asset_life?: number;
            company_depreciation_rate?: number;
            it_act_depreciation_rate?: number;
            company_act_residual_value?: number;
            it_act_residual_value?: number;
            preffered_method?: number;
            created_at?: Date;
            updated_at?: Date;
            is_overallocated: boolean;
            excess: number;
            asset_block: number;
            asset_block_it: number;
            serials: AssetStockSerials[];
            itemManufacturers: import("./entities/item-manufacturer-map").ItemManufacturer[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    fetchSingleItemDataForForm(deleteAssetItemDto: DeleteAssetItemDto, req?: Request): Promise<{
        status: number;
        message: string;
        data: {
            customFields: {
                asset_field_id: number;
                is_multiple: boolean;
                asset_field_name: string;
                asset_field_description: string;
                asset_field_label_name: string;
                asset_field_type: string;
                asset_field_type_details: string;
                aif_is_mandatory: number;
                is_individual: number;
                is_custom_field: boolean;
                aif_sequence: number;
                asset_field_category_id: number;
                category: {
                    asset_field_category_id: number;
                    asset_field_category_name: string;
                };
            }[];
            main_category_name: string;
            sub_category_name: string;
            asset_item_id: number;
            main_category_id?: number;
            sub_category_id?: number;
            main_category: AssetCategory;
            sub_category: AssetSubcategory;
            asset_item_name?: string;
            asset_item_description?: string;
            asset_item_icon?: string;
            added_by?: number;
            is_active: number;
            is_deleted: number;
            is_licensable: boolean;
            license_metric?: string;
            upload_documents?: boolean;
            import_barcode?: boolean;
            has_serials?: boolean;
            has_warranty?: boolean;
            item_type?: import("./entities/asset-item.enums").ItemType;
            asset_type?: import("./entities/asset-item.enums").AssetType;
            warranty_type?: WarrantyType[];
            has_depreciation?: boolean;
            company_act_asset_life?: number;
            it_act_asset_life?: number;
            company_depreciation_rate?: number;
            it_act_depreciation_rate?: number;
            company_act_residual_value?: number;
            it_act_residual_value?: number;
            preffered_method?: number;
            created_at?: Date;
            updated_at?: Date;
            is_overallocated: boolean;
            excess: number;
            asset_block: number;
            asset_block_it: number;
            serials: AssetStockSerials[];
            itemManufacturers: import("./entities/item-manufacturer-map").ItemManufacturer[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    validateLicenseMetricTransition(itemId: number, existingItem: AssetItem, targetMetric: string | null, targetItemType: string, schema?: string): Promise<void>;
    updateItemData(updateAssetItemDto: UpdateAssetItemDto, file?: Express.Multer.File, organizationID?: any, schema?: string): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            item: AssetItem;
        };
    }>;
    bulkDeleteItems(itemIds: number[]): Promise<any>;
    getAssetItemWithRelations(assetItemId: number): Promise<any>;
    getSidebarMenuOption(): Promise<{
        main_category_id: number;
        main_category_name: string;
        main_category_icon: string;
        main_category_children: {
            sub_category_id: number;
            sub_category_name: string;
            sub_category_icon: string;
            sub_category_children: {
                asset_item_id: number;
                name: string;
                asset_item_icon: string;
            }[];
        }[];
    }[]>;
    fetchAssetBlocks(searchQuery?: string): Promise<any>;
    exportAssetItemsExcel(dto: ListViewDtoForExcleExport): Promise<Buffer>;
}
