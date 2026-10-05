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
exports.PolicyAckScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PolicyAckScript = class PolicyAckScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createPolicyAckTable(schemaName) {
        await this.dataSource.query(`
CREATE TABLE IF NOT EXISTS  ${schemaName}.policy_acknowledgement
(
    ak_id SERIAL PRIMARY KEY,
    policy_id bigint NOT NULL,
    policy_version_id bigint NOT NULL,
    applicable_type  ${schemaName}.assign_type_enum,
    applicable_to_id bigint NOT NULL,
    is_acknowledged boolean NOT NULL DEFAULT false,
    is_seen boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by integer,
    updated_by integer,
    is_forced_ack boolean
)


        `);
    }
};
exports.PolicyAckScript = PolicyAckScript;
exports.PolicyAckScript = PolicyAckScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PolicyAckScript);
