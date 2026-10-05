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
exports.DepartmentsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DepartmentsScript = class DepartmentsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDepartmentsTable(schemaName) {
        await this.dataSource.query(`
            
        

            CREATE TABLE IF NOT EXISTS ${schemaName}.departments
                (
                    department_id SERIAL PRIMARY KEY,
                    department_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
                    department_head_id integer,
                    created_by_id integer,
                    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    dept_description text COLLATE pg_catalog."default",
                    linked_designations integer,
                    is_active smallint DEFAULT 1,
                    is_deleted smallint DEFAULT 0
                )

        `);
    }
    async insertOrganizationDepartmentTable(schemaName, departments) {
        const departmentInsertQuery = `
            INSERT INTO ${schemaName}.departments(department_name)VALUES ($1);
        `;
        for (const dept of departments) {
            await this.dataSource.query(departmentInsertQuery, [dept.department_name]);
        }
    }
};
exports.DepartmentsScript = DepartmentsScript;
exports.DepartmentsScript = DepartmentsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DepartmentsScript);
