"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetItemsFieldsMappingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_items_fields_mapping_entity_1 = require("./entities/asset-items-fields-mapping.entity");
const organizational_user_entity_1 = require("../../organizational-profile/entity/organizational-user.entity");
let AssetItemsFieldsMappingService = class AssetItemsFieldsMappingService {
    constructor(assetItemFieldsMappingRepository, dataSource) {
        this.assetItemFieldsMappingRepository = assetItemFieldsMappingRepository;
        this.dataSource = dataSource;
    }
    create(createAssetItemFieldsMappingDto) {
        return 'This action adds a new assetItemFieldsMapping';
    }
    countAll() {
        try {
            return this.assetItemFieldsMappingRepository.countBy({
                aif_is_active: 1,
                aif_is_deleted: 0,
            });
        }
        catch (error) {
            console.error('Error in countAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    async addItemFields(createAssetItemFieldsMappingDto) {
        const newItems = [];
        const existingItems = [];
        for (const dto of createAssetItemFieldsMappingDto) {
            if (dto.aif_mapping_id == null) {
                const newItem = new asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping();
                newItem.asset_item_id = dto.asset_item_id;
                newItem.aif_is_enabled = dto.aif_is_enabled;
                newItem.aif_is_mandatory = dto.aif_is_mandatory;
                newItem.aif_is_active = dto.aif_is_active;
                newItem.aif_is_deleted = dto.aif_is_deleted;
                newItem.aif_added_by = dto.aif_added_by;
                newItem.aif_description = dto.aif_description;
                newItem.asset_field_category_id = dto.asset_field_category_id;
                newItem.asset_field_id = dto.assetFields.asset_field_id;
                newItems.push(newItem);
            }
            else {
                const existingItem = new asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping();
                existingItem.aif_mapping_id = dto.aif_mapping_id;
                existingItem.asset_item_id = dto.asset_item_id;
                existingItem.aif_is_enabled = dto.aif_is_enabled;
                existingItem.aif_is_mandatory = dto.aif_is_mandatory;
                existingItem.aif_is_active = dto.aif_is_active;
                existingItem.aif_is_deleted = dto.aif_is_deleted;
                existingItem.aif_added_by = dto.aif_added_by;
                existingItem.aif_description = dto.aif_description;
                existingItem.asset_field_category_id = dto.asset_field_category_id;
                existingItem.asset_field_id = dto.assetFields.asset_field_id;
                console.log('existingItems ' +
                    existingItem.aif_is_enabled +
                    ' ' +
                    existingItem.aif_is_mandatory);
                existingItems.push(existingItem);
            }
        }
        try {
            let savedItems = await this.assetItemFieldsMappingRepository.save(newItems);
            const existingItemsToUpdate = await this.assetItemFieldsMappingRepository.save(existingItems);
            savedItems = [...savedItems, ...existingItemsToUpdate];
            return savedItems;
        }
        catch (error) {
            console.error('Error in insert:', error);
            throw new Error('An error occurred while inserting the item.');
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
    findAll() {
        try {
            return this.assetItemFieldsMappingRepository.find();
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('An error occurred while fetching categories.');
        }
    }
    findOne(id) {
        return `This action returns a #${id} assetItemFieldsMapping232`;
    }
    async findItemFields(asset_item_id, searchQuery, customFilters = {}, sortOrder) {
        try {
            const query = this.assetItemFieldsMappingRepository
                .createQueryBuilder('mapping')
                .leftJoinAndSelect('mapping.assetFields', 'assetFields')
                .leftJoinAndSelect('mapping.assetFieldCategory', 'category')
                .where('mapping.asset_item_id = :asset_item_id', { asset_item_id });
            if (searchQuery && searchQuery.trim() !== '') {
                query.andWhere(`(LOWER(COALESCE(assetFields.asset_field_name, '')) LIKE :search OR LOWER(COALESCE(assetFields.asset_field_value, '')) LIKE :search)`, { search: `%${searchQuery.toLowerCase()}%` });
            }
            for (const [key, value] of Object.entries(customFilters)) {
                if (value === undefined ||
                    value === null ||
                    value === '' ||
                    key === 'sortOrder')
                    continue;
                if (typeof value === 'object' && value.from && value.to) {
                    query.andWhere(`assetFields.${key} BETWEEN :from_${key} AND :to_${key}`, {
                        [`from_${key}`]: value.from,
                        [`to_${key}`]: value.to,
                    });
                }
                else {
                    query.andWhere(`CAST(assetFields.${key} AS TEXT) ILIKE :${key}`, {
                        [key]: `%${value}%`,
                    });
                }
            }
            if (sortOrder) {
                const [field, direction = 'ASC'] = sortOrder.split(':');
                query.orderBy(`assetFields.${field}`, direction.toUpperCase());
            }
            const results = await query.getMany();
            console.log('results', results);
            if (!results || results.length === 0) {
                return [];
            }
            const uniqueCategories = {};
            results.forEach((item) => {
                const categoryId = item.asset_field_category?.asset_field_category_id;
                if (!uniqueCategories[categoryId]) {
                    uniqueCategories[categoryId] = item.asset_field_category;
                }
            });
        }
        catch (error) {
            console.error('Error in findItemFields:', error);
            throw new Error('An error occurred while fetching item fields.');
        }
    }
    update(id, updateAssetItemFieldsMappingDto) {
        return `This action updates a #${id} assetItemFieldsMapping3233`;
    }
    remove(id) {
        return `This action removes a #${id} assetItemFieldsMapping233432`;
    }
};
exports.AssetItemsFieldsMappingService = AssetItemsFieldsMappingService;
exports.AssetItemsFieldsMappingService = AssetItemsFieldsMappingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_items_fields_mapping_entity_1.AssetItemsFieldsMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AssetItemsFieldsMappingService);
