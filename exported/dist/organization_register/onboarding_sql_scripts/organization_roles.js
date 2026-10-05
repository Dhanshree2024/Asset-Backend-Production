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
exports.OrganizationRolesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OrganizationRolesScript = class OrganizationRolesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrganizationRolesTable(schemaName) {
        await this.dataSource.query(`
      
      CREATE TABLE IF NOT EXISTS ${schemaName}.organization_roles
          (
              role_id SERIAL PRIMARY KEY,
              role_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
              created_by integer,
              created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              is_active boolean DEFAULT true,
              is_deleted boolean DEFAULT false,
              is_compulsary boolean DEFAULT false,
              is_outside_organization boolean DEFAULT false,
              role_description text COLLATE pg_catalog."default",
              role_type role_type_enum DEFAULT 'system'::role_type_enum
          )
    `);
    }
    async insertOrganizationRolesTable(schemaName, roles) {
        const roleInsertQuery = `
    INSERT INTO ${schemaName}.organization_roles
    (role_name, role_description ,role_type)
    VALUES ($1, $2,'system');
  `;
        for (const role of roles) {
            await this.dataSource.query(roleInsertQuery, [
                role.role_name,
                role.role_description ?? null,
            ]);
        }
    }
};
exports.OrganizationRolesScript = OrganizationRolesScript;
exports.OrganizationRolesScript = OrganizationRolesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationRolesScript);
