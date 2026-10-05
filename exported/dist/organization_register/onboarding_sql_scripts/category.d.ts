import { DataSource } from 'typeorm';
export declare class CategoryScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createCategoryTable(schemaName: string): Promise<void>;
    insertAssetMainCategoryTable(schemaName: string, categories: {
        main_category_name: string;
        icon: string;
    }[]): Promise<void>;
}
