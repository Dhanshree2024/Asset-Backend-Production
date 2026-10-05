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
exports.assetProjectScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetProjectScript = class assetProjectScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetProjectTable(schemaName) {
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS ${schemaName}.asset_project
                (
                    project_id SERIAL PRIMARY KEY,
                    project_name text COLLATE pg_catalog."default" NOT NULL,
                    contact_person text COLLATE pg_catalog."default",
                    project_email text COLLATE pg_catalog."default",
                    department_id integer,
                    created_by integer,
                    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    is_active smallint DEFAULT 1,
                    is_deleted smallint DEFAULT 0,
                    project_code text COLLATE pg_catalog."default"
                )
    `);
    }
    async insertProjectTable(schemaName, projects) {
        const projectInsertQuery = `
      INSERT INTO ${schemaName}.asset_project
      (
        project_name,
        contact_person,
        project_email,
        department_id,
        created_by,
        project_code
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
        for (const project of projects) {
            await this.dataSource.query(projectInsertQuery, [
                project.project_name,
                project.contact_person || null,
                project.project_email || null,
                project.department_id || null,
                project.created_by || null,
                project.project_code || null,
            ]);
        }
    }
};
exports.assetProjectScript = assetProjectScript;
exports.assetProjectScript = assetProjectScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetProjectScript);
