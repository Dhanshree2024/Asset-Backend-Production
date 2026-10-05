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
exports.AssetRelationshipGovernanceScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetRelationshipGovernanceScript = class AssetRelationshipGovernanceScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetRelationshipGovernanceTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_relationship_governance (
          governance_id SERIAL PRIMARY KEY,
          rule_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
          relation_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
          source_main_category_id integer,
          source_sub_category_id integer,
          source_item_id bigint,
          target_entity_type ${schemaName}.assign_type_enum NOT NULL,
          target_main_category_id integer,
          target_sub_category_id integer,
          target_item_id bigint,
          is_allowed boolean NOT NULL DEFAULT true,
          validation_message character varying(255) COLLATE pg_catalog."default",
          is_active boolean NOT NULL DEFAULT true,
          created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }
    async insertAssetRelationshipGovernance(schemaName, rules) {
        const insertQuery = `
      INSERT INTO ${schemaName}.asset_relationship_governance
      (governance_id, rule_name, relation_type, source_main_category_id, source_sub_category_id, source_item_id, target_entity_type, target_main_category_id, target_sub_category_id, target_item_id, is_allowed, validation_message, is_active)
      OVERRIDING SYSTEM VALUE
      VALUES ($1, $2, $3, $4, $5, $6, $7::${schemaName}.assign_type_enum, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (governance_id) DO UPDATE SET
          rule_name                = EXCLUDED.rule_name,
          relation_type            = EXCLUDED.relation_type,
          source_main_category_id  = EXCLUDED.source_main_category_id,
          source_sub_category_id   = EXCLUDED.source_sub_category_id,
          source_item_id           = EXCLUDED.source_item_id,
          target_entity_type       = EXCLUDED.target_entity_type,
          target_main_category_id  = EXCLUDED.target_main_category_id,
          target_sub_category_id   = EXCLUDED.target_sub_category_id,
          target_item_id           = EXCLUDED.target_item_id,
          is_allowed               = EXCLUDED.is_allowed,
          validation_message       = EXCLUDED.validation_message,
          is_active                = EXCLUDED.is_active;
    `;
        for (const rule of rules) {
            await this.dataSource.query(insertQuery, [
                rule.governance_id,
                rule.rule_name,
                rule.relation_type,
                rule.source_main_category_id ?? null,
                rule.source_sub_category_id ?? null,
                rule.source_item_id ?? null,
                rule.target_entity_type,
                rule.target_main_category_id ?? null,
                rule.target_sub_category_id ?? null,
                rule.target_item_id ?? null,
                rule.is_allowed,
                rule.validation_message ?? null,
                rule.is_active,
            ]);
        }
        await this.dataSource.query(`
      SELECT setval(
          pg_get_serial_sequence('${schemaName}.asset_relationship_governance', 'governance_id'),
          COALESCE((SELECT MAX(governance_id) FROM ${schemaName}.asset_relationship_governance), 1)
      );
    `);
    }
};
exports.AssetRelationshipGovernanceScript = AssetRelationshipGovernanceScript;
exports.AssetRelationshipGovernanceScript = AssetRelationshipGovernanceScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetRelationshipGovernanceScript);
