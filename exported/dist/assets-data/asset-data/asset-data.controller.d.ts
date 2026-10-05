import { Request, Response } from 'express';
import { AssetDataService } from './asset-data.service';
import { CreateAssetDatumDto } from './dto/create-asset-datum.dto';
import { UpdateAssetDatumDto } from './dto/update-asset-datum.dto';
export declare class AssetDataController {
    private readonly assetDataService;
    constructor(assetDataService: AssetDataService);
    insertAsset(createAssetDatumDto: CreateAssetDatumDto, req: Request): Promise<{
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
    filterAssets(body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getFilters(req: any): Promise<{
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
    getDropdown(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSubCategoriesByCategory(manufacturer_id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    printBarcodes(req: Request, res: Response): Promise<void>;
    generateAssetId(payload: {
        assetId?: number;
        branchId?: number;
        departmentId?: number;
        categoryId?: number;
        subCategoryId?: number;
        itemId?: number;
        templateId: number;
    }, req: Request): Promise<{
        success: boolean;
        generatedId: string;
    }>;
    generateBarcodes(dto: any): Promise<{
        success: boolean;
        pdf: string;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        pdf?: undefined;
    }>;
    generateQRcodes(dto: any, req: Request): Promise<{
        success: boolean;
        pdf: string;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        pdf?: undefined;
    }>;
    printPdf(body: any, res: Response): Promise<void>;
    bulkCreateAssets(dtos: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    exportAssetList(asset_main_category_id: number, asset_sub_category_id: number, asset_item_id: number, searchQuery?: string): Promise<false | {
        decodedResults: import("./entities/asset-datum.entity").AssetDatum[];
        uniqueAssetFields: any[];
    }>;
    countAll(): Promise<{
        totalCount: number;
        unusedCount: number;
        usedCount: number;
    }>;
    findSingleAsset(asset_id: number, asset_stocks_unique_id: number, stock_id: number, req: Request): Promise<{
        status: boolean;
        message: string;
        data: {
            asset: import("./entities/asset-datum.entity").AssetDatum;
            stocks: import("../stocks/entities/stocks.entity").Stock[];
            serialData: {
                procurement: {
                    procurement_id: number;
                    renewal_status: number;
                };
                asset_stocks_unique_id: number;
                asset_id: number;
                asset_data: import("./entities/asset-datum.entity").AssetDatum;
                stock_id: number;
                stock: import("../stocks/entities/stocks.entity").Stock;
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
                procurement_item?: import("../stocks/entities/asset_procurement_items.entity").AssetProcurementItem;
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
        };
    }>;
    findSingleAssetTopCard(asset_id: number, asset_stocks_unique_id: number, stock_id?: number): Promise<{
        status: boolean;
        message: string;
        data: {
            asset: import("./entities/asset-datum.entity").AssetDatum;
            stocks: import("../stocks/entities/stocks.entity").Stock[];
            serialData: import("../stocks/entities/asset_stock_serials.entity").AssetStockSerials;
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
        };
    }>;
    findBillingDetails(asset_id: number, asset_stocks_unique_id: number, stock_id: number): Promise<{
        status: boolean;
        message: string;
        data: {
            serialData: import("../stocks/entities/asset_stock_serials.entity").AssetStockSerials;
            procurements: any;
            warranty: any;
            subscription: any;
        };
    }>;
    updateAssetInformationFields(body: any): Promise<{
        status: boolean;
        message: string;
        data: {
            asset_field_id: any;
            asset_field_category_id: any;
            asset_field_category_name: any;
            asset_field_category_description: any;
            asset_field_name: any;
            asset_field_label_name: any;
            value: any;
        }[];
    }>;
    updateAssetInfo(updateAssetsDatumDto: UpdateAssetDatumDto, req: any, res: any): any;
    getAllFieldsForQRCode(): Promise<{
        success: boolean;
        data: any[];
    }>;
}
