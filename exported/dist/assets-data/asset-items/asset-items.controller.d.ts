import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { RedisService } from 'src/common/redis/redis.service';
import { DataSource } from 'typeorm';
import { AssetItemsService } from './asset-items.service';
import { CreateAssetItemNewDto } from './dto/create-asset-item.dto';
import { DeleteAssetItemDto } from './dto/delete-asset-item.dto';
import { GetAssetItemWithRelationsDto } from './dto/get-asset-item-with-relations.dto';
import { UpdateAssetItemDto } from './dto/update-asset-item.dto';
export declare class AssetItemsController {
    private readonly assetItemsService;
    private readonly dataSource;
    private readonly redisService;
    constructor(assetItemsService: AssetItemsService, dataSource: DataSource, redisService: RedisService);
    downloadAssetTemplate(asset_item_id: number, includeSampleRow: boolean, res: Response): Promise<Response<any, Record<string, any>>>;
    getAssetHeaders(asset_item_id: number): Promise<{
        headers: any;
    }>;
    createAssetWithStock(dtos: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            stock_result: {
                message: string;
                data: any[];
                skipped: any[];
                remaining_capacity: number;
            };
            error_records: any[];
        };
    }>;
    getAllItemData(search: string, customFiltersStr: string, res: Response): Promise<Response<any, Record<string, any>>>;
    activateItem(asset_item_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateItem(asset_item_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    moveItems(asset_item_id: number, main_category_id: number, sub_category_id?: number): Promise<{
        success: boolean;
        data: import("./entities/asset-item.entity").AssetItem;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    fetchOrganizationAllAssetItems2(dto: ListViewDto, req: any): Promise<unknown>;
    fetchAllActiveItems(searchQuery?: string, category?: string[] | string, subCategory?: string[] | string): Promise<{
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    fetchAllActiveItems2(searchQuery: string, category: string[] | string, subCategory: string[] | string, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getDepreciationList(): Promise<import("../stocks/entities/asset_stock_serials.entity").AssetStockSerials[]>;
    exportAssetItemsToExcel(res: Response, searchQuery?: string, filtersStr?: string): Promise<void>;
    exportAssetItemsPost(res: Response, req: Request, dto: ListViewDtoForExcleExport): Promise<void>;
    exportAssetItemsExcel2(dto: ListViewDtoForExcleExport, req: Request, res: Response): Promise<void>;
    itemTemplate(req: Request, res: Response): Promise<void>;
    bulkCreateAssetItems(dtos: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_items: any[];
            error_items: any[];
        };
    }>;
    createNewAssetItem(file: Express.Multer.File, dto: CreateAssetItemNewDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchSingleAssetItemData(deleteAssetItemDto: DeleteAssetItemDto, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchSingleItemDataForForm(deleteAssetItemDto: DeleteAssetItemDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateItemData(file: Express.Multer.File, updateItemDto: UpdateAssetItemDto, req: any, res: any): Promise<any>;
    bulkDeleteItems(itemIds: number[], req: any, res: any): Promise<any>;
    getAssetItemWithRelations(getAssetItemWithRelationsDto: GetAssetItemWithRelationsDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getSidebarMenuOptions(): Promise<{
        success: boolean;
        data: {
            main_category_id: number;
            main_category_name: string;
            main_category_icon: string;
            main_category_children: {
                sub_category_id: number;
                sub_category_name: string;
                sub_category_icon: string;
                sub_category_children: {
                    asset_item_id: number;
                    name: string;
                    asset_item_icon: string;
                }[];
            }[];
        }[];
    }>;
    getDepartmentConfigValues(req: Request, res: Response, searchQuery?: string): Promise<Response<any, Record<string, any>>>;
}
