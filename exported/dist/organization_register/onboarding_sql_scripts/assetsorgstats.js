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
exports.orgStatsScriptScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let orgStatsScriptScript = class orgStatsScriptScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrgStatsScriptTable(schemaName) {
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS ${schemaName}.org_stats
                (
                    id SERIAL PRIMARY KEY,
                    metric character varying(50) COLLATE pg_catalog."default",
                    value integer,
                    recorded_at timestamp without time zone DEFAULT now()
                   
                )
    `);
    }
    async insertOrgStats(schemaName, stats) {
        const statsInsertQuery = `
      INSERT INTO ${schemaName}.org_stats
      (
        metric,
        value,
        recorded_at
      )
      VALUES ($1, $2, $3);
    `;
        for (const stat of stats) {
            await this.dataSource.query(statsInsertQuery, [
                stat.metric,
                stat.value,
                stat.recorded_at || new Date(),
            ]);
        }
    }
};
exports.orgStatsScriptScript = orgStatsScriptScript;
exports.orgStatsScriptScript = orgStatsScriptScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], orgStatsScriptScript);
