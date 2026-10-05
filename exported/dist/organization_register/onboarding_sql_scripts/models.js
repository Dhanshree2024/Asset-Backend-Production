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
exports.ModelsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ModelsScript = class ModelsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createModelTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.models
      (
          model_id SERIAL PRIMARY KEY,
          model_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
          manufacturer_id integer NOT NULL,
          CONSTRAINT uq_model_per_manufacturer UNIQUE (model_name, manufacturer_id),
          CONSTRAINT fk_models_manufacturer FOREIGN KEY (manufacturer_id)
              REFERENCES ${schemaName}.manufacturers (manufacturer_id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE CASCADE
      )
    `);
        await this.dataSource.query(`
INSERT INTO ${schemaName}.models (model_name, manufacturer_id)
SELECT data.model_name, m.manufacturer_id
FROM (VALUES
  ('Acronis Cyber Protect','Acronis'),
  ('Adobe Acrobat','Adobe'),
  ('Adobe Creative Cloud','Adobe'),
  ('Apollo.io','Apollo'),
  ('AutoCAD','Autodesk'),
  ('Autodesk Inventor','Autodesk'),
  ('Autodesk Maya','Autodesk'),
  ('AWS','Amazon'),
  ('Azure','Microsoft'),
  ('Canva','Canva'),
  ('CATIA','Dassault Systèmes'),
  ('Cisco Meraki','Cisco'),
  ('CleverTap','CleverTap'),
  ('Confluence','Atlassian'),
  ('CorelDRAW Graphics Suite','Corel'),
  ('CrowdStrike Falcon','CrowdStrike'),
  ('Darwinbox','Darwinbox'),
  ('Docker','Docker'),
  ('Dropbox','Dropbox'),
  ('Dynamics 365','Microsoft'),
  ('Epicor Kinetic','Epicor'),
  ('Figma','Figma'),
  ('Finacle','Infosys'),
  ('FortiGate-Unified Threat Protection (UTP)','Fortigate'),
  ('Framer','Framer'),
  ('Freshdesk','Freshworks'),
  ('GitHub','Microsoft'),
  ('Google Cloud Platform (GCP)','Google'),
  ('Google Workspace','Google'),
  ('greytHR','Greytip'),
  ('HubSpot','HubSpot'),
  ('Insight7','Insight7'),
  ('Jira Service Management','Atlassian'),
  ('Mailchimp','Intuit'),
  ('ManageEngine Endpoint Central','Zoho Corp'),
  ('Microsoft 365','Microsoft'),
  ('Microsoft Defender for Endpoint','Microsoft'),
  ('Microsoft Defender for Office 365','Microsoft'),
  ('Microsoft Entra ID','Microsoft'),
  ('Microsoft Teams','Microsoft'),
  ('Postman','Postman'),
  ('Power BI','Microsoft'),
  ('PTC Creo','PTC'),
  ('Salesforce','Salesforce'),
  ('SAP Business One','SAP'),
  ('SAP S/4HANA Cloud','SAP'),
  ('SEMrush','SEMrush'),
  ('Seqrite','Quick Heal'),
  ('ServiceNow ITSM','ServiceNow'),
  ('SharePoint Online','Microsoft'),
  ('Shutterstock','Shutterstock'),
  ('Siemens NX','Siemens'),
  ('SketchUp','Trimble'),
  ('Slack','Slack'),
  ('SolidWorks','Dassault Systèmes'),
  ('Sophos XGS -Xstream Protection','Sophos'),
  ('Tally Prime','Tally Solutions'),
  ('Tenable Nessus','Tenable'),
  ('Trello','Atlassian'),
  ('Veeam','Veeam Software'),
  ('Vmware VVF','Broadcom'),
  ('VMware vSphere','Broadcom'),  -- ✅ FIXED
  ('Webex Suite','Cisco'),
  ('Zendesk Suite','Zendesk'),
  ('Zoho Assist','Zoho Corp'),
  ('Zoho Books','Zoho Corp'),
  ('Zoho CRM','Zoho Corp'),
  ('Zoho One','Zoho Corp'),
  ('Zoho People','Zoho Corp'),
  ('Zoom','Zoom Video'),
  ('Escan','Escan'),
  ('Nitropdf','Nitro'),
  ('Microsoft Copilot','Microsoft'),
  ('Chat GPT Business','OpenAI'),
  ('Microsoft Office','Microsoft'),
  ('Microsoft Windows OS','Microsoft'),
  ('Office Home & Business','Microsoft'),
  ('Microsoft Windows Server','Microsoft')
) AS data(model_name, manufacturer_name)

JOIN ${schemaName}.manufacturers m
  ON REPLACE(LOWER(m.manufacturer_name), ' ', '') =
     REPLACE(LOWER(data.manufacturer_name), ' ', '')

ON CONFLICT (model_name, manufacturer_id) DO NOTHING;
`);
    }
};
exports.ModelsScript = ModelsScript;
exports.ModelsScript = ModelsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ModelsScript);
