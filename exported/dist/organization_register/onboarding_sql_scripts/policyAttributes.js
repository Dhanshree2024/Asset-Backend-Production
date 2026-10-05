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
exports.PolicyAttributesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PolicyAttributesScript = class PolicyAttributesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createPolicyAttributesTable(schemaName) {
        await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.policy_attributes (
      id BIGSERIAL PRIMARY KEY,

      special_permission_master_id BIGINT NOT NULL,
      role_id BIGINT NOT NULL,

      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),

      CONSTRAINT fk_pa_role
        FOREIGN KEY (role_id)
        REFERENCES ${schemaName}.organization_roles (role_id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,

      CONSTRAINT fk_pa_special_permission
        FOREIGN KEY (special_permission_master_id)
        REFERENCES ${schemaName}.special_permissions_master (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,

      CONSTRAINT uq_pa UNIQUE (role_id, special_permission_master_id)
    );
  `);
    }
    async insertDefaultPolicyAttributes(schemaName) {
        await this.dataSource.query(`
    INSERT INTO ${schemaName}.policy_attributes
      (special_permission_master_id, role_id)
    VALUES
      -- ROLE 1
      (2,1),(4,1),(5,1),(6,1),(7,1),
      (8,1),(9,1),(10,1),(11,1),(12,1),
      (13,1),(14,1),(15,1),(16,1),(17,1),
      (18,1),(19,1),(20,1),(21,1),
      (22,1),(23,1),(24,1),(25,1),(26,1),(27,1),

      -- ROLE 2
      (1,2),(2,2),(4,2),(5,2),(6,2),
      (7,2),(8,2),(9,2),(10,2),(11,2),
      (12,2),(13,2),(14,2),(15,2),(16,2), 
      (17,2),(18,2),(19,2),(20,2),
      (21,2),
      (22,2),(23,2),(24,2),(25,2),(26,2),
     

      -- ROLE 3 
      (1,3),(2,3),(4,3),(5,3),(18,3),(9,3),(10,3),(11,3),(16,3),
      (21,3),
      (22,3),(23,3),(24,3),(25,3),(26,3),

      -- USER
      (3,4)

    ON CONFLICT (role_id, special_permission_master_id) DO NOTHING;
  `);
    }
};
exports.PolicyAttributesScript = PolicyAttributesScript;
exports.PolicyAttributesScript = PolicyAttributesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PolicyAttributesScript);
