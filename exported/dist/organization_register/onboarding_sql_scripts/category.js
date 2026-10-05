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
exports.CategoryScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CategoryScript = class CategoryScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createCategoryTable(schemaName) {
        await this.dataSource.query(`
              CREATE TABLE IF NOT EXISTS ${schemaName}.asset_main_category
                (
                    main_category_id SERIAL PRIMARY KEY,
                    main_category_name text COLLATE pg_catalog."default",
                    main_category_description text COLLATE pg_catalog."default",
                    added_by integer,
                    is_active smallint NOT NULL DEFAULT 1,
                    is_deleted smallint NOT NULL DEFAULT 0,
                    created_at timestamp without time zone,
                    updated_at timestamp without time zone,
                    main_category_icon text COLLATE pg_catalog."default" DEFAULT 'box'::text,
                   
                    CONSTRAINT added_by FOREIGN KEY (added_by)
                        REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                        ON UPDATE NO ACTION
                        ON DELETE NO ACTION
                        NOT VALID
                )
        `);
    }
    async insertAssetMainCategoryTable(schemaName, categories) {
        const categoryInsertQuery = `INSERT INTO ${schemaName}.asset_main_category
        (main_category_name, main_category_icon)
        VALUES ($1, $2);`;
        for (const category of categories) {
            await this.dataSource.query(categoryInsertQuery, [category.main_category_name, category.icon]);
        }
    }
};
exports.CategoryScript = CategoryScript;
exports.CategoryScript = CategoryScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CategoryScript);
