import { AssignTypeEnum } from '../entities/policy-master.entity';
export declare enum PolicyPublishAction {
    DRAFT = "DRAFT",
    PUBLISH = "PUBLISH"
}
export declare class CreatePolicyDto {
    policy_name: string;
    version: string;
    category?: number[];
    applicable_to?: number[];
    applicable_type?: AssignTypeEnum;
    policy_content?: string;
    action: PolicyPublishAction;
}
