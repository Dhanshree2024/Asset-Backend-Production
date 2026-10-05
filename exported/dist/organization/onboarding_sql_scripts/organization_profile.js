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
exports.OrganizationProfileScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OrganizationProfileScript = class OrganizationProfileScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrganizationProfileTable(schemaName) {
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS ${schemaName}.organizational_profile (
              organization_profile_id SERIAL PRIMARY KEY,
              org_name VARCHAR(255),
              industry_type_name VARCHAR(50),
              organization_location_name VARCHAR(20),
              organization_address VARCHAR(500),
              city VARCHAR(100),
              pincode INT CHECK (pincode >= 100000 AND pincode <= 999999),
              state VARCHAR(100),
              country VARCHAR(100),
              mobile_number VARCHAR(10) CHECK (mobile_number ~ '^\d{10}$'),
              base_currency CHAR(3),
              financial_year VARCHAR(20),
              time_zone VARCHAR(50),
              website_url VARCHAR(255),
              gst_no VARCHAR(20),
              report_basis VARCHAR(20) CHECK (report_basis IN ('Accrual', 'Cash')),
              tenant_org_id INT REFERENCES public.register_organization(organization_id),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
          `);
    }
    async insertOrganizationProfileTable(schemaName, user) {
        const profileInsertQuery = `
            INSERT INTO ${schemaName}.organizational_profile 
            (org_name, tenant_org_id)
            VALUES ($1, $2);
        `;
        await this.dataSource.query(profileInsertQuery, [
            user.organization.organization_name,
            user.organization.organization_id,
        ]);
    }
};
exports.OrganizationProfileScript = OrganizationProfileScript;
exports.OrganizationProfileScript = OrganizationProfileScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationProfileScript);
