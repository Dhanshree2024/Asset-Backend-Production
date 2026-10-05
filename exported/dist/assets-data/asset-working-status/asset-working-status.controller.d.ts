import { HttpStatus } from '@nestjs/common';
import { AssetWorkingStatusService } from './asset-working-status.service';
import { CreateAssetWorkingStatusDto } from './dto/create-asset-working-status.dto';
import { UpdateAssetWorkingStatusDto } from './dto/update-asset-working-status.dto';
import { DeleteAssetWorkingStatusDto } from './dto/delete-asset-working-status.dto';
import { Response, Request } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
export declare class AssetWorkingStatusController {
    private readonly assetWorkingStatusService;
    constructor(assetWorkingStatusService: AssetWorkingStatusService);
    createNewAssetWorkingStatus(createAssetWorkingStatusDto: CreateAssetWorkingStatusDto, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            status: import("./entities/asset-working-status.entity").AssetWorkingStatus;
        };
    }>;
    addAssetStatusBulk(bulkData: CreateAssetWorkingStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                working_status_type_name: string;
                working_status_color: string;
                is_active: number;
                is_deleted: number;
            } & import("./entities/asset-working-status.entity").AssetWorkingStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllWorkingStatuses2(dto: ListViewDto): Promise<unknown>;
    getWorkingStatusesDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            working_status_type_id: number;
            working_status_type_name: string;
        }[];
    }>;
    fetchSingleAssetWorkingStatusData(deleteAssetWorkingStatusDto: DeleteAssetWorkingStatusDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateWorkingStatusData(updateWorkingStatusDto: UpdateAssetWorkingStatusDto, req: any, res: any): Promise<any>;
    disableWorkingStatusData(dto: DeleteAssetWorkingStatusDto, res: any): Promise<any>;
    deleteWorkingStatusData(dto: DeleteAssetWorkingStatusDto, res: any): Promise<any>;
    enableWorkingStatusData(dto: DeleteAssetWorkingStatusDto, res: any): Promise<any>;
    getMaintenanceWorkingStatusesDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            working_status_type_id: number;
            working_status_type_name: string;
            color_code: string;
        }[];
    }>;
    getAssetTranferLocationWorkingStatusesDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            working_status_type_id: number;
            working_status_type_name: string;
            color_code: string;
        }[];
    }>;
    fetchScrapWorkingStatusDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            working_status_type_id: number;
            working_status_type_name: string;
            color_code: string;
        }[];
    }>;
    exportWorkingStatusesExcel(res: Response, dto: ListViewDto): Promise<void>;
}
