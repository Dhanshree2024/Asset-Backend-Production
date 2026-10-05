import { HttpStatus } from '@nestjs/common';
import { AssetsStatusService } from './assets-status.service';
import { CreateAssetsStatusDto } from './dto/create-assets-status.dto';
import { UpdateAssetsStatusDto } from './dto/update-assets-status.dto';
import { Request, Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { DeleteAssetsStatusDto } from './dto/delete-assets-status.dto';
export declare class AssetStatusController {
    private readonly assetStatusService;
    constructor(assetStatusService: AssetsStatusService);
    createNewAssetStatus(createAssetsStatusDto: CreateAssetsStatusDto, req: Request): Promise<{
        status: number;
        message: string;
        data: import("./entities/assets-status.entity").AssetsStatus;
    }>;
    addAssetStatusBulk(bulkData: CreateAssetsStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                status_type_name: string;
                status_color_code: string;
                is_active: number;
                is_deleted: number;
            } & import("./entities/assets-status.entity").AssetsStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllStatuses2(dto: ListViewDto): Promise<unknown>;
    getStatusTypes(): Promise<import("./entities/assets-status.entity").AssetsStatus[]>;
    fetchSingleAssetStatusData(deleteAssetStatusDto: DeleteAssetsStatusDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatusData(updateStatusDto: UpdateAssetsStatusDto, req: any, res: any): Promise<any>;
    deleteStatusData(deleteStatusDto: DeleteAssetsStatusDto, res: any): Promise<any>;
    disableStatusData(deleteStatusDto: DeleteAssetsStatusDto, res: any): Promise<any>;
    enableStatusData(deleteStatusDto: DeleteAssetsStatusDto, res: any): Promise<any>;
    exportAssetStatusesExcel(res: Response, dto: ListViewDto): Promise<void>;
}
