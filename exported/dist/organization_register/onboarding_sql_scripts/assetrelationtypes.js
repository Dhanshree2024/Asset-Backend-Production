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
exports.AssetRelationTypesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetRelationTypesScript = class AssetRelationTypesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetRelationTypesTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_relation_type_table (
          code character varying(50) COLLATE pg_catalog."default" PRIMARY KEY,
          forward_label character varying(100) COLLATE pg_catalog."default" NOT NULL,
          reverse_label character varying(100) COLLATE pg_catalog."default" NOT NULL,
          cardinality ${schemaName}.asset_relation_cardinality_enum NOT NULL DEFAULT 'N:1'::${schemaName}.asset_relation_cardinality_enum,
          is_cycle_allowed boolean NOT NULL DEFAULT false,
          is_active boolean NOT NULL DEFAULT true,
          created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          target_type ${schemaName}.assign_type_enum NOT NULL,
          category ${schemaName}.asset_relation_category_enum NOT NULL
      );
    `);
    }
    async insertAssetRelationTypes(schemaName, relationTypes) {
        const insertQuery = `
      INSERT INTO ${schemaName}.asset_relation_type_table 
      (code, forward_label, reverse_label, cardinality, is_cycle_allowed, is_active, target_type, category)
      VALUES ($1, $2, $3, $4::${schemaName}.asset_relation_cardinality_enum, $5, $6, $7::${schemaName}.assign_type_enum, $8::${schemaName}.asset_relation_category_enum)
      ON CONFLICT (code) DO NOTHING;
    `;
        for (const item of relationTypes) {
            await this.dataSource.query(insertQuery, [
                item.code,
                item.forward_label,
                item.reverse_label,
                item.cardinality,
                item.is_cycle_allowed,
                item.is_active,
                item.target_type,
                item.category,
            ]);
        }
    }
};
exports.AssetRelationTypesScript = AssetRelationTypesScript;
exports.AssetRelationTypesScript = AssetRelationTypesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetRelationTypesScript);
