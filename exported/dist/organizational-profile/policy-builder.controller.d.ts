import { Repository } from 'typeorm';
import { GetRolesByPermissionDto } from './dto/casbin/get-roles-by-permission.dto';
import { UpsertMultiplePoliciesNestedDto } from './dto/casbin/update-role-policy.dto';
import { CasbinRule } from './entity/policy-builder/casbin-rule.entity';
import { PolicyBuilderService } from './policy-builder.service';
export declare class PolicyBuilderController {
    private readonly service;
    private readonly casbinRuleRepo;
    constructor(service: PolicyBuilderService, casbinRuleRepo: Repository<CasbinRule>);
    getPoliciesByRole(role: string): Promise<unknown>;
    upsertMultiple(dto: UpsertMultiplePoliciesNestedDto): Promise<any[]>;
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
