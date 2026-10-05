import { Request, Response } from 'express';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { Branch } from 'src/organizational-profile/entity/branches.entity';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { Locations } from 'src/organizational-profile/entity/locations.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { OrgStat } from 'src/organizational-profile/entity/orgnization-stats.entity';
import { QrCodeSetting } from 'src/organizational-profile/entity/qr-code-settings.entity';
import { DataSource, Repository } from 'typeorm';
import { AssetCategory } from '../asset-categories/entities/asset-category.entity';
import { AssetFieldCategory } from '../asset-fields/entities/asset-field-category.entity';
import { AssetItem } from '../asset-items/entities/asset-item.entity';
import { AssetOwnershipStatus } from '../asset-ownership-status/entities/asset-ownership-status.entity';
import { AssetSubcategory } from '../asset-subcategories/entities/asset-subcategory.entity';
import { AssetWorkingStatus } from '../asset-working-status/entities/asset-working-status.entity';
import { AssetStockSerials } from '../stocks/entities/asset_stock_serials.entity';
import { Stock } from '../stocks/entities/stocks.entity';
import { CreateAssetDatumDto } from './dto/create-asset-datum.dto';
import { UpdateAssetDatumDto } from './dto/update-asset-datum.dto';
import { AssetDatum } from './entities/asset-datum.entity';
import { Manufacturer } from './entities/manufacturer.entity';
import { Models } from './entities/models.entity';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { LocationBranchMapping } from 'src/organizational-profile/entity/location-branch-mapping.entity';
import { AssetCostCenter } from '../asset-cost-center/entities/asset-cost-center.entity';
import { ItemType } from '../asset-items/entities/asset-item.enums';
import { ItemManufacturer } from '../asset-items/entities/item-manufacturer-map';
import { AssetsProject } from '../assets-projects/entities/assets-project.entity';
import { AssetProcurementItem } from '../stocks/entities/asset_procurement_items.entity';
import { AssetProcurement } from '../stocks/entities/asset_procurements.entity';
import { AssetWarrantyDetailsRepository } from '../stocks/entities/asset_warranty_details.entity';
import { AssetStockSerialsView } from '../stocks/entities/v-asset-stock-serials-view.entity';
export declare class AssetDataService {
    private assetDataRepository;
    private readonly dataSource;
    private readonly assetFieldCategoryRepository;
    private readonly assetCategoryRepository;
    private readonly orgStatRepository;
    private assetMappingRepository;
    private readonly stockRepository;
    private readonly userRepository;
    private readonly assetStockSerialsRepository;
    private readonly assetStockViewRepo;
    private readonly assetProcurementItemRepo;
    private readonly locationBranchMappingRepo;
    private readonly qrCodeSettingRepo;
    private readonly branchRepository;
    private assetItemRepository;
    private subCategoryRepository;
    private readonly departmentRepository;
    private readonly locationRepository;
    private readonly AssetOwnershipRepository;
    private readonly assetWorkingStatusRepository;
    private readonly modelRepository;
    private readonly manufacturerRepository;
    private readonly itemManufacturerRepository;
    private readonly assetCostCenterRepo;
    private readonly assetsProjectRepo;
    private readonly AssetWarrantyDetailsRepository;
    private readonly locationBranchMappingRepository;
    private readonly AssetProcurement;
    private readonly depViewService;
    private readonly notificationHelper;
    private readonly stockSummaryRefresh;
    private readonly dropdownCache;
    constructor(assetDataRepository: Repository<AssetDatum>, dataSource: DataSource, assetFieldCategoryRepository: Repository<AssetFieldCategory>, assetCategoryRepository: Repository<AssetCategory>, orgStatRepository: Repository<OrgStat>, assetMappingRepository: Repository<AssetMappingRepository>, stockRepository: Repository<Stock>, userRepository: Repository<User>, assetStockSerialsRepository: Repository<AssetStockSerials>, assetStockViewRepo: Repository<AssetStockSerialsView>, assetProcurementItemRepo: Repository<AssetProcurementItem>, locationBranchMappingRepo: Repository<LocationBranchMapping>, qrCodeSettingRepo: Repository<QrCodeSetting>, branchRepository: Repository<Branch>, assetItemRepository: Repository<AssetItem>, subCategoryRepository: Repository<AssetSubcategory>, departmentRepository: Repository<Department>, locationRepository: Repository<Locations>, AssetOwnershipRepository: Repository<AssetOwnershipStatus>, assetWorkingStatusRepository: Repository<AssetWorkingStatus>, modelRepository: Repository<Models>, manufacturerRepository: Repository<Manufacturer>, itemManufacturerRepository: Repository<ItemManufacturer>, assetCostCenterRepo: Repository<AssetCostCenter>, assetsProjectRepo: Repository<AssetsProject>, AssetWarrantyDetailsRepository: Repository<AssetWarrantyDetailsRepository>, locationBranchMappingRepository: Repository<LocationBranchMapping>, AssetProcurement: Repository<AssetProcurement>, depViewService: DepreciationViewService, notificationHelper: NotificationHelper, stockSummaryRefresh: StockSummaryRefreshService, dropdownCache: DropdownCacheService);
    private resolveManufacturer;
    private resolveModel;
    addAsset(createAssetDatumDto: CreateAssetDatumDto, organizationId: number, userId: number, schema?: string): Promise<{
        status: string;
        message: string;
        data: any;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    bulkAddAssets(createAssetDatumDtos: CreateAssetDatumDto[], organizationId: number, userId: any): Promise<{
        status: string;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        data: any;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getManufacturerDropdown(itemType?: ItemType, assetItemId?: number): Promise<{
        autoSelected: boolean;
        manufacturer: any;
        dropdown: any[];
    }>;
    getModelByManufacturer(manufacturer_id?: number): Promise<Models[]>;
    filterAssets(filters: any, branchIds?: number[]): Promise<{
        assets: any[];
        users: {
            value: number;
            label: string;
        }[];
        locations: {
            value: string;
            label: string;
            location_floor: string;
            location_room: string;
            branch_name: string;
            location_id: number;
            location_mapping_id: number;
        }[];
        workingStatus: {
            value: string;
            label: string;
        }[];
        ownershipStatus: {
            value: string;
            label: string;
        }[];
        serialNumbers: {
            value: any;
            label: any;
            asset_id: any;
            stock_id: any;
            system_code: any;
        }[];
    }>;
    getFilters(branchIds?: number[]): Promise<{
        users: {
            value: number;
            label: string;
        }[];
        locations: {
            value: string;
            label: string;
            location_floor: string;
            location_room: string;
            branch_name: string;
        }[];
        workingStatus: {
            value: string;
            label: string;
        }[];
        ownershipStatus: {
            value: string;
            label: string;
        }[];
    }>;
    exportFilteredExcelForAssets(data: any[]): Promise<Buffer>;
    exportCSVData(asset_main_category_id: number, asset_sub_category_id: number, asset_item_id: number, searchQuery: string): Promise<{
        decodedResults: AssetDatum[];
        uniqueAssetFields: any[];
    }>;
    countAll(): Promise<{
        totalCount: number;
        unusedCount: number;
        usedCount: number;
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    updateAssetInfo(updateAssetDatumDto: UpdateAssetDatumDto): Promise<AssetDatum>;
    findSingleAsset(asset_id: number, asset_stocks_unique_id: number, stock_id: number, req: any): Promise<{
        asset: AssetDatum;
        stocks: Stock[];
        serialData: {
            procurement: {
                procurement_id: number;
                renewal_status: number;
            };
            asset_stocks_unique_id: number;
            asset_id: number;
            asset_data: AssetDatum;
            stock_id: number;
            stock: Stock;
            location_id?: number;
            location_mapping: LocationBranchMapping;
            asset_item_id?: number;
            asset_item?: AssetItem;
            stock_serials?: string;
            asset_image?: string;
            system_code?: string;
            asset_serial_title?: string;
            information_fields?: string;
            source_device_id?: number;
            discovered_mac?: string;
            impact_status: string;
            impacted_by_serial_id?: number | null;
            impact_reason?: string | null;
            project_id?: number;
            asset_project?: AssetsProject;
            cost_center_id?: number;
            asset_cost_center?: AssetCostCenter;
            procurement_item_id?: number;
            procurement_item?: AssetProcurementItem;
            current_status_id?: number;
            current_status?: import("../asset-fields/entities/asset-status-types.entity").AssetStatusTypes;
            created_at: Date;
            created_by?: number;
            updated_by?: number;
            created_by_user?: User;
            is_active: number;
            is_deleted: number;
            working_status_type_id: number;
            asset_working_status: AssetWorkingStatus;
            asset_mappings: AssetMappingRepository[];
        };
        mapping: {
            mapping_id: number;
            asset_stocks_unique_id: number;
            assigned_by: {
                id: number;
                name: string;
            };
            returned_by: {
                id: number;
                name: string;
            };
            assignment_target: any;
            status: {
                id: number;
                name: string;
            };
            assigned_from_date: Date;
            assigned_to_date: Date;
            created_at: Date;
        };
        fieldsData: string;
        barcode: {
            assetId: string;
            barcode: string;
        }[];
        qrcode: {
            asset_id: number;
            system_code: string;
            qrCode: string;
        }[];
    }>;
    findSingleAssetTopCard(asset_id: number, asset_stocks_unique_id: number, stock_id: number): Promise<{
        asset: AssetDatum;
        stocks: Stock[];
        serialData: AssetStockSerials;
        mapping: {
            mapping_id: number;
            asset_stocks_unique_id: number;
            assigned_by: {
                id: number;
                name: string;
            };
            returned_by: {
                id: number;
                name: string;
            };
            assignment_target: any;
            status: {
                id: number;
                name: string;
            };
            assigned_from_date: Date;
            assigned_to_date: Date;
            created_at: Date;
        };
        purchase_date: Date;
        subscription: any;
    }>;
    findBillingDetails(asset_id: number, asset_stocks_unique_id: number, stock_id: number): Promise<{
        serialData: AssetStockSerials;
        procurements: any;
        warranty: any;
        subscription: any;
    }>;
    updateAssetInformationFields(payload: any[], asset_stocks_unique_id: number): Promise<{
        asset_field_id: any;
        asset_field_category_id: any;
        asset_field_category_name: any;
        asset_field_category_description: any;
        asset_field_name: any;
        asset_field_label_name: any;
        value: any;
    }[]>;
    private assetFields;
    fieldForQRCode(): Promise<{
        id: string;
        name: string;
        required: boolean;
    }[]>;
    generateQRCodes(serials: {
        asset_id: number;
        system_code: string;
    }[], req?: Request, schemaName1?: any): Promise<{
        asset_id: number;
        system_code: string;
        qrCode: string;
    }[]>;
    generateQRCodePdf(serials: {
        asset_id: number;
        system_code: string;
    }[], printOptions: any, req?: Request): Promise<string>;
    generateBarcodesForAssets(assetIds: string[]): Promise<{
        assetId: string;
        barcode: string;
    }[]>;
    generateBarcodePdf(assetIds: string[], printOptions: any): Promise<string>;
    streamBarcodeOrQrPdf(data: {
        type: 'Barcode' | 'QRcode';
        assetIds?: string[];
        serials?: {
            asset_id: number;
            system_code: string;
        }[];
        paperSize: 'A4' | 'A5' | 'Letter';
        size: 'small' | 'medium' | 'large';
    }, res: Response): Promise<void>;
    assetIDGenerateFormula(assetIds: {
        assetId?: number;
        branchId?: number;
        departmentId?: number;
        categoryId?: number;
        subCategoryId?: number;
        itemId?: number;
    }, templateId?: number, lastGeneratedInRequest?: string, organizationID?: any, req?: Request): Promise<string>;
    private formatDate;
    recordMetric(metric: string, value: number): Promise<{
        metric: string;
        value: number;
    } & OrgStat>;
    getWeeklyOverview(): Promise<{}>;
}
