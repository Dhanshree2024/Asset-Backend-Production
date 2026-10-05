import { PolicyMaster, AssignTypeEnum } from './policy-master.entity';
import { PolicyVersion } from './policy-version.entity';
export declare class PolicyAcknowledgement {
    ak_id: number;
    policy_id: number;
    policy: PolicyMaster;
    policy_version_id: number;
    policy_version: PolicyVersion;
    applicable_type: AssignTypeEnum;
    applicable_to_id: number;
    target_id: number;
    is_acknowledged: boolean;
    is_forced_ack: boolean;
    is_seen: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}
