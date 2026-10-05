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
exports.SoftwareSubscriptionScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SoftwareSubscriptionScript = class SoftwareSubscriptionScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createSoftwareSubscriptionTable(schemaName) {
        await this.dataSource.query(`

             
CREATE TABLE IF NOT EXISTS ${schemaName}.asset_software_subscription
(
    asset_stocks_unique_id bigint NOT NULL,
     asset_id bigint,
          stock_id integer,
          asset_item_id integer,
          next_renewal_date date,
          subscription_type character varying COLLATE pg_catalog."default",
          billing_frequency character varying(20) COLLATE pg_catalog."default",
          procurement_id bigint,
          warranty_category ${schemaName}.warranty_type_enum[],
          sub_start_date date
    
)

        `);
    }
};
exports.SoftwareSubscriptionScript = SoftwareSubscriptionScript;
exports.SoftwareSubscriptionScript = SoftwareSubscriptionScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SoftwareSubscriptionScript);
