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
exports.ItemsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ItemsScript = class ItemsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createItemsTable(schemaName) {
        await this.dataSource.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE t.typname = 'relation_type' AND n.nspname = '${schemaName}'
          ) THEN
            CREATE TYPE ${schemaName}.item_type_enum AS ENUM ('Physical', 'Virtual'); -- Update values as needed
          END IF;
        END
        $$;
      `);
        await this.dataSource.query(`

          CREATE TABLE IF NOT EXISTS ${schemaName}.asset_items
            (
                asset_item_id SERIAL PRIMARY KEY,
                 main_category_id integer,
    sub_category_id integer,
    asset_item_name text COLLATE pg_catalog."default",
    asset_item_description text COLLATE pg_catalog."default",
    added_by integer,
    is_active smallint DEFAULT 1,
    is_deleted smallint DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_licensable boolean DEFAULT false,
    item_type item_type_enum,
    has_depreciation boolean,
    company_act_asset_life integer,
    it_act_asset_life integer,
    company_depreciation_rate double precision,
    it_act_depreciation_rate double precision,
    preffered_method integer,
    asset_item_icon text COLLATE pg_catalog."default",
    upload_documents boolean,
    import_barcode boolean,
    has_serials boolean,
    warranty_type ${schemaName}.warranty_type_enum[],
    has_warranty boolean,
    is_overallocated boolean DEFAULT false,
    excess numeric,
    asset_block integer,
    asset_type ${schemaName}.asset_type,
    asset_block_it integer,
    company_act_residual_value double precision,
    it_act_residual_value double precision,
    license_metric character varying(20),
                CONSTRAINT added_by FOREIGN KEY (added_by)
                    REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT main_category_id FOREIGN KEY (main_category_id)
                    REFERENCES ${schemaName}.asset_main_category (main_category_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT sub_category_id FOREIGN KEY (sub_category_id)
                    REFERENCES ${schemaName}.asset_sub_category (sub_category_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID

            )
      `);
    }
    async insertAssetItemTable(schemaName, subCategories) {
        const itemInsertQuery = `
    INSERT INTO ${schemaName}.asset_items
    (
      main_category_id,
      sub_category_id,
      asset_item_name,
      is_licensable,
      item_type,
      asset_item_icon,
      has_serials,
      import_barcode,
      warranty_type,
      has_depreciation,
      asset_type,
      company_act_asset_life,
      company_depreciation_rate,
      it_act_depreciation_rate,
      it_act_asset_life,
      asset_block,
asset_block_it
     
    )
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
  `;
        for (const item of subCategories) {
            await this.dataSource.query(itemInsertQuery, [
                item.main_category_id,
                item.sub_category_id,
                item.asset_item_name.trim(),
                item.is_licensable,
                item.item_type,
                item.asset_item_icon ?? null,
                item.has_serials,
                item.import_barcode,
                item.warranty_type,
                item.has_depreciation,
                item.asset_type ?? null,
                item.company_act_asset_life ?? null,
                item.company_depreciation_rate ?? null,
                item.it_act_depreciation_rate ?? null,
                item.it_act_asset_life ?? null,
                item.asset_block ?? null,
                item.asset_block_it ?? null,
            ]);
        }
    }
};
exports.ItemsScript = ItemsScript;
exports.ItemsScript = ItemsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ItemsScript);
