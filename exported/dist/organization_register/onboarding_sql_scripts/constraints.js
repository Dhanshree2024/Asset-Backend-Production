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
exports.ConstraintsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ConstraintsScript = class ConstraintsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async addConstraintIfNotExists(schemaName, tableName, constraintName, alterQuery) {
        await this.dataSource.query(`
                DO $$
                BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_schema = '${schemaName}'
                    AND table_name = '${tableName}'
                    AND constraint_name = '${constraintName}'
                ) THEN
                    ${alterQuery};
                END IF;
                END
                $$;
            `);
    }
    async addAllConstraints(schemaName) {
        await this.addAssetItemFieldsConstraints(schemaName);
        await this.addAssetAssignmentEventsConstraints(schemaName);
        await this.addAssetCostCenterConstraints(schemaName);
        await this.addAssetDepreciationMethodsConstraints(schemaName);
        await this.addAssetEventsConstraints(schemaName);
        await this.addAssetFieldCategoryConstraints(schemaName);
        await this.addAssetFieldsConstraints(schemaName);
        await this.addAssetIdSettingsV2Constraints(schemaName);
        await this.addAssetItemsConstraints(schemaName);
        await this.addAssetItemsFieldsMappingConstraints(schemaName);
        await this.addAssetItemsRelationsConstraints(schemaName);
        await this.addAssetLocationsConstraints(schemaName);
        await this.addAssetMaintenanceConstraints(schemaName);
        await this.addAssetMappingConstraints(schemaName);
        await this.addAssetRelationshipGovernanceConstraints(schemaName);
        await this.addAssetOwnershipStatusTypesConstraints(schemaName);
        await this.addAssetProcurementItemsConstraints(schemaName);
        await this.addAssetProcurementsConstraints(schemaName);
        await this.addAssetProjectConstraints(schemaName);
        await this.addAssetSoftwareSubscriptionConstraints(schemaName);
        await this.addAssetStatusTypesConstraints(schemaName);
        await this.addAssetStockSerialsConstraints(schemaName);
        await this.addAssetSubCategoryConstraints(schemaName);
        await this.addAssetTransferHistoryConstraints(schemaName);
        await this.addAssetWarrantyDetailsConstraints(schemaName);
        await this.addAssetWorkingStatusTypesConstraints(schemaName);
        await this.addAssetsConstraints(schemaName);
        await this.createBranchesConstraints(schemaName);
        await this.createCasbinRuleConstraints(schemaName);
        await this.createCustomViewsConstraints(schemaName);
        await this.createDepartmentsConstraints(schemaName);
        await this.createDesignationsConstraints(schemaName);
        await this.createLocationBranchMappingConstraints(schemaName);
        await this.createLocationTransfersConstraints(schemaName);
        await this.createOrganizationRolesConstraints(schemaName);
        await this.createOtherSettingsOrgConstraints(schemaName);
        await this.createQrCodeSettingsConstraints(schemaName);
        await this.createStocksConstraints(schemaName);
        await this.createSupportTicketsConstraints(schemaName);
        await this.createVendorsConstraints(schemaName);
        await this.createUsersConstraints(schemaName);
    }
    async addAssetAssignmentEventsConstraints(schemaName) {
        const table = 'asset_assignment_events';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_assignment_events_fk_stock', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_assignment_events_fk_stock
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_assignment_events_fk_mapping', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_assignment_events_fk_mapping
    FOREIGN KEY (mapping_id)
    REFERENCES ${schemaName}.asset_mapping (mapping_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_assignment_events_fk_performed_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_assignment_events_fk_performed_by
    FOREIGN KEY (performed_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_assignment_events_fk_working_condition', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_assignment_events_fk_working_condition
    FOREIGN KEY (working_condition_id)
    REFERENCES ${schemaName}.asset_working_status_types (working_status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetCostCenterConstraints(schemaName) {
        const table = 'asset_cost_centers';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_cost_centers_fk_created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_cost_centers_fk_created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_cost_centers_fk_department', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_cost_centers_fk_department
    FOREIGN KEY (department_id)
    REFERENCES ${schemaName}.departments (department_id)
    ON UPDATE NO ACTION
    ON DELETE SET NULL
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_cost_centers_fk_manager', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_cost_centers_fk_manager
    FOREIGN KEY (cost_center_manger_name_id)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE SET NULL
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_cost_centers_uk_code', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_cost_centers_uk_code
    UNIQUE (cost_center_code)
    `);
    }
    async addAssetDepreciationMethodsConstraints(schemaName) {
        const table = 'asset_depreciation_methods';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_depreciation_methods_fk_created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_depreciation_methods_fk_created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_depreciation_methods_fk_updated_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_depreciation_methods_fk_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_depreciation_methods_uk_name', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_depreciation_methods_uk_name
    UNIQUE (dep_method_name)
    `);
    }
    async addAssetEventsConstraints(schemaName) {
        const table = 'asset_events';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_events_fk_asset_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_events_fk_asset_id
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_events_fk_asset_stocks_unique_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_events_fk_asset_stocks_unique_id
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_events_fk_performed_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_events_fk_performed_by
    FOREIGN KEY (performed_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_events_fk_event_type_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_events_fk_event_type_id
    FOREIGN KEY (event_type_id)
    REFERENCES ${schemaName}.asset_working_status_types (working_status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetFieldCategoryConstraints(schemaName) {
        const table = 'asset_field_category';
    }
    async addAssetFieldsConstraints(schemaName) {
        const table = 'asset_fields';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_field_category_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_field_category_id
    FOREIGN KEY (asset_field_category_id)
    REFERENCES ${schemaName}.asset_field_category (asset_field_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_field_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_field_id
    FOREIGN KEY (asset_field_id)
    REFERENCES ${schemaName}.asset_fields (asset_field_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_fields_added_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_fields_added_by_fkey
    FOREIGN KEY (added_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_fields_category_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_fields_category_fkey
    FOREIGN KEY (asset_field_category_id)
    REFERENCES ${schemaName}.asset_field_category (asset_field_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID
    `);
    }
    async addAssetIdSettingsV2Constraints(schemaName) {
        const table = 'asset_id_settings_v2';
        await this.addConstraintIfNotExists(schemaName, table, 'created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'updated_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT updated_by
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetItemsConstraints(schemaName) {
        const table = 'asset_items';
        await this.addConstraintIfNotExists(schemaName, table, 'added_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT added_by
    FOREIGN KEY (added_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'main_category_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT main_category_id
    FOREIGN KEY (main_category_id)
    REFERENCES ${schemaName}.asset_main_category (main_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'sub_category_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT sub_category_id
    FOREIGN KEY (sub_category_id)
    REFERENCES ${schemaName}.asset_sub_category (sub_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetItemsFieldsMappingConstraints(schemaName) {
        const table = 'asset_items_fields_mapping';
    }
    async addAssetItemsRelationsConstraints(schemaName) {
        const table = 'asset_items_relations';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_items_relations_child_asset_item_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_items_relations_child_asset_item_id_fkey
    FOREIGN KEY (child_asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_items_relations_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_items_relations_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_items_relations_parent_asset_item_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_items_relations_parent_asset_item_id_fkey
    FOREIGN KEY (parent_asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_items_relations_updated_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_items_relations_updated_by_fkey
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetLocationsConstraints(schemaName) {
        const table = 'asset_locations';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_locations_location_type_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_locations_location_type_id_fkey
    FOREIGN KEY (location_type_id)
    REFERENCES ${schemaName}.location_types (type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_asset_locations_parent', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_asset_locations_parent
    FOREIGN KEY (parent_location_id)
    REFERENCES ${schemaName}.asset_locations (location_id)
    ON UPDATE NO ACTION
    ON DELETE SET NULL
    `);
    }
    async addAssetMaintenanceConstraints(schemaName) {
        const table = 'asset_maintenance';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_id
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_maintenance_asset_stocks_unique_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_maintenance_asset_stocks_unique_id_fkey
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_maintenance_mapping_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_maintenance_mapping_fkey
    FOREIGN KEY (mapping_id)
    REFERENCES ${schemaName}.asset_mapping (mapping_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_maintenance_status_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_maintenance_status_fkey
    FOREIGN KEY (status_type_id)
    REFERENCES ${schemaName}.asset_status_types (status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_stocks_unique_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_stocks_unique_id
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_working_condition_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_working_condition_id
    FOREIGN KEY (asset_working_condition_id)
    REFERENCES ${schemaName}.asset_working_status_types (working_status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'updated_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT updated_by
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetMappingConstraints(schemaName) {
        const table = 'asset_mapping';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_mapping_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_mapping_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_mapping_asset_stocks_unique_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_mapping_asset_stocks_unique_id_fkey
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_mapping_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_mapping_created_by_fkey
    FOREIGN KEY (assigned_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_mapping_status_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_mapping_status_id_fkey
    FOREIGN KEY (status_type_id)
    REFERENCES ${schemaName}.asset_status_types (status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_mapping_updated_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_mapping_updated_by_fkey
    FOREIGN KEY (returned_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetRelationshipGovernanceConstraints(schemaName) {
        const table = 'asset_relationship_governance';
        await this.addConstraintIfNotExists(schemaName, table, 'fk_gov_rel_type', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_gov_rel_type
    FOREIGN KEY (relation_type)
    REFERENCES ${schemaName}.asset_relation_type_table (code)
    ON UPDATE CASCADE
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_gov_source_sub_cat', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_gov_source_sub_cat
    FOREIGN KEY (source_sub_category_id)
    REFERENCES ${schemaName}.asset_sub_category (sub_category_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_gov_target_sub_cat', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_gov_target_sub_cat
    FOREIGN KEY (target_sub_category_id)
    REFERENCES ${schemaName}.asset_sub_category (sub_category_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    `);
    }
    async addAssetOwnershipStatusTypesConstraints(schemaName) {
        const table = 'asset_ownership_status_types';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_ownership_status_types_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_ownership_status_types_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_ownership_status_types_updated_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_ownership_status_types_updated_by_fkey
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetProcurementItemsConstraints(schemaName) {
        const table = 'asset_procurement_items';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurement_items_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurement_items_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurement_items_location_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurement_items_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES ${schemaName}.location_branch_mapping (location_mapping_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetProcurementsConstraints(schemaName) {
        const table = 'asset_procurements';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurements_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurements_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurements_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurements_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurements_ownership_status_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurements_ownership_status_id_fkey
    FOREIGN KEY (ownership_status_id)
    REFERENCES ${schemaName}.asset_ownership_status_types (ownership_status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurements_stock_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurements_stock_id_fkey
    FOREIGN KEY (stock_id)
    REFERENCES ${schemaName}.stocks (stock_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_procurements_vendor_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_procurements_vendor_id_fkey
    FOREIGN KEY (vendor_id)
    REFERENCES ${schemaName}.vendors (vendor_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetProjectConstraints(schemaName) {
        const table = 'asset_project';
        await this.addConstraintIfNotExists(schemaName, table, 'created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'department_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT department_id
    FOREIGN KEY (department_id)
    REFERENCES ${schemaName}.asset_project (project_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetSoftwareSubscriptionConstraints(schemaName) {
        const table = 'asset_software_subscription';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_item_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_item_id
    FOREIGN KEY (asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_software_subscription_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_software_subscription_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_software_subscription_asset_stocks_unique_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_software_subscription_asset_stocks_unique_id_fkey
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'procurement_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT procurement_id
    FOREIGN KEY (procurement_id)
    REFERENCES ${schemaName}.asset_procurements (procurement_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'stock_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT stock_id
    FOREIGN KEY (stock_id)
    REFERENCES ${schemaName}.stocks (stock_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetStatusTypesConstraints(schemaName) {
        const table = 'asset_status_types';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_status_types_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_status_types_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_status_types_updated_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_status_types_updated_by_fkey
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetStockSerialsConstraints(schemaName) {
        const table = 'asset_stock_serials';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_stock_serials_asset_item_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_stock_serials_asset_item_id_fkey
    FOREIGN KEY (asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_stock_serials_stock_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_stock_serials_stock_id_fkey
    FOREIGN KEY (stock_id)
    REFERENCES ${schemaName}.stocks (stock_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_stock_serials_working_status_type_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_stock_serials_working_status_type_id_fkey
    FOREIGN KEY (working_status_type_id)
    REFERENCES ${schemaName}.asset_working_status_types (working_status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_stocks_unique_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_stocks_unique_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'cost_center_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT cost_center_id
    FOREIGN KEY (cost_center_id)
    REFERENCES ${schemaName}.asset_cost_centers (cost_center_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'created_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT created_by
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'current_status_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT current_status_id
    FOREIGN KEY (current_status_id)
    REFERENCES ${schemaName}.asset_status_types (status_type_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'procurement_item_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT procurement_item_id
    FOREIGN KEY (procurement_item_id)
    REFERENCES ${schemaName}.asset_procurement_items (procurement_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'project_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT project_id
    FOREIGN KEY (project_id)
    REFERENCES ${schemaName}.asset_project (project_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetSubCategoryConstraints(schemaName) {
        const table = 'asset_sub_category';
        await this.addConstraintIfNotExists(schemaName, table, 'added_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT added_by
    FOREIGN KEY (added_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_sub_category_main_category_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_sub_category_main_category_id_fkey
    FOREIGN KEY (main_category_id)
    REFERENCES ${schemaName}.asset_main_category (main_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetTransferHistoryConstraints(schemaName) {
        const table = 'asset_transfer_history';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_transfer_history_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_transfer_history_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_mapping', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_mapping
    FOREIGN KEY (mapping_id)
    REFERENCES ${schemaName}.asset_mapping (mapping_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_new_branch', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_new_branch
    FOREIGN KEY (new_branch_id)
    REFERENCES ${schemaName}.branches (branch_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_new_department', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_new_department
    FOREIGN KEY (new_department_id)
    REFERENCES ${schemaName}.departments (department_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_new_project', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_new_project
    FOREIGN KEY (new_project_id)
    REFERENCES ${schemaName}.asset_project (project_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_new_user', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_new_user
    FOREIGN KEY (new_user_id)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_prev_branch', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_prev_branch
    FOREIGN KEY (previous_branch_id)
    REFERENCES ${schemaName}.branches (branch_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_prev_department', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_prev_department
    FOREIGN KEY (previous_department_id)
    REFERENCES ${schemaName}.departments (department_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_prev_project', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_prev_project
    FOREIGN KEY (previous_project_id)
    REFERENCES ${schemaName}.asset_project (project_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_prev_user', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_prev_user
    FOREIGN KEY (previous_user_id)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'fk_ath_stock_unique', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT fk_ath_stock_unique
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetWarrantyDetailsConstraints(schemaName) {
        const table = 'asset_warranty_details';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_item_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_item_id
    FOREIGN KEY (asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_warranty_details_asset_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_warranty_details_asset_id_fkey
    FOREIGN KEY (asset_id)
    REFERENCES ${schemaName}.assets (asset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_warranty_details_asset_stocks_unique_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_warranty_details_asset_stocks_unique_id_fkey
    FOREIGN KEY (asset_stocks_unique_id)
    REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'procurement_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT procurement_id
    FOREIGN KEY (procurement_id)
    REFERENCES ${schemaName}.asset_procurements (procurement_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'stock_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT stock_id
    FOREIGN KEY (stock_id)
    REFERENCES ${schemaName}.stocks (stock_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetWorkingStatusTypesConstraints(schemaName) {
        const table = 'asset_working_status_types';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_working_status_types_created_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_working_status_types_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_working_status_types_updated_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_working_status_types_updated_by_fkey
    FOREIGN KEY (updated_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async addAssetsConstraints(schemaName) {
        const table = 'assets';
        await this.addConstraintIfNotExists(schemaName, table, 'asset_added_by', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_added_by
    FOREIGN KEY (asset_added_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'asset_item_id', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT asset_item_id
    FOREIGN KEY (asset_item_id)
    REFERENCES ${schemaName}.asset_items (asset_item_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'assets_asset_added_by_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT assets_asset_added_by_fkey
    FOREIGN KEY (asset_added_by)
    REFERENCES ${schemaName}.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'assets_asset_main_category_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT assets_asset_main_category_id_fkey
    FOREIGN KEY (asset_main_category_id)
    REFERENCES ${schemaName}.asset_main_category (main_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'assets_asset_sub_category_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT assets_asset_sub_category_id_fkey
    FOREIGN KEY (asset_sub_category_id)
    REFERENCES ${schemaName}.asset_sub_category (sub_category_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'assets_manufacturer_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT assets_manufacturer_id_fkey
    FOREIGN KEY (manufacturer_id)
    REFERENCES ${schemaName}.manufacturers (manufacturer_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
        await this.addConstraintIfNotExists(schemaName, table, 'assets_model_id_fkey', `
    ALTER TABLE ${schemaName}.${table}
    ADD CONSTRAINT assets_model_id_fkey
    FOREIGN KEY (model_id)
    REFERENCES ${schemaName}.models (model_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    `);
    }
    async createBranchesConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.branches
        ADD CONSTRAINT branches_user_id_fkey
        FOREIGN KEY (primary_user_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.branches
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.branches
        ADD CONSTRAINT fk_user
        FOREIGN KEY (primary_user_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createCasbinRuleConstraints(schemaName) {
        await this.dataSource.query(`

        -- No foreign key constraints defined in source DDL

    `);
    }
    async createCustomViewsConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.custom_views
        ADD CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createDepartmentsConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.departments
        ADD CONSTRAINT created_by_id
        FOREIGN KEY (created_by_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.departments
        ADD CONSTRAINT department_head_id
        FOREIGN KEY (department_head_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createDesignationsConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.designations
        ADD CONSTRAINT created_by_id
        FOREIGN KEY (created_by_id)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.designations
        ADD CONSTRAINT parent_department
        FOREIGN KEY (parent_department)
        REFERENCES ${schemaName}.departments (department_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createLocationBranchMappingConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.location_branch_mapping
        ADD CONSTRAINT branch_id
        FOREIGN KEY (branch_id)
        REFERENCES ${schemaName}.branches (branch_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_branch_mapping
        ADD CONSTRAINT location_branch_mapping_type_id_fkey
        FOREIGN KEY (type_id)
        REFERENCES ${schemaName}.location_types (type_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_branch_mapping
        ADD CONSTRAINT location_branch_mapping_updated_by_fkey
        FOREIGN KEY (updated_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_branch_mapping
        ADD CONSTRAINT location_id
        FOREIGN KEY (location_id)
        REFERENCES ${schemaName}.asset_locations (location_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createLocationTransfersConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT approved_by
        FOREIGN KEY (approved_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT asset_stocks_unique_id
        FOREIGN KEY (asset_stocks_unique_id)
        REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT location_transfers_completed_by_fkey
        FOREIGN KEY (completed_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT location_transfers_from_location_id_fkey
        FOREIGN KEY (from_location_id)
        REFERENCES ${schemaName}.location_branch_mapping (location_mapping_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT location_transfers_requested_by_fkey
        FOREIGN KEY (requested_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.location_transfers
        ADD CONSTRAINT location_transfers_to_location_id_fkey
        FOREIGN KEY (to_location_id)
        REFERENCES ${schemaName}.location_branch_mapping (location_mapping_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createOrganizationRolesConstraints(schemaName) {
        await this.dataSource.query(`

        -- No foreign key constraints found in original script

    `);
    }
    async createOtherSettingsOrgConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.other_settings_org
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.other_settings_org
        ADD CONSTRAINT updated_by
        FOREIGN KEY (updated_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createQrCodeSettingsConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.qr_code_settings
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createStocksConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.stocks
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.stocks
        ADD CONSTRAINT location_id
        FOREIGN KEY (location_id)
        REFERENCES ${schemaName}.location_branch_mapping (location_mapping_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.stocks
        ADD CONSTRAINT stocks_asset_id_fkey
        FOREIGN KEY (asset_id)
        REFERENCES ${schemaName}.assets (asset_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.stocks
        ADD CONSTRAINT stocks_created_by_fkey
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.stocks
        ADD CONSTRAINT stocks_updated_by_fkey
        FOREIGN KEY (updated_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createSupportTicketsConstraints(schemaName) {
        await this.dataSource.query(`

        -- No foreign key constraints found in original script

    `);
    }
    async createVendorsConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.vendors
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async createUsersConstraints(schemaName) {
        await this.dataSource.query(`

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT branch_id
        FOREIGN KEY (branch_id)
        REFERENCES ${schemaName}.branches (branch_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT created_by
        FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT department_id
        FOREIGN KEY (department_id)
        REFERENCES ${schemaName}.departments (department_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT designation_id
        FOREIGN KEY (designation_id)
        REFERENCES ${schemaName}.designations (designation_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT role_id
        FOREIGN KEY (role_id)
        REFERENCES ${schemaName}.organization_roles (role_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT users_location_id_fkey
        FOREIGN KEY (location_id)
        REFERENCES ${schemaName}.asset_locations (location_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT users_organization_id_fkey
        FOREIGN KEY (organization_id)
        REFERENCES public.register_organization (organization_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

        ALTER TABLE ${schemaName}.users
        ADD CONSTRAINT users_register_user_login_id_fkey
        FOREIGN KEY (register_user_login_id)
        REFERENCES public.register_user_login (user_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    `);
    }
    async addAssetItemFieldsConstraints(schemaName) {
        await this.addConstraintIfNotExists(schemaName, 'asset_fields', 'asset_fields_added_by_fkey', `
      ALTER TABLE ${schemaName}.asset_fields
      ADD CONSTRAINT asset_fields_added_by_fkey
      FOREIGN KEY (added_by)
      REFERENCES ${schemaName}.users (user_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID
    `);
        await this.addConstraintIfNotExists(schemaName, 'asset_fields', 'asset_fields_category_fkey', `
      ALTER TABLE ${schemaName}.asset_fields
      ADD CONSTRAINT asset_fields_category_fkey
      FOREIGN KEY (asset_field_category_id)
      REFERENCES ${schemaName}.asset_field_category (asset_field_category_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID
    `);
        await this.addConstraintIfNotExists(schemaName, 'asset_fields', 'asset_field_id', `
      ALTER TABLE ${schemaName}.asset_fields
      ADD CONSTRAINT asset_field_id
      FOREIGN KEY (asset_field_id)
      REFERENCES ${schemaName}.asset_fields (asset_field_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID
    `);
    }
};
exports.ConstraintsScript = ConstraintsScript;
exports.ConstraintsScript = ConstraintsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ConstraintsScript);
