export declare enum PolicyApplicableType {
    ROLE = "ROLE",
    USER = "USER"
}
export declare class PolicyAttributeDto {
    attr_key: string;
    attr_value: any;
    attr_type: 'array' | 'range' | 'dateRange' | 'exact';
    is_required: boolean;
}
export declare class AddPolicyDto {
    sub: number;
    moduleCode: number;
    subModuleCode: number;
    actionCode: number;
    domainCode?: number;
    attrs?: PolicyAttributeDto[];
    v4: PolicyApplicableType;
    isAllowed: boolean;
}
export declare class RoleAddPolicyDto {
    moduleCode: number;
    actionCode: number;
    domainCode?: number;
    attrs?: PolicyAttributeDto[];
    isAllowed: boolean;
}
