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
exports.SpecialPermissionsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SpecialPermissionsScript = class SpecialPermissionsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createSpecialPermissionsMaster(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.special_permissions_master (
        id BIGSERIAL PRIMARY KEY,
        module_id BIGINT NOT NULL,
        submodule_id BIGINT NOT NULL,
        attr_key VARCHAR(255) NOT NULL,
        attr_value TEXT NOT NULL,
        attr_type ${schemaName}.special_permission_attribute_enum,
        is_required BOOLEAN NOT NULL DEFAULT true,
        description TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),

        CONSTRAINT uq_spm UNIQUE (module_id, submodule_id, attr_key),

        CONSTRAINT fk_spm_module FOREIGN KEY (module_id)
          REFERENCES ${schemaName}.modules (id)
          ON DELETE CASCADE,

        CONSTRAINT fk_spm_submodule FOREIGN KEY (submodule_id)
          REFERENCES ${schemaName}.submodules (id)
          ON DELETE CASCADE
      );
    `);
    }
    async insertDefaultSpecialPermissions(schemaName) {
        await this.dataSource.query(`
    INSERT INTO ${schemaName}.special_permissions_master
      (module_id, submodule_id, attr_key, attr_value, attr_type, is_required, description)
    VALUES
      -- All Asset
      (2, 2, 'branch_wise_access', 'Branch wise access', 'exact', true, 'Ability to view assets by branch'),
      (2, 2, 'custom_view', 'Custom View', 'exact', true, 'Ability to customize asset views'),
      (2, 2, 'view_self_added_assets', 'View Self Added Assets Only', 'exact', true, 'Ability to view only self-added assets'),

      -- Asset Operation → Assign Asset
      (3, 3, 'return_asset', 'Return Asset', 'exact', true, 'Ability to process asset returns'),
      (3, 3, 'reassign_asset', 'Reassign Asset', 'exact', true, 'Ability to reassign assets to different users'),

      -- Asset Operation → Some Other Submodules
      (3, 5, 'move_to_inventory', 'Return to Stock', 'exact', true, 'Ability to return assets back to stock'),

      -- Maintenance
      (3, 7, 'schedule_maintenance', 'Schedule Maintenance', 'exact', true, 'Ability to schedule asset maintenance'),
      (3, 7, 'initiate_maintenance', 'Initiate Maintenance', 'exact', true, 'Ability to initiate maintenance requests'),
      (3, 7, 'update_maintenance_status', 'Update Maintenance Status', 'exact', true, 'Ability to update maintenance status'),

      -- Media / Documents
      (4, 9, 'image_edit', 'Icon Change (Photo/Image)', 'exact', true, 'Ability to upload and attach Photo to assets'),
      (4, 10, 'upload_document', 'View Document', 'exact', true, 'Ability to view billing documents and attachments'),

      
      -- Scrap
      (3, 8, 'mark_for_scrap', 'Mark For Scrap', 'exact', true, 'Initialize the scrap'),
      (3, 8, 'add_to_scrap', 'Add To Scrap', 'exact', true, 'Final form submission from scrap list'),

      -- Transfer
      (3, 6, 'initiate_transfer', 'Initiate Location Transfer', 'exact', true, 'Ability to initiate/ request for asset transfer'),
      (3, 6, 'complete_transfer', 'Confirm Location Transfer', 'exact', true, 'Ability to confirm asset transfer between locations'),


       (5, 20, 'reset_password', 'Reset Password', 'exact', true, 'Ability to reset user passwords'),
      (5, 20, 'logout_all_session', 'Logout of All Sessions', 'exact', true, 'Ability to logout all active sessions for a user'),

        -- SUBSCRIPTION (code = SUBSCRIPTION)
                    (3, 45,'mark_renewal','Mark for Renewal','exact', true,'Ability to mark softwares''s subscription for renewal'),
                    (3,45,'add_license','Add Licenses (Pro-Rata)','exact', true,'Ability to add licenses'),

                    -- PERPETUAL
                    (3,46 ,'deactivate_license','Deactivate License','exact', true,'Ability to deactivate license of software'),
                    (3,46 ,'renew_support','Renew Support','exact', true,'Ability to renew support for perpetual software'),
                    (3, 46 ,'view_history','View History','exact', true,'Ability to view history of perpetual softwares'),

                    -- MANAGE_RENEWALS
                    (3,47 ,'review_renewal','Review Renewal','exact', true,'Ability to review renewal for softwares'),
                    (3,47 ,'view_history','View History','exact', true,'Ability to view history for software renewals'),
                    (3,47 ,'cancel_renewal','Cancel Renewal','exact', true,'Ability to cancel renewal for softwares'),

                   (3,45,'stop_subscription','Stop Subscription','exact', true,'Ability to stop subscription'),
                                      (19,69,'mark_all_acknowledged','Mark All Acknowledged','exact', true,'Ability to forcefully mark policy as 100% acknowledged ')



  `);
    }
};
exports.SpecialPermissionsScript = SpecialPermissionsScript;
exports.SpecialPermissionsScript = SpecialPermissionsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SpecialPermissionsScript);
