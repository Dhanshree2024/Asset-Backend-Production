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
exports.AssetWorkingStatusScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetWorkingStatusScript = class AssetWorkingStatusScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetWorkingStatusTable(schemaName) {
        await this.dataSource.query(`
          CREATE TABLE IF NOT EXISTS ${schemaName}.asset_working_status_types
            (
                working_status_type_id SERIAL PRIMARY KEY,
                working_status_type_name text COLLATE pg_catalog."default",
                is_active smallint NOT NULL DEFAULT 1,
                is_deleted smallint NOT NULL DEFAULT 0,
                working_status_color character varying(20) COLLATE pg_catalog."default",
                working_status_description text COLLATE pg_catalog."default",
                status_category integer,
                status_for_category integer,
                created_at timestamp without time zone,
                is_default boolean DEFAULT false,
                created_by integer,
                updated_by integer
                
                        )
        `);
    }
    async insertAssetWorkingStatusTable(schemaName, statuses) {
        const query = `
    INSERT INTO ${schemaName}.asset_working_status_types
    (working_status_type_id,
     working_status_type_name,
      status_category,status_for_category,
      working_status_description,
      working_status_color,
      is_default)
    VALUES ($1, $2, $3, $4, $5, $6,$7)
    ON CONFLICT (working_status_type_id) DO NOTHING;
  `;
        for (const s of statuses) {
            await this.dataSource.query(query, [
                s.working_status_type_id,
                s.working_status_type_name,
                s.status_category,
                s.status_for_category ?? null,
                s.working_status_description ?? null,
                s.working_status_color ?? null,
                s.is_default ?? null
            ]);
        }
        await this.dataSource.query(`
    SELECT setval(
      pg_get_serial_sequence(
        '${schemaName}.asset_working_status_types',
        'working_status_type_id'
      ),
      (SELECT COALESCE(MAX(working_status_type_id), 0)
       FROM ${schemaName}.asset_working_status_types) + 1,
      false
    );
  `);
    }
};
exports.AssetWorkingStatusScript = AssetWorkingStatusScript;
exports.AssetWorkingStatusScript = AssetWorkingStatusScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetWorkingStatusScript);
