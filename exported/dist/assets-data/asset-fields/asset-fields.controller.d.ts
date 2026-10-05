import { Request, Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { AssetFieldsService } from './asset-fields.service';
import { CreateAssetFieldDto } from './dto/create-asset-field.dto';
import { DeleteAssetFieldDto } from './dto/delete-asset-field.dto';
import { UpdateAssetFieldDto } from './dto/update-asset-field.dto';
export declare class AssetFieldsController {
    private readonly assetFieldsService;
    constructor(assetFieldsService: AssetFieldsService);
    fetchOrganizationAllAssetFields(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    getDefaultAssetFields(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    }>;
    getAssetFieldsDropdown(search?: string): Promise<{
        customFields: import("./entities/asset-field.entity").AssetField[];
        defaultFields: import("./entities/asset-field.entity").AssetField[];
    }>;
    getAssetFieldCategoryDropdown(): Promise<{
        success: boolean;
        data: {
            label: string;
        }[];
    }>;
    exportAssetFieldsToExcel(res: Response, search?: string, filtersStr?: string): Promise<void>;
    exportCustomFieldsExcel(res: Response, dto: ListViewDto): Promise<void>;
    exportDefaultFieldsExcel(res: Response, dto: ListViewDto): Promise<void>;
    getAssetStatusTypes(): Promise<import("./entities/asset-status-types.entity").AssetStatusTypes[]>;
    getAssetWorkingStatusType(): Promise<import("./entities/asset-working-status-types.entity").AssetWorkingStatusTypes[]>;
    getAssetOwnershipStatusType(): Promise<import("./entities/asset-ownership-status-types.entity").AssetOwnershipStatusTypes[]>;
    fetchSingleFieldData(asset_field_id: number, deleteAssetFieldDto: DeleteAssetFieldDto, res: Response): Promise<Response<any, Record<string, any>>>;
    createNewVendor(dto: CreateAssetFieldDto, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: CreateAssetFieldDto & import("./entities/asset-field.entity").AssetField;
    }>;
    findAll(): Promise<import("./entities/asset-field.entity").AssetField[]>;
    findAllFieldCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteAssetOwnershipStatus(deleteAssetOwnershipStatusDto: DeleteAssetFieldDto, req: any, res: any): Promise<any>;
    activateItem(asset_field_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateItem(asset_field_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    getDefaultAssetFieldsDropdown(): Promise<import("./entities/asset-field.entity").AssetField[]>;
    getCustomAssetFieldsDropdown(): Promise<import("./entities/asset-field.entity").AssetField[]>;
    countAll(): Promise<number>;
    getField(id: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/asset-field.entity").AssetField;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    updateField(id: number, updateAssetFieldDto: UpdateAssetFieldDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/asset-field.entity").AssetField;
    }>;
}
