export declare const TechnicianDefaultPermission: ({
    module: number;
    submodule: number;
    actions: {
        ADD: boolean;
        VIEW: boolean;
        EDIT?: undefined;
        IMPORT?: undefined;
        EXPORT?: undefined;
        ASSIGN?: undefined;
        PRINT?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        ADD: boolean;
        VIEW: boolean;
        EDIT: boolean;
        IMPORT: boolean;
        EXPORT?: undefined;
        ASSIGN?: undefined;
        PRINT?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        VIEW: boolean;
        EDIT: boolean;
        EXPORT: boolean;
        ASSIGN: boolean;
        ADD?: undefined;
        IMPORT?: undefined;
        PRINT?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        VIEW: boolean;
        EDIT: boolean;
        ADD?: undefined;
        IMPORT?: undefined;
        EXPORT?: undefined;
        ASSIGN?: undefined;
        PRINT?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        VIEW: boolean;
        ADD?: undefined;
        EDIT?: undefined;
        IMPORT?: undefined;
        EXPORT?: undefined;
        ASSIGN?: undefined;
        PRINT?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        PRINT: boolean;
        ADD?: undefined;
        VIEW?: undefined;
        EDIT?: undefined;
        IMPORT?: undefined;
        EXPORT?: undefined;
        ASSIGN?: undefined;
    };
} | {
    module: number;
    submodule: number;
    actions: {
        ADD: boolean;
        VIEW: boolean;
        EDIT: boolean;
        IMPORT?: undefined;
        EXPORT?: undefined;
        ASSIGN?: undefined;
        PRINT?: undefined;
    };
})[];
