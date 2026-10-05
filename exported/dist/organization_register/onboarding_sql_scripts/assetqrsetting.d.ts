import { DataSource } from 'typeorm';
export declare class qrCodeSettingsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createQrCodeSettingsTable(schemaName: string): Promise<void>;
    insertQrCodeSettings(schemaName: string, qrSettings: {
        settings: Record<string, any>;
        is_current?: boolean;
        created_by: number;
        updated_by?: number;
        asset_id_setting_id?: number;
        org_id?: number;
    }[]): Promise<void>;
}
