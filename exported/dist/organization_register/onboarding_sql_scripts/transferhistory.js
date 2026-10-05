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
exports.AssetTransferHistoryScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetTransferHistoryScript = class AssetTransferHistoryScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetTransferHistoryTable(schemaName) {
        await this.dataSource.query(`
            
           
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_transfer_history
      (
          transfer_id BIGSERIAL PRIMARY KEY,
          asset_id bigint NOT NULL,
          previous_used_by integer,
          used_by integer,
          transfered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
          system_code text COLLATE pg_catalog."default",
          mapping_id bigint,
          asset_stocks_unique_id bigint,
          assign_type character varying(20) COLLATE pg_catalog."default",
          previous_user_id integer,
          previous_branch_id integer,
          previous_department_id integer,
          previous_project_id integer,
          new_user_id integer,
          new_branch_id integer,
          new_department_id integer,
          new_project_id integer,

          CONSTRAINT asset_transfer_history_assign_type_check
          CHECK (
            assign_type::text = ANY (
              ARRAY[
                'USER'::character varying::text,
                'BRANCH'::character varying::text,
                'DEPARTMENT'::character varying::text,
                'PROJECT'::character varying::text
              ]
            )
          )
      );
        `);
    }
};
exports.AssetTransferHistoryScript = AssetTransferHistoryScript;
exports.AssetTransferHistoryScript = AssetTransferHistoryScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetTransferHistoryScript);
