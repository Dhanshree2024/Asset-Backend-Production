export declare enum PolicyAttributeType {
    ARRAY = "array",
    RANGE = "range",
    DATE_RANGE = "dateRange",
    EXACT = "exact"
}
export declare class PolicyAttributeDto {
    key: string;
    value: string;
    type: PolicyAttributeType;
    isRequired: boolean;
}
export declare class PolicyActionDto {
    actionId: number;
    attrs?: PolicyAttributeDto[];
}
export declare class PolicyModuleDto {
    moduleId: number;
    submoduleId?: number | null;
    actions: PolicyActionDto[];
}
export declare class CreateRolePolicyDto {
    roleId: number;
    policies: PolicyModuleDto[];
}
