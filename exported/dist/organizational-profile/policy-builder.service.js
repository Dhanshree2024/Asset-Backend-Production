"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyBuilderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../common/redis/redis.service");
const role_entity_1 = require("../organization_roles_permission/entity/role.entity");
const casbin_enforcer_service_1 = require("./casbin/casbin-enforcer.service");
const action_entity_1 = require("./entity/policy-builder/action.entity");
const casbin_rule_entity_1 = require("./entity/policy-builder/casbin-rule.entity");
const domain_entity_1 = require("./entity/policy-builder/domain.entity");
const module_submodule_action_entity_1 = require("./entity/policy-builder/module-submodule-action.entity");
const module_entity_1 = require("./entity/policy-builder/module.entity");
const policy_attribute_entity_1 = require("./entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("./entity/policy-builder/special-permission-master");
const submodule_entity_1 = require("./entity/policy-builder/submodule.entity");
let PolicyBuilderService = class PolicyBuilderService {
    constructor(dataSource, redisService, casbin, moduleRepo, subModuleRepo, actionRepo, domainRepo, casbinRuleRepo, specialPermissionsRepo, policyAttrRepo, rolesRepo, msaRepo) {
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.casbin = casbin;
        this.moduleRepo = moduleRepo;
        this.subModuleRepo = subModuleRepo;
        this.actionRepo = actionRepo;
        this.domainRepo = domainRepo;
        this.casbinRuleRepo = casbinRuleRepo;
        this.specialPermissionsRepo = specialPermissionsRepo;
        this.policyAttrRepo = policyAttrRepo;
        this.rolesRepo = rolesRepo;
        this.msaRepo = msaRepo;
    }
    async getPoliciesByRole(role) {
        try {
            const cacheKey = `orgnizationprofile-policiesrole:${role}`;
            const cached = await this.redisService.get(cacheKey);
            console.log("CACHED:", cached);
            if (cached) {
                console.log('REDIS HIT:ORGNIZATION POLICIESROLES');
                if (cached != null) {
                    return cached;
                }
            }
            console.log('REDIS MISS:ORGNIZATION POLICIESROLES');
            const roleData = await this.rolesRepo.findOne({
                where: { role_id: Number(role) },
            });
            const modules = await this.moduleRepo.find({ relations: ['submodules'] });
            const mappedActions = await this.msaRepo.find({
                relations: ['action'],
            });
            const policies = await this.casbinRuleRepo.find({
                where: { v0: role },
            });
            const specialPermissions = await this.specialPermissionsRepo.find();
            const selectedAttrs = await this.policyAttrRepo.find({
                where: { role_id: role },
                relations: ['special_permission'],
            });
            const selectedAttrMap = selectedAttrs.reduce((acc, pa) => {
                if (!pa.special_permission)
                    return acc;
                const key = `${pa.special_permission.module_id}_${pa.special_permission.submodule_id}`;
                if (!acc[key])
                    acc[key] = new Set();
                acc[key].add(pa.special_permission.attr_key);
                return acc;
            }, {});
            const attrsMap = specialPermissions.reduce((acc, attr) => {
                const key = `${attr.module_id}_${attr.submodule_id}`;
                if (!acc[key])
                    acc[key] = [];
                acc[key].push({
                    key: attr.attr_key,
                    value: attr.attr_value,
                    type: attr.attr_type,
                    isRequired: attr.is_required,
                    description: attr.description,
                });
                return acc;
            }, {});
            const modulePermissions = modules.map(m => ({
                id: m.id,
                name: m.name,
                submodules: m.submodules.map(sm => {
                    const actionsForSubmodule = mappedActions.filter(ma => ma.module_id === m.id &&
                        (ma.submodule_id === sm.id || ma.submodule_id === null));
                    const attrKey = `${m.id}_${sm.id}`;
                    const submoduleAttrs = attrsMap[attrKey] || [];
                    const finalAttrs = submoduleAttrs.map(attr => ({
                        ...attr,
                        isSelected: selectedAttrMap[attrKey]?.has(attr.key) || false,
                    }));
                    return {
                        id: sm.id,
                        name: sm.name,
                        attrs: finalAttrs,
                        actions: actionsForSubmodule.map(ma => {
                            const act = ma.action;
                            const matchedPolicies = policies.filter(p => p.v0 === role &&
                                Number(p.v1) === m.id &&
                                Number(p.v2) === act.id &&
                                (p.v5 === null || Number(p.v5) === sm.id));
                            const policy = matchedPolicies.find(p => Number(p.v5) === sm.id) ||
                                matchedPolicies.find(p => p.v5 === null);
                            return {
                                id: act.id,
                                code: act.code,
                                isAllowed: policy ? policy.isAllowed : false,
                            };
                        }),
                    };
                }),
            }));
            const response = {
                role: {
                    id: roleData?.role_id,
                    name: roleData?.role_name,
                    description: roleData?.role_description,
                    isExternal: roleData?.is_outside_organization,
                    is2FA: roleData?.is_compulsary,
                    type: roleData?.role_type,
                },
                modules: modulePermissions,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get policies for role ${role}: ${error.message}`);
        }
    }
    async upsertMultiplePoliciesNested(dto) {
        const results = [];
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log("🚀 Starting policy upsert");
            for (const module of dto.modules) {
                for (const submodule of module.submodules) {
                    for (const action of submodule.actions) {
                        try {
                            const existingPolicy = await queryRunner.manager.findOne(casbin_rule_entity_1.CasbinRule, {
                                where: {
                                    v0: dto.roleId.toString(),
                                    v1: module.id.toString(),
                                    v2: action.id.toString(),
                                    v3: '1',
                                    v4: 'ROLE',
                                    v5: submodule.id.toString(),
                                },
                            });
                            if (existingPolicy) {
                                await queryRunner.manager.update(casbin_rule_entity_1.CasbinRule, existingPolicy.id, { isAllowed: action.isAllowed });
                                results.push({
                                    policyId: existingPolicy.id,
                                    roleId: dto.roleId,
                                    moduleId: module.id,
                                    subModuleId: submodule.id,
                                    actionId: action.id,
                                    isAllowed: action.isAllowed,
                                    message: 'Policy updated',
                                });
                            }
                            else {
                                const newPolicy = queryRunner.manager.create(casbin_rule_entity_1.CasbinRule, {
                                    ptype: 'p',
                                    v0: dto.roleId.toString(),
                                    v1: module.id.toString(),
                                    v2: action.id.toString(),
                                    v3: '1',
                                    v4: 'ROLE',
                                    v5: submodule.id.toString(),
                                    isAllowed: action.isAllowed,
                                });
                                const savedPolicy = await queryRunner.manager.save(newPolicy);
                                results.push({
                                    policyId: savedPolicy.id,
                                    roleId: dto.roleId,
                                    moduleId: module.id,
                                    subModuleId: submodule.id,
                                    actionId: action.id,
                                    isAllowed: action.isAllowed,
                                    message: 'Policy created',
                                });
                            }
                        }
                        catch (actionError) {
                            console.error("❌ Error processing action:", action.id, actionError);
                            throw actionError;
                        }
                    }
                }
            }
            console.log("🧹 Clearing old attrs for role:", dto.roleId);
            await queryRunner.manager.delete(policy_attribute_entity_1.PolicyAttribute, {
                role_id: dto.roleId.toString(),
            });
            if (dto.attrs?.length) {
                console.log("✨ Inserting attrs:", dto.attrs.length);
                for (const attr of dto.attrs) {
                    try {
                        const policy = await queryRunner.manager.findOne(casbin_rule_entity_1.CasbinRule, {
                            where: {
                                v0: dto.roleId.toString(),
                                v1: attr.moduleId.toString(),
                                v5: attr.submoduleId.toString(),
                            },
                        });
                        if (!policy) {
                            console.warn("⚠️ Policy not found for attr:", attr);
                            continue;
                        }
                        const spm = await queryRunner.manager.findOne(special_permission_master_1.SpecialPermissionsMaster, {
                            where: {
                                module_id: attr.moduleId,
                                submodule_id: attr.submoduleId,
                                attr_key: attr.attrKey,
                            },
                        });
                        if (!spm) {
                            console.warn("⚠️ SPM not found:", attr);
                            continue;
                        }
                        const newAttr = queryRunner.manager.create(policy_attribute_entity_1.PolicyAttribute, {
                            role_id: dto.roleId.toString(),
                            special_permission_master_id: spm.id.toString(),
                        });
                        await queryRunner.manager.save(newAttr);
                    }
                    catch (err) {
                        console.error("❌ Error saving attr:", attr, err);
                        throw err;
                    }
                }
            }
            if (dto.roleData) {
                await queryRunner.manager.update(role_entity_1.Roles, { role_id: dto.roleId }, {
                    role_name: dto.roleData.name,
                    role_description: dto.roleData.description ?? null,
                    is_outside_organization: dto.roleData.isExternal ?? false,
                    is_compulsary: dto.roleData.is2FA ?? false,
                });
            }
            await queryRunner.commitTransaction();
            console.log("🎉 Policy upsert completed");
            await this.redisService.delByPattern("orgnization-roles:*");
            await this.redisService.delByPattern("orgnizationprofile-policiesrole:*");
            return results;
        }
        catch (error) {
            console.error("❌ Critical error", error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getRolesByPermission(query) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            console.log('🔎 Incoming Query:', query);
            const { module_code, submodule_code, action_code } = query;
            const module = await queryRunner.manager.findOne(module_entity_1.Module, {
                where: { code: module_code },
            });
            console.log('📦 Module Result:', module);
            if (!module) {
                console.warn(`⚠️ Module not found for code: ${module_code}`);
                return {
                    success: true,
                    role_ids: [],
                };
            }
            const submodule = await queryRunner.manager.findOne(submodule_entity_1.SubModule, {
                where: { code: submodule_code },
            });
            console.log('📦 Submodule Result:', submodule);
            if (!submodule) {
                console.warn(`⚠️ Submodule not found for code: ${submodule_code}`);
                return {
                    success: true,
                    role_ids: [],
                };
            }
            const action = await queryRunner.manager.findOne(action_entity_1.Action, {
                where: { code: action_code },
            });
            console.log('📦 Action Result:', action);
            if (!action) {
                console.warn(`⚠️ Action not found for code: ${action_code}`);
                return {
                    success: true,
                    role_ids: [],
                };
            }
            console.log('🔍 Searching Casbin Rules With:', {
                moduleId: module.id,
                actionId: action.id,
                submoduleId: submodule.id,
            });
            const roles = await queryRunner.manager
                .createQueryBuilder(casbin_rule_entity_1.CasbinRule, 'cr')
                .select('cr.v0', 'role_id')
                .where('cr.ptype = :ptype', { ptype: 'p' })
                .andWhere('cr.v1 = :moduleId', { moduleId: module.id })
                .andWhere('cr.v2 = :actionId', { actionId: action.id })
                .andWhere('cr.v5 = :submoduleId', { submoduleId: submodule.id })
                .andWhere('cr.isAllowed = true')
                .getRawMany();
            console.log('📊 Casbin Role Results:', roles);
            const roleIds = [...new Set(roles.map((r) => Number(r.role_id)))];
            console.log('✅ Final Role IDs:', roleIds);
            return {
                success: true,
                role_ids: roleIds,
            };
        }
        catch (error) {
            console.error('❌ Error in getRolesByPermission:', error);
            return {
                success: false,
                message: 'Failed to fetch roles by permission',
                error: error.message,
            };
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PolicyBuilderService = PolicyBuilderService;
exports.PolicyBuilderService = PolicyBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(4, (0, typeorm_1.InjectRepository)(submodule_entity_1.SubModule)),
    __param(5, (0, typeorm_1.InjectRepository)(action_entity_1.Action)),
    __param(6, (0, typeorm_1.InjectRepository)(domain_entity_1.Domain)),
    __param(7, (0, typeorm_1.InjectRepository)(casbin_rule_entity_1.CasbinRule)),
    __param(8, (0, typeorm_1.InjectRepository)(special_permission_master_1.SpecialPermissionsMaster)),
    __param(9, (0, typeorm_1.InjectRepository)(policy_attribute_entity_1.PolicyAttribute)),
    __param(10, (0, typeorm_1.InjectRepository)(role_entity_1.Roles)),
    __param(11, (0, typeorm_1.InjectRepository)(module_submodule_action_entity_1.ModuleSubmoduleAction)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        redis_service_1.RedisService,
        casbin_enforcer_service_1.CasbinEnforcerService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PolicyBuilderService);
