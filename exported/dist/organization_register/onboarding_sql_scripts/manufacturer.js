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
exports.ManufacturerScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ManufacturerScript = class ManufacturerScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createManufacturerTable(schemaName) {
        await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.manufacturers
    (
        manufacturer_id SERIAL PRIMARY KEY,
        manufacturer_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
        item_type ${schemaName}.item_type_enum,
        CONSTRAINT manufacturers_manufacturer_name_key UNIQUE (manufacturer_name)
    )
  `);
        await this.dataSource.query(`
INSERT INTO ${schemaName}.manufacturers (manufacturer_name, item_type)
VALUES
('Acronis', 'Virtual'),
('Adobe', 'Virtual'),
('Apollo', 'Virtual'),
('Autodesk', 'Virtual'),
('Amazon', 'Virtual'),
('Microsoft', 'Virtual'),
('Canva', 'Virtual'),
('Dassault Systèmes', 'Virtual'),
('Cisco', 'Virtual'),
('CleverTap', 'Virtual'),
('Atlassian', 'Virtual'),
('Corel', 'Virtual'),
('CrowdStrike', 'Virtual'),
('Darwinbox', 'Virtual'),
('Docker', 'Virtual'),
('Dropbox', 'Virtual'),
('Epicor', 'Virtual'),
('Figma', 'Virtual'),
('Infosys', 'Virtual'),
('Fortigate', 'Virtual'),
('Framer', 'Virtual'),
('Freshworks', 'Virtual'),
('Google', 'Virtual'),
('Greytip', 'Virtual'),
('HubSpot', 'Virtual'),
('Insight7', 'Virtual'),
('Intuit', 'Virtual'),
('Zoho Corp', 'Virtual'),
('Postman', 'Virtual'),
('PTC', 'Virtual'),
('Salesforce', 'Virtual'),
('SAP', 'Virtual'),
('SEMrush', 'Virtual'),
('Quick Heal', 'Virtual'),
('ServiceNow', 'Virtual'),
('Shutterstock', 'Virtual'),
('Siemens', 'Virtual'),
('Trimble', 'Virtual'),
('Slack', 'Virtual'),
('Sophos', 'Virtual'),
('Tally Solutions', 'Virtual'),
('Tenable', 'Virtual'),
('Veeam Software', 'Virtual'),
('Broadcom', 'Virtual'),
('Zendesk', 'Virtual'),
('Zoom Video', 'Virtual'),
('Escan', 'Virtual'),
('Nitro', 'Virtual'),
('OpenAI', 'Virtual')  -- ✅ fixed (was "Open AI")
ON CONFLICT (manufacturer_name) DO NOTHING;
`);
    }
};
exports.ManufacturerScript = ManufacturerScript;
exports.ManufacturerScript = ManufacturerScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ManufacturerScript);
