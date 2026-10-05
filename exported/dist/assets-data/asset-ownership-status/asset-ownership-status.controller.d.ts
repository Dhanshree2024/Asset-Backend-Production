import { HttpStatus } from '@nestjs/common';
import { AssetOwnershipStatusService } from './asset-ownership-status.service';
import { CreateAssetOwnershipStatusDto } from './dto/create-asset-ownership-status.dto';
import { UpdateAssetOwnershipStatusDto } from './dto/update-asset-ownership-status.dto';
import { Response, Request } from 'express';
import { DeleteAssetOwnershipStatusDto } from './dto/delete-asset-ownership-status.dto';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
export declare class AssetOwnershipStatusController {
    private readonly assetOwnershipStatusService;
    constructor(assetOwnershipStatusService: AssetOwnershipStatusService);
    createAssetOwnershipStatus(createAssetOwnershipStatusDto: CreateAssetOwnershipStatusDto, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            ownership_status: import("./entities/asset-ownership-status.entity").AssetOwnershipStatus;
        };
    }>;
    bulkCreateAssetOwnershipStatuses(bulkData: CreateAssetOwnershipStatusDto[]): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_statuses: ({
                ownership_status_type_name: string;
                asset_ownership_status_color: string;
                is_active: number;
                is_deleted: number;
            } & import("./entities/asset-ownership-status.entity").AssetOwnershipStatus)[];
            already_exist_entries: any[];
            name_conflict_entries: any[];
            color_conflict_entries: any[];
        };
    }>;
    getAllAssetOwnershipStatuses2(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        meta: any;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    getAssetOwnershipStatusDropdown(body: {
        search?: string;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchSingleAssetOwnershipStatus(deleteAssetOwnershipStatusDto: DeleteAssetOwnershipStatusDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateAssetOwnershipStatus(updateAssetOwnershipStatusDto: UpdateAssetOwnershipStatusDto, req: any, res: any): Promise<any>;
    disableAssetOwnershipStatus(dto: DeleteAssetOwnershipStatusDto, res: any): Promise<any>;
    deleteAssetOwnershipStatus(dto: DeleteAssetOwnershipStatusDto, res: any): Promise<any>;
    enableAssetOwnershipStatus(dto: DeleteAssetOwnershipStatusDto, res: any): Promise<any>;
    exportOwnershipStatusesExcel(res: Response, dto: ListViewDto): Promise<void>;
}
