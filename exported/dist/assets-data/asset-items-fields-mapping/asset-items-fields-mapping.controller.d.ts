import { AssetItemsFieldsMappingService } from './asset-items-fields-mapping.service';
import { CreateAssetItemsFieldsMappingDto } from './dto/create-asset-items-fields-mapping.dto';
import { UpdateAssetItemsFieldsMappingDto } from './dto/update-asset-items-fields-mapping.dto';
import { Response, Request } from 'express';
import { AssetItemsFieldsMapping } from './entities/asset-items-fields-mapping.entity';
export declare class AssetItemsFieldsMappingController {
    private readonly assetItemsFieldsMappingService;
    constructor(assetItemsFieldsMappingService: AssetItemsFieldsMappingService);
    create(createAssetItemsFieldsMappingDto: CreateAssetItemsFieldsMappingDto): string;
    insertItemFields(createAssetItemFieldsMappingDto: CreateAssetItemsFieldsMappingDto[], req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(): Promise<AssetItemsFieldsMapping[]>;
    countAll(): Promise<number>;
    findItemFields(asset_item_id: number, searchQuery?: string, customFiltersStr?: string, sortOrder?: string): Promise<any[]>;
    findOne(id: string): string;
    update(id: string, updateAssetItemsFieldsMappingDto: UpdateAssetItemsFieldsMappingDto): string;
    remove(id: string): string;
}
