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
exports.VendersScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let VendersScript = class VendersScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createVendersTable(schemaName) {
        await this.dataSource.query(`
      
        CREATE TABLE IF NOT EXISTS ${schemaName}.vendors
          (
            vendor_id SERIAL PRIMARY KEY,
              vendor_name text COLLATE pg_catalog."default",
              vendor_gst_no text COLLATE pg_catalog."default",
              vendor_street text COLLATE pg_catalog."default",
              vendor_landmark text COLLATE pg_catalog."default",
              vendor_city text COLLATE pg_catalog."default",
              vendor_state text COLLATE pg_catalog."default",
              vendor_country text COLLATE pg_catalog."default",
              vendor_contact_number text COLLATE pg_catalog."default",
              vendor_alternative_contact_number text COLLATE pg_catalog."default",
              vendor_email text COLLATE pg_catalog."default",
              is_active smallint DEFAULT 1,
              is_deleted smallint DEFAULT 0,
              created_at timestamp without time zone DEFAULT now(),
              vendor_pincode text COLLATE pg_catalog."default",
              vendor_primary_contact text COLLATE pg_catalog."default",
              created_by integer,
              vendor_first_name text COLLATE pg_catalog."default",
              vendor_middle_name text COLLATE pg_catalog."default",
              vendor_last_name text COLLATE pg_catalog."default",
              vendor_degination text COLLATE pg_catalog."default",
              vendor_department text COLLATE pg_catalog."default",
              vendor_display_name text COLLATE pg_catalog."default",
              vendor_gst_status text COLLATE pg_catalog."default",
              updated_at timestamp without time zone DEFAULT now(),
              vendor_code text COLLATE pg_catalog."default"
             
             
          )
      `);
    }
};
exports.VendersScript = VendersScript;
exports.VendersScript = VendersScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], VendersScript);
