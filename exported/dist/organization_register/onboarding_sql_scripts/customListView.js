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
exports.CustomViewsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CustomViewsScript = class CustomViewsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createCustomViewsTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.custom_views
          (
              custom_view_id SERIAL PRIMARY KEY,
              user_id bigint NOT NULL,
              view_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
              config jsonb NOT NULL,
              created_at timestamp without time zone DEFAULT now(),
              updated_at timestamp without time zone DEFAULT now(),
              organization_id integer,
              is_active boolean DEFAULT true,
              is_deleted boolean DEFAULT false
              
          )
    `);
    }
};
exports.CustomViewsScript = CustomViewsScript;
exports.CustomViewsScript = CustomViewsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CustomViewsScript);
