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
exports.assetAssetAssignmentEventsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let assetAssetAssignmentEventsScript = class assetAssetAssignmentEventsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createAssetAssignmentEventsScriptTable(schemaName) {
        await this.dataSource.query(`

        CREATE TABLE IF NOT EXISTS ${schemaName}.asset_assignment_events
            (
                event_id BIGSERIAL,
                asset_stocks_unique_id BIGINT NOT NULL,
                mapping_id BIGINT,
                performed_by INTEGER,
                notes TEXT,
                performed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
                working_condition_id INTEGER,
                target_type ${schemaName}.assign_type_enum,
                target_id BIGINT,
                PRIMARY KEY (event_id, performed_at)
            )
            PARTITION BY RANGE (performed_at);

    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.asset_assignment_events_default
      PARTITION OF ${schemaName}.asset_assignment_events
      DEFAULT;
    `);
    }
};
exports.assetAssetAssignmentEventsScript = assetAssetAssignmentEventsScript;
exports.assetAssetAssignmentEventsScript = assetAssetAssignmentEventsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], assetAssetAssignmentEventsScript);
