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
exports.OrganizationSetupProgressScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OrganizationSetupProgressScript = class OrganizationSetupProgressScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrganizationSetupProgressTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.organization_setup_progress
      (
          id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY
          (
              INCREMENT 1
              START 1
              MINVALUE 1
              MAXVALUE 9223372036854775807
              CACHE 1
          ),
          organization_id BIGINT NOT NULL,
          task_id BIGINT NOT NULL,
          status ${schemaName}.setup_task_status DEFAULT 'PENDING'::${schemaName}.setup_task_status,
          completed_by BIGINT,
          completed_at TIMESTAMP WITHOUT TIME ZONE,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
          CONSTRAINT organization_setup_progress_pkey PRIMARY KEY (id),
          CONSTRAINT organization_setup_progress_organization_id_task_id_key UNIQUE (organization_id, task_id)
      );

      CREATE INDEX IF NOT EXISTS idx_org_progress_org
      ON ${schemaName}.organization_setup_progress USING btree
      (organization_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_org_setup_progress_org
      ON ${schemaName}.organization_setup_progress USING btree
      (organization_id ASC NULLS LAST);

      CREATE INDEX IF NOT EXISTS idx_org_setup_progress_task
      ON ${schemaName}.organization_setup_progress USING btree
      (task_id ASC NULLS LAST);
    `);
    }
};
exports.OrganizationSetupProgressScript = OrganizationSetupProgressScript;
exports.OrganizationSetupProgressScript = OrganizationSetupProgressScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationSetupProgressScript);
