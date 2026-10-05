import { HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';
import { AssetCategory } from './entities/asset-category.entity';
import { AssetSubcategory } from '../asset-subcategories/entities/asset-subcategory.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { AssetItem } from '../asset-items/entities/asset-item.entity';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
export declare class AssetCategoriesService {
    private assetCategoryRepository;
    private assetSubCategoryRepository;
    private AssetItemRepositery;
    private readonly dataSource;
    private readonly dropdownCache;
    constructor(assetCategoryRepository: Repository<AssetCategory>, assetSubCategoryRepository: Repository<AssetSubcategory>, AssetItemRepositery: Repository<AssetItem>, dataSource: DataSource, dropdownCache: DropdownCacheService);
    getMainCategoryDropdown(): Promise<{
        label: string;
        value: number;
    }[]>;
    exportFilteredExcelFromFilters(searchQuery: string, customFilters: Record<string, any>): Promise<Buffer>;
    create(createAssetCategoryDto: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_categories: any[];
            error_categories: any[];
        };
    }>;
    generateCategoryTemplate(): Promise<Buffer>;
    bulkCreateCategories(dtos: any[], user_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_categories: any[];
            error_categories: any[];
        };
    }>;
    countAll(): Promise<number>;
    findAll(): Promise<AssetCategory[]>;
    getDropdown(): Promise<AssetCategory[]>;
    deleteCategory(createAssetCategoryDto: CreateAssetCategoryDto): Promise<AssetCategory | "Category not found for deletion." | "Subcategory Exists! Unable to delete category.">;
    bulkDeleteCategories(categoryIds: number[]): Promise<any>;
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
    update(id: number, updateAssetCategoryDto: UpdateAssetCategoryDto): Promise<AssetCategory>;
    fetchSingleAssetCategoryData(deleteAssetSubCategoryDto: CreateAssetCategoryDto): Promise<{
        subcategoryCount: number;
        itemCount: number;
        main_category_id: number;
        main_category_name: string;
        main_category_description: string;
        is_active: number;
        is_deleted: number;
        added_by: number;
        created_at: Date;
        updated_at: Date;
        main_category_icon: string;
        added_by_user: User;
        subcategories: AssetSubcategory[];
    }>;
    exportCategoryCSV(): Promise<{
        decodedResults: {
            'Category Name': string;
            Description: string;
            'Added By': string | User;
            'Created At': string;
            'Updated At': string;
        }[];
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
}
