export declare const PERMISSION_META = "asset_permission_requirement";
export type PermissionRequirement = {
    kind: 'action';
    module: string;
    submodule: string;
    action: string;
} | {
    kind: 'special';
    module: string;
    submodule: string;
    attrKey: string;
};
export declare const RequireAction: (module: string, submodule: string, action: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireSpecial: (module: string, submodule: string, attrKey: string) => import("@nestjs/common").CustomDecorator<string>;
