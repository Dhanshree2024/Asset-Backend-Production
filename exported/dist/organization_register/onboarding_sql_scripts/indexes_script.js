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
exports.GlobalIndexesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let GlobalIndexesScript = class GlobalIndexesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAllIndexes(schemaName) {
        await this.createIndexes(schemaName);
    }
    async createIndexes(schemaName) {
        await this.dataSource.query(`



      
    -- =====================================================
    -- asset_assignment_events indexes
    -- =====================================================

    CREATE INDEX IF NOT EXISTS idx_asset_assign_events_mapping
      ON ${schemaName}.asset_assignment_events (mapping_id);

    CREATE INDEX IF NOT EXISTS idx_asset_assign_events_performed_by
      ON ${schemaName}.asset_assignment_events (performed_by);

    CREATE INDEX IF NOT EXISTS idx_asset_assign_events_stock_time
      ON ${schemaName}.asset_assignment_events
      (asset_stocks_unique_id, performed_at DESC);

    CREATE INDEX IF NOT EXISTS idx_asset_assign_events_target_time
      ON ${schemaName}.asset_assignment_events
      (target_type, target_id, performed_at DESC);



  -- =====================================================
  -- asset_cost_centers indexes
  -- =====================================================

  CREATE INDEX IF NOT EXISTS idx_cost_centers_dept_active_deleted
    ON ${schemaName}.asset_cost_centers
    (department_id, is_active, is_deleted);

  CREATE INDEX IF NOT EXISTS idx_cost_centers_manager_deleted
    ON ${schemaName}.asset_cost_centers
    (cost_center_manger_name_id, is_deleted);



  -- =====================================================
  -- asset_depreciation_methods indexes
  -- =====================================================

  CREATE INDEX IF NOT EXISTS idx_depr_methods_created_by
    ON ${schemaName}.asset_depreciation_methods (created_by);

  CREATE INDEX IF NOT EXISTS idx_depr_methods_updated_by
    ON ${schemaName}.asset_depreciation_methods (updated_by);


  -- =====================================================
  -- asset_events indexes
  -- =====================================================

  CREATE INDEX IF NOT EXISTS idx_asset_events_asset_time
    ON ${schemaName}.asset_events
    (asset_id ASC NULLS LAST, performed_at DESC NULLS FIRST);

  CREATE INDEX IF NOT EXISTS idx_asset_events_category_time
    ON ${schemaName}.asset_events
    (event_category ASC NULLS LAST, performed_at DESC NULLS FIRST);

  CREATE INDEX IF NOT EXISTS idx_asset_events_metadata_gin
    ON ${schemaName}.asset_events USING gin
    (metadata);

  CREATE INDEX IF NOT EXISTS idx_asset_events_stock_time
    ON ${schemaName}.asset_events
    (asset_stocks_unique_id ASC NULLS LAST, performed_at DESC NULLS FIRST);

  CREATE INDEX IF NOT EXISTS idx_asset_events_target
    ON ${schemaName}.asset_events
    (target_type ASC NULLS LAST, target_id ASC NULLS LAST);

  CREATE INDEX IF NOT EXISTS idx_asset_events_user_time
    ON ${schemaName}.asset_events
    (performed_by ASC NULLS LAST, performed_at DESC NULLS FIRST);


--=====================
-- asset_field_category
--=====================

CREATE INDEX IF NOT EXISTS idx_asset_field_category_active_deleted
ON ${schemaName}.asset_field_category
(is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);



--==================
-- asset_fields
--==================

 CREATE INDEX IF NOT EXISTS idx_asset_fields_category_active_deleted
  ON ${schemaName}.asset_fields
  (asset_field_category_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_fields_custom_active_deleted
      ON ${schemaName}.asset_fields
      (is_custom_field ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

--==============
-- asset_id_settings_v2
--===============

 CREATE INDEX IF NOT EXISTS idx_asset_id_settings_v2_org_current
      ON ${schemaName}.asset_id_settings_v2
      (org_id ASC NULLS LAST, is_current ASC NULLS LAST);


--=====================



CREATE INDEX IF NOT EXISTS idx_asset_items_category
      ON ${schemaName}.asset_items
      (main_category_id ASC NULLS LAST, sub_category_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_items_licensable
      ON ${schemaName}.asset_items
      (is_licensable ASC NULLS LAST, is_active ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_items_type_status
      ON ${schemaName}.asset_items
      (item_type ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

--=========================
 CREATE INDEX IF NOT EXISTS idx_aif_field_category_enabled
 ON ${schemaName}.asset_items_fields_mapping
(asset_field_category_id ASC NULLS LAST, aif_is_enabled ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_aif_item_active_deleted
      ON ${schemaName}.asset_items_fields_mapping
      (asset_item_id ASC NULLS LAST, aif_is_active ASC NULLS LAST, aif_is_deleted ASC NULLS LAST);



      --===============

      CREATE INDEX IF NOT EXISTS idx_asset_items_rel_child
      ON ${schemaName}.asset_items_relations
      (child_asset_item_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_items_rel_parent
      ON ${schemaName}.asset_items_relations
      (parent_asset_item_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);


      --==============================

      CREATE INDEX IF NOT EXISTS idx_asset_locations_branch_active_deleted
      ON ${schemaName}.asset_locations
      (branch_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_locations_parent
      ON ${schemaName}.asset_locations
      (parent_location_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_locations_type_deleted
      ON ${schemaName}.asset_locations
      (location_type_id ASC NULLS LAST, is_deleted ASC NULLS LAST);



      --============================================
       CREATE INDEX IF NOT EXISTS idx_asset_maint_asset_status
        ON ${schemaName}.asset_maintenance
        (asset_id ASC NULLS LAST, status_type_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_maint_created_by_time
        ON ${schemaName}.asset_maintenance
        (created_by ASC NULLS LAST, created_at DESC NULLS FIRST);

      CREATE INDEX IF NOT EXISTS idx_asset_maint_schedule_status
        ON ${schemaName}.asset_maintenance
        (scheduled_date ASC NULLS LAST, status_type_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_maint_status_active_deleted
        ON ${schemaName}.asset_maintenance
        (status_type_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_maint_stock_deleted
        ON ${schemaName}.asset_maintenance
        (asset_stocks_unique_id ASC NULLS LAST, is_deleted ASC NULLS LAST);




        --=======================

        CREATE INDEX IF NOT EXISTS idx_asset_mapping_asset_id_deleted
      ON ${schemaName}.asset_mapping
      (asset_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_mapping_latest_per_asset
      ON ${schemaName}.asset_mapping
      (asset_stocks_unique_id ASC NULLS LAST, mapping_id DESC NULLS FIRST, is_deleted ASC NULLS LAST)
      WHERE is_deleted = 0 AND is_active = 1;

    CREATE INDEX IF NOT EXISTS idx_asset_mapping_status
      ON ${schemaName}.asset_mapping
      (status_type_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_mapping_stock_active_deleted
      ON ${schemaName}.asset_mapping
      (asset_stocks_unique_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_mapping_target
      ON ${schemaName}.asset_mapping
      (target_type ASC NULLS LAST, target_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);



      --======================================
       CREATE INDEX IF NOT EXISTS idx_asset_ownership_status_types_active_deleted
      ON ${schemaName}.asset_ownership_status_types
      (is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);


      --========================================

      CREATE INDEX IF NOT EXISTS idx_asset_proc_items_asset
      ON ${schemaName}.asset_procurement_items
      (asset_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_proc_items_procurement
        ON ${schemaName}.asset_procurement_items
        (procurement_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_procurement_items_location
        ON ${schemaName}.asset_procurement_items
        (procurement_item_id ASC NULLS LAST, location_id ASC NULLS LAST);


      --=================================================

       CREATE INDEX IF NOT EXISTS idx_asset_proc_asset_approved
      ON ${schemaName}.asset_procurements
      (asset_id ASC NULLS LAST, is_approved ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_proc_purchase_date
      ON ${schemaName}.asset_procurements
      (purchase_date DESC NULLS FIRST);

    CREATE INDEX IF NOT EXISTS idx_asset_proc_stock_id
      ON ${schemaName}.asset_procurements
      (stock_id ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_proc_vendor_date
      ON ${schemaName}.asset_procurements
      (vendor_id ASC NULLS LAST, purchase_date DESC NULLS FIRST);


      --==============================================


      CREATE INDEX IF NOT EXISTS idx_asset_project_department_active_deleted
      ON ${schemaName}.asset_project
      (department_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);


      --=============================================

      CREATE INDEX IF NOT EXISTS idx_asset_software_item_type
      ON ${schemaName}.asset_software_subscription
      (asset_item_id ASC NULLS LAST, subscription_type COLLATE pg_catalog."default" ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_software_next_renewal
        ON ${schemaName}.asset_software_subscription
        (next_renewal_date ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_software_subscription_asset_lookup
        ON ${schemaName}.asset_software_subscription
        (asset_stocks_unique_id ASC NULLS LAST);



        --================================

      CREATE INDEX IF NOT EXISTS idx_asset_status_types_active_deleted
            ON ${schemaName}.asset_status_types
            (is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);
        

--=========================================

CREATE INDEX IF NOT EXISTS idx_asset_stock_asset_status
      ON ${schemaName}.asset_stock_serials
      (asset_id ASC NULLS LAST, current_status_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_cost_center
      ON ${schemaName}.asset_stock_serials
      (cost_center_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_created_at
      ON ${schemaName}.asset_stock_serials
      (created_at DESC NULLS FIRST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_project
      ON ${schemaName}.asset_stock_serials
      (project_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_serials_item_status
      ON ${schemaName}.asset_stock_serials
      (asset_item_id ASC NULLS LAST, current_status_id ASC NULLS LAST, working_status_type_id ASC NULLS LAST, is_deleted ASC NULLS LAST)
      WHERE is_deleted = 0;

    CREATE INDEX IF NOT EXISTS idx_asset_stock_serials_procurement_item
      ON ${schemaName}.asset_stock_serials
      (procurement_item_id ASC NULLS LAST, is_deleted ASC NULLS LAST)
      WHERE is_deleted = 0;

    CREATE INDEX IF NOT EXISTS idx_asset_stock_serials_software_sub
      ON ${schemaName}.asset_stock_serials
      (asset_stocks_unique_id ASC NULLS LAST, asset_item_id ASC NULLS LAST, is_deleted ASC NULLS LAST)
      WHERE is_deleted = 0;

    CREATE INDEX IF NOT EXISTS idx_asset_stock_status_deleted
      ON ${schemaName}.asset_stock_serials
      (current_status_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_stock_id
      ON ${schemaName}.asset_stock_serials
      (stock_id ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_asset_stock_working_status
      ON ${schemaName}.asset_stock_serials
      (working_status_type_id ASC NULLS LAST, is_deleted ASC NULLS LAST);

      --======================================
       CREATE INDEX IF NOT EXISTS idx_asset_sub_category_main_active
      ON ${schemaName}.asset_sub_category
      (main_category_id ASC NULLS LAST, is_active ASC NULLS LAST, is_deleted ASC NULLS LAST);



      -- =====================================================
      -- asset_transfer_history indexes
      -- =====================================================

      CREATE INDEX IF NOT EXISTS idx_asset_transfer_asset_time
        ON ${schemaName}.asset_transfer_history
        (asset_id, transfered_at DESC);

      CREATE INDEX IF NOT EXISTS idx_asset_transfer_new_user_time
        ON ${schemaName}.asset_transfer_history
        (new_user_id, transfered_at DESC);

      CREATE INDEX IF NOT EXISTS idx_asset_transfer_prev_user_time
        ON ${schemaName}.asset_transfer_history
        (previous_user_id, transfered_at DESC);

      CREATE INDEX IF NOT EXISTS idx_asset_transfer_stock_time
        ON ${schemaName}.asset_transfer_history
        (asset_stocks_unique_id, transfered_at DESC);


        -- =====================================================
      -- asset_warranty_details indexes
      -- =====================================================

      CREATE INDEX IF NOT EXISTS idx_asset_warranty_end_date
        ON ${schemaName}.asset_warranty_details
        (warranty_end_date ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_asset_warranty_stock
        ON ${schemaName}.asset_warranty_details
        (asset_stocks_unique_id ASC NULLS LAST);
        



        -- =====================================================
-- asset_working_status_types indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_asset_working_status_types_active_deleted
  ON ${schemaName}.asset_working_status_types
  (is_active, is_deleted);




  -- =====================================================
-- assets indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_assets_added_by
  ON ${schemaName}.assets
  (asset_added_by);

CREATE INDEX IF NOT EXISTS idx_assets_item_manufacturer_model
  ON ${schemaName}.assets
  (asset_item_id, manufacturer_id, model_id, asset_is_deleted)
  WHERE asset_is_deleted = 0;

CREATE INDEX IF NOT EXISTS idx_assets_main_filter
  ON ${schemaName}.assets
  (asset_main_category_id, asset_sub_category_id, asset_item_id, asset_is_deleted);

CREATE INDEX IF NOT EXISTS idx_assets_status
  ON ${schemaName}.assets
  (asset_is_active, asset_is_deleted);


  --===================================

 -- =====================================================
        -- branches indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_branches_active_deleted
          ON ${schemaName}.branches
          (is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_branches_primary_user
          ON ${schemaName}.branches
          (primary_user_id);

          -- =====================================================
        -- casbin_rule indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_casbin_ptype_v0_v1
          ON ${schemaName}.casbin_rule
          (ptype, v0, v1);

        CREATE INDEX IF NOT EXISTS idx_casbin_v0_v1_v2
          ON ${schemaName}.casbin_rule
          (v0, v1, v2);

            -- =====================================================
        -- custom_views indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_custom_views_org_deleted
          ON ${schemaName}.custom_views
          (organization_id, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_custom_views_user_deleted
          ON ${schemaName}.custom_views
          (user_id, is_deleted);



            -- =====================================================
        -- departments indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_departments_active_deleted
          ON ${schemaName}.departments
          (is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_departments_head
          ON ${schemaName}.departments
          (department_head_id);



        -- =====================================================
        -- designations indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_designations_department_active_deleted
          ON ${schemaName}.designations
          (parent_department, is_active, is_deleted);


        -- =====================================================
        -- location_branch_mapping indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_location_branch_mapping_branch_active_deleted
          ON ${schemaName}.location_branch_mapping
          (branch_id, is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_location_branch_mapping_composite
          ON ${schemaName}.location_branch_mapping
          (location_mapping_id, branch_id, is_deleted, is_active)
          WHERE is_deleted = 0 AND is_active = 1;

        CREATE INDEX IF NOT EXISTS idx_location_branch_mapping_location_branch
          ON ${schemaName}.location_branch_mapping
          (location_id, branch_id);


        -- =====================================================
        -- location_transfers indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_location_transfers_from_status
          ON ${schemaName}.location_transfers
          (from_location_id, transfer_status);

        CREATE INDEX IF NOT EXISTS idx_location_transfers_requested_by_date
          ON ${schemaName}.location_transfers
          (requested_by, requested_at DESC);

        CREATE INDEX IF NOT EXISTS idx_location_transfers_status_deleted
          ON ${schemaName}.location_transfers
          (transfer_status, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_location_transfers_stock_deleted
          ON ${schemaName}.location_transfers
          (asset_stocks_unique_id, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_location_transfers_to_status
          ON ${schemaName}.location_transfers
          (to_location_id, transfer_status);


        -- =====================================================
        -- organization_roles indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_org_roles_active_deleted
          ON ${schemaName}.organization_roles
          (is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_org_roles_role_type
          ON ${schemaName}.organization_roles
          (role_type);


        -- =====================================================
        -- other_settings_org indexes
        -- =====================================================

        CREATE UNIQUE INDEX IF NOT EXISTS uq_other_settings_org_current_per_org
          ON ${schemaName}.other_settings_org
          (org_id)
          WHERE is_current = true;

        -- =====================================================
        -- qr_code_settings indexes
        -- =====================================================

        CREATE UNIQUE INDEX IF NOT EXISTS uq_qr_code_settings_current_per_org
          ON ${schemaName}.qr_code_settings
          (org_id)
          WHERE is_current = true;

          
        -- =====================================================
        -- stocks indexes
        -- =====================================================

          CREATE INDEX IF NOT EXISTS idx_stocks_asset_id_deleted
          ON ${schemaName}.stocks
          (asset_id, is_deleted);

          CREATE INDEX IF NOT EXISTS idx_stocks_location_id_deleted
          ON ${schemaName}.stocks
          (location_id, is_deleted);


        -- =====================================================
        -- support_tickets indexes
        -- =====================================================

          CREATE INDEX IF NOT EXISTS idx_support_tickets_status_created
          ON ${schemaName}.support_tickets
          (status, created_at DESC);

        CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status_deleted
          ON ${schemaName}.support_tickets
          (user_id, status, is_deleted);

        -- =====================================================
        -- users indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_users_branch_active_deleted
          ON ${schemaName}.users
          (branch_id, is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_users_business_email
          ON ${schemaName}.users
          (users_business_email);

        CREATE INDEX IF NOT EXISTS idx_users_department_active_deleted
          ON ${schemaName}.users
          (department_id, is_active, is_deleted);

        CREATE INDEX IF NOT EXISTS idx_users_role_active_deleted
          ON ${schemaName}.users
          (role_id, is_active, is_deleted);

        -- =====================================================
        -- vendors indexes
        -- =====================================================

        CREATE INDEX IF NOT EXISTS idx_vendors_active_deleted
          ON ${schemaName}.vendors
          (is_active, is_deleted);


        -- =====================================================
        -- Some Optimization scripts
        -- =====================================================
        CREATE INDEX IF NOT EXISTS  idx_branch_asset_counts_branch
        ON  ${schemaName}.branch_asset_counts(branch_id);

        CREATE INDEX IF NOT EXISTS idx_location_name_trgm
        ON ${schemaName}.asset_locations
        USING gin (location_name gin_trgm_ops);
        
        CREATE INDEX IF NOT EXISTS idx_branch_name_trgm
        ON ${schemaName}.branches
        USING gin (branch_name gin_trgm_ops);


          -- ======================
          -- CORE FILTER INDEX
          -- ======================
          CREATE INDEX IF NOT EXISTS idx_asset_locations_main_filter
          ON  ${schemaName}.asset_locations (is_deleted, is_active, branch_id);
          
          -- ======================
          -- HIERARCHY INDEX
          -- ======================
          CREATE INDEX IF NOT EXISTS idx_asset_locations_parent_active
          ON  ${schemaName}.asset_locations (parent_location_id, is_deleted);
          
          -- ======================
          -- LOCATION-BRANCH MAPPING
          -- ======================
          CREATE INDEX IF NOT EXISTS idx_location_branch_mapping_location_branch
          ON  ${schemaName}.location_branch_mapping (location_id, branch_id, is_deleted);
          
          -- ======================
          -- BRANCH FILTER INDEX
          -- ======================
          CREATE INDEX IF NOT EXISTS idx_branches_active
          ON  ${schemaName}.branches (branch_id, is_active, is_deleted);
          
          -- ======================
          -- OPTIONAL SEARCH INDEX (if needed heavily)
          -- ======================
          CREATE INDEX IF NOT EXISTS idx_asset_locations_name_trgm
          ON  ${schemaName}.asset_locations
          USING gin (location_name gin_trgm_ops);

          CREATE INDEX IF NOT EXISTS idx_asset_locations_parent_deleted
          ON ${schemaName}.asset_locations (parent_location_id, is_deleted);

          CREATE INDEX IF NOT EXISTS idx_asset_procurements_vendor
          ON ${schemaName}.asset_procurements(vendor_id);
          
          CREATE INDEX IF NOT EXISTS idx_asset_procurements_stock
          ON ${schemaName}.asset_procurements(stock_id);
          
          CREATE INDEX IF NOT EXISTS idx_asset_stock_serials_stock_deleted
          ON ${schemaName}.asset_stock_serials(stock_id, is_deleted);

          CREATE INDEX IF NOT EXISTS idx_users_first_name_trgm
          ON ${schemaName}.users
          USING gin (first_name gin_trgm_ops);
          
          CREATE INDEX IF NOT EXISTS idx_users_last_name_trgm
          ON ${schemaName}.users
          USING gin (last_name gin_trgm_ops);
          
          CREATE INDEX IF NOT EXISTS idx_users_email_trgm
          ON ${schemaName}.users
          USING gin (users_business_email gin_trgm_ops);
          
          CREATE INDEX IF NOT EXISTS idx_users_phone_trgm
          ON ${schemaName}.users
          USING gin (phone_number gin_trgm_ops);
          
          CREATE INDEX IF NOT EXISTS idx_users_empid_trgm
          ON ${schemaName}.users
          USING gin (emp_id gin_trgm_ops);

          CREATE INDEX IF NOT EXISTS
          idx_asset_stock_project_active
          ON ${schemaName}.asset_stock_serials
          (project_id)
          WHERE is_deleted = 0
            AND is_active = 1;


            CREATE INDEX IF NOT EXISTS idx_asset_procurements_vendor
            ON ${schemaName}.asset_procurements(vendor_id);
            
            CREATE INDEX IF NOT EXISTS idx_asset_procurements_stock
            ON ${schemaName}.asset_procurements(stock_id);
            
            CREATE INDEX IF NOT EXISTS idx_asset_stock_serials_stock_deleted
            ON ${schemaName}.asset_stock_serials(stock_id, is_deleted);



            -- ========== pagination states ==========

            CREATE INDEX  IF NOT EXISTS ix_ass_keyset_default
              ON ${schemaName}.asset_stock_serials (asset_stocks_unique_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_item_keyset
              ON ${schemaName}.asset_stock_serials (asset_item_id, asset_stocks_unique_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_status_keyset
              ON ${schemaName}.asset_stock_serials (current_status_id, asset_stocks_unique_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_working_keyset
              ON ${schemaName}.asset_stock_serials (working_status_type_id, asset_stocks_unique_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_asset_id
              ON ${schemaName}.asset_stock_serials (asset_id)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_stock_id
              ON ${schemaName}.asset_stock_serials (stock_id)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_procurement_item_id
              ON ${schemaName}.asset_stock_serials (procurement_item_id)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_ass_system_code
              ON ${schemaName}.asset_stock_serials (system_code, asset_stocks_unique_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_asset_mapping_lateral
              ON ${schemaName}.asset_mapping (asset_stocks_unique_id, mapping_id DESC)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_asset_mapping_target
              ON ${schemaName}.asset_mapping (target_type, target_id)
              WHERE is_deleted = 0;

          CREATE INDEX  IF NOT EXISTS ix_assets_main_category
              ON ${schemaName}.assets (asset_main_category_id);

          CREATE INDEX  IF NOT EXISTS ix_assets_sub_category
              ON ${schemaName}.assets (asset_sub_category_id);

          CREATE INDEX  IF NOT EXISTS ix_assets_manufacturer
              ON ${schemaName}.assets (manufacturer_id);

          CREATE INDEX  IF NOT EXISTS ix_proc_items_location
              ON ${schemaName}.asset_procurement_items (location_id);

          CREATE INDEX  IF NOT EXISTS ix_proc_items_procurement
              ON ${schemaName}.asset_procurement_items (procurement_id);

          CREATE INDEX  IF NOT EXISTS ix_lbm_mapping_active
              ON ${schemaName}.location_branch_mapping (location_mapping_id)
              WHERE is_deleted = 0 AND is_active = 1;

          CREATE INDEX  IF NOT EXISTS ix_lbm_location
              ON ${schemaName}.location_branch_mapping (location_id);

          CREATE INDEX  IF NOT EXISTS ix_lbm_branch
              ON ${schemaName}.location_branch_mapping (branch_id);

          CREATE INDEX  IF NOT EXISTS ix_procurements_purchase_date
              ON ${schemaName}.asset_procurements (purchase_date);

          CREATE INDEX  IF NOT EXISTS ix_procurements_ownership
              ON ${schemaName}.asset_procurements (ownership_status_id);

          CREATE INDEX  IF NOT EXISTS ix_asset_items_name
              ON ${schemaName}.asset_items (asset_item_name);

          CREATE INDEX  IF NOT EXISTS ix_asset_items_type
              ON ${schemaName}.asset_items (item_type);

          CREATE INDEX  IF NOT EXISTS ix_software_subscription_serial
              ON ${schemaName}.asset_software_subscription (asset_stocks_unique_id);

          CREATE INDEX  IF NOT EXISTS ix_status_types_name
              ON ${schemaName}.asset_status_types (status_type_name);

          CREATE INDEX  IF NOT EXISTS ix_working_status_types_name
              ON ${schemaName}.asset_working_status_types (working_status_type_name);

          CREATE INDEX  IF NOT EXISTS ix_procurements_renewal_status
              ON ${schemaName}.asset_procurements (renewal_status, procurement_id);

          CREATE INDEX  IF NOT EXISTS ix_procurements_next_renewal_date
              ON ${schemaName}.asset_procurements (next_renewal_date);

 
    `);
    }
};
exports.GlobalIndexesScript = GlobalIndexesScript;
exports.GlobalIndexesScript = GlobalIndexesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], GlobalIndexesScript);
