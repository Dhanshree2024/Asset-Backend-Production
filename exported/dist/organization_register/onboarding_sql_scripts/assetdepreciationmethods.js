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
exports.assetDepreciationMethodsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetDepreciationMethodsScript = class assetDepreciationMethodsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createassetDepreciationMethodsScriptTable(schemaName) {
        await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS ${schemaName}.asset_depreciation_methods
                        (
                            depreciation_method_id SERIAL PRIMARY KEY,
                            dep_method_name character varying(255) COLLATE pg_catalog."default",
                            created_at timestamp without time zone DEFAULT now(),
                            updated_at timestamp without time zone DEFAULT now(),
                            created_by integer,
                            updated_by integer,
                            
                            CONSTRAINT asset_depreciation_methods_created_by_fkey FOREIGN KEY (created_by)
                                REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                                ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
                            CONSTRAINT asset_depreciation_methods_updated_by_fkey FOREIGN KEY (updated_by)
                                REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                                ON UPDATE NO ACTION
                                ON DELETE NO ACTION
                        )
        `);
    }
    async insertDepreciationMethods(schemaName, methods) {
        const query = `
            INSERT INTO ${schemaName}.asset_depreciation_methods (dep_method_name)
            VALUES ($1)
            ON CONFLICT DO NOTHING;
        `;
        for (const m of methods) {
            await this.dataSource.query(query, [m.dep_method_name]);
        }
    }
};
exports.assetDepreciationMethodsScript = assetDepreciationMethodsScript;
exports.assetDepreciationMethodsScript = assetDepreciationMethodsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetDepreciationMethodsScript);
