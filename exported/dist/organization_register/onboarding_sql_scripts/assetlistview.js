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
exports.AssetListViewScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetListViewScript = class AssetListViewScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetStockSerialsView(schemaName) {
        const viewName = `${schemaName}.v_asset_stock_serials`;
        const query = ` 

CREATE OR REPLACE VIEW ${schemaName}.v_asset_stock_serials
 AS
 SELECT serial.asset_stocks_unique_id,
    serial.stock_serials,
    serial.system_code,
    serial.asset_id,
    serial.asset_item_id,
    serial.stock_id,
    serial.asset_serial_title AS asset_title,
    asset.asset_added_by,
    asset.asset_is_active,
    asset.asset_main_category_id AS main_category_id,
    asset.asset_sub_category_id AS sub_category_id,
    main_cat.main_category_name AS asset_main_category_name,
    sub_cat.sub_category_name AS asset_sub_category_name,
    item.asset_item_name,
    item.item_type,
    asset.manufacturer_id,
    mfr.manufacturer_name,
        CASE
            WHEN mapping.target_type = 'USER'::${schemaName}.assign_type_enum THEN mapping.target_id
            ELSE NULL::bigint
        END AS asset_used_by,
        CASE
            WHEN mapping.target_type = 'USER'::${schemaName}.assign_type_enum THEN mapping.target_id
            ELSE NULL::bigint
        END AS asset_managed_by,
        CASE
            WHEN mapping.target_type = 'DEPARTMENT'::${schemaName}.assign_type_enum THEN mapping.target_id
            ELSE NULL::bigint
        END AS department_id,
        CASE
            WHEN mapping.target_type = 'BRANCH'::${schemaName}.assign_type_enum THEN mapping.target_id
            ELSE NULL::bigint
        END AS branch_id,
    stock.quantity,
    lbm.location_mapping_id AS asset_location,
    lbm.location_mapping_id,
    loc.location_name,
    loc.location_code,
    loc.location_floor,
    loc.location_room,
    loc_branch.branch_id AS location_branch_id,
    loc_branch.branch_name AS location_branch_name,
    loc_branch.branch_code AS location_branch_code,
    serial.current_status_id AS asset_status_type_id,
    status.status_type_name AS asset_status_type_name,
    status.status_color_code AS asset_status_color_code,
    serial.working_status_type_id,
    working.working_status_type_name,
    working.status_for_category AS asset_status_for_category,
    procurement.procurement_id,
    procurement.invoice_no,
    procurement.bill_no,
    procurement.purchase_date,
    procurement.unit_price,
    procurement.total_amount,
    procurement.renewal_status,
    ownership.ownership_status_type_id AS asset_ownership_status,
    ownership.ownership_status_type_name,
    COALESCE(mapping.mapping_id, host_mapping.mapping_id) AS mapping_id,
    CASE
        WHEN host_mapping.mapping_id IS NOT NULL THEN 'SOFTWARE'::${schemaName}.assign_type_enum
        ELSE mapping.target_type
    END AS target_type,
    COALESCE(mapping.target_id, host_mapping.asset_stocks_unique_id) AS target_id,
    COALESCE(mapping.assigned_from_date, host_mapping.assigned_from_date, host_mapping.created_at::date) AS assigned_from_date,
    COALESCE(mapping.assigned_to_date, host_mapping.assigned_to_date) AS assigned_to_date,
    COALESCE(mapping.status_type_id, host_mapping.status_type_id) AS mapping_status_type_id,
        CASE
            WHEN host_mapping.mapping_id IS NOT NULL THEN CONCAT(host_serial.system_code, ' (', host_asset.asset_title, ')')
            WHEN mapping.target_type::text = 'USER'::text THEN CONCAT_WS(' ', u.first_name, u.last_name)
            WHEN mapping.target_type::text = 'DEPARTMENT'::text THEN d.department_name::text
            WHEN mapping.target_type::text = 'BRANCH'::text THEN b.branch_name::text
            WHEN mapping.target_type::text = 'PROJECT'::text THEN p.project_name
            ELSE NULL::text
        END AS assigned_to_name,
    sub_sub.next_renewal_date,
    sub_sub.subscription_type,
    sub_sub.billing_frequency,
    sub_sub.warranty_category AS subscription_warranty_category,
    sub_sub.sub_start_date,
        CASE
            WHEN item.item_type = 'Virtual'::item_type_enum THEN true
            ELSE false
        END AS is_software,
    -- ===================== LOCATION HIERARCHY =====================
    -- Appended at the END of the select list on purpose: CREATE OR REPLACE VIEW
    -- only permits ADDING columns after the existing ones (never renaming or
    -- reordering), so the dependent matviews (v_location_asset_counts,
    -- v_branch_asset_counts) stay valid when this view is replaced.
    --
    -- Gives every asset list/detail screen the full breadcrumb instead of a bare
    -- location name, e.g. "Pune Branch → Building 1 → Floor 2 → Room 5".
    lh.path_names  AS location_hierarchy_text,
    lh.path_types  AS location_hierarchy_types,
    lh.level       AS location_hierarchy_level,
        CASE
            WHEN loc_branch.branch_name IS NOT NULL AND lh.path_names IS NOT NULL
                THEN loc_branch.branch_name || ' → '::text || lh.path_names
            ELSE COALESCE(lh.path_names, loc.location_name)
        END AS location_full_path,
    item.license_metric
   FROM ${schemaName}.asset_stock_serials serial
     LEFT JOIN ${schemaName}.assets asset ON serial.asset_id = asset.asset_id
     LEFT JOIN ${schemaName}.manufacturers mfr ON asset.manufacturer_id = mfr.manufacturer_id
     LEFT JOIN ${schemaName}.asset_main_category main_cat ON asset.asset_main_category_id = main_cat.main_category_id
     LEFT JOIN ${schemaName}.asset_sub_category sub_cat ON asset.asset_sub_category_id = sub_cat.sub_category_id
     LEFT JOIN ${schemaName}.asset_items item ON serial.asset_item_id = item.asset_item_id
     LEFT JOIN ${schemaName}.stocks stock ON serial.stock_id = stock.stock_id
     LEFT JOIN ${schemaName}.asset_procurement_items p_item ON serial.procurement_item_id = p_item.procurement_item_id
     -- Location now resolves from the PER-SERIAL serial.location_id (single source
     -- of truth), not the shared p_item.location_id. This is what makes the
     -- all-assets list + v_location_asset_counts + v_branch_asset_counts reflect a
     -- one-unit transfer instead of moving the whole batch. p_item is still joined
     -- above for procurement/billing columns.
     LEFT JOIN ${schemaName}.location_branch_mapping lbm ON serial.location_id = lbm.location_mapping_id AND lbm.is_deleted = 0 AND lbm.is_active = 1
     LEFT JOIN ${schemaName}.asset_locations loc ON lbm.location_id = loc.location_id
     LEFT JOIN ${schemaName}.branches loc_branch ON lbm.branch_id = loc_branch.branch_id
     -- Precomputed recursive ancestor path for the resolved location. Read-only
     -- lookup (one row per location), so it cannot fan out the serial rows.
     LEFT JOIN ${schemaName}.v_location_hierarchy_precomputed lh ON lh.location_id = loc.location_id
     LEFT JOIN ${schemaName}.asset_status_types status ON serial.current_status_id = status.status_type_id
     LEFT JOIN ${schemaName}.asset_working_status_types working ON serial.working_status_type_id = working.working_status_type_id
     LEFT JOIN ${schemaName}.asset_procurements procurement ON p_item.procurement_id = procurement.procurement_id
     LEFT JOIN ${schemaName}.asset_ownership_status_types ownership ON procurement.ownership_status_id = ownership.ownership_status_type_id
     LEFT JOIN LATERAL ( SELECT am.mapping_id,
            am.asset_id,
            am.status_type_id,
            am.description,
            am.assigned_by,
            am.returned_by,
            am.created_at,
            am.updated_at,
            am.is_active,
            am.is_deleted,
            am.asset_working_condition_id,
            am.asset_stocks_unique_id,
            am.target_id,
            am.assigned_from_date,
            am.assigned_to_date,
            am.target_type
           FROM ${schemaName}.asset_mapping am
          WHERE am.asset_stocks_unique_id = serial.asset_stocks_unique_id 
            AND am.is_deleted = 0
            AND am.is_active = 1
            AND (am.target_type::text NOT IN ('SOFTWARE', 'ASSET') OR am.target_type IS NULL)
          ORDER BY am.mapping_id DESC
         LIMIT 1) mapping ON true
     LEFT JOIN LATERAL ( SELECT hm.mapping_id,
            hm.asset_id,
            hm.status_type_id,
            hm.description,
            hm.assigned_by,
            hm.returned_by,
            hm.created_at,
            hm.updated_at,
            hm.is_active,
            hm.is_deleted,
            hm.asset_working_condition_id,
            hm.asset_stocks_unique_id,
            hm.target_id,
            hm.assigned_from_date,
            hm.assigned_to_date,
            hm.target_type
           FROM ${schemaName}.asset_mapping hm
          WHERE hm.relation_type = 'REL-006'
            AND hm.target_id = serial.asset_stocks_unique_id
            AND hm.is_active = 1
            AND hm.is_deleted = 0
          ORDER BY hm.mapping_id DESC
         LIMIT 1) host_mapping ON (item.item_type = 'Virtual'::item_type_enum)
     LEFT JOIN ${schemaName}.asset_stock_serials host_serial ON host_serial.asset_stocks_unique_id = host_mapping.asset_stocks_unique_id
     LEFT JOIN ${schemaName}.assets host_asset ON host_asset.asset_id = host_serial.asset_id
     LEFT JOIN ${schemaName}.users u ON mapping.target_type = 'USER'::${schemaName}.assign_type_enum AND mapping.target_id = u.user_id
     LEFT JOIN ${schemaName}.departments d ON mapping.target_type = 'DEPARTMENT'::${schemaName}.assign_type_enum AND mapping.target_id = d.department_id
     LEFT JOIN ${schemaName}.branches b ON mapping.target_type = 'BRANCH'::${schemaName}.assign_type_enum AND mapping.target_id = b.branch_id
     LEFT JOIN ${schemaName}.asset_project p ON mapping.target_type = 'PROJECT'::${schemaName}.assign_type_enum AND mapping.target_id = p.project_id
     LEFT JOIN ${schemaName}.asset_software_subscription sub_sub ON serial.asset_stocks_unique_id = sub_sub.asset_stocks_unique_id
  WHERE serial.is_deleted = 0;

ALTER TABLE ${schemaName}.v_asset_stock_serials
    OWNER TO postgres;

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
exports.AssetListViewScript = AssetListViewScript;
exports.AssetListViewScript = AssetListViewScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetListViewScript);
