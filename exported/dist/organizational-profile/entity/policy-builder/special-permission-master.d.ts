export declare enum SpecialPermissionAttributeEnum {
    ARRAY = "array",
    RANGE = "range",
    DATE_RANGE = "dateRange",
    EXACT = "exact"
}
import { Module } from './module.entity';
import { SubModule } from './submodule.entity';
export declare class SpecialPermissionsMaster {
    id: number;
    module_id: number;
    submodule_id: number;
    attr_key: string;
    attr_value: string;
    attr_type: SpecialPermissionAttributeEnum;
    is_required: boolean;
    created_at: Date;
    updated_at: Date;
    description: string;
    module: Module;
    submodule: SubModule;
}
