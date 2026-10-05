import { SubModule } from './submodule.entity';
import { Action } from './action.entity';
import { Module as ModuleEntity } from './module.entity';
export declare class CasbinRule {
    id: number;
    ptype: string;
    v0: string;
    v1: string;
    v2: string;
    v3: string;
    v4: string;
    v5: string;
    module: ModuleEntity;
    submodule: SubModule;
    action: Action;
    isAllowed: boolean;
}
