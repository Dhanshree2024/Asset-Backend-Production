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
exports.DesignationScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DesignationScript = class DesignationScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDesignationTable(schemaName) {
        await this.dataSource.query(`
            
            CREATE TABLE IF NOT EXISTS ${schemaName}.designations
              (
                  designation_id SERIAL PRIMARY KEY,
                  designation_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
                  created_by_id integer,
                  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  desg_description text COLLATE pg_catalog."default",
                  parent_department integer,
                  is_active smallint DEFAULT 1,
                  is_deleted smallint DEFAULT 0,
           
                  CONSTRAINT designations_designation_name_key UNIQUE (designation_name)
                  
              )
        `);
    }
    async insertDesignationTable(schemaName, designations) {
        const departments = await this.dataSource.query(`SELECT department_id, department_name FROM ${schemaName}.departments`);
        const deptMap = departments.reduce((acc, dept) => {
            acc[dept.department_name.trim()] = dept.department_id;
            return acc;
        }, {});
        const insertQuery = `
      INSERT INTO ${schemaName}.designations (designation_name, parent_department)
      VALUES ($1, $2);
    `;
        for (const desg of designations) {
            const parentDeptId = deptMap[desg.parent_department.trim()];
            if (!parentDeptId) {
                console.warn(`⚠️ Department "${desg.parent_department}" not found. Skipping "${desg.designation_name}".`);
                continue;
            }
            await this.dataSource.query(insertQuery, [
                desg.designation_name.trim(),
                parentDeptId,
            ]);
        }
    }
};
exports.DesignationScript = DesignationScript;
exports.DesignationScript = DesignationScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DesignationScript);
