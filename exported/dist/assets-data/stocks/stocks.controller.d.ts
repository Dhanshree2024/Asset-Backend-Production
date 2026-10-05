import { HttpStatus } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { StocksService } from './stocks.service';
import { Request, Response } from 'express';
import { AssetMappingService } from 'src/asset-mapping/asset-mapping.service';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { ListViewDtoForExcleExport } from './dto/ListViewDtoForExcleExport';
import { UpdateSubscriptionDto, UpdateWarrantyDto } from './dto/update-bill.dto';
import { StockSummaryRefreshService } from './stock-summary-refresh.service';
export declare class StocksController {
    private readonly stockService;
    private readonly assetMappingService;
    private readonly redisService;
    private readonly stockSummaryRefresh;
    constructor(stockService: StocksService, assetMappingService: AssetMappingService, redisService: RedisService, stockSummaryRefresh: StockSummaryRefreshService);
    createStocks(files: Express.Multer.File[], createStockDto: CreateStockDto, req: Request): Promise<{
        asset_id: number;
        stock_id: number;
        quantity: number;
        message?: string;
    }>;
    updateAssetTitleProjectCostCenter(body: any, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    validateSerialOrLicense(serial?: string, license?: string): Promise<{
        isDuplicate: boolean;
    }>;
    selectionPreflight(body: any, req: any): Promise<{
        success: boolean;
        action: import("../../common/asset-rules/asset-action-rules").ActionCode;
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
        action: import("../../common/asset-rules/asset-action-rules").ActionCode;
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
        message: any;
    }>;
    selectionResolveIds(body: any, req: any): Promise<{
        success: boolean;
        action: import("../../common/asset-rules/asset-action-rules").ActionCode;
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
        action: import("../../common/asset-rules/asset-action-rules").ActionCode;
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
        action: import("../../common/asset-rules/asset-action-rules").ActionCode;
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
    findAllSerials2(dto: ListViewDto, req: any): Promise<any>;
    exportAssetsToExcel(res: Response, dto: ListViewDtoForExcleExport, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllStocks(dto: ListViewDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    exportStocks(res: Response, dto: ListViewDtoForExcleExport, req: any): Promise<{
        success: boolean;
        message: string;
        error: any;
    }>;
    exportSoftwares(res: Response, dto: ListViewDtoForExcleExport, req: any): Promise<Response<any, Record<string, any>>>;
    exportSoftwareProcurementExcel(res: Response, dto: any, req: any): Promise<void>;
    getAllSoftwares(dto: ListViewDto, req: any): Promise<unknown>;
    getAllPerpetualSoftwares(dto: ListViewDto, req: any): Promise<unknown>;
    exportPerpetualSoftwares(res: Response, dto: ListViewDto, req: any): Promise<Response<any, Record<string, any>>>;
    getSingleStockDetails(asset_id: number, asset_stocks_unique_id: number): Promise<{
        status: boolean;
        message: string;
        data: {
            asset: import("../asset-data/entities/asset-datum.entity").AssetDatum;
            stocks: any[];
            serials: import("./entities/asset_stock_serials.entity").AssetStockSerials;
            fieldsData: string;
            procurement: any;
        };
    }>;
    assetsForMapping(req: any): Promise<any[]>;
    getAssetItemFullDetails(dto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    exportAssetItemDetailsExcel(res: Response, dto: any, req: any): Promise<void>;
    getSoftwareDetails(dto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getSoftwareDetailsByProcurement(dto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    exportSoftwareProcurement(res: Response, dto: any): Promise<void>;
    getSoftwareListView(dto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    uploadAssetImage(file: Express.Multer.File, serial_id: number, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    markProcurementRenewal(body: {
        procurement_id: number;
    }, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    getRenewalSoftwares(dto: ListViewDto, req: any): Promise<any>;
    exportRenewalSoftwares(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    approveRenewal(body: {
        procurement_id: number;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelRenewal(body: {
        procurement_id: number;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getDetailsByProcurement(procurement_id: number, asset_item_id: number): Promise<{
        status: boolean;
        message: string;
        data: {
            asset: import("../asset-data/entities/asset-datum.entity").AssetDatum;
            stocks: import("./entities/stocks.entity").Stock[];
            chain: {
                procurement_id: number;
                procurement: import("./entities/asset_procurements.entity").AssetProcurement;
                procurement_items: import("./entities/asset_procurement_items.entity").AssetProcurementItem[];
                serials: {
                    procurement_item: import("./entities/asset_procurement_items.entity").AssetProcurementItem;
                    procurement: import("./entities/asset_procurements.entity").AssetProcurement;
                    asset_stocks_unique_id: number;
                    asset_id: number;
                    asset_data: import("../asset-data/entities/asset-datum.entity").AssetDatum;
                    stock_id: number;
                    stock: import("./entities/stocks.entity").Stock;
                    location_id?: number;
                    location_mapping: import("../../organizational-profile/entity/location-branch-mapping.entity").LocationBranchMapping;
                    asset_item_id?: number;
                    asset_item?: import("../asset-items/entities/asset-item.entity").AssetItem;
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
                    created_by_user?: import("../../organizational-profile/entity/organizational-user.entity").User;
                    is_active: number;
                    is_deleted: number;
                    working_status_type_id: number;
                    asset_working_status: import("../asset-working-status/entities/asset-working-status.entity").AssetWorkingStatus;
                    asset_mappings: import("../../asset-mapping/entities/asset-mapping.entity").AssetMappingRepository[];
                }[];
            };
            serials: {
                procurement_item: import("./entities/asset_procurement_items.entity").AssetProcurementItem;
                procurement: import("./entities/asset_procurements.entity").AssetProcurement;
                asset_stocks_unique_id: number;
                asset_id: number;
                asset_data: import("../asset-data/entities/asset-datum.entity").AssetDatum;
                stock_id: number;
                stock: import("./entities/stocks.entity").Stock;
                location_id?: number;
                location_mapping: import("../../organizational-profile/entity/location-branch-mapping.entity").LocationBranchMapping;
                asset_item_id?: number;
                asset_item?: import("../asset-items/entities/asset-item.entity").AssetItem;
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
                created_by_user?: import("../../organizational-profile/entity/organizational-user.entity").User;
                is_active: number;
                is_deleted: number;
                working_status_type_id: number;
                asset_working_status: import("../asset-working-status/entities/asset-working-status.entity").AssetWorkingStatus;
                asset_mappings: import("../../asset-mapping/entities/asset-mapping.entity").AssetMappingRepository[];
            }[];
            assigned_quantity: number;
            procurement_id: number;
        };
    }>;
    createRenewal(body: {
        procurement_id: number;
        asset_item_id: number;
        formData: any;
        isProrata: boolean;
    }, req: any): Promise<{
        status: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
        };
    } | {
        status: boolean;
        message: any;
        data?: undefined;
    }>;
    getProcurementHistory(asset_item_id: number, procurement_id?: number): Promise<{
        status: boolean;
        message: string;
        data: {
            history: any[];
        };
    }>;
    getBillEditDetails(dto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateStockBill(files: Express.Multer.File[], body: any, req: any): Promise<{
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
    uploadBillDocument(files: Express.Multer.File[], body: any, req: any): Promise<{
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
    updateWarranty(body: UpdateWarrantyDto, req: any): Promise<{
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
    updateSubscription(body: UpdateSubscriptionDto, req: any): Promise<{
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
    deleteAssetImage(serial_id: number, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
}
