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
exports.qrCodeSettingsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let qrCodeSettingsScript = class qrCodeSettingsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createQrCodeSettingsTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.qr_code_settings
            (
                id SERIAL PRIMARY KEY,
                settings jsonb NOT NULL,
                is_current boolean DEFAULT true,
                created_by integer NOT NULL,
                updated_by integer,
                created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp without time zone,
                asset_id_setting_id integer,
                org_id integer,
                
           
                CONSTRAINT qr_code_settings_v2_is_current_check CHECK (is_current = ANY (ARRAY[true, false]))
            )
    `);
        const existing = await this.dataSource.query(`SELECT COUNT(*) FROM ${schemaName}.qr_code_settings;`);
        if (Number(existing[0].count) === 0) {
            console.log(`[QR Settings] Inserting default QR code settings...`);
            const defaultSettings = {
                "0": "display_name",
                "1": "item_name",
                "2": "branch_name",
                "3": "location_name",
                "4": "assigned_to_name",
                "5": "target_type",
                "6": "serial_number",
                "serialId": null
            };
            await this.insertQrCodeSettings(schemaName, [
                {
                    settings: defaultSettings,
                    is_current: true,
                    created_by: 1,
                    org_id: 1
                }
            ]);
            console.log(`[QR Settings] Default QR code settings inserted ✅`);
        }
        else {
            console.log(`[QR Settings] Default QR code settings already exist, skipping insert.`);
        }
    }
    async insertQrCodeSettings(schemaName, qrSettings) {
        const insertQuery = `
      INSERT INTO ${schemaName}.qr_code_settings
      (
        settings,
        is_current,
        created_by,
        updated_by,
        asset_id_setting_id,
        org_id
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
        for (const qr of qrSettings) {
            await this.dataSource.query(insertQuery, [
                JSON.stringify(qr.settings),
                qr.is_current ?? true,
                qr.created_by,
                qr.updated_by || null,
                qr.asset_id_setting_id || null,
                qr.org_id || null,
            ]);
        }
    }
};
exports.qrCodeSettingsScript = qrCodeSettingsScript;
exports.qrCodeSettingsScript = qrCodeSettingsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], qrCodeSettingsScript);
