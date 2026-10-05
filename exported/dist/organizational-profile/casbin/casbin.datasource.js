"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.casbinDataSource = void 0;
const typeorm_1 = require("typeorm");
const casbin_rule_entity_1 = require("../entity/policy-builder/casbin-rule.entity");
exports.casbinDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Admin@123',
    database: process.env.DB_NAME || 'cbs_authentication',
    entities: [casbin_rule_entity_1.CasbinRule],
    synchronize: false,
});
