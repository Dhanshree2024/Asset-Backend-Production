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
exports.PolicyVersionScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PolicyVersionScript = class PolicyVersionScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createPolicyVersionTable(schemaName) {
        await this.dataSource.query(`
CREATE TABLE IF NOT EXISTS  ${schemaName}.policy_version
(
    policy_version_id SERIAL PRIMARY KEY,
    policy_id bigint NOT NULL,
    version smallint NOT NULL,
    is_current boolean NOT NULL DEFAULT false,
    is_archived boolean NOT NULL DEFAULT false,
    status character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'draft'::character varying,
    released_date date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by integer,
    updated_by integer,
    policy_content text COLLATE pg_catalog."default",
    policy_document text COLLATE pg_catalog."default",
    CONSTRAINT policy_version_policy_id_version_key UNIQUE (policy_id, version)
)

        `);
    }
};
exports.PolicyVersionScript = PolicyVersionScript;
exports.PolicyVersionScript = PolicyVersionScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PolicyVersionScript);
