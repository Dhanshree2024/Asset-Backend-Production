import { AssignTargetType } from './asset-mapping.entity';
export declare enum AssetRelationCategoryEnum {
    OPERATIONAL = "OPERATIONAL",
    STRUCTURAL = "STRUCTURAL",
    SOFTWARE = "SOFTWARE",
    PHYSICAL = "PHYSICAL",
    INFRASTRUCTURE = "INFRASTRUCTURE",
    LIFECYCLE = "LIFECYCLE",
    DEPENDENCY = "DEPENDENCY",
    NETWORK = "NETWORK",
    MONITORING = "MONITORING",
    INTEGRATION = "INTEGRATION",
    SERVICE = "SERVICE",
    OTHER = "OTHER"
}
export declare enum AssetRelationCardinalityEnum {
    ONE_TO_ONE = "1:1",
    ONE_TO_MANY = "1:N",
    MANY_TO_ONE = "N:1",
    MANY_TO_MANY = "N:M"
}
export declare class AssetRelationType {
    code: string;
    forward_label: string;
    reverse_label: string;
    cardinality: AssetRelationCardinalityEnum;
    target_type: AssignTargetType;
    category: AssetRelationCategoryEnum;
    is_cycle_allowed: boolean;
    is_active: boolean;
    created_at: Date;
}
