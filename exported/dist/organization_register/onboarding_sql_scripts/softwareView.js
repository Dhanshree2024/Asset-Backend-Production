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
exports.SoftwareViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SoftwareViewScript = class SoftwareViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createSoftwareView(schemaName) {
        const viewName = `${schemaName}.view_softwares`;
        const query = `

-- Materialized so the per-item software aggregation over asset_stock_serials is
-- pre-computed (read = ms). Refreshed by StockSummaryRefreshService. Drop whatever
-- exists under the name (plain view OR matview) for idempotency / upgrading old schema.
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'view_softwares' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.view_softwares';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'view_softwares') THEN
    EXECUTE 'DROP VIEW ${schemaName}.view_softwares';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.view_softwares
 AS
 SELECT ai.asset_item_id,
    ai.asset_item_name,
    mc.main_category_name,
    sc.sub_category_name,
    COALESCE(lbm.location_mapping_id, 0) AS location_id,
    COALESCE(lbm.branch_id, 0) AS branch_id,
    ( SELECT api.procurement_item_id
           FROM ${schemaName}.asset_stock_serials srl
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = srl.procurement_item_id
          WHERE srl.asset_item_id = ai.asset_item_id AND srl.is_deleted = 0
         LIMIT 1) AS procurement_item_id,
    ( SELECT api.procurement_id
           FROM ${schemaName}.asset_stock_serials srl
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = srl.procurement_item_id
          WHERE srl.asset_item_id = ai.asset_item_id AND srl.is_deleted = 0
         LIMIT 1) AS procurement_id,
    count(
        CASE
            WHEN serial.current_status_id <> 11 THEN 1
            ELSE NULL::integer
        END) AS total_asset_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND (
              serial.current_status_id = 7 
              OR serial.working_status_type_id = 5 
              OR (EXISTS ( 
                SELECT 1
                FROM ${schemaName}.asset_mapping am
                WHERE (am.asset_stocks_unique_id = serial.asset_stocks_unique_id OR am.target_id = serial.asset_stocks_unique_id)
                  AND am.is_deleted = 0 AND am.is_active = 1
              ))
            ) THEN 1
            ELSE 0
        END) AS total_assigned_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND (serial.working_status_type_id = ANY (ARRAY[12, 4])) THEN 1
            ELSE 0
        END) AS total_scrap_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND ((serial.current_status_id = ANY (ARRAY[1, 4, 8])) OR (serial.working_status_type_id = ANY (ARRAY[1, 18]))) THEN 1
            ELSE 0
        END) AS total_in_stock_quantity,
    ( SELECT mf.manufacturer_name
           FROM ${schemaName}.assets a
             LEFT JOIN ${schemaName}.manufacturers mf ON mf.manufacturer_id = a.manufacturer_id
          WHERE a.asset_item_id = ai.asset_item_id AND a.asset_is_deleted = 0
          ORDER BY a.asset_id
         LIMIT 1) AS manufacturer_name,
    ( SELECT mo.model_name
           FROM ${schemaName}.assets a
             LEFT JOIN ${schemaName}.models mo ON mo.model_id = a.model_id
          WHERE a.asset_item_id = ai.asset_item_id AND a.asset_is_deleted = 0
          ORDER BY a.asset_id
         LIMIT 1) AS model_name
   FROM ${schemaName}.asset_items ai
     LEFT JOIN ${schemaName}.asset_main_category mc ON mc.main_category_id = ai.main_category_id
     LEFT JOIN ${schemaName}.asset_sub_category sc ON sc.sub_category_id = ai.sub_category_id
     LEFT JOIN ${schemaName}.asset_stock_serials serial ON serial.asset_item_id = ai.asset_item_id AND serial.is_deleted = 0
     LEFT JOIN ${schemaName}.stocks s ON s.stock_id = serial.stock_id AND s.is_deleted = 0
     LEFT JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
  WHERE ai.is_active = 1 AND ai.is_deleted = 0 AND ai.item_type::text = 'Virtual' AND sc.sub_category_name <> 'Perpetual'::text
  GROUP BY ai.asset_item_id, ai.asset_item_name, mc.main_category_name, sc.sub_category_name, COALESCE(lbm.branch_id, 0), COALESCE(lbm.location_mapping_id, 0)
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.view_softwares
    OWNER TO postgres;

-- UNIQUE index REQUIRED for REFRESH ... CONCURRENTLY.
CREATE UNIQUE INDEX IF NOT EXISTS uq_softwares
    ON ${schemaName}.view_softwares
    (asset_item_id, location_id, branch_id);

CREATE INDEX IF NOT EXISTS idx_softwares_name
    ON ${schemaName}.view_softwares (asset_item_name);



    `;
        try {
            await this.dataSource.query(query);
            console.log(`✅ View ${viewName} created successfully`);
        }
        catch (err) {
            console.error(`❌ Error creating view ${viewName}:`, err);
            throw err;
        }
    }
};
exports.SoftwareViewScript = SoftwareViewScript;
exports.SoftwareViewScript = SoftwareViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SoftwareViewScript);
