import { AssignAssetsDto } from './create-asset-mapping.dto';
import { AssignTargetType } from '../entities/asset-mapping.entity';
declare const UpdateAssetMappingDto_base: typeof AssignAssetsDto;
export declare class UpdateAssetMappingDto extends UpdateAssetMappingDto_base {
}
export interface DependentReturnDecisionDto {
    serial_id: number;
    action: 'RETURN_DETACH' | 'RETURN_BUNDLE' | 'KEEP_WITH_USER' | 'REASSIGN';
    target_user_id?: number;
    condition?: string;
}
export declare class ReassignItemDto {
    mapping_id: number;
    serialId: number;
    targetType: AssignTargetType;
    targetId: number;
    notes?: string;
    detach_and_reassign?: boolean;
}
export declare class ReassignAssetsDto {
    reassignments: ReassignItemDto[];
    targetType: AssignTargetType;
    returns: ReturnItemDto[];
    reason?: string;
    dependents?: DependentReturnDecisionDto[];
}
export declare class ReturnItemDto {
    mapping_id: number;
    serialId: number;
    notes?: string;
    reason?: string;
    condition?: string;
    dependents?: DependentReturnDecisionDto[];
}
export declare class ReturnScrapDto {
    serialIds: number[];
    notes?: string;
}
export {};
