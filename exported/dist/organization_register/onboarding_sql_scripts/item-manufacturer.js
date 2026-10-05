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
exports.ItemManufacturerScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ItemManufacturerScript = class ItemManufacturerScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createItemManufacturerTable(schemaName) {
        await this.dataSource.query(`
    
CREATE TABLE IF NOT EXISTS ${schemaName}.item_manufacturers
(
    item_manufacturer_id SERIAL PRIMARY KEY,
    asset_item_id integer NOT NULL,
    manufacturer_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    CONSTRAINT uq_item_manufacturer UNIQUE (asset_item_id, manufacturer_id),
    CONSTRAINT fk_item_manufacturer_created_by FOREIGN KEY (created_by)
        REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT fk_item_manufacturer_item FOREIGN KEY (asset_item_id)
        REFERENCES ${schemaName}.asset_items (asset_item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_item_manufacturer_manufacturer FOREIGN KEY (manufacturer_id)
        REFERENCES ${schemaName}.manufacturers (manufacturer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
  `);
    }
    async insertItemManufacturerMapping(schemaName) {
        await this.dataSource.query(`
    INSERT INTO ${schemaName}.item_manufacturers (asset_item_id, manufacturer_id)
    SELECT 
      ai.asset_item_id,
      m.manufacturer_id
    FROM ${schemaName}.asset_items ai

    JOIN (
      SELECT * FROM (
        VALUES
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
        ('VMware vSphere','Broadcom'),                      
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
      ) AS v(item_name, manufacturer_name)
    ) AS data 

    -- 🔥 FIXED MATCHING (no silent failures)
    ON REPLACE(LOWER(ai.asset_item_name), ' ', '') =
       REPLACE(LOWER(data.item_name), ' ', '')

    JOIN ${schemaName}.manufacturers m
      ON REPLACE(LOWER(m.manufacturer_name), ' ', '') =
         REPLACE(LOWER(data.manufacturer_name), ' ', '')

    ON CONFLICT (asset_item_id, manufacturer_id) DO NOTHING;
  `);
    }
};
exports.ItemManufacturerScript = ItemManufacturerScript;
exports.ItemManufacturerScript = ItemManufacturerScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ItemManufacturerScript);
