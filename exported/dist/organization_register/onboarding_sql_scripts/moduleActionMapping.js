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
exports.ModuleSubmoduleActionsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ModuleSubmoduleActionsScript = class ModuleSubmoduleActionsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createModuleSubmoduleActionsTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.module_submodule_actions (
        id BIGSERIAL PRIMARY KEY,
        module_id BIGINT NOT NULL,
        submodule_id BIGINT,
        action_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),

        CONSTRAINT uq_msa UNIQUE (module_id, submodule_id, action_id),

        CONSTRAINT fk_msa_module FOREIGN KEY (module_id)
          REFERENCES ${schemaName}.modules (id)
          ON DELETE CASCADE,

        CONSTRAINT fk_msa_submodule FOREIGN KEY (submodule_id)
          REFERENCES ${schemaName}.submodules (id)
          ON DELETE CASCADE,

        CONSTRAINT fk_msa_action FOREIGN KEY (action_id)
          REFERENCES ${schemaName}.actions (id)
          ON DELETE CASCADE
      );
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_module
      ON ${schemaName}.module_submodule_actions (module_id);
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_submodule
      ON ${schemaName}.module_submodule_actions (submodule_id);
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_action
      ON ${schemaName}.module_submodule_actions (action_id);
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_full_lookup
      ON ${schemaName}.module_submodule_actions (module_id, submodule_id, action_id);
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_module_submodule
      ON ${schemaName}.module_submodule_actions (module_id, submodule_id);
    `);
        await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_msa_module_level
      ON ${schemaName}.module_submodule_actions (module_id, action_id)
      WHERE submodule_id IS NULL;
    `);
    }
    async insertModuleSubmoduleActions(schemaName) {
        await this.dataSource.query(`
  INSERT INTO ${schemaName}.module_submodule_actions
    (module_id, submodule_id, action_id)
  VALUES
    (1,1,2),

    (2,2,1),(2,2,2),(2,2,3),(2,2,5),(2,2,6),

    (3,3,7),(3,3,2),
    (3,5,2),(3,5,1),(3,5,6),
    (3,6,2),(3,6,3),(3,6,6),
    (3,7,2),(3,7,3),(3,7,6),
    (3,8,2),(3,8,3),(3,8,6),
    (3,45,1),(3,45,2),(3,45,6),
    (3,46,1),(3,46,2),(3,46,6),
    (3,47,1),(3,47,2),(3,47,6),

    (4,9,2),(4,9,3),
    (4,10,2),
    (4,11,2),
    (4,12,2),
    (4,80,2),
    (4,81,2),
    
    (5,13,2),(5,13,3),
    (5,14,1),(5,14,2),(5,14,3),(5,14,4),(5,14,5),(5,14,8),(5,14,6),
    (5,15,1),(5,15,2),(5,15,3),(5,15,4),(5,15,8),
    (5,16,1),(5,16,2),(5,16,3),(5,16,4),(5,16,8),
    (5,17,2),
    (5,18,2),(5,18,3),
    (5,19,1),(5,19,2),(5,19,3),(5,19,4),
    (5,20,1),(5,20,2),(5,20,3),(5,20,4),(5,20,5),(5,20,8),(5,20,6),
    (5,21,1),(5,21,2),(5,21,3),(5,21,4),(5,21,5),(5,21,8),(5,21,6),
    (5,22,1),(5,22,2),(5,22,3),(5,22,4),(5,22,5),(5,22,8),(5,22,6),
    (5,23,1),(5,23,2),(5,23,3),(5,23,4),(5,23,5),(5,23,8),(5,23,6),
    (5,24,1),(5,24,2),(5,24,3),(5,24,4),(5,24,5),(5,24,8),(5,24,6),

    (6,25,1),(6,25,2),(6,25,3),(6,25,4),(6,25,8),
    (6,26,1),(6,26,2),(6,26,3),(6,26,4),(6,26,8),

    (7,27,2),(7,27,3),(7,27,4),(7,27,8),
    (7,28,1),(7,28,2),(7,28,3),(7,28,4),(7,28,8),
   (7,29,2),(7,29,3),(7,29,4),(7,29,8),

    (8,30,2),(8,30,3),
    (8,31,2),(8,31,3),

    (9,32,2),

    (10,33,9),
    (10,34,9),

    (11,35,2),
    (11,36,2),
    (11,37,2),
    (11,38,1),(11,38,2),
    (11,39,1),(11,39,2),
    (11,40,1),(11,40,2),(11,40,3),

    (12,41,3),
    (12,42,2), (12,42,3),
   (12,43,3),
   (12,44,3),
   (13,48,2), (13,48,6),
    (13,49,2), (13,49,6),
(14,50,2), (14,50,6),
(14,51,2), (14,51,6),
(14,52,2), (14,52,6),

(15,53,2), (15,53,6),
(15,54,2), (15,54,6),
(15,55,2), (15,55,6),
(15,56,2), (15,56,6),
(15,57,2), (15,57,6),
(15,68,2), (15,68,6),

(16,58,2), (16,58,6),
(16,59,2), (16,59,6),
(16,60,2), (16,60,6),

(17,61,2), (17,61,6),
(17,62,2), (17,62,6),
(17,63,2), (17,63,6),

(18,64,2), (18,64,3), (18,64,6),

(18,65,2), (18,65,3),
(18,66,2),
(18,67,2), (18,67,5),

(19,68,2),


(19,69,1), (19,69,2),(19,69,3),(19,69,4),
(19,70,2),

-- Agent Discovery Phase 2 pages
(18,71,1), (18,71,2), (18,71,3), (18,71,4),
(18,72,1), (18,72,2), (18,72,3),
(18,73,2), (18,73,6),
(18,74,2), (18,74,3),
(18,75,2), (18,75,3),
(5,76,1), (5,76,2),(5,76,3),(5,76,4),

-- Agent Discovery Phase 3 pages
(18,77,1), (18,77,2), (18,77,3), (18,77,4),
(18,78,1), (18,78,2), (18,78,3),
(18,79,1), (18,79,2), (18,79,3), (18,79,4)


`);
    }
};
exports.ModuleSubmoduleActionsScript = ModuleSubmoduleActionsScript;
exports.ModuleSubmoduleActionsScript = ModuleSubmoduleActionsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ModuleSubmoduleActionsScript);
