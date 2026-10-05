import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreateStockDto } from './dto/create-stock.dto';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { AssetEventsService } from 'src/asset-events/asset-events.service';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetTransferHistory } from 'src/asset-mapping/entities/asset_transfer_history.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { RequestContextService } from 'src/common/context/request-context.service';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { ActionCode } from 'src/common/asset-rules/asset-action-rules';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { LocationBranchMapping } from 'src/organizational-profile/entity/location-branch-mapping.entity';
import { Locations } from 'src/organizational-profile/entity/locations.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { OrganizationVendors } from 'src/organizational-profile/entity/organizational-vendors.entity';
import { PolicyAttribute } from 'src/organizational-profile/entity/policy-builder/policy-attribute.entity';
import { SpecialPermissionsMaster } from 'src/organizational-profile/entity/policy-builder/special-permission-master';
import { DataSource, Repository } from 'typeorm';
import { AssetDataService } from '../asset-data/asset-data.service';
import { AssetFieldCategory } from '../asset-fields/entities/asset-field-category.entity';
import { AssetItem } from '../asset-items/entities/asset-item.entity';
import { AssetWorkingStatus } from '../asset-working-status/entities/asset-working-status.entity';
import { ListViewDtoForExcleExport } from './dto/ListViewDtoForExcleExport';
import { UpdateStockBillDto, UpdateSubscriptionDto, UpdateWarrantyDto, UploadBillDocumentDto } from './dto/update-bill.dto';
import { AssetProcurementItem } from './entities/asset_procurement_items.entity';
import { AssetProcurement } from './entities/asset_procurements.entity';
import { AssetSoftwaresView } from './entities/asset_softwares';
import { AssetStockSerials } from './entities/asset_stock_serials.entity';
import { AssetWarrantyDetailsRepository } from './entities/asset_warranty_details.entity';
import { ItemLicenceType } from './entities/item_licence_type.entity';
import { PerpetualSoftwaresView } from './entities/perpetual_softwares';
import { Stock } from './entities/stocks.entity';
import { AssetStockSerialsView } from './entities/v-asset-stock-serials-view.entity';
import { AssetAllStockDetailsView } from './entities/view_asset_stock_details';
import { StockSummaryRefreshService } from './stock-summary-refresh.service';
export declare class StocksService {
    private readonly stockRepository;
    private readonly dataSource;
    private readonly redis;
    private readonly assetEventsService;
    private readonly redisService;
    private readonly assetDataService;
    private readonly assetMappingRepository;
    private readonly userRepo;
    private readonly assetStockSerialsRepository;
    private readonly assetProcurementItemRepository;
    private readonly assetProcurementRepository;
    private readonly assetWarrantyDetailsRepository;
    private readonly AssetTransferHistory;
    private readonly assetRepository;
    private readonly vendorRepository;
    private readonly licenceRepo;
    private readonly AssetItem;
    private readonly viewRepo;
    private readonly locationsRepo;
    private readonly assetFieldCategoryRepository;
    private readonly stockViewRepo;
    private readonly softwareViewRepo;
    private readonly perpetualSoftwareRepo;
    private readonly AssetProcurement;
    private readonly specialPermissionRepo;
    private readonly policyAttrRepo;
    private readonly notificationHelper;
    private readonly depViewService;
    private readonly stockSummaryRefresh;
    private readonly requestContext;
    private readonly dropdownCache;
    constructor(stockRepository: Repository<Stock>, dataSource: DataSource, redis: RedisService, assetEventsService: AssetEventsService, redisService: RedisService, assetDataService: AssetDataService, assetMappingRepository: Repository<AssetMappingRepository>, userRepo: Repository<User>, assetStockSerialsRepository: Repository<AssetStockSerials>, assetProcurementItemRepository: Repository<AssetProcurementItem>, assetProcurementRepository: Repository<AssetProcurement>, assetWarrantyDetailsRepository: Repository<AssetWarrantyDetailsRepository>, AssetTransferHistory: Repository<AssetTransferHistory>, assetRepository: Repository<AssetDatum>, vendorRepository: Repository<OrganizationVendors>, licenceRepo: Repository<ItemLicenceType>, AssetItem: Repository<AssetItem>, viewRepo: Repository<AssetStockSerialsView>, locationsRepo: Repository<Locations>, assetFieldCategoryRepository: Repository<AssetFieldCategory>, stockViewRepo: Repository<AssetAllStockDetailsView>, softwareViewRepo: Repository<AssetSoftwaresView>, perpetualSoftwareRepo: Repository<PerpetualSoftwaresView>, AssetProcurement: Repository<AssetProcurement>, specialPermissionRepo: Repository<SpecialPermissionsMaster>, policyAttrRepo: Repository<PolicyAttribute>, notificationHelper: NotificationHelper, depViewService: DepreciationViewService, stockSummaryRefresh: StockSummaryRefreshService, requestContext: RequestContextService, dropdownCache: DropdownCacheService);
    private scheduleStockRefreshFromContext;
    private resolveSchemaFromContext;
    invalidateSerials(schema: string): Promise<void>;
    private generateSystemCodes;
    createStocks(createStockDto: CreateStockDto, organizationID: any, schema: any, req: Request): Promise<{
        asset_id: number;
        stock_id: number;
        quantity: number;
        message?: string;
    }>;
    private refreshStockSummaryFromContext;
    exportFilteredExcelForStocks(data: any[]): Promise<Buffer>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    getUserIdByRegisterLoginId(registerUserLoginId: number): Promise<number>;
    updateAssetDetails(payload: any): Promise<any>;
    validateSerialOrLicense(serial?: string, license?: string): Promise<{
        isDuplicate: boolean;
    }>;
    findAllSerials2(dto: ListViewDto, userId: number, branchIds: number[], schema: string): Promise<any>;
    bulkCreateStocks(createStockDtos: CreateStockDto[], organizationID: any, userId: any, schema: any, req: Request): Promise<{
        message: string;
        data: any[];
        skipped: any[];
        remaining_capacity: number;
    }>;
    selectionPreflight(body: {
        action: ActionCode;
        isSelectAll?: boolean;
        filters?: any;
        excludeIds?: number[];
        ids?: number[];
        expectedCount?: number;
        blockedPage?: number;
        blockedLimit?: number;
        scope?: 'blocked' | 'all' | 'eligible';
    }, userId: number, branchIds: number[], schema: string): Promise<{
        success: boolean;
        action: ActionCode;
        totalMatched: number;
        eligibleCount: number;
        blockedCount: number;
        driftDetected: boolean;
        summary: any[];
        blocked: {
            page: number;
            limit: number;
            total: number;
            rows: any[];
        };
        rows: {
            page: number;
            limit: number;
            total: number;
            scope: "all" | "blocked" | "eligible";
            rows: any[];
            totalPages?: undefined;
        };
        stats: {
            assignedCount: number;
            unassignedCount: number;
            softwareCount: number;
            assetCount: number;
            allAssigned: boolean;
            allUnassigned: boolean;
            isMixedAssignment: boolean;
            allSoftware: boolean;
            allAsset: boolean;
            isMixedKind: boolean;
        };
        relationshipImpact?: undefined;
        expectedCount?: undefined;
    } | {
        success: boolean;
        action: ActionCode;
        totalMatched: number;
        eligibleCount: number;
        blockedCount: number;
        rows: {
            page: number;
            limit: number;
            scope: "all" | "blocked" | "eligible";
            total: number;
            totalPages: number;
            rows: {
                asset_stocks_unique_id: any;
                system_code: any;
                stock_serials: any;
                asset_id: any;
                asset_title: any;
                asset_item_name: any;
                main_category: any;
                sub_category: any;
                item_name: any;
                asset_main_category_name: any;
                asset_sub_category_name: any;
                asset_status_type_id: any;
                asset_status_type_name: any;
                asset_status_for_category: any;
                current_status_id: any;
                current_status_name: any;
                working_status_type_id: any;
                working_status_type_name: any;
                working_status_name: any;
                asset_used_by: any;
                assigned_to_name: any;
                displayname: any;
                mapping_id: any;
                target_type: any;
                target_id: any;
                is_software: any;
                location_name: any;
                license_metric: any;
                item_type: any;
                eligible: boolean;
                ruleCode: any;
                reason: string;
                remediable: boolean;
            }[];
        };
        stats: {
            assignedCount: number;
            unassignedCount: number;
            softwareCount: number;
            assetCount: number;
            allAssigned: boolean;
            allUnassigned: boolean;
            isMixedAssignment: boolean;
            allSoftware: boolean;
            allAsset: boolean;
            isMixedKind: boolean;
        };
        relationshipImpact: {
            hasImpact: boolean;
            hosting: {
                hostServerCount: number;
                totalGuestVmsCount: number;
                hosts: any[];
            };
            software: {
                deviceCount: number;
                totalSoftwareCount: number;
                devices: any[];
            };
        };
        driftDetected: boolean;
        expectedCount: number;
        summary: {
            ruleCode: string;
            label: string;
            count: number;
            remediable: boolean;
        }[];
        blocked: {
            page: number;
            limit: number;
            total: number;
            rows: {
                asset_stocks_unique_id: any;
                system_code: any;
                asset_title: any;
                asset_item_name: any;
                current_status_id: any;
                current_status_name: any;
                working_status_type_id: any;
                working_status_name: any;
                assigned_to_name: any;
                location_name: any;
                license_metric: any;
                item_type: any;
                ruleCode: any;
                reason: string;
                remediable: boolean;
            }[];
        };
    }>;
    resolveSelectionIds(body: {
        action: ActionCode;
        isSelectAll?: boolean;
        filters?: any;
        excludeIds?: number[];
        ids?: number[];
        expectedCount?: number;
    }, userId: number, branchIds: number[], schema: string): Promise<{
        success: boolean;
        action: ActionCode;
        totalMatched: number;
        eligibleCount: number;
        blockedCount: number;
        driftDetected: boolean;
        summary: any[];
        blocked: {
            page: number;
            limit: number;
            total: number;
            rows: any[];
        };
        rows: {
            page: number;
            limit: number;
            total: number;
            scope: "all" | "blocked" | "eligible";
            rows: any[];
            totalPages?: undefined;
        };
        stats: {
            assignedCount: number;
            unassignedCount: number;
            softwareCount: number;
            assetCount: number;
            allAssigned: boolean;
            allUnassigned: boolean;
            isMixedAssignment: boolean;
            allSoftware: boolean;
            allAsset: boolean;
            isMixedKind: boolean;
        };
        relationshipImpact?: undefined;
        expectedCount?: undefined;
    } | {
        success: boolean;
        action: ActionCode;
        totalMatched: number;
        eligibleCount: number;
        blockedCount: number;
        rows: {
            page: number;
            limit: number;
            scope: "all" | "blocked" | "eligible";
            total: number;
            totalPages: number;
            rows: {
                asset_stocks_unique_id: any;
                system_code: any;
                stock_serials: any;
                asset_id: any;
                asset_title: any;
                asset_item_name: any;
                main_category: any;
                sub_category: any;
                item_name: any;
                asset_main_category_name: any;
                asset_sub_category_name: any;
                asset_status_type_id: any;
                asset_status_type_name: any;
                asset_status_for_category: any;
                current_status_id: any;
                current_status_name: any;
                working_status_type_id: any;
                working_status_type_name: any;
                working_status_name: any;
                asset_used_by: any;
                assigned_to_name: any;
                displayname: any;
                mapping_id: any;
                target_type: any;
                target_id: any;
                is_software: any;
                location_name: any;
                license_metric: any;
                item_type: any;
                eligible: boolean;
                ruleCode: any;
                reason: string;
                remediable: boolean;
            }[];
        };
        stats: {
            assignedCount: number;
            unassignedCount: number;
            softwareCount: number;
            assetCount: number;
            allAssigned: boolean;
            allUnassigned: boolean;
            isMixedAssignment: boolean;
            allSoftware: boolean;
            allAsset: boolean;
            isMixedKind: boolean;
        };
        relationshipImpact: {
            hasImpact: boolean;
            hosting: {
                hostServerCount: number;
                totalGuestVmsCount: number;
                hosts: any[];
            };
            software: {
                deviceCount: number;
                totalSoftwareCount: number;
                devices: any[];
            };
        };
        driftDetected: boolean;
        expectedCount: number;
        summary: {
            ruleCode: string;
            label: string;
            count: number;
            remediable: boolean;
        }[];
        blocked: {
            page: number;
            limit: number;
            total: number;
            rows: {
                asset_stocks_unique_id: any;
                system_code: any;
                asset_title: any;
                asset_item_name: any;
                current_status_id: any;
                current_status_name: any;
                working_status_type_id: any;
                working_status_name: any;
                assigned_to_name: any;
                location_name: any;
                license_metric: any;
                item_type: any;
                ruleCode: any;
                reason: string;
                remediable: boolean;
            }[];
        };
    } | {
        success: boolean;
        action: ActionCode;
        totalMatched: number;
        eligibleCount: number;
        blockedCount: number;
        driftDetected: boolean;
        summary: any[] | {
            ruleCode: string;
            label: string;
            count: number;
            remediable: boolean;
        }[];
        ids: any[];
        rows: any[];
    }>;
    exportAssetsToExcel(dto: ListViewDtoForExcleExport, userId: number, branchIds: number[], schema: string): Promise<Buffer>;
    getAllStocksFromDto(dto: ListViewDto, branchIds: number[], userId: number, schema: string): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    }>;
    exportStocks(dto: ListViewDtoForExcleExport, branchIds: number[], userId: number, schema: string): Promise<Buffer>;
    exportSoftwares(dto: ListViewDtoForExcleExport, branchIds?: number[]): Promise<Buffer>;
    exportAssetItemFullDetails(asset_item_id: number, type: 'ALL' | 'ASSIGNED' | 'INSTOCK' | 'SCRAP', sortField?: string, sortDirection?: 'ASC' | 'DESC', locationFilter?: any[], branchIds?: number[], selectedIds?: number[], isSelectAll?: boolean, excludeIds?: number[]): Promise<Buffer>;
    getAllSoftwares(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    getAllPerpetualSoftwares(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    exportPerpetualSoftwares(dto: ListViewDto, branchIds?: number[]): Promise<Buffer>;
    findSingleAsset(asset_id: number, asset_stocks_unique_id: number): Promise<{
        asset: AssetDatum;
        stocks: any[];
        serials: AssetStockSerials;
        fieldsData: string;
        procurement: any;
    }>;
    assetsForMapping(branchIds?: number[]): Promise<any[]>;
    getAssetItemFullDetails(asset_item_id: number, type: 'ALL' | 'ASSIGNED' | 'INSTOCK' | 'SCRAP', page?: number, limit?: number, sortField?: string, sortDirection?: 'ASC' | 'DESC', locationFilter?: any[], branchIds?: number[], cursor?: string | null, direction?: 'next' | 'prev', isLastPageMode?: boolean, knownTotal?: number | null): Promise<{
        success: boolean;
        asset_item_id: number;
        counts: {
            total_assets: any;
            total_assigned: any;
            total_instock: any;
            total_scrap: any;
        };
        data: any[];
        meta: any;
    }>;
    getSoftwareDetails(type: 'ALL' | 'ASSIGNED' | 'INSTOCK', limit?: number, cursor?: any, isLastPageMode?: boolean, sortField?: string, sortDirection?: 'ASC' | 'DESC', locationFilter?: any[], branchIds?: number[], purchase_date?: string, asset_item_id?: number, direction?: 'next' | 'prev', knownTotal?: number | null, page?: number): Promise<{
        success: boolean;
        asset_item_id: number;
        counts: {
            total_assets: any;
            total_assigned: any;
            total_instock: any;
            total_scrap: any;
        };
        data: any;
        meta: any;
    }>;
    getSoftwareDetailsByProcurement(type: 'ALL' | 'ASSIGNED' | 'INSTOCK', limit?: number, cursor?: any, isLastPageMode?: boolean, sortField?: string, sortDirection?: 'ASC' | 'DESC', locationFilter?: any[], branchIds?: number[], purchase_date?: string, procurement_id?: number, direction?: 'next' | 'prev', knownTotal?: number | null, page?: number): Promise<{
        success: boolean;
        procurement_id: number;
        counts: {
            total_assets: any;
            total_assigned: any;
            total_instock: any;
            total_scrap: any;
        };
        data: any;
        meta: any;
    }>;
    exportSoftwareProcurementExcel(dto: any, branchIds?: number[]): Promise<Buffer>;
    getAllLinkedProcurementIds(procurementId: number): Promise<number[]>;
    getSoftwareListViewByPurchaseDate(asset_item_id: number, page?: number, limit?: number, sortField?: string, sortDirection?: 'ASC' | 'DESC', locationFilter?: any[], branchIds?: number[], procurement_id?: number, filterType?: 'ALL' | 'CURRENT' | 'HISTORY', cursor?: any, isLastPageMode?: boolean, direction?: 'next' | 'prev', knownTotal?: number | null): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
            count: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            startCursor: string;
            endCursor: string;
            nextCursor: string;
            prevCursor: string;
        };
    }>;
    updateAssetImage(serialId: number, file: Express.Multer.File, login_user_id: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            asset_image: string;
        };
    }>;
    markProcurementForRenewal(procurement_id: number, login_user_id: number, schema: any): Promise<{
        success: boolean;
    }>;
    getRenewalSoftwares(dto: ListViewDto, branchIds?: number[]): Promise<any>;
    exportRenewalSoftwares(dto: any, branchIds?: number[]): Promise<any>;
    approveRenewal(procurementId: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelRenewal(procurementId: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    findByProcurement(procurement_id: number, asset_item_id: number): Promise<{
        asset: AssetDatum;
        stocks: Stock[];
        chain: {
            procurement_id: number;
            procurement: AssetProcurement;
            procurement_items: AssetProcurementItem[];
            serials: {
                procurement_item: AssetProcurementItem;
                procurement: AssetProcurement;
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
                asset_project?: import("../assets-projects/entities/assets-project.entity").AssetsProject;
                cost_center_id?: number;
                asset_cost_center?: import("../asset-cost-center/entities/asset-cost-center.entity").AssetCostCenter;
                procurement_item_id?: number;
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
            }[];
        };
        serials: {
            procurement_item: AssetProcurementItem;
            procurement: AssetProcurement;
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
            asset_project?: import("../assets-projects/entities/assets-project.entity").AssetsProject;
            cost_center_id?: number;
            asset_cost_center?: import("../asset-cost-center/entities/asset-cost-center.entity").AssetCostCenter;
            procurement_item_id?: number;
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
        }[];
        assigned_quantity: number;
        procurement_id: number;
    }>;
    createRenewal(procurementId: number, asset_item_id: number, formData: any, userId: number, isProrata: boolean, decrypted_organizationID: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    createProrataStock(procurementId: number, asset_item_id: number, formData: any, userId: number, decrypted_organizationID: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    createNormalRenewal(procurementId: number, asset_item_id: number, formData: any, userId: number): Promise<{
        success: boolean;
        message: string;
        procurement_id: number;
        procurement_item_id: number;
    }>;
    private toNumberOrNull;
    getRenewalHistory(asset_item_id: number, procurement_id?: number): Promise<{
        history: any[];
    }>;
    getBillEditDetails(procurement_item_id: number, branchIds: number[]): Promise<{
        procurement_item_id: number;
        procurement_id: number;
        asset_details: {
            asset_id: number;
            asset_title: any;
            main_category_name: any;
            sub_category_name: any;
            manufacturer_name: any;
            model_name: any;
            location_id: number;
        };
        billing_details: {
            quantity: number;
            vendor_id: number;
            vendor_name: any;
            bill_no: any;
            invoice_no: any;
            purchase_date: any;
            unit_price: number;
            gst_percent: number;
            gst_amount: number;
            total_without_gst: number;
            total_amount: number;
            ownership_status_id: number;
            ownership_status_name: any;
            documents: any;
            subscription_type: any;
            billing_frequency: any;
            sub_start_date: any;
            next_renewal_date: any;
        };
        serial_summary: {
            total_serials: number;
            assigned_serials: number;
            removable_serials: number;
        };
        serials: any[];
    }>;
    updateStockBill(dto: UpdateStockBillDto, organizationID: any): Promise<{
        message: string;
        procurement_id: number;
        procurement_item_id: number;
        is_serial_tracked: boolean;
        serials_removed: number;
        serials_added: number;
        stock_quantity: number;
        changes_logged: string[];
        updated_by: number;
    }>;
    uploadBillDocument(dto: UploadBillDocumentDto, files: Express.Multer.File[], userId: number, organizationID: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            documents: {
                name: string;
                path: string;
                size: number;
                type: string;
                uploadedDate: Date;
            }[];
        };
    }>;
    updateWarranty(dto: UpdateWarrantyDto, organizationID: any): Promise<{
        message: string;
        asset_stocks_unique_id: number;
        changes_logged: any[];
        updated_by?: undefined;
    } | {
        message: string;
        asset_stocks_unique_id: number;
        changes_logged: string[];
        updated_by: number;
    }>;
    updateSubscription(dto: UpdateSubscriptionDto, organizationID: any): Promise<{
        message: string;
        procurement_id: number;
        changes_logged: any[];
        asset_stocks_unique_id?: undefined;
        updated_by?: undefined;
    } | {
        message: string;
        procurement_id: number;
        asset_stocks_unique_id: number;
        changes_logged: string[];
        updated_by: number;
    }>;
    deleteAssetImage(serialId: number, login_user_id: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            asset_image: any;
        };
    }>;
}
