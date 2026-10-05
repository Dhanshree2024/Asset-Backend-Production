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
exports.LocationTransfersTableService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let LocationTransfersTableService = class LocationTransfersTableService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createLocationTransfersTable(schemaName) {
        await this.dataSource.query(`
    
      CREATE TABLE IF NOT EXISTS ${schemaName}.location_transfers
              (
                location_transfer_id SERIAL,
            from_location_id integer,
    to_location_id integer,
    transfer_status integer,
    requested_by integer,
    requested_at timestamp without time zone DEFAULT now(),
    completed_by integer,
    completed_at timestamp without time zone DEFAULT now(),
    is_active smallint DEFAULT 1,
    is_deleted smallint DEFAULT 0,
    asset_stocks_unique_id bigint,
    reason_for_transfer text COLLATE pg_catalog."default",
    comment_for_location_transfer text COLLATE pg_catalog."default",
    location_transfer_ticket text COLLATE pg_catalog."default",
    approved_by integer,
    approved_at timestamp without time zone DEFAULT now(),
       PRIMARY KEY (location_transfer_id, requested_at)
              )
             PARTITION BY RANGE (requested_at);

    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.location_transfers_default
      PARTITION OF ${schemaName}.location_transfers
      DEFAULT;
    `);
    }
};
exports.LocationTransfersTableService = LocationTransfersTableService;
exports.LocationTransfersTableService = LocationTransfersTableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], LocationTransfersTableService);
