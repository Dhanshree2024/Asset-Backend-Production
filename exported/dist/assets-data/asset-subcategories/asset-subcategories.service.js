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
exports.AssetSubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const typeorm_2 = require("typeorm");
const asset_item_entity_1 = require("../asset-items/entities/asset-item.entity");
const database_service_1 = require("../../dynamic-schema/database.service");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
const asset_categories_service_1 = require("../asset-categories/asset-categories.service");
const asset_category_entity_1 = require("../asset-categories/entities/asset-category.entity");
const asset_subcategory_entity_1 = require("./entities/asset-subcategory.entity");
const saveBase64Image_1 = require("../../utils/saveBase64Image");
const maincategory_helper_functions_1 = require("../../utils/maincategory-helper-functions");
const dropdown_cache_service_1 = require("../../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../../common/redis/dropdown-entities");
let AssetSubcategoriesService = class AssetSubcategoriesService {
    constructor(assetSubCategoryRepository, categoryRepository, AssetItemRepositery, dataSource, databaseService, assetCategoriesService, dropdownCache) {
        this.assetSubCategoryRepository = assetSubCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.AssetItemRepositery = AssetItemRepositery;
        this.dataSource = dataSource;
        this.databaseService = databaseService;
        this.assetCategoriesService = assetCategoriesService;
        this.dropdownCache = dropdownCache;
    }
    async createNewAssetSubCategory(dto) {
        const allSubCategories = await this.assetSubCategoryRepository.find({
            where: { main_category_id: dto.main_category_id },
        });
        const existingUser = allSubCategories.find((item) => item.sub_category_name?.toLowerCase() ===
            dto.sub_category_name?.toLowerCase());
        if (existingUser) {
            if (existingUser.is_deleted === 1) {
                existingUser.is_deleted = 0;
                existingUser.is_active = 1;
                existingUser.updated_at = new Date();
                existingUser.sub_category_description =
                    dto.sub_category_description ?? existingUser.sub_category_description;
                existingUser.added_by = dto.added_by;
                const reactivatedItem = await this.assetSubCategoryRepository.save(existingUser);
                await this.dropdownCache.invalidateMany([
                    dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                    dropdown_entities_1.DROPDOWN.ITEM,
                ]);
                return {
                    status: common_1.HttpStatus.OK,
                    message: 'SubCategory reactivated successfully',
                    data: {
                        user: reactivatedItem,
                    },
                };
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.CONFLICT,
                message: `SubCategory '${dto.sub_category_name}' already exists.`,
                data: existingUser,
            }, common_1.HttpStatus.CONFLICT);
        }
        let subIconPath = dto.sub_category_icon;
        if (dto.sub_category_icon) {
            subIconPath = await (0, saveBase64Image_1.saveBase64ImageSubcategory)(dto.sub_category_icon, dto.sub_category_name);
        }
        const newItem = this.assetSubCategoryRepository.create({
            sub_category_name: dto.sub_category_name,
            main_category_id: dto.main_category_id,
            sub_category_description: dto.sub_category_description,
            sub_category_icon: subIconPath,
            added_by: dto.added_by,
            is_active: 1,
            is_deleted: 0,
            created_at: new Date(),
            updated_at: new Date(),
        });
        const savedUser = await this.assetSubCategoryRepository.save(newItem);
        await this.dropdownCache.invalidateMany([
            dropdown_entities_1.DROPDOWN.SUBCATEGORY,
            dropdown_entities_1.DROPDOWN.ITEM,
        ]);
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'Item created successfully',
            data: {
                user: savedUser,
            },
        };
    }
    async generateSubCategoryExcleTemplate() {
        try {
            const categories = await this.assetCategoriesService.findAll();
            const categoryNames = categories.map((cat) => cat.main_category_name.trim());
            const subCategoryMap = {};
            categories.forEach((cat) => {
                subCategoryMap[cat.main_category_name.trim()] = [];
            });
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('subcategory_template');
            const dataSheet = workbook.addSheet('Data');
            const instructions = [
                'Instructions:',
                '1. Fill in all required fields starting from row 7.',
                '2. Category column uses dropdown sourced from "Data" sheet.',
                '3. Do not edit the header row (Row 6).',
                '4. "Sub-Category Name" and "Description" are mandatory fields.',
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
            const columnWidths = [30, 30, 50];
            columnWidths.forEach((width, index) => {
                mainSheet.column(index + 1).width(width);
            });
            const headers = [
                { label: 'Category', required: true },
                { label: 'Sub-Category Name', required: true },
                { label: 'Sub-Category Description', required: false },
            ];
            headers.forEach((item, index) => {
                const label = item.required ? `${item.label} *` : item.label;
                mainSheet
                    .cell(6, index + 1)
                    .value(label)
                    .style({
                    bold: true,
                    fontColor: item.required ? 'FF0000' : '000000',
                });
            });
            const startRow = 7;
            const endRow = 1048576;
            categoryNames.forEach((catName, i) => {
                dataSheet.cell(i + 1, 1).value(catName);
            });
            mainSheet.range(`A${startRow}:A${endRow}`).dataValidation({
                type: 'list',
                formula1: `=Data!$A$1:$A$${categoryNames.length}`,
                allowBlank: false,
                showInputMessage: true,
                promptTitle: 'Select Category',
                prompt: 'Choose one from the dropdown',
                errorTitle: 'Invalid Category',
                error: 'Please select a valid category from the list.',
            });
            mainSheet.range(`B${startRow}:B${endRow}`).dataValidation({
                type: 'textLength',
                operator: 'greaterThan',
                formula1: '0',
                allowBlank: false,
                showInputMessage: true,
                promptTitle: 'Sub-Category Name',
                prompt: 'Required field. Should contain text.',
                errorTitle: 'Invalid Name',
                error: 'Sub-Category Name is required.',
            });
            mainSheet.range(`C${startRow}:C${endRow}`).dataValidation({
                type: 'textLength',
                operator: 'greaterThan',
                formula1: '0',
                allowBlank: false,
                showInputMessage: true,
                promptTitle: 'Sub-Category Description',
                prompt: 'Required field. Should contain text.',
                errorTitle: 'Invalid Description',
                error: 'Sub-Category Description is required.',
            });
            dataSheet.hidden(true);
            const buffer = await workbook.outputAsync();
            return buffer;
        }
        catch (error) {
            console.error('Error generating template:', error);
            throw new Error('Failed to generate Excel template');
        }
    }
    async bulkCreateSubcategories(dtos, user_id) {
        const successSubCategories = [];
        const errorSubCategories = [];
        const newSubCategories = [];
        const existingCategories = await this.categoryRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        const existingSubCategories = await this.assetSubCategoryRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        for (const dto of dtos) {
            const matchedCategory = existingCategories.find((category) => category.main_category_name?.trim().toLowerCase() ===
                dto.main_category_name?.trim().toLowerCase());
            dto.main_category_id = matchedCategory
                ? matchedCategory.main_category_id
                : null;
            const subcategoryExists = existingSubCategories.some((subcategory) => subcategory.sub_category_name?.trim().toLowerCase() ===
                dto.sub_category_name?.trim().toLowerCase());
            if (subcategoryExists) {
                errorSubCategories.push({
                    ...dto,
                    reason: 'Subcategory already exists',
                });
                continue;
            }
            const newSubCategory = this.assetSubCategoryRepository.create({
                main_category_id: dto.main_category_id,
                sub_category_name: dto.sub_category_name,
                sub_category_description: dto.sub_category_description,
                is_active: 1,
                is_deleted: 0,
                created_at: dto.created_at,
                updated_at: dto.updated_at,
            });
            newSubCategories.push({ dto, newSubCategory });
        }
        try {
            const toSave = newSubCategories.map((entry) => entry.newSubCategory);
            const savedSubCategories = await this.assetSubCategoryRepository.save(toSave);
            savedSubCategories.forEach((saved, index) => {
                successSubCategories.push(newSubCategories[index].dto);
            });
            if (savedSubCategories.length > 0) {
                await this.dropdownCache.invalidateMany([
                    dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                    dropdown_entities_1.DROPDOWN.ITEM,
                ]);
            }
        }
        catch (error) {
            console.error('Error during bulk save:', error);
            newSubCategories.forEach((entry) => errorSubCategories.push({ ...entry.dto, reason: 'Batch save error' }));
        }
        return {
            status: successSubCategories.length
                ? common_1.HttpStatus.CREATED
                : common_1.HttpStatus.CONFLICT,
            message: successSubCategories.length && errorSubCategories.length
                ? 'Bulk subcategories created with some conflicts.'
                : successSubCategories.length
                    ? 'All subcategories created successfully.'
                    : 'No subcategories created. All entries had conflicts.',
            data: {
                created_count: successSubCategories.length,
                created_subcategories: successSubCategories,
                error_subcategories: errorSubCategories,
            },
        };
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async activatesubCategories(sub_category_ids) {
        const results = [];
        const subcategoriesToActivate = [];
        for (const id of sub_category_ids) {
            const subcategory = await this.assetSubCategoryRepository.findOneBy({
                sub_category_id: id,
            });
            if (!subcategory) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (subcategory.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory is already active.',
                    name: subcategory.sub_category_name,
                });
                continue;
            }
            subcategoriesToActivate.push(subcategory);
            results.push({
                id,
                status: 'success',
                name: subcategory.sub_category_name,
            });
        }
        if (subcategoriesToActivate.length > 0) {
            await this.assetSubCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('sub_category_id IN (:...ids)', {
                ids: subcategoriesToActivate.map((sc) => sc.sub_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Subcategory ${successful[0].name} marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} subcategories marked as active.`;
        }
        else {
            message = 'No subcategories were marked as active.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateSubCategories(sub_category_ids) {
        const results = [];
        const subcategoriesToDeactivate = [];
        for (const id of sub_category_ids) {
            const subcategory = await this.assetSubCategoryRepository.findOneBy({
                sub_category_id: id,
            });
            if (!subcategory) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            const activeItem = await this.AssetItemRepositery.findOneBy({
                sub_category_id: id,
                is_active: 1,
            });
            if (activeItem) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory has active items. Cannot deactivate.',
                    name: subcategory.sub_category_name,
                });
                continue;
            }
            subcategoriesToDeactivate.push(subcategory);
            results.push({
                id,
                status: 'success',
                name: subcategory.sub_category_name,
            });
        }
        if (subcategoriesToDeactivate.length > 0) {
            await this.assetSubCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('sub_category_id IN (:...ids)', {
                ids: subcategoriesToDeactivate.map((sc) => sc.sub_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Subcategory ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} subcategories marked as inactive.`;
        }
        else {
            message = 'No subcategories were marked as inactive.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async moveSubcategory(main_category_id, sub_category_id) {
        console.log('main_category_id', main_category_id);
        console.log('sub_category_id', sub_category_id);
        const subcategory = await this.assetSubCategoryRepository.findOne({
            where: { sub_category_id },
        });
        if (!subcategory) {
            throw new Error(`Sub Category with id ${sub_category_id} not found`);
        }
        subcategory.main_category_id = main_category_id;
        await this.assetSubCategoryRepository.save(subcategory);
        const childItems = await this.AssetItemRepositery.find({
            where: { sub_category_id: sub_category_id },
        });
        for (const child of childItems) {
            child.main_category_id = main_category_id;
            await this.AssetItemRepositery.save(child);
        }
        await this.dropdownCache.invalidateMany([
            dropdown_entities_1.DROPDOWN.SUBCATEGORY,
            dropdown_entities_1.DROPDOWN.ITEM,
        ]);
        return { movedSubcategory: subcategory, moveditschilditems: childItems };
    }
    findAll() {
        try {
            return this.assetSubCategoryRepository.find({
                order: {
                    sub_category_name: 'ASC',
                },
                where: { is_active: 1, is_deleted: 0 },
            });
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async getAllSubCategories(page, limit, searchQuery, customFilters) {
        try {
            let queryBuilder = this.assetSubCategoryRepository
                .createQueryBuilder('asset_sub_category')
                .leftJoinAndSelect('asset_sub_category.main_category', 'main');
            queryBuilder = queryBuilder
                .where('asset_sub_category.is_active = :isActive', { isActive: 1 })
                .andWhere('asset_sub_category.is_deleted = :isDeleted', {
                isDeleted: 0,
            });
            if (searchQuery && searchQuery.trim() !== '') {
                queryBuilder = queryBuilder.andWhere('(asset_sub_category.sub_category_name ILIKE :search OR main.main_category_name ILIKE :search)', { search: `%${searchQuery}%` });
            }
            if (customFilters && Object.keys(customFilters).length > 0) {
                for (const [key, value] of Object.entries(customFilters)) {
                    if (value === undefined ||
                        value === null ||
                        value === '' ||
                        key === 'sortOrder')
                        continue;
                    if (typeof value === 'object' && value.from && value.to) {
                        queryBuilder = queryBuilder.andWhere(`asset_sub_category.${key} BETWEEN :from_${key} AND :to_${key}`, {
                            [`from_${key}`]: value.from,
                            [`to_${key}`]: value.to,
                        });
                    }
                    else if (key === 'main_category_name') {
                        queryBuilder = queryBuilder.andWhere('main.main_category_name ILIKE :mainCategoryName', { mainCategoryName: `%${value}%` });
                    }
                    else {
                        queryBuilder = queryBuilder.andWhere(`CAST(asset_sub_category.${key} AS TEXT) ILIKE :${key}`, { [key]: `%${value}%` });
                    }
                }
            }
            let sortField = 'asset_sub_category.sub_category_name';
            let sortDirection = 'ASC';
            if (customFilters?.sortOrder) {
                const sortOrder = customFilters.sortOrder.toLowerCase();
                if (sortOrder === 'desc') {
                    sortDirection = 'DESC';
                }
                else if (sortOrder === 'asc') {
                    sortDirection = 'ASC';
                }
                else if (sortOrder === 'newest') {
                    sortField = 'asset_sub_category.created_at';
                    sortDirection = 'DESC';
                }
                else if (sortOrder === 'oldest') {
                    sortField = 'asset_sub_category.created_at';
                    sortDirection = 'ASC';
                }
            }
            const [results, total] = await queryBuilder
                .orderBy(sortField, sortDirection)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data: results,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.error('Error fetching subcategories:', error);
            throw new common_1.BadRequestException(`Error fetching asset subcategories: ${error.message}`);
        }
    }
    async getSubCategoriesByCategory(mainCategoryId) {
        try {
            return await this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.SUBCATEGORY, { shape: 'id-name', mainCategoryId }, async () => {
                const query = this.assetSubCategoryRepository
                    .createQueryBuilder('subCategory')
                    .select([
                    'subCategory.sub_category_id',
                    'subCategory.sub_category_name',
                ])
                    .where('subCategory.is_active = :active', { active: 1 })
                    .andWhere('subCategory.is_deleted = :deleted', { deleted: 0 });
                if (mainCategoryId) {
                    query.andWhere('subCategory.main_category_id = :mainCategoryId', {
                        mainCategoryId,
                    });
                }
                return await query
                    .orderBy('subCategory.sub_category_name', 'ASC')
                    .getMany();
            });
        }
        catch (error) {
            console.error('Error in getSubCategoriesByCategory:', error);
            throw new Error('Error fetching subcategories.');
        }
    }
    async exportFilteredExcelForSubCategories({ search, filters, }) {
        const queryBuilder = this.assetSubCategoryRepository
            .createQueryBuilder('asset_sub_category')
            .leftJoinAndSelect('asset_sub_category.main_category', 'main')
            .where('asset_sub_category.is_active = :isActive', { isActive: 1 })
            .andWhere('asset_sub_category.is_deleted = :isDeleted', { isDeleted: 0 });
        if (search?.trim()) {
            const normalizedSearch = search.trim().replace(/\s+/g, ' ');
            queryBuilder.andWhere(`(asset_sub_category.sub_category_name ILIKE :search OR main.main_category_name ILIKE :search)`, { search: `%${normalizedSearch}%` });
        }
        for (const [key, value] of Object.entries(filters || {})) {
            if (!value || key === 'sortOrder')
                continue;
            if (typeof value === 'object' && value.from && value.to) {
                queryBuilder.andWhere(`asset_sub_category.${key} BETWEEN :from_${key} AND :to_${key}`, {
                    [`from_${key}`]: value.from,
                    [`to_${key}`]: value.to,
                });
            }
            else if (key === 'main_category_id') {
                queryBuilder.andWhere(`asset_sub_category.main_category_id = :mainCategoryId`, { mainCategoryId: value });
            }
            else {
                queryBuilder.andWhere(`CAST(asset_sub_category.${key} AS TEXT) ILIKE :${key}`, { [key]: `%${value}%` });
            }
        }
        let sortField = 'asset_sub_category.sub_category_name';
        let sortDirection = 'ASC';
        if (filters?.sortOrder) {
            const order = filters.sortOrder.toLowerCase();
            if (order === 'desc')
                sortDirection = 'DESC';
            else if (order === 'asc')
                sortDirection = 'ASC';
            else if (order === 'newest') {
                sortField = 'asset_sub_category.created_at';
                sortDirection = 'DESC';
            }
            else if (order === 'oldest') {
                sortField = 'asset_sub_category.created_at';
                sortDirection = 'ASC';
            }
        }
        queryBuilder.orderBy(sortField, sortDirection);
        const results = await queryBuilder.getMany();
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0).name('Asset Sub Categories');
        const headers = [
            'Sr. No.',
            'Sub Category Name',
            'Main Category',
            'Description',
        ];
        headers.forEach((header, i) => {
            sheet
                .cell(1, i + 1)
                .value(header)
                .style({ bold: true });
        });
        results.forEach((item, index) => {
            const row = index + 2;
            sheet.cell(row, 1).value(index + 1);
            sheet.cell(row, 2).value(item.sub_category_name || '');
            sheet.cell(row, 3).value(item.main_category?.main_category_name || '');
            sheet.cell(row, 4).value(item.sub_category_description || '');
        });
        return await workbook.outputAsync();
    }
    async fetchSingleAssetSubCategoryData(deleteAssetSubCategoryDto) {
        const { sub_category_id } = deleteAssetSubCategoryDto;
        if (!sub_category_id) {
            throw new common_1.BadRequestException('Sub Category ID is required');
        }
        try {
            const itemData = await this.assetSubCategoryRepository
                .createQueryBuilder('asset_sub_category')
                .where('asset_sub_category.sub_category_id = :sub_category_id', {
                sub_category_id,
            })
                .andWhere('asset_sub_category.is_active = :is_active', { is_active: 1 })
                .andWhere('asset_sub_category.is_deleted = :is_deleted', {
                is_deleted: 0,
            })
                .getOne();
            const itemCount = await this.AssetItemRepositery.createQueryBuilder('item')
                .where('item.sub_category_id = :sub_category_id', { sub_category_id })
                .andWhere('item.is_deleted = 0')
                .andWhere('item.is_active = 1')
                .getCount();
            if (!itemData) {
                return {
                    status: 404,
                    message: `Sub Category with ID ${sub_category_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Sub Category fetched successfully',
                data: {
                    ...itemData,
                    itemCount,
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the Sub Category',
                error: error.message,
            };
        }
    }
    async updateSubCategoryData(updateAssetSubCategorydto) {
        const { sub_category_id } = updateAssetSubCategorydto;
        if (!sub_category_id) {
            throw new Error('Sub Category ID Not Present');
        }
        console.log('updateAssetSubCategorydto:', updateAssetSubCategorydto);
        const existingSubCategory = await this.assetSubCategoryRepository.findOne({
            where: { sub_category_id },
        });
        if (!existingSubCategory) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Sub Category with ID ${sub_category_id} not found.`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const icon = updateAssetSubCategorydto.sub_category_icon;
        console.log('icon:', icon);
        if (updateAssetSubCategorydto.sub_category_icon) {
            const isBase64 = typeof updateAssetSubCategorydto.sub_category_icon === 'string' &&
                updateAssetSubCategorydto.sub_category_icon.startsWith('data:image');
            if (isBase64) {
                if (existingSubCategory.sub_category_icon) {
                    await (0, maincategory_helper_functions_1.deleteFileIfExists)(existingSubCategory.sub_category_icon);
                }
                const newIconPath = await (0, saveBase64Image_1.saveBase64ImageSubcategory)(updateAssetSubCategorydto.sub_category_icon, updateAssetSubCategorydto.sub_category_name ||
                    existingSubCategory.sub_category_name);
                updateAssetSubCategorydto.sub_category_icon = newIconPath;
            }
        }
        Object.assign(existingSubCategory, updateAssetSubCategorydto);
        const updatedSubCategory = await this.assetSubCategoryRepository.save(existingSubCategory);
        await this.dropdownCache.invalidateMany([
            dropdown_entities_1.DROPDOWN.SUBCATEGORY,
            dropdown_entities_1.DROPDOWN.ITEM,
        ]);
        return updatedSubCategory;
    }
    async bulkDeleteSubCategories(subCategoryIds) {
        if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
            return {
                success: false,
                message: 'No subcategories provided for deletion.',
                details: [],
            };
        }
        const results = [];
        const subCategoriesToDelete = [];
        for (const id of subCategoryIds) {
            const subCategory = await this.assetSubCategoryRepository.findOne({
                where: { sub_category_id: id },
            });
            if (!subCategory) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Subcategory not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            subCategoriesToDelete.push(subCategory);
            results.push({
                id,
                status: 'success',
                name: subCategory.sub_category_name,
            });
        }
        if (subCategoriesToDelete.length > 0) {
            for (const cat of subCategoriesToDelete) {
                console.log('Preparing to delete icon for category:', cat.sub_category_icon);
                if (cat.sub_category_icon) {
                    await (0, maincategory_helper_functions_1.deleteFileIfExists)(cat.sub_category_icon);
                }
            }
        }
        if (subCategoriesToDelete.length > 0) {
            await this.assetSubCategoryRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0, is_deleted: 1 })
                .where('sub_category_id IN (:...ids)', {
                ids: subCategoriesToDelete.map((c) => c.sub_category_id),
            })
                .execute();
            await this.dropdownCache.invalidateMany([
                dropdown_entities_1.DROPDOWN.SUBCATEGORY,
                dropdown_entities_1.DROPDOWN.ITEM,
            ]);
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Subcategory ${successful[0].name} deleted successfully.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} subcategories deleted successfully.`;
        }
        else {
            message = 'No subcategories were deleted.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async getSubCategoryDropdown() {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.SUBCATEGORY, { shape: 'label-value' }, async () => {
            const subcategories = await this.assetSubCategoryRepository.find({
                where: { is_active: 1, is_deleted: 0 },
            });
            return subcategories.map((sub) => ({
                label: sub.sub_category_name,
                value: sub.sub_category_id,
            }));
        });
    }
    async getSubCategoriesByCategoryDropdown(categoryIds) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.SUBCATEGORY, { shape: 'id-name', categoryIds }, async () => {
            const qb = this.assetSubCategoryRepository
                .createQueryBuilder('sub')
                .select(['sub.sub_category_id', 'sub.sub_category_name'])
                .where('sub.is_active = 1')
                .andWhere('sub.is_deleted = 0');
            let ids = [];
            if (categoryIds) {
                ids = Array.isArray(categoryIds)
                    ? categoryIds.map(Number)
                    : String(categoryIds)
                        .split(',')
                        .map((id) => Number(id));
                ids = ids.filter((id) => !Number.isNaN(id));
            }
            if (ids.length > 0) {
                qb.andWhere('sub.main_category_id IN (:...ids)', { ids });
            }
            return qb.orderBy('sub.sub_category_name', 'ASC').getMany();
        });
    }
};
exports.AssetSubcategoriesService = AssetSubcategoriesService;
exports.AssetSubcategoriesService = AssetSubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_subcategory_entity_1.AssetSubcategory)),
    __param(1, (0, typeorm_1.InjectRepository)(asset_category_entity_1.AssetCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(asset_item_entity_1.AssetItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        database_service_1.DatabaseService,
        asset_categories_service_1.AssetCategoriesService,
        dropdown_cache_service_1.DropdownCacheService])
], AssetSubcategoriesService);
