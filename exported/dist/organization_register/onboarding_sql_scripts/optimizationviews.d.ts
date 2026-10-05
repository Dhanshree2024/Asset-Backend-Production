import { DataSource } from 'typeorm';
export declare class OptimizationViewScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAllViews(schemaName: string): Promise<void>;
    private createPaginationIndexes;
    private v_branch_asset_counts;
    private v_location_asset_counts;
    private v_location_child_count;
    createLocationHierarchyView(schemaName: string): Promise<void>;
    private v_vendor_asset_counts;
    private v_cost_center_asset_counts;
    private v_project_asset_counts;
    private branch_asset_counts;
}
