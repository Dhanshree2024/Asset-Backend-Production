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
exports.WarrantyDetailsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let WarrantyDetailsScript = class WarrantyDetailsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createWarrantyDetailsTable(schemaName) {
        await this.dataSource.query(`

              CREATE TABLE IF NOT EXISTS ${schemaName}.asset_warranty_details
              (
                    asset_stocks_unique_id bigint NOT NULL,
                    asset_id bigint,
                    stock_id integer,
                    asset_item_id integer,
                    warranty_category ${schemaName}.warranty_type_enum[],
                    warranty_in_year integer,
                    warranty_start_date date,
                    warranty_end_date date,
                    warranty_duration_type character varying(20) COLLATE pg_catalog."default",
                    support_type support_type_enum,
                    support_contract character varying COLLATE pg_catalog."default",
                    contract_number character varying(50) COLLATE pg_catalog."default",
                    amc_vendor integer,
                    amc_frequency character varying(20) COLLATE pg_catalog."default",
                    last_service_date date,
                    next_service_due_date date,
                    procurement_id bigint,
                    CONSTRAINT asset_warranty_details_pkey
                    PRIMARY KEY (asset_stocks_unique_id),

                    CONSTRAINT uq_asset_warranty_stock
                    UNIQUE (asset_stocks_unique_id)
              )

        `);
    }
};
exports.WarrantyDetailsScript = WarrantyDetailsScript;
exports.WarrantyDetailsScript = WarrantyDetailsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], WarrantyDetailsScript);
