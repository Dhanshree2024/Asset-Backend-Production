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
exports.OrganizationPermissionScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OrganizationPermissionScript = class OrganizationPermissionScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrganizationPermissionTable(schemaName) {
        await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS ${schemaName}.organization_permissions
                    (
                        permission_id SERIAL PRIMARY KEY,
                        role_id integer NOT NULL,
                        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                        is_active boolean DEFAULT true,
                        is_deleted boolean DEFAULT false,
                        permissions jsonb
                    
                    )
        `);
    }
    async insertOrganizationRolesPermissionTable(schemaName, roles) {
        const roleInsertQuery = `INSERT INTO ${schemaName}.organization_roles(role_name)VALUES ($1);`;
        for (const role of roles) {
            await this.dataSource.query(`INSERT INTO ${schemaName}.organization_permissions (role_id, permissions) VALUES ($1, $2::jsonb)`, [role.role_id, JSON.stringify(role.permission)]);
        }
    }
};
exports.OrganizationPermissionScript = OrganizationPermissionScript;
exports.OrganizationPermissionScript = OrganizationPermissionScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationPermissionScript);
