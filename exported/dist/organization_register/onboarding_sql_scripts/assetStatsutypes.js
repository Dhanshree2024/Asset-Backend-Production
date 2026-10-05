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
exports.AssetStatusTypesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetStatusTypesScript = class AssetStatusTypesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetStatusTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_status_types
          (
              status_type_id SERIAL PRIMARY KEY,
              status_type_name text COLLATE pg_catalog."default",
              asset_status_description text COLLATE pg_catalog."default",
              status_color_code character varying(10) COLLATE pg_catalog."default",
              is_active smallint NOT NULL DEFAULT 1,
              is_deleted smallint NOT NULL DEFAULT 0,
              created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              is_default boolean DEFAULT false,
              created_by integer,
                updated_by integer
                        )
          
    `);
        await this.dataSource.query(`
    CREATE SEQUENCE IF NOT EXISTS ${schemaName}.asset_status_types_status_type_id_seq
    OWNED BY ${schemaName}.asset_status_types.status_type_id
  `);
    }
    async insertAssetStatusTable(schemaName, statuses) {
        const query = `
    INSERT INTO ${schemaName}.asset_status_types
      (
        status_type_id,
        status_type_name,
        asset_status_description,
        status_color_code,
        is_default
      )
    VALUES ($1, $2, $3, $4,$5)
    ON CONFLICT (status_type_id) DO NOTHING;
  `;
        for (const s of statuses) {
            await this.dataSource.query(query, [
                s.status_type_id,
                s.status_type_name.trim(),
                s.asset_status_description.trim(),
                s.status_color_code.trim(),
                s.is_default
            ]);
        }
        await this.dataSource.query(`
    SELECT setval(
      '${schemaName}.asset_status_types_status_type_id_seq',
      (SELECT COALESCE(MAX(status_type_id), 0)
       FROM ${schemaName}.asset_status_types),
      true
    );
  `);
    }
};
exports.AssetStatusTypesScript = AssetStatusTypesScript;
exports.AssetStatusTypesScript = AssetStatusTypesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetStatusTypesScript);
