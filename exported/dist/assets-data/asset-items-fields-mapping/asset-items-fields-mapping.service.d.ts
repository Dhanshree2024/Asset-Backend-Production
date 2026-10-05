import { CreateAssetItemsFieldsMappingDto } from './dto/create-asset-items-fields-mapping.dto';
import { UpdateAssetItemsFieldsMappingDto } from './dto/update-asset-items-fields-mapping.dto';
import { Repository, DataSource } from 'typeorm';
import { AssetItemsFieldsMapping } from './entities/asset-items-fields-mapping.entity';
export declare class AssetItemsFieldsMappingService {
    private assetItemFieldsMappingRepository;
    private readonly dataSource;
    constructor(assetItemFieldsMappingRepository: Repository<AssetItemsFieldsMapping>, dataSource: DataSource);
    create(createAssetItemFieldsMappingDto: CreateAssetItemsFieldsMappingDto): string;
    countAll(): Promise<number>;
    addItemFields(createAssetItemFieldsMappingDto: CreateAssetItemsFieldsMappingDto[]): Promise<AssetItemsFieldsMapping[]>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    findAll(): Promise<AssetItemsFieldsMapping[]>;
    findOne(id: number): string;
    findItemFields(asset_item_id: number, searchQuery?: string, customFilters?: Record<string, any>, sortOrder?: string): Promise<any[]>;
    update(id: number, updateAssetItemFieldsMappingDto: UpdateAssetItemsFieldsMappingDto): string;
    remove(id: number): string;
}
