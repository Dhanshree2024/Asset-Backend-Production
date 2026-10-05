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
    

        CREATE TABLE IF NOT EXISTS ${schemaName}.organizational_profile
          (
              organization_profile_id SERIAL PRIMARY KEY,
              org_name character varying(255) COLLATE pg_catalog."default",
              industry_type_id integer,
              organization_location_name character varying(20) COLLATE pg_catalog."default",
              organization_address character varying(500) COLLATE pg_catalog."default",
              city character varying(100) COLLATE pg_catalog."default",
              pincode integer,
              state character varying(100) COLLATE pg_catalog."default",
              country character varying(100) COLLATE pg_catalog."default",
              mobile_number character varying(10) COLLATE pg_catalog."default",
              base_currency character(3) COLLATE pg_catalog."default" DEFAULT 'INR'::bpchar,
              financial_year character varying(20) COLLATE pg_catalog."default" DEFAULT 'April-March'::character varying,
              time_zone character varying(50) COLLATE pg_catalog."default" DEFAULT 'Asia/Kolkata'::character varying,
              website_url character varying(255) COLLATE pg_catalog."default",
              gst_no character varying(20) COLLATE pg_catalog."default",
              report_basis character varying(20) COLLATE pg_catalog."default",
              tenant_org_id integer,
              created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              established_date date,
              street text COLLATE pg_catalog."default",
              landmark text COLLATE pg_catalog."default",
              email character varying(200) COLLATE pg_catalog."default",
              pf_number character varying(100) COLLATE pg_catalog."default",
              tan_number character varying(100) COLLATE pg_catalog."default",
              pan_number character varying(100) COLLATE pg_catalog."default",
              lin_number character varying(100) COLLATE pg_catalog."default",
              esi_number character varying(100) COLLATE pg_catalog."default",
              dateformat character varying(20) COLLATE pg_catalog."default" DEFAULT 'DD/MM/YYYY'::character varying,
              org_alt_contact_number character varying(10) COLLATE pg_catalog."default",
              org_profile_image_address text COLLATE pg_catalog."default",
              "billingContactName" character varying(200) COLLATE pg_catalog."default",
              "billingContactPhone" character varying(10) COLLATE pg_catalog."default",
              "themeMode" text COLLATE pg_catalog."default",
              "customThemeColor" text COLLATE pg_catalog."default",
              logo text COLLATE pg_catalog."default",
              "billingContactEmail" character varying(200) COLLATE pg_catalog."default",
              desg_description text COLLATE pg_catalog."default",
              othersetting jsonb,
              it_act_enabled boolean DEFAULT TRUE,
              company_act_enabled boolean DEFAULT TRUE,
              
              CONSTRAINT organizational_profile_tenant_org_id_fkey FOREIGN KEY (tenant_org_id)
                  REFERENCES public.register_organization (organization_id) MATCH SIMPLE
                  ON UPDATE NO ACTION
                  ON DELETE NO ACTION
          )
          `);
    }
    async insertOrganizationProfileTable(schemaName, user) {
        const profileInsertQuery = `
  INSERT INTO ${schemaName}.organizational_profile
  (org_name, tenant_org_id, industry_type_id)
  VALUES ($1, $2, $3);
`;
        await this.dataSource.query(profileInsertQuery, [
            user.organization.organization_name,
            user.organization.organization_id,
            user.organization.industry_type_id,
        ]);
    }
};
exports.OrganizationProfileScript = OrganizationProfileScript;
exports.OrganizationProfileScript = OrganizationProfileScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationProfileScript);
