"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_2 = require("typeorm");
let UserScript = class UserScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createUserTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.users
          (
              user_id SERIAL PRIMARY KEY,
               first_name character varying(255) COLLATE pg_catalog."default",
    middle_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    date_of_birth date,
    gender character(1) COLLATE pg_catalog."default",
    blood_group character varying(5) COLLATE pg_catalog."default",
    users_business_email character varying(255) COLLATE pg_catalog."default",
    phone_number character varying(50) COLLATE pg_catalog."default",
    street text COLLATE pg_catalog."default",
    landmark text COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    zip character varying(20) COLLATE pg_catalog."default",
    country character varying(100) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    is_primary_user character(1) COLLATE pg_catalog."default" DEFAULT 'N'::bpchar,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    organization_id integer,
    register_user_login_id integer,
    user_alternative_contact_number character varying(50) COLLATE pg_catalog."default",
    role_id integer,
    department_id integer,
    designation_id integer,
    profile_image text COLLATE pg_catalog."default",
    created_by integer,
    last_login timestamp without time zone,
    is_active smallint DEFAULT 1,
    is_deleted smallint DEFAULT 0,
    is_department_head integer DEFAULT 0,
    branches integer[],
    favorites_sidebar_menu text[] COLLATE pg_catalog."default",
    emp_id text COLLATE pg_catalog."default",
    branch_id integer,
    location_id integer,
    branch_access integer[],
    sidebarprefs jsonb,
    theme_preferences jsonb DEFAULT '{}'::jsonb,
      CONSTRAINT users_business_email_key UNIQUE (users_business_email)
          )
              
        `);
    }
    async insertUserTable(schemaName, user) {
        const userInsertQuery = `
        INSERT INTO ${schemaName}.users
        (first_name, last_name, users_business_email, phone_number, password, organization_id, register_user_login_id, is_primary_user,role_id,sidebarprefs)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10);`;
        await this.dataSource.query(userInsertQuery, [
            user.first_name,
            user.last_name,
            user.business_email,
            user.phone_number,
            user.password,
            user.organization.organization_id,
            user.user_id,
            'Y',
            user.role_id,
            {
                item: false,
                subCategory: false,
                mainCategory: true,
            },
        ]);
        return true;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
};
exports.UserScript = UserScript;
exports.UserScript = UserScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], UserScript);
