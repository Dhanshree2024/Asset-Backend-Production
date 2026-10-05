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
exports.DashboardCountsViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DashboardCountsViewScript = class DashboardCountsViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDashboardCountsView(schemaName) {
        const viewName = `${schemaName}.dashboard_counts`;
        const query = `
-- dashboard_counts is MATERIALIZED (global snapshot, refreshed on a timer/button)
-- so the dashboard reads it in ms instead of re-running ~7 aggregations over the
-- whole asset_stock_serials on every load. dashboard_counts_live keeps the
-- per-user (self-permission) logic for the few roles that need filtered numbers.
-- Drop whatever currently exists under the matview name (plain view OR matview).
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'dashboard_counts' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.dashboard_counts';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'dashboard_counts') THEN
    EXECUTE 'DROP VIEW ${schemaName}.dashboard_counts';
  END IF;
END $mvdrop$;

CREATE OR REPLACE VIEW ${schemaName}.dashboard_counts_live
 AS
 WITH base_assets AS (
         SELECT ass.asset_stocks_unique_id,
            ass.current_status_id,
            lbm.branch_id
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             JOIN ${schemaName}.asset_locations loc ON loc.location_id = lbm.location_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
        ), asset_counts AS (
         SELECT base_assets.branch_id,
            count(*) AS total_assets,
            count(*) FILTER (WHERE base_assets.current_status_id = 7) AS in_use_assets,
            count(*) FILTER (WHERE base_assets.current_status_id = 1) AS available_assets,
            count(*) FILTER (WHERE base_assets.current_status_id = ANY (ARRAY[2, 6])) AS maintenance_assets
           FROM base_assets
          GROUP BY base_assets.branch_id
        ), asset_price AS (
         SELECT lbm.branch_id,
            COALESCE(sum(ap_1.unit_price), 0::numeric) AS total_asset_price
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = ass.procurement_item_id
             LEFT JOIN ${schemaName}.asset_procurements ap_1 ON ap_1.procurement_id = api.procurement_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0
          GROUP BY lbm.branch_id
        ), warranty_counts AS (
         SELECT lbm.branch_id,
            count(*) FILTER (WHERE awd.warranty_end_date >= CURRENT_DATE AND awd.warranty_end_date <= (CURRENT_DATE + '30 days'::interval)) AS it_warranty_expiring,
            count(*) FILTER (WHERE awd.warranty_end_date < CURRENT_DATE) AS it_warranty_expired,
            count(*) FILTER (WHERE awd.warranty_end_date < CURRENT_DATE) AS it_warranty_action_required
           FROM ${schemaName}.asset_warranty_details awd
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = awd.asset_stocks_unique_id
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE ass.is_active = 1 AND ass.is_deleted = 0
          GROUP BY lbm.branch_id
        ), transfer_counts AS (
          SELECT lbm.branch_id,
              COUNT(*) AS location_transfers,
              COUNT(*) FILTER (WHERE lt.transfer_status = 16) AS pending_location_transfers,
              COUNT(*) FILTER (WHERE lt.transfer_status = 15) AS completed_location_transfers
          FROM ${schemaName}.location_transfers lt
            JOIN ${schemaName}.location_branch_mapping lbm
              ON lbm.location_mapping_id =
                  COALESCE(lt.to_location_id, lt.from_location_id)
              AND lbm.is_deleted = 0
              AND lbm.is_active = 1
          WHERE lt.is_active = 1
            AND lt.is_deleted = 0
          GROUP BY lbm.branch_id
        ), cost_center_counts AS (
         SELECT lbm.branch_id,
            count(DISTINCT acc.cost_center_id) FILTER (WHERE acc.is_active = 1 AND acc.is_deleted = 0) AS costcenter_counts,
            count(DISTINCT acc.cost_center_id) FILTER (WHERE acc.is_active = 1 AND acc.is_deleted = 0) AS active_cost_centers,
            count(DISTINCT acc.cost_center_id) FILTER (WHERE acc.is_active = 0 AND acc.is_deleted = 0) AS inactive_cost_centers,
            count(DISTINCT acc.cost_center_id) FILTER (WHERE acc.is_deleted = 1) AS deleted_cost_centers
           FROM ${schemaName}.asset_cost_centers acc
             LEFT JOIN ${schemaName}.asset_stock_serials ass ON ass.cost_center_id = acc.cost_center_id
             LEFT JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             LEFT JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          GROUP BY lbm.branch_id
        ), cost_center_with_assets AS (
         SELECT lbm.branch_id,
            count(DISTINCT ass.cost_center_id) AS costcenter_with_assets
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND ass.cost_center_id IS NOT NULL
          GROUP BY lbm.branch_id
        ), cost_center_asset_counts AS (
         SELECT lbm.branch_id,
            count(ass.asset_stocks_unique_id) AS costcenter_asset_count
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND ass.cost_center_id IS NOT NULL
          GROUP BY lbm.branch_id
        ), cost_center_asset_price AS (
         SELECT lbm.branch_id,
            COALESCE(sum(ap_1.unit_price), 0::numeric) AS costcenter_asset_price
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = ass.procurement_item_id
             LEFT JOIN ${schemaName}.asset_procurements ap_1 ON ap_1.procurement_id = api.procurement_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND ass.cost_center_id IS NOT NULL
          GROUP BY lbm.branch_id
        ), total_cost_centers AS (
         SELECT count(*) FILTER (WHERE asset_cost_centers.is_active = 1 AND asset_cost_centers.is_deleted = 0) AS total_cost_centers
           FROM ${schemaName}.asset_cost_centers
        ), software_base AS (
         SELECT ass.asset_stocks_unique_id,
            ass.current_status_id,
            lbm.branch_id,
            sub.next_renewal_date
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.assets a ON a.asset_id = ass.asset_id AND a.asset_sub_category_id = 15
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             LEFT JOIN ${schemaName}.asset_software_subscription sub ON sub.asset_stocks_unique_id = ass.asset_stocks_unique_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
        ), software_counts AS (
         SELECT software_base.branch_id,
            count(*) AS total_software,
            count(*) FILTER (WHERE software_base.next_renewal_date >= CURRENT_DATE AND software_base.next_renewal_date <= (CURRENT_DATE + '30 days'::interval)) AS software_renewal_expiring,
            count(*) FILTER (WHERE software_base.next_renewal_date < CURRENT_DATE) AS software_renewal_expired
           FROM software_base
          GROUP BY software_base.branch_id
        ), software_price AS (
         SELECT lbm.branch_id,
            COALESCE(sum(ap_1.unit_price), 0::numeric) AS total_software_price
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.assets a ON a.asset_id = ass.asset_id AND a.asset_sub_category_id = 15
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = ass.procurement_item_id
             LEFT JOIN ${schemaName}.asset_procurements ap_1 ON ap_1.procurement_id = api.procurement_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0
          GROUP BY lbm.branch_id
        )
 SELECT b.branch_id,
    ( SELECT count(*) AS count
           FROM ${schemaName}.users u
          WHERE u.is_active = 1 AND u.branch_id = b.branch_id) AS users,
    ( SELECT count(*) AS count
           FROM ${schemaName}.departments d
          WHERE d.is_active = 1) AS departments,
        CASE
            WHEN row_number() OVER () = 1 THEN ( SELECT count(*) AS count
               FROM ${schemaName}.branches br
              WHERE br.is_active = 1)
            ELSE 0::bigint
        END AS branches,
    ( SELECT count(*) AS count
           FROM ${schemaName}.asset_locations l
          WHERE l.is_active = 1 AND l.is_deleted = 0 AND l.branch_id = b.branch_id) AS locations,
    COALESCE(ac.total_assets, 0::bigint) AS assets,
    COALESCE(ac.in_use_assets, 0::bigint) AS in_use_assets,
    COALESCE(ac.available_assets, 0::bigint) AS available_assets,
    COALESCE(ac.maintenance_assets, 0::bigint) AS maintenance_assets,
    COALESCE(ap.total_asset_price, 0::numeric) AS total_asset_price,
    COALESCE(wc.it_warranty_expiring, 0::bigint) AS it_warranty_expiring,
    COALESCE(wc.it_warranty_action_required, 0::bigint) AS it_warranty_action_required,
    COALESCE(tc.location_transfers, 0::bigint) AS location_transfers,
    COALESCE(tc.pending_location_transfers, 0::bigint) AS pending_location_transfers,
    COALESCE(tc.completed_location_transfers, 0::bigint) AS completed_location_transfers,
    COALESCE(ccwa.costcenter_with_assets, 0::bigint) AS costcenter_with_assets,
    cc.costcenter_counts,
    cc.active_cost_centers,
    cc.inactive_cost_centers,
    cc.deleted_cost_centers,
    tcc.total_cost_centers,
        CASE
            WHEN COALESCE(ac.total_assets, 0::bigint) > 0 THEN round(ac.in_use_assets::numeric / ac.total_assets::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS in_use_percentage,
        CASE
            WHEN COALESCE(ac.total_assets, 0::bigint) > 0 THEN round(ac.available_assets::numeric / ac.total_assets::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS available_percentage,
        CASE
            WHEN COALESCE(ac.total_assets, 0::bigint) > 0 THEN round(ac.maintenance_assets::numeric / ac.total_assets::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS maintenance_percentage,
        CASE
            WHEN COALESCE(tc.location_transfers, 0::bigint) > 0 THEN round(tc.pending_location_transfers::numeric / tc.location_transfers::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS pending_transfer_percentage,
        CASE
            WHEN COALESCE(tc.location_transfers, 0::bigint) > 0 THEN round(tc.completed_location_transfers::numeric / tc.location_transfers::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS completed_transfer_percentage,
        CASE
            WHEN COALESCE(ac.total_assets, 0::bigint) > 0 THEN round(COALESCE(wc.it_warranty_expiring, 0::bigint)::numeric / ac.total_assets::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS warranty_expiring_percentage,
        CASE
            WHEN cc.costcenter_counts > 0 THEN round(cc.active_cost_centers::numeric / cc.costcenter_counts::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS active_cost_center_percentage,
        CASE
            WHEN cc.costcenter_counts > 0 THEN round(COALESCE(ccwa.costcenter_with_assets, 0::bigint)::numeric / cc.costcenter_counts::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS branch_costcenter_utilization,
        CASE
            WHEN tcc.total_cost_centers > 0 THEN round(COALESCE(ccwa.costcenter_with_assets, 0::bigint)::numeric / tcc.total_cost_centers::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS global_costcenter_utilization,
    COALESCE(sc.total_software, 0::bigint) AS total_software,
    COALESCE(sc.software_renewal_expiring, 0::bigint) AS software_renewal_expiring,
    COALESCE(sc.software_renewal_expired, 0::bigint) AS software_renewal_expired,
    COALESCE(sp.total_software_price, 0::numeric) AS total_software_price,
        CASE
            WHEN COALESCE(sc.total_software, 0::bigint) > 0 THEN round(COALESCE(sc.software_renewal_expiring, 0::bigint)::numeric / sc.total_software::numeric * 100::numeric, 2)
            ELSE 0::numeric
        END AS software_renewal_expiring_percentage
   FROM ${schemaName}.branches b
     LEFT JOIN asset_counts ac ON ac.branch_id = b.branch_id
     LEFT JOIN asset_price ap ON ap.branch_id = b.branch_id
     LEFT JOIN warranty_counts wc ON wc.branch_id = b.branch_id
     LEFT JOIN transfer_counts tc ON tc.branch_id = b.branch_id
     LEFT JOIN cost_center_counts cc ON cc.branch_id = b.branch_id
     LEFT JOIN cost_center_asset_counts cca ON cca.branch_id = b.branch_id
     LEFT JOIN cost_center_asset_price ccap ON ccap.branch_id = b.branch_id
     LEFT JOIN cost_center_with_assets ccwa ON ccwa.branch_id = b.branch_id
     LEFT JOIN software_counts sc ON sc.branch_id = b.branch_id
     LEFT JOIN software_price sp ON sp.branch_id = b.branch_id
     CROSS JOIN total_cost_centers tcc
  WHERE b.is_active = 1;

ALTER TABLE ${schemaName}.dashboard_counts_live
    OWNER TO postgres;

-- Materialized global snapshot the dashboard reads by default (one row per branch).
-- At refresh time the app.* GUCs are unset, so the self-permission predicate
-- resolves to FALSE => this is the global (all-assets) view. UNIQUE index on
-- branch_id lets StockSummaryRefreshService REFRESH ... CONCURRENTLY.
CREATE MATERIALIZED VIEW ${schemaName}.dashboard_counts AS
 SELECT branch_id,
    users,
    departments,
    branches,
    locations,
    assets,
    in_use_assets,
    available_assets,
    maintenance_assets,
    total_asset_price,
    it_warranty_expiring,
    it_warranty_action_required,
    location_transfers,
    pending_location_transfers,
    completed_location_transfers,
    costcenter_with_assets,
    costcenter_counts,
    active_cost_centers,
    inactive_cost_centers,
    deleted_cost_centers,
    total_cost_centers,
    in_use_percentage,
    available_percentage,
    maintenance_percentage,
    pending_transfer_percentage,
    completed_transfer_percentage,
    warranty_expiring_percentage,
    active_cost_center_percentage,
    branch_costcenter_utilization,
    global_costcenter_utilization,
    total_software,
    software_renewal_expiring,
    software_renewal_expired,
    total_software_price,
    software_renewal_expiring_percentage
   FROM ${schemaName}.dashboard_counts_live
 WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uq_dashboard_counts
    ON ${schemaName}.dashboard_counts (branch_id);

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
exports.DashboardCountsViewScript = DashboardCountsViewScript;
exports.DashboardCountsViewScript = DashboardCountsViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DashboardCountsViewScript);
