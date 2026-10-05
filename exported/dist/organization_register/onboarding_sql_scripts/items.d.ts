import { DataSource } from 'typeorm';
export declare class ItemsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createItemsTable(schemaName: string): Promise<void>;
    insertAssetItemTable(schemaName: string, subCategories: {
        main_category_id: number;
        sub_category_id: number;
        asset_item_name: string;
        is_licensable: boolean;
        item_type: string;
        asset_item_icon?: string;
        has_serials: boolean;
        import_barcode: boolean;
        warranty_type: string[];
        has_depreciation: boolean;
        asset_type?: string;
        company_act_asset_life?: number | null;
        company_depreciation_rate?: number | null;
        it_act_depreciation_rate?: number | null;
        it_act_asset_life?: number | null;
        asset_block?: number | null;
        asset_block_it?: number | null;
    }[]): Promise<void>;
}
