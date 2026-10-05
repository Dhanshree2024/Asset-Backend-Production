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
exports.AssetStockSerialsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetStockSerialsScript = class AssetStockSerialsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetStockSerialsTable(schemaName) {
        await this.dataSource.query(`
            
                CREATE TABLE IF NOT EXISTS ${schemaName}.asset_stock_serials
                (
                    asset_stocks_unique_id BIGSERIAL,
                     asset_id bigint NOT NULL,
          stock_id integer NOT NULL,
          stock_serials text COLLATE pg_catalog."default",
          asset_item_id integer,
          system_code text COLLATE pg_catalog."default",
          procurement_item_id bigint,
          location_id integer,
          current_status_id integer,
          working_status_type_id integer,
          project_id integer,
          cost_center_id integer,
          asset_image text COLLATE pg_catalog."default",
          created_at timestamp without time zone DEFAULT now(),
          created_by integer,
          is_active smallint DEFAULT 1,
          is_deleted smallint DEFAULT 0,
          asset_serial_title text COLLATE pg_catalog."default",
          updated_by integer,
          information_fields text COLLATE pg_catalog."default",
          -- Agent Discovery import link (per-row): which discovered device this
          -- serial was imported from, and its MAC. Both nullable — only set for
          -- assets created by the discovery importer. Used to dedupe re-scans so
          -- an already-imported device updates its asset instead of duplicating.
          source_device_id bigint,
          discovered_mac macaddr,
                 PRIMARY KEY (asset_stocks_unique_id)
                )
          PARTITION BY HASH (asset_stocks_unique_id);
        `);
        for (let i = 0; i < 8; i++) {
            await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS ${schemaName}.asset_stock_serials_p${i}
        PARTITION OF ${schemaName}.asset_stock_serials
        FOR VALUES WITH (MODULUS 8, REMAINDER ${i});
      `);
        }
        await this.dataSource.query(`
      -- Impact overlay columns (Scenario 4 / ITAM CMDB Resolution)
      ALTER TABLE ${schemaName}.asset_stock_serials ADD COLUMN IF NOT EXISTS impact_status VARCHAR(12) NOT NULL DEFAULT 'NONE';
      ALTER TABLE ${schemaName}.asset_stock_serials ADD COLUMN IF NOT EXISTS impacted_by_serial_id BIGINT NULL;
      ALTER TABLE ${schemaName}.asset_stock_serials ADD COLUMN IF NOT EXISTS impact_reason VARCHAR(50) NULL;
    `);
    }
};
exports.AssetStockSerialsScript = AssetStockSerialsScript;
exports.AssetStockSerialsScript = AssetStockSerialsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetStockSerialsScript);
