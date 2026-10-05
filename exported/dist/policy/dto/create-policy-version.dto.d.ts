import { PolicyPublishAction } from './create-policy.dto';
import { AssignTypeEnum } from '../entities/policy-master.entity';
export declare class CreatePolicyVersionDto {
    action: PolicyPublishAction;
    policy_id: number;
    policy_content?: string;
    category?: number[];
    policy_document?: string;
    applicable_type?: AssignTypeEnum;
    applicable_to?: number[];
    version: string;
}
