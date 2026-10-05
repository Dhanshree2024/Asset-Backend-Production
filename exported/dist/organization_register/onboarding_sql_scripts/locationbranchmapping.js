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
exports.locationBranchMappingScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let locationBranchMappingScript = class locationBranchMappingScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createLocationBranchMappingScriptTable(schemaName) {
        await this.dataSource.query(`

CREATE TABLE IF NOT EXISTS ${schemaName}.location_branch_mapping
(
    location_mapping_id SERIAL PRIMARY KEY,
    location_id integer NOT NULL,
    branch_id integer NOT NULL,
    type_id integer,
    is_active smallint NOT NULL DEFAULT 1,
    is_deleted smallint NOT NULL DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    updated_by integer,
    location_mapping_id_bigint bigint,
        is_favourite boolean NOT NULL DEFAULT false

    
)

    `);
    }
};
exports.locationBranchMappingScript = locationBranchMappingScript;
exports.locationBranchMappingScript = locationBranchMappingScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], locationBranchMappingScript);
