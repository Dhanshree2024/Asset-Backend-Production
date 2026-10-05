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
exports.AssetOwnershipStatusTypesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetOwnershipStatusTypesScript = class AssetOwnershipStatusTypesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetOwnershipStatusTypesTable(schemaName) {
        await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS ${schemaName}.asset_ownership_status_types
          (
              ownership_status_type_id SERIAL PRIMARY KEY,
              ownership_status_type_name text COLLATE pg_catalog."default",
              ownership_status_description text COLLATE pg_catalog."default",
              ownership_status_type ownership_type_enum,
              asset_ownership_status_color character varying(10) COLLATE pg_catalog."default",
              is_active smallint NOT NULL DEFAULT 1,
              is_deleted smallint NOT NULL DEFAULT 0,
              created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
              is_default boolean DEFAULT false,
              created_by integer,
                updated_by integer,
                CONSTRAINT asset_ownership_status_types_created_by_fkey FOREIGN KEY (created_by)
                    REFERENCES  ${schemaName}.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT asset_ownership_status_types_updated_by_fkey FOREIGN KEY (updated_by)
                    REFERENCES  ${schemaName}.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
                        )
              
          
    `);
    }
    async insertAssetOwnershipStatusTable(schemaName, statuses) {
        const statusInsertQuery = `
        INSERT INTO ${schemaName}.asset_ownership_status_types
          (ownership_status_type_name, ownership_status_description, ownership_status_type, 
          asset_ownership_status_color, is_default)
        VALUES ($1, $2, $3, $4, $5);
      `;
        for (const status of statuses) {
            await this.dataSource.query(statusInsertQuery, [
                status.ownership_status_type_name.trim(),
                status.ownership_status_description.trim(),
                status.ownership_status_type.trim(),
                status.asset_ownership_status_color.trim(),
                status.is_default,
            ]);
        }
    }
};
exports.AssetOwnershipStatusTypesScript = AssetOwnershipStatusTypesScript;
exports.AssetOwnershipStatusTypesScript = AssetOwnershipStatusTypesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetOwnershipStatusTypesScript);
