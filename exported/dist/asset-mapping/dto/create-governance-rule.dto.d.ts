import { AssignTargetType } from '../entities/asset-mapping.entity';
export declare class CreateGovernanceRuleDto {
    rule_name: string;
    relation_type: string;
    source_main_category_id?: number;
    source_sub_category_id?: number;
    source_item_id?: number;
    target_entity_type: AssignTargetType;
    target_main_category_id?: number;
    target_sub_category_id?: number;
    target_item_id?: number;
    is_allowed: boolean;
    validation_message?: string;
    is_active?: boolean;
}
export declare class UpdateGovernanceRuleDto {
    rule_name?: string;
    relation_type?: string;
    source_main_category_id?: number;
    source_sub_category_id?: number;
    source_item_id?: number;
    target_entity_type?: AssignTargetType;
    target_main_category_id?: number;
    target_sub_category_id?: number;
    target_item_id?: number;
    is_allowed?: boolean;
    validation_message?: string;
    is_active?: boolean;
}
