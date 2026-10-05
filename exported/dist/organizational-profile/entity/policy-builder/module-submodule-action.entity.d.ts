import { Module } from './module.entity';
import { SubModule } from './submodule.entity';
import { Action } from './action.entity';
export declare class ModuleSubmoduleAction {
    id: number;
    module_id: number;
    submodule_id: number;
    action_id: number;
    module: Module;
    submodule: SubModule;
    action: Action;
}
