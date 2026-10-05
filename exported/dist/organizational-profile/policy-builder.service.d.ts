import { DataSource, Repository } from 'typeorm';
import { RedisService } from 'src/common/redis/redis.service';
import { Roles } from 'src/organization_roles_permission/entity/role.entity';
import { CasbinEnforcerService } from './casbin/casbin-enforcer.service';
import { GetRolesByPermissionDto } from './dto/casbin/get-roles-by-permission.dto';
import { UpsertMultiplePoliciesNestedDto } from './dto/casbin/update-role-policy.dto';
import { Action } from './entity/policy-builder/action.entity';
import { CasbinRule } from './entity/policy-builder/casbin-rule.entity';
import { Domain } from './entity/policy-builder/domain.entity';
import { ModuleSubmoduleAction } from './entity/policy-builder/module-submodule-action.entity';
import { Module } from './entity/policy-builder/module.entity';
import { PolicyAttribute } from './entity/policy-builder/policy-attribute.entity';
import { SpecialPermissionsMaster } from './entity/policy-builder/special-permission-master';
import { SubModule } from './entity/policy-builder/submodule.entity';
export declare class PolicyBuilderService {
    private readonly dataSource;
    private readonly redisService;
    private readonly casbin;
    private readonly moduleRepo;
    private readonly subModuleRepo;
    private readonly actionRepo;
    private readonly domainRepo;
    private readonly casbinRuleRepo;
    private readonly specialPermissionsRepo;
    private readonly policyAttrRepo;
    private readonly rolesRepo;
    private readonly msaRepo;
    constructor(dataSource: DataSource, redisService: RedisService, casbin: CasbinEnforcerService, moduleRepo: Repository<Module>, subModuleRepo: Repository<SubModule>, actionRepo: Repository<Action>, domainRepo: Repository<Domain>, casbinRuleRepo: Repository<CasbinRule>, specialPermissionsRepo: Repository<SpecialPermissionsMaster>, policyAttrRepo: Repository<PolicyAttribute>, rolesRepo: Repository<Roles>, msaRepo: Repository<ModuleSubmoduleAction>);
    getPoliciesByRole(role: string): Promise<unknown>;
    upsertMultiplePoliciesNested(dto: UpsertMultiplePoliciesNestedDto): Promise<any[]>;
    getRolesByPermission(query: GetRolesByPermissionDto): Promise<{
        success: boolean;
        role_ids: number[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        role_ids?: undefined;
    }>;
}
