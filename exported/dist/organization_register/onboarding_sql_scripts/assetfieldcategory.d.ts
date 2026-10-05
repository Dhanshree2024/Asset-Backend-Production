import { DataSource } from 'typeorm';
export declare class assetFieldCategoryScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetFieldCategoryScriptTable(schemaName: string): Promise<void>;
    insertFieldCategoryTable(schemaName: string, categories: {
        asset_field_category_name: string;
    }[]): Promise<void>;
}
