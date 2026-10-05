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
exports.ActionsScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ActionsScript = class ActionsScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createActionTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.actions (
        id SERIAL PRIMARY KEY,
        action_name VARCHAR(50) NOT NULL,
        action_code VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        CONSTRAINT actions_action_code_key UNIQUE (action_code)
      );
    `);
    }
    async insertDefaultActions(schemaName) {
        await this.dataSource.query(`
      INSERT INTO ${schemaName}.actions (action_name, action_code, description)
      VALUES
        ('Add', 'ADD', 'Create or add new records'),
        ('View', 'VIEW', 'View or read records'),
        ('Edit', 'EDIT', 'Modify existing records'),
        ('Delete', 'DELETE', 'Remove records'),
        ('Import', 'IMPORT', 'Import data into the system'),
        ('Export', 'EXPORT', 'Export data from the system'),
        ('Allow Assign Asset', 'ASSIGN', 'Assign asset to assignee'),
        ('Enable / Disable', 'TOGGLE', 'enable / disable'),
        ('Print', 'PRINT', 'Print barcodes / QR codes')

    `);
    }
};
exports.ActionsScript = ActionsScript;
exports.ActionsScript = ActionsScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ActionsScript);
