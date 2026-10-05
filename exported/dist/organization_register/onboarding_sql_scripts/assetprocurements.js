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
exports.assetAssetProcurementsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetAssetProcurementsScript = class assetAssetProcurementsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetProcurementsScriptTable(schemaName) {
        await this.dataSource.query(`

       CREATE TABLE IF NOT EXISTS ${schemaName}.asset_procurements
                (
                    procurement_id BIGSERIAL PRIMARY KEY,
                    asset_id bigint NOT NULL,
          vendor_id integer,
          invoice_no character varying(50) COLLATE pg_catalog."default",
          bill_no character varying(50) COLLATE pg_catalog."default",
          purchase_date date,
          unit_price numeric(14,2),
          gst_percent numeric(5,2),
          gst_amount numeric(14,2),
          total_amount numeric(14,2),
          documents text COLLATE pg_catalog."default",
          ownership_status_id integer,
          license_details jsonb,
          created_at timestamp without time zone DEFAULT now(),
          created_by integer,
          updated_by integer,
          stock_id integer,
          total_without_gst numeric(14,2),
          is_prorated boolean DEFAULT false,
          renewal_status integer,
          is_approved boolean,
          previous_procurement_id integer,
          next_renewal_date timestamp without time zone,
          subscription_type character varying COLLATE pg_catalog."default",
          billing_frequency character varying COLLATE pg_catalog."default",
          sub_start_date timestamp without time zone,
          warranty_category ${schemaName}.warranty_type_enum[]
                )

    `);
    }
};
exports.assetAssetProcurementsScript = assetAssetProcurementsScript;
exports.assetAssetProcurementsScript = assetAssetProcurementsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetAssetProcurementsScript);
