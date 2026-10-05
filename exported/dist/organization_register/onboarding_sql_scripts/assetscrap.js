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
exports.AssetScrapMaintenanceTablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetScrapMaintenanceTablesService = class AssetScrapMaintenanceTablesService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetScrapTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_scrap
            (
                scrap_id SERIAL PRIMARY KEY,
                scrap_ref_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
                mapping_id integer,
                asset_id integer,
                scrap_date date,
                scrap_reason character varying(100) COLLATE pg_catalog."default",
                asset_condition character varying(50) COLLATE pg_catalog."default",
                asset_working_condition_id integer NOT NULL,
                disposal_method character varying(50) COLLATE pg_catalog."default",
                vendor_name character varying(150) COLLATE pg_catalog."default",
                vendor_id integer,
                pickup_date date,
                scrap_value double precision,
                reference_invoice_no character varying(100) COLLATE pg_catalog."default",
                certificate_of_disposal character varying(255) COLLATE pg_catalog."default",
                donated_to character varying(150) COLLATE pg_catalog."default",
                handover_date date,
                donation_asset_condition character varying(50) COLLATE pg_catalog."default",
                donation_letter_no character varying(255) COLLATE pg_catalog."default",
                authorization_approval character varying(255) COLLATE pg_catalog."default",
                auction_reference_no character varying(100) COLLATE pg_catalog."default",
                auction_date date,
                final_auction_value double precision,
                buyer_details character varying(255) COLLATE pg_catalog."default",
                approval_document character varying(255) COLLATE pg_catalog."default",
                approved_by character varying(150) COLLATE pg_catalog."default",
                scrapped_by character varying(150) COLLATE pg_catalog."default",
                notes text COLLATE pg_catalog."default",
                status_type_id integer NOT NULL,
                created_by integer,
                updated_by integer,
                created_at timestamp without time zone DEFAULT now(),
                updated_at timestamp without time zone DEFAULT now(),
                is_active smallint NOT NULL DEFAULT 1,
                is_deleted smallint DEFAULT 0,
                asset_stocks_unique_id integer,
                
                CONSTRAINT asset_scrap_scrap_ref_id_key UNIQUE (scrap_ref_id),
                CONSTRAINT asset_scrap_asset_stocks_unique_id_fkey FOREIGN KEY (asset_stocks_unique_id)
                    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT asset_scrap_mapping_fkey FOREIGN KEY (mapping_id)
                    REFERENCES ${schemaName}.asset_mapping (mapping_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT asset_scrap_status_fkey FOREIGN KEY (status_type_id)
                    REFERENCES ${schemaName}.asset_status_types (status_type_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT asset_working_condition_id FOREIGN KEY (asset_working_condition_id)
                    REFERENCES ${schemaName}.asset_working_status_types (working_status_type_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT created_by FOREIGN KEY (created_by)
                    REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT updated_by FOREIGN KEY (updated_by)
                    REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
            )
    `);
    }
};
exports.AssetScrapMaintenanceTablesService = AssetScrapMaintenanceTablesService;
exports.AssetScrapMaintenanceTablesService = AssetScrapMaintenanceTablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetScrapMaintenanceTablesService);
