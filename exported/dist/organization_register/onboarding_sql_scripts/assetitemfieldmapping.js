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
exports.ItemFieldsMappingScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ItemFieldsMappingScript = class ItemFieldsMappingScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createItemFieldsMappingTable(schemaName) {
        await this.dataSource.query(`
            
        CREATE TABLE IF NOT EXISTS ${schemaName}.asset_items_fields_mapping
          (
              aif_mapping_id SERIAL PRIMARY KEY,
              asset_field_id integer NOT NULL,
              asset_item_id integer NOT NULL,
              asset_field_category_id integer,
              aif_is_enabled integer DEFAULT 1,
              aif_is_mandatory integer DEFAULT 0,
              aif_is_active smallint DEFAULT 1,
              aif_is_deleted smallint DEFAULT 0,
              aif_added_by integer,
              aif_created_at timestamp without time zone DEFAULT now(),
              aif_updated_at timestamp without time zone DEFAULT now(),
              aif_description text COLLATE pg_catalog."default",
              default_value character varying(50) COLLATE pg_catalog."default",
              is_individual integer,
              aif_sequence integer DEFAULT 0
          )
        `);
    }
    async insertItemFieldMappings(schemaName, mappings) {
        const sequenceByItemCategory = new Map();
        for (const mapping of mappings) {
            const isIndividual = mapping.isIndividual ?? 0;
            const [item] = await this.dataSource.query(`SELECT asset_item_id
       FROM ${schemaName}.asset_items
       WHERE asset_item_name = $1`, [mapping.itemName]);
            if (!item)
                continue;
            const [field] = await this.dataSource.query(`SELECT asset_field_id, asset_field_category_id
       FROM ${schemaName}.asset_fields
       WHERE asset_field_name = $1`, [mapping.fieldName]);
            if (!field)
                continue;
            const seqKey = `${item.asset_item_id}:${field.asset_field_category_id ?? 'none'}`;
            const nextSequence = (sequenceByItemCategory.get(seqKey) ?? 0) + 1;
            sequenceByItemCategory.set(seqKey, nextSequence);
            await this.dataSource.query(`INSERT INTO ${schemaName}.asset_items_fields_mapping
       (asset_item_id, asset_field_id, asset_field_category_id, is_individual, aif_sequence)
       VALUES ($1, $2, $3, $4, $5)`, [
                item.asset_item_id,
                field.asset_field_id,
                field.asset_field_category_id,
                isIndividual,
                nextSequence
            ]);
        }
    }
};
exports.ItemFieldsMappingScript = ItemFieldsMappingScript;
exports.ItemFieldsMappingScript = ItemFieldsMappingScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ItemFieldsMappingScript);
