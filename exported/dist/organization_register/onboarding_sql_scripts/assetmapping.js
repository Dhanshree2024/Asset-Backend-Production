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
exports.AssetMappingRelations = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AssetMappingRelations = class AssetMappingRelations {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetMappingRelationsTable(schemaName) {
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS ${schemaName}.asset_mapping
            (
                mapping_id BIGSERIAL PRIMARY KEY,
                asset_id bigint,
                status_type_id integer,
                description text COLLATE pg_catalog."default",
                assigned_by integer,
                returned_by integer,
                created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                is_active smallint NOT NULL DEFAULT 1,
                is_deleted smallint NOT NULL DEFAULT 0,
                asset_working_condition_id integer,
                asset_stocks_unique_id bigint,
                target_id bigint,
                assigned_from_date date,
                assigned_to_date date,
                target_type ${schemaName}.assign_type_enum,
                relation_type character varying(50),
                governance_id integer,
                source character varying(30) DEFAULT 'manual',
                last_seen_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                metadata jsonb,
                is_inherited smallint NOT NULL DEFAULT 0,
                inherited_via_relationship_id bigint
            );

            -- Self-healing alterations for existing schemas
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS relation_type VARCHAR(50);
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS governance_id INTEGER;
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS source VARCHAR(30) DEFAULT 'manual';
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS metadata JSONB;
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS is_inherited smallint NOT NULL DEFAULT 0;
            ALTER TABLE ${schemaName}.asset_mapping ADD COLUMN IF NOT EXISTS inherited_via_relationship_id bigint;
            ALTER TABLE ${schemaName}.asset_mapping ALTER COLUMN assigned_by DROP NOT NULL;

            -- Concurrency partial unique index for active pairs
            CREATE UNIQUE INDEX IF NOT EXISTS uq_active_mapping_pair 
            ON ${schemaName}.asset_mapping (asset_stocks_unique_id, target_type, target_id, relation_type) 
            WHERE is_active = 1 AND is_deleted = 0;
        `);
    }
};
exports.AssetMappingRelations = AssetMappingRelations;
exports.AssetMappingRelations = AssetMappingRelations = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssetMappingRelations);
