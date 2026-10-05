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
exports.assetFieldCategoryScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetFieldCategoryScript = class assetFieldCategoryScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetFieldCategoryScriptTable(schemaName) {
        await this.dataSource.query(`
            
              CREATE TABLE IF NOT EXISTS ${schemaName}.asset_field_category
              (
                  asset_field_category_id BIGSERIAL PRIMARY KEY,
                  asset_field_category_name text COLLATE pg_catalog."default",
                  asset_field_category_description text COLLATE pg_catalog."default",
                  added_by integer,
                  is_active smallint DEFAULT 1,
                  is_deleted smallint DEFAULT 0,
                  created_at timestamp without time zone DEFAULT now(),
                  updated_at timestamp without time zone DEFAULT now()
                 
              )

        `);
    }
    async insertFieldCategoryTable(schemaName, categories) {
        const categoryInsertQuery = `INSERT INTO ${schemaName}.asset_field_category(asset_field_category_name) VALUES ($1);`;
        for (const category of categories) {
            await this.dataSource.query(categoryInsertQuery, [category.asset_field_category_name]);
        }
    }
};
exports.assetFieldCategoryScript = assetFieldCategoryScript;
exports.assetFieldCategoryScript = assetFieldCategoryScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetFieldCategoryScript);
