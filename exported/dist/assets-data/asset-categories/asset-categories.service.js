"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const asset_category_entity_1 = require("./entities/asset-category.entity");
const asset_subcategory_entity_1 = require("../asset-subcategories/entities/asset-subcategory.entity");
const typeorm_2 = require("@nestjs/typeorm");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const saveBase64Image_1 = require("../../utils/saveBase64Image");
const maincategory_helper_functions_1 = require("../../utils/maincategory-helper-functions");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
let AssetCategoriesService = class AssetCategoriesService {
    constructor(assetCategoryRepository, assetSubCategoryRepository, AssetItemRepositery, dataSource, dropdownCache) {
        this.assetCategoryRepository = assetCategoryRepository;
        this.assetSubCategoryRepository = assetSubCategoryRepository;
        this.AssetItemRepositery = AssetItemRepositery;
        this.dataSource = dataSource;
        this.dropdownCache = dropdownCache;
    }
    async getMainCategoryDropdown() {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.CATEGORY, { shape: 'label-value' }, async () => {
            const categories = await this.assetCategoryRepository.find({
                where: { is_active: 1, is_deleted: 0 },
            });
            return categories.map((cat) => ({
                label: cat.main_category_name,
                value: cat.main_category_id,
            }));
        });
    }
    async exportFilteredExcelFromFilters(searchQuery, customFilters) {
        try {
            let queryBuilder = this.assetCategoryRepository.createQueryBuilder('asset_main_category');
            queryBuilder = queryBuilder
                .where('asset_main_category.is_active = :isActive', { isActive: 1 })
                .andWhere('asset_main_category.is_deleted = :isDeleted', {
                isDeleted: 0,
            });
            if (searchQuery?.trim()) {
                queryBuilder = queryBuilder.andWhere('asset_main_category.main_category_name ILIKE :search', { search: `%${searchQuery}%` });
            }
            if (customFilters && Object.keys(customFilters).length > 0) {
                for (const [key, value] of Object.entries(customFilters)) {
                    if (!value || key === 'sortOrder') {
                        continue;
                    }
                    if (typeof value === 'object' && value.from && value.to) {
                        queryBuilder = queryBuilder.andWhere(`asset_main_category.${key} BETWEEN :from_${key} AND :to_${key}`, {
                            [`from_${key}`]: value.from,
                            [`to_${key}`]: value.to,
                        });
                    }
                    else if (key === 'main_category_id') {
                        queryBuilder = queryBuilder.andWhere(`asset_main_category.main_category_id = :main_category_id`, { main_category_id: value });
                    }
                    else {
                        queryBuilder = queryBuilder.andWhere(`CAST(asset_main_category.${key} AS TEXT) ILIKE :${key}`, { [key]: `%${value}%` });
                    }
                }
            }
            let sortField = 'asset_main_category.main_category_name';
            let sortDirection = 'ASC';
            if (customFilters?.sortOrder) {
                const order = customFilters.sortOrder.toLowerCase();
                if (order === 'desc')
                    sortDirection = 'DESC';
                else if (order === 'asc')
                    sortDirection = 'ASC';
                else if (order === 'newest') {
                    sortField = 'asset_main_category.created_at';
                    sortDirection = 'DESC';
                }
                else if (order === 'oldest') {
                    sortField = 'asset_main_category.created_at';
                    sortDirection = 'ASC';
                }
            }
            const data = await queryBuilder
                .orderBy(sortField, sortDirection)
                .getMany();
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            const headers = ['Sr No', 'Main Category Name'];
            headers.forEach((title, i) => {
                sheet
                    .cell(1, i + 1)
                    .value(title)
                    .style({ bold: true });
            });
            sheet.column(1).width(10);
            sheet.column(2).width(20);
            data.forEach((item, index) => {
                const row = index + 2;
                sheet.cell(row, 1).value(index + 1);
                sheet.cell(row, 2).value(item.main_category_name);
            });
            console.log('📄 Step 10 | Excel sheet created successfully');
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('❌ Error exporting Excel | Location: exportFilteredExcelFromFilters');
            console.error(error);
            throw new common_1.BadRequestException('Failed to export Excel');
        }
    }
    async create(createAssetCategoryDto) {
        try {
            const successCategories = [];
            const errorCategories = [];
            const normalizedInput = createAssetCategoryDto.main_category_name
                .replace(/\s+/g, '')
                .toLowerCase();
            const existing = await this.assetCategoryRepository
                .createQueryBuilder('category')
                .where("REPLACE(LOWER(category.main_category_name), ' ', '') = :normalizedName", {
                normalizedName: normalizedInput,
            })
                .andWhere('category.is_deleted = :isDeleted', { isDeleted: 0 })
                .getOne();
            if (existing) {
                errorCategories.push({
                    ...createAssetCategoryDto,
                    error: 'Category with this name already exists.',
                });
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: 'Category already exists.',
                    data: {
                        created_count: 0,
                        created_categories: [],
                        error_categories: errorCategories,
                    },
                };
            }
            else {
                const now = new Date();
                let iconPath = createAssetCategoryDto.main_category_icon;
                if (createAssetCategoryDto.main_category_icon) {
                    iconPath = await (0, saveBase64Image_1.saveBase64Image)(createAssetCategoryDto.main_category_icon, createAssetCategoryDto.main_category_name);
                }
                const newCategory = this.assetCategoryRepository.create({
                    main_category_name: createAssetCategoryDto.main_category_name,
                    main_category_description: createAssetCategoryDto.main_category_description || '',
                    main_category_icon: iconPath,
                    is_active: 1,
                    is_deleted: 0,
                    created_at: now,
                    updated_at: now,
                    added_by: createAssetCategoryDto.added_by,
                });
                await this.assetCategoryRepository.save(newCategory);
                await this.dropdownCache.invalidateMany([
                    dropdown_entities_1.DROPDOWN.CATEGORY,
                    dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                    dropdown_entities_1.DROPDOWN.ITEM,
                ]);
                successCategories.push({
                    ...createAssetCategoryDto,
                    main_category_icon: iconPath,
                });
            }
            return {
                status: successCategories.length
                    ? common_1.HttpStatus.CREATED
                    : common_1.HttpStatus.CONFLICT,
                message: successCategories.length && errorCategories.length
                    ? 'Category created with some errors.'
                    : successCategories.length
                        ? 'Category created successfully.'
                        : 'No category created. All entries failed.',
                data: {
                    created_count: successCategories.length,
                    created_categories: successCategories,
                    error_categories: errorCategories,
                },
            };
        }
        catch (error) {
            console.error('Error in insert:', error);
            throw error;
        }
    }
    async generateCategoryTemplate() {
        try {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0).name('main_category_template');
            const instructions = [
                'Instructions:',
                '1. Fill in all required fields starting from row 7.',
                '2. "Main Category Name" is mandatory and must be unique.',
                '3. Avoid using special characters in names.',
                '4. Do not modify the header row (Row 6).',
            ];
            instructions.forEach((text, index) => {
                mainSheet
                    .cell(index + 1, 1)
                    .value(text)
                    .style({
                    bold: true,
                    fontColor: '0000FF',
                });
            });
            const headers = ['Main Category Name', 'Main Category Description'];
            headers.forEach((header, index) => {
                mainSheet
                    .cell(6, index + 1)
                    .value(header)
                    .style({ bold: true });
            });
            const startRow = 7;
            const endRow = 1048576;
            mainSheet.cell(startRow, 1).value('Example Category');
            mainSheet
                .cell(startRow, 2)
                .value('This is a sample category description');
            const buffer = await workbook.outputAsync();
            return buffer;
        }
        catch (error) {
            console.error('Error generating main category template:', error);
            throw new Error('Failed to generate main category Excel template');
        }
    }
    async bulkCreateCategories(dtos, user_id) {
        console.log('📥 Received DTOs for bulk category creation:', dtos);
        const successCategories = [];
        const errorCategories = [];
        const newCategories = [];
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: user_id } });
        if (!userExists) {
            console.error('❌ User not found for user_id:', user_id);
            throw new Error('User does not exist');
        }
        const existingCategories = await this.assetCategoryRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        for (const dto of dtos) {
            dto.added_by = user_id;
            if (!dto.main_category_name?.trim()) {
                errorCategories.push({
                    ...dto,
                    reason: 'Main Category Name is required',
                });
                continue;
            }
            const existingMatch = existingCategories.find((cat) => cat.main_category_name?.trim().toLowerCase() ===
                dto.main_category_name?.trim().toLowerCase());
            if (existingMatch) {
                errorCategories.push({
                    ...dto,
                    reason: 'Duplicate category name',
                    existing_entry: {
                        id: existingMatch.main_category_id,
                        name: existingMatch.main_category_name,
                        description: existingMatch.main_category_description,
                        created_at: existingMatch.created_at,
                    },
                });
                continue;
            }
            const now = new Date();
            const newCategory = this.assetCategoryRepository.create({
                main_category_name: dto.main_category_name,
                main_category_description: dto.main_category_description || '',
                is_active: 1,
                is_deleted: 0,
                created_at: now,
                updated_at: now,
                added_by: userExists.user_id,
            });
            newCategories.push({ dto, newCategory });
        }
        try {
            const toSave = newCategories.map((entry) => entry.newCategory);
            const savedCategories = await this.assetCategoryRepository.save(toSave);
            savedCategories.forEach((saved, index) => {
                successCategories.push(newCategories[index].dto);
            });
            if (savedCategories.length > 0) {
                await this.dropdownCache.invalidateMany([
                    dropdown_entities_1.DROPDOWN.CATEGORY,
                    dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                    dropdown_entities_1.DROPDOWN.ITEM,
                ]);
            }
        }
        catch (error) {
            console.error('❌ Error during bulk save:', error);
            newCategories.forEach((entry) => errorCategories.push({ ...entry.dto, reason: 'Batch save error' }));
        }
        return {
            status: successCategories.length
                ? common_1.HttpStatus.CREATED
                : common_1.HttpStatus.CONFLICT,
            message: successCategories.length && errorCategories.length
                ? 'Bulk categories created with some conflicts.'
                : successCategories.length
                    ? 'All categories created successfully.'
                    : 'No categories created. All entries had conflicts.',
            data: {
                created_count: successCategories.length,
                created_categories: successCategories,
                error_categories: errorCategories,
            },
        };
    }
    countAll() {
        try {
            return this.assetCategoryRepository.countBy({
                is_active: 1,
                is_deleted: 0,
            });
        }
        catch (error) {
            console.error('Error in countAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    findAll() {
        try {
            return this.assetCategoryRepository.find({
                order: {
                    main_category_name: 'ASC',
                },
                where: {
                    is_active: 1,
                    is_deleted: 0,
                },
            });
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getDropdown() {
        try {
            return await this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.CATEGORY, { shape: 'id-name' }, async () => this.assetCategoryRepository.find({
                select: ['main_category_id', 'main_category_name'],
                where: {
                    is_active: 1,
                    is_deleted: 0,
                },
                order: {
                    main_category_name: 'ASC',
                },
            }));
        }
        catch (error) {
            console.error('Error in getDropdown:', error);
            throw new Error('Error fetching dropdown data.');
        }
    }
    async deleteCategory(createAssetCategoryDto) {
        try {
            const existingUser = await this.assetCategoryRepository.findOneBy({
                main_category_id: createAssetCategoryDto.main_category_id,
            });
            const existingSubCategory = await this.assetSubCategoryRepository.findOneBy({
                main_category_id: createAssetCategoryDto.main_category_id,
                is_active: 1,
            });
            if (!existingUser) {
                return 'Category not found for deletion.';
            }
            if (existingSubCategory) {
                return 'Subcategory Exists! Unable to delete category.';
            }
            existingUser.is_active = 0;
            existingUser.is_deleted = 1;
            const savedUser = await this.assetCategoryRepository.save(existingUser);
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.CATEGORY,
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
            return savedUser;
        }
        catch (error) {
            console.error('Error in deleteCategory:', error.message);
            throw new Error(error.message || 'An error occurred while deleting the category.');
        }
    }
    async bulkDeleteCategories(categoryIds) {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            return {
                success: false,
                message: 'No categories provided for deletion.',
                details: [],
            };
        }
        const results = [];
        const categoriesToDelete = [];
        for (const id of categoryIds) {
            const category = await this.assetCategoryRepository.findOneBy({ main_category_id: id });
            if (!category) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Category not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            const activeSubCategory = await this.assetSubCategoryRepository.findOneBy({
                main_category_id: id,
                is_active: 1,
            });
            if (activeSubCategory) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory exists. Deletion not allowed.',
                    name: category.main_category_name,
                });
                continue;
            }
            categoriesToDelete.push(category);
            results.push({
                id,
                status: 'success',
                name: category.main_category_name,
            });
        }
        if (categoriesToDelete.length > 0) {
            for (const cat of categoriesToDelete) {
                console.log('Preparing to delete icon for category:', cat.main_category_icon);
                if (cat.main_category_icon) {
                    await (0, maincategory_helper_functions_1.deleteFileIfExists)(cat.main_category_icon);
                }
            }
        }
        if (categoriesToDelete.length > 0) {
            await this.assetCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0, is_deleted: 1 })
                .where('main_category_id IN (:...ids)', {
                ids: categoriesToDelete.map((c) => c.main_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.CATEGORY,
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Category ${successful[0].name} deleted successfully.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} categories deleted successfully.`;
        }
        else {
            message = 'No categories were deleted.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async activateCategories(categoryIds) {
        const results = [];
        const categoriesToActivate = [];
        for (const id of categoryIds) {
            const category = await this.assetCategoryRepository.findOneBy({ main_category_id: id });
            if (!category) {
                results.push({ id, status: 'failed', message: 'Category not found.', name: `ID ${id}` });
                continue;
            }
            if (category.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Category is already active.',
                    name: category.main_category_name,
                });
                continue;
            }
            categoriesToActivate.push(category);
            results.push({ id, status: 'success', name: category.main_category_name });
        }
        if (categoriesToActivate.length > 0) {
            await this.assetCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('main_category_id IN (:...ids)', {
                ids: categoriesToActivate.map((c) => c.main_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.CATEGORY,
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Category ${successful[0].name} marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} categories marked as active.`;
        }
        else {
            message = 'No categories were marked as active.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateCategories(categoryIds) {
        const results = [];
        const categoriesToDeactivate = [];
        for (const id of categoryIds) {
            const category = await this.assetCategoryRepository.findOneBy({ main_category_id: id });
            if (!category) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Category not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            const activeSubCategory = await this.assetSubCategoryRepository.findOneBy({
                main_category_id: id,
                is_active: 1,
            });
            const activeItem = await this.AssetItemRepositery.findOneBy({
                main_category_id: id,
                is_active: 1,
            });
            if (activeSubCategory || activeItem) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Category has active subcategories or items. Cannot inactivate.',
                    name: category.main_category_name,
                });
                continue;
            }
            categoriesToDeactivate.push(category);
            results.push({
                id,
                status: 'success',
                name: category.main_category_name,
            });
        }
        if (categoriesToDeactivate.length > 0) {
            await this.assetCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('main_category_id IN (:...ids)', {
                ids: categoriesToDeactivate.map((c) => c.main_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.CATEGORY,
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Category ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} categories marked as inactive.`;
        }
        else {
            message = 'No categories were marked as inactive.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async update(id, updateAssetCategoryDto) {
        if (!id) {
            throw new Error('Department ID Not Present');
        }
        console.log("updateAssetCategoryDto:11", updateAssetCategoryDto);
        const existingAsset = await this.assetCategoryRepository.findOneBy({
            main_category_id: id,
        });
        if (!existingAsset) {
            throw new Error('Department not found for updating.');
        }
        const icon = updateAssetCategoryDto.main_category_icon;
        console.log("icon", icon);
        if (updateAssetCategoryDto.main_category_icon) {
            const isBase64 = updateAssetCategoryDto.main_category_icon.startsWith('data:image');
            if (isBase64) {
                if (existingAsset.main_category_icon) {
                    await (0, maincategory_helper_functions_1.deleteFileIfExists)(existingAsset.main_category_icon);
                }
                const newIconPath = await (0, saveBase64Image_1.saveBase64Image)(updateAssetCategoryDto.main_category_icon, updateAssetCategoryDto.main_category_name || existingAsset.main_category_name);
                updateAssetCategoryDto.main_category_icon = newIconPath;
            }
        }
        Object.assign(existingAsset, updateAssetCategoryDto);
        const updatedAsset = await this.assetCategoryRepository.save(existingAsset);
        await this.dropdownCache.invalidateMany([
            dropdown_entities_1.DROPDOWN.CATEGORY,
            dropdown_entities_1.DROPDOWN.SUBCATEGORY,
            dropdown_entities_1.DROPDOWN.ITEM,
        ]);
        return updatedAsset;
    }
    async fetchSingleAssetCategoryData(deleteAssetSubCategoryDto) {
        const { main_category_id } = deleteAssetSubCategoryDto;
        if (!main_category_id) {
            throw new common_1.BadRequestException('Category ID is required');
        }
        try {
            const categoryData = await this.assetCategoryRepository
                .createQueryBuilder('asset_main_category')
                .where('asset_main_category.main_category_id = :main_category_id', {
                main_category_id,
            })
                .andWhere('asset_main_category.is_active = :is_active', { is_active: 1 })
                .andWhere('asset_main_category.is_deleted = :is_deleted', { is_deleted: 0 })
                .getOne();
            const subcategoryCount = await this.assetSubCategoryRepository
                .createQueryBuilder('sub')
                .where('sub.main_category_id = :main_category_id', { main_category_id })
                .andWhere('sub.is_deleted = 0')
                .andWhere('sub.is_active = 1')
                .getCount();
            const itemCount = await this.AssetItemRepositery
                .createQueryBuilder('item')
                .where('item.main_category_id = :main_category_id', { main_category_id })
                .andWhere('item.is_deleted = 0')
                .andWhere('item.is_active = 1')
                .getCount();
            console.log("subcategoryCount", subcategoryCount);
            console.log("itemCount", itemCount);
            return {
                ...categoryData,
                subcategoryCount,
                itemCount,
            };
        }
        catch (error) {
            throw new Error('An error occurred while fetching the category data');
        }
    }
    async exportCategoryCSV() {
        try {
            const whereCondition = { is_active: 1, is_deleted: 0 };
            const [results, total] = await this.assetCategoryRepository
                .createQueryBuilder('category')
                .where(whereCondition)
                .orderBy('category.main_category_id', 'DESC')
                .leftJoinAndSelect('category.added_by_user', 'added_by_user')
                .getManyAndCount();
            const decodedResults = results.map((category) => ({
                'Category Name': category.main_category_name,
                Description: category.main_category_description || '',
                'Added By': category.added_by_user || '',
                'Created At': category.created_at
                    ? new Date(category.created_at).toLocaleDateString()
                    : '',
                'Updated At': category.updated_at
                    ? new Date(category.updated_at).toLocaleDateString()
                    : '',
            }));
            return { decodedResults };
        }
        catch (error) {
            console.error('Error in exportSubcategoryCSV:', error);
            throw new Error('An error occurred while fetching subcategories.');
        }
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        console.log('public user id in asset', public_user_id);
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
};
exports.AssetCategoriesService = AssetCategoriesService;
exports.AssetCategoriesService = AssetCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(asset_category_entity_1.AssetCategory)),
    __param(1, (0, typeorm_2.InjectRepository)(asset_subcategory_entity_1.AssetSubcategory)),
    __param(2, (0, typeorm_2.InjectRepository)(asset_item_entity_1.AssetItem)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.DataSource,
        dropdown_cache_service_1.DropdownCacheService])
], AssetCategoriesService);
