import { AssignTypeEnum } from '../entities/policy-master.entity';
export declare class UpdatePolicyDto {
    policy_name?: string;
    category?: string;
    applicable_type?: AssignTypeEnum;
    is_active?: boolean;
}
