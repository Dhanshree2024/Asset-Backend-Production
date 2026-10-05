import { DataSource } from 'typeorm';
export declare class assetCostCenterScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetCostCenterScriptTable(schemaName: string): Promise<void>;
    insertCostCenterTable(schemaName: string, costCenters: {
        cost_center_code: string;
        cost_center_contact_person?: string;
        cost_center_email?: string;
        department_id?: number;
        created_by?: number;
        cost_center_name?: string;
        cost_center_budget?: number;
        cost_center_spent?: number;
        cost_center_utilization?: number;
        cost_center_manger_name_id?: number;
    }[]): Promise<void>;
}
