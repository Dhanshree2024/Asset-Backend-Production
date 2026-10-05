import { DataSource } from 'typeorm';
export declare class ItemFieldsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createItemFieldsTable(schemaName: string): Promise<void>;
    insertAssetFieldsTable(schemaName: string, subCategories: {
        asset_field_category_id: number;
        asset_field_name: string;
        asset_field_label_name: string;
        asset_field_type: string;
        asset_field_type_details?: string[];
    }[]): Promise<void>;
}
