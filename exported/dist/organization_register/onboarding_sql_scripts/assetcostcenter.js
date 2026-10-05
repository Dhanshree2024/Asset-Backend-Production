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
exports.assetCostCenterScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetCostCenterScript = class assetCostCenterScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetCostCenterScriptTable(schemaName) {
        await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS ${schemaName}.asset_cost_centers
        (
            cost_center_id BIGSERIAL PRIMARY KEY,
            cost_center_code text COLLATE pg_catalog."default" NOT NULL,
            cost_center_contact_person text COLLATE pg_catalog."default",
            cost_center_email text COLLATE pg_catalog."default",
            department_id integer,
            created_by integer,
            created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            is_active smallint DEFAULT 1,
            is_deleted smallint DEFAULT 0,
            cost_center_budget integer DEFAULT 0,
            cost_center_spent integer DEFAULT 0,
            cost_center_utilization integer,
            cost_center_name text COLLATE pg_catalog."default",
            cost_center_manger_name_id integer
          
           
        )
    `);
    }
    async insertCostCenterTable(schemaName, costCenters) {
        const costCenterInsertQuery = `
      INSERT INTO ${schemaName}.asset_cost_centers
      (
        cost_center_code,
        cost_center_contact_person,
        cost_center_email,
        department_id,
        created_by,
        cost_center_name,
        cost_center_budget,
        cost_center_spent,
        cost_center_utilization,
        cost_center_manger_name_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
        for (const center of costCenters) {
            await this.dataSource.query(costCenterInsertQuery, [
                center.cost_center_code,
                center.cost_center_contact_person || null,
                center.cost_center_email || null,
                center.department_id || null,
                center.created_by || null,
                center.cost_center_name || null,
                center.cost_center_budget ?? 0,
                center.cost_center_spent ?? 0,
                center.cost_center_utilization || null,
                center.cost_center_manger_name_id || null,
            ]);
        }
    }
};
exports.assetCostCenterScript = assetCostCenterScript;
exports.assetCostCenterScript = assetCostCenterScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetCostCenterScript);
