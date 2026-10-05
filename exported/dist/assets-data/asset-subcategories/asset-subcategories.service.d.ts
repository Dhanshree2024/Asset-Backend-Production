import { HttpStatus } from '@nestjs/common';
import { CreateAssetSubcategoryDto } from './dto/create-asset-subcategory.dto';
import { UpdateAssetSubcategoryDto } from './dto/update-asset-subcategory.dto';
import { DataSource, Repository } from 'typeorm';
import { AssetItem } from '../asset-items/entities/asset-item.entity';
import { DatabaseService } from 'src/dynamic-schema/database.service';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { DeleteAssetSubCategoryDto } from './dto/delete-asset-subcategory.dto';
import { AssetCategoriesService } from '../asset-categories/asset-categories.service';
import { AssetCategory } from '../asset-categories/entities/asset-category.entity';
import { AssetSubcategory } from './entities/asset-subcategory.entity';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
export declare class AssetSubcategoriesService {
    private assetSubCategoryRepository;
    private categoryRepository;
    private AssetItemRepositery;
    private readonly dataSource;
    private readonly databaseService;
    private readonly assetCategoriesService;
    private readonly dropdownCache;
    constructor(assetSubCategoryRepository: Repository<AssetSubcategory>, categoryRepository: Repository<AssetCategory>, AssetItemRepositery: Repository<AssetItem>, dataSource: DataSource, databaseService: DatabaseService, assetCategoriesService: AssetCategoriesService, dropdownCache: DropdownCacheService);
    createNewAssetSubCategory(dto: CreateAssetSubcategoryDto): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            user: AssetSubcategory;
        };
    }>;
    generateSubCategoryExcleTemplate(): Promise<any>;
    bulkCreateSubcategories(dtos: any[], user_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_subcategories: any[];
            error_subcategories: any[];
        };
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    activatesubCategories(sub_category_ids: number[]): Promise<{
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
    moveSubcategory(main_category_id: number, sub_category_id: number): Promise<{
        movedSubcategory: AssetSubcategory;
        moveditschilditems: AssetItem[];
    }>;
    findAll(): Promise<AssetSubcategory[]>;
    getAllSubCategories(page: number, limit: number, searchQuery: string, customFilters?: Record<string, any>): Promise<any>;
    getSubCategoriesByCategory(mainCategoryId?: number): Promise<AssetSubcategory[]>;
    exportFilteredExcelForSubCategories({ search, filters, }: {
        search?: string;
        filters?: Record<string, any>;
    }): Promise<Buffer>;
    fetchSingleAssetSubCategoryData(deleteAssetSubCategoryDto: DeleteAssetSubCategoryDto): Promise<{
        status: number;
        message: string;
        data: {
            itemCount: number;
            sub_category_id: number;
            main_category_id: number;
            added_by: number;
            sub_category_name: string;
            sub_category_description: string;
            is_active: number;
            is_deleted: number;
            sub_category_icon: string;
            created_at: Date;
            updated_at: Date;
            main_category: AssetCategory;
            added_by_user: User;
            items: AssetItem[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateSubCategoryData(updateAssetSubCategorydto: UpdateAssetSubcategoryDto): Promise<AssetSubcategory>;
    bulkDeleteSubCategories(subCategoryIds: number[]): Promise<any>;
    getSubCategoryDropdown(): Promise<{
        label: string;
        value: number;
    }[]>;
    getSubCategoriesByCategoryDropdown(categoryIds?: string | string[]): Promise<AssetSubcategory[]>;
}
