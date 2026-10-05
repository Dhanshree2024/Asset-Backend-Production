import { HttpStatus } from '@nestjs/common';
import { AssetSubcategoriesService } from './asset-subcategories.service';
import { CreateAssetSubcategoryDto } from './dto/create-asset-subcategory.dto';
import { UpdateAssetSubcategoryDto } from './dto/update-asset-subcategory.dto';
import { Response, Request } from 'express';
import { DeleteAssetSubCategoryDto } from './dto/delete-asset-subcategory.dto';
export declare class AssetSubcategoriesController {
    private readonly assetSubcategoriesService;
    constructor(assetSubcategoriesService: AssetSubcategoriesService);
    moveItems(main_category_id: number, sub_category_id?: number): Promise<{
        success: boolean;
        data: {
            movedSubcategory: import("./entities/asset-subcategory.entity").AssetSubcategory;
            moveditschilditems: import("../asset-items/entities/asset-item.entity").AssetItem[];
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    exportToExcel(search: string, customFiltersStr: string, res: Response): Promise<void>;
    getAllSubCategories(page?: number, limit?: number, searchQuery?: string, customFiltersStr?: string): Promise<any>;
    getSubCategoriesByCategory(mainCategoryId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createNewAssetItem(dto: CreateAssetSubcategoryDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    activateSubCategories(sub_category_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateSubCategories(sub_category_ids: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    generateSubcategoryTemplateController(req: Request, res: Response): Promise<void>;
    bulkCreateSubcategories(dtos: any[], req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_subcategories: any[];
            error_subcategories: any[];
        };
    } | {
        statusCode: number;
        message: string;
        data: any;
    }>;
    fetchSingleAssetSubCategoryData(deleteAssetItemDto: DeleteAssetSubCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateSubCategoryData(updateItemDto: UpdateAssetSubcategoryDto, req: any, res: any): Promise<any>;
    bulkDeleteSubCategories(subCategoryIds: number[], res: Response): Promise<Response<any, Record<string, any>>>;
    getSubCategoryDropdown(): Promise<{
        success: boolean;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getSubCategoriesByCategoryDropdown(categoryIds?: string | string[]): Promise<{
        success: boolean;
        data: import("./entities/asset-subcategory.entity").AssetSubcategory[];
    }>;
}
