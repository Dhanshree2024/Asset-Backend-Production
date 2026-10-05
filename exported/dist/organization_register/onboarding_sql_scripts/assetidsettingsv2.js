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
exports.assetIdSettingsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetIdSettingsScript = class assetIdSettingsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetIdSettingsV2Table(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_id_settings_v2
        (
            id SERIAL PRIMARY KEY,
            prefix character varying(25) COLLATE pg_catalog."default" DEFAULT 'ASSET'::character varying,
    suffix character varying(25) COLLATE pg_catalog."default" DEFAULT ''::character varying,
    starting_number integer DEFAULT 1,
    next_number integer DEFAULT 1,
    sequence_length integer DEFAULT 6,
    separator text COLLATE pg_catalog."default" NOT NULL DEFAULT '-'::text,
    reset_sequence text COLLATE pg_catalog."default" DEFAULT 'never'::text,
    include_year boolean DEFAULT false,
    include_date boolean DEFAULT false,
    date_format text COLLATE pg_catalog."default" DEFAULT 'DDMMYY'::text,
    include_branch boolean DEFAULT false,
    branch_source text COLLATE pg_catalog."default" DEFAULT 'CODE'::text,
    branch_length integer,
    include_department boolean DEFAULT false,
    department_source text COLLATE pg_catalog."default" DEFAULT 'CODE'::text,
    department_length integer,
    include_category boolean DEFAULT false,
    category_source text COLLATE pg_catalog."default" DEFAULT 'CODE'::text,
    category_length integer,
    include_sub_category boolean DEFAULT false,
    sub_category_source text COLLATE pg_catalog."default" DEFAULT 'CODE'::text,
    sub_category_length integer,
    include_item boolean DEFAULT false,
    item_source text COLLATE pg_catalog."default" DEFAULT 'CODE'::text,
    item_length integer,
    scope text COLLATE pg_catalog."default" DEFAULT 'Global'::text,
    word_case text COLLATE pg_catalog."default" DEFAULT 'upper'::text,
    max_length integer DEFAULT 25,
    user_input boolean DEFAULT false,
    applied_template_id integer,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    qr_code_settings json,
    is_current boolean DEFAULT true,
    org_id integer,
    label character varying(30) COLLATE pg_catalog."default",
    is_default boolean DEFAULT true,
    is_barcode_enable boolean DEFAULT false,
    is_qrcode_enable boolean DEFAULT false,
           
            CONSTRAINT created_by FOREIGN KEY (created_by)
                REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID,
            CONSTRAINT updated_by FOREIGN KEY (updated_by)
                REFERENCES ${schemaName}.users (user_id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID,
            CONSTRAINT asset_id_settings_v2_branch_source_check CHECK (branch_source = ANY (ARRAY['CODE'::text, 'NAME'::text])),
            CONSTRAINT asset_id_settings_v2_category_source_check CHECK (category_source = ANY (ARRAY['CODE'::text, 'NAME'::text])),
            CONSTRAINT asset_id_settings_v2_date_format_check CHECK (date_format = ANY (ARRAY['DDMMYY'::text, 'YYYYMMDD'::text, 'YYMM'::text, 'YYYY'::text, 'YY'::text, 'None'::text])),
            CONSTRAINT asset_id_settings_v2_department_source_check CHECK (department_source = ANY (ARRAY['CODE'::text, 'NAME'::text])),
            CONSTRAINT asset_id_settings_v2_item_source_check CHECK (item_source = ANY (ARRAY['CODE'::text, 'NAME'::text])),
            CONSTRAINT asset_id_settings_v2_reset_sequence_check CHECK (reset_sequence = ANY (ARRAY['never'::text, 'yearly'::text, 'monthly'::text])),
            CONSTRAINT asset_id_settings_v2_scope_check CHECK (scope = ANY (ARRAY['Global'::text, 'Branch'::text, 'Department'::text])),
            CONSTRAINT asset_id_settings_v2_sub_category_source_check CHECK (sub_category_source = ANY (ARRAY['CODE'::text, 'NAME'::text])),
            CONSTRAINT asset_id_settings_v2_word_case_check CHECK (word_case = ANY (ARRAY['upper'::text, 'lower'::text, 'mixed'::text]))
        );
    `);
        const countResult = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${schemaName}.asset_id_settings_v2`);
        const count = parseInt(countResult[0].count, 10);
        if (count === 0) {
            const templates = [
                {
                    label: 'System Default Template',
                    prefix: 'AST',
                    starting_number: 1,
                    next_number: 1,
                    sequence_length: 3,
                    separator: '-',
                    reset_sequence: 'never',
                    include_year: false,
                    include_date: false,
                    date_format: 'DDMMYY',
                    include_branch: false,
                    branch_source: 'NAME',
                    include_department: false,
                    department_source: 'NAME',
                    include_category: false,
                    category_source: 'NAME',
                    include_sub_category: false,
                    sub_category_source: 'NAME',
                    include_item: false,
                    item_source: 'NAME',
                    scope: 'Global',
                    word_case: 'upper',
                    max_length: 14,
                    created_by: 1,
                    updated_by: 1,
                    is_current: true,
                    is_barcore_enable: false,
                    is_qrcode_enable: false,
                },
                {
                    label: 'Year',
                    prefix: 'AST',
                    starting_number: 1,
                    next_number: 1,
                    sequence_length: 3,
                    separator: '-',
                    reset_sequence: 'never',
                    include_year: true,
                    include_date: false,
                    date_format: 'YYYY',
                    include_branch: false,
                    branch_source: 'NAME',
                    include_department: false,
                    department_source: 'NAME',
                    include_category: false,
                    category_source: 'NAME',
                    include_sub_category: false,
                    sub_category_source: 'NAME',
                    include_item: false,
                    item_source: 'NAME',
                    scope: 'Global',
                    word_case: 'upper',
                    max_length: 25,
                    created_by: 1,
                    updated_by: 1,
                    is_current: false,
                    is_barcore_enable: false,
                    is_qrcode_enable: false,
                },
                {
                    label: 'Item',
                    prefix: '',
                    starting_number: 1,
                    next_number: 1,
                    sequence_length: 3,
                    separator: '-',
                    reset_sequence: 'never',
                    include_year: false,
                    include_date: false,
                    date_format: 'DDMMYY',
                    include_branch: false,
                    branch_source: 'NAME',
                    include_department: false,
                    department_source: 'NAME',
                    include_category: false,
                    category_source: 'NAME',
                    include_sub_category: false,
                    sub_category_source: 'NAME',
                    include_item: true,
                    item_source: 'NAME',
                    scope: 'Global',
                    word_case: 'upper',
                    max_length: 25,
                    created_by: 1,
                    updated_by: 1,
                    is_current: false,
                    is_barcore_enable: false,
                    is_qrcode_enable: false,
                },
            ];
            await this.insertAssetIdSettings(schemaName, templates);
        }
    }
    async insertAssetIdSettings(schemaName, settings) {
        const insertQuery = `
      INSERT INTO ${schemaName}.asset_id_settings_v2
      (
        label, prefix, suffix, starting_number, next_number, sequence_length,
        separator, reset_sequence, include_year, include_date, date_format,
        include_branch, branch_source, include_department, department_source,
        include_category, category_source, include_sub_category, sub_category_source,
        include_item, item_source, scope, word_case, max_length,
        created_by, updated_by, is_current
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,
        $12,$13,$14,$15,
        $16,$17,$18,$19,
        $20,$21,$22,$23,$24,
        $25,$26,$27
      );
    `;
        for (const s of settings) {
            await this.dataSource.query(insertQuery, [
                s.label,
                s.prefix,
                s.suffix || '',
                s.starting_number,
                s.next_number,
                s.sequence_length,
                s.separator,
                s.reset_sequence,
                s.include_year,
                s.include_date,
                s.date_format,
                s.include_branch,
                s.branch_source,
                s.include_department,
                s.department_source,
                s.include_category,
                s.category_source,
                s.include_sub_category,
                s.sub_category_source,
                s.include_item,
                s.item_source,
                s.scope,
                s.word_case,
                s.max_length,
                s.created_by,
                s.updated_by,
                s.is_current,
            ]);
        }
    }
};
exports.assetIdSettingsScript = assetIdSettingsScript;
exports.assetIdSettingsScript = assetIdSettingsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetIdSettingsScript);
