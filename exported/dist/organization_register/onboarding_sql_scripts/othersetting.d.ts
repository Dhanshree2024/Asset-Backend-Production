import { DataSource } from 'typeorm';
export declare class otherSettingsOrgScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOtherSettingsOrgTable(schemaName: string): Promise<void>;
    insertOtherSettingsOrg(schemaName: string, orgSettings: {
        settings?: Record<string, any>;
        is_current?: boolean;
        created_by?: number;
        updated_by?: number;
        org_id?: number;
    }[]): Promise<void>;
}
