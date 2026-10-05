import { SubModule } from './submodule.entity';
import { CasbinRule } from './casbin-rule.entity';
export declare class Module {
    id: number;
    name: string;
    code: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    submodules: SubModule[];
    casbinRules: CasbinRule[];
}
