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
exports.DashboardAnalyticsViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DashboardAnalyticsViewScript = class DashboardAnalyticsViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDashboardAnalyticsView(schemaName) {
        const viewName = `${schemaName}.dashboard_analytics`;
        const query = `
-- dashboard_analytics is MATERIALIZED (global snapshot, refreshed on a timer/button)
-- so the dashboard reads it in ms instead of re-running ~30 CTEs over the whole
-- asset_stock_serials on every load. dashboard_analytics_live keeps the per-user
-- (self-permission) logic for the few roles that need filtered numbers.
DO $mvdrop$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'dashboard_analytics' AND c.relkind = 'm') THEN
    EXECUTE 'DROP MATERIALIZED VIEW ${schemaName}.dashboard_analytics';
  ELSIF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = '${schemaName}' AND c.relname = 'dashboard_analytics') THEN
    EXECUTE 'DROP VIEW ${schemaName}.dashboard_analytics';
  END IF;
END $mvdrop$;

CREATE OR REPLACE VIEW ${schemaName}.dashboard_analytics_live
 AS
 WITH org_profile AS (
         SELECT organizational_profile.financial_year
           FROM ${schemaName}.organizational_profile
         LIMIT 1
        ), current_fy AS (
         SELECT organizational_profile.financial_year,
                CASE
                    WHEN organizational_profile.financial_year::text = 'April-March'::text THEN 4
                    WHEN organizational_profile.financial_year::text = 'January-December'::text THEN 1
                    ELSE 4
                END AS start_month,
                CASE
                    WHEN organizational_profile.financial_year::text = 'April-March'::text THEN EXTRACT(year FROM CURRENT_DATE)
                    WHEN organizational_profile.financial_year::text = 'January-December'::text THEN EXTRACT(year FROM CURRENT_DATE)
                    ELSE EXTRACT(year FROM CURRENT_DATE)
                END AS fy_year
           FROM ${schemaName}.organizational_profile
         LIMIT 1
        ), base_assets AS (
         SELECT ass.asset_stocks_unique_id,
            ass.current_status_id,
            lbm.branch_id,
            ass.created_at,
            ass.created_by
           FROM ${schemaName}.asset_stock_serials ass
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
             JOIN ${schemaName}.asset_locations loc ON loc.location_id = lbm.location_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
        ), asset_counts AS (
         SELECT base_assets.branch_id,
            count(*) AS total_assets,
            count(*) FILTER (WHERE base_assets.current_status_id = 7) AS in_use,
            count(*) FILTER (WHERE base_assets.current_status_id = 1) AS available,
            count(*) FILTER (WHERE base_assets.current_status_id = ANY (ARRAY[2, 6])) AS maintenance
           FROM base_assets
          GROUP BY base_assets.branch_id
        ), user_counts AS (
         SELECT users.branch_id,
            count(*) AS users
           FROM ${schemaName}.users
          WHERE users.is_active = 1
          GROUP BY users.branch_id
        ), maintenance_monthly_base AS (
         SELECT lbm.branch_id,
            to_char(m.scheduled_date::timestamp with time zone, 'Mon'::text) AS month,
            EXTRACT(month FROM m.scheduled_date) AS month_no,
            count(*) AS asset_count,
            COALESCE(sum(m.estimated_cost), 0::double precision) AS amount
           FROM ${schemaName}.asset_maintenance m
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE m.is_active = 1 AND m.is_deleted = 0 AND EXTRACT(year FROM m.scheduled_date) = EXTRACT(year FROM CURRENT_DATE)
          GROUP BY lbm.branch_id, (to_char(m.scheduled_date::timestamp with time zone, 'Mon'::text)), (EXTRACT(month FROM m.scheduled_date))
        ), maintenance_monthly AS (
         SELECT maintenance_monthly_base.branch_id,
            json_agg(json_build_object('month', maintenance_monthly_base.month, 'assetCount', maintenance_monthly_base.asset_count, 'amount', maintenance_monthly_base.amount) ORDER BY maintenance_monthly_base.month_no) AS maintenance_monthly
           FROM maintenance_monthly_base
          GROUP BY maintenance_monthly_base.branch_id
        ), maintenance_yearly_base AS (
         SELECT lbm.branch_id,
            EXTRACT(year FROM m.scheduled_date) AS year,
            count(*) AS asset_count,
            COALESCE(sum(m.estimated_cost), 0::double precision) AS amount
           FROM ${schemaName}.asset_maintenance m
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE m.is_active = 1 AND m.is_deleted = 0
          GROUP BY lbm.branch_id, (EXTRACT(year FROM m.scheduled_date))
        ), maintenance_yearly AS (
         SELECT maintenance_yearly_base.branch_id,
            json_agg(json_build_object('year', maintenance_yearly_base.year, 'assetCount', maintenance_yearly_base.asset_count, 'amount', maintenance_yearly_base.amount) ORDER BY maintenance_yearly_base.year) AS maintenance_yearly
           FROM maintenance_yearly_base
          GROUP BY maintenance_yearly_base.branch_id
        ), category_base AS (
         SELECT ba.branch_id,
            mc.main_category_name AS main_category,
            mc.main_category_id,
            sc.sub_category_name,
            count(*) AS count
           FROM base_assets ba
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = ba.asset_stocks_unique_id
             JOIN ${schemaName}.asset_items item ON item.asset_item_id = ass.asset_item_id
             JOIN ${schemaName}.asset_main_category mc ON mc.main_category_id = item.main_category_id
             JOIN ${schemaName}.asset_sub_category sc ON sc.sub_category_id = item.sub_category_id
          GROUP BY ba.branch_id, mc.main_category_name, mc.main_category_id, sc.sub_category_name
        ), category_summary AS (
         SELECT cb.branch_id,
            json_agg(json_build_object('mainCategory', cb.main_category, 'subCategory', cb.sub_category_name, 'count', cb.count)) AS category_data,
            json_build_object('all', ( SELECT json_agg(json_build_object('name', t.main_category, 'value', round(t.count * 100.0 / NULLIF(total.total_count, 0::numeric), 0), 'count', t.count)) AS json_agg
                   FROM ( SELECT cb2.main_category,
                            sum(cb2.count) AS count
                           FROM category_base cb2
                          WHERE cb2.branch_id = cb.branch_id
                          GROUP BY cb2.main_category) t
                     CROSS JOIN ( SELECT sum(cb3.count) AS total_count
                           FROM category_base cb3
                          WHERE cb3.branch_id = cb.branch_id) total), 'categories', ( SELECT json_object_agg(cat.main_category, cat.subcat_data) AS json_object_agg
                   FROM ( SELECT cb2.main_category,
                            json_agg(json_build_object('name', cb2.sub_category_name, 'value', round(cb2.count::numeric * 100.0 / NULLIF(cat_total.total_cat, 0::numeric), 0), 'count', cb2.count) ORDER BY cb2.count DESC) AS subcat_data
                           FROM category_base cb2
                             JOIN ( SELECT cb3.main_category,
                                    sum(cb3.count) AS total_cat
                                   FROM category_base cb3
                                  WHERE cb3.branch_id = cb.branch_id
                                  GROUP BY cb3.main_category) cat_total ON cat_total.main_category = cb2.main_category
                          WHERE cb2.branch_id = cb.branch_id
                          GROUP BY cb2.main_category) cat)) AS category_formatted
           FROM category_base cb
          GROUP BY cb.branch_id
        ), category_base_all AS (
         SELECT mc.main_category_name AS main_category,
            sc.sub_category_name,
            count(*) AS count
           FROM base_assets ba
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = ba.asset_stocks_unique_id
             JOIN ${schemaName}.asset_items item ON item.asset_item_id = ass.asset_item_id
             JOIN ${schemaName}.asset_main_category mc ON mc.main_category_id = item.main_category_id
             JOIN ${schemaName}.asset_sub_category sc ON sc.sub_category_id = item.sub_category_id
          GROUP BY mc.main_category_name, sc.sub_category_name
        ), category_summary_all AS (
         SELECT json_build_object('all', ( SELECT json_agg(json_build_object('name', t.main_category, 'value', round(t.count * 100.0 / NULLIF(total.total_count, 0::numeric), 0), 'count', t.count)) AS json_agg
                   FROM ( SELECT category_base_all.main_category,
                            sum(category_base_all.count) AS count
                           FROM category_base_all
                          GROUP BY category_base_all.main_category) t
                     CROSS JOIN ( SELECT sum(category_base_all.count) AS total_count
                           FROM category_base_all) total), 'categories', ( SELECT json_object_agg(cat.main_category, cat.subcat_data) AS json_object_agg
                   FROM ( SELECT cb.main_category,
                            json_agg(json_build_object('name', cb.sub_category_name, 'value', round(cb.count::numeric * 100.0 / NULLIF(cat_total.total_cat, 0::numeric), 0), 'count', cb.count) ORDER BY cb.count DESC) AS subcat_data
                           FROM category_base_all cb
                             JOIN ( SELECT category_base_all.main_category,
                                    sum(category_base_all.count) AS total_cat
                                   FROM category_base_all
                                  GROUP BY category_base_all.main_category) cat_total ON cat_total.main_category = cb.main_category
                          GROUP BY cb.main_category) cat)) AS category_formatted_all
        ), new_assets_base AS (
         SELECT ba.branch_id,
            to_char(ba.created_at::timestamp with time zone, 'Mon'::text) AS month,
            EXTRACT(month FROM ba.created_at) AS month_no,
            EXTRACT(year FROM ba.created_at) AS year_no,
            count(*) AS count
           FROM base_assets ba
             CROSS JOIN current_fy cf_1
          WHERE ba.created_at IS NOT NULL AND
                CASE
                    WHEN cf_1.start_month = 4 THEN EXTRACT(month FROM ba.created_at) >= 4::numeric AND EXTRACT(year FROM ba.created_at) = EXTRACT(year FROM CURRENT_DATE) OR EXTRACT(month FROM ba.created_at) < 4::numeric AND EXTRACT(year FROM ba.created_at) = (EXTRACT(year FROM CURRENT_DATE) - 1::numeric)
                    ELSE EXTRACT(year FROM ba.created_at) = EXTRACT(year FROM CURRENT_DATE)
                END
          GROUP BY ba.branch_id, (to_char(ba.created_at::timestamp with time zone, 'Mon'::text)), (EXTRACT(month FROM ba.created_at)), (EXTRACT(year FROM ba.created_at))
        ), new_assets AS (
         SELECT new_assets_base.branch_id,
            json_agg(json_build_object('month', new_assets_base.month, 'year', new_assets_base.year_no, 'value', new_assets_base.count) ORDER BY new_assets_base.year_no, new_assets_base.month_no) AS new_assets
           FROM new_assets_base
          GROUP BY new_assets_base.branch_id
        ), asset_age AS (
         SELECT lbm.branch_id,
            count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '1 year'::interval) AS less_than_1,
            count(*) FILTER (WHERE age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '1 year'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '3 years'::interval) AS one_to_three,
            count(*) FILTER (WHERE age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '3 years'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '5 years'::interval) AS three_to_five,
            count(*) FILTER (WHERE age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '5 years'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '7 years'::interval) AS five_to_seven,
            count(*) FILTER (WHERE age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '7 years'::interval) AS more_than_seven,
            count(*) FILTER (WHERE ap.purchase_date IS NULL) AS no_purchase_date,
            count(*) AS total_count
           FROM ${schemaName}.asset_stock_serials ass
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = ass.procurement_item_id
             LEFT JOIN ${schemaName}.asset_procurements ap ON ap.procurement_id = api.procurement_id
             LEFT JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             LEFT JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE ass.is_active = 1 AND ass.is_deleted = 0 AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
          GROUP BY lbm.branch_id
        ), asset_age_all AS (
         SELECT count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '1 year'::interval) AS less_than_1,
            count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '1 year'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '3 years'::interval) AS one_to_three,
            count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '3 years'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '5 years'::interval) AS three_to_five,
            count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '5 years'::interval AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) < '7 years'::interval) AS five_to_seven,
            count(*) FILTER (WHERE ap.purchase_date IS NOT NULL AND age(CURRENT_DATE::timestamp with time zone, ap.purchase_date::timestamp with time zone) >= '7 years'::interval) AS more_than_seven,
            count(*) FILTER (WHERE ap.purchase_date IS NULL) AS no_purchase_date,
            count(*) AS total_count
           FROM ${schemaName}.asset_stock_serials ass
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_item_id = ass.procurement_item_id
             LEFT JOIN ${schemaName}.asset_procurements ap ON ap.procurement_id = api.procurement_id
          WHERE ass.is_active = 1 AND ass.is_deleted = 0
        ), ownership_grouped AS (
         SELECT b.branch_id,
            ost.ownership_status_type_id AS type_id,
            ost.ownership_status_type_name AS type,
            ost.asset_ownership_status_color AS color,
            count(ass.asset_stocks_unique_id) FILTER (WHERE lbm.branch_id = b.branch_id) AS count,
            sum(count(ass.asset_stocks_unique_id) FILTER (WHERE lbm.branch_id = b.branch_id)) OVER (PARTITION BY b.branch_id) AS total_count
           FROM ${schemaName}.branches b
             CROSS JOIN ${schemaName}.asset_ownership_status_types ost
             LEFT JOIN ${schemaName}.asset_procurements ap ON ap.ownership_status_id = ost.ownership_status_type_id
             LEFT JOIN ${schemaName}.asset_procurement_items api ON api.procurement_id = ap.procurement_id
             LEFT JOIN ${schemaName}.asset_stock_serials ass ON ass.procurement_item_id = api.procurement_item_id AND ass.is_active = 1 AND ass.is_deleted = 0 AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
             LEFT JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             LEFT JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          GROUP BY b.branch_id, ost.ownership_status_type_id, ost.ownership_status_type_name, ost.asset_ownership_status_color
        ), ownership_summary AS (
         SELECT og.branch_id,
            json_agg(json_build_object('type', og.type, 'count', og.count, 'color', og.color, 'percentage', round(og.count::numeric * 100.0 / NULLIF(og.total_count, 0::numeric), 2)) ORDER BY og.type_id) AS ownership
           FROM ownership_grouped og
          GROUP BY og.branch_id
        ), latest_events AS (
         SELECT aae.event_id,
            aae.asset_stocks_unique_id,
            aae.mapping_id,
            aae.performed_by,
            aae.notes,
            aae.performed_at,
            aae.working_condition_id,
            aae.target_type,
            aae.target_id
           FROM ${schemaName}.asset_assignment_events aae
             JOIN ( SELECT asset_assignment_events.asset_stocks_unique_id,
                    max(asset_assignment_events.event_id) AS latest_event_id
                   FROM ${schemaName}.asset_assignment_events
                  GROUP BY asset_assignment_events.asset_stocks_unique_id) latest ON latest.latest_event_id = aae.event_id
        ), assignment_base AS (
         SELECT le.target_type,
            le.target_id,
            lbm.branch_id
           FROM latest_events le
             JOIN ${schemaName}.asset_stock_serials ass ON ass.asset_stocks_unique_id = le.asset_stocks_unique_id AND (COALESCE(current_setting('app.has_self_permission'::text, true), 'false'::text)::boolean = false OR ass.created_by = COALESCE(current_setting('app.user_id'::text, true), '0'::text)::integer)
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
        ), assignment_grouped AS (
         SELECT ab.branch_id,
            ab.target_type,
            ab.target_id,
            count(*) AS count,
            sum(count(*)) OVER (PARTITION BY ab.branch_id) AS total_count,
            row_number() OVER (PARTITION BY ab.branch_id ORDER BY (count(*)) DESC) AS rn
           FROM assignment_base ab
          GROUP BY ab.branch_id, ab.target_type, ab.target_id
        ), assignment_summary AS (
         SELECT ag.branch_id,
            json_agg(json_build_object('type', ag.target_type, 'targetId', ag.target_id, 'count', ag.count, 'percentage', round(ag.count::numeric * 100.0 / NULLIF(ag.total_count, 0::numeric), 2))) AS assignments
           FROM assignment_grouped ag
          GROUP BY ag.branch_id
        ), top_users_ranked AS (
         SELECT ab.branch_id,
            u.user_id,
            concat(u.first_name, ' ', COALESCE(u.last_name, ''::character varying)) AS name,
            count(*) AS count,
            sum(count(*)) OVER (PARTITION BY ab.branch_id) AS total_count,
            row_number() OVER (PARTITION BY ab.branch_id ORDER BY (count(*)) DESC) AS rn
           FROM assignment_base ab
             JOIN ${schemaName}.users u ON ab.target_type = 'USER'::${schemaName}.assign_type_enum AND u.user_id = ab.target_id
          GROUP BY ab.branch_id, u.user_id, u.first_name, u.last_name
        ), top_users AS (
         SELECT top_users_ranked.branch_id,
            json_agg(json_build_object('id', top_users_ranked.user_id, 'name', top_users_ranked.name, 'count', top_users_ranked.count, 'percentage', round(top_users_ranked.count::numeric * 100.0 / NULLIF(top_users_ranked.total_count, 0::numeric), 2))) AS top_users
           FROM top_users_ranked
          WHERE top_users_ranked.rn <= 5
          GROUP BY top_users_ranked.branch_id
        ), top_departments_ranked AS (
         SELECT ab.branch_id,
            d.department_id,
            d.department_name,
            count(*) AS count,
            sum(count(*)) OVER (PARTITION BY ab.branch_id) AS total_count,
            row_number() OVER (PARTITION BY ab.branch_id ORDER BY (count(*)) DESC) AS rn
           FROM assignment_base ab
             JOIN ${schemaName}.departments d ON ab.target_type = 'DEPARTMENT'::${schemaName}.assign_type_enum AND d.department_id = ab.target_id
          GROUP BY ab.branch_id, d.department_id, d.department_name
        ), top_departments AS (
         SELECT top_departments_ranked.branch_id,
            json_agg(json_build_object('id', top_departments_ranked.department_id, 'name', top_departments_ranked.department_name, 'count', top_departments_ranked.count, 'percentage', round(top_departments_ranked.count::numeric * 100.0 / NULLIF(top_departments_ranked.total_count, 0::numeric), 2))) AS top_departments
           FROM top_departments_ranked
          WHERE top_departments_ranked.rn <= 5
          GROUP BY top_departments_ranked.branch_id
        ), status_grouped AS (
         SELECT lbm.branch_id,
            ast.status_type_id,
            ast.status_type_name,
            ast.status_color_code,
            count(*) AS count
           FROM ${schemaName}.asset_stock_serials ass
             JOIN base_assets ba ON ba.asset_stocks_unique_id = ass.asset_stocks_unique_id
             JOIN ${schemaName}.asset_status_types ast ON ast.status_type_id = ass.current_status_id
             JOIN ${schemaName}.stocks s ON s.stock_id = ass.stock_id
             JOIN ${schemaName}.location_branch_mapping lbm ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
          WHERE ass.is_active = 1 AND ass.is_deleted = 0
          GROUP BY lbm.branch_id, ast.status_type_id, ast.status_type_name, ast.status_color_code
        ), status_summary AS (
         SELECT status_grouped.branch_id,
            json_agg(json_build_object('statusId', status_grouped.status_type_id, 'statusName', status_grouped.status_type_name, 'color', status_grouped.status_color_code, 'count', status_grouped.count)) AS status_summary
           FROM status_grouped
          GROUP BY status_grouped.branch_id
        ), top_branches_ranked AS (
         SELECT ab.branch_id,
            b.branch_id AS target_branch_id,
            b.branch_name,
            count(*) AS count,
            sum(count(*)) OVER (PARTITION BY ab.branch_id) AS total_count,
            row_number() OVER (PARTITION BY ab.branch_id ORDER BY (count(*)) DESC) AS rn
           FROM assignment_base ab
             JOIN ${schemaName}.branches b ON ab.target_type = 'BRANCH'::${schemaName}.assign_type_enum AND b.branch_id = ab.target_id
          GROUP BY ab.branch_id, b.branch_id, b.branch_name
        ), top_branches AS (
         SELECT tbr.branch_id,
            json_agg(json_build_object('id', tbr.target_branch_id, 'name', tbr.branch_name, 'count', tbr.count, 'percentage', round(tbr.count::numeric * 100.0 / NULLIF(tbr.total_count, 0::numeric), 2))) AS top_branches
           FROM top_branches_ranked tbr
          WHERE tbr.rn <= 5
          GROUP BY tbr.branch_id
        ), assignment_types AS (
         SELECT unnest(ARRAY['USER'::text, 'DEPARTMENT'::text, 'BRANCH'::text]) AS target_type
        ), assignment_type_summary AS (
         SELECT b.branch_id,
            at.target_type,
            count(ab.target_type) AS count,
            sum(count(ab.target_type)) OVER (PARTITION BY b.branch_id) AS total_count
           FROM ${schemaName}.branches b
             CROSS JOIN assignment_types at
             LEFT JOIN assignment_base ab ON ab.branch_id = b.branch_id AND ab.target_type = at.target_type::${schemaName}.assign_type_enum
          GROUP BY b.branch_id, at.target_type
        ), assignment_type_summary_json AS (
         SELECT ats.branch_id,
            json_agg(json_build_object('type', ats.target_type, 'count', ats.count, 'percentage', COALESCE(round(ats.count::numeric * 100.0 / NULLIF(ats.total_count, 0::numeric), 2), 0::numeric))) AS assignment_type_summary
           FROM assignment_type_summary ats
          GROUP BY ats.branch_id
        )
 SELECT ac.branch_id,
    json_build_object('financialYear', cf.financial_year, 'users', COALESCE(uc.users, 0::bigint), 'assets', ac.total_assets, 'inUse', ac.in_use, 'available', ac.available, 'maintenance', ac.maintenance, 'maintenanceMonthly', mm.maintenance_monthly, 'maintenanceYearly', my.maintenance_yearly, 'ownership', os.ownership, 'categoryChart', cs.category_data, 'categoryChartFormatted', cs.category_formatted, 'categoryChartFormattedAll', csa.category_formatted_all, 'newAssets', na.new_assets, 'assignments', asg.assignments, 'topUsers', tu.top_users, 'topDepartments', td.top_departments, 'topBranches', tb.top_branches, 'statusSummary', ss.status_summary, 'assignmentTypeSummary', COALESCE(atsj.assignment_type_summary, '[]'::json), 'assetAge', json_build_object('lessThanOneYear', json_build_object('count', aa.less_than_1, 'percentage', round(aa.less_than_1::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)), 'oneToThreeYears', json_build_object('count', aa.one_to_three, 'percentage', round(aa.one_to_three::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)), 'threeToFiveYears', json_build_object('count', aa.three_to_five, 'percentage', round(aa.three_to_five::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)), 'fiveToSevenYears', json_build_object('count', aa.five_to_seven, 'percentage', round(aa.five_to_seven::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)), 'moreThanSevenYears', json_build_object('count', aa.more_than_seven, 'percentage', round(aa.more_than_seven::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)), 'noPurchaseDate', json_build_object('count', aa.no_purchase_date, 'percentage', round(aa.no_purchase_date::numeric * 100.0 / NULLIF(aa.total_count, 0)::numeric, 2)))) AS dashboard
   FROM asset_counts ac
     LEFT JOIN user_counts uc ON uc.branch_id = ac.branch_id
     LEFT JOIN maintenance_monthly mm ON mm.branch_id = ac.branch_id
     LEFT JOIN maintenance_yearly my ON my.branch_id = ac.branch_id
     LEFT JOIN category_summary cs ON cs.branch_id = ac.branch_id
     LEFT JOIN new_assets na ON na.branch_id = ac.branch_id
     LEFT JOIN asset_age aa ON aa.branch_id = ac.branch_id
     LEFT JOIN assignment_summary asg ON asg.branch_id = ac.branch_id
     LEFT JOIN top_users tu ON tu.branch_id = ac.branch_id
     LEFT JOIN top_departments td ON td.branch_id = ac.branch_id
     LEFT JOIN status_summary ss ON ss.branch_id = ac.branch_id
     LEFT JOIN top_branches tb ON tb.branch_id = ac.branch_id
     LEFT JOIN ownership_summary os ON os.branch_id = ac.branch_id
     LEFT JOIN assignment_type_summary_json atsj ON atsj.branch_id = ac.branch_id
     CROSS JOIN category_summary_all csa
     CROSS JOIN current_fy cf;

ALTER TABLE ${schemaName}.dashboard_analytics_live
    OWNER TO postgres;

-- Materialized global snapshot the dashboard reads by default (one row per branch).
CREATE MATERIALIZED VIEW ${schemaName}.dashboard_analytics AS
  SELECT * FROM ${schemaName}.dashboard_analytics_live
 WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uq_dashboard_analytics
    ON ${schemaName}.dashboard_analytics (branch_id);

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
exports.DashboardAnalyticsViewScript = DashboardAnalyticsViewScript;
exports.DashboardAnalyticsViewScript = DashboardAnalyticsViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DashboardAnalyticsViewScript);
