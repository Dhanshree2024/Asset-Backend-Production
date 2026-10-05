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
exports.otherSettingsOrgScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let otherSettingsOrgScript = class otherSettingsOrgScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOtherSettingsOrgTable(schemaName) {
        await this.dataSource.query(`
    
      CREATE TABLE IF NOT EXISTS ${schemaName}.other_settings_org
                    (
                        org_settings_id SERIAL PRIMARY KEY,
                        settings jsonb,
                        is_current boolean DEFAULT true,
                        created_by integer,
                        updated_by integer,
                        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                        updated_at timestamp without time zone,
                        org_id integer,
                       
                      
                        CONSTRAINT ${schemaName}_other_settings_org_is_current_check CHECK (is_current = ANY (ARRAY[true, false]))
                    )
    `);
    }
    async insertOtherSettingsOrg(schemaName, orgSettings) {
        const insertQuery = `
      INSERT INTO ${schemaName}.other_settings_org
      (
        settings,
        is_current,
        created_by,
        updated_by,
        org_id
      )
      VALUES ($1, $2, $3, $4, $5);
    `;
        for (const s of orgSettings) {
            await this.dataSource.query(insertQuery, [
                s.settings ? JSON.stringify(s.settings) : null,
                s.is_current ?? true,
                s.created_by || null,
                s.updated_by || null,
                s.org_id || null,
            ]);
        }
    }
};
exports.otherSettingsOrgScript = otherSettingsOrgScript;
exports.otherSettingsOrgScript = otherSettingsOrgScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], otherSettingsOrgScript);
