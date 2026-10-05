import { Repository } from 'typeorm';
import { Domain } from '../entity/policy-builder/domain.entity';
import { PolicyAttribute } from '../entity/policy-builder/policy-attribute.entity';
import { CasbinRule } from '../entity/policy-builder/casbin-rule.entity';
import { Action } from '../entity/policy-builder/action.entity';
import { Module } from '../entity/policy-builder/module.entity';
import { SubModule } from '../entity/policy-builder/submodule.entity';
interface PolicyAttr {
    key: string;
    value: any;
    type: 'array' | 'range' | 'dateRange' | 'exact';
    is_required?: boolean;
}
export declare class CasbinEnforcerService {
    private readonly moduleRepo;
    private readonly subModuleRepo;
    private readonly actionRepo;
    private readonly domainRepo;
    private readonly policyAttrRepo;
    private readonly casbinRuleRepo;
    constructor(moduleRepo: Repository<Module>, subModuleRepo: Repository<SubModule>, actionRepo: Repository<Action>, domainRepo: Repository<Domain>, policyAttrRepo: Repository<PolicyAttribute>, casbinRuleRepo: Repository<CasbinRule>);
    private enforcerMap;
    dynamicAbacMatch: (requestAttrs?: Record<string, any>, policyAttrs?: PolicyAttr[]) => Promise<boolean>;
    private getEnforcer;
    addPolicy(tenantSchema: string, sub: string, obj: string, act: string, dom?: string, v4?: string, v5?: string): Promise<boolean>;
    removePolicy(tenantSchema: string, sub: string, obj: string, act: string, dom?: string, v4?: string, v5?: string): Promise<boolean>;
    getPolicies(tenantSchema: string): Promise<string[][]>;
}
export {};
