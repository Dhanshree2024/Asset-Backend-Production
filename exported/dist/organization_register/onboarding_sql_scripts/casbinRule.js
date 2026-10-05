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
exports.CasbinRuleScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CasbinRuleScript = class CasbinRuleScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createCasbinRuleTable(schemaName) {
        await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.casbin_rule (
      id SERIAL PRIMARY KEY,
      ptype VARCHAR(255) NOT NULL,
      v0 VARCHAR(255),
      v1 VARCHAR(255),
      v2 VARCHAR(255),
      v3 VARCHAR(255),
      v4 VARCHAR(255),
      v5 VARCHAR(255),
      v6 VARCHAR(255),
      "isAllowed" BOOLEAN DEFAULT true
    );
  `);
    }
    async insertCasbinRuleTable(schemaName, roles) {
        const actionMap = {
            ADD: 1,
            VIEW: 2,
            EDIT: 3,
            DELETE: 4,
            IMPORT: 5,
            EXPORT: 6,
            ASSIGN: 7,
            TOGGLE: 8,
            PRINT: 9
        };
        const queries = [];
        for (const role of roles) {
            for (const perm of role.permission) {
                for (const actionKey in perm.actions) {
                    const actionId = actionMap[actionKey];
                    const allowed = perm.actions[actionKey];
                    queries.push([
                        'p',
                        role.role_id.toString(),
                        perm.module.toString(),
                        actionId.toString(),
                        '1',
                        'ROLE',
                        perm.submodule.toString(),
                        allowed
                    ]);
                }
            }
        }
        for (const q of queries) {
            await this.dataSource.query(`INSERT INTO ${schemaName}.casbin_rule
      (ptype, v0, v1, v2, v3, v4, v5, "isAllowed")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, q);
        }
    }
};
exports.CasbinRuleScript = CasbinRuleScript;
exports.CasbinRuleScript = CasbinRuleScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CasbinRuleScript);
