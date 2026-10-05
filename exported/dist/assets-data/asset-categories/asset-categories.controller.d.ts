import { HttpStatus } from '@nestjs/common';
import { AssetCategoriesService } from './asset-categories.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';
import { Response, Request } from 'express';
export declare class AssetCategoriesController {
    private readonly assetCategoriesService;
    constructor(assetCategoriesService: AssetCategoriesService);
    create(createAssetCategoryDto: CreateAssetCategoryDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getDropdown(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateAssetCategory(updateAssetCategoryDto: UpdateAssetCategoryDto): Promise<{
        status: HttpStatus;
        message: string;
        data: import("./entities/asset-category.entity").AssetCategory;
    }>;
    deleteCategory(createAssetCategoryDto: CreateAssetCategoryDto): Promise<import("./entities/asset-category.entity").AssetCategory | "Category not found for deletion." | "Subcategory Exists! Unable to delete category.">;
    bulkDelete(categoryIds: number[]): Promise<any>;
    deactivateCategories(categoryIds: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    activateCategories(categoryIds: number[]): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    fetchSingleAssetCategoryData(dto: CreateAssetCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    countAll(): Promise<number>;
    downloadMainCategoryTemplate(req: Request, res: Response): Promise<void>;
    bulkCreateCategories(dtos: any[], req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_categories: any[];
            error_categories: any[];
        };
    }>;
    exportCatCSV(): Promise<{
        decodedResults: {
            'Category Name': string;
            Description: string;
            'Added By': string | import("../../organizational-profile/entity/organizational-user.entity").User;
            'Created At': string;
            'Updated At': string;
        }[];
    }>;
    exportToExcel(res: Response, searchQuery?: string, filtersStr?: string): Promise<void>;
    getCategoryDropdown(): Promise<{
        success: boolean;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    update(id: string, updateAssetCategoryDto: UpdateAssetCategoryDto): Promise<import("./entities/asset-category.entity").AssetCategory>;
}
