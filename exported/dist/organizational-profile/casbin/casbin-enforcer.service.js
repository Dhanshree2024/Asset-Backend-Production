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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinEnforcerService = void 0;
const common_1 = require("@nestjs/common");
const casbin_1 = require("casbin");
const typeorm_adapter_1 = __importDefault(require("typeorm-adapter"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const domain_entity_1 = require("../entity/policy-builder/domain.entity");
const policy_attribute_entity_1 = require("../entity/policy-builder/policy-attribute.entity");
const casbin_rule_entity_1 = require("../entity/policy-builder/casbin-rule.entity");
const action_entity_1 = require("../entity/policy-builder/action.entity");
const module_entity_1 = require("../entity/policy-builder/module.entity");
const submodule_entity_1 = require("../entity/policy-builder/submodule.entity");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let CasbinEnforcerService = class CasbinEnforcerService {
    constructor(moduleRepo, subModuleRepo, actionRepo, domainRepo, policyAttrRepo, casbinRuleRepo) {
        this.moduleRepo = moduleRepo;
        this.subModuleRepo = subModuleRepo;
        this.actionRepo = actionRepo;
        this.domainRepo = domainRepo;
        this.policyAttrRepo = policyAttrRepo;
        this.casbinRuleRepo = casbinRuleRepo;
        this.enforcerMap = new Map();
        this.dynamicAbacMatch = async (requestAttrs = {}, policyAttrs = []) => {
            for (const attr of policyAttrs) {
                const { key, value, type } = attr;
                const reqVal = requestAttrs[key];
                if (attr.is_required && (reqVal === undefined || reqVal === null || reqVal === ''))
                    return false;
                if (!attr.is_required && reqVal === undefined)
                    continue;
                switch (type) {
                    case 'array':
                        if (Array.isArray(reqVal)) {
                            if (!reqVal.every(v => value.includes(v)))
                                return false;
                        }
                        else {
                            if (!value.includes(reqVal))
                                return false;
                        }
                        break;
                    case 'range':
                        if (typeof reqVal === 'object' && reqVal.min !== undefined && reqVal.max !== undefined) {
                            if (reqVal.min < value.min || reqVal.max > value.max)
                                return false;
                        }
                        else if (typeof reqVal === 'number') {
                            if (reqVal < value.min || reqVal > value.max)
                                return false;
                        }
                        else {
                            return false;
                        }
                        break;
                    case 'dateRange':
                        if (typeof reqVal === 'object' && reqVal.start && reqVal.end) {
                            const reqStart = new Date(reqVal.start);
                            const reqEnd = new Date(reqVal.end);
                            if (reqStart < new Date(value.start) || reqEnd > new Date(value.end))
                                return false;
                        }
                        else if (typeof reqVal === 'string') {
                            const date = new Date(reqVal);
                            if (date < new Date(value.start) || date > new Date(value.end))
                                return false;
                        }
                        else {
                            return false;
                        }
                        break;
                    case 'exact':
                    default:
                        if (reqVal !== value)
                            return false;
                }
            }
            return true;
        };
    }
    async getEnforcer(tenantSchema) {
        if (this.enforcerMap.has(tenantSchema)) {
            return this.enforcerMap.get(tenantSchema);
        }
        const adapter = await typeorm_adapter_1.default.newAdapter({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            schema: tenantSchema
        });
        const enforcer = await (0, casbin_1.newEnforcer)('src/organizational-profile/casbin/model.conf', adapter);
        await enforcer.loadPolicy();
        enforcer.addFunction('abacMatch', this.dynamicAbacMatch.bind(this));
        this.enforcerMap.set(tenantSchema, enforcer);
        return enforcer;
    }
    async addPolicy(tenantSchema, sub, obj, act, dom, v4, v5) {
        const enforcer = await this.getEnforcer(tenantSchema);
        return enforcer.addPolicy(sub, obj, act, dom ?? '*', v4 ?? '*', v5 ?? '*');
    }
    async removePolicy(tenantSchema, sub, obj, act, dom, v4, v5) {
        const enforcer = await this.getEnforcer(tenantSchema);
        return enforcer.removePolicy(sub, obj, act, dom ?? '*', v4 ?? '*', v5 ?? '*');
    }
    async getPolicies(tenantSchema) {
        const enforcer = await this.getEnforcer(tenantSchema);
        return enforcer.getPolicy();
    }
};
exports.CasbinEnforcerService = CasbinEnforcerService;
exports.CasbinEnforcerService = CasbinEnforcerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(1, (0, typeorm_1.InjectRepository)(submodule_entity_1.SubModule)),
    __param(2, (0, typeorm_1.InjectRepository)(action_entity_1.Action)),
    __param(3, (0, typeorm_1.InjectRepository)(domain_entity_1.Domain)),
    __param(4, (0, typeorm_1.InjectRepository)(policy_attribute_entity_1.PolicyAttribute)),
    __param(5, (0, typeorm_1.InjectRepository)(casbin_rule_entity_1.CasbinRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CasbinEnforcerService);
