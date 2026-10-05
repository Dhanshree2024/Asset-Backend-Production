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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_context_service_1 = require("../common/context/request-context.service");
const cache_key_util_1 = require("../common/redis/cache-key.util");
const special_permission_master_1 = require("../organizational-profile/entity/policy-builder/special-permission-master");
const policy_attribute_entity_1 = require("../organizational-profile/entity/policy-builder/policy-attribute.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const redis_service_1 = require("../common/redis/redis.service");
let ReportsService = class ReportsService {
    constructor(dataSource, requestContext, redisService, specialPermissionRepo, policyAttrRepo) {
        this.dataSource = dataSource;
        this.requestContext = requestContext;
        this.redisService = redisService;
        this.specialPermissionRepo = specialPermissionRepo;
        this.policyAttrRepo = policyAttrRepo;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
        return schema;
    }
    buildBaseCte(schema, innerFilterSql = '') {
        return `
      latest_map AS (
        SELECT DISTINCT ON (am.asset_stocks_unique_id)
               am.asset_stocks_unique_id,
               am.target_type,
               am.target_id
        FROM ${schema}.asset_mapping am
        WHERE am.is_deleted = 0 AND am.is_active = 1
        ORDER BY am.asset_stocks_unique_id, am.mapping_id DESC
      ),
      base AS (
        SELECT
          s.asset_stocks_unique_id,
          -- FIX 6: the serial's own asset_item_id can be NULL or stale (e.g. the
          -- serial row was never backfilled when the item was set/changed on the
          -- asset) while the ASSET's asset_item_id is the authoritative value the
          -- rest of the UI displays. COALESCE onto the asset's item so a serial
          -- with a null/divergent serial-level item id still matches the item
          -- filter and groups/labels under the correct item — this is what fixed
          -- "2 assets of item X exist but the report shows 0".
          COALESCE(s.asset_item_id, a.asset_item_id) AS asset_item_id,
          ai.asset_item_name,
          a.asset_main_category_id,
          a.asset_sub_category_id,
          mc.main_category_name,
          sc.sub_category_name,
          -- FIX 1: branch must include DIRECT branch assignments, not just the
          -- physical location. latest_map (lm) already resolves the asset's most
          -- recent asset_mapping row, including target_type='BRANCH', but nothing
          -- previously read it for branch — an asset assigned straight to a
          -- branch (and never physically relocated there) had branch_id=NULL and
          -- vanished from branch grouping/filtering. Semantics: assignment wins,
          -- location is the fallback. This is a single COALESCE (never both), so
          -- every asset is still counted exactly once and totals stay in sync
          -- with the asset list. Enum compared via ::text — the codebase has hit
          -- "operator does not exist: assign_type_enum = assign_type_enum" when
          -- comparing enum literals directly.
          COALESCE(
            CASE WHEN lm.target_type::text = 'BRANCH' THEN lm.target_id END,
            lbm.branch_id
          )                                   AS branch_id,
          br.branch_name                      AS branch_name,
          COALESCE(
            CASE WHEN lm.target_type::text = 'DEPARTMENT' THEN lm.target_id END,
            CASE WHEN lm.target_type::text = 'USER'       THEN u.department_id END
          )                                   AS department_id,
          -- FIX 4: sibling column so callers can tell a DIRECT department
          -- assignment apart from one inherited VIA_USER (the department of the
          -- user the asset is assigned to). Only meaningful when department_id
          -- above is non-null; NULL here means neither applied.
          CASE
            WHEN lm.target_type::text = 'DEPARTMENT' THEN 'DIRECT'
            WHEN lm.target_type::text = 'USER' AND u.department_id IS NOT NULL THEN 'VIA_USER'
            ELSE NULL
          END                                 AS department_source,
          COALESCE(p.unit_price, 0)::numeric  AS ex_tax,
          (COALESCE(p.gst_amount, 0)::numeric
             / NULLIF(pi.quantity, 0))        AS tax
        FROM ${schema}.asset_stock_serials s
        -- "a" (assets) is joined BEFORE "ai" (asset_items) on purpose: FIX 6's
        -- COALESCE(s.asset_item_id, a.asset_item_id) needs "a" already in scope
        -- for ai's ON clause to reference it (a join's ON can only see tables
        -- that already appear earlier in the FROM/JOIN chain).
        LEFT JOIN ${schema}.assets a    ON a.asset_id = s.asset_id
        -- FIX 2a: was an INNER JOIN — any serial whose asset_item row was
        -- orphaned/deleted was silently dropped from the report entirely
        -- (contributing to the report undercounting vs. the dashboard/asset
        -- list). LEFT JOIN keeps the serial with a null item name instead of
        -- discarding it. FIX 6: joins on the same COALESCE as the projected
        -- asset_item_id above, so the label always matches the id used for
        -- filtering/grouping.
        LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(s.asset_item_id, a.asset_item_id)
        LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category  sc ON sc.sub_category_id  = a.asset_sub_category_id
        LEFT JOIN ${schema}.location_branch_mapping lbm
               ON lbm.location_mapping_id = s.location_id
              AND lbm.is_deleted = 0
        -- lm MUST be joined before br: br's join condition (FIX 1) needs
        -- lm.target_type/target_id already resolved to pick branch-by-assignment
        -- over branch-by-location.
        LEFT JOIN latest_map lm ON lm.asset_stocks_unique_id = s.asset_stocks_unique_id
        LEFT JOIN ${schema}.branches br ON br.branch_id = COALESCE(
               CASE WHEN lm.target_type::text = 'BRANCH' THEN lm.target_id END,
               lbm.branch_id
             )
        LEFT JOIN ${schema}.users u
               ON lm.target_type::text = 'USER' AND u.user_id = lm.target_id
        LEFT JOIN ${schema}.asset_procurement_items pi
               ON pi.procurement_item_id = s.procurement_item_id
        LEFT JOIN ${schema}.asset_procurements p
               ON p.procurement_id = pi.procurement_id
        -- FIX 2b: these three predicates must stay in sync with
        -- v_asset_stock_serials's final WHERE (see
        -- organization_register/onboarding_sql_scripts/assetlistview.ts:
        -- "serial.is_deleted = 0 AND asset.asset_sub_category_id <> 15") plus the
        -- dashboard's is_active=1 filter (dashboard.service.ts). This report was
        -- undercounting vs. both (430 dashboard vs 428 report) because it was
        -- missing the sub-category-15 exclusion and the active filter. If counts
        -- diverge again, check this WHERE against those two sources first.
        -- MUST MATCH v_asset_stock_serials EXACTLY (see
        -- organization_register/onboarding_sql_scripts/assetlistview.ts, final
        -- WHERE: "serial.is_deleted = 0 AND asset.asset_sub_category_id <> 15").
        -- The asset LIST reads that view and adds NO further asset-level
        -- filters, so the report must not either. Previously this also required
        -- asset_is_active = 1 and asset_is_deleted = 0, which made every report
        -- STRICTER than the list and produced the count mismatches (e.g. list
        -- 136 vs report 133 — the 3 difference was inactive assets the list
        -- shows but the report was dropping).
        WHERE s.is_deleted = 0
          AND COALESCE(a.asset_sub_category_id, 0) <> 15${innerFilterSql}
      )
    `;
    }
    buildFilters(dto, schema) {
        const f = dto.filters ?? {};
        const params = [];
        const clauses = [];
        const inFilter = (col, vals) => {
            if (!vals?.length)
                return;
            params.push(vals);
            clauses.push(`${col} = ANY($${params.length}::int[])`);
        };
        inFilter('base.asset_item_id', f.asset_item_ids);
        inFilter('base.asset_main_category_id', f.main_category_ids);
        inFilter('base.asset_sub_category_id', f.sub_category_ids);
        inFilter('base.branch_id', f.branch_ids);
        inFilter('base.department_id', f.department_ids);
        return {
            where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
            params,
        };
    }
    buildInnerFilters(dto) {
        const f = dto.filters ?? {};
        const params = [];
        const clauses = [];
        const push = (sql, val) => {
            params.push(val);
            clauses.push(sql.replace('$?', `$${params.length}`));
        };
        if (f.location_ids?.length)
            push('s.location_id = ANY($?::int[])', f.location_ids);
        if (f.vendor_ids?.length)
            push('p.vendor_id = ANY($?::int[])', f.vendor_ids);
        if (f.ownership_status_ids?.length)
            push('p.ownership_status_id = ANY($?::int[])', f.ownership_status_ids);
        if (f.status_ids?.length)
            push('s.current_status_id = ANY($?::int[])', f.status_ids);
        if (f.working_status_ids?.length)
            push('s.working_status_type_id = ANY($?::int[])', f.working_status_ids);
        if (f.purchase_date_from)
            push('p.purchase_date >= $?::date', f.purchase_date_from);
        if (f.purchase_date_to)
            push('p.purchase_date <= $?::date', f.purchase_date_to);
        return { sql: clauses.length ? ` AND ${clauses.join(' AND ')}` : '', params };
    }
    buildSearchHaving(dto) {
        const term = dto.search?.trim();
        if (!term)
            return { sql: '', params: [] };
        const params = [`%${term}%`];
        const departmentOr = dto.groupBy === 'department'
            ? `\n        OR bool_or(COALESCE(d.department_name, 'Unassigned') ILIKE $1)`
            : '';
        return {
            sql: `HAVING (
        bool_or(base.asset_item_name ILIKE $1)
        OR bool_or(base.branch_name ILIKE $1)
        OR bool_or(base.main_category_name ILIKE $1)
        OR bool_or(base.sub_category_name ILIKE $1)${departmentOr}
        OR CAST(COUNT(*) AS text) ILIKE $1
        OR CAST(ROUND(COALESCE(SUM(base.ex_tax), 0), 2) AS text) ILIKE $1
        OR CAST(ROUND(COALESCE(SUM(base.tax), 0), 2) AS text) ILIKE $1
        OR CAST(ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)), 0), 2) AS text) ILIKE $1
      )`,
            params,
        };
    }
    groupSpec(groupBy, includeBranch) {
        if (groupBy === 'item') {
            return {
                select: `
          base.asset_item_id,
          base.asset_item_name,
          MIN(base.main_category_name) AS main_category_name,
          MIN(base.sub_category_name)  AS sub_category_name`,
                groupBy: `base.asset_item_id, base.asset_item_name`,
                defaultSort: 'asset_item_name',
            };
        }
        if (groupBy === 'branch') {
            return {
                select: `
          base.branch_id,
          COALESCE(base.branch_name, 'Unassigned') AS branch_name,
          base.asset_item_id,
          base.asset_item_name`,
                groupBy: `base.branch_id, base.branch_name, base.asset_item_id, base.asset_item_name`,
                defaultSort: 'branch_name, asset_item_name',
            };
        }
        const branchSel = includeBranch
            ? `, base.branch_id, COALESCE(base.branch_name, 'Unassigned') AS branch_name`
            : '';
        const branchGrp = includeBranch ? `, base.branch_id, base.branch_name` : '';
        return {
            select: `
        base.department_id,
        COALESCE(d.department_name, 'Unassigned') AS department_name${branchSel},
        base.asset_item_id,
        base.asset_item_name,
        -- FIX 4: only meaningful for the department grouping (guarded here by
        -- only being emitted in this branch of groupSpec) — how many of this
        -- group's assets were assigned DIRECTLY to the department vs. inherited
        -- VIA the assigned user's department. Branch/item groupings don't
        -- surface this since department_source is department-specific.
        COUNT(*) FILTER (WHERE base.department_source = 'DIRECT')   AS direct_count,
        COUNT(*) FILTER (WHERE base.department_source = 'VIA_USER') AS via_user_count`,
            groupBy: `base.department_id, d.department_name${branchGrp}, base.asset_item_id, base.asset_item_name`,
            defaultSort: 'department_name, asset_item_name',
        };
    }
    async getCategoryTracingReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        let allowedSerialIds = null;
        if (branchIds.length > 0) {
            const rows = await this.dataSource.query(`
      SELECT DISTINCT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      LEFT JOIN ${schema}.asset_procurement_items api
        ON api.procurement_item_id = serial.procurement_item_id
      LEFT JOIN location_branch_mapping loc
        ON loc.location_mapping_id = api.location_id
      WHERE serial.is_deleted = 0
        AND loc.branch_id = ANY($1)
      `, [branchIds]);
            allowedSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        let selfSerialIds = null;
        if (hasSelfAccess) {
            const rows = await this.dataSource.query(`
      SELECT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      WHERE serial.is_deleted = 0
        AND serial.created_by = $1
      `, [userId]);
            selfSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        const groupBy = dto.groupBy;
        const includeBranch = groupBy === 'department' && !!dto.includeBranch;
        const inner = this.buildInnerFilters(dto);
        const outer = this.buildFilters(dto, schema);
        const having = this.buildSearchHaving(dto);
        const outerOffset = inner.params.length;
        const outerWhereRenumbered = outer.where.replace(/\$(\d+)/g, (_m, n) => `$${Number(n) + outerOffset}`);
        const accessConditions = [];
        const accessParams = [];
        let nextIdx = outerOffset + outer.params.length + 1;
        if (allowedSerialIds) {
            if (allowedSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(allowedSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        if (selfSerialIds) {
            if (selfSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(selfSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        const outerWherePredicate = outerWhereRenumbered
            .replace(/^\s*WHERE\s+/i, '')
            .trim();
        const allPredicates = [
            ...(outerWherePredicate ? [outerWherePredicate] : []),
            ...accessConditions,
        ];
        const outerWhere = allPredicates.length > 0
            ? `WHERE ${allPredicates.join(' AND ')}`
            : '';
        const havingOffset = inner.params.length + outer.params.length + accessParams.length;
        const havingSql = having.sql.replace(/\$(\d+)/g, (_m, n) => `$${Number(n) + havingOffset}`);
        const params = [...inner.params, ...outer.params, ...accessParams, ...having.params];
        const spec = this.groupSpec(groupBy, includeBranch);
        const deptJoin = groupBy === 'department'
            ? `LEFT JOIN ${schema}.departments d ON d.department_id = base.department_id`
            : '';
        const measures = `
    COUNT(*)::int                                   AS total_assets,
    ROUND(COALESCE(SUM(base.ex_tax), 0), 2)         AS total_unit_value,
    ROUND(COALESCE(SUM(base.tax), 0), 2)            AS total_tax_value,
    ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)), 0), 2) AS total_value`;
        const baseCte = this.buildBaseCte(schema, inner.sql);
        const sortable = {
            department_name: 'department_name',
            branch_name: 'branch_name',
            asset_item_name: 'asset_item_name',
            main_category_name: 'main_category_name',
            sub_category_name: 'sub_category_name',
            total_assets: 'total_assets',
            via_user_count: 'via_user_count',
            direct_count: 'direct_count',
            total_unit_value: 'total_unit_value',
            total_tax_value: 'total_tax_value',
            total_value: 'total_value',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? spec.defaultSort;
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        let limitSql = '';
        if (limit) {
            limitSql = `LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        }
        const groupedSql = `
    SELECT ${spec.select},
    ${measures}
    FROM base
    ${deptJoin}
    ${outerWhere}
    GROUP BY ${spec.groupBy}
    ${havingSql}
  `;
        const rowsSql = `
    WITH ${baseCte},
    grouped AS (${groupedSql})
    SELECT *, COUNT(*) OVER()::int AS total_count
    FROM grouped
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    WITH ${baseCte},
    grouped AS (${groupedSql})
    SELECT
      COALESCE(SUM(total_assets), 0)::int          AS total_assets,
      ROUND(COALESCE(SUM(total_unit_value), 0), 2) AS total_unit_value,
      ROUND(COALESCE(SUM(total_tax_value), 0), 2)  AS total_tax_value,
      ROUND(COALESCE(SUM(total_value), 0), 2)      AS total_value,
      COUNT(DISTINCT asset_item_id)::int           AS distinct_items
    FROM grouped
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            groupBy,
            includeBranch,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_assets: 0,
                total_unit_value: 0,
                total_tax_value: 0,
                total_value: 0,
                distinct_items: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    buildSerialBaseCte(schema, innerFilterSql, includeDeleted) {
        const deletedPredicate = includeDeleted ? '' : `\n          AND s.is_deleted = 0`;
        return `
      base AS (
        SELECT
          s.asset_stocks_unique_id,
          -- FIX 6 (see buildBaseCte): fall back to the ASSET's item when the
          -- serial's own asset_item_id is null/stale, for both the item filter
          -- and the item label/grouping.
          COALESCE(s.asset_item_id, a.asset_item_id) AS asset_item_id,
          ai.asset_item_name,
          a.asset_main_category_id,
          a.asset_sub_category_id,
          mc.main_category_name,
          sc.sub_category_name,
          -- Same branch resolution as Category Tracing (direct BRANCH assignment
          -- first, physical location fallback) so the branch FILTER behaves
          -- identically across all reports.
          COALESCE(
            CASE WHEN lm.target_type::text = 'BRANCH' THEN lm.target_id END,
            lbm.branch_id
          )                                     AS branch_id,
          br.branch_name,
          s.current_status_id,
          st.status_type_name                   AS status_name,
          st.status_color_code                  AS status_color_code,
          s.working_status_type_id,
          wt.working_status_type_name           AS working_name,
          wt.status_for_category,
          p.ownership_status_id,
          ot.ownership_status_type_name         AS ownership_name,
          p.purchase_date,
          s.is_deleted,
          COALESCE(p.unit_price, 0)::numeric    AS ex_tax,
          (COALESCE(p.gst_amount, 0)::numeric
             / NULLIF(pi.quantity, 0))          AS tax
        FROM ${schema}.asset_stock_serials s
        -- "a" joined before "ai" so ai's ON can reference a.asset_item_id (FIX 6).
        LEFT JOIN ${schema}.assets a       ON a.asset_id = s.asset_id
        LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(s.asset_item_id, a.asset_item_id)
        LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category  sc ON sc.sub_category_id  = a.asset_sub_category_id
        LEFT JOIN ${schema}.location_branch_mapping lbm
               ON lbm.location_mapping_id = s.location_id AND lbm.is_deleted = 0
        -- Latest assignment per serial (for direct-branch resolution). A LATERAL
        -- LIMIT 1 rather than the DISTINCT ON CTE Category Tracing uses — same
        -- result, and it keeps this base self-contained.
        LEFT JOIN LATERAL (
          SELECT am.target_type, am.target_id
          FROM ${schema}.asset_mapping am
          WHERE am.asset_stocks_unique_id = s.asset_stocks_unique_id AND am.is_deleted = 0 AND am.is_active = 1
          ORDER BY am.mapping_id DESC
          LIMIT 1
        ) lm ON true
        LEFT JOIN ${schema}.branches br ON br.branch_id = COALESCE(
               CASE WHEN lm.target_type::text = 'BRANCH' THEN lm.target_id END,
               lbm.branch_id
             )
        LEFT JOIN ${schema}.asset_status_types st ON st.status_type_id = s.current_status_id
        LEFT JOIN ${schema}.asset_working_status_types wt ON wt.working_status_type_id = s.working_status_type_id
        LEFT JOIN ${schema}.asset_procurement_items pi ON pi.procurement_item_id = s.procurement_item_id
        LEFT JOIN ${schema}.asset_procurements p ON p.procurement_id = pi.procurement_id
        LEFT JOIN ${schema}.asset_ownership_status_types ot ON ot.ownership_status_type_id = p.ownership_status_id
        -- MUST MATCH v_asset_stock_serials EXACTLY, same reasoning as the
        -- Category Tracing base above: the asset LIST reads that view and adds
        -- no asset-level filters, so requiring asset_is_active/asset_is_deleted
        -- here made every serial report undercount vs the list.
        -- (deletedPredicate supplies "AND s.is_deleted = 0" for every report
        --  except Asset Register, which must see deleted serials.)
        WHERE COALESCE(a.asset_sub_category_id, 0) <> 15${deletedPredicate}${innerFilterSql}
      )
    `;
    }
    buildSerialOuterFilters(filters) {
        const f = filters ?? {};
        const params = [];
        const clauses = [];
        const inFilter = (col, vals) => {
            if (!vals?.length)
                return;
            params.push(vals);
            clauses.push(`${col} = ANY($${params.length}::int[])`);
        };
        inFilter('base.asset_item_id', f.asset_item_ids);
        inFilter('base.asset_main_category_id', f.main_category_ids);
        inFilter('base.asset_sub_category_id', f.sub_category_ids);
        inFilter('base.branch_id', f.branch_ids);
        return {
            where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
            params,
        };
    }
    buildSerialInnerFilters(filters) {
        const f = filters ?? {};
        const params = [];
        const clauses = [];
        const push = (sql, val) => {
            params.push(val);
            clauses.push(sql.replace('$?', `$${params.length}`));
        };
        if (f.location_ids?.length)
            push('s.location_id = ANY($?::int[])', f.location_ids);
        if (f.vendor_ids?.length)
            push('p.vendor_id = ANY($?::int[])', f.vendor_ids);
        if (f.ownership_status_ids?.length)
            push('p.ownership_status_id = ANY($?::int[])', f.ownership_status_ids);
        if (f.status_ids?.length)
            push('s.current_status_id = ANY($?::int[])', f.status_ids);
        if (f.working_status_ids?.length)
            push('s.working_status_type_id = ANY($?::int[])', f.working_status_ids);
        if (f.purchase_date_from)
            push('p.purchase_date >= $?::date', f.purchase_date_from);
        if (f.purchase_date_to)
            push('p.purchase_date <= $?::date', f.purchase_date_to);
        return { sql: clauses.length ? ` AND ${clauses.join(' AND ')}` : '', params };
    }
    serialReportConfig(reportType) {
        const valueMeasures = `
      COUNT(*)::int                                   AS total_assets,
      ROUND(COALESCE(SUM(base.ex_tax), 0), 2)         AS total_unit_value,
      ROUND(COALESCE(SUM(base.tax), 0), 2)            AS total_tax_value,
      ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)), 0), 2) AS total_value`;
        const valueTotals = `
      COALESCE(SUM(total_assets), 0)::int          AS total_assets,
      ROUND(COALESCE(SUM(total_unit_value), 0), 2) AS total_unit_value,
      ROUND(COALESCE(SUM(total_tax_value), 0), 2)  AS total_tax_value,
      ROUND(COALESCE(SUM(total_value), 0), 2)      AS total_value,
      COUNT(*)::int                                AS distinct_groups`;
        const valueSortable = {
            total_assets: 'total_assets',
            total_unit_value: 'total_unit_value',
            total_tax_value: 'total_tax_value',
            total_value: 'total_value',
        };
        const valueNumericSearchCols = [
            'COUNT(*)',
            'ROUND(COALESCE(SUM(base.ex_tax), 0), 2)',
            'ROUND(COALESCE(SUM(base.tax), 0), 2)',
            'ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)), 0), 2)',
        ];
        switch (reportType) {
            case 'status':
                return {
                    includeDeleted: false,
                    select: `base.current_status_id AS status_type_id,
            COALESCE(base.status_name, 'Unassigned') AS status_name,
            MIN(base.status_color_code) AS status_color_code`,
                    groupBy: `base.current_status_id, base.status_name`,
                    searchCols: ['base.status_name'],
                    numericSearchCols: valueNumericSearchCols,
                    measures: valueMeasures,
                    totals: valueTotals,
                    sortable: { ...valueSortable, status_name: 'status_name' },
                    defaultSort: 'total_assets DESC',
                };
            case 'working_condition':
                return {
                    includeDeleted: false,
                    select: `base.working_status_type_id,
            COALESCE(base.working_name, 'Unassigned') AS working_name,
            MIN(base.status_for_category) AS status_for_category`,
                    groupBy: `base.working_status_type_id, base.working_name`,
                    searchCols: ['base.working_name', 'base.status_for_category'],
                    numericSearchCols: valueNumericSearchCols,
                    measures: valueMeasures,
                    totals: valueTotals,
                    sortable: {
                        ...valueSortable,
                        working_name: 'working_name',
                        status_for_category: 'status_for_category',
                    },
                    defaultSort: 'total_assets DESC',
                };
            case 'ownership':
                return {
                    includeDeleted: false,
                    select: `base.ownership_status_id,
            COALESCE(base.ownership_name, 'Unassigned') AS ownership_name`,
                    groupBy: `base.ownership_status_id, base.ownership_name`,
                    searchCols: ['base.ownership_name'],
                    numericSearchCols: valueNumericSearchCols,
                    measures: valueMeasures,
                    totals: valueTotals,
                    sortable: { ...valueSortable, ownership_name: 'ownership_name' },
                    defaultSort: 'total_assets DESC',
                };
            case 'purchase_month':
                return {
                    includeDeleted: false,
                    select: `COALESCE(TO_CHAR(base.purchase_date, 'YYYY-MM'), 'Unknown') AS month_year,
            COALESCE(TO_CHAR(base.purchase_date, 'Mon YYYY'), 'Unknown') AS month_name`,
                    groupBy: `COALESCE(TO_CHAR(base.purchase_date, 'YYYY-MM'), 'Unknown'), COALESCE(TO_CHAR(base.purchase_date, 'Mon YYYY'), 'Unknown')`,
                    searchCols: [
                        `COALESCE(TO_CHAR(base.purchase_date, 'YYYY-MM'), 'Unknown')`,
                        `COALESCE(TO_CHAR(base.purchase_date, 'Mon YYYY'), 'Unknown')`,
                    ],
                    numericSearchCols: valueNumericSearchCols,
                    measures: valueMeasures,
                    totals: valueTotals,
                    sortable: { ...valueSortable, month_year: 'month_year' },
                    defaultSort: 'month_year DESC',
                };
            case 'asset_register':
                return {
                    includeDeleted: true,
                    select: `base.asset_item_id,
            base.asset_item_name,
            MIN(base.main_category_name) AS main_category_name,
            MIN(base.sub_category_name)  AS sub_category_name`,
                    groupBy: `base.asset_item_id, base.asset_item_name`,
                    searchCols: [
                        'base.asset_item_name',
                        'base.main_category_name',
                        'base.sub_category_name',
                    ],
                    numericSearchCols: [
                        'COUNT(*) FILTER (WHERE base.is_deleted = 0)',
                        'COUNT(*) FILTER (WHERE base.is_deleted = 1)',
                        'ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)) FILTER (WHERE base.is_deleted = 0), 0), 2)',
                    ],
                    measures: `
            COUNT(*) FILTER (WHERE base.is_deleted = 0)::int AS active_count,
            COUNT(*) FILTER (WHERE base.is_deleted = 1)::int AS deleted_count,
            COUNT(*)::int                                    AS total_count,
            ROUND(COALESCE(SUM(base.ex_tax) FILTER (WHERE base.is_deleted = 0), 0), 2)                       AS total_unit_value,
            ROUND(COALESCE(SUM(base.tax)    FILTER (WHERE base.is_deleted = 0), 0), 2)                       AS total_tax_value,
            ROUND(COALESCE(SUM(base.ex_tax + COALESCE(base.tax, 0)) FILTER (WHERE base.is_deleted = 0), 0), 2) AS total_value`,
                    totals: `
            COALESCE(SUM(active_count), 0)::int          AS total_active,
            COALESCE(SUM(deleted_count), 0)::int         AS total_deleted,
            COUNT(*)::int                                AS distinct_items,
            ROUND(COALESCE(SUM(total_value), 0), 2)      AS total_value`,
                    sortable: {
                        asset_item_name: 'asset_item_name',
                        main_category_name: 'main_category_name',
                        sub_category_name: 'sub_category_name',
                        active_count: 'active_count',
                        deleted_count: 'deleted_count',
                        total_value: 'total_value',
                    },
                    defaultSort: 'asset_item_name ASC',
                };
            default:
                throw new common_1.BadRequestException(`Unknown reportType: ${reportType}`);
        }
    }
    async getSerialReport(dto, branchIds = [], userId, schema) {
        if (dto.reportType === 'item_ownership_matrix') {
            return this.getItemOwnershipMatrixReport(dto, branchIds, userId, schema);
        }
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        let allowedSerialIds = null;
        if (branchIds.length > 0) {
            const rows = await this.dataSource.query(`
      SELECT DISTINCT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      LEFT JOIN ${schema}.asset_procurement_items api
        ON api.procurement_item_id = serial.procurement_item_id
      LEFT JOIN location_branch_mapping loc
        ON loc.location_mapping_id = api.location_id
      WHERE serial.is_deleted = 0
        AND loc.branch_id = ANY($1)
      `, [branchIds]);
            allowedSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        let selfSerialIds = null;
        if (hasSelfAccess) {
            const rows = await this.dataSource.query(`
      SELECT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      WHERE serial.is_deleted = 0
        AND serial.created_by = $1
      `, [userId]);
            selfSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        const cfg = this.serialReportConfig(dto.reportType);
        const inner = this.buildSerialInnerFilters(dto.filters);
        const outer = this.buildSerialOuterFilters(dto.filters);
        const term = dto.search?.trim();
        let having = { sql: '', params: [] };
        if (term) {
            const textOr = cfg.searchCols
                .map((c) => `bool_or(${c} ILIKE $1)`)
                .join('\n        OR ');
            const numericOr = (cfg.numericSearchCols ?? [])
                .map((c) => `CAST(${c} AS text) ILIKE $1`)
                .join('\n        OR ');
            having = {
                sql: `HAVING (
      ${textOr}
      OR CAST(COUNT(*) AS text) ILIKE $1
      ${numericOr ? `OR ${numericOr}` : ''}
    )`,
                params: [`%${term}%`],
            };
        }
        const outerOffset = inner.params.length;
        const outerWhereRenumbered = outer.where.replace(/\$(\d+)/g, (_m, n) => `$${Number(n) + outerOffset}`);
        const accessConditions = [];
        const accessParams = [];
        let nextIdx = outerOffset + outer.params.length + 1;
        if (allowedSerialIds) {
            if (allowedSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(allowedSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        if (selfSerialIds) {
            if (selfSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(selfSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        const outerWherePredicate = outerWhereRenumbered
            .replace(/^\s*WHERE\s+/i, '')
            .trim();
        const allPredicates = [
            ...(outerWherePredicate ? [outerWherePredicate] : []),
            ...accessConditions,
        ];
        const outerWhere = allPredicates.length > 0
            ? `WHERE ${allPredicates.join(' AND ')}`
            : '';
        const havingOffset = inner.params.length + outer.params.length + accessParams.length;
        const havingSql = having.sql.replace(/\$(\d+)/g, (_m, n) => `$${Number(n) + havingOffset}`);
        const params = [...inner.params, ...outer.params, ...accessParams, ...having.params];
        const baseCte = this.buildSerialBaseCte(schema, inner.sql, cfg.includeDeleted);
        const sortCol = cfg.sortable[dto.sortBy ?? ''] ?? cfg.defaultSort;
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const orderBy = cfg.sortable[dto.sortBy ?? '']
            ? `${sortCol} ${sortDir}`
            : sortCol;
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const groupedSql = `
    SELECT ${cfg.select},
    ${cfg.measures}
    FROM base
    ${outerWhere}
    GROUP BY ${cfg.groupBy}
    ${havingSql}
  `;
        const rowsSql = `
    WITH ${baseCte},
    grouped AS (${groupedSql})
    SELECT *, COUNT(*) OVER()::int AS total_count_window
    FROM grouped
    ORDER BY ${orderBy}
    ${limitSql}
  `;
        const totalsSql = `
    WITH ${baseCte},
    grouped AS (${groupedSql})
    SELECT ${cfg.totals}
    FROM grouped
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            reportType: dto.reportType,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {},
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    currentFyLabel() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const fyStartYear = month >= 4 ? year : year - 1;
        const fyEndYY = String(fyStartYear + 1).slice(-2);
        return `${fyStartYear}-${fyEndYY}`;
    }
    async getVendorReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const procWhere = [];
        if (f.purchase_date_from) {
            procWhere.push(`p.purchase_date >= ${push(f.purchase_date_from)}::date`);
        }
        if (f.purchase_date_to) {
            procWhere.push(`p.purchase_date <= ${push(f.purchase_date_to)}::date`);
        }
        if (f.main_category_ids?.length) {
            const ph = push(f.main_category_ids);
            procWhere.push(`EXISTS (
      SELECT 1 FROM ${schema}.asset_procurement_items pi2
      JOIN ${schema}.assets a2 ON a2.asset_id = pi2.asset_id
      WHERE pi2.procurement_id = p.procurement_id
        AND a2.asset_main_category_id = ANY(${ph}::int[])
    )`);
        }
        const procWhereSql = procWhere.length ? `WHERE ${procWhere.join(' AND ')}` : '';
        const vendorWhere = ['v.is_deleted = 0'];
        if (f.vendor_ids?.length) {
            vendorWhere.push(`v.vendor_id = ANY(${push(f.vendor_ids)}::int[])`);
        }
        const vendorWhereSql = `WHERE ${vendorWhere.join(' AND ')}`;
        const term = dto.search?.trim();
        let searchWhereSql = '';
        if (term) {
            const ph = push(`%${term}%`);
            searchWhereSql = `WHERE (
      vendor_name ILIKE ${ph}
      OR vendor_code ILIKE ${ph}
      OR CAST(total_assets AS text) ILIKE ${ph}
      OR CAST(total_unit_value AS text) ILIKE ${ph}
      OR CAST(total_tax_value AS text) ILIKE ${ph}
      OR CAST(total_value AS text) ILIKE ${ph}
    )`;
        }
        const branchAccessJoinSql = branchIds.length > 0
            ? `LEFT JOIN ${schema}.asset_procurement_items bf_api
         ON bf_api.procurement_item_id = serial.procurement_item_id
       LEFT JOIN location_branch_mapping bf_loc
         ON bf_loc.location_mapping_id = bf_api.location_id`
            : '';
        const branchAccessWhere = branchIds.length > 0
            ? `AND bf_loc.branch_id = ANY(${push(branchIds)}::int[])`
            : '';
        const selfAccessWhere = hasSelfAccess
            ? `AND serial.created_by = ${push(userId)}`
            : '';
        const baseCte = `
    WITH vendor_procurement AS (
      SELECT
        p.procurement_id,
        p.vendor_id,
        p.stock_id,
        COALESCE(p.unit_price, 0)::numeric   AS unit_price,
        COALESCE(p.gst_amount, 0)::numeric   AS gst_amount,
        COALESCE(p.total_amount, 0)::numeric AS total_amount
      FROM ${schema}.asset_procurements p
      ${procWhereSql}
    ),
    vendor_money AS (
      SELECT
        vendor_id,
        SUM(unit_price)   AS total_unit_value,
        SUM(gst_amount)   AS total_tax_value,
        SUM(total_amount) AS total_value
      FROM vendor_procurement
      WHERE vendor_id IS NOT NULL
      GROUP BY vendor_id
    ),
    vendor_assets AS (
      SELECT
        vp.vendor_id,
        COUNT(DISTINCT serial.asset_stocks_unique_id)::int AS total_assets
      FROM vendor_procurement vp
      LEFT JOIN ${schema}.stocks stock ON stock.stock_id = vp.stock_id
      LEFT JOIN ${schema}.asset_stock_serials serial
             ON serial.stock_id = stock.stock_id AND serial.is_deleted = 0
      ${branchAccessJoinSql}
      WHERE vp.vendor_id IS NOT NULL
        ${branchAccessWhere}
        ${selfAccessWhere}
      GROUP BY vp.vendor_id
    ),
    grouped AS (
      SELECT
        v.vendor_id,
        v.vendor_name,
        v.vendor_code,
        COALESCE(va.total_assets, 0)                AS total_assets,
        ROUND(COALESCE(vm.total_unit_value, 0), 2)   AS total_unit_value,
        ROUND(COALESCE(vm.total_tax_value, 0), 2)    AS total_tax_value,
        ROUND(COALESCE(vm.total_value, 0), 2)        AS total_value
      FROM ${schema}.vendors v
      LEFT JOIN vendor_money  vm ON vm.vendor_id = v.vendor_id
      LEFT JOIN vendor_assets va ON va.vendor_id = v.vendor_id
      ${vendorWhereSql}
    )
  `;
        const sortable = {
            vendor_name: 'vendor_name',
            vendor_code: 'vendor_code',
            total_assets: 'total_assets',
            total_unit_value: 'total_unit_value',
            total_tax_value: 'total_tax_value',
            total_value: 'total_value',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'vendor_name';
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const rowsSql = `
    ${baseCte}
    SELECT *, COUNT(*) OVER()::int AS total_count_window
    FROM grouped
    ${searchWhereSql}
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    ${baseCte}
    SELECT
      COUNT(*)::int                                 AS total_vendors,
      COALESCE(SUM(total_assets), 0)::int           AS total_assets,
      ROUND(COALESCE(SUM(total_unit_value), 0), 2)  AS total_unit_value,
      ROUND(COALESCE(SUM(total_tax_value), 0), 2)   AS total_tax_value,
      ROUND(COALESCE(SUM(total_value), 0), 2)       AS total_value
    FROM grouped
    ${searchWhereSql}
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_vendors: 0,
                total_assets: 0,
                total_unit_value: 0,
                total_tax_value: 0,
                total_value: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getDepreciationReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        let allowedSerialIds = null;
        if (branchIds.length > 0) {
            const rows = await this.dataSource.query(`
      SELECT DISTINCT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      LEFT JOIN ${schema}.asset_procurement_items api
        ON api.procurement_item_id = serial.procurement_item_id
      LEFT JOIN location_branch_mapping loc
        ON loc.location_mapping_id = api.location_id
      WHERE serial.is_deleted = 0
        AND loc.branch_id = ANY($1)
      `, [branchIds]);
            allowedSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        let selfSerialIds = null;
        if (hasSelfAccess) {
            const rows = await this.dataSource.query(`
      SELECT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      WHERE serial.is_deleted = 0
        AND serial.created_by = $1
      `, [userId]);
            selfSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const fyLabel = f.fy_label?.trim() || this.currentFyLabel();
        const where = [`v.fy_label = ${push(fyLabel)}`];
        if (allowedSerialIds) {
            if (allowedSerialIds.length > 0) {
                where.push(`v.asset_stocks_unique_id = ANY(${push(allowedSerialIds)}::int[])`);
            }
            else {
                where.push('1=0');
            }
        }
        if (selfSerialIds) {
            if (selfSerialIds.length > 0) {
                where.push(`v.asset_stocks_unique_id = ANY(${push(selfSerialIds)}::int[])`);
            }
            else {
                where.push('1=0');
            }
        }
        if (f.asset_item_ids?.length) {
            where.push(`v.asset_item_id = ANY(${push(f.asset_item_ids)}::int[])`);
        }
        if (f.main_category_names?.length) {
            where.push(`v.main_category_name = ANY(${push(f.main_category_names)}::text[])`);
        }
        const term = dto.search?.trim();
        if (term) {
            const ph = push(`%${term}%`);
            where.push(`(
      v.asset_title ILIKE ${ph}
      OR v.asset_item_name ILIKE ${ph}
      OR v.main_category_name ILIKE ${ph}
      OR v.fy_label ILIKE ${ph}
      OR CAST(v.buy_price AS text) ILIKE ${ph}
      OR CAST(v.company_closing_wdv AS text) ILIKE ${ph}
      OR CAST(v.it_closing_wdv AS text) ILIKE ${ph}
    )`);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const sortable = {
            asset_title: 'asset_title',
            asset_item_name: 'asset_item_name',
            main_category_name: 'main_category_name',
            buy_price: 'buy_price',
            company_closing_wdv: 'company_closing_wdv',
            company_depreciation: 'company_depreciation',
            it_closing_wdv: 'it_closing_wdv',
            it_depreciation: 'it_depreciation',
            fy_label: 'fy_label',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'asset_title';
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const fromSql = `FROM ${schema}.asset_depreciation_serial_view v ${whereSql}`;
        const rowsSql = `
    SELECT
      v.asset_stocks_unique_id,
      v.asset_title,
      v.asset_item_id,
      v.asset_item_name,
      v.main_category_name,
      v.buy_price,
      v.company_closing_wdv,
      v.company_depreciation,
      v.it_closing_wdv,
      v.it_depreciation,
      v.fy_label,
      COUNT(*) OVER()::int AS total_count_window
    ${fromSql}
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    SELECT
      COUNT(*)::int                                        AS total_assets,
      ROUND(COALESCE(SUM(v.buy_price), 0), 2)               AS total_purchase_value,
      ROUND(COALESCE(SUM(v.company_closing_wdv), 0), 2)     AS total_company_current_value,
      ROUND(COALESCE(SUM(v.it_closing_wdv), 0), 2)          AS total_it_current_value
    ${fromSql}
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            fyLabel,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_assets: 0,
                total_purchase_value: 0,
                total_company_current_value: 0,
                total_it_current_value: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getWarrantyReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const where = [
            'ass.is_active = 1',
            'ass.is_deleted = 0',
            'awd.warranty_end_date IS NOT NULL',
        ];
        if (branchIds.length > 0) {
            where.push(`wbranch.branch_id = ANY(${push(branchIds)}::int[])`);
        }
        if (hasSelfAccess) {
            where.push(`ass.created_by = ${push(userId)}`);
        }
        if (f.main_category_ids?.length) {
            where.push(`a.asset_main_category_id = ANY(${push(f.main_category_ids)}::int[])`);
        }
        if (f.asset_item_ids?.length) {
            where.push(`COALESCE(ass.asset_item_id, a.asset_item_id) = ANY(${push(f.asset_item_ids)}::int[])`);
        }
        if (f.expiry_date_from) {
            where.push(`awd.warranty_end_date >= ${push(f.expiry_date_from)}::date`);
        }
        if (f.expiry_date_to) {
            where.push(`awd.warranty_end_date <= ${push(f.expiry_date_to)}::date`);
        }
        if (f.expiry_status?.length) {
            const ph = push(f.expiry_status);
            where.push(`(
      CASE
        WHEN awd.warranty_end_date < CURRENT_DATE THEN 'Expired'
        WHEN awd.warranty_end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
        ELSE 'Active'
      END
    ) = ANY(${ph}::text[])`);
        }
        const term = dto.search?.trim();
        if (term) {
            const ph = push(`%${term}%`);
            where.push(`(
      a.asset_title ILIKE ${ph}
      OR ai.asset_item_name ILIKE ${ph}
      OR mc.main_category_name ILIKE ${ph}
      OR vd.vendor_name ILIKE ${ph}
      OR (
        CASE
          WHEN awd.warranty_end_date < CURRENT_DATE THEN 'Expired'
          WHEN awd.warranty_end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
          ELSE 'Active'
        END
      ) ILIKE ${ph}
    )`);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const fromSql = `
    FROM ${schema}.asset_warranty_details awd
    INNER JOIN ${schema}.asset_stock_serials ass
            ON ass.asset_stocks_unique_id = awd.asset_stocks_unique_id
    LEFT JOIN ${schema}.assets a      ON a.asset_id = ass.asset_id
    LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
    LEFT JOIN ${schema}.asset_main_category mc ON mc.main_category_id = a.asset_main_category_id
    LEFT JOIN ${schema}.vendors vd ON vd.vendor_id = awd.amc_vendor
    -- ✅ BRANCH ACCESS — mirrors BRANCH_MAP.AssetStockSerials' join chain
    -- (asset_stock_serials → asset_procurement_items → location_branch_mapping)
    -- so wbranch.branch_id is available for the WHERE condition above.
    LEFT JOIN ${schema}.asset_procurement_items wapi ON wapi.procurement_item_id = ass.procurement_item_id
LEFT JOIN ${schema}.location_branch_mapping wbranch
ON wbranch.location_mapping_id = wapi.location_id 
   ${whereSql}
  `;
        const sortable = {
            asset_title: 'asset_title',
            asset_item_name: 'asset_item_name',
            warranty_start_date: 'warranty_start_date',
            warranty_end_date: 'warranty_end_date',
            expiry_month: 'expiry_month',
            days_to_expiry: 'days_to_expiry',
            expiry_status: 'expiry_status',
            amc_vendor_name: 'amc_vendor_name',
            next_service_due_date: 'next_service_due_date',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'warranty_end_date';
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const rowsSql = `
    SELECT
      ass.asset_stocks_unique_id,
      a.asset_title,
      ai.asset_item_name,
      mc.main_category_name,
      awd.warranty_start_date,
      awd.warranty_end_date,
      TO_CHAR(awd.warranty_end_date, 'YYYY-MM')      AS expiry_month,
      (awd.warranty_end_date - CURRENT_DATE)::int     AS days_to_expiry,
      CASE
        WHEN awd.warranty_end_date < CURRENT_DATE THEN 'Expired'
        WHEN awd.warranty_end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
        ELSE 'Active'
      END                                              AS expiry_status,
      vd.vendor_name                                   AS amc_vendor_name,
      awd.next_service_due_date,
      COUNT(*) OVER()::int                             AS total_count_window
    ${fromSql}
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    SELECT
      COUNT(*)::int AS total_under_warranty,
      COUNT(*) FILTER (WHERE awd.warranty_end_date < CURRENT_DATE)::int AS total_expired,
      COUNT(*) FILTER (
        WHERE awd.warranty_end_date >= CURRENT_DATE
          AND awd.warranty_end_date <= CURRENT_DATE + INTERVAL '30 days'
      )::int AS total_expiring_soon,
      COUNT(*) FILTER (WHERE awd.warranty_end_date > CURRENT_DATE + INTERVAL '30 days')::int AS total_active
    ${fromSql}
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_under_warranty: 0,
                total_expired: 0,
                total_expiring_soon: 0,
                total_active: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getTransferReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const where = ['lt.is_deleted = 0'];
        if (branchIds.length > 0) {
            const ph = push(branchIds);
            where.push(`(frombranch.branch_id = ANY(${ph}::int[]) OR tobranch.branch_id = ANY(${ph}::int[]))`);
        }
        if (hasSelfAccess) {
            where.push(`ass.created_by = ${push(userId)}`);
        }
        if (f.from_branch_ids?.length) {
            where.push(`frombranch.branch_id = ANY(${push(f.from_branch_ids)}::int[])`);
        }
        if (f.to_branch_ids?.length) {
            where.push(`tobranch.branch_id = ANY(${push(f.to_branch_ids)}::int[])`);
        }
        if (f.status_ids?.length) {
            where.push(`wstatus.working_status_type_id = ANY(${push(f.status_ids)}::int[])`);
        }
        if (f.requested_date_from) {
            where.push(`lt.requested_at >= ${push(f.requested_date_from)}::date`);
        }
        if (f.requested_date_to) {
            where.push(`lt.requested_at < (${push(f.requested_date_to)}::date + INTERVAL '1 day')`);
        }
        if (f.asset_stocks_unique_id) {
            where.push(`lt.asset_stocks_unique_id = ${push(f.asset_stocks_unique_id)}::int`);
        }
        const term = dto.search?.trim();
        if (term) {
            const ph = push(`%${term}%`);
            where.push(`(
      a.asset_title ILIKE ${ph}
      OR ass.asset_serial_title ILIKE ${ph}
      OR ass.system_code ILIKE ${ph}
      OR ai.asset_item_name ILIKE ${ph}
      OR fromloc.location_name ILIKE ${ph}
      OR toloc.location_name ILIKE ${ph}
      OR frombranch.branch_name ILIKE ${ph}
      OR tobranch.branch_name ILIKE ${ph}
      OR wstatus.working_status_type_name ILIKE ${ph}
      OR NULLIF(TRIM(CONCAT_WS(' ', requsr.first_name, requsr.last_name)), '') ILIKE ${ph}
      OR lt.reason_for_transfer ILIKE ${ph}
      OR lt.comment_for_location_transfer ILIKE ${ph}
    )`);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const fromSql = `
    FROM ${schema}.location_transfers lt
    LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = lt.asset_stocks_unique_id
    LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
    -- FIX 6: fall back to the asset's own item when the serial's item id is
    -- null/stale, so the displayed item name is never blank for that reason.
    LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
    LEFT JOIN ${schema}.location_branch_mapping fromlbm
           ON fromlbm.location_mapping_id = lt.from_location_id
    LEFT JOIN ${schema}.asset_locations fromloc ON fromloc.location_id = fromlbm.location_id
    LEFT JOIN ${schema}.branches frombranch ON frombranch.branch_id = fromlbm.branch_id
    LEFT JOIN ${schema}.v_location_hierarchy_precomputed fromvlh ON fromvlh.location_id = fromloc.location_id
    LEFT JOIN ${schema}.location_branch_mapping tolbm
           ON tolbm.location_mapping_id = lt.to_location_id
    LEFT JOIN ${schema}.asset_locations toloc ON toloc.location_id = tolbm.location_id
    LEFT JOIN ${schema}.branches tobranch ON tobranch.branch_id = tolbm.branch_id
    LEFT JOIN ${schema}.v_location_hierarchy_precomputed tovlh ON tovlh.location_id = toloc.location_id
    LEFT JOIN ${schema}.asset_working_status_types wstatus ON wstatus.working_status_type_id = lt.transfer_status
    LEFT JOIN ${schema}.users requsr ON requsr.user_id = lt.requested_by
    LEFT JOIN ${schema}.users apprusr ON apprusr.user_id = lt.approved_by
    LEFT JOIN ${schema}.users complusr ON complusr.user_id = lt.completed_by
    ${whereSql}
  `;
        const sortable = {
            asset_title: 'asset_title',
            system_code: 'system_code',
            asset_item_name: 'asset_item_name',
            from_location: 'from_location',
            to_location: 'to_location',
            from_branch: 'from_branch',
            to_branch: 'to_branch',
            status_name: 'status_name',
            requested_by_name: 'requested_by_name',
            requested_at: 'requested_at',
            approved_at: 'approved_at',
            completed_at: 'completed_at',
            reason_for_transfer: 'reason_for_transfer',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'requested_at';
        const sortDir = dto.sortDir === 'ASC' ? 'ASC' : 'DESC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const rowsSql = `
    SELECT
      lt.location_transfer_id,
      lt.asset_stocks_unique_id,
      COALESCE(a.asset_title, ass.asset_serial_title, ass.system_code) AS asset_title,
      ai.asset_item_name,
      ass.system_code,
      fromloc.location_name AS from_location,
      fromvlh.path_names    AS from_location_path,
      frombranch.branch_name AS from_branch,
      toloc.location_name   AS to_location,
      tovlh.path_names      AS to_location_path,
      tobranch.branch_name  AS to_branch,
      wstatus.working_status_type_id   AS status_id,
      wstatus.working_status_type_name AS status_name,
      NULLIF(TRIM(CONCAT_WS(' ', requsr.first_name, requsr.last_name)), '')   AS requested_by_name,
      lt.requested_at,
      NULLIF(TRIM(CONCAT_WS(' ', apprusr.first_name, apprusr.last_name)), '') AS approved_by_name,
      lt.approved_at,
      NULLIF(TRIM(CONCAT_WS(' ', complusr.first_name, complusr.last_name)), '') AS completed_by_name,
      lt.completed_at,
      lt.reason_for_transfer,
      lt.comment_for_location_transfer,
      COUNT(*) OVER()::int AS total_count_window
    ${fromSql}
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    SELECT
      COUNT(*)::int                                              AS total_transfers,
      COUNT(*) FILTER (WHERE lt.transfer_status::text = '15')::int AS total_completed,
      COUNT(*) FILTER (WHERE lt.transfer_status::text = '16')::int AS total_pending,
      COUNT(*) FILTER (WHERE lt.transfer_status::text = '17')::int AS total_in_transit
    ${fromSql}
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_transfers: 0,
                total_completed: 0,
                total_pending: 0,
                total_in_transit: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getMaintenanceReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const effectiveStatusIdExpr = `(CASE WHEN m.asset_working_condition_id = 8 AND m.scheduled_date < CURRENT_DATE THEN 11 ELSE m.asset_working_condition_id END)`;
        const where = ['m.is_deleted = 0'];
        if (branchIds.length > 0) {
            where.push(`mbranch.branch_id = ANY(${push(branchIds)}::int[])`);
        }
        if (hasSelfAccess) {
            where.push(`ass.created_by = ${push(userId)}`);
        }
        if (f.maintenance_types?.length) {
            where.push(`m.maintenance_type = ANY(${push(f.maintenance_types)}::text[])`);
        }
        if (f.priorities?.length) {
            where.push(`m.priority = ANY(${push(f.priorities)}::text[])`);
        }
        if (f.working_status_ids?.length) {
            where.push(`${effectiveStatusIdExpr} = ANY(${push(f.working_status_ids)}::int[])`);
        }
        if (f.scheduled_date_from) {
            where.push(`m.scheduled_date >= ${push(f.scheduled_date_from)}::date`);
        }
        if (f.scheduled_date_to) {
            where.push(`m.scheduled_date <= ${push(f.scheduled_date_to)}::date`);
        }
        if (f.main_category_ids?.length) {
            where.push(`a.asset_main_category_id = ANY(${push(f.main_category_ids)}::int[])`);
        }
        if (f.asset_item_ids?.length) {
            where.push(`COALESCE(ass.asset_item_id, a.asset_item_id) = ANY(${push(f.asset_item_ids)}::int[])`);
        }
        if (f.asset_stocks_unique_id) {
            where.push(`m.asset_stocks_unique_id = ${push(f.asset_stocks_unique_id)}::int`);
        }
        const term = dto.search?.trim();
        if (term) {
            const ph = push(`%${term}%`);
            where.push(`(
  m.asset_display_name ILIKE ${ph}
  OR ai.asset_item_name ILIKE ${ph}
  OR m.description ILIKE ${ph}
  OR m.maintenance_type ILIKE ${ph}
  OR m.actual_cost::text ILIKE ${ph}
  OR m.estimated_cost::text ILIKE ${ph}
  OR m.priority ILIKE ${ph}
  OR m.managed_by ILIKE ${ph}
  OR wc.working_status_type_name ILIKE ${ph}
)`);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const fromSql = `
    FROM ${schema}.asset_maintenance m
    LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = m.asset_stocks_unique_id
    LEFT JOIN ${schema}.assets a       ON a.asset_id = m.asset_id
    LEFT JOIN ${schema}.asset_items ai ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
    LEFT JOIN ${schema}.asset_procurement_items mapi ON mapi.procurement_item_id = ass.procurement_item_id
    LEFT JOIN ${schema}.location_branch_mapping mbranch ON mbranch.location_mapping_id = mapi.location_id
    LEFT JOIN ${schema}.asset_working_status_types wc ON wc.working_status_type_id = ${effectiveStatusIdExpr}
    ${whereSql}
  `;
        const sortable = {
            asset_display_name: 'asset_display_name',
            asset_item_name: 'asset_item_name',
            maintenance_type: 'maintenance_type',
            priority: 'priority',
            working_status_name: 'working_status_name',
            scheduled_date: 'scheduled_date',
            started_at: 'started_at',
            completed_at: 'completed_at',
            estimated_cost: 'estimated_cost',
            actual_cost: 'actual_cost',
            managed_by: 'managed_by',
            description: 'description',
            updated_at: 'updated_at',
            created_at: 'created_at',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'updated_at';
        const sortDir = dto.sortDir === 'ASC' ? 'ASC' : 'DESC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const rowsSql = `
    SELECT
      m.maintenance_id,
      m.maintenance_ref_id,
      m.asset_stocks_unique_id,
      COALESCE(m.asset_display_name, a.asset_title) AS asset_display_name,
      ai.asset_item_name,
      m.maintenance_type,
      m.priority,
      wc.working_status_type_name AS working_status_name,
      m.scheduled_date,
      m.started_at,
      m.completed_at,
      m.managed_by,
      ROUND(COALESCE(m.estimated_cost, 0)::numeric, 2) AS estimated_cost,
      ROUND(COALESCE(m.actual_cost, 0)::numeric, 2)    AS actual_cost,
      m.description,
      m.created_at,
      m.updated_at,
      COUNT(*) OVER()::int AS total_count_window
    ${fromSql}
    ORDER BY ${sortCol} ${sortDir}
    ${limitSql}
  `;
        const totalsSql = `
    SELECT
      COUNT(*)::int                                                      AS total_records,
      COUNT(*) FILTER (WHERE m.asset_working_condition_id::text = '10')::int AS total_completed,
      COUNT(*) FILTER (WHERE m.asset_working_condition_id::text = '9')::int  AS total_in_progress,
      COUNT(*) FILTER (WHERE ${effectiveStatusIdExpr} = 11)::int AS total_overdue,
      ROUND(COALESCE(SUM(m.actual_cost), 0)::numeric, 2)                  AS total_actual_cost
    ${fromSql}
  `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_records: 0,
                total_completed: 0,
                total_in_progress: 0,
                total_overdue: 0,
                total_actual_cost: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getScrapReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', {
                    roleId: roleId.toString(),
                })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        let allowedSerialIds = null;
        if (branchIds.length > 0) {
            const rows = await this.dataSource.query(`
      SELECT DISTINCT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      LEFT JOIN ${schema}.asset_procurement_items api
        ON api.procurement_item_id = serial.procurement_item_id
      LEFT JOIN location_branch_mapping loc
        ON loc.location_mapping_id = api.location_id
      WHERE serial.is_deleted = 0
        AND loc.branch_id = ANY($1)
      `, [branchIds]);
            allowedSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        let selfSerialIds = null;
        if (hasSelfAccess) {
            const rows = await this.dataSource.query(`
      SELECT asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials
      WHERE is_deleted = 0
        AND created_by = $1
      `, [userId]);
            selfSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        const f = dto.filters ?? {};
        const params = [];
        const push = (val) => {
            params.push(val);
            return `$${params.length}`;
        };
        const where = ['s.is_deleted = 0'];
        if (f.disposal_methods?.length) {
            where.push(`s.disposal_method = ANY(${push(f.disposal_methods)}::text[])`);
        }
        if (f.scrap_date_from) {
            where.push(`s.scrap_date >= ${push(f.scrap_date_from)}::date`);
        }
        if (f.scrap_date_to) {
            where.push(`s.scrap_date <= ${push(f.scrap_date_to)}::date`);
        }
        if (f.main_category_ids?.length) {
            where.push(`a.asset_main_category_id = ANY(${push(f.main_category_ids)}::int[])`);
        }
        if (f.asset_item_ids?.length) {
            where.push(`COALESCE(ass.asset_item_id, a.asset_item_id) = ANY(${push(f.asset_item_ids)}::int[])`);
        }
        if (f.asset_stocks_unique_id) {
            where.push(`s.asset_stocks_unique_id = ${push(f.asset_stocks_unique_id)}::int`);
        }
        const term = dto.search?.trim();
        if (term) {
            const ph = push(`%${term}%`);
            where.push(`(
      a.asset_title ILIKE ${ph}
      OR ai.asset_item_name ILIKE ${ph}
      OR s.disposal_method ILIKE ${ph}
      OR s.scrap_reason ILIKE ${ph}
      OR s.final_auction_value::text ILIKE ${ph}
      OR s.scrap_value::text ILIKE ${ph}
      OR s.asset_condition ILIKE ${ph}
      OR wc.working_status_type_name ILIKE ${ph}
      OR COALESCE(s.vendor_name, s.buyer_details, s.donated_to) ILIKE ${ph}
      OR COALESCE(s.reference_invoice_no, s.auction_reference_no, s.donation_letter_no) ILIKE ${ph}
      OR s.notes ILIKE ${ph}
    )`);
        }
        if (allowedSerialIds) {
            if (allowedSerialIds.length > 0) {
                where.push(`s.asset_stocks_unique_id = ANY(${push(allowedSerialIds)}::int[])`);
            }
            else {
                where.push('1=0');
            }
        }
        if (selfSerialIds) {
            if (selfSerialIds.length > 0) {
                where.push(`s.asset_stocks_unique_id = ANY(${push(selfSerialIds)}::int[])`);
            }
            else {
                where.push('1=0');
            }
        }
        const whereSql = where.length > 0
            ? `WHERE ${where.join(' AND ')}`
            : '';
        const fromSql = `
    FROM ${schema}.asset_scrap s
    LEFT JOIN ${schema}.asset_stock_serials ass
      ON ass.asset_stocks_unique_id = s.asset_stocks_unique_id
    LEFT JOIN ${schema}.assets a
      ON a.asset_id = s.asset_id
    LEFT JOIN ${schema}.asset_items ai
      ON ai.asset_item_id = COALESCE(ass.asset_item_id, a.asset_item_id)
    LEFT JOIN ${schema}.asset_working_status_types wc
      ON wc.working_status_type_id = s.asset_working_condition_id
    ${whereSql}
  `;
        const sortable = {
            asset_title: 'asset_title',
            asset_item_name: 'asset_item_name',
            disposal_method: 'disposal_method',
            scrap_date: 'scrap_date',
            scrap_reason: 'scrap_reason',
            asset_condition: 'asset_condition',
            recovered_value: 'recovered_value',
            counterparty: 'counterparty',
            reference_no: 'reference_no',
            working_status_name: 'working_status_name',
            notes: 'notes',
            updated_at: 'updated_at',
            created_at: 'created_at',
        };
        const sortCol = sortable[dto.sortBy ?? ''] ?? 'updated_at';
        const sortDir = dto.sortDir === 'ASC' ? 'ASC' : 'DESC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : undefined;
        const limitSql = limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : '';
        const rowsSql = `
      SELECT
        s.scrap_id,
        s.scrap_ref_id,
        s.asset_stocks_unique_id,
        a.asset_title,
        ai.asset_item_name,
        s.disposal_method,
        s.scrap_date,
        s.scrap_reason,
        s.asset_condition,
        ROUND(COALESCE(s.scrap_value, s.final_auction_value, 0)::numeric, 2) AS recovered_value,
        COALESCE(s.vendor_name, s.buyer_details, s.donated_to)               AS counterparty,
        COALESCE(s.reference_invoice_no, s.auction_reference_no, s.donation_letter_no) AS reference_no,
        wc.working_status_type_name AS working_status_name,
        s.notes,
        s.created_at,
        s.updated_at,
        COUNT(*) OVER()::int AS total_count_window
      ${fromSql}
      ORDER BY ${sortCol} ${sortDir}
      ${limitSql}
    `;
        const totalsSql = `
      SELECT
        COUNT(*)::int                                    AS total_disposed,
        COUNT(DISTINCT s.disposal_method)::int            AS distinct_methods,
        ROUND(COALESCE(SUM(COALESCE(s.scrap_value, s.final_auction_value, 0)), 0)::numeric, 2) AS total_recovered_value
      ${fromSql}
    `;
        const [rows, totalsRes] = await Promise.all([
            this.dataSource.query(rowsSql, params),
            this.dataSource.query(totalsSql, params),
        ]);
        const total = rows.length > 0 ? Number(rows[0].total_count_window) : 0;
        const cleanRows = rows.map((r) => {
            const { total_count_window, ...rest } = r;
            return rest;
        });
        return {
            status: true,
            rows: cleanRows,
            totals: totalsRes?.[0] ?? {
                total_disposed: 0,
                distinct_methods: 0,
                total_recovered_value: 0,
            },
            count: cleanRows.length,
            total,
            page,
            limit: limit ?? cleanRows.length,
        };
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async getItemOwnershipMatrixReport(dto, branchIds = [], userId, schema) {
        if (!schema) {
            throw new Error(`Resolved schema is empty — got search_path value: "${schema}"`);
        }
        const roleCacheKey = `user_role:${schema}:${userId}`;
        const roleId = await (async () => {
            const cachedRole = await this.redisService.get(roleCacheKey);
            if (cachedRole !== null && cachedRole !== undefined) {
                return cachedRole;
            }
            const user = await this.dataSource.query(`SELECT role_id FROM ${schema}.users WHERE user_id = $1 LIMIT 1`, [userId]);
            if (!user?.length) {
                throw new Error(`User role not found. userId=${userId}, schema=${schema}`);
            }
            const roleId = user[0].role_id;
            await this.redisService.set(roleCacheKey, roleId, 600);
            return roleId;
        })();
        const permCacheKey = (0, cache_key_util_1.permKey)(roleId);
        let hasSelfAccess = await this.redisService.get(permCacheKey);
        if (hasSelfAccess === null) {
            const selfPermission = await this.specialPermissionRepo.findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = selfPermission
                ? await this.policyAttrRepo
                    .createQueryBuilder('pa')
                    .where('pa.role_id = :roleId', { roleId: roleId.toString() })
                    .andWhere('pa.special_permission_master_id = :spId', {
                    spId: selfPermission.id,
                })
                    .getOne()
                : null;
            hasSelfAccess = !!selfPolicy;
            await this.redisService.set(permCacheKey, hasSelfAccess, 300);
        }
        let allowedSerialIds = null;
        if (branchIds.length > 0) {
            const rows = await this.dataSource.query(`
      SELECT DISTINCT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      LEFT JOIN ${schema}.asset_procurement_items api
        ON api.procurement_item_id = serial.procurement_item_id
      LEFT JOIN location_branch_mapping loc
        ON loc.location_mapping_id = api.location_id
      WHERE serial.is_deleted = 0
        AND loc.branch_id = ANY($1)
      `, [branchIds]);
            allowedSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        let selfSerialIds = null;
        if (hasSelfAccess) {
            const rows = await this.dataSource.query(`
      SELECT serial.asset_stocks_unique_id
      FROM ${schema}.asset_stock_serials serial
      WHERE serial.is_deleted = 0
        AND serial.created_by = $1
      `, [userId]);
            selfSerialIds = rows.map((r) => r.asset_stocks_unique_id);
        }
        const inner = this.buildSerialInnerFilters(dto.filters);
        const outer = this.buildSerialOuterFilters(dto.filters);
        const baseCte = this.buildSerialBaseCte(schema, inner.sql, false);
        const outerOffset = inner.params.length;
        const outerWhereRenumbered = outer.where.replace(/\$(\d+)/g, (_m, n) => `$${Number(n) + outerOffset}`);
        const accessConditions = [];
        const accessParams = [];
        let nextIdx = outerOffset + outer.params.length + 1;
        if (allowedSerialIds) {
            if (allowedSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(allowedSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        if (selfSerialIds) {
            if (selfSerialIds.length > 0) {
                accessConditions.push(`base.asset_stocks_unique_id = ANY($${nextIdx}::int[])`);
                accessParams.push(selfSerialIds);
                nextIdx++;
            }
            else {
                accessConditions.push('1=0');
            }
        }
        const term = dto.search?.trim();
        if (term) {
            accessConditions.push(`base.asset_item_name ILIKE $${nextIdx}`);
            accessParams.push(`%${term}%`);
            nextIdx++;
        }
        const outerWherePredicate = outerWhereRenumbered.replace(/^\s*WHERE\s+/i, '').trim();
        const allPredicates = [
            ...(outerWherePredicate ? [outerWherePredicate] : []),
            ...accessConditions,
        ];
        const outerWhere = allPredicates.length > 0 ? `WHERE ${allPredicates.join(' AND ')}` : '';
        const params = [...inner.params, ...outer.params, ...accessParams];
        const baseSelect = `
    WITH ${baseCte}
    SELECT base.*
    FROM base
    ${outerWhere}
  `;
        const typeRows = await this.dataSource.query(`
    SELECT DISTINCT COALESCE(filtered.ownership_name, 'Unassigned') AS ownership_type
    FROM (${baseSelect}) filtered
    ORDER BY 1
    `, params);
        const ownershipTypes = typeRows.map((r) => r.ownership_type);
        const sortDir = dto.sortDir === 'DESC' ? 'DESC' : 'ASC';
        const page = dto.page && dto.page > 0 ? dto.page : 1;
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 5000) : 10;
        const offset = (page - 1) * limit;
        const itemsSql = `
    SELECT
      filtered.asset_item_id,
      filtered.asset_item_name,
      COUNT(*)::int AS total_assets,
      ROUND(COALESCE(SUM(filtered.ex_tax + COALESCE(filtered.tax, 0)), 0), 2)::numeric AS total_value,
      COUNT(*) OVER()::int AS total_count_window
    FROM (${baseSelect}) filtered
    GROUP BY filtered.asset_item_id, filtered.asset_item_name
    ORDER BY filtered.asset_item_name ${sortDir}
    LIMIT ${limit} OFFSET ${offset}
  `;
        const itemRows = await this.dataSource.query(itemsSql, params);
        const totalItems = itemRows.length > 0 ? Number(itemRows[0].total_count_window) : 0;
        const itemIds = itemRows.map((r) => r.asset_item_id);
        let breakdownRows = [];
        if (itemIds.length > 0) {
            const itemIdParamIdx = params.length + 1;
            const breakdownSql = `
      SELECT
        filtered.asset_item_id,
        COALESCE(filtered.ownership_name, 'Unassigned') AS ownership_type,
        COUNT(*)::int AS asset_count,
        ROUND(COALESCE(SUM(filtered.ex_tax + COALESCE(filtered.tax, 0)), 0), 2)::numeric AS total_value
      FROM (${baseSelect}) filtered
      WHERE filtered.asset_item_id = ANY($${itemIdParamIdx}::int[])
      GROUP BY filtered.asset_item_id, ownership_type
    `;
            breakdownRows = await this.dataSource.query(breakdownSql, [...params, itemIds]);
        }
        const breakdownByItem = new Map();
        for (const b of breakdownRows) {
            if (!breakdownByItem.has(b.asset_item_id)) {
                breakdownByItem.set(b.asset_item_id, new Map());
            }
            breakdownByItem.get(b.asset_item_id).set(b.ownership_type, {
                asset_count: Number(b.asset_count),
                total_value: Number(b.total_value),
            });
        }
        const rows = itemRows.map((r) => {
            const perItem = breakdownByItem.get(r.asset_item_id);
            const ownership = {};
            for (const type of ownershipTypes) {
                ownership[type] = perItem?.get(type) ?? { asset_count: 0, total_value: 0 };
            }
            return {
                asset_item_id: r.asset_item_id,
                asset_item_name: r.asset_item_name,
                total_assets: r.total_assets,
                total_value: Number(r.total_value),
                ownership,
            };
        });
        return {
            status: true,
            reportType: dto.reportType,
            ownershipTypes,
            rows,
            count: rows.length,
            total: totalItems,
            page,
            limit,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(3, (0, typeorm_1.InjectRepository)(special_permission_master_1.SpecialPermissionsMaster)),
    __param(4, (0, typeorm_1.InjectRepository)(policy_attribute_entity_1.PolicyAttribute)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        request_context_service_1.RequestContextService,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
