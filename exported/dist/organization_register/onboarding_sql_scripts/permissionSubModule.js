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
exports.SubModuleScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SubModuleScript = class SubModuleScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createSubModuleTable(schemaName) {
        await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.submodules (
      id SERIAL PRIMARY KEY,
      submodule_name VARCHAR(100) NOT NULL,
      submodule_code VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      module_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      CONSTRAINT fk_module FOREIGN KEY (module_id)
        REFERENCES ${schemaName}.modules (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
  `);
    }
    async insertDefaultSubmodules(schemaName) {
        await this.dataSource.query(`
  INSERT INTO ${schemaName}.submodules 
  (id, submodule_name, submodule_code, description, module_id)
  VALUES
    (1,'Dashboard','DASHBOARD_MAIN','Dashboard module',1),
    (2,'All Asset','ALL_ASSET_MAIN','All asset listing',2),

    (3,'Assign Asset','ASSIGN_ASSET','Asset assignment',3),
    (5,'Stock','STOCK','Stock management',3),
    (6,'Location Transfer','LOCATION_TRANSFER','Location transfer',3),
    (7,'Maintenance','MAINTENANCE','Asset maintenance',3),
    (8,'Scrap','SCRAP','Asset scrap operations',3),

    (9,'Specification','ASSET_SPECIFICATION','Asset specification',4),
    (10,'Billing','ASSET_BILLING','Billing information',4),
    (11,'Service & Activity','SERVICE_ACTIVITY','Service and activity logs',4),
    (12,'Warranty','ASSET_WARRANTY','Warranty details',4),

    -- module 5 (Organization Setting)
    (13,'Profile','ORG_PROFILE','Organization profile',5),
    (14,'Branch','ORG_BRANCH','Branch management',5),
    (15,'Designation','ORG_DESIGNATION','Designation management',5),
    (16,'Department','ORG_DEPARTMENT','Department management',5),
    (17,'Subscription','ORG_SUBSCRIPTION','Subscription settings',5),
    (18,'Other Setting','ORG_OTHER_SETTING','Other settings',5),
    (19,'Roles & Permission','ORG_ROLE_PERMISSION','Roles and permissions',5),
    (20,'User','ORG_USER','User management',5),
    (21,'Location','ORG_LOCATION','Location management',5),
    (22,'Vendor','ORG_VENDOR','Vendor management',5),
    (23,'Project','ORG_PROJECT','Project management',5),
    (24,'Cost Center','ORG_COST_CENTER','Cost center management',5),

    -- module 6 (Item Settings)
    (25,'Items','ITEMS','Item settings',6),
    (26,'Custom Field','CUSTOM_FIELD','Custom field settings',6),

    -- module 7 (Asset Setup)
    (27,'Asset Status','ASSET_STATUS','Asset status setup',7),
    (28,'Working Condition','WORKING_CONDITION','Working condition setup',7),
    (29,'Ownership types','OWNERSHIP_TYPES','Ownership type setup',7),

    -- module 8 (Asset ID Setting)
    (30,'Serial Number','SERIAL_NUMBER','Serial number configuration',8),
    (31,'Scanning Method','SCANNING_METHOD','Scanning method configuration',8),

    -- module 9 (My Asset)
    (32,'My Asset','MY_ASSET_VIEW','View my assets',9),

    -- module 10 (Barcode / QR)
    (33,'Print Barcode','PRINT_BARCODE','Barcode printing',10),
    (34,'Print QR Code','PRINT_QR_BARCODE','QR code printing',10),

    -- module 11 (Help)
    (35,'Getting Started','HELP_GETTING_STARTED','Getting started',11),
    (36,'Resources','HELP_RESOURCES','Help resources',11),
    (37,'Recent Updates','HELP_RECENT_UPDATES','Recent updates',11),
    (38,'Feedback','HELP_FEEDBACK','Feedback',11),
    (39,'Send Message','HELP_SEND_MESSAGE','Send support message',11),
    (40,'Support Tickets','HELP_SUPPORT_TICKETS','Support tickets',11),

    -- module 12 (Profile)
    (41,'Self Password Reset','PROFILE_PASSWORD_RESET','Password reset',12),
    (42,'Profile','PROFILE','Profile',12),
    (43,'Theme','THEME','Theme Setting',12),
    (44,'Sidebar Preferences','SIDEBAR_PREF','Sidebar prefence',12),
    
    --- subscription

     (45, 'Subscriptions', 'SUBSCRIPTION', 'software subscription', 3),
                (46, 'Perpetual Softwares', 'PERPETUAL', 'perpetual softwares', 3),
                (47, 'Manage Renewals', 'MANAGE_RENEWALS', 'Manage Renewals of softwares', 3),
                                (48, 'Depreciation', 'DEPRECIATION', 'View depreciation', 13),
                                 (49, 'WDV Report', 'WDV REPORT', 'View WDV Report', 13),
(50, 'Branch Wise', 'BRANCH_WISE', 'View Branch Wise Report', 14),
(51, 'Department Wise', 'DEPARTMENT_WISE', 'View Department Wise Report', 14),
(52, 'Item Wise', 'ITEM_WISE', 'View Item Wise Report', 14),
(53, 'Asset Status Wise', 'ASSET_STATUS_WISE', 'View Asset Status Wise Report', 15),
(54, 'Working Condition Wise', 'WORKING_CONDITION_WISE', 'View Working Condition Wise Report', 15),
(55, 'Ownership Type Wise', 'OWNERSHIP_TYPE_WISE', 'View Ownership Type Wise Report', 15),
(56, 'Purchase Month Wise', 'PURCHASE_MONTH_WISE', 'View Purchase Month Wise Report', 15),
(57, 'Asset Register', 'ASSET_REGISTER', 'View Asset Register Report', 15),
(58, 'Vendor Wise', 'VENDOR_WISE', 'View Vendor Wise Report', 16),
(59, 'Depreciation Report', 'DEPRECIATION Report', 'View Depreciation Report', 16),
(60, 'Warranty Expiry', 'WARRANTY_EXPIRY', 'View Warranty Expiry Report', 16),
(61, 'Location Transfer History', 'LOCATION_TRANSFER_HISTORY', 'View Location Transfer History Report', 17),
(62, 'Maintenance History', 'MAINTENANCE_HISTORY', 'View Maintenance History Report', 17),
(63, 'Scrap by Disposal Method', 'SCRAP_BY_DISPOSAL_METHOD', 'View Scrap by Disposal Method Report', 17),
(64, 'Dashboard', 'DASHBOARD', 'View Agent Discovery Dashboard', 18),
(65, 'Config', 'CONFIG', 'Manage Agent Discovery Configuration', 18),
(66, 'Collector', 'COLLECTOR', 'Manage Agent Discovery Collector', 18),
(67, 'Import to Assets', 'IMPORT_TO_ASSETS', 'Import Discovered Assets', 18),
(68, 'Item Ownership Matrix', 'ITEM_OWNERSHIP_MATRIX', 'View Item Ownership Matrix Report', 15),
(69, 'All Policies', 'ALL_POLICIES', 'View All Policies List', 19),
(70, 'My Policies', 'MY_POLICIES', 'View My Policies list', 19),
(71, 'Credentials', 'DISCOVERY_CREDENTIALS', 'Manage discovery credentials (Phase 2)', 18),
(72, 'Jobs', 'DISCOVERY_JOBS', 'View / approve remote agent jobs (Phase 2)', 18),
(73, 'Audit Log', 'DISCOVERY_AUDIT_LOG', 'View discovery audit log (Phase 2)', 18),
(74, 'Active Directory', 'DISCOVERY_ACTIVE_DIRECTORY', 'Configure AD / LDAP integration (Phase 2)', 18),
(75, 'Agents', 'DISCOVERY_AGENTS', 'Manage installed agents / remote sweeps (Phase 2)', 18),
(76, 'Location Type Setting', 'LOCATION_TYPE', 'Location Type Settings', 5),
(77, 'Packages', 'DISCOVERY_PACKAGES', 'Software package repository (Phase 3)', 18),
(78, 'Deployments', 'DISCOVERY_DEPLOYMENTS', 'Software push / deployments (Phase 3)', 18),
(79, 'Compliance', 'DISCOVERY_COMPLIANCE', 'Compliance policies, findings, controlled uninstall (Phase 3)', 18),
(80, 'Software', 'ASSET_SOFTWARE', 'Discovered / installed software on the asset (Single Asset View tab)', 4),
(81, 'Endpoint Management', 'ASSET_ENDPOINT_MANAGEMENT', 'Services, event log and performance from the discovery agent (Single Asset View tab)', 4)


  ON CONFLICT (submodule_code) DO NOTHING;
`);
        await this.dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('${schemaName}.submodules','id'),
        (SELECT MAX(id) FROM ${schemaName}.submodules)
      );
    `);
    }
};
exports.SubModuleScript = SubModuleScript;
exports.SubModuleScript = SubModuleScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SubModuleScript);
