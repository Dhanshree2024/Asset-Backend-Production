import { Response } from 'express';
import { AssetDepreciationService } from './asset-depreciation.service';
import { BlockExpandRequestDto, DepreciationExportDto, GetSerialDto, SerialDepreciationDto } from './dto/depreciation-serial.dto';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
export declare class AssetDepreciationController {
    private readonly service;
    constructor(service: AssetDepreciationService);
    getAllSerials(dto: ListViewDto): Promise<{
        success: boolean;
        message: string;
        data: SerialDepreciationDto[];
        meta: any;
    }>;
    getSerialById(body: GetSerialDto): Promise<SerialDepreciationDto>;
    getBlockReport(fy: string): Promise<import("./dto/depreciation-serial.dto").BlockReportDto[]>;
    getBlockAssets(dto: BlockExpandRequestDto): Promise<any[]>;
    exportDepreciationExcel(res: Response, dto: DepreciationExportDto): Promise<void>;
    exportBlockReport(res: Response, dto: BlockExpandRequestDto): Promise<void>;
}
