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
exports.LicenceTypesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let LicenceTypesScript = class LicenceTypesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createLicenceTypesTable(schemaName) {
        await this.dataSource.query(`
            
            CREATE TABLE IF NOT EXISTS ${schemaName}.item_licence_type
            (
                licence_id SERIAL PRIMARY KEY,
                is_active integer NOT NULL DEFAULT 1,
                is_delete integer NOT NULL DEFAULT 0,
                licence_key_type boolean NOT NULL DEFAULT true,
                licence_type character varying(100) COLLATE pg_catalog."default",
                needs_license_key boolean DEFAULT true,
                bulk_license boolean DEFAULT false,
                needs_start_date boolean DEFAULT false,
                needs_end_date boolean DEFAULT false,
                is_renewable boolean DEFAULT false,
                has_expiry boolean DEFAULT false,
                show_in_stock_form boolean DEFAULT true,
                have_plan_type boolean DEFAULT false
            )
        `);
    }
    async insertLicenceTypeTable(schemaName, licenceTypes) {
        const licenceTypeInsertQuery = `
          INSERT INTO ${schemaName}.item_licence_type(licence_type, licence_key_type)
          VALUES ($1, $2);
  `;
        for (const licenceType of licenceTypes) {
            await this.dataSource.query(licenceTypeInsertQuery, [
                licenceType.licence_type,
                licenceType.licence_key_type,
            ]);
        }
    }
};
exports.LicenceTypesScript = LicenceTypesScript;
exports.LicenceTypesScript = LicenceTypesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], LicenceTypesScript);
