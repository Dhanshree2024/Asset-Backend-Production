import { AssignTypeEnum } from '../entities/policy-master.entity';
export declare class CreatePolicyAcknowledgementDto {
    policy_id: number;
    policy_version_id: number;
    applicable_type: AssignTypeEnum;
    applicable_to_id: number;
    target_id: number;
    is_seen?: boolean;
    is_acknowledged?: boolean;
}
export declare class UpdatePolicyAcknowledgementDto {
    is_seen?: boolean;
    is_acknowledged?: boolean;
    is_forced_ack?: boolean;
}
export declare class GetPolicyAcknowledgementsDto {
    policy_id: number;
    policy_version_id: number;
    type: 'ACCEPTED' | 'NOT_ACCEPTED' | 'TOTAL';
}
