import { AssignTargetType } from "../entities/asset-mapping.entity";
export declare class SingleAssignItemDto {
    serialId: number;
    targetType: AssignTargetType;
    targetId: number;
    created_by: number;
    notes?: string;
    detach_and_reassign?: boolean;
}
export declare class AssignAssetsDto {
    assignments: SingleAssignItemDto[];
}
