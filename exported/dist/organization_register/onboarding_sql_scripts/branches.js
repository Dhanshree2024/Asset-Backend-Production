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
exports.BranchesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BranchesScript = class BranchesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createBranchesTable(schemaName) {
        await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS ${schemaName}.branches
                (
                    branch_id SERIAL PRIMARY KEY,
                    branch_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
                    gst_no character varying(20) COLLATE pg_catalog."default",
                    branch_street character varying(500) COLLATE pg_catalog."default",
                    city_id integer,
                    country_id integer,
                    primary_user_id integer,
                    city character varying(100) COLLATE pg_catalog."default",
                    pincode integer,
                    state character varying(100) COLLATE pg_catalog."default",
                    country character varying(100) COLLATE pg_catalog."default",
                    contact_number character varying(10) COLLATE pg_catalog."default",
                    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                    branch_landmark text COLLATE pg_catalog."default",
                    alternative_contact_number character varying(10) COLLATE pg_catalog."default",
                    branch_email text COLLATE pg_catalog."default",
                    created_by integer,
                    established_date date,
                    is_active smallint DEFAULT 1,
                    is_deleted smallint DEFAULT 0,
                    branch_code text COLLATE pg_catalog."default",
                    occupancy_type_code character varying(50) COLLATE pg_catalog."default"





                    
                    
                )
    `);
    }
};
exports.BranchesScript = BranchesScript;
exports.BranchesScript = BranchesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], BranchesScript);
