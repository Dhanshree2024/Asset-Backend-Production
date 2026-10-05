import { DataSource } from 'typeorm';
export declare class AssetRelationshipGovernanceScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createAssetRelationshipGovernanceTable(schemaName: string): Promise<void>;
    insertAssetRelationshipGovernance(schemaName: string, rules: {
        governance_id: number;
        rule_name: string;
        relation_type: string;
        source_main_category_id?: number | null;
        source_sub_category_id?: number | null;
        source_item_id?: number | null;
        target_entity_type: string;
        target_main_category_id?: number | null;
        target_sub_category_id?: number | null;
        target_item_id?: number | null;
        is_allowed: boolean;
        validation_message?: string | null;
        is_active: boolean;
    }[]): Promise<void>;
}
