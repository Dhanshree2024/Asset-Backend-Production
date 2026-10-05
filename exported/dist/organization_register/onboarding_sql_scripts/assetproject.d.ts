import { DataSource } from 'typeorm';
export declare class assetProjectScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetProjectTable(schemaName: string): Promise<void>;
    insertProjectTable(schemaName: string, projects: {
        project_name: string;
        contact_person?: string;
        project_email?: string;
        department_id?: number;
        created_by?: number;
        project_code?: string;
    }[]): Promise<void>;
}
