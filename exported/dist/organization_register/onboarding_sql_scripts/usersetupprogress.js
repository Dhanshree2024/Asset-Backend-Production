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
exports.UserSetupProgressScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UserSetupProgressScript = class UserSetupProgressScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createUserSetupProgressTable(schemaName) {
        await this.dataSource.query(`
      CREATE SEQUENCE IF NOT EXISTS ${schemaName}.user_setup_progress_id_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;

      CREATE TABLE IF NOT EXISTS ${schemaName}.user_setup_progress
      (
          id BIGINT NOT NULL DEFAULT nextval('${schemaName}.user_setup_progress_id_seq'::regclass),
          organization_id BIGINT NOT NULL,
          user_id BIGINT NOT NULL,
          task_id BIGINT NOT NULL,
          status ${schemaName}.setup_task_status DEFAULT 'PENDING'::${schemaName}.setup_task_status,
          completed_at TIMESTAMP WITHOUT TIME ZONE,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
          CONSTRAINT user_setup_progress_pkey PRIMARY KEY (id),
          CONSTRAINT uniq_user_task UNIQUE (user_id, task_id)
      );

      CREATE OR REPLACE TRIGGER trg_update_org_progress
      AFTER INSERT OR UPDATE
      ON ${schemaName}.user_setup_progress
      FOR EACH ROW
      WHEN (NEW.status = 'COMPLETED'::${schemaName}.setup_task_status)
      EXECUTE FUNCTION ${schemaName}.update_organization_progress();
    `);
    }
};
exports.UserSetupProgressScript = UserSetupProgressScript;
exports.UserSetupProgressScript = UserSetupProgressScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], UserSetupProgressScript);
