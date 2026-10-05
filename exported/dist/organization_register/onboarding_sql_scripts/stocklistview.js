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
exports.AssetStockDetailsViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetStockDetailsViewScript = class AssetStockDetailsViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetStockDetailsView(schemaName) {
        const viewName = `${schemaName}.view_item_stock_summary`;
        const query = `

-- Materialized so the per-item stock aggregation over asset_stock_serials is
-- pre-computed (read = ms) instead of recomputed on every request. Refreshed by
-- StockSummaryRefreshService. Drop whatever exists under the name (plain view OR
-- matview) so this is idempotent on re-run / when upgrading an old plain-view schema.
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'view_item_stock_summary' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.view_item_stock_summary';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'view_item_stock_summary') THEN
    EXECUTE 'DROP VIEW ${schemaName}.view_item_stock_summary';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.view_item_stock_summary
 AS
 SELECT ai.asset_item_id,
    ai.asset_item_name,
    mc.main_category_name,
    sc.sub_category_name,
    s.location_id,
    lbm.branch_id AS location_branch_id,
    count(
        CASE
            WHEN serial.current_status_id <> 11 THEN 1
            ELSE NULL::integer
        END) AS total_asset_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND (serial.current_status_id = 7 OR serial.working_status_type_id = 5 OR (EXISTS ( SELECT 1
               FROM ${schemaName}.asset_mapping am
              WHERE am.asset_stocks_unique_id = serial.asset_stocks_unique_id AND am.target_id IS NOT NULL AND am.target_type IS NOT NULL AND am.is_deleted = 0 AND am.is_active = 1))) THEN 1
            ELSE 0
        END) AS total_assigned_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND (serial.working_status_type_id = ANY (ARRAY[12, 4])) THEN 1
            ELSE 0
        END) AS total_scrap_quantity,
    sum(
        CASE
            WHEN serial.current_status_id <> 11 AND NOT ((serial.current_status_id = ANY (ARRAY[7])) OR serial.working_status_type_id = 5 OR (EXISTS ( SELECT 1
               FROM ${schemaName}.asset_mapping am
              WHERE am.asset_stocks_unique_id = serial.asset_stocks_unique_id AND am.target_id IS NOT NULL AND am.target_type IS NOT NULL AND am.is_deleted = 0 AND am.is_active = 1))) AND NOT (serial.working_status_type_id = ANY (ARRAY[12, 4])) THEN 1
            ELSE 0
        END) AS total_in_stock_quantity
   FROM ${schemaName}.asset_items ai
     LEFT JOIN ${schemaName}.asset_main_category mc ON mc.main_category_id = ai.main_category_id
     LEFT JOIN ${schemaName}.asset_sub_category sc ON sc.sub_category_id = ai.sub_category_id
     LEFT JOIN ${schemaName}.asset_stock_serials serial ON serial.asset_item_id = ai.asset_item_id AND serial.is_deleted = 0
     LEFT JOIN ${schemaName}.stocks s ON s.stock_id = serial.stock_id AND s.is_deleted = 0
     LEFT JOIN LATERAL ( SELECT lbm_inner.branch_id
           FROM ${schemaName}.location_branch_mapping lbm_inner
          WHERE lbm_inner.location_id = s.location_id AND lbm_inner.is_deleted = 0 AND lbm_inner.is_active = 1
          ORDER BY lbm_inner.location_mapping_id DESC
         LIMIT 1) lbm ON true
  WHERE ai.is_active = 1 AND ai.is_deleted = 0 AND ai.item_type::text = 'Physical'
  GROUP BY ai.asset_item_id, ai.asset_item_name, mc.main_category_name, sc.sub_category_name, s.location_id, lbm.branch_id
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.view_item_stock_summary
    OWNER TO postgres;

-- UNIQUE index is REQUIRED for REFRESH ... CONCURRENTLY. GROUP BY key is
-- (asset_item_id, location_id, branch_id); COALESCE handles the NULLable cols.
CREATE UNIQUE INDEX IF NOT EXISTS uq_item_stock_summary
    ON ${schemaName}.view_item_stock_summary
    (asset_item_id, COALESCE(location_id, -1), COALESCE(location_branch_id, -1));

CREATE INDEX IF NOT EXISTS idx_item_stock_summary_name
    ON ${schemaName}.view_item_stock_summary (asset_item_name);


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
exports.AssetStockDetailsViewScript = AssetStockDetailsViewScript;
exports.AssetStockDetailsViewScript = AssetStockDetailsViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetStockDetailsViewScript);
