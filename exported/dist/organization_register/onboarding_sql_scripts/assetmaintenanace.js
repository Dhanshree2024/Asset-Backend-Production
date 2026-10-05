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
exports.AssetMaintenanceTablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetMaintenanceTablesService = class AssetMaintenanceTablesService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetMaintenanceTable(schemaName) {
        await this.dataSource.query(`
      
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_maintenance
          (
                maintenance_id BIGSERIAL,
               maintenance_ref_id character varying(50) NOT NULL,
          mapping_id bigint,
          asset_id bigint NOT NULL,
          asset_display_name character varying(255),
          serial_number character varying(100),
          maintenance_type character varying(50),
          priority character varying(20),
          status_type_id integer NOT NULL,
          asset_working_condition_id integer,
          scheduled_date date NOT NULL,
          started_at timestamp without time zone,
          completed_at timestamp without time zone,
          managed_by character varying(100),
          estimated_cost double precision,
          actual_cost double precision,
          description text,
          location character varying(150),
          created_by integer,
          updated_by integer,
          created_at timestamp without time zone DEFAULT now(),
          updated_at timestamp without time zone DEFAULT now(),
          is_active smallint NOT NULL DEFAULT 1,
          is_deleted smallint DEFAULT 0,
          asset_stocks_unique_id bigint NOT NULL,
           PRIMARY KEY (maintenance_id, scheduled_date),   
          
    CONSTRAINT asset_maintenance_maintenance_ref_id_key 
    UNIQUE (maintenance_ref_id, scheduled_date)
                
      )
            PARTITION BY RANGE (scheduled_date);

    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_maintenance_default
      PARTITION OF ${schemaName}.asset_maintenance
      DEFAULT;
    `);
    }
};
exports.AssetMaintenanceTablesService = AssetMaintenanceTablesService;
exports.AssetMaintenanceTablesService = AssetMaintenanceTablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetMaintenanceTablesService);
