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
exports.AssetDepreciationScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetDepreciationScript = class AssetDepreciationScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDepreciationView(schemaName) {
        const viewName = `${schemaName}.asset_depreciation_serial_view`;
        const idxIdYear = `idx_dep_mv_id_year_${schemaName}`;
        const idxFy = `idx_dep_mv_fy_${schemaName}`;
        const idxBlockCompany = `idx_dep_mv_block_company_${schemaName}`;
        const idxBlockIt = `idx_dep_mv_block_it_${schemaName}`;
        const idxLocation = `idx_dep_mv_location_${schemaName}`;
        const query = `

DROP VIEW IF EXISTS ${schemaName}.asset_depreciation_serial_view CASCADE;
DROP MATERIALIZED VIEW IF EXISTS ${schemaName}.asset_depreciation_serial_view CASCADE;

CREATE MATERIALIZED VIEW ${schemaName}.asset_depreciation_serial_view
AS
WITH RECURSIVE

org_config AS (
    SELECT COALESCE(financial_year, 'April-March') AS financial_year
    FROM   ${schemaName}.organizational_profile
    LIMIT  1
),

 base AS (
    SELECT
        s.asset_stocks_unique_id,
        s.system_code,
        p.unit_price                                        AS buy_price,
        p.purchase_date                                     AS depreciation_start_date,
        a.asset_id,
        a.asset_title,
        i.asset_item_id,
        i.asset_item_name,
        i.asset_type,
        COALESCE(i.company_depreciation_rate, 0::double precision) AS company_depreciation_rate,
        COALESCE(i.it_act_depreciation_rate,  0::double precision) AS it_act_depreciation_rate,
        i.company_act_asset_life,
        i.it_act_asset_life,
        i.company_act_residual_value,
        i.it_act_residual_value,
        i.asset_block                                       AS block_id_company,
        i.asset_block_it                                    AS block_id_it,
        mc.main_category_name,
        sc.sub_category_name,
        -- Location label from the PER-SERIAL location (single source of truth),
        -- not the shared pi.location_id. Depreciation MATH is unchanged (it is
        -- per-serial off p.unit_price); only the location this row is grouped
        -- under follows the unit after a transfer.
        s.location_id,

        CASE
            WHEN oc.financial_year = 'January-December'
            THEN EXTRACT(month FROM p.purchase_date) >= 7
            ELSE EXTRACT(month FROM p.purchase_date) >= 10
              OR EXTRACT(month FROM p.purchase_date) <= 3
        END AS is_half_year_it,

        -- ── FY END DATE ──────────────────────────────────────────────────────
        -- April-March : March 31 of the FY that contains the purchase date
        -- January-Dec : December 31 of the purchase year  (simple calendar)
        CASE
            WHEN oc.financial_year = 'January-December'
            THEN date(
                    date_trunc('year', p.purchase_date::timestamp with time zone)
                    + '1 year -1 day'::interval
                 )
            ELSE
                CASE
                    WHEN EXTRACT(month FROM p.purchase_date) >= 4
                    THEN date(
                            date_trunc('year', p.purchase_date::timestamp with time zone)
                            + '1 year'::interval - '1 day'::interval + '3 mons'::interval
                         )
                    ELSE date(
                            date_trunc('year', p.purchase_date::timestamp with time zone)
                            + '3 mons'::interval - '1 day'::interval
                         )
                END
        END AS fy_end_date,

        -- ── FY START DATE ────────────────────────────────────────────────────
        -- April-March : April 1 of the FY that contains the purchase date
        -- January-Dec : January 1 of the purchase year  (simple calendar)
        CASE
            WHEN oc.financial_year = 'January-December'
            THEN date_trunc('year', p.purchase_date::timestamp with time zone)
            ELSE
                CASE
                    WHEN EXTRACT(month FROM p.purchase_date) >= 4
                    THEN date_trunc('year', p.purchase_date::timestamp with time zone) + '3 mons'::interval
                    ELSE date_trunc('year', p.purchase_date::timestamp with time zone) - '9 mons'::interval
                END
        END AS fy_start_date,

        -- carry through so fy_series can format fy_label correctly
        oc.financial_year

    FROM ${schemaName}.asset_stock_serials         s
    JOIN ${schemaName}.assets                      a  ON a.asset_id              = s.asset_id
    JOIN ${schemaName}.asset_items                 i  ON i.asset_item_id         = s.asset_item_id
    JOIN ${schemaName}.asset_main_category         mc ON mc.main_category_id     = a.asset_main_category_id
    JOIN ${schemaName}.asset_sub_category          sc ON sc.sub_category_id      = a.asset_sub_category_id
    JOIN ${schemaName}.asset_procurement_items     pi ON pi.procurement_item_id  = s.procurement_item_id
    JOIN ${schemaName}.asset_procurements          p  ON p.procurement_id        = pi.procurement_id
    JOIN ${schemaName}.asset_ownership_status_types ot ON ot.ownership_status_type_id = p.ownership_status_id
                                                    AND ot.ownership_status_type    = 'capex'::ownership_type_enum
    CROSS JOIN org_config oc
   
WHERE s.is_active = 1 AND s.is_deleted = 0 AND i.has_depreciation = true AND p.unit_price > 0::numeric AND p.purchase_date IS NOT NULL
  AND (p.subscription_type IS NULL OR p.subscription_type IN ('Perpetual', 'Perpetual with Support'))        ),
/* ─────────────────────────────────────────────────────────────────────────────
   2.  BASE WITH PRO-RATA  —  Y1 fraction + residual Rs  (unchanged logic)
───────────────────────────────────────────────────────────────────────────── */
base_with_prorata AS (
    SELECT
        b.asset_stocks_unique_id,
        b.system_code,
        b.buy_price,
        b.depreciation_start_date,
        b.asset_id,
        b.asset_title,
        b.asset_item_id,
        b.asset_item_name,
        b.asset_type,
        b.company_depreciation_rate,
        b.it_act_depreciation_rate,
        b.company_act_asset_life,
        b.it_act_asset_life,
        b.company_act_residual_value,
        b.it_act_residual_value,
        b.block_id_company,
        b.block_id_it,
        b.main_category_name,
        b.sub_category_name,
        b.location_id,
        b.is_half_year_it,
        b.fy_end_date,
        b.fy_start_date,
        b.financial_year,
        b.fy_end_date - b.depreciation_start_date + 1                                   AS days_in_use_y1,
        round((b.fy_end_date - b.depreciation_start_date + 1)::numeric / 365::numeric, 6) AS company_y1_fraction,
        CASE
            WHEN b.company_act_residual_value IS NOT NULL
             AND b.company_act_residual_value > 0::double precision
            THEN round(b.buy_price * b.company_act_residual_value::numeric / 100::numeric, 2)
            ELSE NULL::numeric
        END AS company_residual_rs,
        CASE
            WHEN b.it_act_residual_value IS NOT NULL
             AND b.it_act_residual_value > 0::double precision
            THEN round(b.buy_price * b.it_act_residual_value::numeric / 100::numeric, 2)
            ELSE NULL::numeric
        END AS it_residual_rs
    FROM base b
),

/* ─────────────────────────────────────────────────────────────────────────────
   3.  FY SERIES  —  generate one row per (serial × FY year)
       fy_label format differs by FY type:
         April-March      →  "2024-25"
         January-December →  "2024"
───────────────────────────────────────────────────────────────────────────── */
fy_series AS (
    SELECT
        b.asset_stocks_unique_id,
        b.system_code,
        b.buy_price,
        b.depreciation_start_date,
        b.asset_id,
        b.asset_title,
        b.asset_item_id,
        b.asset_item_name,
        b.asset_type,
        b.company_depreciation_rate,
        b.it_act_depreciation_rate,
        b.company_act_asset_life,
        b.it_act_asset_life,
        b.company_act_residual_value,
        b.it_act_residual_value,
        b.company_residual_rs,
        b.it_residual_rs,
        b.block_id_company,
        b.block_id_it,
        b.main_category_name,
        b.sub_category_name,
        b.location_id,
        b.is_half_year_it,
        b.fy_end_date,
        b.fy_start_date,
        b.days_in_use_y1,
        b.company_y1_fraction,
        b.financial_year,
        gs.fy_start,
        (gs.fy_start + '1 year -1 days'::interval)::date AS fy_end,
        row_number() OVER (PARTITION BY b.asset_stocks_unique_id ORDER BY gs.fy_start) AS year_number,

      
        CASE
            WHEN b.financial_year = 'January-December'
            THEN to_char(gs.fy_start::timestamp with time zone, 'YYYY')
            ELSE (to_char(gs.fy_start::timestamp with time zone, 'YYYY') || '-' ||
                  to_char(gs.fy_start + '1 year'::interval, 'YY'))
        END AS fy_label

    FROM base_with_prorata b,
    LATERAL (
        SELECT generate_series(
            b.fy_start_date,
            b.fy_start_date + '99 years'::interval,
            '1 year'::interval
        )::date AS fy_start
    ) gs
),

/* ─────────────────────────────────────────────────────────────────────────────
   4.  WDV CALC  —  recursive year-over-year WDV  (ZERO changes here)
       is_half_year_it is already a boolean computed above, so the CASE
       WHEN is_half_year_it THEN 0.5 ELSE 1.0 logic works for both FY types.
───────────────────────────────────────────────────────────────────────────── */
wdv_calc AS (
    -- Year 1 seed
    SELECT
        f.asset_stocks_unique_id,
        f.system_code,
        f.buy_price,
        f.depreciation_start_date,
        f.asset_id,
        f.asset_title,
        f.asset_item_id,
        f.asset_item_name,
        f.asset_type,
        f.company_depreciation_rate,
        f.it_act_depreciation_rate,
        f.company_act_asset_life,
        f.it_act_asset_life,
        f.company_act_residual_value,
        f.it_act_residual_value,
        f.company_residual_rs,
        f.it_residual_rs,
        f.block_id_company,
        f.block_id_it,
        f.main_category_name,
        f.sub_category_name,
        f.location_id,
        f.is_half_year_it,
        f.fy_end_date,
        f.fy_start_date,
        f.days_in_use_y1,
        f.company_y1_fraction,
        f.fy_start,
        f.fy_end,
        f.year_number,
        f.fy_label,
        f.it_residual_rs IS NULL OR f.buy_price > f.it_residual_rs AS it_active,
        f.buy_price::numeric AS it_opening_wdv,
        round(f.buy_price * f.it_act_depreciation_rate::numeric / 100.0 *
            CASE WHEN f.is_half_year_it THEN 0.5 ELSE 1.0 END, 2) AS it_depreciation,
        round(f.buy_price - f.buy_price * f.it_act_depreciation_rate::numeric / 100.0 *
            CASE WHEN f.is_half_year_it THEN 0.5 ELSE 1.0 END, 2) AS it_closing_wdv,
        (f.company_act_asset_life IS NULL OR 1 <= f.company_act_asset_life)
            AND (f.company_residual_rs IS NULL OR f.buy_price > f.company_residual_rs) AS company_active,
        f.buy_price::numeric AS company_opening_wdv,
        round(f.buy_price * f.company_depreciation_rate::numeric / 100.0 * f.company_y1_fraction, 2) AS company_depreciation,
        round(f.buy_price - f.buy_price * f.company_depreciation_rate::numeric / 100.0 * f.company_y1_fraction, 2) AS company_closing_wdv
    FROM fy_series f
    WHERE f.year_number = 1

    UNION ALL

    -- Year N+1 recursive step
    SELECT
        f.asset_stocks_unique_id,
        f.system_code,
        f.buy_price,
        f.depreciation_start_date,
        f.asset_id,
        f.asset_title,
        f.asset_item_id,
        f.asset_item_name,
        f.asset_type,
        f.company_depreciation_rate,
        f.it_act_depreciation_rate,
        f.company_act_asset_life,
        f.it_act_asset_life,
        f.company_act_residual_value,
        f.it_act_residual_value,
        f.company_residual_rs,
        f.it_residual_rs,
        f.block_id_company,
        f.block_id_it,
        f.main_category_name,
        f.sub_category_name,
        f.location_id,
        f.is_half_year_it,
        f.fy_end_date,
        f.fy_start_date,
        f.days_in_use_y1,
        f.company_y1_fraction,
        f.fy_start,
        f.fy_end,
        f.year_number,
        f.fy_label,
        w.it_active
            AND (f.it_residual_rs IS NULL OR w.it_closing_wdv > f.it_residual_rs)
            AND (f.it_act_asset_life IS NULL OR f.year_number <= f.it_act_asset_life) AS it_active,
        w.it_closing_wdv AS it_opening_wdv,
        CASE
            WHEN w.it_active
             AND (f.it_residual_rs IS NULL OR w.it_closing_wdv > f.it_residual_rs)
             AND (f.it_act_asset_life IS NULL OR f.year_number <= f.it_act_asset_life)
            THEN round(w.it_closing_wdv * f.it_act_depreciation_rate::numeric / 100.0, 2)
            ELSE 0::numeric
        END AS it_depreciation,
        CASE
            WHEN w.it_active
             AND (f.it_residual_rs IS NULL OR w.it_closing_wdv > f.it_residual_rs)
             AND (f.it_act_asset_life IS NULL OR f.year_number <= f.it_act_asset_life)
            THEN round(w.it_closing_wdv - round(w.it_closing_wdv * f.it_act_depreciation_rate::numeric / 100.0, 2), 2)
            ELSE w.it_closing_wdv
        END AS it_closing_wdv,
        w.company_active
            AND (f.company_act_asset_life IS NULL OR f.year_number <= f.company_act_asset_life)
            AND (f.company_residual_rs IS NULL OR w.company_closing_wdv > f.company_residual_rs) AS company_active,
        w.company_closing_wdv AS company_opening_wdv,
        CASE
            WHEN w.company_active
             AND (f.company_act_asset_life IS NULL OR f.year_number <= f.company_act_asset_life)
             AND (f.company_residual_rs IS NULL OR w.company_closing_wdv > f.company_residual_rs)
            THEN round(w.company_closing_wdv * f.company_depreciation_rate::numeric / 100.0, 2)
            ELSE 0::numeric
        END AS company_depreciation,
        CASE
            WHEN w.company_active
             AND (f.company_act_asset_life IS NULL OR f.year_number <= f.company_act_asset_life)
             AND (f.company_residual_rs IS NULL OR w.company_closing_wdv > f.company_residual_rs)
            THEN round(w.company_closing_wdv - round(w.company_closing_wdv * f.company_depreciation_rate::numeric / 100.0, 2), 2)
            ELSE w.company_closing_wdv
        END AS company_closing_wdv
    FROM wdv_calc w
    JOIN fy_series f ON f.asset_stocks_unique_id = w.asset_stocks_unique_id
                     AND f.year_number           = (w.year_number + 1)
    WHERE w.company_active OR w.it_active
)

/* ─────────────────────────────────────────────────────────────────────────────
   5.  FINAL SELECT  —  unchanged
───────────────────────────────────────────────────────────────────────────── */
SELECT
    wdv.asset_stocks_unique_id,
    wdv.system_code,
    wdv.asset_id,
    wdv.asset_title,
    wdv.asset_item_id,
    wdv.asset_item_name,
    wdv.asset_type,
    wdv.main_category_name,
    wdv.sub_category_name,
    wdv.block_id_company,
    wdv.block_id_it,
    bc.block_name  AS block_name_company,
    bi.block_name  AS block_name_it,
    wdv.buy_price,
    wdv.depreciation_start_date,
    wdv.company_depreciation_rate,
    wdv.it_act_depreciation_rate,
    wdv.company_act_asset_life,
    wdv.it_act_asset_life,
    wdv.company_act_residual_value,
    wdv.it_act_residual_value,
    wdv.company_residual_rs,
    wdv.it_residual_rs,
    wdv.is_half_year_it,
    wdv.company_y1_fraction,
    wdv.fy_label,
    wdv.year_number,
    wdv.it_active,
    wdv.company_active,
    wdv.it_opening_wdv,
    wdv.it_depreciation,
    wdv.it_closing_wdv,
    wdv.company_opening_wdv,
    wdv.company_depreciation,
    wdv.company_closing_wdv,
    wdv.location_id,
    lbm.location_mapping_id,
    loc.location_name,
    loc.location_code
FROM wdv_calc wdv
LEFT JOIN block_of_assets                  bc  ON bc.block_id              = wdv.block_id_company
LEFT JOIN block_of_assets                  bi  ON bi.block_id              = wdv.block_id_it
LEFT JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = wdv.location_id
                                                 AND lbm.is_deleted          = 0
                                                 AND lbm.is_active           = 1
LEFT JOIN ${schemaName}.asset_locations       loc ON loc.location_id          = lbm.location_id
WHERE wdv.company_active OR wdv.it_active OR wdv.year_number = 1
ORDER BY wdv.asset_stocks_unique_id, wdv.year_number;


CREATE UNIQUE INDEX ${idxIdYear}
  ON ${schemaName}.asset_depreciation_serial_view (asset_stocks_unique_id, year_number);

CREATE INDEX ${idxFy}
  ON ${schemaName}.asset_depreciation_serial_view (fy_label);

CREATE INDEX ${idxBlockCompany}
  ON ${schemaName}.asset_depreciation_serial_view (block_id_company);

CREATE INDEX ${idxBlockIt}
  ON ${schemaName}.asset_depreciation_serial_view (block_id_it);

CREATE INDEX ${idxLocation}
  ON ${schemaName}.asset_depreciation_serial_view (location_id);

       `;
        try {
            await this.dataSource.query(query);
            console.log(`✅ Materialized view ${viewName} created successfully`);
        }
        catch (err) {
            console.error(`❌ Error creating materialized view ${viewName}:`, err);
            throw err;
        }
    }
};
exports.AssetDepreciationScript = AssetDepreciationScript;
exports.AssetDepreciationScript = AssetDepreciationScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetDepreciationScript);
