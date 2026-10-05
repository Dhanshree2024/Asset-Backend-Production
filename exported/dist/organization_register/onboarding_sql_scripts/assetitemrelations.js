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
exports.AssetItemRelationScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetItemRelationScript = class AssetItemRelationScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetItemRelationTable(schemaName) {
        await this.dataSource.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE t.typname = 'relation_type' AND n.nspname = '${schemaName}'
          ) THEN
            CREATE TYPE ${schemaName}.relation_type AS ENUM ('Other', 'Accessory', 'Contract', 'Application'); -- Update values as needed
          END IF;
        END
        $$;
      `);
        await this.dataSource.query(`
              CREATE TABLE IF NOT EXISTS ${schemaName}.asset_items_relations
                      (
                          relation_id SERIAL PRIMARY KEY,
                          parent_asset_item_id integer NOT NULL,
                          child_asset_item_id integer NOT NULL,
                          is_active smallint DEFAULT 1,
                          is_deleted smallint DEFAULT 0,
                          created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at timestamp with time zone,
                          created_by integer,
                          updated_by integer,
                          relation_type ${schemaName}.relation_type,
                       
                          CONSTRAINT asset_items_relations_child_asset_item_id_fkey FOREIGN KEY (child_asset_item_id)
                              REFERENCES ${schemaName}.asset_items (asset_item_id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE NO ACTION,
                          CONSTRAINT asset_items_relations_created_by_fkey FOREIGN KEY (created_by)
                              REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE NO ACTION,
                          CONSTRAINT asset_items_relations_parent_asset_item_id_fkey FOREIGN KEY (parent_asset_item_id)
                              REFERENCES ${schemaName}.asset_items (asset_item_id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE NO ACTION,
                          CONSTRAINT asset_items_relations_updated_by_fkey FOREIGN KEY (updated_by)
                              REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE NO ACTION
                      )
      `);
    }
    async insertItemRelations(schemaName, relations) {
        for (const relation of relations) {
            const [parentItem] = await this.dataSource.query(`SELECT asset_item_id FROM ${schemaName}.asset_items WHERE asset_item_name = $1`, [relation.parentItemName]);
            if (!parentItem)
                continue;
            const [childItem] = await this.dataSource.query(`SELECT asset_item_id FROM ${schemaName}.asset_items WHERE asset_item_name = $1`, [relation.childItemName]);
            if (!childItem)
                continue;
            await this.dataSource.query(`INSERT INTO ${schemaName}.asset_items_relations 
        (parent_asset_item_id, child_asset_item_id, relation_type) 
       VALUES ($1, $2, $3)`, [
                parentItem.asset_item_id,
                childItem.asset_item_id,
                relation.relationType
            ]);
        }
    }
};
exports.AssetItemRelationScript = AssetItemRelationScript;
exports.AssetItemRelationScript = AssetItemRelationScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetItemRelationScript);
