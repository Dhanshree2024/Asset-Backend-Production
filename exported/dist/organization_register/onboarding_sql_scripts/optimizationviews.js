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
exports.OptimizationViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OptimizationViewScript = class OptimizationViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAllViews(schemaName) {
        await this.createLocationHierarchyView(schemaName);
        await this.v_location_child_count(schemaName);
        await this.v_location_asset_counts(schemaName);
        await this.v_vendor_asset_counts(schemaName);
        await this.v_cost_center_asset_counts(schemaName);
        await this.v_project_asset_counts(schemaName);
        await this.branch_asset_counts(schemaName);
        await this.v_branch_asset_counts(schemaName);
        await this.createPaginationIndexes(schemaName);
    }
    async createPaginationIndexes(schemaName) {
        await this.dataSource.query(`
      -- asset_stock_serials (driving table)
      CREATE INDEX IF NOT EXISTS idx_ass_keyset            ON ${schemaName}.asset_stock_serials (asset_stocks_unique_id) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_procurement_item  ON ${schemaName}.asset_stock_serials (procurement_item_id)    WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_asset_id          ON ${schemaName}.asset_stock_serials (asset_id)               WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_item_id           ON ${schemaName}.asset_stock_serials (asset_item_id)          WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_current_status    ON ${schemaName}.asset_stock_serials (current_status_id)      WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_working           ON ${schemaName}.asset_stock_serials (working_status_type_id) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_title_keyset      ON ${schemaName}.asset_stock_serials (asset_serial_title, asset_stocks_unique_id) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_syscode_keyset    ON ${schemaName}.asset_stock_serials (system_code,        asset_stocks_unique_id) WHERE is_deleted = 0;

      -- assets (category / sub-category / manufacturer / self-access filters)
      CREATE INDEX IF NOT EXISTS idx_assets_main_cat ON ${schemaName}.assets (asset_main_category_id);
      CREATE INDEX IF NOT EXISTS idx_assets_sub_cat  ON ${schemaName}.assets (asset_sub_category_id);
      CREATE INDEX IF NOT EXISTS idx_assets_mfr      ON ${schemaName}.assets (manufacturer_id);
      CREATE INDEX IF NOT EXISTS idx_assets_added_by ON ${schemaName}.assets (asset_added_by);

      -- per-entity count sources (cost-center / project matviews + bounded counts)
      CREATE INDEX IF NOT EXISTS idx_ass_cost_center ON ${schemaName}.asset_stock_serials (cost_center_id) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_ass_project     ON ${schemaName}.asset_stock_serials (project_id)     WHERE is_deleted = 0;

      -- bridge to location / procurement
      -- serial.location_id is THE location source: v_asset_stock_serials joins
      -- location_branch_mapping on it, so every asset list/count depends on this
      -- index. (idx_proc_items_location below covers the OLD, now-superseded
      -- p_item.location_id path, which is still joined for procurement columns.)
      CREATE INDEX IF NOT EXISTS idx_ass_location ON ${schemaName}.asset_stock_serials (location_id) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_proc_items_location    ON ${schemaName}.asset_procurement_items (location_id);
      CREATE INDEX IF NOT EXISTS idx_proc_items_procurement ON ${schemaName}.asset_procurement_items (procurement_id);

      -- branch access + location/branch filter
      CREATE INDEX IF NOT EXISTS idx_lbm_mapping_active ON ${schemaName}.location_branch_mapping (location_mapping_id) WHERE is_deleted = 0 AND is_active = 1;
      CREATE INDEX IF NOT EXISTS idx_lbm_branch         ON ${schemaName}.location_branch_mapping (branch_id);

      -- ownership / purchase_date / renewals
      CREATE INDEX IF NOT EXISTS idx_procurements_ownership     ON ${schemaName}.asset_procurements (ownership_status_id);
      CREATE INDEX IF NOT EXISTS idx_procurements_purchase_date ON ${schemaName}.asset_procurements (purchase_date);
      CREATE INDEX IF NOT EXISTS idx_procurements_renewal       ON ${schemaName}.asset_procurements (renewal_status, procurement_id);
      CREATE INDEX IF NOT EXISTS idx_procurements_next_renewal  ON ${schemaName}.asset_procurements (next_renewal_date);

      -- asset_mapping (the per-row LATERAL in the views) + assignee filters
      CREATE INDEX IF NOT EXISTS idx_mapping_lateral ON ${schemaName}.asset_mapping (asset_stocks_unique_id, mapping_id DESC) WHERE is_deleted = 0;
      CREATE INDEX IF NOT EXISTS idx_mapping_target  ON ${schemaName}.asset_mapping (target_type, target_id) WHERE is_deleted = 0;

      -- software subscription (LATERAL source for the asset view)
      CREATE INDEX IF NOT EXISTS idx_sub_serial ON ${schemaName}.asset_software_subscription (asset_stocks_unique_id);
    `);
    }
    async v_branch_asset_counts(schemaName) {
        await this.dataSource.query(`
-- Drop whatever exists under the name (plain view OR matview) so this is idempotent.
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_branch_asset_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.v_branch_asset_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_branch_asset_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.v_branch_asset_counts';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.v_branch_asset_counts
 AS
 SELECT location_branch_id AS branch_id,
    count(DISTINCT asset_stocks_unique_id) AS asset_count
   FROM ${schemaName}.v_asset_stock_serials v
  WHERE asset_is_active = 1 AND location_branch_id IS NOT NULL
  GROUP BY location_branch_id
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.v_branch_asset_counts
    OWNER TO postgres;

-- UNIQUE index REQUIRED for REFRESH ... CONCURRENTLY (branch_id is the group key).
CREATE UNIQUE INDEX IF NOT EXISTS uq_branch_asset_counts
    ON ${schemaName}.v_branch_asset_counts (branch_id);
    `);
    }
    async v_location_asset_counts(schemaName) {
        await this.dataSource.query(`
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_location_asset_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.v_location_asset_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_location_asset_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.v_location_asset_counts';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.v_location_asset_counts
 AS
 SELECT asset_location AS location_id,
    count(DISTINCT asset_stocks_unique_id) AS asset_count
   FROM ${schemaName}.v_asset_stock_serials
  WHERE asset_is_active = 1 AND asset_location IS NOT NULL
  GROUP BY asset_location
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.v_location_asset_counts
    OWNER TO postgres;

CREATE UNIQUE INDEX IF NOT EXISTS uq_location_asset_counts
    ON ${schemaName}.v_location_asset_counts (location_id);
    `);
    }
    async v_location_child_count(schemaName) {
        await this.dataSource.query(`
   -- View: ${schemaName}.v_location_child_count

-- DROP VIEW ${schemaName}.v_location_child_count;

CREATE OR REPLACE VIEW ${schemaName}.v_location_child_count
 AS
 SELECT parent_location_id AS location_id,
    count(*) AS child_count
   FROM ${schemaName}.asset_locations
  WHERE is_deleted = 0
  GROUP BY parent_location_id;

ALTER TABLE ${schemaName}.v_location_child_count
    OWNER TO postgres;





    `);
    }
    async createLocationHierarchyView(schemaName) {
        await this.dataSource.query(`
  -- View: ${schemaName}.v_location_hierarchy_precomputed

-- DROP VIEW ${schemaName}.v_location_hierarchy_precomputed;

CREATE OR REPLACE VIEW ${schemaName}.v_location_hierarchy_precomputed
 AS
 WITH RECURSIVE location_tree AS (
         SELECT l.location_id,
            l.parent_location_id,
            l.location_name,
            l.location_type_code,
            l.branch_id,
            l.is_active,
            l.is_deleted,
            l.location_id::text AS path_ids,
            l.location_name AS path_names,
            l.location_type_code AS path_types,
            1 AS level
           FROM ${schemaName}.asset_locations l
          WHERE l.parent_location_id IS NULL AND l.is_deleted = 0 AND l.is_active = 1
        UNION ALL
         SELECT c.location_id,
            c.parent_location_id,
            c.location_name,
            c.location_type_code,
            c.branch_id,
            c.is_active,
            c.is_deleted,
            (p.path_ids || '/'::text) || c.location_id::text,
            (p.path_names || ' → '::text) || c.location_name,
            (p.path_types || ' → '::text) || c.location_type_code,
            p.level + 1
           FROM ${schemaName}.asset_locations c
             JOIN location_tree p ON c.parent_location_id = p.location_id
          WHERE c.is_deleted = 0 AND c.is_active = 1
        )
 SELECT location_id,
    parent_location_id,
    location_name,
    location_type_code,
    branch_id,
    is_active,
    is_deleted,
    path_ids,
    path_names,
    path_types,
    level
   FROM location_tree;

ALTER TABLE ${schemaName}.v_location_hierarchy_precomputed
    OWNER TO postgres;






    `);
    }
    async v_vendor_asset_counts(schemaName) {
        await this.dataSource.query(`
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_vendor_asset_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.v_vendor_asset_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_vendor_asset_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.v_vendor_asset_counts';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.v_vendor_asset_counts
 AS
 SELECT v.vendor_id,
    COALESCE(count(serial.asset_stocks_unique_id), 0::bigint) AS asset_count
   FROM ${schemaName}.vendors v
     LEFT JOIN ${schemaName}.asset_procurements proc ON proc.vendor_id = v.vendor_id
     LEFT JOIN ${schemaName}.stocks stock ON stock.stock_id = proc.stock_id
     LEFT JOIN ${schemaName}.asset_stock_serials serial ON serial.stock_id = stock.stock_id AND serial.is_deleted = 0
  WHERE v.is_deleted = 0
  GROUP BY v.vendor_id
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.v_vendor_asset_counts
    OWNER TO postgres;

CREATE UNIQUE INDEX IF NOT EXISTS uq_vendor_asset_counts
    ON ${schemaName}.v_vendor_asset_counts (vendor_id);
    `);
    }
    async v_cost_center_asset_counts(schemaName) {
        await this.dataSource.query(`
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_cost_center_asset_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.v_cost_center_asset_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_cost_center_asset_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.v_cost_center_asset_counts';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.v_cost_center_asset_counts
 AS
 SELECT serial.cost_center_id,
    count(DISTINCT serial.asset_stocks_unique_id) AS asset_count
   FROM ${schemaName}.asset_stock_serials serial
  WHERE serial.is_deleted = 0 AND serial.is_active = 1 AND serial.cost_center_id IS NOT NULL
  GROUP BY serial.cost_center_id
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.v_cost_center_asset_counts
    OWNER TO postgres;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cost_center_asset_counts
    ON ${schemaName}.v_cost_center_asset_counts (cost_center_id);
    `);
    }
    async v_project_asset_counts(schemaName) {
        await this.dataSource.query(`
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_project_asset_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.v_project_asset_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'v_project_asset_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.v_project_asset_counts';
  END IF;
END $mvdrop$;

CREATE MATERIALIZED VIEW ${schemaName}.v_project_asset_counts
 AS
 SELECT serial.project_id,
    count(DISTINCT serial.asset_stocks_unique_id) AS asset_count
   FROM ${schemaName}.asset_stock_serials serial
  WHERE serial.is_deleted = 0 AND serial.is_active = 1 AND serial.project_id IS NOT NULL
  GROUP BY serial.project_id
 WITH DATA;

ALTER MATERIALIZED VIEW ${schemaName}.v_project_asset_counts
    OWNER TO postgres;

CREATE UNIQUE INDEX IF NOT EXISTS uq_project_asset_counts
    ON ${schemaName}.v_project_asset_counts (project_id);
    `);
    }
    async branch_asset_counts(schemaName) {
        await this.dataSource.query(`
  CREATE TABLE ${schemaName}.branch_asset_counts (
    branch_id INT PRIMARY KEY,
    asset_count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
    `);
    }
};
exports.OptimizationViewScript = OptimizationViewScript;
exports.OptimizationViewScript = OptimizationViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OptimizationViewScript);
