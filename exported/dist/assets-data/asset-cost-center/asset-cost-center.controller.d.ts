import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AssetCostCenterService } from './asset-cost-center.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
export declare class AssetCostCenterController {
    private readonly assetCostCenterService;
    constructor(assetCostCenterService: AssetCostCenterService);
    getAllCostCenter2(dto: ListViewDto, req: any): Promise<unknown>;
    getCostCenterDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/asset-cost-center.entity").AssetCostCenter[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    generateCostCenterCode(): Promise<{
        success: boolean;
        code: string;
    }>;
    createNewCostCenter(body: CreateCostCenterDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCostCenterById(body: UpdateCostCenterDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCostCenterById(body: {
        cost_center_id: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    activateCostCenters(body: {
        ids?: number[];
        isSelectAll?: boolean;
        excludeIds?: number[];
        filters?: any;
        [key: string]: any;
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    deactivateCostCenters(body: {
        ids?: number[];
        isSelectAll?: boolean;
        excludeIds?: number[];
        filters?: any;
        [key: string]: any;
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    deleteCostCenters(body: {
        ids?: number[];
        isSelectAll?: boolean;
        excludeIds?: number[];
        filters?: any;
        [key: string]: any;
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    exportCostCentersToExcel(res: Response, dto: any): Promise<void>;
    generateCostCenterTemplate(req: Request, res: Response): Promise<void>;
    bulkCreateCostCenters(dtos: any[], req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
}
