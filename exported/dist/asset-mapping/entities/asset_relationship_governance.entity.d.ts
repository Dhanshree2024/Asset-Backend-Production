import { AssignTargetType } from './asset-mapping.entity';
import { AssetRelationType } from './asset_relationship_type.entity';
export declare class AssetRelationshipGovernance {
    governance_id: number;
    rule_name: string;
    relation_type: string;
    relationTypeMeta: AssetRelationType;
    source_main_category_id: number;
    source_sub_category_id: number;
    source_item_id: number;
    target_entity_type: AssignTargetType;
    target_main_category_id: number;
    target_sub_category_id: number;
    target_item_id: number;
    is_allowed: boolean;
    validation_message: string;
    is_active: boolean;
    created_at: Date;
}
