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
exports.PermissionModuleScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PermissionModuleScript = class PermissionModuleScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createPermissionModuleTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.modules (
        id SERIAL PRIMARY KEY,
        module_name VARCHAR(100) NOT NULL,
        module_code VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        CONSTRAINT modules_module_code_key UNIQUE (module_code)
      );
    `);
    }
    async insertDefaultModules(schemaName) {
        await this.dataSource.query(`
  INSERT INTO ${schemaName}.modules (id, module_name, module_code, description)
  VALUES
    (1,'Dashboard','DASHBOARD','Permission settings for dashboard'),
    (2,'All Asset','ALL_ASSET','Permission settings for all asset'),
    (3,'Asset Operation','ASSET_OPERATION','Permission settings for asset operation'),
    (4,'Single Asset View','SINGLE_ASSET_VIEW','Permission settings for Single Asset View'),
    (5,'Organization Setting','ORG_SETTING','Permission settings for organization setting'),
    (6,'Item Settings','ITEM_SETTINGS','Permission settings for item settings'),
    (7,'Asset Setup','ASSET_SETUP','Permission settings for asset setup'),
    (8,'Asset ID Setting','ASSET_ID_SETTING','Permission settings for asset id setting'),
    (9,'My Asset','MY_ASSET','Permission settings for my asset'),
    (10,'Barcode / QR Code Printing','BARCODE_QR_PRINT','Permission settings for barcode / qr code printing'),
    (11,'Help & Support','HELP_SUPPORT','Permission settings for help & support'),
    (12,'User Profile Setting','USER_PROFILE_SETTING','Permission settings for user profile setting'),
    (13,'Depreciation','DEPRECIATION','Permission to view depreciation'),
     (14,'Tracking Reports','REPORTS_TRACKING','Permission to view tracking reports'),
    (15,'Asset Reports','REPORTS_ASSET','Permission to view asset reports'),
    (16,'Financial Reports','REPORTS_FINANCIAL','Permission to view financial reports'),
    (17,'History Reports','REPORTS_HISTORY','Permission to view history reports'),
        (18,'Agent Discovery','AGENT_DISCOVERY','Permission to view agent discovery'),
                (19,'Policy','POLICY','Permission to view policies data')




  ON CONFLICT (module_code) DO NOTHING;
`);
    }
};
exports.PermissionModuleScript = PermissionModuleScript;
exports.PermissionModuleScript = PermissionModuleScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PermissionModuleScript);
