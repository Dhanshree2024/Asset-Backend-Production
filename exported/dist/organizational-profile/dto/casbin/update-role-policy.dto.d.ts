export declare class PolicyAttrDto {
    moduleId: number;
    submoduleId: number;
    attrKey: string;
    attrValue: string;
    attrType: 'array' | 'range' | 'dateRange' | 'exact';
    isRequired: boolean;
}
export declare class ActionDto {
    id: number;
    code: string;
    isAllowed: boolean;
    attrs?: PolicyAttrDto[];
}
export declare class SubModuleDto {
    id: number;
    name: string;
    actions: ActionDto[];
}
export declare class ModuleDto {
    id: number;
    name: string;
    submodules: SubModuleDto[];
}
export declare class RoleDataDto {
    id: number;
    name: string;
    description?: string;
    isExternal: boolean;
    is2FA: boolean;
    type?: string;
}
export declare class UpsertMultiplePoliciesNestedDto {
    roleId: number;
    modules: ModuleDto[];
    attrs: PolicyAttrDto[];
    roleData: RoleDataDto;
}
