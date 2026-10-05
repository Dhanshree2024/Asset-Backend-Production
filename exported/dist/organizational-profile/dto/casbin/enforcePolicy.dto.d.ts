import { PolicyApplicableType } from './add-policy.dto';
export declare class EnforcePolicyDto {
    sub: string;
    moduleCode: string;
    actionCode: string;
    domainCode?: string;
    v4: PolicyApplicableType;
    attrs?: Record<string, any>;
}
