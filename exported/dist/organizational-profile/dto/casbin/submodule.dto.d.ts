export declare class CreateSubModuleDto {
    name: string;
    code: string;
    description?: string;
    module_id: number;
}
export declare class UpdateSubModuleDto {
    name?: string;
    code?: string;
    description?: string;
    module_id?: number;
    enabled?: boolean;
}
