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
exports.assetLocationScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetLocationScript = class assetLocationScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetLocationScriptTable(schemaName) {
        await this.dataSource.query(`

          CREATE TABLE IF NOT EXISTS ${schemaName}.asset_locations
(
    location_id SERIAL PRIMARY KEY,
    branch_id integer,
    location_floor text COLLATE pg_catalog."default",
    location_code text COLLATE pg_catalog."default",
    location_city text COLLATE pg_catalog."default",
    location_state text COLLATE pg_catalog."default",
    location_street_address text COLLATE pg_catalog."default",
    location_description text COLLATE pg_catalog."default",
    location_google_map_pin text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by integer,
    updated_by integer,
    location_name text COLLATE pg_catalog."default",
    is_active smallint DEFAULT 1,
    is_deleted smallint DEFAULT 0,
    location_room text COLLATE pg_catalog."default",
    parent_location_id integer,
    is_locked boolean DEFAULT false,
    location_type_code text COLLATE pg_catalog."default",
    location_type_entity_id integer,
    path text COLLATE pg_catalog."default",
    location_level integer DEFAULT 0,
    location_type_id integer,
    country text COLLATE pg_catalog."default",
    pincode integer,
    location_landmark text COLLATE pg_catalog."default",
    CONSTRAINT asset_locations_location_type_id_fkey FOREIGN KEY (location_type_id)
        REFERENCES ${schemaName}.location_types (type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_asset_locations_parent FOREIGN KEY (parent_location_id)
        REFERENCES ${schemaName}.asset_locations (location_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

        `);
    }
    async insertAssetLocations(schemaName, locations) {
        const insertQuery = `
    INSERT INTO ${schemaName}.asset_locations
      (branch_id, department_id, location_name, location_floor_room, location_code,
       location_city, location_state, location_street_address, location_description,
       location_google_map_pin, location_total_asset, created_by)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  `;
        for (const loc of locations) {
            await this.dataSource.query(insertQuery, [
                loc.branch_id || null,
                loc.department_id || null,
                loc.location_name,
                loc.location_floor_room || null,
                loc.location_code || null,
                loc.location_city || null,
                loc.location_state || null,
                loc.location_street_address || null,
                loc.location_description || null,
                loc.location_google_map_pin || null,
                loc.location_total_asset || 0,
                loc.created_by || null,
            ]);
        }
    }
};
exports.assetLocationScript = assetLocationScript;
exports.assetLocationScript = assetLocationScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetLocationScript);
